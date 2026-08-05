/**
 * tools/lib/browser.mjs - the shared headless-Chrome driver.
 *
 * A zero-dependency CDP client, a static file server, a Chrome launcher and a
 * memory-sized tab pool. Extracted from tools/i18n-roundtrip.mjs when
 * tools/ui-audit.mjs needed exactly the same four things; two copies of a
 * hand-rolled WebSocket frame parser is one copy too many.
 *
 * Zero npm deps by design: it shells out to the system `google-chrome` that the
 * course already needs in order to preview anything, and speaks CDP over a raw
 * socket. Set CHROME_BIN to point at a different binary.
 *
 *   const { server, port } = await startServer(0);        // ephemeral port
 *   const browser = await launchChrome("uiaudit-");        // + first page tab
 *   const tab = await openTab(browser.devPort);            // more tabs
 *   await tab.cdp.evaluate("1 + 1");
 *   await closeChrome(browser);
 */
import fs from "node:fs";
import os from "node:os";
import net from "node:net";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(__dirname, "..", "..");
const CHROME = process.env.CHROME_BIN || "google-chrome";
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// how many tabs this machine can actually afford
// ---------------------------------------------------------------------------
const TAB_MB = 1700;
export function availableMb() {
  try {
    const m = fs.readFileSync("/proc/meminfo", "utf8").match(/MemAvailable:\s+(\d+) kB/);
    if (m) return Math.floor(Number(m[1]) / 1024);
  } catch {}
  return Math.floor(os.freemem() / 1024 / 1024);
}
export function defaultJobs() {
  const cores = (os.cpus() || []).length || 4;
  const byMemory = Math.floor((availableMb() * 0.7) / TAB_MB);
  return Math.max(1, Math.min(6, Math.floor(cores / 2), byMemory));
}


// ---------------------------------------------------------------------------
// static file server, rooted at the repo (HTTP is mandatory - the WASM runtime
// and every fetch the lessons make are blocked on file://)
// ---------------------------------------------------------------------------
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".css": "text/css", ".svg": "image/svg+xml",
  ".wasm": "application/wasm", ".png": "image/png", ".woff2": "font/woff2",
  ".map": "application/json", ".dat": "application/octet-stream",
};
export function startServer(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let rel = decodeURIComponent(req.url.split("?")[0]);
      if (rel.endsWith("/")) rel += "index.html";
      const file = path.join(root, path.normalize(rel));
      if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404); return res.end(); }
        // Content-Length is not optional here. Writing the head without it makes
        // node fall back to chunked encoding, and the Blazor loader needs a
        // declared length - without it the WASM boot cancels its own
        // blazor.boot.json request and the compiler never starts, which reads as
        // a hung page rather than a broken server.
        res.writeHead(200, {
          "content-type": MIME[path.extname(file)] || "application/octet-stream",
          "content-length": buf.length,
        });
        res.end(buf);
      });
    });
    server.listen(port, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

// ---------------------------------------------------------------------------
// minimal CDP client over a built-in WebSocket (no deps, no global WebSocket)
// ---------------------------------------------------------------------------
export class Cdp {
  constructor() { this.sock = null; this.buf = Buffer.alloc(0); this.id = 0; this.pending = new Map(); this.events = new Map(); this.frag = []; }

  connect(wsUrl) {
    const u = new URL(wsUrl);
    return new Promise((resolve, reject) => {
      const sock = net.connect(Number(u.port), u.hostname, () => {
        const key = crypto.randomBytes(16).toString("base64");
        sock.write(
          `GET ${u.pathname}${u.search} HTTP/1.1\r\nHost: ${u.hostname}:${u.port}\r\n` +
          `Upgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${key}\r\n` +
          `Sec-WebSocket-Version: 13\r\n\r\n`);
      });
      this.sock = sock;
      let handshook = false;
      sock.on("data", (d) => {
        if (!handshook) {
          this.buf = Buffer.concat([this.buf, d]);
          const idx = this.buf.indexOf("\r\n\r\n");
          if (idx === -1) return;
          const head = this.buf.slice(0, idx).toString();
          if (!/101/.test(head)) return reject(new Error("ws handshake failed: " + head.split("\r\n")[0]));
          handshook = true;
          this.buf = this.buf.slice(idx + 4);
          this._parse();
          resolve();
        } else {
          this.buf = Buffer.concat([this.buf, d]);
          this._parse();
        }
      });
      sock.on("error", reject);
    });
  }

  _parse() {
    while (true) {
      if (this.buf.length < 2) return;
      const b0 = this.buf[0], b1 = this.buf[1];
      const fin = (b0 & 0x80) !== 0, opcode = b0 & 0x0f, masked = (b1 & 0x80) !== 0;
      let len = b1 & 0x7f, off = 2;
      if (len === 126) { if (this.buf.length < 4) return; len = this.buf.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (this.buf.length < 10) return; len = this.buf.readUInt32BE(2) * 2 ** 32 + this.buf.readUInt32BE(6); off = 10; }
      let mask = null;
      if (masked) { if (this.buf.length < off + 4) return; mask = this.buf.slice(off, off + 4); off += 4; }
      if (this.buf.length < off + len) return;
      let payload = this.buf.slice(off, off + len);
      if (masked) { payload = Buffer.from(payload); for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3]; }
      this.buf = this.buf.slice(off + len);
      this._frame(fin, opcode, payload);
    }
  }

  _frame(fin, opcode, payload) {
    if (opcode === 0x9) return this._send(0xA, payload); // ping -> pong
    if (opcode === 0x8) { try { this.sock.end(); } catch {} return; }
    if (opcode === 0xA) return; // pong
    if (opcode === 0x0 || opcode === 0x1 || opcode === 0x2) {
      this.frag.push(payload);
      if (!fin) return;
      const msg = Buffer.concat(this.frag).toString("utf8");
      this.frag = [];
      let obj; try { obj = JSON.parse(msg); } catch { return; }
      if (obj.id != null && this.pending.has(obj.id)) {
        const { resolve, reject } = this.pending.get(obj.id);
        this.pending.delete(obj.id);
        obj.error ? reject(new Error(obj.error.message)) : resolve(obj.result);
      } else if (obj.method) {
        const cbs = this.events.get(obj.method) || [];
        for (const cb of cbs.slice()) cb(obj.params);
      }
    }
  }

  _send(opcode, payload) {
    const len = payload.length, mask = crypto.randomBytes(4);
    let header;
    if (len < 126) header = Buffer.from([0x80 | opcode, 0x80 | len]);
    else if (len < 65536) { header = Buffer.alloc(4); header[0] = 0x80 | opcode; header[1] = 0x80 | 126; header.writeUInt16BE(len, 2); }
    else { header = Buffer.alloc(10); header[0] = 0x80 | opcode; header[1] = 0x80 | 127; header.writeUInt32BE(Math.floor(len / 2 ** 32), 2); header.writeUInt32BE(len >>> 0, 6); }
    const body = Buffer.from(payload);
    for (let i = 0; i < body.length; i++) body[i] ^= mask[i & 3];
    this.sock.write(Buffer.concat([header, mask, body]));
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this._send(0x1, Buffer.from(JSON.stringify({ id, method, params })));
    });
  }
  once(method) { return new Promise((resolve) => { const cb = (p) => { const a = this.events.get(method); a.splice(a.indexOf(cb), 1); resolve(p); }; this.on(method, cb); }); }
  on(method, cb) { if (!this.events.has(method)) this.events.set(method, []); this.events.get(method).push(cb); }

  async evaluate(expression) {
    const r = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error("eval: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result.value;
  }
  close() { try { this.sock.end(); } catch {} }
}

