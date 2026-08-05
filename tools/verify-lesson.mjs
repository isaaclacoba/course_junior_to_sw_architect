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
 *       stdout must match `expected` with the SAME rule the build plugin uses
 *       (string: any line equals it; array: the non-empty lines equal that exact
 *       sequence). When a task has a hidden `verify`, it rebuilds the probe the
 *       identical way the engine does (source up to `class Program` + verify.main)
 *       and checks its output against verify.expected. Each `requireSource`
 *       pattern must match the solution (the technique gate).
 *   2b. viz lessons   - loads the vendored code-lab resolvers and runs
 *       resolveTranscript / resolveRetrieval / resolvePlan against EVERY step's
 *       scene, catching bad scene data a first-step render misses.
 *   2c. git lessons   - REPLAYS each task through the vendored code-lab git
 *       runtime: build the start state from its commands, run the authored
 *       `solution`, and demand kernel/engine/git-progress.js report solved with
 *       zero off-plan commits. A solution that does not reach its own target -
 *       or a card that is already solved before the learner types - fails.
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
import { loadInWindow, loadCodeLab } from "./lib/codelab-sandbox.mjs";
import { createValidators, resolveBody, PANEL_CLASSES } from "./lib/lesson-validators.mjs";

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
const note = (m) => say(`    ${C.yellow}note${C.reset} ${m}`);

// ---------------------------------------------------------------------------
// grading rule - the SAME shared policy the build plugin uses
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
  // Keep the ids, not just a count: the runner shows a specific set of warnings
  // to the learner, so the check has to be able to ask WHICH ones fired.
  const warningIds = [...new Set((stdout.match(/warning ([A-Z]{2}\d+)/g) || []).map((w) => w.split(" ")[1]))];
  return { built, output: stdout, errors: stdout + stderr, warnings: warningIds.length, warningIds };
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
  //
  // stderr is CAPTURED, not discarded, because that is where the page's console
  // goes. A lesson whose controller throws still renders its inlined fallback
  // prose - a title, no "undefined", a body - so every check here passed while
  // eight lessons were visibly broken. The console was the only witness.
  return new Promise((resolve) => {
    const child = spawn(CHROME, [
      "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
      "--enable-logging=stderr", "--log-level=0",
      "--virtual-time-budget=6000", "--run-all-compositor-stages-before-draw", "--dump-dom", url,
    ], { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    const done = () => {
      clearTimeout(timer);
      // Chrome writes plenty of its own noise to stderr (GPU, sandbox, fonts).
      // Only page console messages carry ":CONSOLE:", and a healthy lesson emits
      // none at all - measured across every archetype - so any of them is a
      // finding rather than something to threshold.
      const consoleLines = err
        .split("\n")
        .filter((l) => l.includes(":CONSOLE:"))
        // Only the LESSON'S OWN code counts. Two other things log here and
        // neither says anything about the lesson: the 72MB Blazor compiler host
        // under `level3-app/`, and Monaco off a public CDN - run several
        // verifiers at once and both lose the race, measured at 206 "Failed to
        // fetch" lines on a page that is perfectly healthy alone. Judging a
        // lesson by those is measuring this machine's load.
        //
        // A message with no `source:` is kept: an uncaught error with nowhere to
        // point is exactly the kind this check exists for.
        .filter((l) => {
          const m = /source: (\S+)/.exec(l);
          if (!m) return true;
          const from = m[1];
          if (from.includes("/level3-app/")) return false;
          return from.startsWith("http://127.0.0.1") || from.startsWith("http://localhost");
        })
        .map((l) => l.replace(/^\[[^\]]*\]\s*/, "").trim());
      resolve({ dom: out, console: consoleLines });
    };
    const timer = setTimeout(() => { try { child.kill("SIGKILL"); } catch { /* noop */ } }, 60000);
    child.stdout.on("data", (d) => { out += d; });
    child.stderr.on("data", (d) => { err += d; });
    child.on("close", done);
    child.on("error", done);
  });
}

// ---------------------------------------------------------------------------
// the archetype validators - dispatch is a registry lookup, not a branch.
// Every collaborator they need is injected here: the reporters, the dotnet
// runner, the shared grading policy, and the loaded code-lab bundle (which
// carries both the viz scene resolvers and the git model + CLI).
// ---------------------------------------------------------------------------
const VALIDATORS = createValidators({
  report: { ok, bad, skip, note },
  dotnet: { available: dotnetAvailable, compileRun },
  grading: { matches, buildProbe },
  codeLab: loadCodeLab,
});

// ---------------------------------------------------------------------------
// per-lesson checks
// ---------------------------------------------------------------------------

