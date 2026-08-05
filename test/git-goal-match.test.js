"use strict";

// Unit test for kernel/grading/git-goal-match.js - the declarative gates behind
// the live goal tracker on a git lesson. Two halves, on purpose:
//   1. the policy over repositories built by the REAL git runtime, because a
//      gate is only honest if it agrees with the engine the learner types into;
//   2. the shapes that must NOT tick - a branch that is not there, an amend's
//      dangling commit, a read nobody ran.
// Dependency-free apart from the vendored bundle: `node --test test/`.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const ROOT = path.dirname(__dirname);
const G = require(path.join(ROOT, "kernel", "grading", "git-goal-match.js"));

// The real runtime, loaded the same way the tools do.
let CL = null;
async function codeLab() {
  if (!CL) {
    const { loadCodeLab } = await import(
      "file://" + path.join(ROOT, "tools", "lib", "codelab-sandbox.mjs")
    );
    CL = loadCodeLab();
  }
  return CL;
}

// Replay real commands into a real RepoState, exactly as the git plugin does.
async function repo(commands, files) {
  const cl = await codeLab();
  let state = cl.gitInit();
  if (files && files.length) state = cl.gitAddFiles(state, files).state;
  for (const line of commands) {
    const res = cl.gitRun(line, state);
    if (res && res.state) state = res.state;
  }
  return state;
}

const FILES = [
  { path: "cat.txt", text: "Mia, tabby." },
  { path: "dog.txt", text: "Rex, collie." },
  { path: "notes.md", text: "Not committed." },
];

const BASE = [
  "git add cat.txt",
  'git commit -m "add cat"',
  "git add dog.txt",
  'git commit -m "add dog"',
];

// --- ran: the read half -----------------------------------------------------

test("a ran gate matches on the command's leading words", () => {
  const world = { state: null, ran: ["git log --oneline", "git status"] };
  assert.equal(G.meets({ ran: "git log" }, world), true, "a flag on the end still counts");
  assert.equal(G.meets({ ran: "git status" }, world), true);
  assert.equal(G.meets({ ran: "git branch" }, world), false);
});

test("a ran gate does not match a longer command as a prefix of a shorter one", () => {
  const world = { state: null, ran: ["git log"] };
  assert.equal(G.meets({ ran: "git log --oneline" }, world), false);
});

test("a ran gate does not match a different word that merely starts the same", () => {
  const world = { state: null, ran: ["git statusx"] };
  assert.equal(G.meets({ ran: "git status" }, world), false);
});

test("a ran gate accepts a list, and needs every line in it", () => {
  const world = { state: null, ran: ["git status"] };
  assert.equal(G.meets({ ran: ["git status"] }, world), true);
  assert.equal(G.meets({ ran: ["git status", "git log"] }, world), false);
});

// --- branches, tags and HEAD ------------------------------------------------

test("a branch gate needs that branch to exist", async () => {
  const state = await repo([...BASE, "git branch feature"], FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ branch: "feature" }, world), true);
  assert.equal(G.meets({ branch: "nope" }, world), false);
});

test("at pins a ref to the commit carrying that message", async () => {
  const state = await repo([...BASE, "git branch old HEAD~1"], FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ branch: "old", at: "add cat" }, world), true);
  assert.equal(G.meets({ branch: "old", at: "add dog" }, world), false,
    "old points one commit back, not at the tip");
});

test("a tag gate is separate from a branch gate of the same name", async () => {
  const state = await repo([...BASE, "git tag v1"], FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ tag: "v1" }, world), true);
  assert.equal(G.meets({ branch: "v1" }, world), false, "a tag is not a branch");
});

test("head reads which branch the learner is standing on", async () => {
  const state = await repo([...BASE, "git switch -c feature"], FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ head: "feature" }, world), true);
  assert.equal(G.meets({ head: "main" }, world), false);
});