// ---------------------------------------------------------------------------
// launch Chrome headless, return a page-target CDP session
// ---------------------------------------------------------------------------
export function httpJson(port, pathname, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path: pathname, method }, (res) => {
      let d = ""; res.on("data", (c) => (d += c)); res.on("end", () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    });
    req.on("error", reject);
    req.end();
  });
}
export async function launchChrome(profilePrefix = "cdp-") {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), profilePrefix));
  const proc = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage",
    "--no-first-run", "--no-default-browser-check", "--remote-debugging-port=0",
    `--user-data-dir=${profile}`, "about:blank",
  ], { stdio: ["ignore", "ignore", "ignore"], detached: true });

  const portFile = path.join(profile, "DevToolsActivePort");
  let devPort = 0;
  for (let i = 0; i < 200; i++) {
    if (fs.existsSync(portFile)) { const l = fs.readFileSync(portFile, "utf8").split("\n"); if (l[0]) { devPort = parseInt(l[0], 10); break; } }
    await sleep(50);
  }
  if (!devPort) { proc.kill(); throw new Error("chrome did not expose a debug port"); }

  let target = null;
  for (let i = 0; i < 100; i++) {
    const list = await httpJson(devPort, "/json").catch(() => []);
    target = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
    if (target) break;
    await sleep(50);
  }
  if (!target) { proc.kill(); throw new Error("no page target"); }

  const cdp = new Cdp();
  await cdp.connect(target.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  return { proc, cdp, profile, devPort };
}

// One more tab in the SAME browser, as its own CDP session. Lessons are fully
// independent of each other, so N tabs can round-trip N lessons at once; the
// cost that matters is per-lesson wall-clock, and it is nearly all waiting.
export async function openTab(devPort) {
  const t = await httpJson(devPort, "/json/new?about:blank", "PUT");
  if (!t || !t.webSocketDebuggerUrl) throw new Error("could not open a browser tab");
  const cdp = new Cdp();
  await cdp.connect(t.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  return { cdp, id: t.id };
}

// Kill the browser and take its throwaway profile with it. A leaked headless
// Chrome holds about a gigabyte and a leaked profile is ~50MB, so both matter on
// a machine that runs this repeatedly.
export async function closeChrome(browser) {
  if (!browser) return;
  try { browser.cdp.close(); } catch {}
  // Signalling only the parent leaves its renderer and zygote children writing
  // into the profile, so the delete races them and loses with ENOTEMPTY -
  // abandoning the temp dir on every run. The profile is disposable, so take the
  // whole process group down at once, then wait for it to actually be gone.
  try { process.kill(-browser.proc.pid, "SIGKILL"); } catch { try { browser.proc.kill("SIGKILL"); } catch {} }
  try { await Promise.race([once(browser.proc, "exit"), sleep(3000)]); } catch {}
  try { fs.rmSync(browser.profile, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 }); } catch {}
}
