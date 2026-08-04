"use strict";

// Unit test for kernel/grading/structure-match.js - the declarative shape gates
// behind the live goal tracker. Two halves:
//   1. the policy on its own, over hand-built type lists;
//   2. the policy over the REAL scanner (code-lab's scanCSharp) on real C#,
//      because the tracker is only honest if the two agree.
// Dependency-free apart from the vendored bundle: `node --test test/`.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const vm = require("node:vm");

const S = require(path.join(__dirname, "..", "kernel", "grading", "structure-match.js"));

// --- meets: the policy ------------------------------------------------------
const TYPES = [
  { name: "Cat", kind: "class", bases: ["IAnimal"], members: [{ name: "IsHungry" }, { name: "_hours" }] },
  { name: "IAnimal", kind: "interface", bases: [], members: [{ name: "Speak" }] },
];

test("a type gate passes only when that type exists", () => {
  assert.equal(S.meets(TYPES, { type: "Cat" }), true);
  assert.equal(S.meets(TYPES, { type: "FeedingSign" }), false);
});

test("a member gate needs the member on that exact type", () => {
  assert.equal(S.meets(TYPES, { type: "Cat", member: "IsHungry" }), true);
  assert.equal(S.meets(TYPES, { type: "Cat", member: "Speak" }), false, "Speak is IAnimal's, not Cat's");
});

test("a kind gate separates a class from an interface", () => {
  assert.equal(S.meets(TYPES, { type: "IAnimal", kind: "interface" }), true);
  assert.equal(S.meets(TYPES, { type: "Cat", kind: "interface" }), false);
});

test("a base gate reads the declaration's base list", () => {
  assert.equal(S.meets(TYPES, { type: "Cat", base: "IAnimal" }), true);
  assert.equal(S.meets(TYPES, { type: "Cat", base: "Bird" }), false);
});

test("an absent gate is met only when nothing declares that name", () => {
  assert.equal(S.meets(TYPES, { absent: "CheckAndSign" }), true);
  assert.equal(S.meets(TYPES, { absent: "IsHungry" }), false, "a member counts");
  assert.equal(S.meets(TYPES, { absent: "Cat" }), false, "a type name counts too");
});

test("fields are ANDed - one failure fails the gate", () => {
  assert.equal(S.meets(TYPES, { type: "Cat", member: "IsHungry", base: "IAnimal" }), true);
  assert.equal(S.meets(TYPES, { type: "Cat", member: "IsHungry", base: "Bird" }), false);
});

test("absent combines with a positive gate", () => {
  assert.equal(S.meets(TYPES, { type: "Cat", member: "IsHungry", absent: "CheckAndSign" }), true);
  assert.equal(S.meets(TYPES, { type: "Cat", member: "IsHungry", absent: "Cat" }), false);
});

// A tracker runs on every keystroke, on half-written code. It must never throw.
test("malformed input is unmet, never an exception", () => {
  assert.equal(S.meets(TYPES, null), false);
  assert.equal(S.meets(TYPES, {}), false, "an empty gate asserts nothing, so it cannot be met");
  assert.equal(S.meets(null, { type: "Cat" }), false);
  assert.equal(S.meets(undefined, { type: "Cat" }), false);
  assert.equal(S.meets([{ name: "Cat" }], { type: "Cat", member: "X" }), false, "no members array");
});

test("a member list of plain strings is read the same as symbol objects", () => {
  const plain = [{ name: "Cat", kind: "class", bases: [], members: ["IsHungry"] }];
  assert.equal(S.meets(plain, { type: "Cat", member: "IsHungry" }), true);
});

// --- evaluate: one boolean per gate, in order -------------------------------
test("evaluate returns a boolean per gate in the authored order", () => {
  const got = S.evaluate(TYPES, [{ type: "Cat" }, { type: "Nope" }, { absent: "CheckAndSign" }]);
  assert.deepEqual(got, [true, false, true]);
});

test("evaluate with no gates is an empty list, not a crash", () => {
  assert.deepEqual(S.evaluate(TYPES, undefined), []);
  assert.deepEqual(S.evaluate(TYPES, []), []);
});

test("describe names a gate for a validator message", () => {
  assert.equal(S.describe({ type: "Cat", member: "IsHungry" }), "Cat .IsHungry");
  assert.equal(S.describe({ absent: "CheckAndSign" }), "without CheckAndSign");
});

