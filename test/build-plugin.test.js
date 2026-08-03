"use strict";

// Unit tests for the "build" archetype PLUGIN - kernel/engine/plugins/build-plugin.js.
//
// These prove the plugin drives its archetype middle (Monaco surface, Roslyn run,
// grade, Show Solution, Reset) and reports back through the generic core so the
// core's shared chrome (XP award, result panel) responds. Grading is the REAL
// kernel/grading/output-match.js, exercised with SCRIPTED runner output - no
// Monaco, no Roslyn, no dotnet. Because the grader module is the exact one the
// browser engine and the Node verifier use, real-dotnet equivalence is by
// construction; here we only feed it fake program output.
//
// Same hand-built fake DOM approach as test/lesson-engine.test.js (there is no
// jsdom in this repo).

const test = require("node:test");
const assert = require("node:assert/strict");

const LessonCommon = require("../kernel/page-shell/lesson-common.js");
const KernelGrading = require("../kernel/grading/output-match.js");
const LessonEngine = require("../kernel/engine/lesson-engine.js");
// Requiring the plugin registers it on the core it require()s (same cached module).
const BuildPlugin = require("../kernel/engine/plugins/build-plugin.js");

// ---- minimal fake DOM ------------------------------------------------------
function makeEl(id) {
  const classes = new Set();
  const listeners = {};
  return {
    id,
    textContent: "",
    innerHTML: "",
    hidden: true,
    disabled: false,
    classList: {
      toggle(cls, on) { if (on) classes.add(cls); else classes.delete(cls); },
      add(cls) { classes.add(cls); },
      remove(cls) { classes.delete(cls); },
      contains(cls) { return classes.has(cls); },
    },
    appendChild(child) { (this.children = this.children || []).push(child); return child; },
    closest() { return null; },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    click() { (listeners.click || []).forEach((fn) => fn({})); },
  };
}

// Build a document whose getElementById serves the ids the core AND the build
// plugin query for a given prefix, plus the global courseXpLabel.
function makeDom(prefix) {
  const ids = [
    // core chrome
    "Meta", "Title", "Context", "Concept", "Progress", "Goal",
    "Result", "ResultTitle", "ResultBody",
    "Summary", "SummaryIntro", "SummaryList", "SummaryClose",
    "Prev", "Next",
    // build host roles
    "Editor", "Example", "Expected", "Output", "Errors",
    "Run", "Solution", "Reset",
  ].map((s) => prefix + s);
  const registry = {};
  ids.forEach((id) => { registry[id] = makeEl(id); });
  registry["courseXpLabel"] = makeEl("courseXpLabel");
  return {
    getElementById(id) { return registry[id] || null; },
    createElement(tag) { return makeEl("<" + tag + ">"); },
  };
}

// A fake CodeLab: a Monaco editor with get/setValue, a no-op loadMonaco, and a
// Roslyn runner whose run() returns a SCRIPTED result queue (or a default).
function makeCodeLab(runQueue) {
  let buffer = "";
  const editor = {
    mount(host, opts) { buffer = (opts && opts.value) || ""; return Promise.resolve(); },
    getValue() { return buffer; },
    setValue(v) { buffer = v; },
    setMarkers() {},
  };
  const runner = {
    warmed: false,
    warm() { this.warmed = true; return Promise.resolve(); },
    run(_src) {
      const next = runQueue.length ? runQueue.shift() : { output: "" };
      return Promise.resolve(next);
    },
  };
  return {
    loadMonaco() { return Promise.resolve(); },
    MonacoEditor: function () { return editor; },
    RoslynIframeRunner: function () { return runner; },
    _editor: editor,
    _runner: runner,
  };
}

// Install fake browser globals for the length of fn, then restore.
async function withDom(prefix, runQueue, fn) {
  const saved = {};
  ["document", "window", "history", "location", "LessonCommon", "KernelGrading", "CodeLab"].forEach((k) => {
    saved[k] = { had: Object.prototype.hasOwnProperty.call(globalThis, k), val: globalThis[k] };
  });
  const dom = makeDom(prefix);
  const codeLab = makeCodeLab(runQueue);
  globalThis.document = dom;
  globalThis.location = { hash: "", href: "" };
  globalThis.history = { replaceState() {} };
  globalThis.window = { location: { href: "" }, addEventListener() {}, PAGE: { nextHref: "next-lesson.html" } };
  LessonCommon.storage = LessonCommon.memoryStorage();
  globalThis.LessonCommon = LessonCommon;
  globalThis.KernelGrading = KernelGrading; // the REAL grader
  globalThis.CodeLab = codeLab;
  try {
    return await fn(dom, codeLab);
  } finally {
    Object.keys(saved).forEach((k) => {
      if (saved[k].had) globalThis[k] = saved[k].val;
      else delete globalThis[k];
    });
  }
}

