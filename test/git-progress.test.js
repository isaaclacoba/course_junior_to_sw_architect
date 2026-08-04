"use strict";

// Unit test for kernel/engine/git-progress.js - the DOM-free "how far along is
// the learner" logic behind the git track's practical page (achieved / ghosted /
// off-plan, plus the single-layout union). Duck-types the git-model RepoState,
// so every path is testable with plain objects and real Maps - no browser, no
// code-lab, no dotnet. Dependency-free: `node --test test/`.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const G = require(path.join(__dirname, "..", "kernel", "engine", "git-progress.js"));

// --- tiny RepoState builder ---------------------------------------------------
// A commit spec is { id, parents?, message, paths? }. Refs is a plain object of
// fully-qualified name -> hash. Hashes are arbitrary and DISPLAY-ONLY: the whole
// point is that actual and target use different ones.
function repo(commits, refs, head) {
  const commitMap = new Map();
  for (const c of commits) {
    commitMap.set(c.id, { id: c.id, parents: c.parents || [], message: c.message, paths: c.paths || [] });
  }
  const refMap = new Map();
  for (const name of Object.keys(refs)) refMap.set(name, refs[name]);
  return { commits: commitMap, refs: refMap, head, index: new Map(), worktree: new Map() };
}

const onMain = { kind: "branch", name: "refs/heads/main" };

// The shared target used by most cases:
//   main:    ta "init" <- tb "add readme" <- tm "merge feature"
//   feature: branches at tb, one commit tf "start the feature"
//   tm is the merge of tb and tf.
function target() {
  return repo(
    [
      { id: "ta", parents: [], message: "init" },
      { id: "tb", parents: ["ta"], message: "add readme" },
      { id: "tf", parents: ["tb"], message: "start the feature" },
      { id: "tm", parents: ["tb", "tf"], message: "merge feature" }
    ],
    { "refs/heads/main": "tm", "refs/heads/feature": "tf" },
    onMain
  );
}

// The learner's base: the first two commits only, different hashes, no feature.
function base() {
  return repo(
    [
      { id: "A1", parents: [], message: "init" },
      { id: "B1", parents: ["A1"], message: "add readme" }
    ],
    { "refs/heads/main": "B1" },
    onMain
  );
}

// --- a. fresh start: ghost the NEXT step only ---------------------------------
test("progress: a fresh start ghosts only the next missing commit", () => {
  const r = G.progress({ actual: base(), target: target() });
  assert.equal(r.solved, false);
  assert.deepEqual(r.diverged, []);
  assert.equal(r.ghost.length, 1, "only the next step is ghosted, not the whole target");
  assert.equal(r.union.commits.get(r.ghost[0]).message, "start the feature");
  assert.deepEqual(r.nextStep, {
    kind: "commit",
    id: r.ghost[0],
    message: "start the feature",
    onBranch: "feature"
  });
  assert.equal(r.reason, 'the commit "start the feature" is missing on branch \'feature\'');
});

test("progress: { all: true } ghosts every missing commit", () => {
  const r = G.progress({ actual: base(), target: target() }, { all: true });
  assert.equal(r.ghost.length, 2);
  const messages = r.ghost.map((id) => r.union.commits.get(id).message);
  assert.deepEqual(messages, ["start the feature", "merge feature"], "parents-first order");
});

test("progress: the option is also accepted on the input bag", () => {
  const a = G.progress({ actual: base(), target: target(), all: true });
  const b = G.progress({ actual: base(), target: target() }, { all: true });
  assert.deepEqual(a.ghost, b.ghost);
});

