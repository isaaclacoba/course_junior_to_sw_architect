"use strict";

// Unit tests for the generic lesson-engine CORE - kernel/engine/lesson-engine.js.
//
// The point of these tests is to prove the core is ARCHETYPE-BLIND: it drives its
// shared chrome (header, XP, result panel, prev/next, summary, setLocale) over a
// FAKE plugin that records the calls it gets, and dispatches by archetype. No
// build/drill/git, no Monaco, no Roslyn, no browser.
//
// There is no jsdom in this repo (see test/lesson-common.test.js, which stands up
// bare globals by hand), so this file builds a minimal fake DOM good enough for the
// core's needs: getElementById over a pre-registered id map, createElement, a click
// dispatcher, and stub history/location/window.

const test = require("node:test");
const assert = require("node:assert/strict");

const LessonCommon = require("../kernel/page-shell/lesson-common.js");
const LessonEngine = require("../kernel/engine/lesson-engine.js");

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
    // The core hides the goal SECTION (the element carrying the "Goal" heading),
    // not just the list, so a fake that always returns null would make any test
    // of that behaviour pass without exercising it. This walks a real parent.
    parentSection: null,
    closest(sel) { return sel === "section" ? this.parentSection : null; },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    click() { (listeners.click || []).forEach((fn) => fn({})); },
  };
}

// Build a document whose getElementById serves the ids the core queries for a
// given prefix, plus the global courseXpLabel. Any unlisted id resolves to null.
function makeDom(prefix) {
  const ids = [
    "Meta", "Title", "Context", "Concept", "Progress", "Goal",
    "Result", "ResultTitle", "ResultBody",
    "Summary", "SummaryIntro", "SummaryList", "SummaryClose",
    "Prev", "Next",
    // a couple of host-role elements so hosts.* is non-null where it matters
    "Surface", "Editor", "Inputs", "Output", "Errors", "Run",
  ].map((s) => prefix + s);
  const registry = {};
  ids.forEach((id) => { registry[id] = makeEl(id); });
  registry["courseXpLabel"] = makeEl("courseXpLabel");
  // The goal <ul> sits inside its own <section class="coach">; give the fake the
  // same shape so hiding the section can actually be observed.
  const goalSection = makeEl(prefix + "GoalSection");
  registry[prefix + "Goal"].parentSection = goalSection;
  registry[prefix + "GoalSection"] = goalSection;
  return {
    _get: (id) => registry[id] || null,
    getElementById(id) { return registry[id] || null; },
    createElement(tag) { return makeEl("<" + tag + ">"); },
  };
}

// Install fake browser globals for the length of fn, then restore. The core reads
// document/window/history/location lazily inside create(), so setting them on
// globalThis before create() is enough.
async function withDom(prefix, fn) {
  const saved = {};
  ["document", "window", "history", "location", "LessonCommon"].forEach((k) => {
    saved[k] = { had: Object.prototype.hasOwnProperty.call(globalThis, k), val: globalThis[k] };
  });
  const dom = makeDom(prefix);
  const hrefBox = { href: "" };
  globalThis.document = dom;
  globalThis.location = { hash: "", href: "" };
  globalThis.history = { replaceState() {} };
  globalThis.window = {
    location: hrefBox,
    addEventListener() {},
    PAGE: { nextHref: "next-lesson.html" },
  };
  // Fresh in-memory store per test so XP assertions do not bleed across tests.
  LessonCommon.storage = LessonCommon.memoryStorage();
  globalThis.LessonCommon = LessonCommon;
  try {
    return await fn(dom, hrefBox);
  } finally {
    Object.keys(saved).forEach((k) => {
      if (saved[k].had) globalThis[k] = saved[k].val;
      else delete globalThis[k];
    });
  }
}

// A fake plugin that records every call the core makes to it.
function makeFakePlugin(archetype) {
  const calls = { mount: [], renderCard: [], setLocale: [], deactivate: [] };
  return {
    plugin: {
      archetype,
      mount(ctx) { calls.mount.push(ctx); return { tag: archetype + "-surface" }; },
      renderCard(surface, task, i) { calls.renderCard.push({ surface, task, i }); },
      setLocale(surface, task) { calls.setLocale.push({ surface, task }); },
      deactivate(surface, task) { calls.deactivate.push({ surface, task }); },
    },
    calls,
  };
}

