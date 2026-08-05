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
  // This used to answer TRUE, on the reasoning that an empty object asks for
  // nothing so nothing can be missing. That reasoning is wrong in the direction
  // that costs the learner: a gate testing nothing is green before they type,
  // and validate.mjs cannot see it because it only hunts gates that never tick.
  // A gate that asks nothing is now a gate that is not satisfied.
  assert.equal(G.meets({}, world), false, "a gate that tests nothing must not pass");
});

// The same hole with a real field name in it. An author who writes `stagged`
// or `command` gets no syntax error and no warning - the field is simply not in
// the vocabulary, every check skips, and the box is green from the first frame.
test("a gate whose fields are all misspelled tests nothing, so it is unmet", () => {
  const world = { state: null, ran: [] };
  assert.equal(G.meets({ stagged: ["cat.txt"] }, world), false);
  assert.equal(G.meets({ command: "git init" }, world), false);
  assert.equal(G.meets({ ran: "" }, world), false, "an empty command asks for nothing");
  assert.equal(G.meets({ ran: [] }, world), false, "an empty command list asks for nothing");
});

// ...but the fields that legitimately carry an "empty" value are still claims,
// and over-correcting would silently kill them.
test("an empty staged list and an attached HEAD are still real claims", async () => {
  const clean = await repo(["git init"], FILES);
  assert.equal(G.meets({ staged: [] }, { state: clean, ran: [] }), true,
    "nothing staged is a fact about the repository, not an empty gate");
  assert.equal(G.meets({ detached: false }, { state: clean, ran: [] }), true,
    "HEAD attached is a fact too - `false` is a value, not a missing field");

  const staged = await repo(["git init", "git add cat.txt"], FILES);
  assert.equal(G.meets({ staged: [] }, { state: staged, ran: [] }), false);
  assert.equal(G.meets({ staged: ["cat.txt"] }, { state: staged, ran: [] }), true);
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

// --- a gate must never pass because it was written wrong ---------------------
//
// `absent` recurses, and the recursion used to invert a typo into a pass:
// meets("typo") is false, so "the thing is absent" came back TRUE and the whole
// gate was satisfied before the learner typed anything.
//
// This is the worst way for a gate to be wrong. tools/validate.mjs hunts gates
// that can NEVER tick, so a gate that is ALWAYS true sails past it and greets
// the learner already green - and a tracker that is green from the start is
// exactly the thing the tracker was built to stop being.
test("a malformed `absent` leaves the gate unmet, never satisfied", () => {
  const world = { state: null, ran: [] };
  for (const broken of ["typo", 42, true, []]) {
    assert.equal(G.meets({ absent: broken }, world), false,
      `absent: ${JSON.stringify(broken)} must not satisfy the gate`);
  }
});

test("a well-formed `absent` still works both ways", () => {
  const world = { state: null, ran: ["git init"] };
  // The inner gate is met, so the thing is NOT absent - outer gate unmet.
  assert.equal(G.meets({ absent: { ran: "git init" } }, world), false);
  // The inner gate is not met, so the thing really is absent - outer gate met.
  assert.equal(G.meets({ absent: { ran: "git nonesuch" } }, world), true);
});

// --- `absent` must not invert a question it never asked -----------------------
//
// `absent` is the only gate that turns a false into a true, which makes every
// "false for the wrong reason" in this module a green tick somewhere. Three
// wrong reasons, all of them found by review rather than by use:
test("`absent` wrapping a gate that tests nothing is unmet", () => {
  const world = { state: null, ran: [] };
  assert.equal(G.meets({ absent: {} }, world), false, "an empty inner gate is not an absence");
  assert.equal(G.meets({ absent: { stagged: ["cat.txt"] } }, world), false, "a typo is not an absence");
  assert.equal(G.meets({ absent: { ran: [] } }, world), false, "no command is not an absence");
});

test("`absent` does not turn a repository it cannot read into an absence", () => {
  // The runtime hands back Maps. Anything else cannot be read here, and reading
  // it as empty would claim the learner removed something still sitting there.
  const unreadable = {
    refs: {},
    commits: { c1: { message: "add cat", parents: [], paths: ["cat.txt"] } },
    index: new Map(), worktree: new Map(),
    head: { kind: "branch", name: "refs/heads/main" },
  };
  assert.equal(G.meets({ absent: { commit: "add cat" } }, { state: unreadable, ran: [] }), false,
    "\"I could not look\" is not \"it is not there\"");
});

// --- a set comparison must compare two SETS ----------------------------------
test("a non-array staged/worktree value is unmet, and never throws", async () => {
  const clean = await repo(["git init"], FILES);
  const world = { state: clean, ran: [] };
  // "" used to be coerced to [] and then matched an empty index exactly.
  assert.equal(G.meets({ staged: "" }, world), false);
  assert.equal(G.meets({ worktree: "" }, world), false);
  // A truthy non-array used to throw straight out of a function documented never
  // to throw - in the browser that lands inside the terminal's own handler.
  assert.doesNotThrow(() => G.meets({ staged: {} }, world));
  assert.equal(G.meets({ staged: {} }, world), false);
});

test("`staged: []` is not satisfied by a repository with no index at all", () => {
  const noIndex = {
    refs: new Map(), commits: new Map(),
    head: { kind: "branch", name: "refs/heads/main" },
  };
  assert.equal(G.meets({ staged: [] }, { state: noIndex, ran: [] }), false,
    "nothing to read is not the same as nothing staged");
});
