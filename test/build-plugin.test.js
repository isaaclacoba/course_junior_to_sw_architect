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

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const LessonCommon = require("../kernel/page-shell/lesson-common.js");
const KernelGrading = require("../kernel/grading/output-match.js");
const LessonEngine = require("../kernel/engine/lesson-engine.js");
// Requiring the plugin registers it on the core it require()s (same cached module).
const BuildPlugin = require("../kernel/engine/plugins/build-plugin.js");
const KernelStructure = require("../kernel/grading/structure-match.js");

// The vendored bundle, evaluated once, for its real scanCSharp.
const realScanCSharp = (() => {
  const file = path.join(__dirname, "..", "vendor", "code-lab", "code-lab.global.js");
  const sandbox = { window: {}, console };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox);
  const CL = sandbox.CodeLab || sandbox.window.CodeLab;
  return CL.scanCSharp;
})();

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
    "Blueprint", "BlueprintWrap",
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
  const watchers = [];
  const editor = {
    mount(host, opts) { buffer = (opts && opts.value) || ""; return Promise.resolve(); },
    getValue() { return buffer; },
    setValue(v) { buffer = v; watchers.forEach((w) => w(v)); },
    setMarkers() {},
    onChange(fn) { watchers.push(fn); return () => watchers.splice(watchers.indexOf(fn), 1); },
    // Simulate typing, which is the only way the tracker updates mid-card.
    _type(v) { this.setValue(v); },
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
    // The REAL scanner from the vendored bundle, so the tracker is tested
    // against the same code that drives it in the browser.
    scanCSharp: realScanCSharp,
    _editor: editor,
    _runner: runner,
  };
}

// Install fake browser globals for the length of fn, then restore.
async function withDom(prefix, runQueue, fn) {
  const saved = {};
  ["document", "window", "history", "location", "LessonCommon", "KernelGrading", "KernelStructure", "CodeLab"].forEach((k) => {
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
  globalThis.KernelStructure = KernelStructure; // the REAL structure policy
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

// ---- the live goal tracker -------------------------------------------------
// The blueprint and the goal ticks read the learner's buffer through the REAL
// scanner and the REAL structure policy, so these prove the whole chain, not a
// mock of it. The tracker is a guide: it must never award anything.

// A task whose shape is the split Cat/FeedingSign - the SRP move the lesson
// teaches - so the tracker has something to light up one piece at a time.
function trackerConfig() {
  const cfg = buildConfig();
  cfg.tasks[0].goal = ["give `Cat` an `IsHungry()`", "write a `FeedingSign`", "no method does both"];
  cfg.tasks[0].blueprint = [
    { name: "Cat", kind: "class", members: ["bool IsHungry()"] },
    { name: "FeedingSign", kind: "class", members: ["string Format(bool hungry)"] },
  ];
  cfg.tasks[0].goalCheck = [
    { type: "Cat", member: "IsHungry" },
    { type: "FeedingSign", member: "Format" },
    { absent: "CheckAndSign" },
  ];
  return cfg;
}

const HALF = "public class Cat { public bool IsHungry() { return true; } }";
const WHOLE =
  HALF + '\npublic class FeedingSign { public string Format(bool hungry) { return hungry ? "FEED" : "FULL"; } }';

test("the blueprint is shown for a task that declares one, and hidden otherwise", async () => {
  await withDom("bd", [], async (dom) => {
    await LessonEngine.create(trackerConfig()).boot();
    assert.equal(dom.getElementById("bdBlueprintWrap").hidden, false);
    assert.match(dom.getElementById("bdBlueprint").innerHTML, /Cat/);
  });
  await withDom("bd", [], async (dom) => {
    await LessonEngine.create(buildConfig()).boot(); // no blueprint authored
    assert.equal(dom.getElementById("bdBlueprintWrap").hidden, true);
  });
});

test("a blueprint box lights up only once its own members are declared", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(trackerConfig()).boot();
    const html = () => dom.getElementById("bdBlueprint").innerHTML;
    // Match only a box's own opening tag - bp-box-head and bp-chip also carry
    // an is-met class, so a substring search would read the wrong element.
    const boxes = () => [...html().matchAll(/<div class="bp-box( is-met)?">/g)].map((m) => !!m[1]);

    // The starter declares neither type: both boxes are ghosts.
    assert.deepEqual(boxes(), [false, false], "nothing should be met on the starter");

    codeLab._editor._type(HALF);
    assert.deepEqual(boxes(), [true, false], "Cat is declared, FeedingSign is not");

    codeLab._editor._type(WHOLE);
    assert.deepEqual(boxes(), [true, true]);
  });
});

