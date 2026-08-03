"use strict";

// Unit test for kernel/grading/output-match.js - the shared C# output-grading
// policy that build-engine.js and tools/verify-lesson.mjs both consume. It is
// DOM-free and the runner is injected, so every path is testable with a fake
// runner and no browser, no Roslyn, no dotnet. Dependency-free: `node --test test/`.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const G = require(path.join(__dirname, "..", "kernel", "grading", "output-match.js"));

// --- matches: string form (any trimmed non-empty line equals it) -------------
test("matches string: any line equals the expected string", () => {
  assert.equal(G.matches("noise\n  EA \nmore", "EA"), true);
  assert.equal(G.matches("a\nb\nc", "EA"), false);
});

test("matches string: blank lines are ignored, lines are trimmed", () => {
  assert.equal(G.matches("\n\n  hello  \n\n", "hello"), true);
});

// --- matches: array form (non-empty trimmed lines equal the sequence) --------
test("matches array: the non-empty lines equal the exact sequence", () => {
  assert.equal(G.matches("one\ntwo\nthree", ["one", "two", "three"]), true);
  assert.equal(G.matches(" one \n\n two \nthree ", ["one", "two", "three"]), true);
});

test("matches array: wrong order or wrong count fails", () => {
  assert.equal(G.matches("one\nthree\ntwo", ["one", "two", "three"]), false);
  assert.equal(G.matches("one\ntwo", ["one", "two", "three"]), false);
  assert.equal(G.matches("one\ntwo\nthree\nfour", ["one", "two", "three"]), false);
});

// --- unmetRequirement: the technique gate ------------------------------------
test("unmetRequirement: null when every pattern matches", () => {
  assert.equal(
    G.unmetRequirement("for (int i=0;i<3;i++) sum += i;", [
      { pattern: /for\s*\(/, message: "use a loop" },
      { pattern: /\+=/, message: "accumulate" },
    ]),
    null
  );
});

test("unmetRequirement: returns the first failing message", () => {
  assert.equal(
    G.unmetRequirement("sum = 6;", [
      { pattern: /for\s*\(/, message: "use a loop" },
      { pattern: /\+=/, message: "accumulate" },
    ]),
    "use a loop"
  );
});

test("unmetRequirement: string patterns are compiled to RegExp", () => {
  assert.equal(G.unmetRequirement("return age + 1;", [{ pattern: "\\+ 1", message: "add one" }]), null);
  assert.equal(G.unmetRequirement("return age;", [{ pattern: "\\+ 1", message: "add one" }]), "add one");
});

test("unmetRequirement: a requirement with no message uses a default", () => {
  const msg = G.unmetRequirement("x", [{ pattern: /zzz/ }]);
  assert.equal(typeof msg, "string");
  assert.ok(msg.length > 0);
});

test("unmetRequirement: non-array requirements is null (no gate)", () => {
  assert.equal(G.unmetRequirement("anything", undefined), null);
  assert.equal(G.unmetRequirement("anything", null), null);
});

// --- buildProbe + PROGRAM_CLASS_RE -------------------------------------------
test("buildProbe: keeps source before class Program, appends the probe main", () => {
  const src = "class Animal { public int Legs = 4; }\nclass Program { static void Main(){ } }";
  const probeMain = "class Program { static void Main(){ System.Console.WriteLine(new Animal().Legs); } }";
  const probe = G.buildProbe(src, probeMain);
  assert.equal(probe, "class Animal { public int Legs = 4; }\n" + probeMain);
});

test("buildProbe: matches public/static/partial Program forms", () => {
  for (const decl of ["class Program", "public class Program", "static class Program", "public static partial class Program"]) {
    const src = "class Base {}\n" + decl + " { }";
    assert.equal(G.buildProbe(src, "PROBE"), "class Base {}\n" + "PROBE");
  }
});

test("buildProbe: no Program class means source + probe", () => {
  assert.equal(G.buildProbe("class Only {}", "PROBE"), "class Only {}PROBE");
});

// --- describeExpected: the non-localized fallback copy ------------------------
test("describeExpected: string form mentions the expected line", () => {
  const msg = G.describeExpected("Woof");
  assert.ok(msg.includes('"Woof"'));
});

test("describeExpected: array form lists the lines in order", () => {
  const msg = G.describeExpected(["a", "b"]);
  assert.ok(msg.includes("a\nb"));
});

// --- passesHiddenVerify: runner injected --------------------------------------
function fakeRunner(result) {
  return { run: async () => result };
}

test("passesHiddenVerify: true when the probe output matches verify.expected", async () => {
  const ok = await G.passesHiddenVerify(
    "class A{}\nclass Program{}",
    { main: "class Program{}", expected: "42" },
    fakeRunner({ output: "42" })
  );
  assert.equal(ok, true);
});

test("passesHiddenVerify: false on compile errors", async () => {
  const ok = await G.passesHiddenVerify(
    "x", { main: "y", expected: "42" },
    fakeRunner({ output: "", errors: [{ message: "CS1002" }] })
  );
  assert.equal(ok, false);
});

test("passesHiddenVerify: false on a runtime error", async () => {
  const ok = await G.passesHiddenVerify(
    "x", { main: "y", expected: "42" },
    fakeRunner({ output: "42", runtimeError: "boom" })
  );
  assert.equal(ok, false);
});

test("passesHiddenVerify: false when the probe output does not match", async () => {
  const ok = await G.passesHiddenVerify(
    "x", { main: "y", expected: "42" },
    fakeRunner({ output: "41" })
  );
  assert.equal(ok, false);
});

// --- gradeOutput: the whole grade in the engine's order ----------------------
test("gradeOutput: mismatch is reported before the technique gate", async () => {
  const r = await G.gradeOutput(
    { output: "WRONG", expected: "RIGHT", source: "no loop here", requireSource: [{ pattern: /for/, message: "loop" }] },
    fakeRunner({})
  );
  assert.equal(r.ok, false);
  assert.equal(r.reason, "mismatch");
});

test("gradeOutput: an unmet requirement is reported after a matching output", async () => {
  const r = await G.gradeOutput(
    { output: "RIGHT", expected: "RIGHT", source: "no loop here", requireSource: [{ pattern: /for/, message: "loop" }] },
    fakeRunner({})
  );
  assert.equal(r.ok, false);
  assert.equal(r.reason, "requirement");
  assert.equal(r.message, "loop");
});

test("gradeOutput: a failing hidden verify is reported last", async () => {
  const r = await G.gradeOutput(
    {
      output: "RIGHT", expected: "RIGHT", source: "class A{}\nclass Program{}",
      requireSource: [], verify: { main: "class Program{}", expected: "99", message: "hidden failed" },
    },
    fakeRunner({ output: "1" })
  );
  assert.equal(r.ok, false);
  assert.equal(r.reason, "verify");
  assert.equal(r.message, "hidden failed");
});

test("gradeOutput: pass when output matches, gate is met, and verify passes", async () => {
  const r = await G.gradeOutput(
    {
      output: "RIGHT", expected: "RIGHT", source: "class A{}\nclass Program{}",
      requireSource: [{ pattern: /class A/, message: "need A" }],
      verify: { main: "class Program{}", expected: "99" },
    },
    fakeRunner({ output: "99" })
  );
  assert.equal(r.ok, true);
  assert.equal(r.reason, "pass");
});

test("gradeOutput: pass with no verify block", async () => {
  const r = await G.gradeOutput(
    { output: "RIGHT", expected: "RIGHT", source: "x", requireSource: [] },
    fakeRunner({})
  );
  assert.equal(r.ok, true);
  assert.equal(r.reason, "pass");
});
