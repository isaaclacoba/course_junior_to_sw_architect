/*
 * kernel/grading/dag-match.js - the shared git-DAG structural grading policy.
 *
 * A DOM-free grading capability, narrowly scoped, and the single source of truth
 * for how a git-track lesson is graded on structure. Like output-match.js it is
 * consumed by both the browser engine (git-engine.js) and the Node verifier
 * (tools/verify-lesson.mjs), so the two cannot drift apart. No DOM, no CodeLab,
 * no dotnet: it compares two RepoState-like objects, duck-typed - it does NOT
 * import the TypeScript git-model.
 *
 * Equivalence relation (see docs/architecture/git-track.md, Contract 5):
 *   Commits are matched by STRUCTURE + MESSAGE, IGNORING id/hash - so a
 *   cherry-pick or rebase copy of the same work matches the original. Each commit
 *   gets a canonical signature computed bottom-up:
 *       sig(c) = JSON([ c.message, parentSigs ])
 *   where parentSigs are the signatures of c.parents. A root (no parents) signs
 *   from its message alone. For a merge (2+ parents) the parent signatures are
 *   ORDER-INSENSITIVE by default (sorted before combining), so the ^1/^2 order
 *   does not matter; pass opts.orderedParents to keep parent order and make that
 *   distinction graded. The JSON string is equal iff the two subgraphs are
 *   structurally + message equal, so it doubles as the comparison key.
 *
 *   A repo MATCHES the target iff:
 *     1. every ref NAME in target is present in actual and points to a commit
 *        whose signature equals the target ref's commit signature;
 *     2. there are no missing and no extra ref names;
 *     3. HEAD matches - same kind, same branch name if attached, or a
 *        same-signature commit if detached;
 *     4. when opts.requireSameCommitSet (default true), the SET of commit
 *        signatures reachable from all refs (+ a detached HEAD) is identical,
 *        so a stray extra commit or a missing one fails.
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelDagMatch (before git-engine).
 *   - node:    module.exports (require in tests, import in the verifier).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelDagMatch = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  // Build a memoized signer over a commits Map. Returns hash -> canonical
  // signature string, or null when the history is malformed (a parent hash is
  // absent) or - defensively, a DAG cannot - cyclic.
  function makeSigner(commits, orderedParents) {
    var memo = new Map();
    function sign(hash, visiting) {
      if (memo.has(hash)) return memo.get(hash);
      var c = commits && commits.get ? commits.get(hash) : undefined;
      if (!c) return null; // missing commit -> malformed history
      if (visiting.has(hash)) return null; // cycle guard (should not happen in a DAG)
      visiting.add(hash);
      var parents = Array.isArray(c.parents) ? c.parents : [];
      var parentSigs = [];
      for (var i = 0; i < parents.length; i++) {
        var ps = sign(parents[i], visiting);
        if (ps === null) {
          visiting.delete(hash);
          return null;
        }
        parentSigs.push(ps);
      }
      if (parents.length >= 2 && !orderedParents) {
        parentSigs = parentSigs.slice().sort();
      }
      var out = JSON.stringify([c.message == null ? "" : String(c.message), parentSigs]);
      visiting.delete(hash);
      memo.set(hash, out);
      return out;
    }
    return function (hash) {
      return sign(hash, new Set());
    };
  }

  // Split a ref name into a { kind, short } for readable reasons. Fully-qualified
  // refs (refs/heads/*, refs/tags/*) are recognised; a bare name is a branch.
  function refLabel(name) {
    if (/^refs\/tags\//.test(name)) return { kind: "tag", short: name.replace(/^refs\/tags\//, "") };
    if (/^refs\/heads\//.test(name)) return { kind: "branch", short: name.replace(/^refs\/heads\//, "") };
    return { kind: "branch", short: name };
  }

  // Collect the set of commit signatures reachable from every ref plus a detached
  // HEAD. Returns a Set of signatures, or null if the history is malformed.
  function reachableSigs(state, signer) {
    var seen = new Set();
    var sigs = new Set();
    var stack = [];
    if (state.refs && state.refs.forEach) {
      state.refs.forEach(function (h) { stack.push(h); });
    }
    if (state.head && state.head.kind === "detached") stack.push(state.head.commit);
    while (stack.length) {
      var h = stack.pop();
      if (h == null) continue;
      if (seen.has(h)) continue;
      seen.add(h);
      var c = state.commits && state.commits.get ? state.commits.get(h) : undefined;
      if (!c) return null;
      var s = signer(h);
      if (s === null) return null;
      sigs.add(s);
      var parents = Array.isArray(c.parents) ? c.parents : [];
      for (var i = 0; i < parents.length; i++) stack.push(parents[i]);
    }
    return sigs;
  }

  function isRepoState(s) {
    return s && s.commits && s.commits.get && s.refs && s.refs.forEach && s.head;
  }

  // Grade a RepoState against a target RepoState. Both are duck-typed git-model
  // RepoState objects with real Maps. Returns { ok, reason } - reason is a
  // human-readable message on the first mismatch, or "match" on success.
  function dagMatch(actual, target, opts) {
    opts = opts || {};
    var orderedParents = !!opts.orderedParents;
    var requireSameCommitSet = opts.requireSameCommitSet !== false; // default true

    if (!isRepoState(actual) || !isRepoState(target)) {
      return { ok: false, reason: "malformed history" };
    }

    var signActual = makeSigner(actual.commits, orderedParents);
    var signTarget = makeSigner(target.commits, orderedParents);

    // (1)+(2) refs: matched by name, no missing, no extra.
    var missing = null;
    target.refs.forEach(function (h, name) {
      if (missing) return;
      if (!actual.refs.has(name)) {
        var l = refLabel(name);
        missing = "missing " + l.kind + " '" + l.short + "'";
      }
    });
    if (missing) return { ok: false, reason: missing };

    var extra = null;
    actual.refs.forEach(function (h, name) {
      if (extra) return;
      if (!target.refs.has(name)) {
        var l = refLabel(name);
        extra = "an extra " + l.kind + " '" + l.short + "' is present";
      }
    });
    if (extra) return { ok: false, reason: extra };

    // (1) each shared ref points at a structurally-equal commit.
    var refReason = null;
    var refIter = target.refs.forEach(function (h, name) {
      if (refReason) return;
      var ts = signTarget(h);
      var as = signActual(actual.refs.get(name));
      if (ts === null || as === null) {
        refReason = "malformed history";
        return;
      }
      if (ts !== as) {
        var l = refLabel(name);
        refReason = l.kind + " '" + l.short + "' points at the wrong commit";
      }
    });
    void refIter;
    if (refReason) return { ok: false, reason: refReason };

    // (3) HEAD: same kind; same branch name if attached, same-signature commit if detached.
    var th = target.head;
    var ah = actual.head;
    if (th.kind === "branch") {
      if (ah.kind !== "branch") {
        return { ok: false, reason: "HEAD is detached but should be on '" + refLabel(th.name).short + "'" };
      }
      if (ah.name !== th.name) {
        return {
          ok: false,
          reason: "HEAD is on '" + refLabel(ah.name).short + "' but should be on '" + refLabel(th.name).short + "'"
        };
      }
    } else if (th.kind === "detached") {
      if (ah.kind !== "detached") {
        return { ok: false, reason: "HEAD is on '" + refLabel(ah.name).short + "' but should be detached" };
      }
      var thSig = signTarget(th.commit);
      var ahSig = signActual(ah.commit);
      if (thSig === null || ahSig === null) return { ok: false, reason: "malformed history" };
      if (thSig !== ahSig) {
        return { ok: false, reason: "HEAD is detached at the wrong commit" };
      }
    }

    // (4) the reachable commit-signature sets must be identical.
    if (requireSameCommitSet) {
      var targetSet = reachableSigs(target, signTarget);
      var actualSet = reachableSigs(actual, signActual);
      if (targetSet === null || actualSet === null) return { ok: false, reason: "malformed history" };
      var extraCommit = null;
      actualSet.forEach(function (s) {
        if (!extraCommit && !targetSet.has(s)) extraCommit = "an extra commit is present";
      });
      if (extraCommit) return { ok: false, reason: extraCommit };
      var missingCommit = null;
      targetSet.forEach(function (s) {
        if (!missingCommit && !actualSet.has(s)) missingCommit = "a commit is missing";
      });
      if (missingCommit) return { ok: false, reason: missingCommit };
    }

    return { ok: true, reason: "match" };
  }

  return {
    makeSigner: makeSigner,
    refLabel: refLabel,
    reachableSigs: reachableSigs,
    dagMatch: dagMatch
  };
});