test("detached says whether HEAD is off a branch", async () => {
  const attached = { state: await repo(BASE, FILES), ran: [] };
  const loose = { state: await repo([...BASE, "git checkout HEAD~1"], FILES), ran: [] };
  assert.equal(G.meets({ detached: true }, loose), true);
  assert.equal(G.meets({ detached: false }, loose), false);
  assert.equal(G.meets({ detached: true }, attached), false);
  assert.equal(G.meets({ detached: false }, attached), true);
});

// --- commits ----------------------------------------------------------------

test("a commit gate matches its message exactly, not loosely", async () => {
  const state = await repo(BASE, FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ commit: "add dog" }, world), true);
  assert.equal(G.meets({ commit: "add dogs" }, world), false);
  assert.equal(G.meets({ commit: "add" }, world), false, "a prefix is a different commit");
});

test("paths asks which files a commit actually holds", async () => {
  const state = await repo(BASE, FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ commit: "add cat", paths: ["cat.txt"] }, world), true);
  assert.equal(G.meets({ commit: "add cat", paths: ["cat.txt", "notes.md"] }, world), false);
});

test("on scopes a commit to one branch", async () => {
  const state = await repo([
    "git add cat.txt", 'git commit -m "add cat"',
    "git switch -c feature", "git add dog.txt", 'git commit -m "add dog"',
  ], FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ commit: "add dog", on: "feature" }, world), true);
  assert.equal(G.meets({ commit: "add dog", on: "main" }, world), false,
    "main cannot see what only feature has");
});

test("parents counts a merge's two lines back", async () => {
  const state = await repo([
    "git add cat.txt", 'git commit -m "add cat"',
    "git switch -c fix", "git add dog.txt", 'git commit -m "add dog"',
    "git switch main", "git add notes.md", 'git commit -m "add notes"',
    "git merge fix",
  ], FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ commit: "Merge fix", parents: 2 }, world), true);
  assert.equal(G.meets({ commit: "Merge fix", parents: 1 }, world), false);
  assert.equal(G.meets({ commit: "add dog", parents: 2 }, world), false);
});

test("a commit thrown away by amend does not count", async () => {
  const state = await repo([...BASE, 'git commit --amend -m "add doggo"'], FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ commit: "add doggo" }, world), true);
  assert.equal(G.meets({ commit: "add dog" }, world), false,
    "the replaced commit is dangling - a tick for it would be a tick for work that was undone");
});

// --- the staging area and the working tree ----------------------------------

test("staged compares the whole index, not just a membership", async () => {
  const state = await repo(["git add cat.txt"], FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ staged: ["cat.txt"] }, world), true);
  assert.equal(G.meets({ staged: ["cat.txt", "dog.txt"] }, world), false);
  assert.equal(G.meets({ staged: [] }, world), false);
});

test("an empty staged list asserts nothing is staged", async () => {
  const state = await repo(BASE, FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ staged: [] }, world), true);
});

test("worktree reads what is sitting in the folder unstaged", async () => {
  const state = await repo(["git add cat.txt", 'git commit -m "add cat"'], FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ worktree: ["dog.txt", "notes.md"] }, world), true);
  assert.equal(G.meets({ worktree: ["dog.txt"] }, world), false);
});

// --- absent -----------------------------------------------------------------

test("absent proves a thing is NOT there", async () => {
  const state = await repo(BASE, FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ absent: { branch: "feature" } }, world), true);
  assert.equal(G.meets({ absent: { branch: "main" } }, world), false);
});

test("absent composes with a positive field", async () => {
  const state = await repo([...BASE, "git branch feature"], FILES);
  const world = { state, ran: [] };
  assert.equal(G.meets({ branch: "feature", absent: { branch: "old" } }, world), true);
  assert.equal(G.meets({ branch: "feature", absent: { branch: "main" } }, world), false);
});

// --- malformed input --------------------------------------------------------

