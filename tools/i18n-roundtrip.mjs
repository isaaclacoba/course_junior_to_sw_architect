#!/usr/bin/env node
/**
 * tools/i18n-roundtrip.mjs - detect "stuck language" round-trip leaks in voiced
 * lessons.
 *
 * THE BUG CLASS. A voiced lesson's DEFAULT-language (English) prose lives INLINE
 * in the data file, not in en.json. The binders + page-shell historically used an
 * "apply-if-present" idiom (only overwrite a leaf when the bundle carries its
 * key). So the FIRST switch to Spanish overwrote the inline English, and switching
 * BACK found no `en` key to restore from - leaving that leaf stuck in Spanish. The
 * fix is to snapshot the inline default ONCE and restore it when the resolver has
 * no key (resource/bind-*.js bindLeaf, page-shell repaintCrumb). This class RECURS
 * whenever a new voiced surface is added, so this tool is the reusable detector.
 *
 * WHAT IT CHECKS. Two modes:
 *   browser (default, AUTHORITATIVE) - the bug is a LIVE swap, so the real check
 *     needs a real DOM. It serves the repo over an ephemeral port, drives system
 *     Chrome via CDP, opens each lesson in the default language, snapshots the
 *     visible own-text of every element (plus document.title and p.meta), then for
 *     each non-default lang switches to it and back via the REAL Settings gear
 *     popover, and reports every element whose text did not return to its original
 *     default value. This catches BOTH binder data-prose leaks AND page-shell /
 *     setLocale chrome leaks (breadcrumb p.meta, document.title, widget chrome).
 *   static (--static, fast pre-check) - loads each voiced lesson's data + the
 *     matching binder in a node sandbox and asserts the binder round-trips
 *     en -> es -> en against the REAL res bundles (like test/bind-roundtrip.test.js
 *     but on live data). It CANNOT see page-shell / setLocale chrome leaks - only
 *     the browser mode does. Use it as a quick gate before the browser run.
 *
 * USAGE
 *   node tools/i18n-roundtrip.mjs <lesson-dir> [more-dirs...]
 *   node tools/i18n-roundtrip.mjs --all            # every voiced lesson (has es.json)
 *   node tools/i18n-roundtrip.mjs <dir> --static   # fast binder-only pre-check
 *   flags:
 *     --all            discover voiced lessons under content/ (res/.../es.json)
 *     --static         run only the dependency-free binder round-trip pre-check
 *     --langs a,b      override the non-default langs to exercise (default: from
 *                      the lesson's res bundles, minus the default lang)
 *     --json           machine-readable report on stdout
 *     --report <file>  write a persistent JSON results file (pass OR fail) so a
 *                      blocked push is postmortem-able without a blind re-run
 *     --port <n>       fixed server port (default: ephemeral). Never reuses 8091.
 *     --jobs <n>       lessons round-tripped at once, each in its own tab.
 *                      Default is sized from FREE MEMORY, not cores: a tab is a
 *                      real renderer and measures ~1.7GB. Also capped at half
 *                      the cores and at 6. Raise it only on an idle machine.
 *     --settle <ms>    per-switch settle after the radio flips (default 700)
 *     --keep-open      do not kill Chrome on exit (debugging)
 *     --verbose        print each snapshot/switch step
 *
 * Zero npm deps: shells out to the system `google-chrome` (v149) that the course
 * already needs to preview. Exits non-zero on ANY leak, so it doubles as a CI gate.
 */
import fs from "node:fs";
import os from "node:os";
import net from "node:net";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { lessonBody } from "./lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const CHROME = process.env.CHROME_BIN || "google-chrome";

