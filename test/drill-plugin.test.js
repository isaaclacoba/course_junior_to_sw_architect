"use strict";

// Unit tests for the "drill" archetype PLUGIN - kernel/engine/plugins/drill-plugin.js.
//
// These prove the plugin drives its archetype middle (fill-in-the-blank surface,
// Check, Hint, Show Answer, the quiz gate) and reports back through the generic
// core so the core's shared chrome (XP award, result panel) responds. Grading is
// the REAL kernel/grading/blank-match.js. A drill has no editor and no runner, so
// there is nothing external to stub - only a hand-built fake DOM with real <input>
// elements that carry a `value` and fire "input" events.
//
// Same hand-built fake DOM approach as test/build-plugin.test.js (there is no
// jsdom in this repo).

const test = require("node:test");
const assert = require("node:assert/strict");

const LessonCommon = require("../kernel/page-shell/lesson-common.js");
const KernelBlankMatch = require("../kernel/grading/blank-match.js");
const LessonEngine = require("../kernel/engine/lesson-engine.js");
// Requiring the plugin registers it on the core it require()s (same cached module).
const DrillPlugin = require("../kernel/engine/plugins/drill-plugin.js");

// ---- minimal fake DOM ------------------------------------------------------
// Like build-plugin.test's fake, but a drill RE-RENDERS its inputs host, so
// assigning innerHTML must also clear the appended children (a real node does).
function makeEl(id) {
  const classes = new Set();
  const listeners = {};
  let html = "";
  const el = {
    id,
    value: "",
    textContent: "",
    hidden: true,
    disabled: false,
    children: [],
    classList: {
      toggle(cls, on) { if (on) classes.add(cls); else classes.delete(cls); },
      add(cls) { classes.add(cls); },
      remove(cls) { classes.delete(cls); },
      contains(cls) { return classes.has(cls); },
    },
    setAttribute() {},
    appendChild(child) { this.children.push(child); return child; },
    closest() { return null; },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    dispatch(type, evt) { (listeners[type] || []).forEach((fn) => fn(evt || { target: this })); },
    click() { (listeners.click || []).forEach((fn) => fn({})); },
  };
  Object.defineProperty(el, "innerHTML", {
    get() { return html; },
    set(v) { html = v; el.children = []; },
  });
  return el;
}

// Build a document whose getElementById serves the ids the core AND the drill
// plugin query for a given prefix, plus the global courseXpLabel.
function makeDom(prefix) {
  const ids = [
    // core chrome
    "Meta", "Title", "Context", "Concept", "Progress", "Goal",
    "Result", "ResultTitle", "ResultBody",
    "Summary", "SummaryIntro", "SummaryList", "SummaryClose",
    "Prev", "Next",
    // drill host roles + sub-ids
    "Code", "Points", "Quiz", "Question", "Options", "QuizFeedback",
    "Diagram", "Inputs", "Check", "Hint", "Show", "Reset",
  ].map((s) => prefix + s);
  const registry = {};
  ids.forEach((id) => { registry[id] = makeEl(id); });
  registry["courseXpLabel"] = makeEl("courseXpLabel");
  const dom = {
    getElementById(id) { return registry[id] || null; },
    createElement(tag) { return makeEl("<" + tag + ">"); },
    _register(id) { return (registry[id] = registry[id] || makeEl(id)); },
  };
  return dom;
}

// Install fake browser globals for the length of fn, then restore.
async function withDom(prefix, fn) {
  const saved = {};
  ["document", "window", "history", "location", "LessonCommon", "KernelBlankMatch"].forEach((k) => {
    saved[k] = { had: Object.prototype.hasOwnProperty.call(globalThis, k), val: globalThis[k] };
  });
  const dom = makeDom(prefix);
  globalThis.document = dom;
  globalThis.location = { hash: "", href: "" };
  globalThis.history = { replaceState() {} };
  globalThis.window = { location: { href: "" }, addEventListener() {}, PAGE: { nextHref: "next-lesson.html" } };
  LessonCommon.storage = LessonCommon.memoryStorage();
  globalThis.LessonCommon = LessonCommon;
  globalThis.KernelBlankMatch = KernelBlankMatch; // the REAL grader
  try {
    return await fn(dom);
  } finally {
    Object.keys(saved).forEach((k) => {
      if (saved[k].had) globalThis[k] = saved[k].val;
      else delete globalThis[k];
    });
  }
}

// ---- test config -----------------------------------------------------------
function drillConfig(extra) {
  return Object.assign(
    {
      archetype: "drill",
      prefix: "dr",
      xpKey: "xp",
      awardedKey: "aw",
      awardAmount: 20,
      metaLabel: "Drill track",
      progressNoun: "Drill",
      mode: "code",
      tasks: [
        {
          title: "Declare a variable",
          context: "Give the box a **name**.",
          concept: "variables",
          snippet: "int {{1}} = 5;",
          points: ["A variable is a named box for a value."],
          blanks: [
            { id: 1, label: "the name", answer: "x", accept: ["myVar"], hints: ["a short lowercase name"] },
          ],
        },
      ],
    },
    extra || {}
  );
}

