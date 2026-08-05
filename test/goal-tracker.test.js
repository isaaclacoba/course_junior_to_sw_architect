"use strict";

// Unit test for kernel/engine/widgets/goal-tracker.js - the LIVE GOAL TRACKER
// widget, and the two providers that give it a domain.
//
// What is under test is the thing that used to be untestable: the tracker was
// hardcoded inside build-plugin.js, so its markup could only be checked by
// loading a whole lesson in a browser. Here it is exercised against a tiny fake
// <ul>, which is all it ever touches.
//
// The providers are tested THROUGH the widget, because that is the contract that
// matters: a provider that returns the right verdicts and the wrong outline
// still paints the wrong panel.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const ROOT = path.dirname(__dirname);
const Tracker = require(path.join(ROOT, "kernel", "engine", "widgets", "goal-tracker.js"));
const CSharp = require(path.join(ROOT, "kernel", "engine", "widgets", "csharp-goal-provider.js"));
const Git = require(path.join(ROOT, "kernel", "engine", "widgets", "git-goal-provider.js"));

// The smallest <ul> the widget can work against: it reads `children[].innerHTML`
// to snapshot the localized prose, writes `innerHTML`, and toggles one class.
function fakeList(prose) {
  return {
    children: (prose || []).map((html) => ({ innerHTML: html })),
    innerHTML: "",
    classList: {
      names: new Set(),
      add(n) { this.names.add(n); },
      remove(n) { this.names.delete(n); },
      contains(n) { return this.names.has(n); },
    },
  };
}

// Count the ticked elements in the rendered panel, which is what a learner is
// actually reading off the screen.
const ticks = (html) => (html.match(/is-met/g) || []).length;

// --- the widget on its own --------------------------------------------------

const STUB = {
  outline: (g) => g.shape,
  verdicts: (goals) => goals.map((g) => g.met),
  rows: (g) => g.rowMet || [],
};

test("the widget paints one box per goal, with the localized prose as the caption", () => {
  const host = fakeList(["Write a <code>Cat</code>.", "It prints FEED."]);
  const t = Tracker.create({ host, provider: STUB });
  t.capture().setGoals([
    { shape: { kind: "box", header: "class Cat", rows: ["bool IsHungry()"] }, met: true, rowMet: [true, true] },
    { shape: { kind: "line" }, met: null },
  ]);
  t.sync({});
  assert.match(host.innerHTML, /Write a <code>Cat<\/code>\./, "the caption is the lesson's own prose");
  assert.match(host.innerHTML, /class Cat/);
  assert.match(host.innerHTML, /bool IsHungry\(\)/);
  assert.match(host.innerHTML, /It prints FEED\./);
});

test("the widget takes the list over only when it paints", () => {
  const host = fakeList(["one"]);
  const t = Tracker.create({ host, provider: STUB });
  assert.equal(host.classList.contains("has-tracker"), false);
  t.capture().setGoals([{ shape: { kind: "box", header: "class Cat" }, met: false }]);
  t.sync({});
  assert.equal(host.classList.contains("has-tracker"), true,
    "the bullets go, because every goal now has its own tick");
});

test("boxes come first and lines after, whatever order they were authored in", () => {
  const host = fakeList(["a line", "a box"]);
  const t = Tracker.create({ host, provider: STUB });
  t.capture().setGoals([
    { shape: { kind: "line" }, met: null },
    { shape: { kind: "box", header: "class Cat" }, met: true },
  ]);
  t.sync({});
  assert.ok(host.innerHTML.indexOf("goal-box") < host.innerHTML.indexOf("goal-behaviour"),
    "a shape to aim at reads better above the sentences about what it should do");
});

test("a null verdict ticks only once the run has passed", () => {
  const host = fakeList(["It prints FEED."]);
  const t = Tracker.create({ host, provider: STUB });
  t.capture().setGoals([{ shape: { kind: "line" }, met: null }]);

  assert.deepEqual(t.sync({ passed: false }), [null]);
  assert.equal(ticks(host.innerHTML), 0, "behaviour is a claim only the compiler can settle");

  assert.deepEqual(t.sync({ passed: true }), [true]);
  assert.equal(ticks(host.innerHTML), 1);
});

