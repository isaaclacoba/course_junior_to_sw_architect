/*
 * kernel/engine/git-progress.js - "how far along is the learner" for the git track.
 *
 * A DOM-free companion to kernel/grading/dag-match.js. dag-match answers one
 * question - does the learner's repo match the target - and that stays its job.
 * This module answers the three questions the PRACTICAL page needs on top of it
 * (docs/architecture/git-track.md, "Practical page UX", owner-ratified 2026-08-04):
 *
 *   what is achieved  -> `solved`
 *   what is missing   -> `ghost`  (the NEXT step only, by default)
 *   what is off-plan  -> `diverged`
 *
 * plus the thing that makes the ratified single-canvas visual possible:
 *
 *   `union` - ONE RepoState holding the learner's commits AND the ghosted target
 *   commits, so the view lays out once. A ghost can then never land on a
 *   different row than the solid commit it will become.
 *
 * Structural, never by hash. Two commits are "the same commit" when they have
 * the same dag-match signature - message + parent signatures, merge parents
 * order-insensitive by default. Ids are display-only, exactly as ratified, so a
 * learner whose repo generated different hashes still passes.
 *
 * Pure and deterministic: no DOM, no CodeLab, no mutation of the inputs.
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelGitProgress. It needs
 *              window.KernelDagMatch, resolved LAZILY on the first call, so the
 *              two <script> tags may appear in either order.
 *   - node:    module.exports (require in tests, import in the verifier).
 */