// --- the real scanner -------------------------------------------------------
// The gates are only meaningful if they agree with the scanner that actually
// feeds them in the browser, so load the vendored bundle and use the real one.
function loadCodeLab() {
  const file = path.join(__dirname, "..", "vendor", "code-lab", "code-lab.global.js");
  const sandbox = { window: {}, globalThis: {}, self: {}, console };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox);
  return sandbox.CodeLab || sandbox.window.CodeLab;
}

const CodeLab = loadCodeLab();

test("the vendored bundle still exports scanCSharp with base lists", () => {
  assert.equal(typeof CodeLab.scanCSharp, "function");
  const { types } = CodeLab.scanCSharp("class Cat : IAnimal { }");
  // Array.from: the bundle runs in a vm realm, so its arrays are not
  // reference-equal to this realm's Array for a strict deep compare.
  assert.deepEqual(Array.from(types[0].bases), ["IAnimal"], "re-vendor vendor/code-lab/code-lab.global.js");
});

const NAIVE = `using System;

public class Cat
{
    public string CheckAndSign(int hoursSinceMeal)
    {
        return hoursSinceMeal >= 6 ? "FEED" : "FULL";
    }
}

class Program
{
    static void Main() { Console.WriteLine(new Cat().CheckAndSign(7)); }
}
`;

const SPLIT = `using System;

public class Cat
{
    private int _hoursSinceMeal;
    public Cat(int hoursSinceMeal) { _hoursSinceMeal = hoursSinceMeal; }
    public bool IsHungry() { return _hoursSinceMeal >= 6; }
}

public class FeedingSign
{
    public string Format(bool hungry) { return hungry ? "FEED" : "FULL"; }
}

class Program
{
    static void Main() { Console.WriteLine(new FeedingSign().Format(new Cat(7).IsHungry())); }
}
`;

const GATES = [
  { type: "Cat", member: "IsHungry" },
  { type: "FeedingSign", member: "Format" },
  { absent: "CheckAndSign" },
];

test("the naive shape lights no gate, the split shape lights them all", () => {
  assert.deepEqual(S.evaluate(CodeLab.scanCSharp(NAIVE).types, GATES), [false, false, false]);
  assert.deepEqual(S.evaluate(CodeLab.scanCSharp(SPLIT).types, GATES), [true, true, true]);
});

// The tracker's whole point is partial credit: it must move one tick at a time.
test("a half-written answer lights only the part that is written", () => {
  const half = SPLIT.slice(0, SPLIT.indexOf("public class FeedingSign"));
  assert.deepEqual(S.evaluate(CodeLab.scanCSharp(half).types, GATES), [true, false, true]);
});

test("gates survive source that does not compile", () => {
  const broken = "public class Cat { public bool IsHungry() { return _h >= 6;";
  assert.deepEqual(S.evaluate(CodeLab.scanCSharp(broken).types, GATES), [true, false, true]);
});

test("an interface and its implementer are told apart on real source", () => {
  const src = `public interface IAnimal { string Speak(); }
public class Cat : IAnimal { public string Speak() { return "Meow"; } }`;
  const { types } = CodeLab.scanCSharp(src);
  assert.equal(S.meets(types, { type: "IAnimal", kind: "interface", member: "Speak" }), true);
  assert.equal(S.meets(types, { type: "Cat", base: "IAnimal", member: "Speak" }), true);
  assert.equal(S.meets(types, { type: "Cat", kind: "interface" }), false);
});

// A goal line like "run it and the output is FEED" has no shape to test - only
// the compiler can settle it - so its gate is authored as null. null must stay
// distinct from false all the way through, or the UI paints a tick that can
// never turn green and the validator reports a failure nobody can fix.
test("a null gate is UNTRACKED, not unmet", () => {
  const types = CodeLab.scanCSharp(SPLIT).types;
  assert.deepEqual(
    Array.from(S.evaluate(types, [{ type: "Cat" }, null, undefined, { type: "Nope" }])),
    [true, null, null, false]
  );
});

test("a malformed gate is still unmet, not untracked", () => {
  const types = CodeLab.scanCSharp(SPLIT).types;
  assert.deepEqual(Array.from(S.evaluate(types, ["Cat", 7, {}])), [false, false, false]);
});

test("describe tells an authored null apart from a broken gate", () => {
  assert.equal(S.describe(null), "(no structural test)");
  assert.equal(S.describe(undefined), "(no structural test)");
  assert.equal(S.describe("Cat"), "(not a gate)");
  assert.equal(S.describe({}), "(empty gate)");
});