// --- b. divergence blocks the pass even when the target shape is reached ------
test("progress: an off-plan commit diverges and blocks the pass", () => {
  // The learner reached the whole target AND left a scratch branch with an
  // off-plan commit on it.
  const actual = repo(
    [
      { id: "A1", parents: [], message: "init" },
      { id: "B1", parents: ["A1"], message: "add readme" },
      { id: "F1", parents: ["B1"], message: "start the feature" },
      { id: "M1", parents: ["B1", "F1"], message: "merge feature" },
      { id: "X1", parents: ["B1"], message: "oops" }
    ],
    { "refs/heads/main": "M1", "refs/heads/feature": "F1", "refs/heads/scratch": "X1" },
    onMain
  );
  const r = G.progress({ actual, target: target() });
  assert.equal(r.solved, false, "any diverged commit must block the pass");
  assert.deepEqual(r.diverged, ["X1"]);
  assert.deepEqual(r.ghost, [], "nothing is missing - only off-plan work remains");
  assert.equal(r.nextStep.kind, "extraRef");
  assert.equal(r.nextStep.short, "scratch");
});

// --- c. branches created in a different order still solve ---------------------
test("progress: branch creation order does not matter, only structure", () => {
  // Target: docs created first, then feature.
  const t = repo(
    [
      { id: "ta", parents: [], message: "init" },
      { id: "td", parents: ["ta"], message: "write docs" },
      { id: "tf", parents: ["ta"], message: "start the feature" }
    ],
    { "refs/heads/main": "ta", "refs/heads/docs": "td", "refs/heads/feature": "tf" },
    onMain
  );
  // Learner: feature created first, docs second, different hashes throughout.
  const actual = repo(
    [
      { id: "A1", parents: [], message: "init" },
      { id: "F1", parents: ["A1"], message: "start the feature" },
      { id: "D1", parents: ["A1"], message: "write docs" }
    ],
    { "refs/heads/main": "A1", "refs/heads/feature": "F1", "refs/heads/docs": "D1" },
    onMain
  );
  const r = G.progress({ actual, target: t });
  assert.equal(r.solved, true);
  assert.deepEqual(r.ghost, []);
  assert.deepEqual(r.diverged, []);
  assert.equal(r.nextStep, null);
});

// --- d. a merge the learner has not made is the ghost -------------------------
test("progress: an unmade merge is the ghosted next step", () => {
  const actual = repo(
    [
      { id: "A1", parents: [], message: "init" },
      { id: "B1", parents: ["A1"], message: "add readme" },
      { id: "F1", parents: ["B1"], message: "start the feature" }
    ],
    { "refs/heads/main": "B1", "refs/heads/feature": "F1" },
    onMain
  );
  const r = G.progress({ actual, target: target() });
  assert.equal(r.solved, false);
  assert.equal(r.ghost.length, 1);
  const ghost = r.union.commits.get(r.ghost[0]);
  assert.equal(ghost.message, "merge feature");
  assert.deepEqual(ghost.parents, ["B1", "F1"], "both merge parents point at the learner's own commits");
  assert.equal(r.nextStep.kind, "commit");
  assert.equal(r.nextStep.onBranch, "main");
});

// --- e. overshoot -------------------------------------------------------------
test("progress: committing past the target diverges and blocks the pass", () => {
  const actual = repo(
    [
      { id: "A1", parents: [], message: "init" },
      { id: "B1", parents: ["A1"], message: "add readme" },
      { id: "F1", parents: ["B1"], message: "start the feature" },
      { id: "M1", parents: ["B1", "F1"], message: "merge feature" },
      { id: "Z1", parents: ["M1"], message: "one more thing" }
    ],
    { "refs/heads/main": "Z1", "refs/heads/feature": "F1" },
    onMain
  );
  const r = G.progress({ actual, target: target() });
  assert.equal(r.solved, false);
  assert.deepEqual(r.diverged, ["Z1"]);
  assert.deepEqual(r.ghost, []);
});

