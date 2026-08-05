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
  const attrs = {};
  // Stubs for elements written into this one via innerHTML, looked up by class
  // selector. The Run button paints boot progress that way, and a stub without
  // querySelector would let that whole path go untested.
  const inner = {};
  const el = {
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
    setAttribute(name, value) { attrs[name] = String(value); },
    getAttribute(name) { return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null; },
    removeAttribute(name) { delete attrs[name]; },
    hasAttribute(name) { return Object.prototype.hasOwnProperty.call(attrs, name); },
    querySelector(sel) {
      const cls = sel.charAt(0) === "." ? sel.slice(1) : sel;
      if (!(el.innerHTML || "").includes('class="' + cls + '"')) return null;
      if (!inner[cls]) {
        const child = makeEl(id + "/" + cls);
        child.style = {};
        // A real button reports its descendants' text, which is what the boot
        // label writes into and what a test reads back off the button.
        Object.defineProperty(child, "textContent", {
          get() { return child._text || ""; },
          set(v) { child._text = v; el.textContent = v; },
          configurable: true,
        });
        inner[cls] = child;
      }
      return inner[cls];
    },
    appendChild(child) { (this.children = this.children || []).push(child); return child; },
    closest() { return null; },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    click() { (listeners.click || []).forEach((fn) => fn({})); },
  };
  // innerHTML replaces the children, so cached lookups must not survive it.
  let html = "";
  Object.defineProperty(el, "innerHTML", {
    get() { return html; },
    set(v) { html = v == null ? "" : String(v); Object.keys(inner).forEach((k) => delete inner[k]); },
    configurable: true,
  });
  return el;
}

// Parse innerHTML-set <li> elements into fake child objects for assertion.
// The UML box tracker sets list.innerHTML = html; the fake DOM needs to turn
// that into children with classList and innerHTML so tests can check ticks.
function parseLiChildren(html) {
  const items = [];
  const re = /<li\s+class="([^"]*)">([\s\S]*?)<\/li>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const classes = new Set(m[1].split(/\s+/).filter(Boolean));
    items.push({
      innerHTML: m[2],
      classList: {
        contains(cls) { return classes.has(cls); },
        toggle(cls, on) { if (on) classes.add(cls); else classes.delete(cls); },
        add(cls) { classes.add(cls); },
        remove(cls) { classes.delete(cls); },
      },
    });
  }
  return items;
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
  ids.forEach((id) => {
    const el = makeEl(id);
    // The Goal host uses innerHTML-based rendering; its children are parsed from HTML.
    if (id.endsWith("Goal")) {
      // The core paints goals with appendChild; the tracker then replaces the
      // list wholesale via innerHTML. Read children from whichever happened
      // last, so the getter cannot fight appendChild's assignment.
      var appended = [];
      Object.defineProperty(el, "children", {
        get() {
          const parsed = parseLiChildren(el.innerHTML || "");
          return parsed.length ? parsed : appended;
        },
        set(v) { appended = v || []; },
        configurable: true,
      });
    }
    registry[id] = el;
  });
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
    // Set by a test to make the boot fail the way a stale cached runtime does.
    warmError: null,
    // Set by a test to hold the boot open, so the phases the button paints
    // during the wait can be observed rather than raced past.
    holdWarm: false,
    releaseWarm: null,
    warm() {
      this.warmed = true;
      if (this.warmError) return Promise.reject(this.warmError);
      if (!this.holdWarm) return Promise.resolve();
      return new Promise((resolve) => { this.releaseWarm = resolve; });
    },
    run(_src) {
      const next = runQueue.length ? runQueue.shift() : { output: "" };
      return Promise.resolve(next);
    },
  };
  return {
    loadMonaco() { return Promise.resolve(); },
    MonacoEditor: function () { return editor; },
    // Keep the config: the boot progress callback lives on it, and that is the
    // only way a test can drive the phases the button paints.
    RoslynIframeRunner: function (cfg) { runner.config = cfg || {}; return runner; },
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

// The compiler is a ~30MB WebAssembly runtime, so the wait before the first run
// is 5 seconds on a good connection and a minute on a bad one. It used to show
// one frozen label for all of it, which reads as a hang.
test("the Run button reports each boot phase while the compiler loads", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    const controller = LessonEngine.create(buildConfig());
    codeLab._runner.holdWarm = true;
    await controller.boot();
    const runBtn = dom.getElementById("bdRun");
    const onProgress = codeLab._runner.config.onProgress;
    assert.equal(typeof onProgress, "function", "the runner must be given a progress callback");

    onProgress({ phase: "download", percent: 42 });
    assert.match(runBtn.textContent, /42%/);
    assert.equal(runBtn.querySelector(".btn-boot-fill").style.width, "42%");

    // The download percentage stops meaning anything once every file is in, so
    // the bar stays full and the label carries the phase.
    onProgress({ phase: "start", percent: 100 });
    assert.match(runBtn.textContent, /Starting/);
    assert.equal(runBtn.querySelector(".btn-boot-fill").style.width, "100%");

    onProgress({ phase: "warm", percent: 100 });
    assert.match(runBtn.textContent, /Warming/);

    codeLab._runner.releaseWarm();
    await flush();
    assert.equal(runBtn.textContent, "Run");
    assert.equal(runBtn.disabled, false);
    // Progress arriving late must not drag a ready button back into the wait.
    onProgress({ phase: "download", percent: 10 });
    assert.equal(runBtn.textContent, "Run");
  });
});