// --- rows(): each member row is its own subtask -----------------------------

// The whole point of granularity: a learner adding a constructor sees THAT row
// tick, instead of a box that stays grey until every piece lands at once.
const CAT_PARTS = ["class Cat", "int _hoursSinceMeal", "Cat(int hoursSinceMeal)", "bool IsHungry()"];
const CAT_GATE = { type: "Cat", member: "IsHungry" };

test("rows reports one verdict per code row, header first", () => {
  const types = [{
    name: "Cat", kind: "class", bases: [], members: [
      { name: "_hoursSinceMeal", kind: "field" },
      { name: "Cat", kind: "constructor" },
      { name: "IsHungry", kind: "method" },
    ],
  }];
  assert.deepEqual(Array.from(S.rows(types, CAT_GATE, CAT_PARTS)), [true, true, true, true]);
});

test("a row for a member that is not there yet stays unmet", () => {
  const types = [{
    name: "Cat", kind: "class", bases: [], members: [{ name: "IsHungry", kind: "method" }],
  }];
  // header ok, field missing, constructor missing, method there
  assert.deepEqual(Array.from(S.rows(types, CAT_GATE, CAT_PARTS)), [true, false, false, true]);
});

test("no member row can be met while the type itself is missing", () => {
  assert.deepEqual(Array.from(S.rows([], CAT_GATE, CAT_PARTS)), [false, false, false, false]);
});

test("a row matches on the identifier, so the signature is free to be a hint", () => {
  const types = [{
    name: "Cat", kind: "class", bases: [], members: [{ name: "IsHungry", kind: "method" }],
  }];
  const r = Array.from(S.rows(types, { type: "Cat" }, ["class Cat", "bool IsHungry()"]));
  assert.deepEqual(r, [true, true], "return type and parens are hints, not part of the match");
});

test("a header whose base list is unmet fails every row under it", () => {
  const types = [{ name: "Cat", kind: "class", bases: [], members: [{ name: "Speak", kind: "method" }] }];
  const gate = { type: "Cat", base: "IAnimal", member: "Speak" };
  assert.deepEqual(Array.from(S.rows(types, gate, ["Cat : IAnimal", "string Speak()"])), [false, false]);
});

test("a wrong kind fails the header too", () => {
  const types = [{ name: "IMover", kind: "class", bases: [], members: [{ name: "Move", kind: "method" }] }];
  const gate = { type: "IMover", kind: "interface", member: "Move" };
  assert.deepEqual(Array.from(S.rows(types, gate, ["interface IMover", "string Move()"])), [false, false]);
});

test("rows returns nothing it cannot judge, so callers fall back cleanly", () => {
  assert.deepEqual(Array.from(S.rows([], null, ["class Cat"])), [], "no gate");
  assert.deepEqual(Array.from(S.rows([], { absent: "X" }, ["class Cat"])), [], "absence-only gate");
  assert.deepEqual(Array.from(S.rows([], { type: "Cat" }, null)), [], "no code");
  assert.deepEqual(Array.from(S.rows([], { type: "Cat" }, [])), [], "empty code");
});

test("a single string code entry is treated as a lone header", () => {
  const types = [{ name: "Cat", kind: "class", bases: [], members: [] }];
  assert.deepEqual(Array.from(S.rows(types, { type: "Cat" }, "class Cat")), [true]);
});

// --- writes / gone: a live signal for cards that change no shape -------------

// Card 1's whole task is logic INSIDE a method that already exists. Without a
// source gate the tracker sits inert until Run; with one it wakes as soon as
// the learner writes the decision.
const CARD1_GATE = { type: "Cat", member: "CheckAndSign", writes: ['"FEED"', '"FULL"'] };
const CARD1_TYPES = [{
  name: "Cat", kind: "class", bases: [], members: [{ name: "CheckAndSign", kind: "method" }],
}];

test("a writes gate is unmet on a starter whose body is a placeholder", () => {
  const starter = `public class Cat {
    // TODO: six or more hours means the card reads FEED. Anything less reads FULL.
    public string CheckAndSign(int hoursSinceMeal) { return ""; }
  }`;
  assert.equal(S.meets(CARD1_TYPES, CARD1_GATE, starter), false,
    "a TODO comment naming FEED and FULL must not count as work");
});

