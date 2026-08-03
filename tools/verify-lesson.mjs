#!/usr/bin/env node
/**
 * tools/verify-lesson.mjs - one-command lesson verification harness.
 *
 * Runs the "Verify" recipe that docs/SPECS.md and the lesson-authoring skill
 * only describe in prose, so it stops being re-implemented as throwaway
 * /tmp/*.mjs harnesses each session. Node built-ins only; it shells out to the
 * `dotnet` and `google-chrome` already required to build and view the course.
 *
 * For every lesson it is given it runs, in order:
 *   1. node --check   - every JS file in the lesson dir parses.
 *   2a. build lessons - real-dotnet compile+run each task's `solution`; the
 *       stdout must match `expected` with the SAME rule build-engine.js uses
 *       (string: any line equals it; array: the non-empty lines equal that exact
 *       sequence). When a task has a hidden `verify`, it rebuilds the probe the
 *       identical way the engine does (source up to `class Program` + verify.main)
 *       and checks its output against verify.expected. Each `requireSource`
 *       pattern must match the solution (the technique gate).
 *   2b. viz lessons   - loads the vendored code-lab resolvers and runs
 *       resolveTranscript / resolveRetrieval / resolvePlan against EVERY step's
 *       scene, catching bad scene data a first-step render misses.
 *   3. headless render - serves the repo over http and renders the lesson page
 *       with system Chrome in EN and ES (the language is injected as
 *       localStorage before the page scripts run), asserting the DOM carries no
 *       literal "undefined", the hero title rendered, and - for viz - a scene
 *       panel class is present.
 *
 * After the lessons, it runs one global check on the landing chrome: every track
 * (name/kicker/blurb/partPrefix) and part (title) in course-registry.js must carry a
 * full i18n block for each language a lesson targets - so a new Part added without its
 * translation FAILS here. Card title/blurb are lesson-owned (card.title/card.blurb)
 * and covered by the per-lesson i18n check, not here.
 *
 * Usage:
 *   node tools/verify-lesson.mjs <lesson-dir | index.html | data.js> [more...]
 *   node tools/verify-lesson.mjs --all            # every migrated lesson
 *   flags: --no-dotnet  --no-render  --no-viz  --en-only  --port <n>  --quiet
 *
 * Exits non-zero if any check fails, so it doubles as a CI gate.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import KernelGrading from "../kernel/grading/output-match.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const CHROME = process.env.CHROME_BIN || "google-chrome";

// ---------------------------------------------------------------------------
// tiny output helpers
// ---------------------------------------------------------------------------
const C = { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", dim: "\x1b[2m", reset: "\x1b[0m" };
let QUIET = false;
const say = (s = "") => { if (!QUIET) process.stdout.write(s + "\n"); };
const ok = (m) => say(`  ${C.green}PASS${C.reset} ${m}`);
const bad = (m) => say(`  ${C.red}FAIL${C.reset} ${m}`);
const skip = (m) => say(`  ${C.dim}SKIP ${m}${C.reset}`);

// ---------------------------------------------------------------------------
// load a lesson data file (or the vendored bundle) in a bare-window sandbox
// ---------------------------------------------------------------------------
function makeWindow() {
  const noop = () => {};
  const elFactory = () => ({
    style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    appendChild: noop, setAttribute: noop, addEventListener: noop, remove: noop,
    querySelector: () => null, querySelectorAll: () => [], insertAdjacentHTML: noop,
    getContext: () => ({}), children: [], set innerHTML(_) {}, get innerHTML() { return ""; },
  });
  const win = {
    console, setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop,
    requestAnimationFrame: noop, cancelAnimationFrame: noop, matchMedia: () => ({ matches: false, addEventListener: noop }),
    navigator: { userAgent: "node", language: "en" }, location: { search: "", href: "" },
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    document: {
      createElement: elFactory, createElementNS: elFactory, createTextNode: () => ({}),
      getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
      addEventListener: noop, body: elFactory(), head: elFactory(), documentElement: elFactory(),
    },
    addEventListener: noop,
  };
  win.window = win; win.self = win; win.globalThis = win; win.top = win;
  return win;
}

function loadInWindow(file) {
  const src = fs.readFileSync(file, "utf8");
  const win = makeWindow();
  vm.createContext(win);
  vm.runInContext(src, win, { filename: file, timeout: 10000 });
  return win;
}

let _codelab = null;
function loadCodeLab() {
  if (_codelab) return _codelab;
  const bundle = path.join(root, "vendor", "code-lab", "code-lab.global.js");
  const win = makeWindow();
  vm.createContext(win);
  try { vm.runInContext(fs.readFileSync(bundle, "utf8"), win, { filename: bundle, timeout: 15000 }); }
  catch (e) { /* the bundle touches browser APIs after defining exports; ignore */ }
  _codelab = win.CodeLab || (win.window && win.window.CodeLab) || {};
  return _codelab;
}

