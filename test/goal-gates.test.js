// test/goal-gates.test.js - the gate that keeps the LIVE GOAL TRACKER honest.
//
// WHY THIS EXISTS
// A goal `gate` with a typo in it does not throw and does not warn. The tracker
// row simply stays grey forever, and a learner staring at a finished solution
// reads that as "my correct answer is wrong". The assertion that catches it has
// existed for a while inside tools/lib/lesson-validators.mjs - but it was only
// reachable through tools/verify-lesson.mjs, a per-lesson tool somebody has to
// remember to run. CI and the push gate run tools/validate.mjs, so a dead gate
// could ship. These tests pin the REACH, not the logic: they prove validate.mjs
// itself reports a dead gate, and that it refuses to pass when it cannot look.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.dirname(__dirname);
const load = () => import(path.join(ROOT, "tools", "validate.mjs"));

const SOLUTION = [
  "public class Cat",
  "{",
  "    public string CheckAndSign(int hoursSinceMeal)",
  "    {",
  '        return hoursSinceMeal >= 4 ? "FEED" : "FULL";',
  "    }",
  "}",
].join("\n");

// The real scanner is the vendored bundle's; a fake keeps this test fast and
// independent of a re-vendor, since what is under test is the wiring.
function scanner(source) {
  if (source !== SOLUTION) return { types: [] };
  return {
    types: [{
      name: "Cat", kind: "class", bases: [],
      members: [{ name: "CheckAndSign", kind: "method", detail: "string CheckAndSign(int hoursSinceMeal)" }],
    }],
  };
}

const NO_SCANNER = Symbol("no scanner");

async function errorsFor(task, scanArg, archetype = "build") {
  const scan = scanArg === NO_SCANNER ? null : (scanArg || scanner);
  const { checkGoalGates } = await load();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "goal-gates-"));
  const lessonDir = path.join(dir, "lesson");
  fs.mkdirSync(lessonDir, { recursive: true });
  fs.writeFileSync(path.join(lessonDir, "data.js"),
    "window.LESSON_CONFIG = " + JSON.stringify({ tasks: [task] }) + ";");
  const errors = [];
  const report = { error: (m) => errors.push(m), warn: () => {}, note: () => {} };
  try {
    // The third argument is the whole vendored code-lab bundle, not just the C#
    // scanner: a git lesson's gates are judged by replaying its solution through
    // the git runtime that lives in the same bundle.
    checkGoalGates([{ registryId: "fake", path: "lesson", meta: { archetype } }], dir,
      scan ? { scanCSharp: scan } : null, report);
    return errors;
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

const GOOD = {
  solution: SOLUTION,
  goal: ["one"],
  goals: [{
    code: ["class Cat", "string CheckAndSign(int hoursSinceMeal)"],
    gate: { type: "Cat", member: "CheckAndSign" },
  }],
};

test("a tracker that lights up on its own solution reports nothing", async () => {
  const errors = await errorsFor(GOOD);
  assert.deepEqual(errors, []);
});

test("a gate naming a type the solution never declares is reported", async () => {
  const errors = await errorsFor({
    ...GOOD,
    goals: [{ ...GOOD.goals[0], gate: { type: "CatXX", member: "CheckAndSign" } }],
  });
  // A dead gate CASCADES: no type is found, so every row under it is dead too.
  // Assert the cause is named rather than pinning a count on the fallout.
  assert.ok(errors.some((e) => /gate \(CatXX/.test(e) && /could never tick/.test(e)), errors.join("\n"));
  assert.ok(errors.every((e) => /"fake"/.test(e)), "a course-wide sweep must say WHICH lesson");
});

// The finer case, and the one that hides: the box header matches, so the box
// looks green, while a member row underneath can never tick.
test("a member row the solution never declares is reported", async () => {
  const errors = await errorsFor({
    ...GOOD,
    goals: [{ ...GOOD.goals[0], code: ["class Cat", "string CheckAndSignXX(int hoursSinceMeal)"] }],
  });
  assert.ok(errors.some((e) => /CheckAndSignXX/.test(e) && /could never tick/.test(e)), errors.join("\n"));
  assert.ok(!errors.some((e) => /\.gate \(/.test(e)),
    "the gate itself matches - blaming it would send the author hunting in the wrong place");
});

// Goals are index-aligned with the localized prose they tick.
test("more gates than goal lines is reported", async () => {
  const errors = await errorsFor({
    ...GOOD,
    goal: ["one", "two"],
    goals: [GOOD.goals[0]],
  });
  assert.ok(errors.some((e) => /index-aligned/.test(e)), errors.join("\n"));
});

// The failure mode this whole file exists to prevent: a check that goes quiet.
test("no scanner FAILS the run instead of passing on zero evidence", async () => {
  const errors = await errorsFor(GOOD, NO_SCANNER);
  assert.equal(errors.length, 1, errors.join("\n"));
  assert.match(errors[0], /went unchecked/);
});

test("a lesson with no goals at all is not an error", async () => {
  const errors = await errorsFor({ solution: SOLUTION, goal: ["one"] });
  assert.deepEqual(errors, []);
});

// A git gate speaks a different vocabulary entirely - `ran`, `staged`, `commit`,
// never `type`/`member`. Scanning one as C# finds no types, so EVERY git gate
// reads as empty and gets condemned: 65 errors against content that was correct.
// That is the worst kind of failure, because a checker that cries wolf on good
// content is a checker somebody switches off. Dispatch is therefore on archetype.
test("a git lesson is not judged by the C# scanner", async () => {
  const errors = await errorsFor({
    goal: ["start a repository"],
    goals: [{ code: ["git init"], gate: { ran: "git init" } }],
    start: [],
    solution: ["git init"],
  }, undefined, "git");
  assert.deepEqual(errors.filter((e) => /empty gate/.test(e)), [], errors.join("\n"));
});

// ...and the git path must still be able to FAIL, or the dispatch above has
// simply swapped a noisy checker for a silent one.
test("a git gate the solution never satisfies is reported", async () => {
  const errors = await errorsFor({
    goal: ["start a repository"],
    goals: [{ code: ["git init"], gate: { ran: "git nonesuch" } }],
    start: [],
    solution: ["git init"],
  }, undefined, "git");
  assert.ok(errors.length, "a dead git gate went unreported");
});
