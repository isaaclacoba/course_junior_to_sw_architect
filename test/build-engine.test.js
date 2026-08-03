"use strict";

// Unit test for build-engine.js window.BuildEngine.create(...).setLocale():
// re-localizing prose in place must NOT touch the editor buffer, so a voice/lang
// swap keeps the learner's work. Backs up the end-to-end swap proof with a fast,
// browser-free regression guard. Dependency-free: `node --test test/`.
//
// build-engine.js references `LessonCommon`, `CodeLab`, `document`, `history` and
// `window` as globals (in the browser window IS the global object), so the vm
// context's global is made self-referential (window === globalThis) and the real
// LessonCommon is provided by loading page-shell.js into the same context first.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function read(rel) {
  return fs.readFileSync(path.join(__dirname, "..", rel), "utf8");
}

function makeEl(id) {
  const el = {
    id, hidden: false, textContent: "", innerHTML: "", disabled: false, value: "",
    _cls: new Set(),
    classList: {
      toggle(c, on) { if (on) el._cls.add(c); else el._cls.delete(c); },
      add(c) { el._cls.add(c); },
      remove(c) { el._cls.delete(c); },
      contains(c) { return el._cls.has(c); },
    },
    children: [],
    appendChild(c) { el.children.push(c); return c; },
    closest() { return el; },
    addEventListener() {},
    setAttribute() {}, getAttribute() { return null; }, hasAttribute() { return false; },
  };
  return el;
}

function buildContext() {
  const els = {};
  const document = {
    getElementById(id) { return els[id] || (els[id] = makeEl(id)); },
    createElement(tag) { return makeEl(tag); },
    addEventListener() {},
    currentScript: null,
  };
  let setValueCount = 0;
  class MonacoEditor {
    setValue(v) { setValueCount++; this._v = v; }
    getValue() { return this._v; }
    setMarkers() {}
    mount() { return Promise.resolve(); }
  }
  class RoslynIframeRunner {
    run() { return Promise.resolve({ output: "", errors: [] }); }
    warm() { return Promise.resolve(); }
  }
  const sandbox = {
    console: { error() {}, log() {} },
    document,
    location: { hash: "", href: "" },
    history: { replaceState() {} },
    addEventListener() {},
    CodeLab: { MonacoEditor, RoslynIframeRunner, loadMonaco: () => Promise.resolve() },
  };
  sandbox.window = sandbox; // window IS the global object, as in a browser
  vm.createContext(sandbox);
  // page-shell.js exposes window.LessonCommon then bails (no window.PAGE); this
  // gives build-engine the real shared helpers.
  vm.runInContext(read("page-shell.js"), sandbox);
  vm.runInContext(read("kernel/grading/output-match.js"), sandbox);
  vm.runInContext(read("build-engine.js"), sandbox);
  return {
    sandbox, els,
    setValueCount: () => setValueCount,
    resetSetValue: () => { setValueCount = 0; },
  };
}

function cfg() {
  return {
    prefix: "t",
    tasks: [
      { title: "A", concept: "cA", context: "xA", goal: ["gA"], example: "exA", expected: "EA", starter: "S0", solution: "O0" },
      { title: "B", concept: "cB", context: "xB", goal: ["gB"], example: "exB", expected: "EB", starter: "S1", solution: "O1" },
    ],
  };
}

test("build-engine exposes window.BuildEngine.create", () => {
  const { sandbox } = buildContext();
  assert.equal(typeof sandbox.window.BuildEngine, "object");
  assert.equal(typeof sandbox.window.BuildEngine.create, "function");
});

test("setLocale repaints the current card's prose from cfg", () => {
  const { sandbox, els } = buildContext();
  const config = cfg();
  const widget = sandbox.window.BuildEngine.create(config);
  widget.render(); // paints card 0 => tTitle = "A"
  assert.equal(els.tTitle.textContent, "A");

  config.tasks[0].title = "A-es";
  config.tasks[0].concept = "cA-es";
  widget.setLocale();
  assert.equal(els.tTitle.textContent, "A-es");
  assert.equal(els.tConcept.textContent, "cA-es");
});

test("setLocale does NOT call editor.setValue (buffer + card index preserved)", () => {
  const { sandbox, resetSetValue, setValueCount } = buildContext();
  const config = cfg();
  const widget = sandbox.window.BuildEngine.create(config);
  widget.render();
  resetSetValue(); // ignore the setValue from the initial render
  config.tasks[0].title = "A2";
  widget.setLocale();
  assert.equal(setValueCount(), 0);
});

test("the factory does not self-boot when window.BUILD_CONFIG is unset", () => {
  // buildContext never sets window.BUILD_CONFIG, so the footer must not run - if it
  // did, create() would run against the fake DOM during load and this would throw.
  assert.doesNotThrow(buildContext);
});
