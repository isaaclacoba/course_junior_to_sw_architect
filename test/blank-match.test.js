"use strict";

// Unit test for kernel/grading/blank-match.js - the shared fill-in-the-blank
// grading policy that drill-engine.js's comparison was lifted into. It is DOM-free
// and pure, so every path is testable with plain objects and no browser.
// Dependency-free: `node --test test/`.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const B = require(path.join(__dirname, "..", "kernel", "grading", "blank-match.js"));

// --- norm / canonical (the two normalizers, reproduced from drill-engine) -----
test("norm: collapses whitespace, trims, lowercases", () => {
  assert.equal(B.norm("  Public   Class  "), "public class");
  assert.equal(B.norm(null), "");
});

test("canonical: drops a trailing semicolon and all whitespace, lowercases", () => {
  assert.equal(B.canonical("x = 5;"), "x=5");
  assert.equal(B.canonical("X=5"), "x=5");
  assert.equal(B.canonical(undefined), "");
});

// --- classify: exact / almost / wrong ----------------------------------------
test("classify: an exact answer (after canonicalizing) is exact", () => {
  assert.equal(B.classify("x = 5;", { answer: "x=5" }), "exact");
  assert.equal(B.classify("Console", { answer: "console" }), "exact");
});

test("classify: an accept[] alternate is exact", () => {
  assert.equal(B.classify("myVar", { answer: "x", accept: ["myVar", "name"] }), "exact");
});

test("classify: a non-empty overlapping value is almost", () => {
  // "Writ" is contained in the answer "WriteLine" -> close, and non-empty -> almost.
  assert.equal(B.classify("Writ", { answer: "WriteLine" }), "almost");
});

test("classify: an empty value is wrong, never almost", () => {
  // Every answer .includes("") is true, but the empty guard keeps it wrong.
  assert.equal(B.classify("", { answer: "anything" }), "wrong");
  assert.equal(B.classify("   ", { answer: "anything" }), "wrong");
});

test("classify: an unrelated value is wrong", () => {
  assert.equal(B.classify("zzz", { answer: "WriteLine" }), "wrong");
});

// --- gradeBlanks: the whole-card verdict -------------------------------------
test("gradeBlanks: all exact -> ok, no wrong ids", () => {
  const out = B.gradeBlanks({
    blanks: [
      { id: 1, answer: "x" },
      { id: 2, answer: "5" },
    ],
    values: { 1: "x", 2: "5" },
  });
  assert.equal(out.ok, true);
  assert.equal(out.reason, "pass");
  assert.deepEqual(out.wrong, []);
});

test("gradeBlanks: a wrong blank -> not ok, reason 'blanks', its id in wrong", () => {
  const out = B.gradeBlanks({
    blanks: [
      { id: 1, answer: "x" },
      { id: 2, answer: "5" },
    ],
    values: { 1: "x", 2: "nope" },
  });
  assert.equal(out.ok, false);
  assert.equal(out.reason, "blanks");
  assert.deepEqual(out.wrong, [2]);
});

test("gradeBlanks: an almost still fails and lists its id", () => {
  const out = B.gradeBlanks({
    blanks: [{ id: 7, answer: "WriteLine" }],
    values: { 7: "Writ" },
  });
  assert.equal(out.ok, false);
  assert.deepEqual(out.wrong, [7]);
  assert.equal(out.results[0].status, "almost");
});

test("gradeBlanks: accept[] alternates are accepted", () => {
  const out = B.gradeBlanks({
    blanks: [{ id: 1, answer: "x", accept: ["myVar"] }],
    values: { 1: "myVar" },
  });
  assert.equal(out.ok, true);
  assert.deepEqual(out.wrong, []);
});

test("gradeBlanks: a missing value is wrong (undefined -> empty)", () => {
  const out = B.gradeBlanks({
    blanks: [{ id: 1, answer: "x" }],
    values: {},
  });
  assert.equal(out.ok, false);
  assert.deepEqual(out.wrong, [1]);
  assert.equal(out.results[0].status, "wrong");
});