test("a provider that cannot see enough leaves the panel exactly as it was", () => {
  const host = fakeList(["one"]);
  const blind = { outline: () => ({ kind: "box", header: "class Cat" }), verdicts: () => null, rows: () => [] };
  const t = Tracker.create({ host, provider: blind });
  t.capture().setGoals([{}]);
  assert.equal(t.sync({}), null);
  assert.equal(host.innerHTML, "", "a guess here would be a tick nobody earned");
});

test("the widget refuses to paint before the prose has been captured", () => {
  const host = fakeList(["one"]);
  const t = Tracker.create({ host, provider: STUB });
  t.setGoals([{ shape: { kind: "box", header: "class Cat" }, met: true }]);
  assert.equal(t.sync({}), null, "painting first would snapshot its own ticks as the prose");
});

test("the DOM is only touched when the rendered panel actually changed", () => {
  const host = fakeList(["one"]);
  let writes = 0;
  let stored = "";
  Object.defineProperty(host, "innerHTML", {
    get() { return stored; },
    set(v) { writes++; stored = v; },
  });
  const t = Tracker.create({ host, provider: STUB });
  t.capture().setGoals([{ shape: { kind: "box", header: "class Cat" }, met: false }]);
  t.sync({});
  t.sync({});
  t.sync({});
  assert.equal(writes, 1, "this runs on every keystroke, so a repaint has to be earned");
});

test("a row can flip while the box verdict does not, and the panel still repaints", () => {
  const host = fakeList(["one"]);
  const t = Tracker.create({ host, provider: STUB });
  const goal = { shape: { kind: "box", header: "class Cat", rows: ["int _hours", "bool IsHungry()"] }, met: false, rowMet: [true, false, false] };
  t.capture().setGoals([goal]);
  t.sync({});
  const before = host.innerHTML;
  goal.rowMet = [true, true, false];
  t.sync({});
  assert.notEqual(host.innerHTML, before,
    "comparing verdict arrays instead of the HTML would swallow this");
});

test("a row label is escaped, so a generic signature cannot inject markup", () => {
  const host = fakeList(["one"]);
  const t = Tracker.create({ host, provider: STUB });
  t.capture().setGoals([
    { shape: { kind: "box", header: "class Zoo", rows: ["int HungryCount(List<Cat> cats)"] }, met: true, rowMet: [true, true] },
  ]);
  t.sync({});
  assert.match(host.innerHTML, /List&lt;Cat&gt;/);
  assert.doesNotMatch(host.innerHTML, /List<Cat>/);
});

test("a run box carries the run marker until the run passes", () => {
  const host = fakeList(["one"]);
  const t = Tracker.create({ host, provider: STUB });
  t.capture().setGoals([{ shape: { kind: "run-box", header: "class Cat", rows: ["string Label()"] }, met: null }]);
  t.sync({ passed: false });
  assert.match(host.innerHTML, /goal-box--run/);
  assert.match(host.innerHTML, /\u25B6/, "a signature that exists is not a signature that works");
  t.sync({ passed: true });
  assert.equal(ticks(host.innerHTML), 2, "the box and its row both land on the passing run");
});

test("a removal goal is struck through", () => {
  const host = fakeList(["The old method is gone."]);
  const t = Tracker.create({ host, provider: STUB });
  t.capture().setGoals([{ shape: { kind: "absent-box", header: "CheckAndSign" }, met: false }]);
  t.sync({});
  assert.match(host.innerHTML, /goal-box--absent/);
  assert.match(host.innerHTML, /<del>/);
});

