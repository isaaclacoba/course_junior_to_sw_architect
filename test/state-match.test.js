"use strict";

// test/state-match.test.js - the THREE-AREA end-state grader.
//
// WHY THIS EXISTS
// The commit DAG grader signs a commit as [message, parentSigs], which ignores WHICH
// FILES it touched. Measured 2026-08-04: a learner who staged an extra file and
// committed it still scored {ok:true}, so a card teaching "staging is a choice" could
// not enforce what it taught. The widget shows three zones - Working tree, Staging,
// Repository - so the grader has to answer for all three.
//
// The load-bearing design point, and the thing these tests must protect: commit
// IDENTITY (which commit is this, in the other repo) stays [message, parents], because
// ghosting and divergence depend on it. EQUALITY (are they the same in every respect)
// is checked separately, AFTER identity is settled.

const test = require("node:test");
const assert = require("node:assert/strict");

const { stateMatch } = require("../kernel/grading/state-match.js");
const { progress } = require("../kernel/engine/git-progress.js");

// ---- fixtures --------------------------------------------------------------
const C = (id, parents, message, paths) => ({ id, parents, message, paths });
function repo(commits, refs, headRef, index, worktree) {
  return {
    commits: new Map(commits.map((c) => [c.id, c])),
    refs: new Map(refs),
    head: { kind: "branch", name: headRef || "refs/heads/main" },
    index: new Map((index || []).map((p) => [p, "staged"])),
    worktree: new Map((worktree || []).map((p) => [p, "modified"])),
    seq: commits.length,
  };
}

// ---- REPOSITORY area: which files a commit touched -------------------------
test("repository: a commit that touches extra files is caught", () => {
  const target = repo([C("t1", [], "add the pets", ["cat.txt", "dog.txt"])], [["refs/heads/main", "t1"]]);
  const actual = repo([C("a1", [], "add the pets", ["cat.txt", "dog.txt", "notes.md"])], [["refs/heads/main", "a1"]]);
  const r = stateMatch({ actual, target });
  assert.equal(r.ok, false);
  assert.equal(r.area, "repository");
  assert.match(r.reason, /notes\.md/);
});

test("repository: identical file lists in a different order still match", () => {
  const target = repo([C("t1", [], "add the pets", ["dog.txt", "cat.txt"])], [["refs/heads/main", "t1"]]);
  const actual = repo([C("a1", [], "add the pets", ["cat.txt", "dog.txt"])], [["refs/heads/main", "a1"]]);
  assert.equal(stateMatch({ actual, target }).ok, true);
});

test("repository: a target commit the learner has not made yet is NOT a mismatch", () => {
  // That is "still missing" - the ghosting layer says it. This grader must stay quiet,
  // or a learner would be told they are wrong for simply not having finished.
  const target = repo(
    [C("t1", [], "add cat", ["cat.txt"]), C("t2", ["t1"], "add dog", ["dog.txt"])],
    [["refs/heads/main", "t2"]]
  );
  const actual = repo([C("a1", [], "add cat", ["cat.txt"])], [["refs/heads/main", "a1"]]);
  assert.equal(stateMatch({ actual, target }).ok, true);
});

// ---- STAGING area ----------------------------------------------------------
test("staging: an extra staged file is caught", () => {
  const target = repo([], [], "refs/heads/main", ["cat.txt", "dog.txt"]);
  const actual = repo([], [], "refs/heads/main", ["cat.txt", "dog.txt", "notes.md"]);
  const r = stateMatch({ actual, target });
  assert.equal(r.ok, false);
  assert.equal(r.area, "staging");
  assert.match(r.reason, /notes\.md/);
});

test("staging: a missing staged file is caught", () => {
  const target = repo([], [], "refs/heads/main", ["cat.txt", "dog.txt"]);
  const actual = repo([], [], "refs/heads/main", ["cat.txt"]);
  assert.equal(stateMatch({ actual, target }).area, "staging");
});

test("staging: an explicit `expected` overrides the target state", () => {
  const actual = repo([], [], "refs/heads/main", ["cat.txt", "dog.txt"]);
  assert.equal(stateMatch({ actual }, { expected: { index: ["cat.txt", "dog.txt"] } }).ok, true);
  assert.equal(stateMatch({ actual }, { expected: { index: ["cat.txt"] } }).ok, false);
});