test("a writes gate lights once both literals are really written", () => {
  const done = `public class Cat {
    public string CheckAndSign(int h) { return h >= 6 ? "FEED" : "FULL"; }
  }`;
  assert.equal(S.meets(CARD1_TYPES, CARD1_GATE, done), true);
});

test("a writes gate does not care which way the condition is spelled", () => {
  const flipped = `public class Cat {
    public string CheckAndSign(int h) { if (h < 6) { return "FULL"; } return "FEED"; }
  }`;
  assert.equal(S.meets(CARD1_TYPES, CARD1_GATE, flipped), true);
});

test("a writes gate still needs half the work to be missing to stay dark", () => {
  const half = `public class Cat {
    public string CheckAndSign(int h) { return "FEED"; }
  }`;
  assert.equal(S.meets(CARD1_TYPES, CARD1_GATE, half), false, "only one of the two cards written");
});

// Card 2's point is that the SAME rule lives in two classes. Each box watches
// its own class body, so fixing one ticks one.
const CARD2 = `public class Cat {
    public string CheckAndSign(int h) { return h >= 4 ? "FEED" : "FULL"; }
  }
  public class FrontDesk {
    public int HungryCount(List<int> hours) { int n = 0; foreach (int h in hours) { if (h >= 6) n++; } return n; }
  }`;
const CARD2_TYPES = [
  { name: "Cat", kind: "class", bases: [], members: [{ name: "CheckAndSign", kind: "method" }] },
  { name: "FrontDesk", kind: "class", bases: [], members: [{ name: "HungryCount", kind: "method" }] },
];

test("a gone gate is scoped to its own type, so one class can tick alone", () => {
  const catGate = { type: "Cat", member: "CheckAndSign", gone: ">= 6" };
  const deskGate = { type: "FrontDesk", member: "HungryCount", gone: ">= 6" };
  assert.equal(S.meets(CARD2_TYPES, catGate, CARD2), true, "the cat was fixed");
  assert.equal(S.meets(CARD2_TYPES, deskGate, CARD2), false, "the desk still says >= 6");
});

test("a gone gate ignores whitespace, so >=6 and >= 6 are the same edit", () => {
  const src = `public class Cat { public string CheckAndSign(int h) { return h>=6 ? "FEED" : "FULL"; } }`;
  assert.equal(S.meets(CARD1_TYPES, { type: "Cat", member: "CheckAndSign", gone: ">= 6" }, src), false);
});

test("a source gate blocks every row under it until the work starts", () => {
  const starter = `public class Cat { public string CheckAndSign(int h) { return ""; } }`;
  const code = ["class Cat", "string CheckAndSign(int hoursSinceMeal)"];
  assert.deepEqual(Array.from(S.rows(CARD1_TYPES, CARD1_GATE, code, starter)), [false, false]);
  const done = `public class Cat { public string CheckAndSign(int h) { return h >= 6 ? "FEED" : "FULL"; } }`;
  assert.deepEqual(Array.from(S.rows(CARD1_TYPES, CARD1_GATE, code, done)), [true, true]);
});

test("a gate with no source condition is unaffected by the source argument", () => {
  assert.equal(S.meets(CARD1_TYPES, { type: "Cat", member: "CheckAndSign" }, ""), true);
  assert.equal(S.meets(CARD1_TYPES, { type: "Cat", member: "CheckAndSign" }), true);
});

test("a block comment cannot satisfy a writes gate either", () => {
  const src = `public class Cat {
    /* the card reads "FEED" or "FULL" */
    public string CheckAndSign(int h) { return ""; }
  }`;
  assert.equal(S.meets(CARD1_TYPES, CARD1_GATE, src), false);
});

test("a source-conditioned gate fails safe when no source is supplied", () => {
  // Fails OPEN would mean a caller that forgot the source argument sees an
  // unearned tick - the silent pass this tracker exists to prevent.
  assert.equal(S.meets(CARD1_TYPES, CARD1_GATE), false, "writes gate with no source");
  assert.equal(S.meets(CARD1_TYPES, { type: "Cat", member: "CheckAndSign", gone: ">= 6" }), false,
    "gone gate with no source");
  assert.equal(S.meets(CARD1_TYPES, CARD1_GATE, ""), false, "empty source is not a pass");
});