test("a boot that fails says so instead of handing over a Run button that cannot work", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    const controller = LessonEngine.create(buildConfig());
    codeLab._runner.warmError = new Error("The code runner took too long to load.");
    await controller.boot();
    await flush();
    await flush();
    const runBtn = dom.getElementById("bdRun");
    const errors = dom.getElementById("bdErrors");
    assert.equal(runBtn.disabled, true, "a dead compiler must not offer a live Run button");
    assert.match(runBtn.textContent, /unavailable/i);
    assert.equal(errors.hidden, false);
    assert.match(errors.textContent, /Reload/i);
    // The raw runner error is English-only; the learner must never see it.
    assert.doesNotMatch(errors.textContent, /took too long/);
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

// The fixture's starter DECLARES CheckAndSign, so the removal goal has real work
// to do. A goal that is green on an untouched starter teaches nothing.
const TRACKER_STARTER =
  'public class Cat { public string CheckAndSign(int h) { return h >= 6 ? "FEED" : "FULL"; } }';

// A task whose shape is the split Cat/FeedingSign - the SRP move the lesson
// teaches - so the tracker has something to light up one piece at a time.
function trackerConfig() {
  const cfg = buildConfig();
  cfg.tasks[0].goal = ["give `Cat` an `IsHungry()`", "write a `FeedingSign`", "no method does both"];
  cfg.tasks[0].goals = [
    { code: ["class Cat", "bool IsHungry()"], gate: { type: "Cat", member: "IsHungry" } },
    { code: ["class FeedingSign", "string Format(bool hungry)"], gate: { type: "FeedingSign", member: "Format" } },
    { gate: { absent: "CheckAndSign" } },
  ];
  cfg.tasks[0].starter = TRACKER_STARTER;
  return cfg;
}

// The panel groups goals: boxes (structural + removal) first, run-gated
// behaviour lines after. Authored order is NOT render order, so tests select by
// role instead of by index.
const boxesOf = (items) => [...items].filter((li) => li.classList.contains("goal-box"));
const runGatedOf = (items) => [...items].find((li) => li.classList.contains("goal-behaviour"));
const absentOf = (items) => [...items].find((li) => li.classList.contains("goal-box--absent"));

// Member rows live inside a box's innerHTML, below the fake DOM's <li> parsing,
// so read them straight out of the rendered markup.
function memberRowsOf(dom) {
  const html = dom.getElementById("bdGoal").innerHTML;
  const out = [];
  const re = /<code class="goal-code goal-member( is-met)?">([\s\S]*?)<\/code>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ met: !!m[1], text: m[2].replace(/<[^>]*>/g, "").trim() });
  }
  return out;
}

const HALF = "public class Cat { public bool IsHungry() { return true; } }";
const WHOLE =
  HALF + '\npublic class FeedingSign { public string Format(bool hungry) { return hungry ? "FEED" : "FULL"; } }';

