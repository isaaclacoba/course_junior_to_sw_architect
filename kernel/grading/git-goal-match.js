/*
 * kernel/grading/git-goal-match.js - the "does the repository have this yet?"
 * policy behind the live goal tracker on a git lesson.
 *
 * The C# sibling of this file is structure-match.js, and the deal is the same:
 * DOM-free, dependency-free, one source of truth so the browser tracker and the
 * Node validator cannot drift. It answers a factual question about a RepoState -
 * is there a branch called `feature`, does `v1` pin the release commit, is
 * `dog.txt` staged - and it never runs a command and never grades.
 *
 * WHY IT IS NOT GRADING. Nothing here awards XP. The card still passes on
 * git-progress + state-match reaching the authored target. This only drives the
 * checklist that says where a learner is while they type, which on the git track
 * was missing entirely: the graph showed a ghost, and the goal list sat inert.
 *
 * A gate is DECLARATIVE - a small object, not a function - so a lesson's data
 * file stays data and the validator can assert every gate against the authored
 * solution. A gate that could never light up is then a build failure rather than
 * a checklist item that stays grey forever.
 *
 * Gate fields, all optional, all ANDed:
 *   ran      "git status"      the learner has run a command starting with this
 *   branch   "feature"         a branch by this name exists
 *   tag      "v2"              a tag by this name exists
 *   at       "add dog"         ...and it points at the commit with this message
 *                              ("HEAD" means the commit the learner is standing on)
 *   head     "feature"         HEAD is attached to this branch
 *   detached true              HEAD is detached (false asserts it is attached)
 *   commit   "add dog"         a reachable commit carries this message
 *   on       "feature"         ...and it is reachable from this branch
 *   parents  2                 ...and it has exactly this many parents
 *   paths    ["cat.txt"]       ...and it holds exactly these files
 *   staged   ["cat.txt"]       the index holds exactly these paths ([] = nothing)
 *   worktree ["draft.txt"]     the working tree holds exactly these paths
 *   absent   { branch: "old" } NOTHING matching this inner gate is there
 *
 * WHY `ran` EXISTS. Half the goals on this track are reads - "run `git status`",
 * "read `git log --oneline`" - and a read changes no state at all, so a purely
 * factual tracker would sit grey while the learner does exactly what was asked.
 * `ran` answers "has this been run", never "and the answer was understood", the
 * same honest half-measure `writes` is on the C# side. It is matched on the
 * command's leading words, so `git log --oneline --graph` satisfies `git log`.
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelGitGoalMatch.
 *   - node:    module.exports (require in tests and in tools/).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelGitGoalMatch = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  var GATE_FIELDS = [
    "ran", "branch", "tag", "at", "head", "detached",
    "commit", "on", "parents", "paths", "staged", "worktree", "absent"
  ];

  // Gate fields that describe a MOMENT, not a lasting fact. The index and the
  // working tree are both emptied by the very next command a learner types -
  // `git commit` clears the index it just checked - so a goal built on one of
  // them is true for a single step and false ever after. The tracker latches
  // those (see `latches` below and goal-tracker.js); everything else is a
  // durable property of the repository and is read live.
  var TRANSIENT_FIELDS = ["ran", "staged", "worktree"];

  function squeeze(text) { return String(text == null ? "" : text).replace(/\s+/g, " ").trim(); }

  function keysOf(mapLike) {
    if (!mapLike) return [];
    // Map.keys() is an ITERATOR, not array-like: slice on it yields [] and every
    // comparison would silently pass.
    if (typeof mapLike.keys === "function") return Array.from(mapLike.keys());
    return Object.keys(mapLike);
  }
  function sorted(list) { return (list || []).slice().sort(); }
  function sameSet(a, b) { return JSON.stringify(sorted(a)) === JSON.stringify(sorted(b)); }

  function refName(state, name) {
    if (!state || !state.refs || !state.refs.get) return null;
    var tries = ["refs/heads/" + name, "refs/tags/" + name, name];
    for (var i = 0; i < tries.length; i++) {
      var id = state.refs.get(tries[i]);
      if (id !== undefined) return id;
    }
    return null;
  }
  function branchId(state, name) {
    return state && state.refs && state.refs.get ? state.refs.get("refs/heads/" + name) : undefined;
  }
  function tagId(state, name) {
    return state && state.refs && state.refs.get ? state.refs.get("refs/tags/" + name) : undefined;
  }

  // The commit the learner is standing on, attached or not.
  function headCommit(state) {
    var h = state && state.head;
    if (!h) return null;
    if (h.kind === "detached") return h.commit;
    var id = state.refs && state.refs.get ? state.refs.get(h.name) : undefined;
    return id === undefined ? null : id;
  }
  function headBranch(state) {
    var h = state && state.head;
    if (!h || h.kind !== "branch") return null;
    return String(h.name).replace(/^refs\/heads\//, "");
  }

  // Commit ids walkable from one starting point, parents included.
  function reachableFrom(state, startId) {
    var seen = new Set();
    var stack = [startId];
    while (stack.length) {
      var id = stack.pop();
      if (id == null || seen.has(id)) continue;
      seen.add(id);
      var c = state.commits && state.commits.get ? state.commits.get(id) : null;
      var parents = c && Array.isArray(c.parents) ? c.parents : [];
      for (var i = 0; i < parents.length; i++) stack.push(parents[i]);
    }
    return seen;
  }

  // Everything the repository can still see: every ref plus a detached HEAD. A
  // commit outside this is dangling - an amend leaves one behind - and must not
  // count, or a learner passes on work they have just thrown away.
  function reachable(state) {
    var stack = [];
    if (state && state.refs && state.refs.forEach) state.refs.forEach(function (id) { stack.push(id); });
    var h = headCommit(state);
    if (h != null) stack.push(h);
    var seen = new Set();
    while (stack.length) {
      var id = stack.pop();
      if (id == null || seen.has(id)) continue;
      seen.add(id);
      var c = state.commits && state.commits.get ? state.commits.get(id) : null;
      var parents = c && Array.isArray(c.parents) ? c.parents : [];
      for (var i = 0; i < parents.length; i++) stack.push(parents[i]);
    }
    return seen;
  }

  // Commits carrying this message, reachable only. A message is matched exactly
  // after whitespace is squeezed - a commit message IS the identity on this
  // track, and a loose match would let "add dog" tick on "add dogs".
  function commitsWithMessage(state, message) {
    var want = squeeze(message);
    var out = [];
    var live = reachable(state);
    if (!state || !state.commits || !state.commits.forEach) return out;
    state.commits.forEach(function (c, id) {
      if (!live.has(id)) return;
      if (squeeze(c && c.message) === want) out.push(id);
    });
    return out;
  }

  // What `at` names: a commit message, or HEAD. Returns the commit id or null.
  function anchorId(state, at) {
    if (at == null) return null;
    var text = String(at);
    if (text === "HEAD") return headCommit(state);
    var hits = commitsWithMessage(state, text);
    return hits.length ? hits[0] : null;
  }

  // Has the learner run this? Matched on leading words, so a card asking for
  // `git log` is happy with `git log --oneline`, and `git commit -m "add cat"`
  // needs the message typed exactly because the card asked for it exactly.
  function hasRun(ranList, want) {
    var needle = squeeze(want);
    if (!needle) return false;
    var list = Array.isArray(ranList) ? ranList : [];
    for (var i = 0; i < list.length; i++) {
      var line = squeeze(list[i]);
      if (line === needle) return true;
      if (line.indexOf(needle + " ") === 0) return true;
    }
    return false;
  }

  /**
   * One gate against one repository. Returns a boolean and never throws: a
   * malformed gate is unmet, not an exception in the middle of an exercise.
   *
   * `world` is { state, ran } - the RepoState and the commands run so far.
   */
  function meets(gate, world) {
    if (!gate || typeof gate !== "object") return false;
    var state = (world && world.state) || null;
    var ran = (world && world.ran) || [];

    if (gate.absent) {
      // "Nothing like this is there" - the gate that proves an undo really
      // happened. A malformed inner gate is treated as present, so the outer
      // gate stays unmet rather than passing on a typo.
      if (meets(gate.absent, world)) return false;
    }
    if (gate.ran) {
      var wanted = Array.isArray(gate.ran) ? gate.ran : [gate.ran];
      for (var i = 0; i < wanted.length; i++) {
        if (!hasRun(ran, wanted[i])) return false;
      }
    }

    // Everything below reads the repository, so with no repository there is
    // nothing to be true about. An `absent`/`ran`-only gate has already answered.
    var repoFields = ["branch", "tag", "at", "head", "detached", "commit", "on",
      "parents", "paths", "staged", "worktree"];
    var touchesRepo = false;
    for (var f = 0; f < repoFields.length; f++) {
      if (gate[repoFields[f]] !== undefined) { touchesRepo = true; break; }
    }
    if (!touchesRepo) return true;
    if (!state) return false;

    var anchor = gate.at !== undefined ? anchorId(state, gate.at) : undefined;
    if (gate.at !== undefined && anchor == null) return false;

    if (gate.branch !== undefined) {
      var bid = branchId(state, gate.branch);
      if (bid === undefined) return false;
      if (anchor !== undefined && bid !== anchor) return false;
    }
    if (gate.tag !== undefined) {
      var tid = tagId(state, gate.tag);
      if (tid === undefined) return false;
      if (anchor !== undefined && tid !== anchor) return false;
    }
    if (gate.head !== undefined) {
      if (headBranch(state) !== String(gate.head)) return false;
    }
    if (gate.detached !== undefined) {
      var isDetached = !!(state.head && state.head.kind === "detached");
      if (isDetached !== !!gate.detached) return false;
    }
    if (gate.commit !== undefined) {
      var hits = commitsWithMessage(state, gate.commit);
      if (!hits.length) return false;
      // Every extra condition is about THE commit, so a commit that satisfies
      // all of them together has to exist - not one commit per condition.
      var ok = false;
      for (var h = 0; h < hits.length; h++) {
        if (commitMeets(state, hits[h], gate, anchor)) { ok = true; break; }
      }
      if (!ok) return false;
    } else if (gate.on !== undefined || gate.parents !== undefined || gate.paths !== undefined) {
      // `on` / `parents` / `paths` describe a commit, so with no `commit` named
      // they describe the one the learner is standing on.
      var hid = headCommit(state);
      if (hid == null || !commitMeets(state, hid, gate, anchor)) return false;
    }
    if (gate.staged !== undefined) {
      if (!sameSet(keysOf(state.index), gate.staged)) return false;
    }
    if (gate.worktree !== undefined) {
      if (!sameSet(keysOf(state.worktree), gate.worktree)) return false;
    }
    // A gate that only says `at` (no branch, no tag, no commit) is about where
    // the learner is standing.
    if (gate.at !== undefined && gate.branch === undefined && gate.tag === undefined &&
        gate.commit === undefined) {
      if (headCommit(state) !== anchor) return false;
    }
    return true;
  }

  // The per-commit half of a gate, so `commit` can pick the twin that satisfies
  // every condition rather than any twin that satisfies one.
  function commitMeets(state, id, gate, anchor) {
    var c = state.commits && state.commits.get ? state.commits.get(id) : null;
    if (!c) return false;
    if (gate.parents !== undefined) {
      var parents = Array.isArray(c.parents) ? c.parents : [];
      if (parents.length !== Number(gate.parents)) return false;
    }
    if (gate.paths !== undefined) {
      if (!sameSet(c.paths, gate.paths)) return false;
    }
    if (gate.on !== undefined) {
      var tip = branchId(state, gate.on);
      if (tip === undefined) return false;
      if (!reachableFrom(state, tip).has(id)) return false;
    }
    if (anchor !== undefined && gate.branch === undefined && gate.tag === undefined) {
      if (id !== anchor) return false;
    }
    return true;
  }

  // A row is either a plain label (display only) or its own small gate carrying
  // the label in `row`. Splitting the gate fields out here means a row and a box
  // are checked by exactly the same code.
  function rowGate(row) {
    if (!row || typeof row !== "object") return null;
    var out = null;
    for (var i = 0; i < GATE_FIELDS.length; i++) {
      var key = GATE_FIELDS[i];
      if (row[key] === undefined) continue;
      out = out || {};
      out[key] = row[key];
    }
    return out;
  }

  // The text a row shows. One place, so the renderer and the validator cannot
  // drift on what a learner is being told.
  function rowLabel(row) {
    if (row && typeof row === "object") return String(row.row || "");
    return String(row == null ? "" : row);
  }

  /**
   * Per-ROW verdicts for one box: [headerOk, row1Ok, ...].
   *
   * Row 0 is the header (the box's own gate); rows 1..n are its facts. A row
   * cannot be met while the header is unmet - there is no thing for it to be
   * true about - which is what makes a box read as steps rather than one jump.
   * A row with no gate of its own inherits the header, because it is a label,
   * not a claim.
   */
  function rows(gate, code, world) {
    var list = !code ? [] : (Array.isArray(code) ? code : [code]);
    if (!list.length) return [];
    var headerOk = gate === null || gate === undefined ? false : meets(gate, world);
    var out = [headerOk];
    for (var i = 1; i < list.length; i++) {
      var rg = rowGate(list[i]);
      out.push(headerOk && (rg ? meets(rg, world) : true));
    }
    return out;
  }

  /**
   * One verdict per goal, in authored order, so a caller can zip it straight
   * onto the localized goal list.
   *
   * THREE verdicts, not two. A goal with no gate at all is null - UNTRACKED -
   * and the widget resolves it against a passing run. Collapsing it to false
   * would give a learner a tick that can never turn green.
   *
   * A box is green only when its gate AND every row under it is green. This is
   * the one function everything asking "is this goal done?" must come through;
   * a caller reading a lower layer would pass while the panel says otherwise.
   */
  function verdicts(goals, world) {
    var list = Array.isArray(goals) ? goals : [];
    return list.map(function (g) {
      var gate = g && g.gate !== undefined ? g.gate : undefined;
      if (gate === null || gate === undefined) return null;
      if (!meets(gate, world)) return false;
      var verd = rows(gate, g && g.code, world);
      for (var k = 0; k < verd.length; k++) {
        if (verd[k] !== true) return false;
      }
      return true;
    });
  }

  // Describe a gate for a validator's failure message. Not shown to learners.
  function describe(gate) {
    if (gate === null || gate === undefined) return "(no factual test)";
    if (typeof gate !== "object") return "(not a gate)";
    var parts = [];
    if (gate.ran) parts.push("after running " + [].concat(gate.ran).join(" + "));
    if (gate.branch) parts.push("branch " + gate.branch);
    if (gate.tag) parts.push("tag " + gate.tag);
    if (gate.commit) parts.push('commit "' + gate.commit + '"');
    if (gate.at) parts.push("at " + (gate.at === "HEAD" ? "HEAD" : '"' + gate.at + '"'));
    if (gate.on) parts.push("on " + gate.on);
    if (gate.head) parts.push("HEAD on " + gate.head);
    if (gate.detached !== undefined) parts.push(gate.detached ? "HEAD detached" : "HEAD attached");
    if (gate.parents !== undefined) parts.push(gate.parents + " parent(s)");
    if (gate.paths) parts.push("holding " + [].concat(gate.paths).join(", "));
    if (gate.staged) parts.push("staged " + ([].concat(gate.staged).join(", ") || "nothing"));
    if (gate.worktree) parts.push("working tree " + ([].concat(gate.worktree).join(", ") || "nothing"));
    if (gate.absent) parts.push("without [" + describe(gate.absent) + "]");
    return parts.length ? parts.join(" ") : "(empty gate)";
  }

  /**
   * Does anything in this goal - its own gate or any row's mini-gate - rest on
   * a transient fact? If so the whole goal latches, because a box cannot honestly
   * read green over a row that has gone grey again.
   */
  function latches(goal) {
    if (!goal) return false;
    var gate = goal.gate !== undefined ? goal.gate : goal;
    if (transient(gate)) return true;
    var code = goal.code;
    if (!code) return false;
    var list = Array.isArray(code) ? code : [code];
    for (var i = 0; i < list.length; i++) {
      if (transient(rowGate(list[i]))) return true;
    }
    return false;
  }

  function transient(gate) {
    if (!gate || typeof gate !== "object") return false;
    for (var i = 0; i < TRANSIENT_FIELDS.length; i++) {
      if (gate[TRANSIENT_FIELDS[i]] !== undefined) return true;
    }
    // `absent` wraps an inner gate, and an absence of something transient is
    // just as momentary as its presence.
    return gate.absent ? transient(gate.absent) : false;
  }

  return {
    meets: meets, rows: rows, verdicts: verdicts, describe: describe,
    rowLabel: rowLabel, rowGate: rowGate, hasRun: hasRun, latches: latches,
    GATE_FIELDS: GATE_FIELDS, TRANSIENT_FIELDS: TRANSIENT_FIELDS,
  };
});