test("a goal the provider cannot place still says what to do", () => {
  const host = fakeList(["Something the tracker has no shape for."]);
  const t = Tracker.create({ host, provider: STUB });
  t.capture().setGoals([{ shape: { kind: "plain" }, met: null }]);
  t.sync({});
  assert.match(host.innerHTML, /Something the tracker has no shape for\./,
    "dropping the line off the panel would be worse than showing it without a tick");
});

test("clear hands the list back plainly", () => {
  const host = fakeList(["one"]);
  const t = Tracker.create({ host, provider: STUB });
  t.capture().setGoals([{ shape: { kind: "box", header: "class Cat" }, met: true }]);
  t.sync({});
  t.clear();
  assert.equal(host.classList.contains("has-tracker"), false);
  assert.equal(t.sync({}), null, "a card with no goals must not keep the last card's boxes");
});

// --- the C# provider, through the widget ------------------------------------

const CAT_TYPES = [
  { name: "Cat", kind: "class", bases: [], members: [{ name: "IsHungry", detail: "bool IsHungry()" }] },
];
const CAT_SOURCE = "public class Cat { public bool IsHungry() { return true; } }";

test("a C# goal paints a class box whose row ticks with the member", () => {
  const host = fakeList(["Give <code>Cat</code> an <code>IsHungry</code>."]);
  const t = Tracker.create({ host, provider: CSharp });
  t.capture().setGoals([
    { code: ["class Cat", "bool IsHungry()"], gate: { type: "Cat", member: "IsHungry" } },
  ]);

  assert.deepEqual(t.sync({ source: "public class Cat { }", types: [{ name: "Cat", kind: "class", bases: [], members: [] }] }), [false]);
  assert.equal(ticks(host.innerHTML), 0);

  assert.deepEqual(t.sync({ source: CAT_SOURCE, types: CAT_TYPES }), [true]);
  assert.equal(ticks(host.innerHTML), 2, "the box and its member row");
});

test("a C# blueprint with no gate waits for the run, however right it looks", () => {
  const host = fakeList(["Fill in <code>IsHungry</code>."]);
  const t = Tracker.create({ host, provider: CSharp });
  t.capture().setGoals([{ code: ["class Cat", "bool IsHungry()"], gate: null }]);
  assert.deepEqual(t.sync({ source: CAT_SOURCE, types: CAT_TYPES, passed: false }), [null]);
  assert.equal(ticks(host.innerHTML), 0);
  assert.deepEqual(t.sync({ source: CAT_SOURCE, types: CAT_TYPES, passed: true }), [true]);
});

test("the C# provider says nothing at all when the scanner has not loaded", () => {
  const host = fakeList(["one"]);
  const t = Tracker.create({ host, provider: CSharp });
  t.capture().setGoals([{ code: ["class Cat"], gate: { type: "Cat" } }]);
  assert.equal(t.sync({ source: CAT_SOURCE, types: null }), null);
  assert.equal(host.innerHTML, "");
});

// --- the git provider, through the widget -----------------------------------

// A RepoState the git policy can read, built by hand so this test stays fast and
// independent of the vendored runtime (git-goal-match.test.js drives the real one).
function repoState() {
  return {
    commits: new Map([
      ["c1", { id: "c1", message: "add cat", parents: [], paths: ["cat.txt"] }],
      ["c2", { id: "c2", message: "add dog", parents: ["c1"], paths: ["dog.txt"] }],
    ]),
    refs: new Map([["refs/heads/main", "c2"]]),
    head: { kind: "branch", name: "refs/heads/main" },
    index: new Map(),
    worktree: new Map(),
  };
}

test("a git read goal ticks the moment the command is run", () => {
  const host = fakeList(["Run <code>git status</code> to see what is waiting."]);
  const t = Tracker.create({ host, provider: Git });
  t.capture().setGoals([{ code: ["git status"], gate: { ran: "git status" } }]);

  assert.deepEqual(t.sync({ state: repoState(), ran: [] }), [false]);
  assert.equal(ticks(host.innerHTML), 0);

  assert.deepEqual(t.sync({ state: repoState(), ran: ["git status"] }), [true]);
  assert.match(host.innerHTML, /goal-box/, "owner's pick: every goal line is a box, reads included");
  assert.match(host.innerHTML, /Run <code>git status<\/code>/);
});

