/*
 * kernel/engine/widgets/goal-tracker.js - the LIVE GOAL TRACKER, as a widget.
 *
 * The panel that IS the goal list: each authored goal becomes a box with a
 * header, one row per subtask, and the localized goal prose as its caption; each
 * element ticks on its own as the learner works, so what is still missing is
 * visible instead of one grey block that turns green at the end.
 *
 * WHY IT IS A WIDGET. It started inside build-plugin.js, where it could only ever
 * mean C#: the shapes it drew were classes and members, and its verdicts came
 * straight from KernelStructure. The git track needs the same panel over a
 * different subject - a branch, a commit, a staged file - and a second copy of
 * the painting, the diffing and the prose snapshotting would drift from the
 * first. So the drawing lives here and knows NOTHING about any language:
 *
 *   provider.outline(goal)          -> { kind, header, rows: [label] }   (static)
 *   provider.verdicts(goals, state) -> [true|false|null] per goal, or null
 *   provider.rows(goal, state)      -> [headerOk, ...rowOks], [] to fall back
 *
 * Anything domain-shaped - what a gate means, what a row is called, how a shape
 * is recognised - is the provider's. This file owns the markup, the tick, the
 * ordering, and the repaint.
 *
 * THE THREE VERDICTS. true = the shape is there. false = it is genuinely not
 * there yet. null = UNTRACKED, a goal about behaviour ("it prints FEED") that
 * only a real run can settle; the widget resolves null against `state.passed`,
 * so a run-gated goal ticks when the card passes and never before.
 *
 * IT IS A GUIDE, NEVER A GRADE. Nothing here awards XP. XP stays with the run.
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelGoalTracker.
 *   - node:    module.exports (require in tests).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelGoalTracker = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  function escapeDefault(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // What a ticked element shows. Kept here rather than in each provider so
  // "green" means the same thing on every track.
  function tick(met) { return met === true ? "\u2713" : ""; }

  function boxHtml(kind, header, rowsHtml, caption, met, esc) {
    var cls = "goal-box";
    if (kind === "run-box") cls += " goal-box--run";
    else if (kind === "absent-box") cls += " goal-box--absent";
    if (met === true) cls += " is-met";

    var headerCls = "goal-box-header" + (kind === "absent-box" ? " goal-box-header--absent" : "");
    var headerInner = kind === "absent-box"
      ? '<del><code class="goal-code">' + esc(header) + "</code></del>"
      : '<code class="goal-code">' + esc(header) + "</code>";
    // A run-gated box carries the dashed run marker: the shape may already be on
    // screen, so only a passing run can claim it works.
    var tickCls = "tracker-tick" + (kind === "run-box" ? " tracker-tick--run" : "");
    var tickText = kind === "run-box" && met !== true ? "\u25B6" : tick(met);

    return '<li class="' + cls + '">' +
      '<span class="' + tickCls + '" aria-hidden="true">' + tickText + "</span>" +
      '<div class="goal-box-inner">' +
      '<div class="' + headerCls + '">' + headerInner + "</div>" +
      (rowsHtml ? '<div class="goal-box-members">' + rowsHtml + "</div>" : "") +
      '<div class="goal-box-caption">' + caption + "</div>" +
      "</div></li>";
  }

  function rowHtml(label, met, esc) {
    return '<code class="goal-code goal-member' + (met === true ? " is-met" : "") + '">' +
      '<span class="goal-member-tick" aria-hidden="true">' + tick(met) + "</span>" +
      esc(label) + "</code>";
  }

  function lineHtml(caption, met) {
    return '<li class="goal-behaviour' + (met === true ? " is-met" : "") + '">' +
      '<span class="tracker-tick tracker-tick--run" aria-hidden="true">' +
      (met === true ? "\u2713" : "\u25B6") + "</span>" +
      '<span class="goal-prose">' + caption + "</span></li>";
  }

  // A goal the provider could not place at all. It still says what to do, it just
  // has no tick to offer - better than dropping the line off the panel.
  function plainHtml(caption) {
    return '<li class="goal-behaviour"><span class="goal-prose">' + caption + "</span></li>";
  }

  /**
   * create({ host, provider, escapeHtml })
   *
   *   host       the <ul> the lesson's Goal section already renders into.
   *   provider   the domain module (see the contract at the top of this file).
   *   escapeHtml the engine's escaper, so a `<` in a row label cannot inject.
   */
  function create(options) {
    var opts = options || {};
    var host = opts.host || null;
    var provider = opts.provider || null;
    var esc = opts.escapeHtml || escapeDefault;

    var goals = [];
    var prose = [];
    var lastHtml = null;
    var lastMet = null;
    // High-water marks for LATCHING goals - see the note on `latch()` below.
    var everMet = [];
    var everRow = [];
    var api;

    // Snapshot the freshly painted - and freshly localized - goal prose, so the
    // boxes can be rebuilt with the right captions on every sync. Taken from the
    // DOM rather than the config because the engine has already run its inline
    // renderer over it, and a second implementation of that would drift.
    //
    // It must be taken BEFORE the first sync of a card: once the tracker paints,
    // the list holds boxes, and capturing then would snapshot its own ticks.
    function capture() {
      prose = [];
      lastHtml = null;
      lastMet = null;
      everMet = [];
      everRow = [];
      if (!host || !host.children) return api;
      for (var i = 0; i < host.children.length; i++) {
        prose.push(host.children[i].innerHTML || "");
      }
      return api;
    }

    function setGoals(list) {
      goals = Array.isArray(list) ? list : [];
      return api;
    }

    // Repaint from a domain state blob. Cheap enough for every keystroke: the DOM
    // is only touched when the rendered HTML actually changed.
    //
    // The HTML string is the only honest diff. A row can flip while the box-level
    // verdict does not, so comparing verdict arrays would swallow the repaint.
    function sync(state) {
      if (!host || !provider || !goals.length) return null;
      if (!prose.length) return null;

      var met = provider.verdicts(goals, state);
      // null means the provider cannot see enough to judge right now - no scanner
      // yet, no repository yet. Leave the panel exactly as it is; a guess here
      // would be a tick nobody earned or one silently taken away.
      if (!met) return null;

      var passed = !!(state && state.passed);
      var resolved = met.slice();
      for (var i = 0; i < resolved.length; i++) {
        if (resolved[i] === null && passed) resolved[i] = true;
        if (resolved[i] === true) everMet[i] = true;
        else if (everMet[i] && latches(goals[i])) resolved[i] = true;
      }

      var html = build(resolved, state);
      lastMet = resolved;
      if (host.innerHTML !== html) {
        host.innerHTML = html;
        // The tracker gives every goal its own tick, so the list drops the bullet
        // and the indent. Opt-IN: `coach-list` is shared with the drill Points
        // list, which still wants plain bullets.
        if (host.classList) host.classList.add("has-tracker");
      }
      lastHtml = html;
      return resolved;
    }

    /**
     * Does this goal LATCH - stay ticked once it has been true?
     *
     * Domains differ, so the provider decides and the widget only remembers.
     * A C# goal reads the source, which IS the answer, so un-ticking when the
     * learner deletes a method is honest feedback. A git goal often describes a
     * MOMENT in a process - "stage cat.txt, and only that one" is true between
     * the add and the commit and false for ever after, because committing
     * empties the index. Without a latch that step ticks and then silently
     * un-ticks while the learner is doing everything right.
     *
     * A provider with no `latches` never latches, so this is opt-in and the C#
     * side is unchanged.
     */
    function latches(goal) {
      return !!(provider && typeof provider.latches === "function" && provider.latches(goal));
    }

    // Boxes first, then the lines beneath them: a shape to aim at reads better
    // above the sentences about what it should do.
    function build(met, state) {
      var boxes = [];
      var lines = [];
      for (var i = 0; i < goals.length; i++) {
        var goal = goals[i];
        var caption = prose[i] || "";
        var shape = provider.outline(goal) || { kind: "plain" };
        var isMet = met[i];

        if (shape.kind === "line") {
          lines.push(lineHtml(caption, isMet));
          continue;
        }
        if (shape.kind !== "box" && shape.kind !== "run-box" && shape.kind !== "absent-box") {
          lines.push(plainHtml(caption));
          continue;
        }

        var labels = shape.rows || [];
        var rowMet = labels.length && provider.rows ? (provider.rows(goal, state) || []) : [];
        var rowsHtml = "";
        var sticky = latches(goal);
        if (sticky && !everRow[i]) everRow[i] = [];
        for (var r = 0; r < labels.length; r++) {
          // A provider's verdict list starts with the HEADER, so the member rows
          // it returns line up at r + 1. With no per-row verdicts at all, a row
          // inherits the box - which is what a run-gated box wants, since only
          // the run can settle any of it.
          var ok = rowMet.length ? rowMet[r + 1] === true : isMet === true;
          // A row under a latching goal latches with it, or the box would read
          // green over a subtask list that had gone grey again.
          if (sticky) {
            if (ok) everRow[i][r] = true;
            else if (everRow[i][r]) ok = true;
          }
          rowsHtml += rowHtml(labels[r], ok, esc);
        }
        boxes.push(boxHtml(shape.kind, shape.header || "", rowsHtml, caption, isMet, esc));
      }
      return boxes.join("") + lines.join("");
    }

    // Hand the panel back plainly - used when a card has no goals to track, so a
    // previous card's boxes cannot linger.
    function clear() {
      goals = [];
      prose = [];
      lastHtml = null;
      lastMet = null;
      if (host && host.classList) host.classList.remove("has-tracker");
      return api;
    }

    api = {
      capture: capture,
      setGoals: setGoals,
      sync: sync,
      clear: clear,
      // Read-only views, for tests and for a plugin that wants to know where the
      // learner stands without re-deriving it.
      met: function () { return lastMet ? lastMet.slice() : null; },
      html: function () { return lastHtml; },
    };
    return api;
  }

  return { create: create };
});
