"use strict";

// Unit test for tools/validate.mjs checkConceptCoverage - the Phase-A concept
// i18n gate. Drives the pure check on SYNTHETIC in-memory fixtures (no real repo
// files) and asserts on a makeReport()-style collector's error count/messages.
// Dependency-free: `node --test test/concept-coverage.test.js`.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let checkConceptCoverage, makeReport;

test.before(async () => {
  const mod = await import(pathToFileURL(path.join(__dirname, "..", "tools", "validate.mjs")));
  checkConceptCoverage = mod.checkConceptCoverage;
  makeReport = mod.makeReport;
});

// A lesson "owns" (introduces) the concepts mapped to it here.
function fixture() {
  const introducedIds = new Set(["value", "variable", "object"]);
  const ownerByConcept = new Map([
    ["value", "foundations"],
    ["variable", "foundations"],
    ["object", "objects-intro"],
  ]);
  return { introducedIds, ownerByConcept };
}

function keysBundle(voice, lang, keys) {
  return { voice, lang, keys: new Set(keys) };
}

test("all owned defs present -> 0 errors", () => {
  const { introducedIds, ownerByConcept } = fixture();
  const report = makeReport();
  const lessons = [
    { lessonId: "foundations", bundles: [
      keysBundle("default", "en", ["concept.value.def", "concept.value.term", "concept.variable.def"]),
    ] },
  ];
  checkConceptCoverage(lessons, { introducedIds, ownerByConcept }, report);
  assert.equal(report.errors.length, 0, report.errors.join("\n"));
});

test("bundle declares concept text but misses one owned .def -> 1 coverage ERROR", () => {
  const { introducedIds, ownerByConcept } = fixture();
  const report = makeReport();
  const lessons = [
    { lessonId: "foundations", bundles: [
      // has value's def (and a term key), so the gate is active, but variable.def is missing
      keysBundle("default", "en", ["concept.value.def", "concept.value.term"]),
    ] },
  ];
  checkConceptCoverage(lessons, { introducedIds, ownerByConcept }, report);
  assert.equal(report.errors.length, 1, report.errors.join("\n"));
  assert.match(report.errors[0], /missing "concept\.variable\.def"/);
});

test("unknown concept id -> 1 ERROR", () => {
  const { introducedIds, ownerByConcept } = fixture();
  const report = makeReport();
  const lessons = [
    { lessonId: "foundations", bundles: [
      // typo'd id "valeu" is not introduced anywhere; the two real owned defs are present
      keysBundle("default", "en", ["concept.valeu.def", "concept.value.def", "concept.variable.def"]),
    ] },
  ];
  checkConceptCoverage(lessons, { introducedIds, ownerByConcept }, report);
  assert.equal(report.errors.length, 1, report.errors.join("\n"));
  assert.match(report.errors[0], /"valeu" is not an introduced concept/);
});

test("concept text in a non-owner lesson -> 1 ownership ERROR", () => {
  const { introducedIds, ownerByConcept } = fixture();
  const report = makeReport();
  const lessons = [
    // objects-intro owns "object"; it defines that, but also (wrongly) defines "value"
    { lessonId: "objects-intro", bundles: [
      keysBundle("default", "en", ["concept.object.def", "concept.value.def"]),
    ] },
  ];
  checkConceptCoverage(lessons, { introducedIds, ownerByConcept }, report);
  assert.equal(report.errors.length, 1, report.errors.join("\n"));
  assert.match(report.errors[0], /introduced by "foundations", not this lesson/);
});

test("bundle with NO concept keys -> 0 errors (gate inert)", () => {
  const { introducedIds, ownerByConcept } = fixture();
  const report = makeReport();
  const lessons = [
    // foundations owns value+variable but this bundle only carries prose keys
    { lessonId: "foundations", bundles: [
      keysBundle("default", "es", ["hero.title", "intro.0", "task.1.title"]),
    ] },
  ];
  checkConceptCoverage(lessons, { introducedIds, ownerByConcept }, report);
  assert.equal(report.errors.length, 0, report.errors.join("\n"));
});