test("a git branch goal ticks fact by fact", () => {
  const host = fakeList(["Make <code>feature</code> and step onto it."]);
  const t = Tracker.create({ host, provider: Git });
  t.capture().setGoals([{
    code: ["branch feature", { row: "at add dog", at: "add dog" }, { row: "HEAD on feature", head: "feature" }],
    gate: { branch: "feature" },
  }]);

  const state = repoState();
  assert.deepEqual(t.sync({ state, ran: [] }), [false], "no branch yet");

  state.refs.set("refs/heads/feature", "c2");
  assert.deepEqual(t.sync({ state, ran: [] }), [false], "made, but not stood on");
  assert.equal(ticks(host.innerHTML), 1, "only the 'at add dog' row is true so far");

  state.head = { kind: "branch", name: "refs/heads/feature" };
  assert.deepEqual(t.sync({ state, ran: [] }), [true]);
  assert.equal(ticks(host.innerHTML), 3, "the box and both of its rows");
});

test("the git provider says nothing at all before there is a repository", () => {
  const host = fakeList(["one"]);
  const t = Tracker.create({ host, provider: Git });
  t.capture().setGoals([{ code: ["git status"], gate: { ran: "git status" } }]);
  assert.equal(t.sync({ state: null, ran: ["git status"] }), null);
  assert.equal(host.innerHTML, "");
});

test("both tracks paint the same markup, which is the point of the widget", () => {
  const csharpHost = fakeList(["prose"]);
  const gitHost = fakeList(["prose"]);
  Tracker.create({ host: csharpHost, provider: CSharp })
    .capture().setGoals([{ code: ["class Cat"], gate: { type: "Cat" } }])
    .sync({ source: CAT_SOURCE, types: CAT_TYPES });
  Tracker.create({ host: gitHost, provider: Git })
    .capture().setGoals([{ code: ["class Cat"], gate: { ran: "git status" } }])
    .sync({ state: repoState(), ran: ["git status"] });
  assert.equal(csharpHost.innerHTML, gitHost.innerHTML,
    "same shape, same classes - only the meaning behind the tick differs");
});

// --- latching -------------------------------------------------------------
// A goal about a MOMENT (git staging) must stay ticked once it has been true,
// or it silently un-ticks while the learner is doing everything right.
test("a latching goal stays met after its verdict goes false again", () => {
  const host = fakeList(["stage it"]);
  let verdict = false;
  const provider = {
    outline: () => ({ kind: "box", header: "staged cat.txt", rows: [] }),
    verdicts: () => [verdict],
    rows: () => [],
    latches: () => true,
  };
  const t = Tracker.create({ host, provider });
  t.capture().setGoals([{ gate: { staged: ["cat.txt"] } }]);

  assert.deepEqual(t.sync({}), [false]);
  verdict = true;
  assert.deepEqual(t.sync({}), [true]);
  verdict = false;
  assert.deepEqual(t.sync({}), [true], "the latch must hold once the moment has passed");
});

test("a NON-latching goal un-ticks when its verdict goes false", () => {
  const host = fakeList(["has a method"]);
  let verdict = true;
  const provider = {
    outline: () => ({ kind: "box", header: "class Cat", rows: [] }),
    verdicts: () => [verdict],
    rows: () => [],
  };
  const t = Tracker.create({ host, provider });
  t.capture().setGoals([{ gate: { type: "Cat" } }]);
  assert.deepEqual(t.sync({}), [true]);
  verdict = false;
  assert.deepEqual(t.sync({}), [false], "deleting the code must un-tick - the source IS the answer");
});