test("goal items get a tick and code chips as their gate is met", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(trackerConfig()).boot();
    const items = dom.getElementById("bdGoal").children;
    assert.equal(items.length, 3);

    // NOTHING may be green before the learner types. The starter declares
    // CheckAndSign, so even the removal goal starts unmet.
    assert.equal(items[2].classList.contains("is-met"), false);
    assert.equal(items[0].classList.contains("is-met"), false);

    codeLab._editor._type(WHOLE);
    // Re-read: each access re-parses the freshly painted innerHTML.
    const lit = dom.getElementById("bdGoal").children;
    assert.equal(lit[0].classList.contains("is-met"), true);
    assert.equal(lit[1].classList.contains("is-met"), true);
    // WHOLE drops CheckAndSign, so the removal goal is satisfied too.
    assert.equal(absentOf(lit).classList.contains("is-met"), true);
    // Code chips are rendered inline.
    assert.match(lit[0].innerHTML, /goal-code/);
    assert.match(lit[0].innerHTML, /bool IsHungry/);
    // The localized prose the core painted survives the tick.
    assert.match(lit[0].innerHTML, /IsHungry/);
    assert.match(lit[1].innerHTML, /FeedingSign/);
  });
});

test("code chips show the authored signatures as monospace labels", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(trackerConfig()).boot();
    codeLab._editor._type(WHOLE);
    const items = dom.getElementById("bdGoal").children;
    // First goal has two chips: "class Cat" and "bool IsHungry()"
    const chips = items[0].innerHTML.match(/goal-code/g) || [];
    assert.equal(chips.length, 2, "two code chips for Cat");
    assert.match(items[0].innerHTML, /class Cat/);
    // Second goal also has two chips
    const chips2 = items[1].innerHTML.match(/goal-code/g) || [];
    assert.equal(chips2.length, 2, "two code chips for FeedingSign");
    // A removal goal names the symbol being retired, struck through, so it
    // carries exactly one chip - the thing that has to disappear.
    const removal = absentOf(items);
    const chips3 = removal.innerHTML.match(/goal-code/g) || [];
    assert.equal(chips3.length, 1, "the retired symbol is named");
    assert.match(removal.innerHTML, /goal-box-header--absent/);
    assert.match(removal.innerHTML, /<del>/);
    assert.match(removal.innerHTML, /CheckAndSign/);
  });
});

test("a declared type with a missing member stays unmet in the goal list", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(trackerConfig()).boot();
    codeLab._editor._type("public class Cat { }");
    const items = dom.getElementById("bdGoal").children;
    assert.equal(items[0].classList.contains("is-met"), false, "an empty Cat is not the shape asked for");
    assert.equal(items[1].classList.contains("is-met"), false);
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
    // Still painted once from the starter, but no live updates.
    const items = dom.getElementById("bdGoal").children;
    assert.equal(items.length, 3);
  });
});

test("the tracker stays inert when the bundle has no scanner", async () => {
  await withDom("bd", [], async (dom, codeLab) => {
    delete codeLab.scanCSharp;
    await LessonEngine.create(trackerConfig()).boot();
    // No ticks, no error - just the plain goal prose.
    const items = dom.getElementById("bdGoal").children;
    assert.equal(items.length, 3);
    assert.equal(items[0].classList.contains("is-met"), false);
  });
});

test("Show Solution lights every goal gate", async () => {
  await withDom("bd", [], async (dom) => {
    const cfg = trackerConfig();
    cfg.tasks[0].solution = WHOLE + "\nclass Program { static void Main() { } }";
    await LessonEngine.create(cfg).boot();
    dom.getElementById("bdSolution").click();
    const items = dom.getElementById("bdGoal").children;
    assert.equal(items[0].classList.contains("is-met"), true);
    assert.equal(items[1].classList.contains("is-met"), true);
    assert.equal(items[2].classList.contains("is-met"), true, "the authored solution must satisfy its own goals");
  });
});

// A run-gated goal (gate: null) shows a play-button marker that ticks when a
// run passes. It must NOT show as permanently unfillable.
test("a run-gated goal shows a play marker, not an unfillable box", async () => {
  const cfg = trackerConfig();
  cfg.tasks[0].goals = [
    { code: ["class Cat", "bool IsHungry()"], gate: { type: "Cat", member: "IsHungry" } },
    { gate: null },
    { gate: { absent: "CheckAndSign" } },
  ];
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(cfg).boot();
    codeLab._editor._type(WHOLE);
    const items = dom.getElementById("bdGoal").children;

    assert.match(runGatedOf(items).innerHTML, /tracker-tick--run/, "the run-gated goal has a play marker");
    assert.doesNotMatch(runGatedOf(items).innerHTML, /\u2713/, "the run-gated goal shows no tick before a run");
    assert.equal(runGatedOf(items).classList.contains("is-met"), false);
    assert.match(runGatedOf(items).innerHTML, /FeedingSign/, "and it keeps its prose");

    // Its neighbours still behave.
    assert.equal(boxesOf(items)[0].classList.contains("is-met"), true);
    assert.match(boxesOf(items)[0].innerHTML, /\u2713/);
  });
});

