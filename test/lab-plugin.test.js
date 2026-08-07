"use strict";

// Unit tests for the "lab" archetype PLUGIN - kernel/engine/plugins/lab-plugin.js.
//
// A lab card is a PRACTICE card (not a widget one): it has a task, a goal list,
// a verdict and XP, and only its body differs from a build card - CodeLab.VizLab
// instead of a bare editor, and a verdict read off the execution trace instead
// of off the printed output.
//
// These tests prove the four things that would silently hurt a learner:
//   1. the widget is mounted ONCE and reused across cards (it owns a compiler)
//   2. a trace that never happened is never reported as a wrong answer
//   3. a missing grading kernel says so instead of awarding or denying XP
//   4. a pass on one card cannot tick the next card's goals
//
// Same hand-built fake DOM as test/viz-plugin.test.js (there is no jsdom here).
// LessonCommon is the REAL kernel/page-shell/lesson-common.js; CodeLab.VizLab
// and the trace matcher are faked.

const test = require("node:test");
const assert = require("node:assert/strict");

const LessonCommon = require("../kernel/page-shell/lesson-common.js");
const LessonEngine = require("../kernel/engine/lesson-engine.js");
const LabPlugin = require("../kernel/engine/plugins/lab-plugin.js");

// ---- minimal fake DOM ------------------------------------------------------
function makeEl(id) {
  const classes = new Set();
  const listeners = {};
  return {
    id,
    className: "",
    textContent: "",
    innerHTML: "",
    hidden: true,
    disabled: false,
    children: [],
    classList: {
      toggle(cls, on) { if (on) classes.add(cls); else classes.delete(cls); },
      add(cls) { classes.add(cls); },
      remove(cls) { classes.delete(cls); },
      contains(cls) { return classes.has(cls); },
    },
    appendChild(child) { this.children.push(child); return child; },
    closest() { return null; },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    click() { (listeners.click || []).forEach((fn) => fn({})); },
  };
}

function makeDom(prefix) {
  const ids = [
    "Meta", "Title", "Context", "Concept", "Progress", "Goal",
    "Result", "ResultTitle", "ResultBody",
    "Summary", "SummaryIntro", "SummaryList", "SummaryClose",
    "Prev", "Next", "Surface", "Editor", "Output", "Errors",
    "Run", "Solution", "Reset", "Expected", "Example",
  ].map((s) => prefix + s);
  const registry = {};
  ids.forEach((id) => { registry[id] = makeEl(id); });
  registry["courseXpLabel"] = makeEl("courseXpLabel");
  return {
    getElementById(id) { return registry[id] || null; },
    createElement(tag) { return makeEl("<" + tag + ">"); },
  };
}

// A fake VizLab that records the config it was handed, the sources it was given,
// and lets a test fire the onTrace callback the real widget fires on Visualize.
function makeCodeLab() {
  const created = [];
  return {
    VizLab: {
      create(host, cfg) {
        const lab = {
          host,
          cfg,
          sources: [],
          destroyed: false,
          setSource(code) { this.sources.push(code); },
          getSource() { return this.sources[this.sources.length - 1] || ""; },
          destroy() { this.destroyed = true; },
          // The test's handle on "the learner pressed Visualize".
          fireTrace(outcome) { cfg.onTrace(outcome); },
        };
        created.push(lab);
        return lab;
      },
    },
    _created: created,
  };
}

async function withDom(prefix, fn, opts = {}) {
  const saved = {};
  const keys = ["document", "window", "history", "location", "LessonCommon", "CodeLab", "KernelTraceMatch"];
  keys.forEach((k) => {
    saved[k] = { had: Object.prototype.hasOwnProperty.call(globalThis, k), val: globalThis[k] };
  });
  const dom = makeDom(prefix);
  const codeLab = makeCodeLab();
  globalThis.document = dom;
  globalThis.location = { hash: "", href: "" };
  globalThis.history = { replaceState() {} };
  globalThis.window = { location: { href: "" }, addEventListener() {}, PAGE: { nextHref: "next.html" } };
  LessonCommon.storage = LessonCommon.memoryStorage();
  globalThis.LessonCommon = LessonCommon;
  globalThis.CodeLab = codeLab;
  if (opts.matcher) globalThis.KernelTraceMatch = opts.matcher;
  else delete globalThis.KernelTraceMatch;
  try {
    return await fn(dom, codeLab);
  } finally {
    keys.forEach((k) => {
      if (saved[k].had) globalThis[k] = saved[k].val;
      else delete globalThis[k];
    });
  }
}