function twoTaskConfig(archetype) {
  return {
    archetype,
    prefix: "tt",
    xpKey: "xp",
    awardedKey: "aw",
    awardAmount: 20,
    metaLabel: "Fake track",
    progressNoun: "Task",
    tasks: [
      { title: "Card one", context: "First **card**.", concept: "alpha", goal: ["do a", "do b"] },
      { title: "Card two", context: "Second card.", concept: "beta", goal: ["do c"] },
    ],
  };
}

// ---------------------------------------------------------------------------

test("register requires an archetype key", () => {
  assert.throws(() => LessonEngine.register({}), /archetype/);
});

test("mount is called once with a ctx exposing hosts, report, tr and helpers", async () => {
  await withDom("tt", async () => {
    const fake = makeFakePlugin("fake-a");
    LessonEngine.register(fake.plugin);
    const controller = LessonEngine.create(twoTaskConfig("fake-a"));
    await controller.boot();

    assert.equal(fake.calls.mount.length, 1);
    const ctx = fake.calls.mount[0];
    // documented hosts role set is present
    ["surface", "editor", "inputs", "terminal", "graph", "diagram", "code",
     "example", "expected", "goal", "points", "quiz", "output", "errors",
     "actions", "result", "run", "check", "solution", "reset", "hint", "show"
    ].forEach((role) => assert.ok(role in ctx.hosts, "missing host role: " + role));
    // a role backed by a real element resolves; one with no element is null
    assert.ok(ctx.hosts.editor, "editor host should resolve");
    assert.equal(ctx.hosts.terminal, null, "absent host role should be null");
    // seam + helpers
    assert.equal(typeof ctx.report, "function");
    assert.equal(typeof ctx.tr, "function");
    assert.equal(ctx.prefix, "tt");
    assert.equal(ctx.runner, null);
    ["renderInline", "renderProse", "escapeHtml", "createOutputPanel"].forEach((h) =>
      assert.equal(typeof ctx.helpers[h], "function", "missing helper: " + h));
  });
});

test("renderCard is called for the first card at boot, then per card on nav", async () => {
  await withDom("tt", async (dom) => {
    const fake = makeFakePlugin("fake-b");
    LessonEngine.register(fake.plugin);
    const controller = LessonEngine.create(twoTaskConfig("fake-b"));
    await controller.boot();

    assert.equal(fake.calls.renderCard.length, 1);
    assert.equal(fake.calls.renderCard[0].i, 0);
    // header prose was painted by the core
    assert.equal(dom.getElementById("ttTitle").textContent, "Card one");
    assert.equal(dom.getElementById("ttProgress").textContent, "Task 1 / 2");

    // next moves to card 2 and re-renders the body
    dom.getElementById("ttNext").click();
    assert.equal(fake.calls.renderCard.length, 2);
    assert.equal(fake.calls.renderCard[1].i, 1);
    assert.equal(dom.getElementById("ttTitle").textContent, "Card two");

    // prev moves back
    dom.getElementById("ttPrev").click();
    assert.equal(fake.calls.renderCard[2].i, 0);
    assert.equal(dom.getElementById("ttTitle").textContent, "Card one");
  });
});

test("ctx.report({ok:true}) awards XP once and paints a green result", async () => {
  await withDom("tt", async (dom) => {
    const fake = makeFakePlugin("fake-c");
    LessonEngine.register(fake.plugin);
    const controller = LessonEngine.create(twoTaskConfig("fake-c"));
    await controller.boot();

    const ctx = fake.calls.mount[0];
    ctx.report({ ok: true, message: "Nice." });

    const reader = LessonCommon.createProgress({ storage: LessonCommon.storage, xpKey: "xp", awardedKey: "aw" });
    assert.equal(reader.xp(), 20, "XP awarded via LessonCommon.createProgress");

    const result = dom.getElementById("ttResult");
    assert.equal(result.hidden, false);
    assert.equal(result.classList.contains("is-pass"), true);
    assert.equal(dom.getElementById("ttResultBody").textContent, "Nice.");

    // a second report on the same card must NOT double-award
    ctx.report({ ok: true, message: "Again." });
    assert.equal(reader.xp(), 20, "award is one-time per card");
  });
});

