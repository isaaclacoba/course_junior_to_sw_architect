/*
 * kernel/engine/widgets/git-goal-provider.js - the git side of the live goal
 * tracker.
 *
 * The goal-tracker widget draws boxes and ticks; it does not know what a branch
 * is. This module is the half that does. It answers the widget's three questions
 * for a git lesson, and every answer comes from kernel/grading/git-goal-match.js
 * - the same policy the Node validator asserts against the authored solution, so
 * what a learner sees and what CI checks cannot drift.
 *
 * Ratified UX (owner's pick off the mockup, 2026-08-05): EVERY goal line is a
 * box, reads included. The header is the git thing the goal is about, the rows
 * are the facts that make it true, and the caption is the localized goal prose -
 * the same shape the C# track already reads as.
 *
 * A git goal is authored as:
 *
 *   { code: ["git status"], gate: { ran: "git status" } }
 *   { code: ["branch feature",
 *            { row: "at `add dog`", at: "add dog" },
 *            { row: "HEAD on feature", head: "feature" }],
 *     gate: { branch: "feature" } }
 *   { gate: null }   // no factual test - only reaching the target settles it
 *
 * The state the widget hands back is { state, ran, passed }: the RepoState, the
 * commands run on this card so far, and whether the card has been solved.
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelGitGoals.
 *   - node:    module.exports (require in tests).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelGitGoals = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  function policy() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelGitGoalMatch) return g.KernelGitGoalMatch;
    if (typeof require === "function") {
      try { return require("../../grading/git-goal-match.js"); } catch (e) {}
    }
    return null;
  }

  function codeOf(goal) {
    var code = goal && goal.code;
    if (!code) return [];
    return Array.isArray(code) ? code : [code];
  }
  function gateOf(goal) {
    return goal && goal.gate !== undefined ? goal.gate : undefined;
  }

  /**
   * The SHAPE of one goal, with no repository involved - so a card paints the
   * same boxes before a command is typed as after.
   *
   * A goal with no gate has nothing factual to tick, so it stays a line with the
   * run marker rather than a box that could never turn green on its own. A goal
   * with a gate but no `code` still gets a box: the gate itself is describable,
   * which beats dropping the learner's own goal line off the panel.
   */
  function outline(goal) {
    var P = policy();
    var gate = gateOf(goal);
    var code = codeOf(goal);
    var label = function (row) { return P && P.rowLabel ? P.rowLabel(row) : String(row); };

    if (gate === null || gate === undefined) {
      return code.length
        ? { kind: "run-box", header: label(code[0]), rows: code.slice(1).map(label) }
        : { kind: "line" };
    }
    if (gate.absent && Object.keys(gate).length === 1) {
      return { kind: "absent-box", header: code.length ? label(code[0]) : describe(gate.absent), rows: code.slice(1).map(label) };
    }
    return {
      kind: "box",
      header: code.length ? label(code[0]) : describe(gate),
      rows: code.slice(1).map(label),
    };
  }

  function describe(gate) {
    var P = policy();
    return P && P.describe ? P.describe(gate) : "";
  }

  // One verdict per goal, straight through to the policy's `verdicts` - the one
  // place that decides what a learner sees.
  //
  // Returns null when there is no repository yet, so the widget leaves the panel
  // alone instead of painting a row of grey ticks over prose that reads fine.
  function verdicts(goals, state) {
    var P = policy();
    if (!P) return null;
    if (!state || !state.state) return null;
    return P.verdicts(goals, { state: state.state, ran: state.ran || [] });
  }

  // Per-row verdicts inside one box: [headerOk, row1Ok, ...].
  function rows(goal, state) {
    var P = policy();
    if (!P || !state) return [];
    return P.rows(gateOf(goal), codeOf(goal), { state: state.state, ran: state.ran || [] });
  }

  // Git goals often describe a step in a process rather than a lasting shape, so
  // the widget must remember the ones that were true for only a moment. The
  // policy owns the rule; this is a passthrough so both sides agree.
  function latches(goal) {
    var P = policy();
    return !!(P && P.latches && P.latches(goal));
  }

  return { outline: outline, verdicts: verdicts, rows: rows, latches: latches };
});