// A goal that carries `code` is ALWAYS a box, even when its gate is null. The
// box is the blueprint - the visual help that tells the learner what shape to
// build - so it must never collapse into a plain prose row.
test("a blueprint goal stays a UML box even when its tick is run-gated", async () => {
  const cfg = trackerConfig();
  cfg.tasks[0].goals = [
    { code: ["class Cat", "string CheckAndSign(int hoursSinceMeal)"], gate: null },
    { gate: null },
  ];
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(cfg).boot();
    const items = dom.getElementById("bdGoal").children;
    const boxes = boxesOf(items);

    assert.equal(boxes.length, 1, "the blueprint renders as a box, not a prose row");
    const box = boxes[0];
    assert.equal(box.classList.contains("goal-box--run"), true, "and it is marked run-gated");
    assert.match(box.innerHTML, /class Cat/);
    assert.match(box.innerHTML, /CheckAndSign\(int hoursSinceMeal\)/, "the signature is on show");
    // The tick is a play marker, and the box is NOT green just because the
    // starter already declares that exact signature.
    assert.match(box.innerHTML, /tracker-tick--run/);
    assert.equal(box.classList.contains("is-met"), false, "an existing signature is not a pass");
  });
});

// ...and it goes green once a run passes.
test("a blueprint box ticks when the run passes", async () => {
  const cfg = trackerConfig();
  cfg.tasks[0].goals = [
    { code: ["class Cat", "string CheckAndSign(int hoursSinceMeal)"], gate: null },
  ];
  await withDom("bd", [{ output: "Woof\n" }], async (dom, codeLab) => {
    await LessonEngine.create(cfg).boot();
    codeLab._editor._type(WHOLE);
    dom.getElementById("bdRun").click();
    await flush();
    const box = boxesOf(dom.getElementById("bdGoal").children)[0];
    assert.equal(box.classList.contains("is-met"), true, "a passing run lights the blueprint");
    assert.match(box.innerHTML, /\u2713/);
  });
});

// A run-gated goal ticks when a run passes (grade returns ok: true).
test("a run-gated goal ticks when the run passes", async () => {
  const cfg = trackerConfig();
  cfg.tasks[0].goals = [
    { code: ["class Cat", "bool IsHungry()"], gate: { type: "Cat", member: "IsHungry" } },
    { gate: null },
    { gate: { absent: "CheckAndSign" } },
  ];
  await withDom("bd", [{ output: "Woof\n" }], async (dom, codeLab) => {
    await LessonEngine.create(cfg).boot();
    codeLab._editor._type(WHOLE);
    dom.getElementById("bdRun").click();
    await flush();
    const items = dom.getElementById("bdGoal").children;
    assert.equal(runGatedOf(items).classList.contains("is-met"), true, "run-gated ticks on pass");
    assert.match(runGatedOf(items).innerHTML, /\u2713/);
  });
});

// Editing after a pass clears the run-gated tick.
test("editing after a pass clears the run-gated tick", async () => {
  const cfg = trackerConfig();
  cfg.tasks[0].goals = [
    { code: ["class Cat", "bool IsHungry()"], gate: { type: "Cat", member: "IsHungry" } },
    { gate: null },
    { gate: { absent: "CheckAndSign" } },
  ];
  await withDom("bd", [{ output: "Woof\n" }], async (dom, codeLab) => {
    await LessonEngine.create(cfg).boot();
    codeLab._editor._type(WHOLE);
    dom.getElementById("bdRun").click();
    await flush();
    const items = dom.getElementById("bdGoal").children;
    assert.equal(runGatedOf(items).classList.contains("is-met"), true, "run-gated ticks on pass");
    // Now edit
    codeLab._editor._type(WHOLE + "// changed");
    assert.equal(runGatedOf(dom.getElementById("bdGoal").children).classList.contains("is-met"), false, "editing clears run-gated tick");
  });
});

