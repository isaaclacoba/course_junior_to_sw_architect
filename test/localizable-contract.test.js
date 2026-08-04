// test/localizable-contract.test.js - enforces the Localizable surface contract.
//
// WHY SOURCE GUARDS (not behavioural tests):
// kernel-controller.js is an IIFE that boots inside a browser with live DOM,
// injected scripts, and global state (PageShellHero, LessonEngine, etc). It
// cannot be imported into a Node test process. The plugins likewise register
// themselves on a global and are not importable as modules. So we verify the
// contract at the SOURCE level: the same approach used in lesson-body.test.js
// for verify-lesson.mjs (lines 120-140 of that file explain the reasoning).
//
// The tests here MUST FAIL when:
// (a) a plugin stops exporting setLocale in its returned shape
// (b) the kernel-controller's registerSurface guard is removed or weakened
// (c) the early-return for missing cfg/archetype becomes silent again

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

var ROOT = path.dirname(__dirname);

// ---------------------------------------------------------------------------
// (1) Every plugin exposes setLocale in its returned object literal.
// ---------------------------------------------------------------------------
var PLUGINS = ["build", "drill", "checkpoint", "viz"];

PLUGINS.forEach(function (name) {
  test("plugin " + name + " exposes setLocale in its return shape", function () {
    var src = fs.readFileSync(
      path.join(ROOT, "kernel", "engine", "plugins", name + "-plugin.js"),
      "utf8"
    );
    // Strip comments so we only match real code, not mentions in prose.
    var code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
    // Look for setLocale as a property key (not as a substring of another name).
    // The pattern requires a word boundary before setLocale.
    var hasSetLocale = /\bsetLocale\s*:\s*function/.test(code);
    assert.ok(
      hasSetLocale,
      name + "-plugin.js must expose a setLocale method but none was found in code"
    );
  });
});

// ---------------------------------------------------------------------------
// (2) kernel-controller uses registerSurface (not raw push) and the guard
//     emits console.error for a surface lacking setLocale.
// ---------------------------------------------------------------------------
test("kernel-controller registers surfaces through registerSurface, not raw push", function () {
  var src = fs.readFileSync(
    path.join(ROOT, "resource", "kernel-controller.js"),
    "utf8"
  );
  // registerSurface must exist as a function
  assert.match(src, /function registerSurface\(/,
    "registerSurface() helper must be defined");
  // All surface registrations must use registerSurface. The ONLY raw
  // surfaces.push allowed is the one INSIDE registerSurface itself.
  var lines = src.split("\n");
  var violations = [];
  var insideRegisterSurface = false;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (/function registerSurface\(/.test(line)) insideRegisterSurface = true;
    // registerSurface ends at the next dedent-closing-brace (2-space indent)
    if (insideRegisterSurface && i > 0 && /^  \}/.test(line) && !/function/.test(line)) {
      insideRegisterSurface = false;
    }
    if (!insideRegisterSurface && /surfaces\.push\(/.test(line)) {
      violations.push("line " + (i + 1) + ": " + line.trim());
    }
  }
  assert.equal(violations.length, 0,
    "Raw surfaces.push() found outside registerSurface:\n" + violations.join("\n"));
});

test("registerSurface emits console.error for a surface without setLocale", function () {
  var src = fs.readFileSync(
    path.join(ROOT, "resource", "kernel-controller.js"),
    "utf8"
  );
  // Extract the registerSurface function body
  var match = src.match(/function registerSurface\([\s\S]*?\n  \}/);
  assert.ok(match, "registerSurface function must be extractable");
  var body = match[0];
  // Strip single-line comments so a commented-out console.error does not pass
  var code = body.replace(/\/\/.*/g, "");
  assert.match(code, /typeof\s+\S+\.setLocale\s*!==?\s*"function"/,
    "registerSurface must check typeof .setLocale");
  assert.match(code, /console\.error/,
    "registerSurface must emit console.error for a missing setLocale");
});

// ---------------------------------------------------------------------------
// (3) The early return for missing cfg/archetype is loud (console.error).
// ---------------------------------------------------------------------------
test("missing LESSON_CONFIG or archetype triggers console.error, not a silent return", function () {
  var src = fs.readFileSync(
    path.join(ROOT, "resource", "kernel-controller.js"),
    "utf8"
  );
  // The boot chain (not bind()) has the guard that must be loud. It lives after
  // the "Every archetype now boots" comment and before cfg.archetype = archetype.
  var bootSection = src.split("Every archetype now boots")[1];
  assert.ok(bootSection, "boot section must exist after 'Every archetype' comment");
  var cfgBlock = bootSection.match(/var cfg = global\.LESSON_CONFIG;[\s\S]*?return;\s*\}/);
  assert.ok(cfgBlock, "cfg/archetype guard block must exist in boot section");
  // Strip comments so a commented-out error does not satisfy the check
  var code = cfgBlock[0].replace(/\/\/.*/g, "");
  assert.match(code, /console\.error/,
    "the cfg/archetype guard must emit console.error before returning");
  assert.match(code, /LESSON_CONFIG|archetype/,
    "the error message must name what is missing");
});
