// test/kernel-controller-deps.test.js - the archetype -> pre-plugin dependency
// map in resource/kernel-controller.js.
//
// WHY A SOURCE-LEVEL TEST
// kernel-controller.js is an IIFE that boots inside a browser against live DOM
// and injected globals; it cannot be require()d into a Node process (same reason
// as test/localizable-contract.test.js). But ARCHETYPE_DEPS is a plain data
// literal, so this is not a regex over prose: the literal is extracted and
// EVALUATED, then asserted as data - including that every path it names is a
// file that actually exists in the repo. A typo'd dependency path fails here,
// not silently at runtime in a learner's browser.

"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.dirname(__dirname);
const CONTROLLER = path.join(ROOT, "resource", "kernel-controller.js");
const src = () => fs.readFileSync(CONTROLLER, "utf8");

// Pull the balanced { ... } that follows a declaration and evaluate it. The
// JSON round-trip re-homes the value into this realm so deepEqual can see it.
function literalAfter(text, declaration) {
  const i = text.indexOf(declaration);
  assert.ok(i >= 0, "declaration not found: " + declaration);
  const start = text.indexOf("{", i);
  let depth = 0;
  for (let j = start; j < text.length; j++) {
    if (text[j] === "{") depth++;
    else if (text[j] === "}" && --depth === 0) {
      return JSON.parse(JSON.stringify(
        vm.runInNewContext("(" + text.slice(start, j + 1) + ")")
      ));
    }
  }
  throw new Error("unbalanced braces after " + declaration);
}

const deps = () => literalAfter(src(), "var ARCHETYPE_DEPS =");

// The grader decides whether a RUN passed; the structure policy decides what the
// live goal tracker shows while the learner types. Both must be on the page
// before the build plugin boots - and a missing structure-match is invisible
// rather than loud (the tracker just never draws), so it is pinned here.
test("build loads its grader AND the structure policy the tracker reads", () => {
  assert.deepEqual(deps().build, [
    "kernel/grading/output-match.js",
    "kernel/grading/structure-match.js",
    "kernel/engine/widgets/goal-tracker.js",
    "kernel/engine/widgets/csharp-goal-provider.js",
  ]);
});

test("git loads its graders AND the shared progress module, in that order", () => {
  // git grades in two dimensions: the commit DAG (shape) and the three-area end
  // state (which files a commit touched, what is staged, what is modified). Both
  // must load before git-progress, which composes them. git-task comes first:
  // it is how an authored task is READ, which the plugin needs before anything
  // can be graded at all.
  assert.deepEqual(deps().git, [
    "kernel/grading/git-task.js",
    "kernel/grading/dag-match.js",
    "kernel/grading/state-match.js",
    "kernel/engine/git-progress.js",
    "kernel/engine/widgets/goal-tracker.js",
    // The policy must precede the provider: the provider looks its policy up on
    // the window, and with the order swapped the git tracker silently draws
    // nothing at all rather than failing loudly.
    "kernel/grading/git-goal-match.js",
    "kernel/engine/widgets/git-goal-provider.js",
  ]);
});

test("the archetypes with no grading module declare nothing", () => {
  const map = deps();
  ["drill", "viz", "checkpoint"].forEach((a) => {
    assert.equal(map[a], undefined, a + " must not declare dependencies");
  });
});

test("every declared dependency is a real file", () => {
  const map = deps();
  Object.keys(map).forEach((archetype) => {
    map[archetype].forEach((rel) => {
      assert.ok(fs.existsSync(path.join(ROOT, rel)),
        archetype + " declares a missing dependency: " + rel);
    });
  });
});

test("every archetype in the map has a plugin to depend on", () => {
  Object.keys(deps()).forEach((archetype) => {
    assert.ok(
      fs.existsSync(path.join(ROOT, "kernel", "engine", "plugins", archetype + "-plugin.js")),
      "no plugin for archetype " + archetype
    );
  });
});

test("the boot chain is driven by the map, not by an archetype ladder", () => {
  // Strip comments so prose mentioning an archetype cannot satisfy the check.
  const code = src().replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
  assert.match(code, /ARCHETYPE_DEPS\[archetype\]/,
    "the injection chain must read ARCHETYPE_DEPS[archetype]");
  assert.doesNotMatch(code, /archetype === "(build|git|drill|viz|checkpoint)"/,
    "engine injection must not special-case an archetype by name");
  assert.doesNotMatch(code, /injectScript\(repoBase \+ "kernel\/grading/,
    "grading modules must come from the map, not a hardcoded injectScript call");
});
