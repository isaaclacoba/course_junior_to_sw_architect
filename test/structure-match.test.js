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
