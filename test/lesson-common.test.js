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

test("memoryStorage stores, reads, and removes", () => {
  const { LessonCommon } = loadLessonCommon();
  const s = LessonCommon.memoryStorage();
  assert.equal(s.getItem("k"), null);
  s.setItem("k", "v");
  assert.equal(s.getItem("k"), "v");
  s.removeItem("k");
  assert.equal(s.getItem("k"), null);
});

test("createProgress starts XP at 0 and accumulates through the store", () => {
  const { LessonCommon } = loadLessonCommon();
  const store = LessonCommon.memoryStorage();
  const p = LessonCommon.createProgress({ storage: store, xpKey: "xp", awardedKey: "aw" });
  assert.equal(p.xp(), 0);
  assert.equal(p.addXP(25), 25);
  assert.equal(p.addXP(10), 35);
  assert.equal(store.getItem("xp"), "35");
});

test("createProgress tracks awarded cards and persists them", () => {
  const { LessonCommon } = loadLessonCommon();
  const store = LessonCommon.memoryStorage();
  const p = LessonCommon.createProgress({ storage: store, xpKey: "xp", awardedKey: "aw" });
  assert.equal(p.isAwarded(0), false);
  p.markAwarded(0);
  assert.equal(p.isAwarded(0), true);
  assert.equal(p.isAwarded(1), false);
  assert.deepEqual(JSON.parse(store.getItem("aw")), { 0: true });
});

test("createProgress reads back existing state from the store", () => {
  const { LessonCommon } = loadLessonCommon();
  const store = LessonCommon.memoryStorage();
  store.setItem("xp", "40");
  store.setItem("aw", JSON.stringify({ 2: true }));
  const p = LessonCommon.createProgress({ storage: store, xpKey: "xp", awardedKey: "aw" });
  assert.equal(p.xp(), 40);
  assert.equal(p.isAwarded(2), true);
});

test("createProgress uses the injected storage, leaving the default untouched", () => {
  const { LessonCommon } = loadLessonCommon();
  const store = LessonCommon.memoryStorage();
  const p = LessonCommon.createProgress({ storage: store, xpKey: "xp", awardedKey: "aw" });
  p.addXP(5);
  assert.equal(store.getItem("xp"), "5");
  assert.equal(LessonCommon.storage.getItem("xp"), null);
});

test("LessonCommon.storage defaults to a working store", () => {
  const { LessonCommon } = loadLessonCommon();
  assert.equal(typeof LessonCommon.storage.getItem, "function");
  assert.equal(typeof LessonCommon.storage.setItem, "function");
});
