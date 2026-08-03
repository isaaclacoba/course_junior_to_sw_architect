/*
 * kernel/grading/blank-match.js - the shared fill-in-the-blank grading policy.
 *
 * The DOM-free sibling of kernel/grading/output-match.js: the single source of
 * truth for how a drill lesson compares a learner's typed value to a blank's
 * expected answer(s). The comparison is lifted VERBATIM out of drill-engine.js
 * (its `norm`, `canonical`, `answersFor`, and the exact/close classification in
 * `check()`), so the browser drill plugin and any Node verifier grade
 * byte-identically and cannot drift.
 *
 * No DOM, no CodeLab, no runner: a pure function over data, unit-testable with
 * plain objects.
 *
 *   gradeBlanks({ blanks, values }) -> { ok, reason, wrong:[blankId...], results }
 *     - blanks:  the drill's blanks[]  ({ id, label, answer, accept?[], ... })
 *     - values:  a map blankId -> the learner's typed string
 *     - ok:      true only when EVERY blank matches exactly (an "almost" is not ok)
 *     - reason:  "pass" when ok, else "blanks"
 *     - wrong:   the ids of every blank that is not an exact match
 *     - results: per-blank { id, status } where status is "exact"|"almost"|"wrong"
 *
 * Loaded two ways with no bundler (same UMD shape as output-match.js):
 *   - browser: a <script> sets window.KernelBlankMatch (injected before the plugin).
 *   - node:    module.exports (require in tests / a verifier).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelBlankMatch = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  // --- reproduced VERBATIM from drill-engine.js --------------------------------
  // `norm` (drill-engine text helpers): collapse whitespace, trim, lowercase.
  function norm(text) {
    return String(text == null ? "" : text).replace(/\s+/g, " ").trim().toLowerCase();
  }
  // `canonical` (drill-engine text helpers): trim, drop a trailing semicolon,
  // strip ALL whitespace, lowercase - so "x = 5;" and "x=5" compare equal.
  function canonical(text) {
    return String(text == null ? "" : text)
      .trim()
      .replace(/;\s*$/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();
  }
  // `answersFor` (drill-engine check): the accepted forms are the answer plus any
  // explicit accept[] alternates.
  function answersFor(b) {
    return [b.answer].concat(b.accept || []);
  }

  // The exact/close classification from drill-engine.check(), reproduced line for
  // line. "exact" -> correct; a non-empty value that overlaps an answer -> "almost";
  // otherwise "wrong".
  function classify(raw, b) {
    var actual = norm(raw);
    var actualCanonical = canonical(raw);
    var options = answersFor(b);

    var exact = options.some(function (a) {
      return actual === norm(a) || actualCanonical === canonical(a);
    });
    if (exact) return "exact";

    var close = options.some(function (a) {
      var e = norm(a);
      var ec = canonical(a);
      return (
        e.includes(actual) ||
        actual.includes(e) ||
        ec.includes(actualCanonical) ||
        actualCanonical.includes(ec)
      );
    });
    if (actual && close) return "almost";
    return "wrong";
  }

  // Grade every blank of one drill card. `values` maps blankId -> typed string.
  function gradeBlanks(input) {
    var blanks = (input && input.blanks) || [];
    var values = (input && input.values) || {};
    var results = blanks.map(function (b) {
      return { id: b.id, status: classify(values[b.id], b) };
    });
    var wrong = results
      .filter(function (r) { return r.status !== "exact"; })
      .map(function (r) { return r.id; });
    var ok = wrong.length === 0;
    return { ok: ok, reason: ok ? "pass" : "blanks", wrong: wrong, results: results };
  }

  return {
    norm: norm,
    canonical: canonical,
    answersFor: answersFor,
    classify: classify,
    gradeBlanks: gradeBlanks,
  };
});