test("a malformed gate is unmet, never an exception", () => {
  const world = { state: null, ran: [] };
  assert.equal(G.meets(null, world), false);
  assert.equal(G.meets("git status", world), false);
  assert.equal(G.meets({}, world), true, "an empty object asks for nothing, so nothing is missing");
});

test("a repository gate with no repository is unmet, never met", () => {
  assert.equal(G.meets({ branch: "main" }, { state: null, ran: [] }), false,
    "failing open would be a green tick nobody earned");
});

// --- rows -------------------------------------------------------------------

test("row 0 is the header, and no row can be met while the header is not", async () => {
  const state = await repo(BASE, FILES);
  const world = { state, ran: [] };
  const code = ["branch feature", { row: "HEAD on feature", head: "feature" }];
  assert.deepEqual(G.rows({ branch: "feature" }, code, world), [false, false]);
});

test("a row with its own gate ticks on its own", async () => {
  const state = await repo([...BASE, "git switch -c feature"], FILES);
  const world = { state, ran: [] };
  const code = [
    "branch feature",
    { row: "HEAD on feature", head: "feature" },
    { row: "at add dog", at: "add dog" },
    { row: "nothing staged", staged: [] },
  ];
  assert.deepEqual(G.rows({ branch: "feature" }, code, world), [true, true, true, true]);
});

test("a row with no gate of its own is a label, so it inherits the header", async () => {
  const state = await repo([...BASE, "git branch feature"], FILES);
  const world = { state, ran: [] };
  assert.deepEqual(G.rows({ branch: "feature" }, ["branch feature", "a plain label"], world),
    [true, true]);
  assert.deepEqual(G.rows({ branch: "nope" }, ["branch nope", "a plain label"], world),
    [false, false]);
});

test("rowLabel reads a step row's label and a plain row alike", () => {
  assert.equal(G.rowLabel({ row: "HEAD on feature", head: "feature" }), "HEAD on feature");
  assert.equal(G.rowLabel("branch feature"), "branch feature");
  assert.equal(G.rowLabel(null), "");
});

test("rowGate pulls out only real gate fields", () => {
  assert.deepEqual(G.rowGate({ row: "label", head: "main" }), { head: "main" });
  assert.equal(G.rowGate({ row: "label" }), null, "a label alone is not a claim");
  assert.equal(G.rowGate("plain"), null);
});

// --- verdicts: what a learner actually sees ---------------------------------

test("a box is green only when its gate AND every row is green", async () => {
  const state = await repo([...BASE, "git branch feature"], FILES);
  const world = { state, ran: [] };
  const goals = [{
    code: ["branch feature", { row: "HEAD on feature", head: "feature" }],
    gate: { branch: "feature" },
  }];
  assert.deepEqual(G.verdicts(goals, world), [false],
    "the branch exists but the learner is not standing on it");
});

test("a goal with no gate is null - untracked, not failed", async () => {
  const state = await repo(BASE, FILES);
  assert.deepEqual(G.verdicts([{ gate: null }, {}], { state, ran: [] }), [null, null]);
});

test("verdicts walks a whole card in authored order", async () => {
  const state = await repo([...BASE, "git switch -c feature"], FILES);
  const world = { state, ran: ["git status"] };
  const goals = [
    { code: ["git status"], gate: { ran: "git status" } },
    { code: ["git log"], gate: { ran: "git log" } },
    { code: ["branch feature", { row: "HEAD on feature", head: "feature" }], gate: { branch: "feature" } },
    { gate: null },
  ];
  assert.deepEqual(G.verdicts(goals, world), [true, false, true, null]);
});

// --- describe ---------------------------------------------------------------

test("describe names what a gate wanted, for a validator's message", () => {
  assert.match(G.describe({ branch: "feature", at: "add dog" }), /branch feature/);
  assert.match(G.describe({ ran: "git status" }), /git status/);
  assert.equal(G.describe(null), "(no factual test)");
  assert.equal(G.describe({}), "(empty gate)");
});
