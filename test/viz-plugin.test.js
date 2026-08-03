"use strict";

// Unit tests for the "viz" archetype PLUGIN - kernel/engine/plugins/viz-plugin.js.
//
// A viz lesson is a WIDGET plugin (plugin.body === "widget"): one self-contained
// CodeLab.MemoryViz body, no graded tasks, no result panel. These tests prove the
// plugin mounts that body once, that a language swap destroys the old controller
// and re-creates it (the PageShellViz.setLocale behaviour), and that the generic
// core drives the widget shape - no result panel, Next reads "Next lesson".
//
// Same hand-built fake DOM approach as test/lesson-engine.test.js and
// test/build-plugin.test.js (there is no jsdom in this repo). LessonCommon is the
// REAL kernel/page-shell/lesson-common.js; only CodeLab.MemoryViz is faked.

const test = require("node:test");
const assert = require("node:assert/strict");

const LessonCommon = require("../kernel/page-shell/lesson-common.js");
const LessonEngine = require("../kernel/engine/lesson-engine.js");
// Requiring the plugin registers it on the core it require()s (same cached module).
const VizPlugin = require("../kernel/engine/plugins/viz-plugin.js");

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

// Build a document whose getElementById serves the ids the core queries plus the
// generic surface host (ttSurface) the widget plugin mounts into.
function makeDom(prefix) {
  const ids = [
    "Meta", "Title", "Context", "Concept", "Progress", "Goal",
    "Result", "ResultTitle", "ResultBody",
    "Summary", "SummaryIntro", "SummaryList", "SummaryClose",
    "Prev", "Next",
    "Surface",
  ].map((s) => prefix + s);
  const registry = {};
  ids.forEach((id) => { registry[id] = makeEl(id); });
  registry["courseXpLabel"] = makeEl("courseXpLabel");
  return {
    getElementById(id) { return registry[id] || null; },
    createElement(tag) { return makeEl("<" + tag + ">"); },
  };
}

// A fake CodeLab whose MemoryViz.create returns a controller recording destroy()
// calls and remembering the config it was handed.
function makeCodeLab() {
  const created = [];
  return {
    MemoryViz: {
      create(host, cfg) {
        const controller = {
          host,
          cfg,
          destroyed: false,
          destroy() { this.destroyed = true; },
        };
        created.push(controller);
        return controller;
      },
    },
    _created: created,
  };
}

// Install fake browser globals for the length of fn, then restore.
async function withDom(prefix, fn) {
  const saved = {};
  ["document", "window", "history", "location", "LessonCommon", "CodeLab"].forEach((k) => {
    saved[k] = { had: Object.prototype.hasOwnProperty.call(globalThis, k), val: globalThis[k] };
  });
  const dom = makeDom(prefix);
  const codeLab = makeCodeLab();
  const hrefBox = { href: "" };
  globalThis.document = dom;
  globalThis.location = { hash: "", href: "" };
  globalThis.history = { replaceState() {} };
  globalThis.window = { location: hrefBox, addEventListener() {}, PAGE: { nextHref: "next-lesson.html" } };
  LessonCommon.storage = LessonCommon.memoryStorage();
  globalThis.LessonCommon = LessonCommon;
  globalThis.CodeLab = codeLab;
  try {
    return await fn(dom, codeLab, hrefBox);
  } finally {
    Object.keys(saved).forEach((k) => {
      if (saved[k].had) globalThis[k] = saved[k].val;
      else delete globalThis[k];
    });
  }
}

// A viz config carries NO tasks - the whole body is the MemoryViz widget. An
// explicit awardedKey keeps the derivation off the (pathname-less) fake location.
function vizConfig() {
  return {
    archetype: "viz",
    prefix: "tt",
    xpKey: "xp",
    awardedKey: "tt_awarded",
    awardAmount: 20,
    steps: [{ narration: "one" }],
  };
}

// ---------------------------------------------------------------------------

test("mount creates the MemoryViz widget once, into a lesson-viz host under the surface", async () => {
  await withDom("tt", async (dom, codeLab) => {
    const controller = LessonEngine.create(vizConfig());
    await controller.boot();

    assert.equal(codeLab._created.length, 1, "the MemoryViz widget is created exactly once");
    const surfaceHost = dom.getElementById("ttSurface");
    const created = codeLab._created[0];
    assert.equal(created.host.className, "lesson-viz", "mounted into a <section class='lesson-viz'>");
    assert.ok((surfaceHost.children || []).includes(created.host), "the viz host is appended to ttSurface");
    assert.equal(created.cfg.archetype, "viz", "the whole lesson config is handed to MemoryViz");
  });
});

test("setLocale destroys the old controller and creates a fresh one", async () => {
  await withDom("tt", async (dom, codeLab) => {
    const controller = LessonEngine.create(vizConfig());
    await controller.boot();

    const first = codeLab._created[0];
    assert.equal(first.destroyed, false);

    controller.setLocale();

    assert.equal(first.destroyed, true, "the old MemoryViz controller is destroyed");
    assert.equal(codeLab._created.length, 2, "a fresh MemoryViz is created for the new language");
    assert.notEqual(codeLab._created[1], first);
  });
});

test("the core drives the widget shape: no result panel, Next reads 'Next lesson'", async () => {
  await withDom("tt", async (dom, codeLab, hrefBox) => {
    const controller = LessonEngine.create(vizConfig());
    await controller.boot();

    assert.equal(dom.getElementById("ttResult").hidden, true, "no result panel for a widget lesson");
    assert.equal(dom.getElementById("ttPrev").disabled, true, "no in-lesson prev nav");
    const next = dom.getElementById("ttNext");
    assert.equal(next.disabled, false);
    assert.equal(next.textContent, "Next lesson");

    next.click();
    assert.equal(hrefBox.href, "next-lesson.html", "Next advances to the next lesson");
  });
});
