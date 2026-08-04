// test/lesson-body.test.js - lessonBody(), the non-emptiness assertion shared by
// the three lesson gates (i18n-roundtrip, validate, verify-lesson).
//
// WHY THIS EXISTS
// Every lesson gate is a DRIFT detector: the round-trip compares a lesson against
// itself across a language swap, validate walks the config it manages to load,
// verify-lesson grades the tasks it finds. Drift detectors are all silent on the
// empty set - a lesson with no body round-trips perfectly, has no invalid fields
// and has no failing tasks. Measured 2026-08-03: renaming window.BUILD_CONFIG in
// a live lesson left ALL THREE gates green, with verify-lesson reporting
// "1 passed" having graded zero tasks.
//
// So the interesting cases here are the ones that must FAIL. A check that cannot
// fail is worth nothing, and this one guards a migration (the lesson engine's
// unified LESSON_CONFIG) that rewrites all 83 data.js files at once.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const fs = require("node:fs");
const LIB = path.join(path.dirname(__dirname), "tools", "lib.mjs");
const VERIFY_SRC = () =>
  fs.readFileSync(path.join(path.dirname(__dirname), "tools", "verify-lesson.mjs"), "utf8");
const load = () => import(LIB);

// --- the shapes that are genuinely fine ------------------------------------
test("accepts each archetype's real body field", async () => {
  const { lessonBody } = await load();
  const cases = [
    ["build", { BUILD_CONFIG: { tasks: [1, 2, 3] } }, 3],
    ["drill", { DRILL_CONFIG: { tasks: [1] } }, 1],
    ["viz", { LESSON_VIZ: { steps: [1, 2] } }, 2],
    ["checkpoint", { QUIZ_CONFIG: { questions: [1, 2, 3, 4] } }, 4],
  ];
  for (const [arch, win, count] of cases) {
    const r = lessonBody(win, arch);
    assert.equal(r.ok, true, `${arch} should be accepted`);
    assert.equal(r.count, count);
  }
});

test("checkpoint still accepts the legacy CHECKPOINT_CONFIG spelling", async () => {
  const { lessonBody } = await load();
  assert.equal(lessonBody({ CHECKPOINT_CONFIG: { questions: [1] } }, "checkpoint").ok, true);
});

// --- forward compatibility with the lesson-engine migration -----------------
// The generic lesson engine collapses all four globals into window.LESSON_CONFIG.
// This check has to follow that migration forward, or it becomes an obstacle the
// migration has to disable - which would put us right back where we started.
test("accepts the unified LESSON_CONFIG for every archetype", async () => {
  const { lessonBody } = await load();
  for (const [arch, field] of [["build", "tasks"], ["drill", "tasks"], ["viz", "steps"], ["checkpoint", "questions"]]) {
    const r = lessonBody({ LESSON_CONFIG: { [field]: [1] } }, arch);
    assert.equal(r.ok, true, `${arch} under LESSON_CONFIG`);
    assert.equal(r.global, "LESSON_CONFIG");
  }
});

// --- the failures that matter ----------------------------------------------
test("rejects a lesson whose config global was renamed away", async () => {
  const { lessonBody } = await load();
  const r = lessonBody({ NONSENSE_CONFIG: { tasks: [1, 2] } }, "build");
  assert.equal(r.ok, false);
  // the message must name what it looked for, so a rename is diagnosable from
  // the gate output alone
  assert.match(r.reason, /LESSON_CONFIG/);
  assert.match(r.reason, /BUILD_CONFIG/);
});

test("rejects a config with an empty body array", async () => {
  const { lessonBody } = await load();
  assert.equal(lessonBody({ BUILD_CONFIG: { tasks: [] } }, "build").ok, false);
  assert.equal(lessonBody({ LESSON_VIZ: { steps: [] } }, "viz").ok, false);
  assert.equal(lessonBody({ QUIZ_CONFIG: { questions: [] } }, "checkpoint").ok, false);
});

test("rejects a config that is missing its body field entirely", async () => {
  const { lessonBody } = await load();
  const r = lessonBody({ BUILD_CONFIG: { prefix: "l1c" } }, "build");
  assert.equal(r.ok, false);
  assert.match(r.reason, /missing/);
});

test("rejects a body that is not an array", async () => {
  const { lessonBody } = await load();
  assert.equal(lessonBody({ BUILD_CONFIG: { tasks: 5 } }, "build").ok, false);
});

// A half-migrated lesson - the rewrite script wrote the new global but left the
// old one - is the likeliest way the migration goes wrong, and the one state
// where "some config exists" is NOT good enough.
test("rejects a half-migrated lesson carrying both globals", async () => {
  const { lessonBody } = await load();
  const r = lessonBody({ LESSON_CONFIG: { tasks: [1] }, BUILD_CONFIG: { tasks: [1] } }, "build");
  assert.equal(r.ok, false);
  assert.match(r.reason, /ambiguous/);
});

test("rejects an archetype it does not know", async () => {
  const { lessonBody } = await load();
  assert.equal(lessonBody({ BUILD_CONFIG: { tasks: [1] } }, "git").ok, false);
});

test("does not throw on an empty window bag", async () => {
  const { lessonBody } = await load();
  assert.equal(lessonBody({}, "build").ok, false);
  assert.equal(lessonBody(null, "build").ok, false);
});

// --- the gates agree on what a body IS --------------------------------------
test("every archetype in CONFIG_GLOBALS has a body field, and vice versa", async () => {
  const { CONFIG_GLOBALS, BODY_FIELD } = await load();
  assert.deepEqual(Object.keys(CONFIG_GLOBALS).sort(), Object.keys(BODY_FIELD).sort());
  for (const names of Object.values(CONFIG_GLOBALS)) {
    assert.equal(names[0], "LESSON_CONFIG", "the unified global must be accepted first for every archetype");
  }
});

// ---------------------------------------------------------------------------
// The "unknown archetype" trap.
//
// verify-lesson picks the body field from the archetype. When it cannot classify
// a lesson it used to skip the body check AND return true from hasBody() - i.e.
// assert nothing, then report a pass. That is the very bug this file exists to
// prevent, hiding in the fallback path: measured, a lesson whose meta.js lost its
// `archetype` field passed the old verifier while nothing about it was verified.
//
// These are SOURCE guards, not behavioural tests: tools/verify-lesson.mjs calls
// main() at import time, so it cannot be loaded into a test process. They exist
// to fail loudly if the loud-failure is ever deleted.
test("verify-lesson refuses to pass a lesson it cannot classify", () => {
  const src = VERIFY_SRC();
  const branch = src.match(/if \(archetype === "unknown"\) \{[\s\S]*?\n  \}/);
  assert.ok(branch, 'verify-lesson must branch on archetype === "unknown"');
  assert.match(branch[0], /bad\(/, "the unknown branch must report the failure");
  assert.match(branch[0], /allOk = false/, "the unknown branch must FAIL, not warn");
});

test("verify-lesson never guesses between build and drill", async () => {
  const { BODY_FIELD } = await load();
  // build and drill share the same body field ("tasks"), so a data.js sniff
  // cannot tell them apart. Guessing would mis-verify; refusing is correct.
  assert.equal(BODY_FIELD.build, BODY_FIELD.drill);
  const src = VERIFY_SRC();
  assert.ok(!/LESSON_CONFIG/.test(src.split("function detectArchetype")[1].split("\n}")[0]),
    "detectArchetype must not sniff LESSON_CONFIG - it cannot distinguish build from drill");
});
