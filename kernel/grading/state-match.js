/*
 * kernel/grading/state-match.js - the THREE-AREA end-state grader for git lessons.
 *
 * The git widget shows a learner three zones - Working tree | Staging | Repository -
 * so "did you reach the target?" has to be answered for all three. The commit DAG
 * (kernel/grading/dag-match.js) answers only the Repository half, and only its SHAPE:
 * it signs a commit as [message, parentSigs], which deliberately ignores WHICH FILES
 * the commit touched. Measured 2026-08-04: a learner who stages an extra file and
 * commits it still scored {ok:true}, so a card teaching "staging is a choice" could
 * not enforce the very thing it teaches.
 *
 * IDENTITY vs EQUALITY - the distinction this module rests on.
 *   IDENTITY ("which commit is this, in the other repo?") must stay [message, parents].
 *     git-progress uses that signature to decide what to GHOST, what is DIVERGED, and
 *     how to lay out the union. Folding paths into it would redefine identity: a
 *     half-staged commit would stop matching its target twin, so mid-exercise the graph
 *     would flag false divergence and the ghost would jump. Identity is left alone.
 *   EQUALITY ("is it the same in every respect?") is this module's job, and it runs
 *     AFTER identity is settled: for each target commit matched to a learner commit by
 *     signature, compare the file lists; then compare the staging area and the working
 *     tree. Nothing here feeds back into ghosting.
 *
 *   stateMatch({ actual, target }, opts) -> { ok, area, reason }
 *     area   : "repository" | "staging" | "worktree" | null when ok
 *     reason : a short factual sentence naming what differs - never a command to type.
 *
 *   opts.expected : optional explicit override, e.g. { index:[...], worktree:[...] },
 *                   for a card whose goal is a staging state rather than a commit.
 *   opts.areas    : which areas to check, default all three.
 *
 * No DOM, no CodeLab: a pure function over data, unit-testable with plain objects.
 * UMD like its siblings: window.KernelStateMatch in the browser, module.exports in node.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelStateMatch = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  var ALL_AREAS = ["repository", "staging", "worktree"];

  // The dag-match module owns commit IDENTITY. Resolve it the same lazy way
  // git-progress does, so script order in the browser cannot bite.
  function dag() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelDagMatch) return g.KernelDagMatch;
    if (typeof require === "function") {
      try { return require("./dag-match.js"); } catch (e) {}
    }
    return null;
  }

  function keys(mapLike) {
    if (!mapLike) return [];
    // Map.keys() is an ITERATOR, not array-like: Array.prototype.slice on it yields
    // [] and every comparison would silently pass. Array.from drains it properly.
    if (typeof mapLike.keys === "function") return Array.from(mapLike.keys());
    return Object.keys(mapLike);
  }
  function sorted(list) { return (list || []).slice().sort(); }
  function same(a, b) { return JSON.stringify(sorted(a)) === JSON.stringify(sorted(b)); }
  function list(paths) { return sorted(paths).join(", ") || "nothing"; }

  // Index every commit of a repo by its dag-match signature, so a target commit can
  // be paired with the learner's equivalent even though their hashes differ.
  function bySignature(state, orderedParents) {
    var D = dag();
    var out = new Map();
    if (!D || !D.makeSigner || !state || !state.commits) return out;
    var sign = D.makeSigner(state.commits, orderedParents);
    // Only commits you can still REACH from a ref or a detached HEAD count. A
    // `commit --amend` leaves the replaced commit dangling with the same message
    // and the same parents - so the same signature - and indexing it would let
    // the grader compare the learner against the very commit they just threw
    // away. Symptom: an amend that changes only the file list can never pass.
    var reachable = collectReachable(state);
    state.commits.forEach(function (commit, id) {
      if (!reachable.has(id)) return;
      var s = sign(id);
      if (s !== null && !out.has(s)) out.set(s, commit);
    });
    return out;
  }

  // The commit ids walkable from every ref plus a detached HEAD. Mirrors what
  // dag-match's reachableSigs walks, but keeps ids rather than signatures,
  // because this module compares the commits themselves.
  function collectReachable(state) {
    var seen = new Set();
    var stack = [];
    if (state.refs && state.refs.forEach) state.refs.forEach(function (h) { stack.push(h); });
    if (state.head && state.head.kind === "detached") stack.push(state.head.commit);
    while (stack.length) {
      var h = stack.pop();
      if (h == null || seen.has(h)) continue;
      seen.add(h);
      var c = state.commits && state.commits.get ? state.commits.get(h) : null;
      var parents = c && Array.isArray(c.parents) ? c.parents : [];
      for (var i = 0; i < parents.length; i++) stack.push(parents[i]);
    }
    return seen;
  }

  // REPOSITORY: same commit shape is already guaranteed by dag-match; here we ask
  // whether each matched pair touched the same files. A target commit with no twin
  // is NOT reported - that is "still missing", which the ghosting layer already says.
  function checkRepository(actual, target, orderedParents) {
    var a = bySignature(actual, orderedParents);
    var t = bySignature(target, orderedParents);
    var bad = null;
    t.forEach(function (want, sig) {
      if (bad) return;
      var got = a.get(sig);
      if (!got) return;
      if (!same(got.paths, want.paths)) {
        bad = {
          ok: false,
          area: "repository",
          reason: 'the commit "' + (want.message || "") + '" should contain ' +
            list(want.paths) + ", but yours contains " + list(got.paths),
        };
      }
    });
    return bad;
  }

  // A noun may be empty ("you have staged X, but the card asks for nothing"),
  // so the parts are joined rather than concatenated with fixed spaces.
  function phrase(noun, paths) {
    return noun ? noun + " " + list(paths) : list(paths);
  }

  function checkArea(area, gotPaths, wantPaths, nounGot, nounWant) {
    if (same(gotPaths, wantPaths)) return null;
    return {
      ok: false,
      area: area,
      reason: phrase(nounGot, gotPaths) + ", but the card asks for " + phrase(nounWant, wantPaths),
    };
  }

  function stateMatch(input, opts) {
    var actual = input && input.actual;
    var target = input && input.target;
    var o = opts || {};
    var areas = o.areas || ALL_AREAS;
    var expected = o.expected || null;
    if (!actual) return { ok: false, area: null, reason: "no repository to check" };

    var wantIndex = expected && expected.index ? expected.index : keys(target && target.index);
    var wantTree = expected && expected.worktree ? expected.worktree : keys(target && target.worktree);

    var checks = [];
    if (areas.indexOf("repository") >= 0 && target && !expected) {
      checks.push(function () { return checkRepository(actual, target, o.orderedParents); });
    }
    if (areas.indexOf("staging") >= 0) {
      checks.push(function () {
        return checkArea("staging", keys(actual.index), wantIndex, "you have staged", "");
      });
    }
    if (areas.indexOf("worktree") >= 0) {
      checks.push(function () {
        return checkArea("worktree", keys(actual.worktree), wantTree, "your working tree has", "");
      });
    }

    for (var i = 0; i < checks.length; i++) {
      var bad = checks[i]();
      if (bad) return bad;
    }
    return { ok: true, area: null, reason: "" };
  }

  return { stateMatch: stateMatch, AREAS: ALL_AREAS };
});