test("the member signature is shown as the hint, and lights per member", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(trackerConfig()).boot();
    const html = () => dom.getElementById("bdBlueprint").innerHTML;
    // The signature is the help: it says what to write without writing it.
    assert.match(html(), /bool IsHungry\(\)/);
    assert.match(html(), /string Format\(bool hungry\)/);
    assert.equal(/<li class="bp-chip is-met">bool IsHungry\(\)/.test(html()), false);

    codeLab._editor._type(HALF);
    assert.equal(/<li class="bp-chip is-met">bool IsHungry\(\)/.test(html()), true);
  });
});

test("a declared type with a missing member stays unmet", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(trackerConfig()).boot();
    codeLab._editor._type("public class Cat { }");
    const html = dom.getElementById("bdBlueprint").innerHTML;
    const boxes = [...html.matchAll(/<div class="bp-box( is-met)?">/g)].map((m) => !!m[1]);
    assert.deepEqual(boxes, [false, false], "an empty Cat is not the shape asked for");
  });
});

test("goal items get a tick as their gate is met, and keep their prose", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(trackerConfig()).boot();
    const items = dom.getElementById("bdGoal").children;
    assert.equal(items.length, 3);

    // The starter has no CheckAndSign, so gate 3 is met from the start.
    assert.equal(items[2].classList.contains("is-met"), true);
    assert.equal(items[0].classList.contains("is-met"), false);

    codeLab._editor._type(WHOLE);
    assert.equal(items[0].classList.contains("is-met"), true);
    assert.equal(items[1].classList.contains("is-met"), true);
    // The localized prose the core painted survives the tick.
    assert.match(items[0].innerHTML, /IsHungry/);
    assert.match(items[1].innerHTML, /FeedingSign/);
  });
});

test("ticks do not accumulate when the same goal is repainted many times", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(trackerConfig()).boot();
    const li = dom.getElementById("bdGoal").children[0];
    for (let i = 0; i < 5; i++) {
      codeLab._editor._type(WHOLE);
      codeLab._editor._type("");
    }
    codeLab._editor._type(WHOLE);
    const ticks = (li.innerHTML.match(/tracker-tick/g) || []).length;
    assert.equal(ticks, 1, `goal item grew ${ticks} ticks`);
  });
});

test("a met tracker awards nothing on its own - only a real run can pass a card", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(trackerConfig()).boot();
    codeLab._editor._type(WHOLE); // every gate met
    assert.equal(dom.getElementById("bdResult").hidden, true);
    assert.match(dom.getElementById("courseXpLabel").textContent, /\b0\b/);
  });
});

test("the tracker survives an editor that cannot report changes", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    delete codeLab._editor.onChange;
    await LessonEngine.create(trackerConfig()).boot();
    // Still painted once from the starter; simply not live.
    assert.equal(dom.getElementById("bdBlueprintWrap").hidden, false);
    assert.match(dom.getElementById("bdBlueprint").innerHTML, /Cat/);
  });
});

test("the blueprint stays hidden when the bundle has no scanner", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    delete codeLab.scanCSharp;
    await LessonEngine.create(trackerConfig()).boot();
    assert.equal(dom.getElementById("bdBlueprintWrap").hidden, true, "a panel that can never light up must not show");
  });
});

test("Show Solution lights the whole blueprint", async () => {
  await withDom("bd", [], async (dom) => {
    const cfg = trackerConfig();
    cfg.tasks[0].solution = WHOLE + "\nclass Program { static void Main() { } }";
    await LessonEngine.create(cfg).boot();
    dom.getElementById("bdSolution").click();
    const html = dom.getElementById("bdBlueprint").innerHTML;
    assert.equal((html.match(/bp-box is-met/g) || []).length, 2, "the authored solution must satisfy its own blueprint");
  });
});

// Card 2 and card 7 in the real SOLID lesson author a null gate: their last
// goals are about OUTPUT, which only a run can settle. Those lines must not
// grow a checkbox, because a checkbox that never fills reads as "you got this
// wrong" for a learner who in fact got it right.
test("a goal with no structural test shows a spacer, never an unfillable box", async () => {
  const cfg = trackerConfig();
  cfg.tasks[0].goalCheck = [{ type: "Cat", member: "IsHungry" }, null, { absent: "CheckAndSign" }];
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(cfg).boot();
    const items = dom.getElementById("bdGoal").children;
    codeLab._editor._type(WHOLE);

    assert.match(items[1].innerHTML, /tracker-tick--none/, "the untracked goal keeps its indent");
    assert.doesNotMatch(items[1].innerHTML, /\u2713/, "the untracked goal shows no tick");
    assert.equal(items[1].classList.contains("is-met"), false);
    assert.match(items[1].innerHTML, /FeedingSign/, "and it keeps its prose");

    // Its neighbours still behave.
    assert.equal(items[0].classList.contains("is-met"), true);
    assert.match(items[0].innerHTML, /\u2713/);
  });
});