// ---------------------------------------------------------------------------
// grading rule - the SAME shared policy build-engine.js uses
// (kernel/grading/output-match.js), so the verifier cannot certify behavior the
// engine has dropped. No local copy to drift.
// ---------------------------------------------------------------------------
const { matches, buildProbe } = KernelGrading;

// ---------------------------------------------------------------------------
// dotnet - one reusable console project, Program.cs swapped per compile
// ---------------------------------------------------------------------------
let _proj = null;
function dotnetAvailable() {
  return spawnSync("dotnet", ["--version"], { encoding: "utf8" }).status === 0;
}
function ensureProject() {
  if (_proj) return _proj;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "verify-lesson-"));
  const r = spawnSync("dotnet", ["new", "console", "-o", dir, "--force"], { encoding: "utf8" });
  if (r.status !== 0) throw new Error("dotnet new console failed:\n" + (r.stderr || r.stdout));
  spawnSync("dotnet", ["build", "-v", "q", "--nologo"], { cwd: dir, encoding: "utf8" });
  _proj = dir;
  return dir;
}
function compileRun(source) {
  const dir = ensureProject();
  fs.writeFileSync(path.join(dir, "Program.cs"), source);
  const r = spawnSync("dotnet", ["run", "--no-restore", "-v", "q", "--nologo"], { cwd: dir, encoding: "utf8", timeout: 120000 });
  const stderr = r.stderr || "";
  const stdout = r.stdout || "";
  const built = !/error [A-Z]{2}\d+/.test(stdout + stderr) && r.status === 0;
  const warnings = (stdout.match(/warning [A-Z]{2}\d+/g) || []).length;
  return { built, output: stdout, errors: stdout + stderr, warnings };
}
function cleanupProject() { if (_proj) { fs.rmSync(_proj, { recursive: true, force: true }); _proj = null; } }

// ---------------------------------------------------------------------------
// static server with per-request language injection
// ---------------------------------------------------------------------------
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".wasm": "application/wasm", ".map": "application/json" };

function startServer(port) {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://127.0.0.1");
    let rel = decodeURIComponent(u.pathname);
    if (rel.endsWith("/")) rel += "index.html";
    const file = path.join(root, rel);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); return res.end("not found");
    }
    let body = fs.readFileSync(file);
    const ext = path.extname(file).toLowerCase();
    if (ext === ".html" && u.searchParams.has("vlang")) {
      const lang = u.searchParams.get("vlang");
      const inject = `<script>try{localStorage.setItem('course_lesson_lang',${JSON.stringify(lang)});}catch(e){}</script>`;
      body = Buffer.from(body.toString("utf8").replace(/<head([^>]*)>/i, `<head$1>${inject}`));
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(body);
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve({ port: server.address().port, close: () => server.close() })));
}

