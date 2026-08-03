/*
 * kernel/grading/output-match.js - the shared C# output-grading policy.
 *
 * The first module in kernel/: a DOM-free grading capability, narrowly scoped.
 * It is the single source of truth for how a build lesson is graded, so the
 * browser engine (build-engine.js) and the Node verifier (tools/verify-lesson.mjs)
 * cannot drift apart. No DOM, no CodeLab, no dotnet: a runner is INJECTED through
 * deps.run when a grader needs to execute code, which keeps the policy pure and
 * unit-testable with a fake runner.
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelGrading (injected before build-engine).
 *   - node:    module.exports (require in tests, default import in the verifier).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelGrading = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  // The visible Main is the last top-level Program class; the hidden probe keeps
  // everything before it and swaps in a different entry point.
  var PROGRAM_CLASS_RE = /(?:public\s+)?(?:static\s+)?(?:partial\s+)?class\s+Program\b/;

  // expected as a string: any output line equals it.
  // expected as an array: the non-empty output lines equal that exact sequence.
  function matches(out, expected) {
    var lines = String(out).split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    if (Array.isArray(expected)) {
      return lines.length === expected.length && expected.every(function (e, i) { return lines[i] === e; });
    }
    return lines.some(function (line) { return line === expected; });
  }

  // Optional technique gate: a task may require the source to satisfy patterns
  // (e.g. actually use a loop), so a hardcoded answer that prints the expected
  // output is not enough. Returns the first failing requirement message, or null.
  function unmetRequirement(source, requirements) {
    if (!Array.isArray(requirements)) return null;
    for (var i = 0; i < requirements.length; i++) {
      var req = requirements[i];
      var re = req.pattern instanceof RegExp ? req.pattern : new RegExp(req.pattern);
      if (!re.test(source)) return req.message || "Your code does not meet this task's requirement yet.";
    }
    return null;
  }

  // Hidden verification: build a probe that re-runs the learner's own classes
  // against a different entry point (verify.main). Keep the source up to the
  // Program class, then append the probe main.
  function buildProbe(source, probeMain) {
    var m = source.search(PROGRAM_CLASS_RE);
    var base = m >= 0 ? source.slice(0, m) : source;
    return base + probeMain;
  }

  // Run the hidden probe through the injected runner. deps.run(source) resolves to
  // { output, errors?, runtimeError? }. A hardcoded answer that prints the right
  // value for the visible case fails here.
  function passesHiddenVerify(source, verify, deps) {
    return Promise.resolve(deps.run(buildProbe(source, verify.main))).then(function (probe) {
      if (probe.errors && probe.errors.length) return false;
      if (probe.runtimeError) return false;
      return matches((probe.output || "").trim(), verify.expected);
    });
  }

  function describeExpected(expected) {
    if (Array.isArray(expected)) {
      return "Expected these lines, in order:\n" + expected.join("\n") + "\nAdjust your code and run again.";
    }
    return 'Expected a line equal to "' + expected + '". Adjust your code and run again.';
  }

  // One call that grades already-run output in the engine's order: output match,
  // then the requireSource technique gate, then the hidden verify probe. Returns a
  // structured result; the caller maps reason -> its own localized copy. The
  // message here is the non-localized fallback (mismatch and verify), preserved so
  // a caller without a string catalog still shows something useful.
  function gradeOutput(input, deps) {
    var out = (input.output || "").trim();
    if (!matches(out, input.expected)) {
      return Promise.resolve({ ok: false, reason: "mismatch", message: describeExpected(input.expected) });
    }
    var unmet = unmetRequirement(input.source, input.requireSource);
    if (unmet) return Promise.resolve({ ok: false, reason: "requirement", message: unmet });
    if (!input.verify) return Promise.resolve({ ok: true, reason: "pass", message: null });
    return passesHiddenVerify(input.source, input.verify, deps).then(function (passed) {
      if (!passed) return { ok: false, reason: "verify", message: (input.verify && input.verify.message) || null };
      return { ok: true, reason: "pass", message: null };
    });
  }

  return {
    PROGRAM_CLASS_RE: PROGRAM_CLASS_RE,
    matches: matches,
    unmetRequirement: unmetRequirement,
    buildProbe: buildProbe,
    passesHiddenVerify: passesHiddenVerify,
    describeExpected: describeExpected,
    gradeOutput: gradeOutput
  };
});