function nodeCheck(files) {
  let allOk = true;
  for (const f of files) {
    const r = spawnSync("node", ["--check", f], { encoding: "utf8" });
    if (r.status === 0) ok(`node --check ${path.basename(f)}`);
    else { bad(`node --check ${path.basename(f)}\n${r.stderr.trim()}`); allOk = false; }
  }
  return allOk;
}

// Does the rendered DOM show a lesson BODY, not just the page furniture? The hero
// and the card scaffold come from meta.js + page-shell, so they paint even when
// the lesson's own config never arrives - which is why "no hero/title" and the
// 500-byte floor both pass a blank lesson (measured: 11KB of empty scaffold).
// The discriminator is per archetype and is owned by that archetype's validator:
// a practice lesson fills a card title from its config, a widget lesson mounts
// its widget, a git lesson mounts a terminal and a graph.
function hasBody(dom, archetype) {
  const v = VALIDATORS.get(archetype);
  // unreachable for "unknown": verifyLesson fails that case outright
  return v ? v.rendered(dom) : true;
}

async function verifyRender(lessonDir, archetype, server, opts) {
  if (opts.noRender) { skip("headless render (--no-render)"); return true; }
  const relHtml = path.relative(root, path.join(lessonDir, "index.html"));
  const langs = opts.enOnly ? ["en"] : ["en", "es"];
  let allOk = true;
  for (const lang of langs) {
    const url = `http://127.0.0.1:${server.port}/${relHtml.split(path.sep).join("/")}?vlang=${lang}`;
    const { dom, console: consoleLines } = await renderDom(url);
    if (dom.length < 500) { bad(`render[${lang}] produced almost no DOM (${dom.length} bytes)`); allOk = false; continue; }
    const undef = (dom.match(/undefined/g) || []).length;
    const hasTitle = /class="[^"]*hero[^"]*"|<h1/i.test(dom);
    const hasPanel = PANEL_CLASSES.some((c) => dom.includes(c));
    let localOk = true;
    if (undef > 0) { bad(`render[${lang}] DOM contains ${undef} "undefined"`); localOk = false; }
    if (!hasTitle) { bad(`render[${lang}] no hero/title rendered`); localOk = false; }
    if (!hasBody(dom, archetype)) { bad(`render[${lang}] the page furniture rendered but the ${archetype} body did not - empty lesson`); localOk = false; }
    if (archetype === "viz" && !hasPanel) { bad(`render[${lang}] no scene panel class present`); localOk = false; }
    if (consoleLines.length > 0) {
      bad(`render[${lang}] the page logged ${consoleLines.length} console message(s):`);
      for (const line of consoleLines.slice(0, 3)) note(`    ${line}`);
      localOk = false;
    }
    if (localOk) ok(`render[${lang}] clean (0 undefined, title present, console silent${archetype === "viz" ? ", panel present" : ""})`);
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
  // meta.js is the AUTHORITY on archetype. Sniffing the data source for a config
  // global was the old way, and it silently degrades to "unknown" - i.e. verifies
  // nothing while still reporting a pass - the moment that global is renamed.
  const metaFile = path.join(dir, "meta.js");
  if (fs.existsSync(metaFile)) {
    try {
      const meta = loadInWindow(metaFile).LESSON_META;
      if (meta && meta.archetype) return { archetype: meta.archetype, dataFile };
    } catch { /* fall through */ }
  }
  // No sniff on the data global: every archetype now sets one unified config
  // global, which cannot distinguish build from drill. Classification is
  // meta.archetype only; an unclassifiable lesson is reported, never guessed.
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

  // A missing config used to be coerced to {}, so the build check looped over
  // zero tasks and reported a pass. Resolve it properly and FAIL when there is no
  // body - an empty lesson is the one thing a verifier must never call verified.
  // An unclassifiable lesson is the original bug in miniature: we cannot pick a
  // body field, so we assert nothing, so we pass. Refuse instead. This fires when
  // meta.js is missing/malformed AND data.js names no legacy config global.
  if (archetype === "unknown") {
    bad("cannot classify this lesson - meta.js declares no archetype and data.js names no known config global; refusing to report it verified");
    allOk = false;
  } else if (win) {
    // Registry lookup, not a branch: an archetype with no validator has no body
    // field either, so resolveBody refuses it with the same wording lib.mjs uses.
    const validator = VALIDATORS.get(archetype);
    const body = resolveBody(win, archetype, validator);
    if (!body.ok) { bad(`no lesson body to verify - ${body.reason}`); allOk = false; }
    else allOk = validator.verify({ config: body.config, opts }) && allOk;
  }

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