function renderDom(url) {
  // Must be async (spawn, not spawnSync): a synchronous child would block the
  // event loop and starve the in-process static server that Chrome fetches from.
  return new Promise((resolve) => {
    const child = spawn(CHROME, [
      "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
      "--virtual-time-budget=6000", "--run-all-compositor-stages-before-draw", "--dump-dom", url,
    ], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    const timer = setTimeout(() => { try { child.kill("SIGKILL"); } catch { /* noop */ } }, 60000);
    child.stdout.on("data", (d) => { out += d; });
    child.on("close", () => { clearTimeout(timer); resolve(out); });
    child.on("error", () => { clearTimeout(timer); resolve(out); });
  });
}

// ---------------------------------------------------------------------------
// per-lesson checks
// ---------------------------------------------------------------------------
const PANEL_CLASSES = ["cl-tx", "cl-al", "cl-rg", "cl-pb", "cl-mv", "cl-ms", "cl-tr", "cl-ag"];

function nodeCheck(files) {
  let allOk = true;
  for (const f of files) {
    const r = spawnSync("node", ["--check", f], { encoding: "utf8" });
    if (r.status === 0) ok(`node --check ${path.basename(f)}`);
    else { bad(`node --check ${path.basename(f)}\n${r.stderr.trim()}`); allOk = false; }
  }
  return allOk;
}

function verifyBuild(cfg, opts) {
  if (opts.noDotnet) { skip("dotnet compile (--no-dotnet)"); return true; }
  if (!dotnetAvailable()) { skip("dotnet compile (no dotnet on PATH)"); return true; }
  let allOk = true;
  const tasks = (cfg.tasks || []).filter((t) => !t.summary);
  tasks.forEach((t, i) => {
    const label = `task ${i + 1} "${(t.title || "").slice(0, 40)}"`;
    if (!t.solution) { skip(`${label} - no solution`); return; }
    const run = compileRun(t.solution);
    if (!run.built) { bad(`${label} solution did not compile\n${firstError(run.errors)}`); allOk = false; return; }
    if (!matches((run.output || "").trim(), t.expected)) {
      bad(`${label} output != expected\n    expected: ${JSON.stringify(t.expected)}\n    got: ${JSON.stringify((run.output || "").trim())}`);
      allOk = false;
    } else ok(`${label} solution runs and matches expected`);
    if (run.warnings) say(`    ${C.yellow}note${C.reset} solution compiled with ${run.warnings} warning(s)`);

    for (const req of t.requireSource || []) {
      const re = req.pattern instanceof RegExp ? req.pattern : new RegExp(req.pattern);
      if (re.test(t.solution)) ok(`${label} requireSource /${re.source}/ matches solution`);
      else { bad(`${label} requireSource /${re.source}/ does NOT match solution`); allOk = false; }
    }
    if (t.verify && t.verify.main) {
      const probe = compileRun(buildProbe(t.solution, t.verify.main));
      if (!probe.built) { bad(`${label} verify probe did not compile\n${firstError(probe.errors)}`); allOk = false; }
      else if (!matches((probe.output || "").trim(), t.verify.expected)) {
        bad(`${label} verify probe output != verify.expected (${JSON.stringify(t.verify.expected)}); got ${JSON.stringify((probe.output || "").trim())}`);
        allOk = false;
      } else ok(`${label} hidden verify probe passes`);
    }
  });
  return allOk;
}

function firstError(errs) {
  const line = (errs.split(/\r?\n/).find((l) => /error [A-Z]{2}\d+/.test(l)) || errs.split(/\r?\n/)[0] || "").trim();
  return "    " + line.slice(0, 200);
}

function verifyViz(win, opts) {
  if (opts.noViz) { skip("viz resolvers (--no-viz)"); return true; }
  const viz = win.LESSON_VIZ;
  const steps = (viz && viz.steps) || [];
  const CL = loadCodeLab();
  const resolvers = { transcript: CL.resolveTranscript, retrieval: CL.resolveRetrieval, plan: CL.resolvePlan };
  let allOk = true, ran = 0;
  steps.forEach((step, i) => {
    for (const [field, fn] of Object.entries(resolvers)) {
      if (!step[field]) continue;
      if (typeof fn !== "function") { skip(`step ${i + 1} ${field}: no resolver in bundle`); continue; }
      try { const out = fn(step[field]); if (!out || typeof out !== "object") throw new Error("resolver returned non-object"); ran++; }
      catch (e) { bad(`step ${i + 1} ${field} resolver threw: ${e.message}`); allOk = false; }
    }
  });
  if (ran) ok(`${ran} scene(s) resolved cleanly across ${steps.length} step(s)`);
  else skip(`no transcript/retrieval/plan scenes to resolve (${steps.length} step(s))`);
  return allOk;
}

async function verifyRender(lessonDir, archetype, server, opts) {
  if (opts.noRender) { skip("headless render (--no-render)"); return true; }
  const relHtml = path.relative(root, path.join(lessonDir, "index.html"));
  const langs = opts.enOnly ? ["en"] : ["en", "es"];
  let allOk = true;
  for (const lang of langs) {
    const url = `http://127.0.0.1:${server.port}/${relHtml.split(path.sep).join("/")}?vlang=${lang}`;
    const dom = await renderDom(url);
    if (dom.length < 500) { bad(`render[${lang}] produced almost no DOM (${dom.length} bytes)`); allOk = false; continue; }
    const undef = (dom.match(/undefined/g) || []).length;
    const hasTitle = /class="[^"]*hero[^"]*"|<h1/i.test(dom);
    const hasPanel = PANEL_CLASSES.some((c) => dom.includes(c));
    let localOk = true;
    if (undef > 0) { bad(`render[${lang}] DOM contains ${undef} "undefined"`); localOk = false; }
    if (!hasTitle) { bad(`render[${lang}] no hero/title rendered`); localOk = false; }
    if (archetype === "viz" && !hasPanel) { bad(`render[${lang}] no scene panel class present`); localOk = false; }
    if (localOk) ok(`render[${lang}] clean (0 undefined, title present${archetype === "viz" ? ", panel present" : ""})`);
    allOk = allOk && localOk;
  }
  return allOk;
}

// ---------------------------------------------------------------------------
// lesson discovery + orchestration
// ---------------------------------------------------------------------------
function resolveLessonDir(arg) {
  let p = path.resolve(arg);
  if (fs.existsSync(p) && fs.statSync(p).isFile()) p = path.dirname(p);
  if (!fs.existsSync(path.join(p, "index.html"))) return null;
  return p;
}

function findAllLessons() {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const d = path.join(dir, e.name);
      if (fs.existsSync(path.join(d, "index.html")) && (fs.existsSync(path.join(d, "data.js")) || fs.readdirSync(d).some((f) => f.endsWith(".viz.js")))) out.push(d);
      walk(d);
    }
  };
  walk(path.join(root, "content"));
  return out.sort();
}