function quizDrillConfig() {
  return {
    archetype: "drill",
    prefix: "dr",
    xpKey: "xp",
    awardedKey: "aw",
    awardAmount: 20,
    mode: "code",
    tasks: [
      {
        title: "Pick and complete",
        snippet: "int {{1}} = 5;",
        blanks: [{ id: 1, label: "the name", answer: "x", hints: ["a name"] }],
        quiz: {
          question: "Why declare a variable?",
          options: [
            { text: "To store a value under a name", correct: true },
            { text: "To slow the program down", correct: false },
          ],
          answerWhy: "A variable names a value so you can reuse it.",
        },
      },
    ],
  };
}

// Helpers to reach into the rendered card.
function inputRow(dom, n) { return dom.getElementById("drInputs").children[n]; }
function inputEl(dom, n) { return inputRow(dom, n).children[1]; }   // [label, input, hint]
function hintEl(dom, n) { return inputRow(dom, n).children[2]; }
function typeInto(input, text) { input.value = text; input.dispatch("input", { target: input }); }
function progressReader() {
  return LessonCommon.createProgress({ storage: LessonCommon.storage, xpKey: "xp", awardedKey: "aw" });
}

// ---------------------------------------------------------------------------

test("the drill plugin is registered under archetype 'drill'", () => {
  assert.equal(DrillPlugin.archetype, "drill");
  assert.equal(LessonEngine.plugins.drill, DrillPlugin);
});

test("mount + first render paints the snippet with gaps and a blank input", async () => {
  await withDom("dr", async (dom) => {
    const controller = LessonEngine.create(drillConfig());
    await controller.boot();
    assert.equal(dom.getElementById("drCode").textContent, "int __1__ = 5;");
    assert.equal(dom.getElementById("drInputs").children.length, 1);
    assert.equal(inputEl(dom, 0).value, "");
  });
});

test("all blanks correct -> core awards XP and paints a green pass", async () => {
  await withDom("dr", async (dom) => {
    const controller = LessonEngine.create(drillConfig());
    await controller.boot();

    typeInto(inputEl(dom, 0), "x");
    dom.getElementById("drCheck").click();

    assert.equal(progressReader().xp(), 20, "core awarded XP on pass");
    const result = dom.getElementById("drResult");
    assert.equal(result.hidden, false);
    assert.equal(result.classList.contains("is-pass"), true);
    assert.match(dom.getElementById("drResultBody").textContent, /reinforced in code form/);
    assert.equal(inputEl(dom, 0).classList.contains("correct"), true);
  });
});

test("a wrong blank -> red fail, no XP", async () => {
  await withDom("dr", async (dom) => {
    const controller = LessonEngine.create(drillConfig());
    await controller.boot();

    typeInto(inputEl(dom, 0), "zzz");
    dom.getElementById("drCheck").click();

    assert.equal(progressReader().xp(), 0, "no XP on a wrong blank");
    const result = dom.getElementById("drResult");
    assert.equal(result.classList.contains("is-fail"), true);
    assert.match(dom.getElementById("drResultBody").textContent, /Keep going/);
    assert.equal(inputEl(dom, 0).classList.contains("wrong"), true);
  });
});

test("an accept[] alternate is accepted", async () => {
  await withDom("dr", async (dom) => {
    const controller = LessonEngine.create(drillConfig());
    await controller.boot();

    typeInto(inputEl(dom, 0), "myVar");
    dom.getElementById("drCheck").click();

    assert.equal(progressReader().xp(), 20);
    assert.equal(dom.getElementById("drResult").classList.contains("is-pass"), true);
  });
});

test("a quiz card fails until the correct option is also picked", async () => {
  await withDom("dr", async (dom) => {
    const controller = LessonEngine.create(quizDrillConfig());
    await controller.boot();

    // Blank correct, but no quiz pick yet -> fail with the quiz-pending message.
    typeInto(inputEl(dom, 0), "x");
    dom.getElementById("drCheck").click();
    assert.equal(progressReader().xp(), 0, "no XP until the quiz is answered");
    assert.match(dom.getElementById("drResultBody").textContent, /pick the right answer/);

    // Click the correct option (found by its rendered text), then Check again.
    const correctText = "To store a value under a name";
    const buttons = dom.getElementById("drOptions").children;
    const correctBtn = buttons.find((b) => b.innerHTML.includes(correctText));
    assert.ok(correctBtn, "the correct option button is rendered");
    correctBtn.click();

    dom.getElementById("drCheck").click();
    assert.equal(progressReader().xp(), 20, "XP awarded once blanks + quiz are correct");
    assert.equal(dom.getElementById("drResult").classList.contains("is-pass"), true);
  });
});

test("Hint reveals the next hint for each blank", async () => {
  await withDom("dr", async (dom) => {
    const controller = LessonEngine.create(drillConfig());
    await controller.boot();

    assert.equal(hintEl(dom, 0).textContent, "", "no hint before clicking");
    dom.getElementById("drHint").click();
    assert.equal(hintEl(dom, 0).textContent, "Hint: a short lowercase name");
  });
});

test("Show Answer fills the blanks with their answers", async () => {
  await withDom("dr", async (dom) => {
    const controller = LessonEngine.create(drillConfig());
    await controller.boot();

    dom.getElementById("drShow").click();
    assert.equal(inputEl(dom, 0).value, "x");
  });
});

test("Reset clears a typed value", async () => {
  await withDom("dr", async (dom) => {
    const controller = LessonEngine.create(drillConfig());
    await controller.boot();

    typeInto(inputEl(dom, 0), "x");
    dom.getElementById("drReset").click();
    assert.equal(inputEl(dom, 0).value, "");
  });
});