test("capture() clears the latch, so a new card does not inherit ticks", () => {
  const host = fakeList(["stage it"]);
  let verdict = true;
  const provider = {
    outline: () => ({ kind: "box", header: "staged cat.txt", rows: [] }),
    verdicts: () => [verdict],
    rows: () => [],
    latches: () => true,
  };
  const t = Tracker.create({ host, provider });
  t.capture().setGoals([{ gate: { staged: ["cat.txt"] } }]);
  assert.deepEqual(t.sync({}), [true]);

  verdict = false;
  host.innerHTML = "";
  host.children = [{ innerHTML: "stage it" }];
  t.capture();
  assert.deepEqual(t.sync({}), [false], "a fresh card starts from nothing");
});

test("rows under a latching goal latch with it", () => {
  const host = fakeList(["stage it"]);
  let on = true;
  const provider = {
    outline: () => ({ kind: "box", header: "staged", rows: ["and nothing else"] }),
    verdicts: () => [true],
    rows: () => [true, on],
    latches: () => true,
  };
  const t = Tracker.create({ host, provider });
  t.capture().setGoals([{ code: ["staged", { row: "and nothing else", staged: [] }] }]);
  t.sync({});
  const lit = t.html();
  on = false;
  t.sync({});
  assert.equal(t.html(), lit, "a latched box must not go grey underneath a green header");
});

// --- the panel must never be able to take the lesson down --------------------
//
// The tracker is a guide, not a grade. It repaints after every git command and
// after every keystroke in the editor, so an unguarded throw out of a provider
// would land inside the terminal's or the editor's own handler and break the
// thing the learner is actually using. Losing the panel is the acceptable cost;
// losing the lesson is not.

test("a provider that throws in verdicts costs the panel, not the page", () => {
  const host = fakeList(["do the thing"]);
  const provider = {
    outline: () => ({ kind: "box", header: "Cat", rows: [] }),
    verdicts: () => { throw new Error("boom"); },
  };
  const t = Tracker.create({ host, provider });
  t.capture().setGoals([{ gate: {} }]);
  const warns = [];
  const real = console.warn;
  console.warn = (...a) => warns.push(a);
  try {
    assert.doesNotThrow(() => t.sync({}));
    assert.equal(t.sync({}), null, "a tracker that cannot judge reports nothing");
  } finally { console.warn = real; }
  assert.equal(warns.length, 1, "the throw is reported once, not once per keystroke");
});

test("a provider that throws in outline costs the panel, not the page", () => {
  const host = fakeList(["do the thing"]);
  const provider = {
    outline: () => { throw new Error("boom"); },
    verdicts: () => [true],
  };
  const t = Tracker.create({ host, provider });
  t.capture().setGoals([{ gate: {} }]);
  const real = console.warn;
  console.warn = () => {};
  try {
    assert.doesNotThrow(() => t.sync({}));
    assert.equal(host.innerHTML, "", "the panel is left exactly as it was");
  } finally { console.warn = real; }
});

// clear() is what a card with no goals calls, so the previous card's boxes
// cannot linger. What is pinned here is the OBSERVABLE contract - a cleared
// tracker paints nothing and drops its class - not the internal bookkeeping.
//
// Note on the latch marks that clear() also resets: that reset is symmetry, not
// a fix. It cannot be reached through this API, because clear() empties the
// captured prose too and sync() refuses to paint without it, so capture() is
// always the reset that actually runs. Saying so here rather than writing a
// test that would pass with or without it - a green test that proves nothing is
// worse than no test, because it stops anyone looking again.
test("clear() leaves a card with no goals showing nothing", () => {
  const host = fakeList(["stage it"]);
  const provider = {
    outline: () => ({ kind: "box", header: "staged", rows: [] }),
    verdicts: () => [true],
    latches: () => true,
  };
  const t = Tracker.create({ host, provider });
  t.capture().setGoals([{ gate: { staged: ["cat.txt"] } }]);
  assert.deepEqual(t.sync({}), [true]);
  assert.ok(host.classList.contains("has-tracker"));

  t.clear();
  assert.equal(t.sync({}), null, "nothing to track means nothing painted");
  assert.ok(!host.classList.contains("has-tracker"), "the list gets its bullets back");
});