function lessonJsFiles(dir) {
  return fs.readdirSync(dir).filter((f) => f.endsWith(".js")).map((f) => path.join(dir, f));
}

function detectArchetype(dir) {
  const vizFile = fs.readdirSync(dir).find((f) => f.endsWith(".viz.js"));
  if (vizFile) return { archetype: "viz", dataFile: path.join(dir, vizFile) };
  const dataFile = path.join(dir, "data.js");
  if (!fs.existsSync(dataFile)) return { archetype: "unknown", dataFile: null };
  const src = fs.readFileSync(dataFile, "utf8");
  if (/window\.BUILD_CONFIG/.test(src)) return { archetype: "build", dataFile };
  if (/window\.DRILL_CONFIG/.test(src)) return { archetype: "drill", dataFile };
  return { archetype: "unknown", dataFile };
}

// ---------------------------------------------------------------------------
// landing chrome: every track (name/kicker/blurb/partPrefix) and part (title) in
// course-registry.js must carry a full i18n block for each language a lesson targets,
// or the index renders English for that part while the lesson's own pages are
// translated. Lesson CARD text is lesson-owned and gated per-lesson. This is global
// (not per-lesson), so it runs once per invocation.
// ---------------------------------------------------------------------------
function loadRegistryGlobal() {
  const file = path.join(root, "course-registry.js");
  if (!fs.existsSync(file)) return null;
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
  return sandbox.window.CourseRegistry || null;
}

function loadMetaGlobal(dir) {
  const file = path.join(dir, "meta.js");
  if (!fs.existsSync(file)) return null;
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
  return sandbox.window.LESSON_META || null;
}

