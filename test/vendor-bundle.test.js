"use strict";

// The vendored bundle has to EVALUATE, not just exist.
//
// This exists because of a real failure: a new core module called
// `new TextEncoder()` at its top level. Browsers have it, so every page was
// fine; the Node sandbox the validators and verifiers use does not, so the whole
// IIFE threw on load and handed back an EMPTY `CodeLab`. Thirty-six unrelated
// tests failed with "cl.gitInit is not a function", and the validator reported
// "no C# scanner" - two symptoms that both point away from the actual cause.
//
// One assertion per public surface the course actually calls, so the next
// load-time mistake names itself.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const ROOT = path.dirname(__dirname);

async function bundle() {
  const { loadCodeLab } = await import(
    "file://" + path.join(ROOT, "tools", "lib", "codelab-sandbox.mjs")
  );
  return loadCodeLab();
}

test("the vendored bundle evaluates under Node and is not empty", async () => {
  const cl = await bundle();
  assert.ok(
    Object.keys(cl).length > 50,
    `CodeLab has ${Object.keys(cl).length} exports - an almost-empty bundle means the IIFE threw`,
  );
});

test("every surface the course calls off the bundle is present", async () => {
  const cl = await bundle();
  // The git runtime the practical lessons are graded against, the C# scanner the
  // goal gates need, the scene resolvers the viz lessons mount, and the widgets.
  for (const name of [
    "gitInit", "gitAddFiles", "gitRun",
    "scanCSharp",
    "resolveRepo", "resolveObjects", "replayObjects", "chainRows",
    "MemoryViz", "Quiz", "MonacoEditor", "RoslynIframeRunner",
  ]) {
    assert.equal(typeof cl[name], "function", `CodeLab.${name} is missing from the bundle`);
  }
});

test("the object store still agrees with real git", async () => {
  // The one id a learner is told to check on their own machine. If a re-vendor
  // ever ships a store that disagrees, the track starts telling a lie the
  // learner can catch, and it should fail here first.
  const cl = await bundle();
  const store = new cl.ObjectStore();
  assert.equal(store.writeBlob("hello world\n"), "3b18e512dba79e4c8300dd08aeb37f8e728b8dad");
});
