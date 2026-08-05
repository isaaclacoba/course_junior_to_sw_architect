/*
 * kernel/engine/widgets/csharp-goal-provider.js - the C# side of the live goal
 * tracker.
 *
 * The goal-tracker widget draws boxes and ticks; it does not know what a class
 * is. This module is the half that does. It answers the widget's three questions
 * for a build lesson, and every answer it gives comes from
 * kernel/grading/structure-match.js - the same policy the Node validator asserts
 * against the authored solution, so what a learner sees and what CI checks
 * cannot drift.
 *
 * A build goal is authored as:
 *
 *   { code: ["class Cat", "bool IsHungry()"], gate: { type: "Cat", member: "IsHungry" } }
 *   { code: ["class Cat", { row: "count the hungry ones", writes: "foreach(" }], gate: {...} }
 *   { gate: null }                                  // behaviour - only a run settles it
 *   { code: [...], gate: null }                     // a blueprint already on screen
 *   { gate: { absent: "CheckAndSign" } }            // a shape that must be GONE
 *
 * The state the widget hands back is { source, types, passed }: the editor text,
 * the scanned type list, and whether the last run passed.
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelCSharpGoals.
 *   - node:    module.exports (require in tests).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelCSharpGoals = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  function structure() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelStructure) return g.KernelStructure;
    if (typeof require === "function") {
      try { return require("../../grading/structure-match.js"); } catch (e) {}
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
   * The SHAPE of one goal, with no learner code involved - so a card paints the
   * same boxes before a key is pressed as after.
   *
   * Four outcomes, and the order of the tests is the meaning:
   *   - code + no gate     a blueprint already on screen. The box shows what to
   *                        aim at, but the tick waits for a run: a signature that
   *                        exists is not a signature that works.
   *   - no gate            behaviour. A line with a run marker.
   *   - absent-only gate   a removal. A struck-through box.
   *   - a typed gate       the ordinary case: header + one row per member.
   */
  function outline(goal) {
    var S = structure();
    var gate = gateOf(goal);
    var code = codeOf(goal);
    var label = function (row) { return S && S.rowLabel ? S.rowLabel(row) : String(row); };
    var runGated = gate === null || gate === undefined;

    if (code.length && runGated) {
      return { kind: "run-box", header: label(code[0]), rows: code.slice(1).map(label) };
    }
    if (runGated) return { kind: "line" };
    if (gate.absent && !gate.type) {
      return { kind: "absent-box", header: String(gate.absent), rows: [] };
    }
    if (gate.type) {
      var header = code.length
        ? label(code[0])
        : (gate.kind ? gate.kind + " " : "class ") + gate.type;
      return { kind: "box", header: header, rows: code.slice(1).map(label) };
    }
    return { kind: "plain" };
  }

  // One verdict per goal, in authored order. Straight through to
  // KernelStructure.verdicts, which is the one place that decides what a learner
  // sees - reading `evaluate` here instead would let the panel drift from the
  // tests and the validator.
  //
  // Returns null when there is nothing to judge with: the scanner has not loaded,
  // or it could not read the source. The widget then leaves the panel alone
  // rather than painting a verdict nobody earned.
  function verdicts(goals, state) {
    var S = structure();
    if (!S) return null;
    var types = state && state.types;
    if (!types) return null;
    var source = (state && state.source) || "";
    return S.verdicts ? S.verdicts(types, goals, source) : S.evaluate(types, goals.map(gateOf), source);
  }

  // Per-row verdicts inside one box: [headerOk, row1Ok, ...]. Empty for anything
  // that is not a type-shaped box, which tells the widget to fall back to the
  // box-level verdict - correct for a run-gated blueprint, where no row can be
  // settled by shape alone.
  function rows(goal, state) {
    var S = structure();
    if (!S || !S.rows) return [];
    var types = (state && state.types) || [];
    return S.rows(types, gateOf(goal), codeOf(goal), (state && state.source) || "");
  }

  return { outline: outline, verdicts: verdicts, rows: rows };
});