const TRACK_I18N_FIELDS = ["name", "kicker", "blurb", "partPrefix"];
function verifyLanding(opts) {
  const registry = loadRegistryGlobal();
  say(`\n${C.dim}=== landing chrome (course-registry.js i18n) ===${C.reset}`);
  if (!registry || !Array.isArray(registry.tracks)) { skip("no course-registry.js"); return true; }
  if (opts.enOnly) { skip("--en-only: skipping landing chrome languages"); return true; }
  const targetLangs = new Set();
  for (const dir of findAllLessons()) {
    const meta = loadMetaGlobal(dir);
    if (!meta || !meta.resources) continue;
    const base = meta.resources.lang || "en";
    for (const l of meta.resources.langs || []) if (l !== base) targetLangs.add(l);
  }
  if (!targetLangs.size) { skip("no lesson targets a non-base language"); return true; }
  let allOk = true;
  for (const lang of [...targetLangs].sort()) {
    const missTracks = [], missParts = [];
    for (const t of registry.tracks) {
      const ti = (t.i18n || {})[lang] || {};
      for (const f of TRACK_I18N_FIELDS) if (typeof ti[f] !== "string") missTracks.push(t.id + "." + f);
      for (const pt of t.parts || []) {
        const pi = (pt.i18n || {})[lang] || {};
        if (typeof pi.title !== "string") missParts.push(t.id + "/" + pt.id);
      }
    }
    if (missTracks.length || missParts.length) {
      allOk = false;
      if (missTracks.length) bad(`[${lang}] ${missTracks.length} track chrome field(s) untranslated: ${missTracks.slice(0, 8).join(", ")}`);
      if (missParts.length) bad(`[${lang}] ${missParts.length} part title(s) untranslated: ${missParts.slice(0, 8).join(", ")}`);
    } else {
      const parts = registry.tracks.reduce((n, t) => n + (t.parts || []).length, 0);
      ok(`[${lang}] all ${registry.tracks.length} tracks + ${parts} parts localized`);
    }
  }
  return allOk;
}

async function verifyLesson(dir, server, opts) {
  const rel = path.relative(root, dir);
  const { archetype, dataFile } = detectArchetype(dir);
  say(`\n${C.dim}=== ${rel} (${archetype}) ===${C.reset}`);
  let allOk = true;

  allOk = nodeCheck(lessonJsFiles(dir)) && allOk;

  let win = null;
  if (dataFile) {
    try { win = loadInWindow(dataFile); }
    catch (e) { bad(`loading ${path.basename(dataFile)} in sandbox: ${e.message}`); allOk = false; }
  }

  if (win && archetype === "build") allOk = verifyBuild(win.BUILD_CONFIG || {}, opts) && allOk;
  else if (win && archetype === "drill") allOk = verifyBuild(win.DRILL_CONFIG || {}, opts) && allOk;
  else if (win && archetype === "viz") allOk = verifyViz(win, opts) && allOk;

  allOk = (await verifyRender(dir, archetype, server, opts)) && allOk;
  return allOk;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const opts = { noDotnet: false, noRender: false, noViz: false, enOnly: false, port: 0 };
  const targets = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--no-dotnet") opts.noDotnet = true;
    else if (a === "--no-render") opts.noRender = true;
    else if (a === "--no-viz") opts.noViz = true;
    else if (a === "--en-only") opts.enOnly = true;
    else if (a === "--quiet") QUIET = true;
    else if (a === "--port") opts.port = Number(args[++i]);
    else if (a === "--all") targets.push("__ALL__");
    else targets.push(a);
  }
  if (!targets.length) {
    say("usage: node tools/verify-lesson.mjs <lesson-dir | index.html | --all> [--no-dotnet] [--no-render] [--no-viz] [--en-only] [--port n] [--quiet]");
    process.exit(2);
  }

  let dirs = [];
  for (const t of targets) {
    if (t === "__ALL__") dirs.push(...findAllLessons());
    else { const d = resolveLessonDir(t); if (d) dirs.push(d); else { bad(`not a lesson (no index.html): ${t}`); process.exitCode = 1; } }
  }
  dirs = [...new Set(dirs)];
  if (!dirs.length) { process.exit(process.exitCode || 1); }

  const server = opts.noRender ? { port: 0, close: () => {} } : await startServer(opts.port);
  const results = [];
  try {
    for (const d of dirs) results.push([d, await verifyLesson(d, server, opts)]);
  } finally {
    server.close();
    cleanupProject();
  }

  const landingOk = verifyLanding(opts);

  const failed = results.filter(([, r]) => !r);
  say(`\n${C.dim}--- summary ---${C.reset}`);
  say(`  ${results.length} lesson(s), ${C.green}${results.length - failed.length} passed${C.reset}${failed.length ? `, ${C.red}${failed.length} failed${C.reset}` : ""}`);
  for (const [d] of failed) say(`  ${C.red}x${C.reset} ${path.relative(root, d)}`);
  if (!landingOk) say(`  ${C.red}x${C.reset} landing chrome (course-registry.js) has untranslated track/part i18n`);
  process.exit(failed.length || !landingOk ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
