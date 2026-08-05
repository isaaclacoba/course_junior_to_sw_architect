// test/git-task.test.js - how an authored git card is READ.
//
// WHY THIS EXISTS
// Two consumers read a git card's fields: the page (kernel/engine/plugins/
// git-plugin.js) and the gate (tools/lib/git-validate.mjs). They used to keep
// private copies of these accessors, so a change to one silently taught the gate
// to seed a DIFFERENT repository than the page seeds - and a gate that grades a
// different repo than the learner sees is worse than no gate, because it passes
// cards nobody can solve. The rules live in one module now, and these tests pin
// the behaviour both sides depend on.
//
// The module is pure data-in/arrays-out, so every case here is plain objects.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const GitTask = require("../kernel/grading/git-task.js");

// --- authoring aliases -----------------------------------------------------

test("start/target accept both the short and the long authoring name", () => {
  assert.deepEqual(GitTask.startOf({ start: ["a"] }), ["a"]);
  assert.deepEqual(GitTask.startOf({ commands: ["a"] }), ["a"]);
  assert.deepEqual(GitTask.targetOf({ target: ["b"] }), ["b"]);
  assert.deepEqual(GitTask.targetOf({ targetCommands: ["b"] }), ["b"]);
});

test("a solution may be one string or a list, and is always read as a list", () => {
  assert.deepEqual(GitTask.solutionOf({ solution: "git init" }), ["git init"]);
  assert.deepEqual(GitTask.solutionOf({ solution: ["git init", "git add a"] }), ["git init", "git add a"]);
  assert.deepEqual(GitTask.solutionOf({}), [], "a card with no solution reads as no commands");
});

test("a missing task reads as nothing rather than throwing", () => {
  // startOf/targetOf return the authored list or a falsy value; every caller
  // writes `startOf(task) || []`, so the exact flavour of falsy is not a promise.
  assert.ok(!GitTask.startOf(null));
  assert.ok(!GitTask.targetOf(null));
  assert.deepEqual(GitTask.solutionOf(null), []);
  assert.deepEqual(GitTask.filesOf(null), []);
});

// --- ready-made states -----------------------------------------------------

test("a RepoState is told apart from a command list", () => {
  const repoish = { commits: new Map(), refs: new Map(), head: { kind: "branch" } };
  assert.equal(GitTask.isRepoState(repoish), true);
  assert.equal(GitTask.isRepoState(["git init"]), false);
  assert.equal(GitTask.isRepoState(null), false);
  assert.equal(GitTask.isRepoState({ commits: new Map() }), false, "half a state is not a state");
});

// --- which files the folder holds ------------------------------------------

test("addedPaths reads the filenames out of a git add line", () => {
  assert.deepEqual(GitTask.addedPaths("git add cat.txt dog.txt"), ["cat.txt", "dog.txt"]);
  assert.deepEqual(GitTask.addedPaths('git commit -m "cat.txt"'), [], "only git add names files");
  assert.deepEqual(GitTask.addedPaths(""), []);
});

test("flags and whole-folder pathspecs are not filenames", () => {
  assert.deepEqual(GitTask.addedPaths("git add -A"), []);
  assert.deepEqual(GitTask.addedPaths("git add ."), []);
  assert.deepEqual(GitTask.addedPaths("git add * cat.txt"), ["cat.txt"]);
});

test("a card's folder is inferred from every list it authors", () => {
  const task = {
    start: ["git add cat.txt", 'git commit -m "one"'],
    target: ["git add dog.txt"],
    solution: ["git add bird.txt"],
  };
  assert.deepEqual(GitTask.filesOf(task).sort(), ["bird.txt", "cat.txt", "dog.txt"]);
});

test("declared files cover what the card shows but never adds", () => {
  // notes.md appears in no command - the learner is asked to LEAVE IT OUT - so
  // only the explicit declaration can put it in the folder.
  const task = { files: ["notes.md"], target: ["git add cat.txt"] };
  assert.deepEqual(GitTask.filesOf(task).sort(), ["cat.txt", "notes.md"]);
});

test("a file named twice is seeded once", () => {
  const task = { files: ["cat.txt"], start: ["git add cat.txt"], target: ["git add cat.txt"] };
  assert.deepEqual(GitTask.filesOf(task), ["cat.txt"]);
});

test("a card whose start is a ready-made state still seeds its declared files", () => {
  const task = { files: ["cat.txt"], start: { commits: new Map(), refs: new Map(), head: {} } };
  assert.deepEqual(GitTask.filesOf(task), ["cat.txt"], "a non-array list must not break the scan");
});

test("a file declared with contents keeps all of them, not just the first", () => {
  // Deduping on the entry itself stringifies every object to "[object Object]",
  // so the second and third look like repeats and vanish. A lesson silently
  // loses two of its three files, and the only symptom is a thinner board.
  const task = {
    files: [
      { path: "cat.txt", text: "Mia" },
      { path: "dog.txt", text: "Rex" },
      { path: "notes.md", text: "half done" }
    ]
  };
  assert.deepEqual(
    GitTask.filesOf(task).map((f) => f.path),
    ["cat.txt", "dog.txt", "notes.md"],
  );
});

test("bare paths and files-with-contents can be mixed, and still dedupe by path", () => {
  const task = {
    files: ["bare.txt", { path: "rich.txt", text: "has text" }, "bare.txt"],
    solution: ["git add rich.txt"]
  };
  const got = GitTask.filesOf(task);
  assert.deepEqual(got.map((f) => (typeof f === "string" ? f : f.path)), ["bare.txt", "rich.txt"]);
  assert.equal(got[1].text, "has text", "the contents survive the union with inferred paths");
});