(function (root, factory) {
  "use strict";
  var isNode = typeof module === "object" && module.exports;
  var api = factory(function () {
    return isNode ? require("../grading/dag-match.js") : root && root.KernelDagMatch;
  });
  if (isNode) {
    module.exports = api;
  } else if (root) {
    root.KernelGitProgress = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function (resolveDagMatch) {
  "use strict";

  var DAG = null;
  function dag() {
    if (!DAG) DAG = resolveDagMatch();
    if (!DAG || !DAG.makeSigner) {
      throw new Error("KernelGitProgress needs KernelDagMatch (kernel/grading/dag-match.js) loaded first");
    }
    return DAG;
  }

  function isRepoState(s) {
    return !!(s && s.commits && s.commits.get && s.refs && s.refs.forEach && s.head);
  }

  // The three-area end-state grader (kernel/grading/state-match.js). Resolved the same
  // lazy way as dag-match, and OPTIONAL: if a page has not loaded it, grading falls back
  // to the commit shape alone rather than throwing.
  var STATE = null;
  function stateMatcher() {
    if (STATE) return STATE;
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelStateMatch) { STATE = g.KernelStateMatch; return STATE; }
    if (typeof require === "function") {
      try { STATE = require("../grading/state-match.js"); } catch (e) { STATE = null; }
    }
    return STATE;
  }

  // Commit ids reachable from every ref plus a detached HEAD, returned in the
  // commits Map's insertion order so every downstream choice is deterministic.
  function reachableIds(state) {
    var seen = new Set();
    var stack = [];
    state.refs.forEach(function (h) { stack.push(h); });
    if (state.head && state.head.kind === "detached") stack.push(state.head.commit);
    while (stack.length) {
      var h = stack.pop();
      if (h == null || seen.has(h)) continue;
      var c = state.commits.get(h);
      if (!c) continue; // malformed history - dag-match reports it
      seen.add(h);
      var parents = Array.isArray(c.parents) ? c.parents : [];
      for (var i = 0; i < parents.length; i++) stack.push(parents[i]);
    }
    var out = [];
    state.commits.forEach(function (c, id) { if (seen.has(id)) out.push(id); });
    return out;
  }

  // sig -> first id carrying it (insertion order), plus the set of signatures.
  function sigIndex(ids, signer) {
    var set = new Set();
    var idBySig = new Map();
    for (var i = 0; i < ids.length; i++) {
      var s = signer(ids[i]);
      if (s === null) continue;
      set.add(s);
      if (!idBySig.has(s)) idBySig.set(s, ids[i]);
    }
    return { set: set, idBySig: idBySig };
  }

  // Order the missing target commits parents-first. The first pass emits only
  // the commits whose parents the learner ALREADY has, in insertion order, so
  // element 0 is always the step that can be taken right now - the "next step".
  // Later passes unlock the commits behind it. Anything left (a malformed
  // target) keeps its insertion order rather than being dropped.
  function orderMissing(missingIds, target, presentSigs, signT) {
    var remaining = missingIds.slice();
    var emitted = [];
    var emittedSet = new Set();
    var moved = true;
    while (remaining.length && moved) {
      moved = false;
      var next = [];
      for (var i = 0; i < remaining.length; i++) {
        var id = remaining[i];
        var c = target.commits.get(id);
        var parents = (c && Array.isArray(c.parents)) ? c.parents : [];
        var ready = true;
        for (var j = 0; j < parents.length; j++) {
          var p = parents[j];
          if (emittedSet.has(p)) continue;
          var ps = signT(p);
          if (ps !== null && presentSigs.has(ps)) continue;
          ready = false;
          break;
        }
        if (ready) {
          emitted.push(id);
          emittedSet.add(id);
          moved = true;
        } else {
          next.push(id);
        }
      }
      remaining = next;
    }
    return emitted.concat(remaining);
  }

  // Hops from `fromId` back to `wantedId` along parent edges, or -1.
  function distanceTo(commits, fromId, wantedId) {
    var seen = new Set();
    var frontier = [fromId];
    var d = 0;
    while (frontier.length) {
      var next = [];
      for (var i = 0; i < frontier.length; i++) {
        var h = frontier[i];
        if (h == null || seen.has(h)) continue;
        seen.add(h);
        if (h === wantedId) return d;
        var c = commits.get(h);
        if (!c) continue;
        var parents = Array.isArray(c.parents) ? c.parents : [];
        for (var j = 0; j < parents.length; j++) next.push(parents[j]);
      }
      frontier = next;
      d++;
    }
    return -1;
  }

  // The branch a missing commit belongs to: the closest branch tip that can
  // reach it, ties broken by ref insertion order. Closest wins so a commit that
  // only lands on main after a merge is still named on its own branch.
  function branchFor(target, commitId) {
    var best = null;
    target.refs.forEach(function (tip, name) {
      if (dag().refLabel(name).kind === "tag") return;
      var d = distanceTo(target.commits, tip, commitId);
      if (d < 0) return;
      if (!best || d < best.d) best = { d: d, name: name };
    });
    return best ? dag().refLabel(best.name).short : null;
  }

  function cloneCommit(c, id, parents) {
    return {
      id: id,
      parents: parents,
      message: c.message,
      paths: Array.isArray(c.paths) ? c.paths.slice() : []
    };
  }

  // Ghost ids come from the target, whose hash space is independent of the
  // learner's; a clash would silently overwrite a real commit, so rename.
  function freeId(taken, id) {
    var out = String(id);
    var n = 0;
    while (taken.has(out)) {
      n++;
      out = "ghost-" + n + "-" + id;
    }
    return out;
  }

  function quote(s) {
    return '"' + String(s == null ? "" : s) + '"';
  }

  // Factual, command-free English. The page localises its own chrome; this
  // string never tells the learner which command to type.
  function describe(step) {
    if (!step) return "the target shape is reached";
    switch (step.kind) {
      case "malformed":
        return "malformed history";
      case "ref":
        return step.op === "create"
          ? step.refKind + " '" + step.short + "' does not exist yet"
          : step.refKind + " '" + step.short + "' is not at the expected commit";
      case "extraRef":
        return "an extra " + step.refKind + " '" + step.short + "' is present";
      case "commit":
        return step.onBranch
          ? "the commit " + quote(step.message) + " is missing on branch '" + step.onBranch + "'"
          : "the commit " + quote(step.message) + " is missing";
      case "head":
        return step.detached
          ? (step.wrongCommit
            ? "HEAD is detached at the wrong commit"
            : "HEAD should be detached")
          : (step.onBranch
            ? "HEAD is on '" + step.onBranch + "' but should be on '" + step.short + "'"
            : "HEAD should be on '" + step.short + "'");
      case "diverged":
        return step.ids.length === 1
          ? "one commit is not part of this exercise"
          : step.ids.length + " commits are not part of this exercise";
      default:
        return "the target shape is reached";
    }
  }

  function empty(reason, step) {
    return {
      solved: false,
      union: { commits: new Map(), refs: new Map(), head: { kind: "branch", name: "refs/heads/main" }, index: new Map(), worktree: new Map() },
      ghost: [],
      diverged: [],
      nextStep: step,
      reason: reason
    };
  }

  /**
   * progress({ actual, target }, opts) -> { solved, union, ghost, diverged, nextStep, reason }
   *
   * opts (also accepted on the first argument, for callers that carry one bag):
   *   all            - ghost EVERY missing commit, not just the next step. This
   *                    is what the "Show whole target" button passes.
   *   orderedParents - forwarded to dag-match: grade merge parent order too.
   */
  function progress(input, opts) {
    input = input || {};
    opts = opts || {};
    var actual = input.actual;
    var target = input.target;
    var all = !!(opts.all || input.all);
    var orderedParents = !!(opts.orderedParents || input.orderedParents);

    if (!isRepoState(actual) || !isRepoState(target)) {
      return empty("malformed history", { kind: "malformed" });
    }

    var D = dag();
    var signA = D.makeSigner(actual.commits, orderedParents);
    var signT = D.makeSigner(target.commits, orderedParents);

    var actualIds = reachableIds(actual);
    var targetIds = reachableIds(target);
    var A = sigIndex(actualIds, signA);
    var T = sigIndex(targetIds, signT);

    // Off-plan: reachable learner commits the target does not contain. Only
    // REACHABLE ones, so a commit orphaned by `reset --hard` - the learner
    // undoing a mistake - does not keep the card locked.
    var diverged = actualIds.filter(function (id) {
      var s = signA(id);
      return s !== null && !T.set.has(s);
    });

    var missing = targetIds.filter(function (id) {
      var s = signT(id);
      return s !== null && !A.set.has(s);
    });
    var ordered = orderMissing(missing, target, A.set, signT);
    var ghostTargetIds = all ? ordered : ordered.slice(0, 1);

    // --- union: one RepoState, one layout ------------------------------------
    // git-layout takes time (x) from the commits Map order and lanes (y) from
    // the PARENT EDGES - not from refs. So a ghost lands in its real lane iff
    // its parents point at the learner's own commit ids. That is the whole
    // remap below. Refs and HEAD stay exactly the learner's: a target-only ref
    // would draw a solid branch chip for a branch that does not exist yet, and
    // the contract only tags COMMITS as ghosted.
    var union = {
      commits: new Map(),
      refs: new Map(actual.refs),
      head: actual.head,
      index: actual.index instanceof Map ? new Map(actual.index) : new Map(),
      worktree: actual.worktree instanceof Map ? new Map(actual.worktree) : new Map()
    };
    if (actual.merge) union.merge = actual.merge;
    actual.commits.forEach(function (c, id) {
      union.commits.set(id, cloneCommit(c, id, Array.isArray(c.parents) ? c.parents.slice() : []));
    });

    var unionIdByTargetId = new Map();
    var ghost = [];
    for (var g = 0; g < ghostTargetIds.length; g++) {
      var tid = ghostTargetIds[g];
      var tc = target.commits.get(tid);
      if (!tc) continue;
      var parents = [];
      var tParents = Array.isArray(tc.parents) ? tc.parents : [];
      for (var p = 0; p < tParents.length; p++) {
        var tp = tParents[p];
        var sp = signT(tp);
        if (sp !== null && A.idBySig.has(sp)) parents.push(A.idBySig.get(sp));
        else if (unionIdByTargetId.has(tp)) parents.push(unionIdByTargetId.get(tp));
        // else: unresolvable (only possible on a malformed target) - drop the
        // edge rather than emit one pointing at a node the view does not have.
      }
      var uid = freeId(union.commits, tid);
      union.commits.set(uid, cloneCommit(tc, uid, parents));
      unionIdByTargetId.set(tid, uid);
      ghost.push(uid);
    }

    // --- next step ------------------------------------------------------------
    // Stable order: refs, then commits, then HEAD. Inside the refs stage an
    // ACTIONABLE ref (its target commit already exists in the learner's repo)
    // wins; a ref waiting on a commit that has not been made yet defers to the
    // commit stage, because that commit is the step the learner can take.
    var refIssues = [];
    var extraRefs = [];
    target.refs.forEach(function (tip, name) {
      var want = signT(tip);
      var l = D.refLabel(name);
      var have = actual.refs.has(name) ? signA(actual.refs.get(name)) : null;
      if (!actual.refs.has(name)) {
        refIssues.push({ kind: "ref", op: "create", name: name, refKind: l.kind, short: l.short, actionable: want !== null && A.set.has(want) });
      } else if (want !== have) {
        refIssues.push({ kind: "ref", op: "move", name: name, refKind: l.kind, short: l.short, actionable: want !== null && A.set.has(want) });
      }
    });
    actual.refs.forEach(function (tip, name) {
      if (target.refs.has(name)) return;
      var l = D.refLabel(name);
      extraRefs.push({ kind: "extraRef", name: name, refKind: l.kind, short: l.short });
    });

    var headStep = null;
    var th = target.head;
    var ah = actual.head;
    if (th.kind === "branch") {
      if (ah.kind !== "branch" || ah.name !== th.name) {
        headStep = {
          kind: "head",
          detached: false,
          name: th.name,
          short: D.refLabel(th.name).short,
          onBranch: ah.kind === "branch" ? D.refLabel(ah.name).short : null
        };
      }
    } else if (th.kind === "detached") {
      // Detached-vs-detached still has to be CHECKED, not assumed equal: the two
      // repos have different id spaces, so compare the same dag-match signature
      // dag-match compares. Skipping this let a card report "the target shape is
      // reached" while refusing to pass, because dag-match had failed on a HEAD
      // this function never looked at.
      var wrongCommit =
        ah.kind === "detached" && signT(th.commit) !== signA(ah.commit);
      if (ah.kind !== "detached" || wrongCommit) {
        headStep = {
          kind: "head",
          detached: true,
          wrongCommit: wrongCommit,
          name: null,
          short: null,
          onBranch: ah.kind === "branch" ? D.refLabel(ah.name).short : null
        };
      }
    }

    var nextStep = null;
    var actionable = refIssues.filter(function (r) { return r.actionable; });
    if (actionable.length) {
      nextStep = actionable[0];
    } else if (ordered.length) {
      var firstId = ordered[0];
      var fc = target.commits.get(firstId);
      nextStep = {
        kind: "commit",
        id: unionIdByTargetId.has(firstId) ? unionIdByTargetId.get(firstId) : String(firstId),
        message: fc ? fc.message : "",
        onBranch: branchFor(target, firstId)
      };
    } else if (refIssues.length) {
      nextStep = refIssues[0];
    } else if (extraRefs.length) {
      nextStep = extraRefs[0];
    } else if (headStep) {
      nextStep = headStep;
    } else if (diverged.length) {
      nextStep = { kind: "diverged", ids: diverged };
    }

    // "Solved" means the learner reached the target in ALL THREE areas the widget
    // shows - Repository, Staging, Working tree - not just the commit shape. The DAG
    // answers the shape; state-match answers the rest (which files a commit touched,
    // what is staged, what is modified). It runs AFTER identity is settled, so it can
    // never disturb ghosting or divergence.
    var shapeOk = D.dagMatch(actual, target, { orderedParents: orderedParents }).ok;
    var state = { ok: true, area: null, reason: "" };
    var S = stateMatcher();
    if (shapeOk && diverged.length === 0 && S) {
      state = S.stateMatch({ actual: actual, target: target }, {
        orderedParents: orderedParents,
        expected: opts && opts.expected,
        areas: opts && opts.areas
      });
    }
    var solved = shapeOk && diverged.length === 0 && state.ok;
    if (solved) nextStep = null;
    else if (shapeOk && diverged.length === 0 && !state.ok) {
      nextStep = { kind: "state", area: state.area, detail: state.reason };
    }

    return {
      solved: solved,
      union: union,
      ghost: ghost,
      diverged: diverged,
      nextStep: nextStep,
      reason: state.ok ? describe(nextStep) : state.reason
    };
  }

  return {
    progress: progress,
    reachableIds: reachableIds,
    describe: describe
  };
});