// ---- the SOLID lesson's own data: no goal starts green --------------------
// A goal that starts green before the learner types teaches nothing. This pins
// every card's starter against every card's goals.
test("no goal is met on the untouched starter for any SOLID card", () => {
  const vm = require("node:vm");
  const fs = require("node:fs");
  const path = require("node:path");
  const dataFile = path.join(__dirname, "..", "content", "practical",
    "06-design-for-change", "02-the-solid-principles", "data.js");
  const sandbox = { window: {}, console };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(dataFile, "utf8"), sandbox);
  const tasks = sandbox.window.LESSON_CONFIG.tasks.filter((t) => !t.summary);
  const S = KernelStructure;
  tasks.forEach((t, i) => {
    const goals = t.goals || [];
    if (!goals.length) return;
    const gates = goals.map((g) => g && g.gate !== undefined ? g.gate : undefined);
    const types = realScanCSharp(t.starter || "").types || [];
    // S.verdicts, not S.evaluate: assert what the learner actually sees. A box
    // whose gate is met but whose rows are not is still red on screen, and a
    // test reading the intermediate value would fail on correct content.
    const met = Array.from(S.verdicts(types, goals, t.starter || ""));
    met.forEach((v, gi) => {
      if (v === null) return; // run-gated, not structural
      assert.equal(v, false,
        `card ${i + 1} goal ${gi} (${S.describe(gates[gi])}) is already met on the starter - it must start red`);
    });
  });
});

// --- per-member subtasks inside a box ---------------------------------------

const GRANULAR = [
  {
    code: ["class Cat", "int _hoursSinceMeal", "Cat(int hoursSinceMeal)", "bool IsHungry()"],
    gate: { type: "Cat", member: "IsHungry" },
  },
];

// Each member row carries its own tick, so a learner who has added the field
// but not the constructor can SEE which piece is still missing.
test("member rows tick one at a time as each piece lands", async () => {
  const cfg = trackerConfig();
  cfg.tasks[0].goals = GRANULAR;
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(cfg).boot();

    // Only the method exists: header ticks, field and constructor do not.
    codeLab._editor._type("public class Cat { public bool IsHungry() { return true; } }");
    let rows = memberRowsOf(dom);
    assert.deepEqual(rows.map((r) => r.met), [false, false, true], "field and ctor still missing");
    assert.equal(boxesOf(dom.getElementById("bdGoal").children)[0].classList.contains("is-met"), false,
      "the box is NOT green while a row is missing");

    // Add the field: that row alone turns green.
    codeLab._editor._type("public class Cat { private int _hoursSinceMeal; public bool IsHungry() { return true; } }");
    rows = memberRowsOf(dom);
    assert.deepEqual(rows.map((r) => r.met), [true, false, true], "the field row ticked on its own");

    // Add the constructor: now everything, and only now is the box green.
    codeLab._editor._type(
      "public class Cat { private int _hoursSinceMeal; public Cat(int hoursSinceMeal) { _hoursSinceMeal = hoursSinceMeal; }" +
      " public bool IsHungry() { return _hoursSinceMeal >= 6; } }");
    rows = memberRowsOf(dom);
    assert.deepEqual(rows.map((r) => r.met), [true, true, true]);
    assert.equal(boxesOf(dom.getElementById("bdGoal").children)[0].classList.contains("is-met"), true,
      "every row met, so the box is green");
  });
});

// The regression this exists to stop: a gate naming ONE member used to light the
// whole class while its constructor and fields were still missing.
test("a gate that is met cannot green a box whose rows are not", async () => {
  const cfg = trackerConfig();
  cfg.tasks[0].goals = GRANULAR;
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(cfg).boot();
    // The gate ({ type: Cat, member: IsHungry }) is fully satisfied here...
    codeLab._editor._type("public class Cat { public bool IsHungry() { return true; } }");
    const box = boxesOf(dom.getElementById("bdGoal").children)[0];
    assert.equal(box.classList.contains("is-met"), false, "...but two rows are missing, so no green");
  });
});

test("member rows show the authored signature next to their tick", async () => {
  const cfg = trackerConfig();
  cfg.tasks[0].goals = GRANULAR;
  await withDom("bd", [], async (dom, codeLab) => {
    await LessonEngine.create(cfg).boot();
    codeLab._editor._type("public class Cat { }");
    const labels = memberRowsOf(dom).map((r) => r.text);
    assert.deepEqual(labels, ["int _hoursSinceMeal", "Cat(int hoursSinceMeal)", "bool IsHungry()"]);
  });
});
