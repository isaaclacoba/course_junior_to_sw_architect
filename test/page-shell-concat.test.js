"use strict";

// test/page-shell-concat.test.js - invariants for the page-shell concatenation
// pipeline: tools/generate.mjs (pageShellFile + orphan guard) and
// tools/audit-gate.mjs (ROOT_ARTIFACTS mapping).
//
// Run: node --test test/page-shell-concat.test.js

const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const GENERATE = path.join(ROOT, "tools", "generate.mjs");
const KERNEL_DIR = path.join(ROOT, "kernel", "page-shell");
const PAGE_SHELL = path.join(ROOT, "page-shell.js");
const AUDIT_GATE = path.join(ROOT, "tools", "audit-gate.mjs");

function runGenerate(extraArgs) {
  return spawnSync(process.execPath, [GENERATE, ...(extraArgs || [])], {
    cwd: ROOT,
    encoding: "utf8",
  });
}

// 1. Reproducibility: generator output is byte-identical to the committed artifact.
//    This is the drift guarantee: if it fails, page-shell.js is stale and
//    `node tools/generate.mjs` must be re-run.
test("generate.mjs --out produces page-shell.js byte-identical to the committed artifact", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ps-repro-"));
  try {
    const r = runGenerate(["--out", tmp]);
    assert.equal(r.status, 0,
      "generator exited non-zero:\n" + (r.stdout || "") + (r.stderr || ""));
    const generated = fs.readFileSync(path.join(tmp, "page-shell.js"));
    const committed = fs.readFileSync(PAGE_SHELL);
    assert.ok(generated.equals(committed),
      "Generated page-shell.js differs from committed artifact - " +
      "run `node tools/generate.mjs` to update page-shell.js");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

// 2. Orphan guard: a .js file in kernel/page-shell/ that is absent from
//    PAGE_SHELL_MODULES must cause the generator to fail and name the file in
//    its error output. The stray file is always removed in a finally block.
test("orphan guard: stray .js in kernel/page-shell/ causes generator to fail naming it", () => {
  const stray = path.join(KERNEL_DIR, "_test_stray_orphan_ps.js");
  try {
    fs.writeFileSync(stray, "// temporary stray file created by test\n");
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ps-orphan-"));
    try {
      const r = runGenerate(["--out", tmp]);
      assert.notEqual(r.status, 0,
        "generator should have failed with orphan error but exited 0");
      const output = (r.stdout || "") + (r.stderr || "");
      assert.match(output, /_test_stray_orphan_ps\.js/,
        "error output must name the stray file; got:\n" + output);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  } finally {
    if (fs.existsSync(stray)) fs.unlinkSync(stray);
  }
});

// 3. Manifest completeness: the set of .js files on disk in kernel/page-shell/
//    (excluding _header.js) must equal the set of entries in PAGE_SHELL_MODULES.
//    Both directions: every disk file is in the manifest, every manifest entry
//    exists on disk.
test("manifest completeness: disk files and PAGE_SHELL_MODULES entries are in sync", () => {
  const src = fs.readFileSync(GENERATE, "utf8");

  // Extract file names from the PAGE_SHELL_MODULES array literal only.
  const block = src.match(/const PAGE_SHELL_MODULES\s*=\s*\[([\s\S]*?)\];/);
  assert.ok(block, "PAGE_SHELL_MODULES array must be present in generate.mjs");
  const manifest = [...block[1].matchAll(/file:\s*"([^"]+\.js)"/g)].map(m => m[1]);
  assert.ok(manifest.length > 0, "PAGE_SHELL_MODULES must have at least one entry");

  const diskFiles = fs.readdirSync(KERNEL_DIR)
    .filter(f => f.endsWith(".js") && f !== "_header.js");

  for (const f of diskFiles) {
    assert.ok(manifest.includes(f),
      `${f} is on disk in kernel/page-shell/ but is not listed in PAGE_SHELL_MODULES`);
  }
  for (const f of manifest) {
    assert.ok(fs.existsSync(path.join(KERNEL_DIR, f)),
      `PAGE_SHELL_MODULES entry "${f}" has no corresponding file in kernel/page-shell/`);
  }
});

// 4. Structural shape: the generated artifact must contain exactly one
//    (function () { IIFE opening and end with })(); — and it must parse.
test("generated page-shell.js has exactly one IIFE opening, ends with })();, and parses", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ps-shape-"));
  try {
    const r = runGenerate(["--out", tmp]);
    assert.equal(r.status, 0,
      "generator failed: " + (r.stdout || "") + (r.stderr || ""));
    const src = fs.readFileSync(path.join(tmp, "page-shell.js"), "utf8");

    const opens = (src.match(/\(function \(\) \{/g) || []).length;
    assert.equal(opens, 1,
      `expected exactly one "(function () {" but found ${opens}`);
    assert.ok(src.trimEnd().endsWith("})();"),
      'page-shell.js must end with "})();"');

    const check = spawnSync(process.execPath, ["--check", path.join(tmp, "page-shell.js")],
      { encoding: "utf8" });
    assert.equal(check.status, 0,
      "page-shell.js does not parse cleanly:\n" + check.stderr);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

// 5. ROOT_ARTIFACTS mapping: audit-gate.mjs must define ROOT_ARTIFACTS containing
//    "page-shell.js" and must route it to the repo root rather than generated/.
//    Two checks: source-level (the logic is present) and behavioural (the file
//    does not exist under generated/).
test("ROOT_ARTIFACTS: page-shell.js is mapped to repo root, not generated/", () => {
  const src = fs.readFileSync(AUDIT_GATE, "utf8");

  assert.match(src, /ROOT_ARTIFACTS\s*=\s*new Set\(\[/,
    "ROOT_ARTIFACTS Set must be defined in audit-gate.mjs");
  assert.match(src, /"page-shell\.js"/,
    'ROOT_ARTIFACTS must include "page-shell.js"');

  // The drift walker must branch on ROOT_ARTIFACTS to choose "" (root) over
  // "generated" as the target subdirectory for top-level mirror files.
  assert.match(src, /ROOT_ARTIFACTS\.has\(rel\)\s*\?\s*""\s*:\s*"generated"/,
    'drift walker must contain ROOT_ARTIFACTS.has(rel) ? "" : "generated"');

  // Behavioural: page-shell.js lives at the repo root, not under generated/.
  assert.ok(!fs.existsSync(path.join(ROOT, "generated", "page-shell.js")),
    "page-shell.js must not exist under generated/ - it belongs at the repo root");
  assert.ok(fs.existsSync(PAGE_SHELL),
    "page-shell.js must exist at the repo root");
});
