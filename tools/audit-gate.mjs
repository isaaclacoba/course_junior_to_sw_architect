#!/usr/bin/env node
/**
 * tools/audit-gate.mjs - the mechanical auditor gate. A fast, diff-aware runner
 * for the repo's DETERMINISTIC checks, wired as a pre-commit hook so a `git
 * commit` that would break the tree is BLOCKED. Node built-ins only, zero deps
 * (same convention as tools/verify-lesson.mjs). This header is the manual.
 *
 * WHAT IT RUNS (and when). In the default --staged mode it reads the staged file
 * list (`git diff --cached --name-only --diff-filter=ACM`) and runs ONLY the
 * checks a change to those paths can break, so an unrelated commit stays fast:
 *
 *   Always        node --check on every staged *.js / *.mjs (the STAGED blob, via
 *                 `git show :<path>`, not the working tree - so it validates
 *                 exactly what is being committed).
 *   Tests         `node --test test/` when any staged path is under test/ or
 *                 resource/, or is a root engine (build-engine.js, drill-engine.js,
 *                 page-shell.js).
 *   Validate+drift  `node tools/validate.mjs` AND a generator drift check
 *                 (`node tools/generate.mjs --out <tmp>` then a byte-diff of the
 *                 tmp mirror against the committed generated/ + content/.../index.html)
 *                 when any staged path is under content/, or is course-registry.js
 *                 or tools/generate.mjs.
 *   i18n (static)  `node tools/i18n-roundtrip.mjs --static` on the affected voiced
 *                 lesson dirs when any staged path is a resource binder
 *                 (resource/bind-*.js), page-shell.js, or a voiced lesson file
 *                 (content/**\/{meta.js,data.js,*.viz.js,res/strings/**}). A binder
 *                 or page-shell edit fans out to --all (every voiced lesson). Only
 *                 the FAST --static mode runs here; the browser round-trip needs
 *                 Chrome + an http server and is too slow/flaky for pre-commit -
 *                 run it at pre-push or in CI (node tools/i18n-roundtrip.mjs --all).
 *
 * FLAGS
 *   --staged   (default) diff-aware: only the checks the staged paths trigger.
 *   --all      run every check across the whole repo (manual / CI use).
 *   --push     pre-push mode: read the pushed ranges on stdin and run the BROWSER
 *              i18n round-trip on the voiced lessons the push changes (a binder /
 *              page-shell change fans out to every voiced lesson). This is the
 *              slow, full-fidelity check only a real DOM can do - kept off
 *              pre-commit, run once per push. Skips instantly when a push changes
 *              no i18n-relevant files.
 *
 * OUTPUT / EXIT CONTRACT
 *   Prints a concise per-check PASS/FAIL summary; on any FAIL it also prints the
 *   captured output and the EXACT failing command. Exits 0 when every triggered
 *   check passes, 1 when any check fails, 2 on a usage error. Non-zero blocks the
 *   commit through the hook.
 *
 * ENABLE THE HOOKS IN A FRESH CLONE (one-liner):
 *   git config core.hooksPath .githooks
 *   (.githooks/pre-commit runs `--staged`; .githooks/pre-push runs `--push`.)
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Shelling out: invoke node by its own absolute path and also prepend its dir to
// PATH for any child that re-shells `node` itself (tool-recipe gotcha).
const NODE = process.execPath;
const childEnv = { ...process.env, PATH: path.dirname(NODE) + path.delimiter + (process.env.PATH || "") };

const C = { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", dim: "\x1b[2m", reset: "\x1b[0m" };
const say = (s = "") => process.stdout.write(s + "\n");
const trunc = (s, n = 90) => { s = String(s == null ? "" : s).replace(/\s+/g, " "); return s.length > n ? s.slice(0, n - 1) + "\u2026" : s; };

// ---------------------------------------------------------------------------
// git helpers
// ---------------------------------------------------------------------------
function git(args) {
  return spawnSync("git", args, { cwd: root, encoding: "utf8", env: childEnv });
}
function stagedFiles() {
  const r = git(["diff", "--cached", "--name-only", "--diff-filter=ACM"]);
  if (r.status !== 0) { say(`${C.red}git diff --cached failed${C.reset}\n${r.stderr || ""}`); process.exit(2); }
  return r.stdout.split("\n").map((s) => s.trim()).filter(Boolean);
}
// Every tracked *.js / *.mjs (git does not descend the code-lab submodule and
// never lists the git-ignored level3-app); vendor is third-party, skip it.
function trackedJs() {
  const r = git(["ls-files", "--", "*.js", "*.mjs"]);
  if (r.status !== 0) { say(`${C.red}git ls-files failed${C.reset}`); process.exit(2); }
  return r.stdout.split("\n").map((s) => s.trim()).filter(Boolean)
    .filter((p) => !p.startsWith("code-lab/") && !p.startsWith("level3-app/") && !p.startsWith("vendor/"));
}

// ---------------------------------------------------------------------------
// check bookkeeping
// ---------------------------------------------------------------------------
const results = [];
function record(name, passed, command, output) {
  results.push({ name, passed, command, output: output || "" });
}
function run(name, command, cmd, args) {
  const r = spawnSync(cmd, args, { cwd: root, encoding: "utf8", env: childEnv });
  const passed = r.status === 0;
  record(name, passed, command, passed ? "" : (r.stdout || "") + (r.stderr || ""));
  return passed;
}

// ---------------------------------------------------------------------------
// checks
// ---------------------------------------------------------------------------

// node --check the STAGED blob of each file (write the index content to a temp
// file, preserving the extension so .mjs parses as a module).
function checkParseStaged(files) {
  if (!files.length) return;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "audit-parse-"));
  const failures = [];
  files.forEach((f, i) => {
    const show = spawnSync("git", ["show", ":" + f], { cwd: root, encoding: "buffer", env: childEnv });
    if (show.status !== 0) { failures.push(`${f}: not readable from index`); return; }
    const dest = path.join(tmp, `${i}-${path.basename(f)}`);
    fs.writeFileSync(dest, show.stdout);
    const r = spawnSync(NODE, ["--check", dest], { encoding: "utf8", env: childEnv });
    if (r.status !== 0) failures.push(`${f}:\n${(r.stderr || "").replace(new RegExp(dest, "g"), f)}`);
  });
  fs.rmSync(tmp, { recursive: true, force: true });
  record(`node --check (${files.length} staged js/mjs)`, failures.length === 0,
    "node --check <each staged *.js|*.mjs>", failures.join("\n"));
}

// node --check the working-tree copy of every tracked js/mjs (--all mode).
function checkParseAll(files) {
  const failures = [];
  for (const f of files) {
    const r = spawnSync(NODE, ["--check", path.join(root, f)], { encoding: "utf8", env: childEnv });
    if (r.status !== 0) failures.push(`${f}:\n${r.stderr || ""}`);
  }
  record(`node --check (${files.length} tracked js/mjs)`, failures.length === 0,
    "node --check <each tracked *.js|*.mjs>", failures.join("\n"));
}

function checkTests() {
  const dir = path.join(root, "test");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".test.js")).map((f) => path.join("test", f));
  run("node --test test/", "node --test test/", NODE, ["--test", ...files]);
}

function checkValidate() {
  run("node tools/validate.mjs", "node tools/validate.mjs", NODE, [path.join(root, "tools", "validate.mjs")]);
}

// Generator drift: build to a scratch mirror and byte-diff every emitted file
// against what is committed. The top-level data files map to generated/; the
// nested content/.../index.html pages map straight to the repo root.
function checkDrift() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "audit-gen-"));
  const gen = spawnSync(NODE, [path.join(root, "tools", "generate.mjs"), "--out", tmp], { cwd: root, encoding: "utf8", env: childEnv });
  if (gen.status !== 0) {
    fs.rmSync(tmp, { recursive: true, force: true });
    record("generator drift", false, "node tools/generate.mjs --out <tmp>", (gen.stdout || "") + (gen.stderr || ""));
    return;
  }
  const drifted = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const abs = path.join(d, e.name);
      if (e.isDirectory()) { walk(abs); continue; }
      const rel = path.relative(tmp, abs);
      const committed = path.dirname(rel) === "." ? path.join(root, "generated", rel) : path.join(root, rel);
      if (!fs.existsSync(committed) || !fs.readFileSync(committed).equals(fs.readFileSync(abs))) {
        drifted.push(path.relative(root, committed));
      }
    }
  })(tmp);
  fs.rmSync(tmp, { recursive: true, force: true });
  record("generator drift", drifted.length === 0,
    "node tools/generate.mjs --out <tmp> && diff <tmp> generated/ content/",
    drifted.length ? "Stale generated output (re-run node tools/generate.mjs):\n" + drifted.join("\n") : "");
}

// Map a staged voiced-lesson file to its lesson dir (the ancestor holding meta.js).
function lessonDirOf(p) {
  let d = path.dirname(path.join(root, p));
  const contentRoot = path.join(root, "content");
  while (d.startsWith(contentRoot) && d !== contentRoot) {
    if (fs.existsSync(path.join(d, "meta.js"))) return d;
    d = path.dirname(d);
  }
  return null;
}
function checkI18n(fanOutAll, voicedDirs) {
  const tool = path.join(root, "tools", "i18n-roundtrip.mjs");
  if (fanOutAll) {
    run("i18n round-trip (static, --all)", "node tools/i18n-roundtrip.mjs --all --static", NODE, [tool, "--all", "--static"]);
    return;
  }
  const rels = voicedDirs.map((d) => path.relative(root, d));
  run(`i18n round-trip (static, ${rels.length} lesson${rels.length === 1 ? "" : "s"})`,
    `node tools/i18n-roundtrip.mjs --static ${rels.join(" ")}`, NODE, [tool, "--static", ...voicedDirs]);
}

// The BROWSER round-trip (pre-push): full-fidelity, drives real Chrome. Catches
// the live-swap chrome leaks (breadcrumb, document.title) that --static cannot.
// Writes a persistent testrunner-style report under .audit-gate/ (pass OR fail) so
// a blocked push is postmortem-able without a blind re-run, and records a COMPACT
// summary (leaking lessons + selectors) rather than 80+ PASS lines.
function checkI18nBrowser(fanOutAll, voicedDirs) {
  const tool = path.join(root, "tools", "i18n-roundtrip.mjs");
  const reportDir = path.join(root, ".audit-gate");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const reportPath = path.join(reportDir, `i18n-${stamp}.json`);
  const latest = path.join(reportDir, "i18n-latest.json");

  const targets = fanOutAll ? ["--all"] : voicedDirs;
  const label = fanOutAll
    ? "i18n round-trip (browser, --all)"
    : `i18n round-trip (browser, ${voicedDirs.length} lesson${voicedDirs.length === 1 ? "" : "s"})`;
  const shown = (fanOutAll ? ["--all"] : voicedDirs.map((d) => path.relative(root, d))).join(" ");
  const command = `node tools/i18n-roundtrip.mjs ${shown} --report ${path.relative(root, reportPath)}`;

  const r = spawnSync(NODE, [tool, ...targets, "--report", reportPath], { cwd: root, encoding: "utf8", env: childEnv, maxBuffer: 10 * 1024 * 1024 });
  const passed = r.status === 0;

  let detail = "";
  try {
    fs.mkdirSync(reportDir, { recursive: true });
    if (fs.existsSync(reportPath)) fs.copyFileSync(reportPath, latest);
    const rep = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, "utf8")) : null;
    if (!passed && rep) {
      const leaking = rep.lessons.filter((l) => (l.leaks && l.leaks.length) || l.error);
      detail = `${rep.leaking}/${rep.total} lesson(s) leaked - full report: .audit-gate/i18n-latest.json\n` +
        leaking.map((l) => l.error
          ? `  ${l.lesson}: ERROR ${l.error}`
          : `  ${l.lesson}:\n` + l.leaks.map((k) =>
              `    [${k.lang}] ${k.sel}\n       default: ${trunc(k.original)}\n       leaked : ${trunc(k.leaked)}`).join("\n")
        ).join("\n");
    }
  } catch (e) { detail += `\n(report read failed: ${e.message})`; }
  if (!passed && !detail) detail = (r.stdout || "") + (r.stderr || "");
  record(label, passed, command, detail);
}

// ---------------------------------------------------------------------------
// orchestration
// ---------------------------------------------------------------------------
const ROOT_ENGINES = new Set(["build-engine.js", "drill-engine.js", "page-shell.js"]);
const isBinder = (p) => /^resource\/bind-[^/]+\.js$/.test(p);
const isVoicedFile = (p) => /^content\/.+\/(meta\.js|data\.js|[^/]+\.viz\.js|res\/strings\/.+)$/.test(p);

function planStaged(staged) {
  const jsLike = staged.filter((p) => /\.(js|mjs)$/.test(p));
  checkParseStaged(jsLike);

  if (staged.some((p) => p.startsWith("test/") || p.startsWith("resource/") || ROOT_ENGINES.has(p))) {
    checkTests();
  }
  if (staged.some((p) => p.startsWith("content/") || p === "course-registry.js" || p === "tools/generate.mjs")) {
    checkValidate();
    checkDrift();
  }
  const i18nTriggers = staged.filter((p) => isBinder(p) || p === "page-shell.js" || isVoicedFile(p));
  if (i18nTriggers.length) {
    const fanOutAll = staged.some((p) => isBinder(p) || p === "page-shell.js");
    if (fanOutAll) checkI18n(true, []);
    else {
      const dirs = [...new Set(staged.map(lessonDirOf).filter(Boolean))];
      if (dirs.length) checkI18n(false, dirs);
    }
  }
}

function planAll() {
  checkParseAll(trackedJs());
  checkTests();
  checkValidate();
  checkDrift();
  checkI18n(true, []);
}

// Pre-push: the changed files across every pushed range. git feeds the hook
// "<localref> <localsha> <remoteref> <remotesha>" lines on stdin. A zero remote
// sha (new ref) or a missing origin/master leaves the base unknown -> fan out to
// every voiced lesson.
const ZERO = /^0+$/;
function originMaster() {
  const r = git(["rev-parse", "--verify", "--quiet", "origin/master"]);
  return r.status === 0 && r.stdout.trim() ? r.stdout.trim() : null;
}
function pushChangedFiles() {
  let input = "";
  if (!process.stdin.isTTY) { try { input = fs.readFileSync(0, "utf8"); } catch { input = ""; } }
  const lines = input.split("\n").map((l) => l.trim()).filter(Boolean);
  const ranges = [];
  if (lines.length) {
    for (const line of lines) {
      const parts = line.split(/\s+/);
      const localSha = parts[1], remoteSha = parts[3];
      if (!localSha || ZERO.test(localSha)) continue; // branch deletion
      ranges.push([(remoteSha && !ZERO.test(remoteSha)) ? remoteSha : originMaster(), localSha]);
    }
  } else {
    ranges.push([originMaster(), "HEAD"]); // manual run: compare against origin/master
  }
  const files = new Set();
  let unknownBase = false;
  for (const [base, tip] of ranges) {
    if (!base) { unknownBase = true; continue; }
    const r = git(["diff", "--name-only", base, tip]);
    if (r.status === 0) r.stdout.split("\n").map((s) => s.trim()).filter(Boolean).forEach((f) => files.add(f));
    else unknownBase = true;
  }
  return { files: [...files], unknownBase };
}

function planPush({ files, unknownBase }) {
  const fanOutAll = unknownBase || files.some((p) => isBinder(p) || p === "page-shell.js");
  const triggers = files.filter((p) => isBinder(p) || p === "page-shell.js" || isVoicedFile(p));
  if (!fanOutAll && !triggers.length) return; // nothing i18n-relevant in this push
  if (fanOutAll) { checkI18nBrowser(true, []); return; }
  const dirs = [...new Set(files.map(lessonDirOf).filter(Boolean))];
  if (dirs.length) checkI18nBrowser(false, dirs);
}

function main() {
  const argv = process.argv.slice(2);
  const all = argv.includes("--all");
  const staged = argv.includes("--staged");
  const push = argv.includes("--push");
  const unknown = argv.filter((a) => a !== "--all" && a !== "--staged" && a !== "--push");
  if (unknown.length) { say(`unknown flag(s): ${unknown.join(" ")}`); process.exit(2); }
  if ([all, staged, push].filter(Boolean).length > 1) { say("choose one of --all, --staged or --push"); process.exit(2); }

  const mode = all ? "--all" : push ? "--push" : "--staged";
  say(`${C.dim}audit-gate ${mode}${C.reset}`);
  if (all) {
    planAll();
  } else if (push) {
    planPush(pushChangedFiles());
  } else {
    const files = stagedFiles();
    if (!files.length) { say("no staged changes - nothing to check"); process.exit(0); }
    planStaged(files);
  }

  if (!results.length) { say(`${C.green}PASS${C.reset} no checks triggered by the staged paths`); process.exit(0); }

  let failed = false;
  for (const r of results) {
    say(`  ${r.passed ? C.green + "PASS" : C.red + "FAIL"}${C.reset} ${r.name}`);
    if (!r.passed) {
      failed = true;
      say(`       ${C.dim}$ ${r.command}${C.reset}`);
      if (r.output) say(r.output.split("\n").map((l) => "       " + l).join("\n"));
    }
  }
  say(failed ? `${C.red}audit-gate FAILED${C.reset}` : `${C.green}audit-gate PASSED${C.reset}`);
  process.exit(failed ? 1 : 0);
}

main();