test("ctx.report({ok:false}) paints a red result and awards nothing", async () => {
  await withDom("tt", async (dom) => {
    const fake = makeFakePlugin("fake-d");
    LessonEngine.register(fake.plugin);
    const controller = LessonEngine.create(twoTaskConfig("fake-d"));
    await controller.boot();

    fake.calls.mount[0].report({ ok: false, reason: "try again" });

    const reader = LessonCommon.createProgress({ storage: LessonCommon.storage, xpKey: "xp", awardedKey: "aw" });
    assert.equal(reader.xp(), 0);
    const result = dom.getElementById("ttResult");
    assert.equal(result.classList.contains("is-fail"), true);
    assert.equal(dom.getElementById("ttResultBody").textContent, "try again");
  });
});

test("setLocale repaints core prose and fans out to the plugin", async () => {
  await withDom("tt", async (dom) => {
    const fake = makeFakePlugin("fake-e");
    LessonEngine.register(fake.plugin);
    const cfg = twoTaskConfig("fake-e");
    const controller = LessonEngine.create(cfg);
    await controller.boot();

    // simulate a kernel-controller re-bind: mutate the cfg prose, then setLocale
    cfg.tasks[0].title = "Tarjeta uno";
    controller.setLocale();

    assert.equal(dom.getElementById("ttTitle").textContent, "Tarjeta uno");
    assert.equal(fake.calls.setLocale.length, 1);
    assert.equal(fake.calls.setLocale[0].task.title, "Tarjeta uno");
  });
});

test("the core dispatches by archetype (genericity)", async () => {
  await withDom("tt", async () => {
    const alpha = makeFakePlugin("alpha");
    const beta = makeFakePlugin("beta");
    LessonEngine.register(alpha.plugin);
    LessonEngine.register(beta.plugin);

    const controller = LessonEngine.create(twoTaskConfig("beta"));
    await controller.boot();

    assert.equal(beta.calls.mount.length, 1, "beta plugin was mounted");
    assert.equal(alpha.calls.mount.length, 0, "alpha plugin was not touched");
  });
});

test("an unknown archetype degrades to a no-op controller", async () => {
  await withDom("tt", async () => {
    const controller = LessonEngine.create(twoTaskConfig("does-not-exist"));
    // boot resolves without throwing
    await controller.boot();
    assert.equal(typeof controller.render, "function");
  });
});

test("a trailing summary card renders the recap and deactivates the plugin surface", async () => {
  await withDom("tt", async (dom) => {
    const fake = makeFakePlugin("fake-f");
    LessonEngine.register(fake.plugin);
    const cfg = twoTaskConfig("fake-f");
    cfg.tasks.push({
      summary: true,
      title: "Recap",
      summaryIntro: "You learned:",
      summaryItems: [{ title: "A", text: "did a" }],
      summaryClose: "Onward.",
    });
    const controller = LessonEngine.create(cfg);
    await controller.boot();

    // progress count excludes the summary card
    assert.equal(dom.getElementById("ttProgress").textContent, "Task 1 / 2");

    // jump to the summary card
    dom.getElementById("ttNext").click(); // -> card 2
    dom.getElementById("ttNext").click(); // -> summary
    assert.equal(dom.getElementById("ttSummary").hidden, false);
    assert.equal(dom.getElementById("ttProgress").textContent, "Recap");
    assert.equal(fake.calls.deactivate.length, 1);
    assert.equal(dom.getElementById("ttNext").textContent, "Next lesson");
  });
});

