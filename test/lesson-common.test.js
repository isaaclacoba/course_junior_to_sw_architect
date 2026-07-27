"use strict";

// Unit tests for the shared lesson helpers (window.LessonCommon in
// page-shell.js). Dependency-free: run with `node --test test/`.
//
// page-shell.js is an IIFE that defines and exposes window.LessonCommon before
// it bails out on the missing window.PAGE, so loading it in a vm sandbox with a
// minimal fake window/console/location is enough to reach the helpers.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadLessonCommon() {
  const src = fs.readFileSync(path.join(__dirname, "..", "page-shell.js"), "utf8");
  const sandbox = { window: {}, console: { error() {} }, location: { hash: "" } };
  vm.runInNewContext(src, sandbox);
  return { LessonCommon: sandbox.window.LessonCommon, location: sandbox.location };
}

test("page-shell exposes LessonCommon even without window.PAGE", () => {
  const { LessonCommon } = loadLessonCommon();
  assert.equal(typeof LessonCommon.escapeHtml, "function");
  assert.equal(typeof LessonCommon.renderInline, "function");
  assert.equal(typeof LessonCommon.cardFromHash, "function");
});

test("escapeHtml escapes &, < and >", () => {
  const { LessonCommon } = loadLessonCommon();
  assert.equal(LessonCommon.escapeHtml("a & b < c > d"), "a &amp; b &lt; c &gt; d");
});

test("escapeHtml coerces non-string input", () => {
  const { LessonCommon } = loadLessonCommon();
  assert.equal(LessonCommon.escapeHtml(42), "42");
  assert.equal(LessonCommon.escapeHtml(null), "null");
});

test("renderInline wraps `backticks` in <code> and escapes inside", () => {
  const { LessonCommon } = loadLessonCommon();
  assert.equal(LessonCommon.renderInline("use `a < b` here"), "use <code>a &lt; b</code> here");
});

test("renderInline wraps **bold** in <strong>", () => {
  const { LessonCommon } = loadLessonCommon();
  assert.equal(LessonCommon.renderInline("this is **important** ok"), "this is <strong>important</strong> ok");
});

test("renderInline escapes plain text with no markup", () => {
  const { LessonCommon } = loadLessonCommon();
  assert.equal(LessonCommon.renderInline("a < b & c"), "a &lt; b &amp; c");
});

test("renderInline handles empty and undefined input", () => {
  const { LessonCommon } = loadLessonCommon();
  assert.equal(LessonCommon.renderInline(""), "");
  assert.equal(LessonCommon.renderInline(undefined), "");
});

test("cardFromHash returns 0 when the hash is absent", () => {
  const { LessonCommon, location } = loadLessonCommon();
  location.hash = "";
  assert.equal(LessonCommon.cardFromHash(5), 0);
});

test("cardFromHash maps #3 to zero-based index 2", () => {
  const { LessonCommon, location } = loadLessonCommon();
  location.hash = "#3";
  assert.equal(LessonCommon.cardFromHash(5), 2);
});

test("cardFromHash clamps above-range values to the last card", () => {
  const { LessonCommon, location } = loadLessonCommon();
  location.hash = "#99";
  assert.equal(LessonCommon.cardFromHash(5), 4);
});

test("cardFromHash clamps #0 to the first card", () => {
  const { LessonCommon, location } = loadLessonCommon();
  location.hash = "#0";
  assert.equal(LessonCommon.cardFromHash(5), 0);
});
