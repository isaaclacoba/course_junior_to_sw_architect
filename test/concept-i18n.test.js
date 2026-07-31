"use strict";

// Unit tests for the DOM-free concept i18n adapter (window.ConceptI18n in
// resource/concept-i18n.js). Dependency-free: run with `node --test test/`.
//
// concept-i18n.js is a browser IIFE that assigns window.ConceptI18n, so loading
// it in a vm sandbox with a fake window is enough to reach the factory.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadConceptI18n() {
  const src = fs.readFileSync(
    path.join(__dirname, "..", "resource", "concept-i18n.js"),
    "utf8"
  );
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  return sandbox.window.ConceptI18n;
}

const base = {
  loop: { term: "loop", def: "repeat work" },
  method: { term: "method", def: "a named block" },
};

test("English only: term/def/search/ids equal the base values", () => {
  const ConceptI18n = loadConceptI18n();
  const ci = ConceptI18n.create({ overlays: {}, base: base, selection: {} });

  assert.equal(ci.term("loop"), "loop");
  assert.equal(ci.def("loop"), "repeat work");
  assert.equal(ci.search("loop"), "loop repeat work loop");
  assert.deepEqual(Array.from(ci.ids()).sort(), ["loop", "method"]);
});

test("translation present: def is es, and an omitted term falls back to base term", () => {
  const ConceptI18n = loadConceptI18n();
  const overlays = {
    // `loop` translates only the def and keeps the English term (no .term key).
    default: { loop: { def: "repite trabajo" } },
  };
  const ci = ConceptI18n.create({
    overlays: overlays,
    base: base,
    selection: { voice: "default", lang: "es" },
  });

  assert.equal(ci.def("loop"), "repite trabajo"); // translated def
  assert.equal(ci.term("loop"), "loop"); // independent fallback to base term
});

test("voice fallback: a missing voice paints the default overlay, then base", () => {
  const ConceptI18n = loadConceptI18n();
  const overlays = {
    default: { method: { term: "metodo", def: "un bloque con nombre" } },
    // no `child` voice at all
  };
  const ci = ConceptI18n.create({
    overlays: overlays,
    base: base,
    selection: { voice: "child", lang: "es" },
  });

  // falls through child -> default overlay
  assert.equal(ci.term("method"), "metodo");
  assert.equal(ci.def("method"), "un bloque con nombre");
  // `loop` is in neither overlay -> base
  assert.equal(ci.term("loop"), "loop");
  assert.equal(ci.def("loop"), "repeat work");
});

test("search(id) is lowercased and includes the id", () => {
  const ConceptI18n = loadConceptI18n();
  const overlays = { default: { loop: { term: "Bucle", def: "Repite Trabajo" } } };
  const ci = ConceptI18n.create({
    overlays: overlays,
    base: base,
    selection: { voice: "default", lang: "es" },
  });

  const s = ci.search("loop");
  assert.equal(s, s.toLowerCase());
  assert.equal(s, "bucle repite trabajo loop");
  assert.ok(s.includes("loop"));
});

test("missing id: term returns the raw id, def returns empty, no throw", () => {
  const ConceptI18n = loadConceptI18n();
  const ci = ConceptI18n.create({ overlays: {}, base: base, selection: {} });

  assert.equal(ci.term("ghost"), "ghost");
  assert.equal(ci.def("ghost"), "");
});

test("undefined overlays/base are guarded (no throw)", () => {
  const ConceptI18n = loadConceptI18n();
  const ci = ConceptI18n.create({});
  assert.equal(ci.term("x"), "x");
  assert.equal(ci.def("x"), "");
  assert.deepEqual(Array.from(ci.ids()), []);
});