// A one-task build config. expected "Woof" is graded against scripted runner output.
function buildConfig() {
  return {
    archetype: "build",
    prefix: "bd",
    xpKey: "xp",
    awardedKey: "aw",
    awardAmount: 20,
    metaLabel: "Build track",
    progressNoun: "Task",
    tasks: [
      {
        title: "Print Woof",
        context: "Make a dog **bark**.",
        concept: "output",
        goal: ["print Woof"],
        starter: 'class Program { static void Main() { /* TODO */ } }',
        solution: 'class Program { static void Main() { System.Console.WriteLine("Woof"); } }',
        example: 'class Demo { static void Main() { System.Console.WriteLine("Hi"); } }',
        expected: "Woof",
      },
    ],
  };
}

// Flush microtasks so the plugin's promise chain (run -> grade -> report) settles.
function flush() { return new Promise((r) => setImmediate(r)); }

// ---------------------------------------------------------------------------

test("the build plugin is registered under archetype 'build'", () => {
  assert.equal(BuildPlugin.archetype, "build");
  assert.equal(LessonEngine.plugins.build, BuildPlugin);
});

test("mount loads Monaco, seeds the editor, and warms the runner", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    const controller = LessonEngine.create(buildConfig());
    await controller.boot();
    // renderCard put the starter into the editor
    assert.match(codeLab._editor.getValue(), /TODO/);
    // expected line painted, example colorized (plain text without Monaco)
    assert.equal(dom.getElementById("bdExpected").textContent, "Woof");
    assert.match(dom.getElementById("bdExample").textContent, /Hi/);
    // runner warmed
    assert.equal(codeLab._runner.warmed, true);
  });
});

test("a Run whose output matches awards XP and paints a green pass", async () => {
  // Scripted runner output: the visible run prints Woof.
  await withDom("bd", [{ output: "Woof\n" }], async (dom, codeLab) => {
    const controller = LessonEngine.create(buildConfig());
    await controller.boot();

    // learner types the correct code, then clicks Run
    codeLab._editor.setValue('class Program { static void Main() { System.Console.WriteLine("Woof"); } }');
    dom.getElementById("bdRun").click();
    await flush();

    const reader = LessonCommon.createProgress({ storage: LessonCommon.storage, xpKey: "xp", awardedKey: "aw" });
    assert.equal(reader.xp(), 20, "core awarded XP on pass");

    const result = dom.getElementById("bdResult");
    assert.equal(result.hidden, false);
    assert.equal(result.classList.contains("is-pass"), true);
    assert.equal(dom.getElementById("bdOutput").textContent, "Woof");
  });
});

test("a Run whose output does not match paints a red fail and awards nothing", async () => {
  await withDom("bd", [{ output: "Meow\n" }], async (dom, codeLab) => {
    const controller = LessonEngine.create(buildConfig());
    await controller.boot();

    dom.getElementById("bdRun").click();
    await flush();

    const reader = LessonCommon.createProgress({ storage: LessonCommon.storage, xpKey: "xp", awardedKey: "aw" });
    assert.equal(reader.xp(), 0, "no XP on a mismatch");

    const result = dom.getElementById("bdResult");
    assert.equal(result.classList.contains("is-fail"), true);
    // the mapped mismatch message (English fallback, no ChromeText active)
    assert.match(dom.getElementById("bdResultBody").textContent, /Expected a line equal to "Woof"/);
  });
});

test("a compile error reports a fail without invoking the grader", async () => {
  await withDom("bd", [{ errors: [{ raw: "CS1002", friendly: "missing ;" }] }], async (dom) => {
    const controller = LessonEngine.create(buildConfig());
    await controller.boot();

    dom.getElementById("bdRun").click();
    await flush();

    const result = dom.getElementById("bdResult");
    assert.equal(result.classList.contains("is-fail"), true);
    assert.match(dom.getElementById("bdResultBody").textContent, /did not compile/);
  });
});

test("Show Solution puts the reference solution into the editor", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    const controller = LessonEngine.create(buildConfig());
    await controller.boot();

    dom.getElementById("bdSolution").click();
    assert.match(codeLab._editor.getValue(), /WriteLine\("Woof"\)/);
  });
});

test("Reset restores the starter", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    const controller = LessonEngine.create(buildConfig());
    await controller.boot();

    codeLab._editor.setValue("garbage the learner typed");
    dom.getElementById("bdReset").click();
    assert.match(codeLab._editor.getValue(), /TODO/);
  });
});