test("progress: diverged is the reason once nothing else is left to explain it", () => {
  // main deliberately left where the target wants it, with the extra commit
  // hanging off a tag-free detached-free side path that shares the ref set.
  const t = repo(
    [
      { id: "ta", parents: [], message: "init" },
      { id: "tb", parents: ["ta"], message: "work" }
    ],
    { "refs/heads/main": "tb", "refs/heads/side": "tb" },
    onMain
  );
  const actual = repo(
    [
      { id: "A1", parents: [], message: "init" },
      { id: "B1", parents: ["A1"], message: "work" },
      { id: "S1", parents: ["B1"], message: "off-plan" }
    ],
    { "refs/heads/main": "B1", "refs/heads/side": "S1" },
    onMain
  );
  const r = G.progress({ actual, target: t });
  assert.equal(r.solved, false);
  assert.deepEqual(r.diverged, ["S1"]);
  assert.equal(r.nextStep.kind, "ref", "the side branch sits at a commit the learner already has");
  assert.equal(r.reason, "branch 'side' is not at the expected commit");
});

// --- f. exact match -----------------------------------------------------------
test("progress: an exact structural match solves with nothing ghosted or flagged", () => {
  const actual = repo(
    [
      { id: "A1", parents: [], message: "init" },
      { id: "B1", parents: ["A1"], message: "add readme" },
      { id: "F1", parents: ["B1"], message: "start the feature" },
      { id: "M1", parents: ["B1", "F1"], message: "merge feature" }
    ],
    { "refs/heads/main": "M1", "refs/heads/feature": "F1" },
    onMain
  );
  const r = G.progress({ actual, target: target() });
  assert.equal(r.solved, true);
  assert.deepEqual(r.ghost, []);
  assert.deepEqual(r.diverged, []);
  assert.equal(r.nextStep, null);
  assert.equal(r.reason, "the target shape is reached");
});

// --- g. the union is one laid-out graph ---------------------------------------
test("progress: the union holds the learner's commits plus exactly the ghosts", () => {
  const actual = base();
  const r = G.progress({ actual, target: target() }, { all: true });

  for (const id of actual.commits.keys()) {
    assert.equal(r.union.commits.has(id), true, "the learner's commit " + id + " survives");
  }
  const learnerIds = [...actual.commits.keys()];
  const unionIds = [...r.union.commits.keys()];
  assert.deepEqual(unionIds.slice(0, learnerIds.length), learnerIds, "learner commits keep their order (time axis)");
  assert.deepEqual(unionIds.slice(learnerIds.length), r.ghost, "ghosts are appended, newest last");

  // The ghosts are wired into the LEARNER's ids, which is what puts them in the
  // lane they will really occupy - git-layout takes lanes from parent edges.
  const [gf, gm] = r.ghost;
  assert.deepEqual(r.union.commits.get(gf).parents, ["B1"]);
  assert.deepEqual(r.union.commits.get(gm).parents, ["B1", gf]);

  // Refs and HEAD stay the learner's: no solid chip for a branch not yet made.
  assert.deepEqual([...r.union.refs.keys()], ["refs/heads/main"]);
  assert.equal(r.union.refs.get("refs/heads/main"), "B1");
  assert.deepEqual(r.union.head, onMain);
});

test("progress: the inputs are never mutated", () => {
  const actual = base();
  const t = target();
  const before = { commits: actual.commits.size, refs: actual.refs.size };
  const r = G.progress({ actual, target: t }, { all: true });
  assert.equal(actual.commits.size, before.commits);
  assert.equal(actual.refs.size, before.refs);
  assert.equal(t.commits.size, 4);
  r.union.commits.get(r.ghost[0]).message = "tampered";
  assert.equal(t.commits.get("tf").message, "start the feature");
});

test("progress: a ghost id clashing with a learner id is renamed, not overwritten", () => {
  // The learner's hashes happen to collide with the target's - the model's
  // hashes are deterministic, so this is reachable, and a clash would drop a
  // real commit out of the union.
  const actual = repo(
    [
      { id: "ta", parents: [], message: "init" },
      { id: "tf", parents: ["ta"], message: "add readme" }
    ],
    { "refs/heads/main": "tf" },
    onMain
  );
  const t = repo(
    [
      { id: "ta", parents: [], message: "init" },
      { id: "tb", parents: ["ta"], message: "add readme" },
      { id: "tf", parents: ["tb"], message: "third" }
    ],
    { "refs/heads/main": "tf" },
    onMain
  );
  const r = G.progress({ actual, target: t });
  assert.equal(r.ghost.length, 1);
  assert.notEqual(r.ghost[0], "tf");
  assert.equal(r.union.commits.get("tf").message, "add readme", "the learner's commit is intact");
  assert.equal(r.union.commits.get(r.ghost[0]).message, "third");
});