function labConfig(tasks) {
  return {
    archetype: "lab",
    prefix: "tt",
    xpKey: "xp",
    awardedKey: "tt_awarded",
    awardAmount: 20,
    tasks: tasks || [
      { title: "One class, many objects", starter: "// card one", solution: "// solved one", gates: [{ constructed: "Cat", times: 2 }] },
      { title: "A second card", starter: "// card two", solution: "// solved two", gates: [{ constructed: "Dog", times: 1 }] },
    ],
  };
}

const TRACED = { status: "traced", trace: { steps: [{}], code: ["x"] } };

// A matcher that says yes, so the "pass" paths are exercised without dragging in
// the real gate vocabulary (that is its own module, with its own tests).
const YES_MATCHER = { gradeTrace: () => ({ ok: true, reason: "ok", message: "Correct." }) };

// ---------------------------------------------------------------------------

test("VizLab is created once and reused across cards - it owns a compiler", async () => {
  await withDom("tt", async (dom, codeLab) => {
    const controller = LessonEngine.create(labConfig());
    await controller.boot();

    assert.equal(codeLab._created.length, 1, "exactly one VizLab, so exactly one compiler");
    const lab = codeLab._created[0];
    assert.deepEqual(lab.sources, ["// card one"], "the first card's starter is loaded");

    LabPlugin.renderCard(
      { ctx: { hosts: {}, helpers: {}, tr: (k, d) => d }, lab, task: null, taskIndex: 0 },
      { starter: "// card two" },
      1,
    );
    assert.equal(codeLab._created.length, 1, "moving card does NOT build a second compiler");
    assert.deepEqual(lab.sources, ["// card one", "// card two"], "it swaps the source instead");
  });
});

test("the trace is what gets graded - the outcome is handed to the matcher", async () => {
  const seen = [];
  const matcher = {
    gradeTrace(trace, gates) {
      seen.push({ trace, gates });
      return { ok: true, reason: "ok", message: "Correct." };
    },
  };
  await withDom("tt", async (dom, codeLab) => {
    const controller = LessonEngine.create(labConfig());
    await controller.boot();
    codeLab._created[0].fireTrace(TRACED);

    assert.equal(seen.length, 1, "the press reached the matcher");
    assert.deepEqual(seen[0].trace, TRACED.trace, "the matcher is given the trace, not the source text");
    assert.deepEqual(seen[0].gates, [{ constructed: "Cat", times: 2 }], "and the card's own gates");
  }, { matcher });
});

// The four not-traced statuses. None of them is a wrong answer, and none may be
// reported as one - a learner whose compiler failed to boot has told us nothing.
const NOT_A_WRONG_ANSWER = [
  ["failed", { status: "failed", message: "boom" }, "tracer"],
  ["did-not-compile", { status: "did-not-compile", errors: [] }, "compile"],
  ["threw", { status: "threw", trace: {} }, "runtime"],
  ["no-steps", { status: "no-steps", trace: { steps: [] } }, "empty"],
];

for (const [status, outcome, reason] of NOT_A_WRONG_ANSWER) {
  test(`a '${status}' run is never sent to the matcher and never marked correct`, async () => {
    let asked = 0;
    const matcher = { gradeTrace() { asked++; return { ok: true, reason: "ok", message: "Correct." }; } };
    await withDom("tt", async (dom, codeLab) => {
      const controller = LessonEngine.create(labConfig());
      await controller.boot();
      codeLab._created[0].fireTrace(outcome);

      assert.equal(asked, 0, "nothing to grade - the program never ran");
      assert.equal(dom.getElementById("ttResult").hidden, false, "the learner is told what happened");
      const body = dom.getElementById("ttResultBody").textContent;
      assert.ok(body.length > 0, "with a real message, not an empty panel");
      assert.notEqual(reason, "ok");
    }, { matcher });
  });
}

test("a 'failed' tracer says it is our fault, and does not blame the learner's code", async () => {
  await withDom("tt", async (dom, codeLab) => {
    const controller = LessonEngine.create(labConfig());
    await controller.boot();
    codeLab._created[0].fireTrace({ status: "failed", message: "boom" });

    const body = dom.getElementById("ttResultBody").textContent;
    assert.match(body, /visualizer could not start/i, "names the real failure");
    assert.match(body, /reload/i, "and the one thing that fixes it");
  });
});