// ---- widget plugins (viz / checkpoint shape) -------------------------------
// A widget plugin owns one self-contained body (a MemoryViz / Quiz), carries no
// tasks, and does not grade. The core must exempt it from the tasks guard, skip
// the card chrome / result panel / task nav, and still fan setLocale out to it.
function makeFakeWidgetPlugin(archetype) {
  const calls = { mount: [], setLocale: [] };
  return {
    plugin: {
      archetype,
      body: "widget",
      mount(ctx) { calls.mount.push(ctx); return { tag: archetype + "-widget" }; },
      setLocale(surface) { calls.setLocale.push({ surface }); },
    },
    calls,
  };
}

// A widget config carries NO tasks - the whole body is the plugin's widget.
function widgetConfig(archetype) {
  return { archetype, prefix: "tt", xpKey: "xp", awardedKey: "aw", awardAmount: 20 };
}

test("a widget plugin mounts one body with no tasks, grade, or result panel", async () => {
  await withDom("tt", async (dom) => {
    const fake = makeFakeWidgetPlugin("fake-viz");
    LessonEngine.register(fake.plugin);
    const controller = LessonEngine.create(widgetConfig("fake-viz"));
    await controller.boot();

    assert.equal(fake.calls.mount.length, 1, "the widget body is mounted once");
    assert.equal(dom.getElementById("ttResult").hidden, true, "no result panel for a widget lesson");
    assert.equal(dom.getElementById("ttPrev").disabled, true, "no in-lesson prev nav");
    assert.equal(dom.getElementById("ttNext").disabled, false);
    assert.equal(dom.getElementById("ttNext").textContent, "Next lesson");
  });
});

test("a widget plugin gets setLocale fanned out with its surface", async () => {
  await withDom("tt", async () => {
    const fake = makeFakeWidgetPlugin("fake-viz2");
    LessonEngine.register(fake.plugin);
    const controller = LessonEngine.create(widgetConfig("fake-viz2"));
    await controller.boot();

    controller.setLocale();
    assert.equal(fake.calls.setLocale.length, 1);
    assert.equal(fake.calls.setLocale[0].surface.tag, "fake-viz2-widget");
  });
});

test("Next on a widget lesson advances to the next lesson", async () => {
  await withDom("tt", async (dom, hrefBox) => {
    const fake = makeFakeWidgetPlugin("fake-viz3");
    LessonEngine.register(fake.plugin);
    const controller = LessonEngine.create(widgetConfig("fake-viz3"));
    await controller.boot();

    dom.getElementById("ttNext").click();
    assert.equal(hrefBox.href, "next-lesson.html");
  });
});

// A recap card has no goal of its own. Before this was fixed the previous card's
// goal list stayed on screen under a "Goal" heading - and because setLocale only
// repaints the CURRENT card's prose, switching language left that stale list in
// the old language while the rest of the page changed. Reported from the live
// Spanish build of a git lesson.
test("a summary card clears AND hides the previous card's goal section", async () => {
  await withDom("tt", async (dom) => {
    const fake = makeFakePlugin("fake-g");
    LessonEngine.register(fake.plugin);
    const cfg = twoTaskConfig("fake-g");
    cfg.tasks[0].goal = ["do the first thing", "then the second"];
    cfg.tasks.push({
      summary: true,
      title: "Recap",
      summaryIntro: "You learned:",
      summaryItems: [{ title: "A", text: "did a" }],
      summaryClose: "Onward.",
    });
    const controller = LessonEngine.create(cfg);
    await controller.boot();

    const goal = dom.getElementById("ttGoal");
    const goalSection = dom.getElementById("ttGoalSection");
    assert.equal(goalSection.hidden, false, "a practice card shows its goal");
    assert.equal((goal.children || []).length, 2, "and paints its goal lines");

    dom.getElementById("ttNext").click(); // -> card 2
    dom.getElementById("ttNext").click(); // -> summary
    assert.equal(goalSection.hidden, true, "the recap hides the goal heading");
    assert.equal(goal.innerHTML, "", "and leaves no stale goal lines behind");

    // stepping back must bring it back, or the goal is gone for the rest of the lesson
    dom.getElementById("ttPrev").click();
    assert.equal(goalSection.hidden, false, "a practice card shows it again");
  });
});
