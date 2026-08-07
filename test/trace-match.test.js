"use strict";

// Unit tests for the TRACE gate vocabulary - kernel/grading/trace-match.js - and
// the goal provider that feeds it to the tracker.
//
// A lab card is graded on what the program DID, so these tests are built on
// trace fixtures shaped exactly like the tracer's own output: frames with ids,
// kinds and receivers, a heap per step, and cumulative stdout.
//
// The fixtures are the two-cats program the design was grounded on:
//
//   var ana = new Cat("Ana");
//   var bo  = new Cat("Bo");
//   ana.Speak();
//   bo.Speak();

const test = require("node:test");
const assert = require("node:assert/strict");

const M = require("../kernel/grading/trace-match.js");
const Provider = require("../kernel/engine/widgets/trace-goal-provider.js");

// ---- fixtures --------------------------------------------------------------

const cat = (id, no, name) => ({ id, type: "Cat", no, fields: [["_name", name]] });

// The finished run: both cats built, both alive together, both spoken to.
const TWO_CATS = {
  code: ["var ana = new Cat(\"Ana\");"],
  steps: [
    { line: 1, frames: [{ id: "f0", name: "Main", kind: "entry" }], heap: [] },
    { line: 1, frames: [{ id: "f0", name: "Main", kind: "entry" }, { id: "c1", name: "Cat", kind: "ctor", recv: "Cat #1" }], heap: [cat("o1", 1, "Ana")] },
    { line: 2, frames: [{ id: "f0", name: "Main", kind: "entry" }], heap: [cat("o1", 1, "Ana")] },
    { line: 2, frames: [{ id: "f0", name: "Main", kind: "entry" }, { id: "c2", name: "Cat", kind: "ctor", recv: "Cat #2" }], heap: [cat("o1", 1, "Ana"), cat("o2", 2, "Bo")] },
    { line: 3, frames: [{ id: "f0", name: "Main", kind: "entry" }, { id: "m1", name: "Speak", kind: "method", recv: "Cat #1" }], heap: [cat("o1", 1, "Ana"), cat("o2", 2, "Bo")], stdout: "Ana\n" },
    { line: 4, frames: [{ id: "f0", name: "Main", kind: "entry" }, { id: "m2", name: "Speak", kind: "method", recv: "Cat #2" }], heap: [cat("o1", 1, "Ana"), cat("o2", 2, "Bo")], stdout: "Ana\nBo\n" },
  ],
};

// The STARTER: nothing built yet. Every gate must be red against this.
const STARTER = {
  code: ["// TODO"],
  steps: [{ line: 1, frames: [{ id: "f0", name: "Main", kind: "entry" }], heap: [] }],
};

// One cat, made twice in sequence but never both alive - the trap `liveObjects`
// exists to catch, and the reason it is a MAXIMUM per step and not a total.
const ONE_AT_A_TIME = {
  code: ["x"],
  steps: [
    { line: 1, frames: [{ id: "f0", name: "Main", kind: "entry" }, { id: "c1", name: "Cat", kind: "ctor", recv: "Cat #1" }], heap: [cat("o1", 1, "Ana")] },
    { line: 2, frames: [{ id: "f0", name: "Main", kind: "entry" }, { id: "c2", name: "Cat", kind: "ctor", recv: "Cat #2" }], heap: [cat("o2", 2, "Bo")] },
  ],
};

// Two cats, both hardcoded to the same name inside the class - the exact fault
// lesson 1 task 6 has today, and what `distinctField` is for.
const SAME_NAME = {
  code: ["x"],
  steps: [
    { line: 1, frames: [{ id: "f0", name: "Main", kind: "entry" }, { id: "c1", name: "Cat", kind: "ctor", recv: "Cat #1" }], heap: [cat("o1", 1, "Rex")] },
    { line: 2, frames: [{ id: "f0", name: "Main", kind: "entry" }, { id: "c2", name: "Cat", kind: "ctor", recv: "Cat #2" }], heap: [cat("o1", 1, "Rex"), cat("o2", 2, "Rex")] },
  ],
};

// ---- the gates -------------------------------------------------------------

test("constructed counts constructor runs, not frames-per-step", () => {
  // c1 lives across several steps; counting per step would say 4, not 2.
  assert.equal(M.countConstructed(TWO_CATS, "Cat"), 2);
  assert.equal(M.countConstructed(STARTER, "Cat"), 0);
});

test("liveObjects is the most alive AT ONCE, never a total across the run", () => {
  assert.equal(M.maxLiveObjects(TWO_CATS, "Cat"), 2);
  assert.equal(
    M.maxLiveObjects(ONE_AT_A_TIME, "Cat"), 1,
    "two cats made one after another are never two cats on screen",
  );
  assert.equal(M.countConstructed(ONE_AT_A_TIME, "Cat"), 2, "though both constructors did run");
});

test("distinctField sees two different values, and refuses two identical ones", () => {
  assert.equal(M.distinctFieldValues(TWO_CATS, "Cat", "_name"), 2);
  assert.equal(
    M.distinctFieldValues(SAME_NAME, "Cat", "_name"), 1,
    "two objects hardcoded to one name are not two different objects",
  );
});

test("calls counts a member running on each instance", () => {
  assert.equal(M.countCalls(TWO_CATS, "Cat", "Speak"), 2);
  assert.equal(M.countCalls(TWO_CATS, "Cat", "Fly"), 0);
  assert.equal(M.countCalls(STARTER, "Cat", "Speak"), 0);
});