// --- next-step ordering: refs, then commits, then HEAD ------------------------
test("progress: a ref the learner can create right now is the next step", () => {
  const t = repo(
    [
      { id: "ta", parents: [], message: "init" },
      { id: "tb", parents: ["ta"], message: "add readme" }
    ],
    { "refs/heads/main": "tb", "refs/heads/feature": "tb" },
    onMain
  );
  const r = G.progress({ actual: base(), target: t });
  assert.equal(r.solved, false);
  assert.equal(r.nextStep.kind, "ref");
  assert.equal(r.nextStep.name, "refs/heads/feature");
  assert.equal(r.nextStep.op, "create");
  assert.deepEqual(r.ghost, []);
  assert.equal(r.reason, "branch 'feature' does not exist yet");
});

test("progress: a ref waiting on an unmade commit defers to the commit step", () => {
  // refs/heads/feature is missing AND its commit is missing: the commit is the
  // step that can actually be taken, so it wins - and always the same way.
  const r = G.progress({ actual: base(), target: target() });
  assert.equal(r.nextStep.kind, "commit");
  const again = G.progress({ actual: base(), target: target() });
  assert.deepEqual(again.nextStep, r.nextStep, "stable across calls");
});

test("progress: HEAD on the wrong branch is reported once everything else lines up", () => {
  const t = repo(
    [
      { id: "ta", parents: [], message: "init" },
      { id: "tf", parents: ["ta"], message: "start the feature" }
    ],
    { "refs/heads/main": "ta", "refs/heads/feature": "tf" },
    { kind: "branch", name: "refs/heads/feature" }
  );
  const actual = repo(
    [
      { id: "A1", parents: [], message: "init" },
      { id: "F1", parents: ["A1"], message: "start the feature" }
    ],
    { "refs/heads/main": "A1", "refs/heads/feature": "F1" },
    onMain
  );
  const r = G.progress({ actual, target: t });
  assert.equal(r.solved, false);
  assert.equal(r.nextStep.kind, "head");
  assert.equal(r.reason, "HEAD is on 'main' but should be on 'feature'");
});

test("progress: a tag is named a tag, not a branch", () => {
  const t = repo(
    [
      { id: "ta", parents: [], message: "init" },
      { id: "tb", parents: ["ta"], message: "add readme" }
    ],
    { "refs/heads/main": "tb", "refs/tags/v1": "tb" },
    onMain
  );
  const r = G.progress({ actual: base(), target: t });
  assert.equal(r.nextStep.refKind, "tag");
  assert.equal(r.reason, "tag 'v1' does not exist yet");
});

// --- reset --hard: an orphaned mistake must not lock the card -----------------
test("progress: a commit orphaned by a reset is not counted as off-plan", () => {
  const t = repo(
    [
      { id: "ta", parents: [], message: "init" },
      { id: "tb", parents: ["ta"], message: "add readme" }
    ],
    { "refs/heads/main": "tb" },
    onMain
  );
  const actual = repo(
    [
      { id: "A1", parents: [], message: "init" },
      { id: "B1", parents: ["A1"], message: "add readme" },
      { id: "OOPS", parents: ["B1"], message: "mistake" } // unreferenced after reset
    ],
    { "refs/heads/main": "B1" },
    onMain
  );
  const r = G.progress({ actual, target: t });
  assert.deepEqual(r.diverged, []);
  assert.equal(r.solved, true);
});

// --- malformed input ----------------------------------------------------------
test("progress: malformed input reports rather than throws", () => {
  const r = G.progress({ actual: null, target: target() });
  assert.equal(r.solved, false);
  assert.equal(r.reason, "malformed history");
  assert.equal(r.nextStep.kind, "malformed");
  assert.equal(r.union.commits.size, 0);
});
