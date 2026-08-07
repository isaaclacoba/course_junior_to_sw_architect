/*
 * kernel/engine/widgets/trace-goal-provider.js - the lab side of the live goal
 * tracker.
 *
 * The goal-tracker widget draws boxes and ticks; it does not know what a trace
 * is. This module is the half that does. It answers the widget's questions for a
 * lab card, and every answer comes from kernel/grading/trace-match.js - the same
 * policy the Node verifier asserts against the authored solution, so what the
 * learner sees and what CI checks cannot drift.
 *
 * A lab goal is authored as a claim about the RUN, with the gate that settles it:
 *
 *   { code: ["two Cat objects"], gate: { liveObjects: "Cat", atLeast: 2 } }
 *   { code: ["different names"], gate: { distinctField: { type: "Cat", field: "_name" } } }
 *   { gate: null }   // prose only - nothing factual to tick
 *
 * WHY EVERY LAB GOAL IS A RUN-BOX. A lab goal is a claim about something that
 * HAPPENED, and nothing that happened can be known until the learner presses
 * Visualize. Typing the right code proves nothing here - the tracker must stay
 * red until there is a trace to read, or it would tick on the shape of the text
 * and quietly become a source scanner with extra steps.
 *
 * The state the widget hands back is { outcome, passed }: the last
 * VizTraceOutcome and whether the card has been solved.
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelTraceGoalProvider.
 *   - node:    module.exports (require in tests).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelTraceGoalProvider = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  function policy() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelTraceMatch) return g.KernelTraceMatch;
    if (typeof require === "function") {
      try { return require("../../grading/trace-match.js"); } catch (e) {}
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
  function labelOf(row) {
    return row && typeof row === "object" && row.row !== undefined ? String(row.row) : String(row);
  }

  // Say what a gate asks for, in the learner's words, when a goal carries no
  // `code` of its own. Better than an empty header on their own goal line.
  function describe(gate) {
    if (!gate || typeof gate !== "object") return "";
    if (typeof gate.constructed === "string") {
      return "new " + gate.constructed + (gate.times > 1 ? " x" + gate.times : "");
    }
    if (typeof gate.liveObjects === "string") {
      return (gate.atLeast || 2) + " live " + gate.liveObjects;
    }
    if (gate.distinctField) {
      return "different " + gate.distinctField.field;
    }
    if (gate.calls) {
      return (gate.calls.member || "method") + "()";
    }
    if (typeof gate.prints === "string") {
      return 'prints "' + gate.prints + '"';
    }
    return "";
  }

  /**
   * The SHAPE of one goal, with no trace involved - so a card paints the same
   * boxes before the learner presses Visualize as after.
   *
   * Everything with a gate is a `run-box`: the dashed run marker is the honest
   * signal here, because a lab goal is settled by a run and by nothing else.
   */
  function outline(goal) {
    var gate = gateOf(goal);
    var code = codeOf(goal);

    if (gate === null || gate === undefined) {
      return code.length
        ? { kind: "run-box", header: labelOf(code[0]), rows: code.slice(1).map(labelOf) }
        : { kind: "line" };
    }
    return {
      kind: "run-box",
      header: code.length ? labelOf(code[0]) : describe(gate),
      rows: code.slice(1).map(labelOf),
    };
  }

  /**
   * One verdict per goal.
   *
   * Returns null - "cannot judge" - until a trace exists, so the widget leaves
   * the panel alone instead of painting a row of red crosses over a learner who
   * has not run anything yet. A card is not wrong for being unstarted.
   *
   * A run that did not produce a trace (it did not compile, it threw, the
   * compiler never loaded) is also `null`, not `false`, for the same reason:
   * those tell us nothing about what the learner understands.
   */
  function verdicts(goals, state) {
    var P = policy();
    if (!P) return null;
    var outcome = state && state.outcome;
    if (!outcome || outcome.status !== "traced" || !outcome.trace) return null;

    return (goals || []).map(function (goal) {
      var gate = gateOf(goal);
      // A prose-only goal has nothing factual to test, so it is UNTRACKED: the
      // widget resolves it against a passing card and never before.
      if (gate === null || gate === undefined) return null;
      return !!P.checkGate(outcome.trace, gate).ok;
    });
  }

  // Per-row verdicts inside one box. A lab goal's rows are prose restating the
  // one claim its gate already settles, so there is nothing finer to report -
  // returning [] tells the widget to fall back to the box-level verdict rather
  // than inventing per-row ticks nothing measured.
  function rows() {
    return [];
  }

  // A lab goal describes a lasting fact about the run that produced the picture
  // on screen, so it must NOT latch: when the learner edits and visualizes
  // again, the panel has to describe the new run. A latched tick would claim
  // something about code that is no longer there.
  function latches() {
    return false;
  }

  return {
    outline: outline,
    verdicts: verdicts,
    rows: rows,
    latches: latches,
    describe: describe,
  };
});