test("prints reads the cumulative stdout of the last step that has any", () => {
  assert.deepEqual(M.printedLines(TWO_CATS), ["Ana", "Bo"]);
  assert.deepEqual(M.printedLines(STARTER), []);
});

// ---- grading ---------------------------------------------------------------

test("every gate green makes the card pass, with a per-gate verdict array", () => {
  const gates = [
    { constructed: "Cat", times: 2 },
    { liveObjects: "Cat", atLeast: 2 },
    { distinctField: { type: "Cat", field: "_name" } },
    { calls: { type: "Cat", member: "Speak", times: 2 } },
    { prints: "Ana" },
  ];
  const res = M.gradeTrace(TWO_CATS, gates);
  assert.equal(res.ok, true);
  assert.deepEqual(res.met, [true, true, true, true, true]);
});

test("a red gate fails the card and the message carries the real number", () => {
  const res = M.gradeTrace(ONE_AT_A_TIME, [{ liveObjects: "Cat", atLeast: 2 }]);
  assert.equal(res.ok, false);
  assert.match(res.message, /at most 1/i, "says what the run actually reached");
  assert.match(res.message, /needs 2/i, "and what it needed");
});

test("a card with no gates cannot pass - grading nothing is an authoring bug", () => {
  const res = M.gradeTrace(TWO_CATS, []);
  assert.equal(res.ok, false, "a card that checks nothing must never award XP");
  assert.equal(res.reason, "no-gates");
  assert.match(res.message, /our bug, not yours/i);
});

test("an unknown gate fails loudly instead of passing by accident", () => {
  const res = M.gradeTrace(TWO_CATS, [{ somethingWeNeverWrote: "Cat" }]);
  assert.equal(res.ok, false, "an unrecognised gate must not be treated as satisfied");
  assert.match(res.message, /cannot check/i);
});

test("the verdict array marks exactly which gate is red, in authored order", () => {
  const res = M.gradeTrace(SAME_NAME, [
    { constructed: "Cat", times: 2 },
    { distinctField: { type: "Cat", field: "_name" } },
  ]);
  assert.deepEqual(res.met, [true, false], "the tracker ticks row 1 and leaves row 2 red");
});

// ---- the rule that makes a lab card teach ----------------------------------

test("EVERY gate starts RED on the untouched starter", () => {
  const gates = [
    { constructed: "Cat", times: 2 },
    { liveObjects: "Cat", atLeast: 2 },
    { distinctField: { type: "Cat", field: "_name" } },
    { calls: { type: "Cat", member: "Speak", times: 2 } },
    { prints: "Ana" },
  ];
  assert.deepEqual(
    M.startsRed(STARTER, gates), [],
    "a goal already green before the learner types is decoration that pays XP",
  );
});

test("startsRed names the offending gate index, so an author knows which to tighten", () => {
  // A starter that already prints the answer: gate 1 is green from the start.
  const cheating = {
    code: ["x"],
    steps: [{ line: 1, frames: [{ id: "f0", name: "Main", kind: "entry" }], heap: [], stdout: "Ana\n" }],
  };
  assert.deepEqual(M.startsRed(cheating, [{ constructed: "Cat", times: 2 }, { prints: "Ana" }]), [1]);
});

// ---- the provider ----------------------------------------------------------

test("the provider stays silent until a trace exists - an unstarted card is not wrong", () => {
  const goals = [{ code: ["two cats"], gate: { liveObjects: "Cat", atLeast: 2 } }];
  assert.equal(Provider.verdicts(goals, { outcome: null }), null, "nothing pressed yet");
  assert.equal(
    Provider.verdicts(goals, { outcome: { status: "did-not-compile" } }), null,
    "code that never ran says nothing about the learner",
  );
  assert.equal(Provider.verdicts(goals, { outcome: { status: "failed" } }), null, "nor does a dead compiler");
});

test("the provider ticks per goal once a real trace lands", () => {
  const goals = [
    { code: ["two cats"], gate: { liveObjects: "Cat", atLeast: 2 } },
    { code: ["different names"], gate: { distinctField: { type: "Cat", field: "_name" } } },
  ];
  assert.deepEqual(Provider.verdicts(goals, { outcome: { status: "traced", trace: TWO_CATS } }), [true, true]);
  assert.deepEqual(Provider.verdicts(goals, { outcome: { status: "traced", trace: SAME_NAME } }), [true, false]);
});

test("every lab goal is a run-box - typing the right code proves nothing here", () => {
  const shape = Provider.outline({ code: ["two cats"], gate: { liveObjects: "Cat", atLeast: 2 } });
  assert.equal(shape.kind, "run-box", "only a run can settle a claim about a run");
  assert.equal(shape.header, "two cats");
});

test("a goal with no gate is prose, and is left UNTRACKED for the card to settle", () => {
  assert.equal(Provider.verdicts([{ gate: null }], { outcome: { status: "traced", trace: TWO_CATS } })[0], null);
  assert.equal(Provider.outline({ gate: null }).kind, "line", "no gate, no box");
});

test("a lab goal never latches - the panel describes the run now on screen", () => {
  assert.equal(
    Provider.latches({ gate: { liveObjects: "Cat", atLeast: 2 } }), false,
    "a latched tick would claim something about code the learner has since deleted",
  );
});

test("a gateless goal still gets a header from the gate when it has no prose", () => {
  assert.equal(Provider.outline({ gate: { constructed: "Cat", times: 2 } }).header, "new Cat x2");
  assert.equal(Provider.outline({ gate: { liveObjects: "Cat", atLeast: 2 } }).header, "2 live Cat");
});