// --- step rows: subtasks for work that declares no symbol -------------------
//
// The moves inside a method body - building a list, calling a new collaborator -
// declare nothing the scanner can see, so a member lookup can never tick them.
// A step row carries its own source probe instead, scoped to its own type.
const STEP_SRC = `public class FrontDesk {
  public int HungryCount(List<Cat> cats) { return 0; }
}
class Program {
  static void Main() {
    var cats = new List<Cat> { new Cat(7) };
    Console.WriteLine(desk.HungryCount(cats));
  }
}`;
const STEP_TYPES = [
  { name: "FrontDesk", kind: "class", bases: [], members: [{ name: "HungryCount" }] },
  { name: "Program", kind: "class", bases: [], members: [{ name: "Main" }] },
];
const STEP_CODE = [
  "class Program",
  { row: "var cats = new List<Cat> { ... }", writes: "new List<Cat>" },
  { row: "var sign = new FeedingSign()", writes: "new FeedingSign" },
  { row: "desk.HungryCount(cats)", writes: "HungryCount(cats)" },
];
const STEP_GATE = { type: "Program", member: "Main" };

test("a step row ticks from its own source probe, not a member lookup", () => {
  const v = Array.from(S.rows(STEP_TYPES, STEP_GATE, STEP_CODE, STEP_SRC));
  assert.deepEqual(v, [true, true, false, true]);
});

test("step rows are scoped to their own type's body", () => {
  // `HungryCount(cats)` is written in Program, never in FrontDesk. A row hung
  // off FrontDesk must not borrow a match from somewhere else in the file.
  const gate = { type: "FrontDesk", member: "HungryCount" };
  const code = ["class FrontDesk", { row: "calls HungryCount(cats)", writes: "HungryCount(cats)" }];
  assert.deepEqual(Array.from(S.rows(STEP_TYPES, gate, code, STEP_SRC)), [true, false]);
});

test("a step row is dead until the header prerequisite is met", () => {
  // The header prerequisite is the TYPE (plus any kind/base/source condition),
  // not the gate's member - the member is what each row checks for itself.
  const gate = { type: "Ghost", member: "Main" };
  assert.deepEqual(Array.from(S.rows(STEP_TYPES, gate, STEP_CODE, STEP_SRC)),
    [false, false, false, false]);
});

test("a source condition on the gate kills every step row under it", () => {
  const gate = { type: "Program", member: "Main", writes: "never appears" };
  assert.deepEqual(Array.from(S.rows(STEP_TYPES, gate, STEP_CODE, STEP_SRC)),
    [false, false, false, false]);
});

test("a step row cannot be satisfied by a comment", () => {
  const src = `class Program {
    static void Main() {
      // TODO: var cats = new List<Cat>();
    }
  }`;
  const v = Array.from(S.rows(STEP_TYPES, STEP_GATE, STEP_CODE, src));
  assert.equal(v[1], false, "commented-out work is not work");
});

test("a step row ignores the learner's whitespace", () => {
  const src = "class Program { static void Main() { var cats = new   List < Cat > (); } }";
  assert.equal(Array.from(S.rows(STEP_TYPES, STEP_GATE, STEP_CODE, src))[1], true);
});

test("rowLabel reads member rows and step rows the same way", () => {
  assert.equal(S.rowLabel("int _hours"), "int _hours");
  assert.equal(S.rowLabel({ row: "var cats = ...", writes: "x" }), "var cats = ...");
  assert.equal(S.rowLabel(null), "");
});

// --- verdicts: the one answer the learner sees ------------------------------
test("verdicts holds a box red while any row under it is red", () => {
  const goals = [{ code: STEP_CODE, gate: STEP_GATE }];
  // The gate alone is met - Program.Main exists - but a row is not.
  assert.equal(S.meets(STEP_TYPES, STEP_GATE, STEP_SRC), true);
  assert.deepEqual(Array.from(S.verdicts(STEP_TYPES, goals, STEP_SRC)), [false]);
});

test("verdicts goes green only when the gate and every row is", () => {
  const goals = [{ code: STEP_CODE, gate: STEP_GATE }];
  const src = STEP_SRC.replace("var cats =", "var sign = new FeedingSign(); var cats =");
  assert.deepEqual(Array.from(S.verdicts(STEP_TYPES, goals, src)), [true]);
});

test("verdicts keeps a run-gated goal null so a passing run can claim it", () => {
  assert.deepEqual(Array.from(S.verdicts(STEP_TYPES, [{ gate: null }], STEP_SRC)), [null]);
});