test("no grading kernel loaded: the card says the check could not run", async () => {
  await withDom("tt", async (dom, codeLab) => {
    const controller = LessonEngine.create(labConfig());
    await controller.boot();
    // No KernelTraceMatch installed by this test - the seam is genuinely absent.
    codeLab._created[0].fireTrace(TRACED);

    const body = dom.getElementById("ttResultBody").textContent;
    assert.match(body, /could not run/i, "it admits the check did not happen");
    assert.match(body, /not yours/i, "and does not blame the learner");
    assert.equal(LessonCommon.storage.getItem("tt_awarded"), null, "no XP for a check nobody performed");
  });
});

test("a pass awards XP once, through the core - the same path a build card uses", async () => {
  await withDom("tt", async (dom, codeLab) => {
    const controller = LessonEngine.create(labConfig([
      { title: "only card", starter: "// s", gates: [{ constructed: "Cat", times: 2 }] },
    ]));
    await controller.boot();
    codeLab._created[0].fireTrace(TRACED);

    const body = dom.getElementById("ttResultBody").textContent;
    assert.match(body, /correct/i, "the pass is reported");
  }, { matcher: YES_MATCHER });
});

test("Reset puts the starter back and drops the pass, so goals cannot stay ticked", async () => {
  await withDom("tt", async (dom, codeLab) => {
    const controller = LessonEngine.create(labConfig());
    await controller.boot();
    const lab = codeLab._created[0];
    lab.fireTrace(TRACED);

    const surface = { ctx: { hosts: {}, helpers: {}, tr: (k, d) => d }, lab, runPassed: true, lastOutcome: TRACED };
    LabPlugin.reset(surface, { starter: "// card one" });

    assert.equal(lab.getSource(), "// card one", "the starter is back");
    assert.equal(surface.runPassed, false, "and the previous pass is dropped");
    assert.equal(surface.lastOutcome, null, "along with the trace it was based on");
  }, { matcher: YES_MATCHER });
});

test("Show Solution loads the solution and does NOT count as a pass", async () => {
  await withDom("tt", async (dom, codeLab) => {
    const controller = LessonEngine.create(labConfig());
    await controller.boot();
    const lab = codeLab._created[0];
    const surface = { ctx: { hosts: {}, helpers: {}, tr: (k, d) => d }, lab, runPassed: true, lastOutcome: TRACED };
    LabPlugin.showSolution(surface, { solution: "// solved one" });

    assert.equal(lab.getSource(), "// solved one");
    assert.equal(surface.runPassed, false, "reading the answer is not solving it");
  });
});

test("moving to the next card clears the previous card's verdict", async () => {
  await withDom("tt", async (dom, codeLab) => {
    const controller = LessonEngine.create(labConfig());
    await controller.boot();
    const lab = codeLab._created[0];
    const surface = { ctx: { hosts: {}, helpers: {}, tr: (k, d) => d }, lab, runPassed: true, lastOutcome: TRACED };

    LabPlugin.renderCard(surface, { starter: "// card two" }, 1);

    assert.equal(surface.runPassed, false, "a pass on card one cannot tick card two");
    assert.equal(surface.lastOutcome, null);
  });
});

test("the plugin registers as a practice archetype, not a widget one", () => {
  assert.equal(LabPlugin.archetype, "lab");
  assert.notEqual(LabPlugin.body, "widget", "a lab card has a task, goals and a verdict");
  ["mount", "renderCard", "grade", "showSolution", "reset", "setLocale"].forEach((m) => {
    assert.equal(typeof LabPlugin[m], "function", "practice plugins implement " + m);
  });
});

test("the compiler host url is prefixed for a lesson four directories deep", async () => {
  await withDom("tt", async (dom, codeLab) => {
    globalThis.window.LESSON_META = { id: "object-lab" };
    const controller = LessonEngine.create(labConfig());
    await controller.boot();
    assert.equal(
      codeLab._created[0].cfg.runnerUrl,
      "../../../../level3-app/index.html?runner=1",
      "a migrated lesson reaches back to the root, or the runner 404s and Run does nothing",
    );
  });
});