// ---- WORKTREE area ---------------------------------------------------------
test("worktree: a leftover modified file is caught", () => {
  const target = repo([], [], "refs/heads/main", [], []);
  const actual = repo([], [], "refs/heads/main", [], ["notes.md"]);
  const r = stateMatch({ actual, target });
  assert.equal(r.ok, false);
  assert.equal(r.area, "worktree");
});

test("reset --soft and --mixed differ ONLY here, and are now told apart", () => {
  // Same commit graph, same refs. The only difference is where the files landed -
  // which is exactly what makes lesson 14 gradeable at all.
  const commits = [C("c1", [], "add cat", ["cat.txt"])];
  const soft = repo(commits, [["refs/heads/main", "c1"]], "refs/heads/main", ["dog.txt"], []);
  const mixed = repo(commits, [["refs/heads/main", "c1"]], "refs/heads/main", [], ["dog.txt"]);
  assert.equal(stateMatch({ actual: soft, target: soft }).ok, true);
  assert.equal(stateMatch({ actual: mixed, target: soft }).ok, false);
});

// ---- areas can be narrowed -------------------------------------------------
test("areas option limits which zones are checked", () => {
  const target = repo([], [], "refs/heads/main", ["cat.txt"], []);
  const actual = repo([], [], "refs/heads/main", ["cat.txt", "notes.md"], []);
  assert.equal(stateMatch({ actual, target }).ok, false);
  assert.equal(stateMatch({ actual, target }, { areas: ["worktree"] }).ok, true);
});

// ---- integration: git-progress now requires all three areas ----------------
test("git-progress: the sloppy learner no longer passes", () => {
  const target = repo([C("t1", [], "add the pets", ["cat.txt", "dog.txt"])], [["refs/heads/main", "t1"]]);
  const sloppy = repo([C("a1", [], "add the pets", ["cat.txt", "dog.txt", "notes.md"])], [["refs/heads/main", "a1"]]);
  const p = progress({ actual: sloppy, target });
  assert.equal(p.solved, false, "an extra file in the commit must not pass");
  assert.match(p.reason, /notes\.md/);
});

test("git-progress: the correct learner still passes", () => {
  const target = repo([C("t1", [], "add the pets", ["cat.txt", "dog.txt"])], [["refs/heads/main", "t1"]]);
  const good = repo([C("a1", [], "add the pets", ["cat.txt", "dog.txt"])], [["refs/heads/main", "a1"]]);
  assert.equal(progress({ actual: good, target }).solved, true);
});

// The regression that matters: identity must NOT have changed, or ghosting breaks.
test("git-progress: ghosting and divergence are untouched by the new check", () => {
  const target = repo(
    [C("t1", [], "add cat", ["cat.txt"]), C("t2", ["t1"], "add dog", ["dog.txt"])],
    [["refs/heads/main", "t2"]]
  );
  const half = repo([C("a1", [], "add cat", ["cat.txt"])], [["refs/heads/main", "a1"]]);
  const p = progress({ actual: half, target });
  assert.equal(p.ghost.length, 1, "the unmade commit is still ghosted");
  assert.equal(p.diverged.length, 0, "a learner mid-exercise is NOT diverged");
  assert.equal(p.solved, false);
});

// --- a replaced commit must not be graded against ---------------------------
// `commit --amend` does not edit a commit, it makes a new one and leaves the old
// one dangling. The old one keeps the same message and the same parents, so it
// signs IDENTICALLY - and while every commit was indexed, the grader could pair
// the target against the commit the learner had just thrown away. An amend that
// changed only the file list was therefore unpassable.
test("an amended-away commit is ignored, so the amend is graded on what remains", () => {
  const root = { id: "r", parents: [], message: "add cat", paths: ["cat.txt"] };
  // "before" is the pre-amend commit: same message, same parent, fewer files.
  const before = { id: "b", parents: ["r"], message: "add the rest", paths: ["dog.txt"] };
  const after = { id: "a", parents: ["r"], message: "add the rest", paths: ["dog.txt", "bird.txt"] };

  const learner = {
    commits: new Map([["r", root], ["b", before], ["a", after]]),
    refs: new Map([["refs/heads/main", "a"]]),   // only `a` is reachable
    head: { kind: "branch", name: "refs/heads/main" },
    index: new Map(), worktree: new Map(),
  };
  const want = {
    commits: new Map([["r", root], ["a", after]]),
    refs: new Map([["refs/heads/main", "a"]]),
    head: { kind: "branch", name: "refs/heads/main" },
    index: new Map(), worktree: new Map(),
  };

  const v = stateMatch({ actual: learner, target: want });
  assert.equal(v.ok, true, v.reason);
});
