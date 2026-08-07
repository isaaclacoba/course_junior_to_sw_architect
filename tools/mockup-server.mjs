// tools/mockup-server.mjs - serve a _mockup-*.html so the OWNER can SEE it.
//
// WHY THIS EXISTS
// A mockup that only the agent ever renders is not a mockup. The mockup-first
// rule says the owner LOOKS at the thing and says yes or no, so the artifact has
// to be reachable in a browser - not described in a report.
//
// Plain `python3 -m http.server` almost works, but a lab mockup needs the Roslyn
// compiler host, and that host (`level3-app/`) is a git-ignored build artefact
// that is usually not published on a dev machine. The runner also refuses any
// iframe that is not same-origin (roslyn-iframe.ts checks `event.origin`), so
// pointing straight at the deployed site fails the origin check.
//
// So: serve the repo locally, and reverse-proxy just `/level3-app/*` to the
// deployed Pages site. The browser sees one origin, the runner is satisfied, and
// Visualize actually compiles the learner's C# - with nothing built locally.

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import https from "node:https";
import os from "node:os";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const UPSTREAM_HOST = "isaaclacoba.github.io";
const UPSTREAM_BASE = "/course_junior_to_sw_architect";
const PROXY_PREFIX = "/level3-app/";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".dll": "application/octet-stream",
  ".dat": "application/octet-stream",
  ".blat": "application/octet-stream",
};

// The Blazor loader CANCELS its own boot when a response declares no length, so
// every reply here sets Content-Length explicitly rather than letting node fall
// back to chunked encoding. This cost a full afternoon once.
function send(res, status, headers, body) {
  res.writeHead(status, { ...headers, "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

// The compiler host is ~30MB of WebAssembly. Pulled fresh from the network that
// is a 15-second wait before the Visualize button works, every single reload,
// which is long enough that the mockup looks broken. Cached on disk it is under
// a second from the second load on.
const CACHE = path.join(os.tmpdir(), "mockup-level3-cache");

function cachePath(url) {
  return path.join(CACHE, encodeURIComponent(url));
}

function proxy(req, res) {
  const hit = cachePath(req.url);
  if (fs.existsSync(hit)) {
    const meta = JSON.parse(fs.readFileSync(hit + ".meta", "utf8"));
    return send(res, 200, { "Content-Type": meta.type, "Cache-Control": "no-store" }, fs.readFileSync(hit));
  }
  const upstreamPath = UPSTREAM_BASE + req.url;
  const r = https.request(
    { host: UPSTREAM_HOST, path: upstreamPath, method: "GET", headers: { "user-agent": "mockup-server" } },
    (up) => {
      const chunks = [];
      up.on("data", (c) => chunks.push(c));
      up.on("end", () => {
        const body = Buffer.concat(chunks);
        const type = up.headers["content-type"] || TYPES[path.extname(req.url.split("?")[0])] || "application/octet-stream";
        if ((up.statusCode || 200) === 200) {
          fs.mkdirSync(CACHE, { recursive: true });
          fs.writeFileSync(cachePath(req.url), body);
          fs.writeFileSync(cachePath(req.url) + ".meta", JSON.stringify({ type }));
        }
        send(res, up.statusCode || 200, { "Content-Type": type, "Cache-Control": "no-store" }, body);
      });
    },
  );
  r.on("error", () => send(res, 502, { "Content-Type": "text/plain" }, "upstream unreachable"));
  r.end();
}

function serve(port, open) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);

    if (url.startsWith(PROXY_PREFIX)) return proxy(req, res);

    const rel = url === "/" ? "/" + open : url;
    let file = path.join(root, rel);
    // A lesson is a DIRECTORY whose index.html is generated, so a bare directory
    // URL has to resolve the same way a static host resolves it. Without this the
    // whole course 404s under this server and looks like damage.
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, "index.html");
    }
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      return send(res, 404, { "Content-Type": "text/plain" }, "not found: " + rel);
    }
    const body = fs.readFileSync(file);
    send(res, 200, {
      "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    }, body);
  });

  server.listen(port, () => {
    console.log(`\n  mockup:  http://localhost:${port}/`);
    console.log(`  serving: ${open}`);
    console.log(`  ${PROXY_PREFIX}* -> https://${UPSTREAM_HOST}${UPSTREAM_BASE}${PROXY_PREFIX} (live compiler)`);
    console.log(`\n  Ctrl-C to stop.\n`);
  });
  return server;
}

const args = process.argv.slice(2);
const portArg = args.indexOf("--port");
const port = portArg >= 0 ? Number(args[portArg + 1]) : 8099;
let open = args.find((a) => a.endsWith(".html"));

if (!open) {
  const found = fs.readdirSync(root).filter((f) => /^_mockup-.*\.html$/.test(f));
  if (found.length === 1) open = found[0];
  else if (found.length === 0) {
    console.error("no _mockup-*.html in the repo root, and no file given");
    process.exit(1);
  } else {
    console.error("several mockups - name one:\n  " + found.join("\n  "));
    process.exit(1);
  }
}

serve(port, open);
