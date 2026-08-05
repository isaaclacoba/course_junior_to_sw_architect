/**
 * kernel/grading/git-task.js - how to READ an authored git task.
 *
 * WHY THIS EXISTS
 * Two things consume a git card's authoring fields: the page (the git plugin)
 * and the gate (tools/lib/git-validate.mjs, which proves the authored solution
 * really reaches the authored target). They used to carry their own copies of
 * these accessors. Identical copies, but nothing held them together - and the
 * moment they drifted the gate would seed a different repository than the page
 * does, so it would green-light a card the learner cannot solve. That is the
 * exact silent pass git-validate.mjs was written to prevent, so the reading
 * rules live here once and both sides ask this module.
 *
 * Pure data in, plain arrays out: no DOM, no CodeLab, no git runtime.
 * UMD like its siblings: window.KernelGitTask in the browser, module.exports in
 * node.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelGitTask = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  // The authoring aliases a card may use for each field.
  function startOf(task) { return task && (task.start || task.commands); }
  function targetOf(task) { return task && (task.target || task.targetCommands); }
  function solutionOf(task) {
    var s = task && task.solution;
    if (Array.isArray(s)) return s;
    return s ? [s] : [];
  }

  // A card may hand a ready-made RepoState instead of a command list.
  function isRepoState(s) {
    return !!(s && s.commits && s.commits.get && s.refs && s.refs.forEach && s.head);
  }

  /** The paths one `git add` line names. A flag (`-A`) and a whole-folder
   *  pathspec (`.`, `*`) are not filenames, so they name nothing. */
  function addedPaths(line) {
    var words = String(line || "").trim().split(/\s+/);
    if (words[0] !== "git" || words[1] !== "add") return [];
    var out = [];
    for (var i = 2; i < words.length; i++) {
      var w = words[i];
      if (!w || w.charAt(0) === "-" || w === "." || w === "*") continue;
      out.push(w);
    }
    return out;
  }

  /** Which files the card's folder holds, so the working tree is not empty
   *  before the learner stages anything. Two sources, unioned:
   *   - inferred: any path the card itself adds. If a card says
   *     `git add cat.txt`, then cat.txt obviously exists.
   *   - declared `files`: the override, for a file the card SHOWS but never
   *     adds - the `notes.md` a learner is asked to leave out.
   *  Anything else still fails like real git, so `git add nope.txt` is an error. */
  function filesOf(task) {
    if (!task) return [];
    var seen = Object.create(null);
    var out = [];
    // A declared file is either a bare path or `{ path, text }` - the second
    // form is how a card gives a file contents. Dedupe on the PATH: keying on
    // the entry itself turns every object into "[object Object]", so the second
    // one and every one after it look like duplicates and silently vanish.
    function pathOf(entry) {
      return entry && typeof entry === "object" ? entry.path : entry;
    }
    function take(paths) {
      for (var i = 0; i < paths.length; i++) {
        var key = pathOf(paths[i]);
        if (!key || seen[key]) continue;
        seen[key] = true;
        out.push(paths[i]);
      }
    }
    take(task.files || []);
    var lists = [startOf(task), targetOf(task), solutionOf(task)];
    for (var j = 0; j < lists.length; j++) {
      if (!Array.isArray(lists[j])) continue;
      for (var k = 0; k < lists[j].length; k++) take(addedPaths(lists[j][k]));
    }
    return out;
  }

  return {
    startOf: startOf,
    targetOf: targetOf,
    solutionOf: solutionOf,
    isRepoState: isRepoState,
    addedPaths: addedPaths,
    filesOf: filesOf
  };
});