// ---------------------------------------------------------------------------
// output
// ---------------------------------------------------------------------------
const C = { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", dim: "\x1b[2m", reset: "\x1b[0m" };
let VERBOSE = false;
const say = (s = "") => process.stdout.write(s + "\n");
const vsay = (s = "") => { if (VERBOSE) process.stdout.write(C.dim + s + C.reset + "\n"); };
const ok = (m) => say(`  ${C.green}PASS${C.reset} ${m}`);
const bad = (m) => say(`  ${C.red}FAIL${C.reset} ${m}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// A lesson tab is a real Chrome renderer holding Monaco plus the whole page, and
// it measures at roughly a gigabyte. The limit here is therefore memory, not
// cores: a 16-core box still only fits a handful of tabs, and sizing by core
// count is how you exhaust a developer machine that is already running a
// desktop. Budget from what is actually free, leave most of it alone, and still
// stay under half the cores.
const TAB_MB = 1700;
function availableMb() {
  try {
    const m = fs.readFileSync("/proc/meminfo", "utf8").match(/MemAvailable:\s+(\d+) kB/);
    if (m) return Math.floor(Number(m[1]) / 1024);
  } catch {}
  return Math.floor(os.freemem() / 1024 / 1024);
}
function defaultJobs() {
  const cores = (os.cpus() || []).length || 4;
  const byMemory = Math.floor((availableMb() * 0.7) / TAB_MB);
  return Math.max(1, Math.min(6, Math.floor(cores / 2), byMemory));
}

// ---------------------------------------------------------------------------
// args
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const a = { dirs: [], all: false, static: false, json: false, port: 0, settle: 700, keepOpen: false, langs: null, report: null, jobs: 0 };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--all") a.all = true;
    else if (t === "--static") a.static = true;
    else if (t === "--json") a.json = true;
    else if (t === "--keep-open") a.keepOpen = true;
    else if (t === "--verbose") { a.verbose = true; VERBOSE = true; }
    else if (t === "--port") a.port = parseInt(argv[++i], 10) || 0;
    else if (t === "--settle") a.settle = parseInt(argv[++i], 10) || 700;
    else if (t === "--jobs") a.jobs = parseInt(argv[++i], 10) || 0;
    else if (t === "--report") a.report = argv[++i];
    else if (t === "--langs") a.langs = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    else if (t.startsWith("--")) { say(`unknown flag ${t}`); process.exit(2); }
    else a.dirs.push(t);
  }
  return a;
}

// A voiced lesson = a lesson dir carrying a non-default bundle (es.json here).
function isVoicedLesson(dir) {
  return fs.existsSync(path.join(dir, "res", "strings", "default", "es.json"));
}
function discoverVoiced() {
  const out = [];
  const contentRoot = path.join(root, "content");
  (function walk(d) {
    let ents;
    try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    if (ents.some((e) => e.name === "meta.js") && isVoicedLesson(d)) { out.push(d); return; }
    for (const e of ents) if (e.isDirectory()) walk(path.join(d, e.name));
  })(contentRoot);
  return out.sort();
}

// Normalise a passed target (dir | index.html | data.js) to its lesson dir.
function toLessonDir(p) {
  let abs = path.resolve(p);
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) abs = path.dirname(abs);
  return abs;
}

// The lesson's declared langs (from meta resources), default first.
function lessonLangs(dir) {
  const meta = loadMeta(dir);
  const r = (meta && meta.resources) || {};
  const langs = Array.isArray(r.langs) ? r.langs.slice() : ["en"];
  const dflt = r.lang || langs[0] || "en";
  return { dflt, langs, nondefault: langs.filter((l) => l !== dflt) };
}

// ---------------------------------------------------------------------------
// load a lesson data/meta file in a bare sandbox (for --static + lang discovery)
// ---------------------------------------------------------------------------
function bareWindow() {
  const win = { console, window: null };
  win.window = win;
  return win;
}
function loadLocalScripts(dir) {
  const win = bareWindow();
  vm.createContext(win);
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".js")) continue;
    try { vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), win, { filename: f, timeout: 5000 }); }
    catch { /* a data file may touch a browser global; the config object is still set */ }
  }
  return win;
}
function loadMeta(dir) {
  const win = loadLocalScripts(dir);
  return win.LESSON_META || null;
}
// A round-trip compares a lesson against ITSELF, so it is silent on the empty
// set: a lesson whose config global is missing snapshots identically before and
// after a language swap and "round-trips clean". Assert there is a body to
// round-trip FIRST, so a rename or a broken data.js fails here instead of
// passing vacuously. Returns an error string, or null when the lesson is sound.
// The static check above reads the DATA file. It cannot see the other half of an
// empty lesson: data that loads fine but never reaches the page because a binder
// or the controller still looks for the old global. Measured 2026-08-03 - renaming
// window.BUILD_CONFIG rendered a 11KB page with an EMPTY card (title, context and
// progress all blank) where a healthy one is 149KB, and every gate still passed.
// So also assert, in the real browser, that the archetype's body actually painted.
const RENDERED = {
  // practice archetypes paint the card header from the config; the scaffold ids
  // exist either way, so the signal is that one of them has TEXT.
  build: `[...document.querySelectorAll('[id$="Title"]')].some(e => e.textContent.trim())`,
  drill: `[...document.querySelectorAll('[id$="Title"]')].some(e => e.textContent.trim())`,
  // widget archetypes mount one code-lab widget; its root class is the signal.
  viz: `!!document.querySelector('.cl-mv')`,
  checkpoint: `!!document.querySelector('.cl-quiz')`,
};

function bodyCheck(dir) {
  const win = loadLocalScripts(dir);
  const meta = win.LESSON_META;
  if (!meta) return null; // "no meta.js" is the caller's existing skip, not a failure
  const r = lessonBody(win, meta.archetype);
  return r.ok ? null : `empty lesson: ${r.reason}`;
}

function loadBinder(file, globalName) {
  // Preload sibling helpers the binder delegates to (e.g. bind-origin.js defines
  // ResourceOrigin, the shared snapshot/restore). Only load pure IIFE helpers -
  // never kernel-controller.js, which runs DOM code at load time.
  const sandbox = { window: {}, WeakMap };
  vm.createContext(sandbox);
  for (const dep of ["bind-origin.js"]) {
    const p = path.join(root, "resource", dep);
    if (fs.existsSync(p)) { try { vm.runInContext(fs.readFileSync(p, "utf8"), sandbox); } catch { /* helper may be absent pre-refactor */ } }
  }
  vm.runInContext(fs.readFileSync(path.join(root, "resource", file), "utf8"), sandbox);
  return sandbox.window[globalName];
}
function bundleResolver(dir, lang) {
  const file = path.join(dir, "res", "strings", "default", lang + ".json");
  let map = {};
  try { map = JSON.parse(fs.readFileSync(file, "utf8")); } catch { map = {}; }
  return { get: (k) => (Object.prototype.hasOwnProperty.call(map, k) ? map[k] : undefined) };
}

// ---------------------------------------------------------------------------
// STATIC mode - binder round-trip on the real data + bundles (fast pre-check)
// ---------------------------------------------------------------------------
const ARCH = {
  viz: { binder: ["bind-viz.js", "ResourceBindViz"], key: "ctxViz" },
  build: { binder: ["bind-build.js", "ResourceBindBuild"], key: "ctxBuild" },
  checkpoint: { binder: ["bind-checkpoint.js", "ResourceBindCheckpoint"], key: "ctxCheck" },
};

function heroFromMeta(meta) {
  return { title: meta.title, eyebrow: meta.eyebrow, intro: Array.isArray(meta.intro) ? meta.intro.slice() : meta.intro };
}

function staticRoundTrip(dir) {
  const win = loadLocalScripts(dir);
  const meta = win.LESSON_META;
  if (!meta) return { skip: "no meta.js" };
  const arch = meta.archetype;
  const spec = ARCH[arch];
  if (!spec) return { skip: `archetype ${arch} has no binder` };
  const emptyErr = bodyCheck(dir);
  if (emptyErr) return { error: emptyErr };
  const bind = loadBinder(spec.binder[0], spec.binder[1]);

  const page = { hero: heroFromMeta(meta) };
  const ctx = { page };
  if (arch === "viz") ctx.viz = win.LESSON_CONFIG;
  else if (arch === "build") ctx.config = win.LESSON_CONFIG;
  else if (arch === "checkpoint") ctx.quiz = win.LESSON_CONFIG;

  const { dflt, nondefault } = lessonLangs(dir);
  const en = bundleResolver(dir, dflt);

  // baseline: apply default once, snapshot
  bind.apply(en, ctx);
  const base = JSON.stringify(ctx);

  const leaks = [];
  for (const L of nondefault) {
    bind.apply(bundleResolver(dir, L), ctx);
    bind.apply(en, ctx); // back to default
    const now = JSON.stringify(ctx);
    if (now !== base) leaks.push({ lang: L, note: "ctx did not restore to default after round-trip" });
  }
  return { arch, leaks, langs: nondefault };
}

// ---------------------------------------------------------------------------
// ephemeral static file server (serves the repo root)
// ---------------------------------------------------------------------------
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".css": "text/css", ".svg": "image/svg+xml",
  ".wasm": "application/wasm", ".png": "image/png", ".woff2": "font/woff2",
  ".map": "application/json", ".dat": "application/octet-stream",
};
function startServer(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let rel = decodeURIComponent(req.url.split("?")[0]);
      if (rel.endsWith("/")) rel += "index.html";
      const file = path.join(root, path.normalize(rel));
      if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404); return res.end(); }
        res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
        res.end(buf);
      });
    });
    server.listen(port, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

// ---------------------------------------------------------------------------
// minimal CDP client over a built-in WebSocket (no deps, no global WebSocket)
// ---------------------------------------------------------------------------
class Cdp {
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
function httpJson(port, pathname, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path: pathname, method }, (res) => {
      let d = ""; res.on("data", (c) => (d += c)); res.on("end", () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    });
    req.on("error", reject);
    req.end();
  });
}
async function launchChrome() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "i18nrt-"));
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
async function openTab(devPort) {
  const t = await httpJson(devPort, "/json/new?about:blank", "PUT");
  if (!t || !t.webSocketDebuggerUrl) throw new Error("could not open a browser tab");
  const cdp = new Cdp();
  await cdp.connect(t.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  return { cdp, id: t.id };
}

// ---------------------------------------------------------------------------
// in-page probes (stringified, run via Runtime.evaluate)
// ---------------------------------------------------------------------------
const PROBE = `(() => {
  const SKIP = 'pre, code, .monaco-editor, .cl-editor, #siteSettings, .c-settings, script, style';
  const norm = (s) => (s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/\\s+/g, ' ').trim().toLowerCase();
  function ownText(el){ let t=''; for(const n of el.childNodes) if(n.nodeType===3) t+=n.nodeValue; return t.replace(/\\s+/g,' ').trim(); }
  function cssPath(el){
    if(el.id) return '#'+CSS.escape(el.id);
    const parts=[];
    while(el && el.nodeType===1 && el.tagName!=='BODY'){
      let sel=el.tagName.toLowerCase();
      if(el.id){ parts.unshift('#'+CSS.escape(el.id)); break; }
      const p=el.parentNode;
      if(p){ const sib=[...p.children].filter(c=>c.tagName===el.tagName); if(sib.length>1) sel+=':nth-of-type('+(sib.indexOf(el)+1)+')'; }
      parts.unshift(sel); el=el.parentNode;
    }
    return parts.join('>');
  }
  window.__i18n = {
    ready(){ return !!document.querySelector('.c-settings-btn') && !!(document.title||'').trim()
      && !!(document.querySelector('#pageHero') && document.querySelector('#pageHero').textContent.trim()); },
    snap(){
      const out=[]; const seen=new Set();
      for(const el of document.querySelectorAll('body *')){
        const tag=el.tagName;
        if(tag==='SCRIPT'||tag==='STYLE'||tag==='SVG'||tag==='PATH') continue;
        if(el.closest && el.closest(SKIP)) continue;
        const t=ownText(el); if(!t) continue;
        const sel=cssPath(el); if(seen.has(sel)) continue; seen.add(sel);
        out.push({sel, text:t});
      }
      out.push({sel:'document.title', text:(document.title||'').trim()});
      const meta=document.querySelector('p.meta'); if(meta) out.push({sel:'p.meta', text:ownText(meta)});
      return out;
    },
    switch(labels){
      const rootEl=document.querySelector('#siteSettings');
      const btn=rootEl && rootEl.querySelector('.c-settings-btn');
      if(btn && !rootEl.classList.contains('is-open')) btn.click();
      const items=[...document.querySelectorAll('#siteSettings [role=menuitemradio]')];
      const want=labels.map(norm);
      const it=items.find(i=>want.some(L=>norm(i.textContent).includes(L)));
      if(!it) return {ok:false, seen:items.map(i=>i.textContent.trim())};
      it.click();
      return {ok:true};
    },
    applied(labels){
      const want=labels.map(norm);
      const items=[...document.querySelectorAll('#siteSettings [role=menuitemradio]')];
      const it=items.find(i=>want.some(L=>norm(i.textContent).includes(L)));
      return !!(it && it.getAttribute('aria-checked')==='true');
    }
  };
  return true;
})()`;

const LABELS = { en: ["English"], es: ["Espanol", "Español"], fr: ["Francais", "Français"], de: ["Deutsch"], pt: ["Portugues", "Português"] };
const labelsFor = (l) => LABELS[l] || [l];

// ---------------------------------------------------------------------------
// browser round-trip for one lesson
// ---------------------------------------------------------------------------
async function browserRoundTrip(cdp, srvPort, dir, opts) {
  const emptyErr = bodyCheck(dir);
  if (emptyErr) return { error: emptyErr };
  const rel = path.relative(root, dir).split(path.sep).join("/");
  const url = `http://127.0.0.1:${srvPort}/${rel}/index.html`;
  const { dflt, nondefault } = lessonLangs(dir);
  const langs = opts.langs || nondefault;

  // fresh default-language load: clear persisted choice, then navigate.
  await cdp.send("Page.navigate", { url });
  await cdp.once("Page.loadEventFired");
  await cdp.evaluate("try{localStorage.removeItem('course_lesson_lang');localStorage.removeItem('course_lesson_voice');}catch(e){}");
  await cdp.send("Page.navigate", { url });
  await cdp.once("Page.loadEventFired");

  // wait for the kernel to finish first render
  await cdp.evaluate(PROBE);
  let up = false;
  for (let i = 0; i < 200; i++) { if (await cdp.evaluate("window.__i18n.ready()")) { up = true; break; } await sleep(100); }
  if (!up) return { error: "lesson did not render (settings gear / hero never appeared)" };
  await sleep(opts.settle);

  // ready() only proves the hero + settings gear exist; the card body paints
  // later (a widget archetype has to fetch and mount its widget). So POLL for the
  // body the same way the readiness gate polls, rather than sampling once - a
  // single sample here reports every healthy lesson as empty.
  const arch = (loadMeta(dir) || {}).archetype;
  const probe = RENDERED[arch];
  if (probe) {
    let painted = false;
    for (let i = 0; i < 100; i++) { if (await cdp.evaluate(probe)) { painted = true; break; } await sleep(100); }
    if (!painted) return { error: `empty lesson: the ${arch} body never rendered (the hero painted, the card did not)` };
  }

  const heroRef = await cdp.evaluate("document.querySelector('#pageHero').textContent");
  const base = await cdp.evaluate("JSON.stringify(window.__i18n.snap())").then(JSON.parse);
  // A second default snapshot with no switch: any element that changes here is
  // VOLATILE (async chrome like the compiler button, timers), not a language leak.
  // Its text joins the baseline bag so it is never mistaken for a foreign string.
  await sleep(opts.settle);
  const baseB = await cdp.evaluate("JSON.stringify(window.__i18n.snap())").then(JSON.parse);

  const baseMap = new Map();
  const baseVals = new Set();
  for (const { sel, text } of base) { if (!baseMap.has(sel)) baseMap.set(sel, text); baseVals.add(text); }
  for (const { text } of baseB) baseVals.add(text);

  const leaks = [];
  for (const L of langs) {
    vsay(`    switch ${dflt} -> ${L}`);
    const to = await cdp.evaluate(`window.__i18n.switch(${JSON.stringify(labelsFor(L))})`);
    if (!to.ok) { leaks.push({ lang: L, sel: "(gear)", original: `language "${L}"`, leaked: `not offered; items: ${JSON.stringify(to.seen)}` }); continue; }
    await waitApplied(cdp, labelsFor(L), opts.settle);
    // Snapshot WHILE in L: this is the set of translated (foreign) strings on the
    // page. A real leak is one of THESE still visible after switching back.
    const midVals = new Set();
    for (const { text } of await cdp.evaluate("JSON.stringify(window.__i18n.snap())").then(JSON.parse)) midVals.add(text);

    vsay(`    switch ${L} -> ${dflt}`);
    const back = await cdp.evaluate(`window.__i18n.switch(${JSON.stringify(labelsFor(dflt))})`);
    if (!back.ok) { leaks.push({ lang: L, sel: "(gear)", original: `language "${dflt}"`, leaked: "could not switch back" }); continue; }
    await waitApplied(cdp, labelsFor(dflt), opts.settle);
    // let the async prose repaint settle
    for (let i = 0; i < 40; i++) { if (await cdp.evaluate("document.querySelector('#pageHero').textContent") === heroRef) break; await sleep(100); }
    await sleep(grace(opts.settle));

    // A leak = text that was shown IN L (foreign) and is STILL shown after
    // returning to the default, yet is NOT a default-language value. Comparing
    // against the L-phase set (not mere per-selector inequality) is immune to
    // English reshuffling - a rebuilt widget that samples/shuffles its own English
    // content (the checkpoint Quiz) never intersects the foreign set - and to
    // async English chrome (a compiler "Run" button) which is never in it either.
    const after = await cdp.evaluate("JSON.stringify(window.__i18n.snap())").then(JSON.parse);
    const seen = new Set();
    for (const { sel, text } of after) {
      if (!/\p{L}/u.test(text)) continue; // no letters -> language-invariant (e.g. "256"); identical in every language, so never a translation leak
      if (baseVals.has(text) || !midVals.has(text)) continue; // returned to default, or was never foreign
      if (seen.has(sel + "\u0000" + text)) continue; seen.add(sel + "\u0000" + text);
      leaks.push({ lang: L, sel, original: baseMap.has(sel) ? baseMap.get(sel) : "(not in default snapshot)", leaked: text });
    }
  }
  return { leaks, langs };
}

// Grace after a poll has already CONFIRMED the state. The poll is the real wait;
// this only covers a repaint landing a frame later, so it does not need the full
// settle budget - that budget exists for the UNPOLLED volatility samples.
const grace = (settle) => Math.min(settle, 150);

async function waitApplied(cdp, labels, settle) {
  for (let i = 0; i < 100; i++) { if (await cdp.evaluate(`window.__i18n.applied(${JSON.stringify(labels)})`)) break; await sleep(50); }
  await sleep(grace(settle));
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
function truncate(s, n = 80) { s = String(s).replace(/\s+/g, " "); return s.length > n ? s.slice(0, n - 1) + "\u2026" : s; }

// Persist a testrunner-style report so a blocked push is postmortem-able without a
// blind re-run. Written pass OR fail; parent dirs are created.
function writeReport(file, failed, report) {
  if (!file) return;
  const leaking = report.filter((r) => (r.leaks && r.leaks.length) || r.error);
  const out = {
    tool: "i18n-roundtrip",
    generatedAt: new Date().toISOString(),
    pass: !failed,
    total: report.length,
    leaking: leaking.length,
    leakingLessons: leaking.map((r) => r.lesson),
    lessons: report,
  };
  try {
    fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(out, null, 2));
    say(`${C.dim}report: ${path.relative(root, path.resolve(file))}${C.reset}`);
  } catch (e) {
    say(`${C.yellow}could not write report ${file}: ${e.message}${C.reset}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let dirs = args.dirs.map(toLessonDir);
  if (args.all) dirs = discoverVoiced();
  if (!dirs.length) { say("usage: node tools/i18n-roundtrip.mjs <lesson-dir | --all> [--static] [--json]"); process.exit(2); }

  dirs = dirs.filter((d) => {
    if (!isVoicedLesson(d)) { say(`${C.dim}skip ${path.relative(root, d)} (not voiced - no es.json)${C.reset}`); return false; }
    return true;
  });
  if (!dirs.length) process.exit(0);

  const report = [];
  let failed = false;

  if (args.static) {
    for (const dir of dirs) {
      const rel = path.relative(root, dir);
      const r = staticRoundTrip(dir);
      if (r.skip) { if (!args.json) say(`${C.dim}skip ${rel} (${r.skip})${C.reset}`); continue; }
      if (r.error) { failed = true; report.push({ lesson: rel, mode: "static", error: r.error }); if (!args.json) bad(`${rel} - ${r.error}`); continue; }
      const bad_ = r.leaks.length > 0;
      failed = failed || bad_;
      report.push({ lesson: rel, mode: "static", ...r });
      if (!args.json) {
        say(`${bad_ ? C.red + "FAIL" : C.green + "PASS"}${C.reset} ${rel} ${C.dim}(static, ${r.arch})${C.reset}`);
        for (const l of r.leaks) bad(`[${l.lang}] ${l.note}`);
      }
    }
  } else {
    const { server, port } = await startServer(args.port);
    let chrome;
    try {
      chrome = await launchChrome();
      // Lessons are independent, and a round-trip is nearly all waiting on a
      // page, so run several at once in their own tabs. Results are collected by
      // index and reported in lesson order, so output stays deterministic no
      // matter which tab finishes first.
      const jobs = Math.max(1, Math.min(args.jobs || defaultJobs(), dirs.length));
      const results = new Array(dirs.length);
      let next = 0;
      const tabs = [{ cdp: chrome.cdp }];
      for (let i = 1; i < jobs; i++) tabs.push(await openTab(chrome.devPort));
      vsay(`  ${jobs} tab(s) for ${dirs.length} lesson(s)`);

      // Findings are reported in lesson order further down, so nothing is printed
      // here. But a silent minutes-long run looks hung, so tick a counter on
      // stderr - it stays out of --json and out of a redirected report.
      let done = 0;
      const ticking = !args.json && process.stderr.isTTY;
      await Promise.all(tabs.map(async (tab) => {
        for (;;) {
          const i = next++;
          if (i >= dirs.length) return;
          try { results[i] = await browserRoundTrip(tab.cdp, port, dirs[i], { settle: args.settle, langs: args.langs }); }
          catch (e) { results[i] = { error: e.message }; }
          done++;
          if (ticking) process.stderr.write(`\r  ${done}/${dirs.length} lesson(s) checked`);
        }
      }));
      if (ticking) process.stderr.write("\r\x1b[2K");

      for (let i = 0; i < dirs.length; i++) {
        const rel = path.relative(root, dirs[i]);
        const r = results[i];
        if (r.error) { failed = true; report.push({ lesson: rel, mode: "browser", error: r.error }); if (!args.json) bad(`${rel} - ${r.error}`); continue; }
        const bad_ = r.leaks.length > 0;
        failed = failed || bad_;
        report.push({ lesson: rel, mode: "browser", langs: r.langs, leaks: r.leaks });
        if (!args.json) {
          say(`${bad_ ? C.red + "FAIL" : C.green + "PASS"}${C.reset} ${rel} ${C.dim}(browser, ${r.langs.join(",")})${C.reset}`);
          for (const l of r.leaks) {
            bad(`[${l.lang}] ${l.sel}`);
            say(`       default: ${C.dim}${truncate(l.original)}${C.reset}`);
            say(`       leaked : ${C.yellow}${truncate(l.leaked)}${C.reset}`);
          }
        }
      }
    } finally {
      try { server.close(); } catch {}
      if (chrome && !args.keepOpen) {
        try { chrome.cdp.close(); } catch {}
        // Signalling only the parent leaves its renderer and zygote children
        // writing into the profile, so the delete races them and loses with
        // ENOTEMPTY - abandoning ~50MB of temp on every run. The profile is
        // disposable, so take the whole process group down at once instead.
        try { process.kill(-chrome.proc.pid, "SIGKILL"); } catch { try { chrome.proc.kill("SIGKILL"); } catch {} }
        try { await Promise.race([once(chrome.proc, "exit"), sleep(3000)]); } catch {}
        try { fs.rmSync(chrome.profile, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 }); } catch {}
      }
    }
  }

  if (args.json) say(JSON.stringify({ pass: !failed, lessons: report }, null, 2));
  else {
    const n = report.length, f = report.filter((r) => (r.leaks && r.leaks.length) || r.error).length;
    say("");
    say(failed ? `${C.red}FAIL${C.reset} ${f}/${n} lesson(s) leaked` : `${C.green}PASS${C.reset} ${n} lesson(s) round-trip clean`);
  }
  writeReport(args.report, failed, report);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { say(`${C.red}error${C.reset} ${e.stack || e.message}`); process.exit(2); });
