/*
 * kernel/grading/trace-match.js - the TRACE gate vocabulary.
 *
 * How a lab card is graded. A lab card asks the learner to make something
 * HAPPEN - two objects alive at once, a constructor that ran twice, two
 * instances holding different values - and this module answers whether it did,
 * by reading the execution trace the tracer produced.
 *
 * IT READS THE RUN, NEVER THE SOURCE. There is no regex over the learner's text
 * here and there must never be one. `new Cat("Ana")` inside a comment, in a
 * branch that never executed, or in a class nobody instantiated all look right
 * to a source scanner and are all wrong. The trace only contains what actually
 * ran, so a gate that passes means the thing genuinely happened - and the thing
 * marked is the thing drawn on screen beside it.
 *
 * WHAT A GATE LOOKS LIKE (one key each, so a gate is self-describing):
 *
 *   { constructed: "Cat", times: 2 }                  the ctor ran that often
 *   { liveObjects: "Cat", atLeast: 2 }                that many exist AT ONCE
 *   { distinctField: { type: "Cat", field: "_name" } } two objects differ there
 *   { calls: { type: "Cat", member: "Speak", times: 2 } }  it ran on each
 *   { prints: "Ana" }                                 the program printed it
 *
 * EVERY GATE MUST START RED on the untouched starter. A gate that is already
 * satisfied before the learner types anything teaches nothing and hands out XP
 * for arriving - `startsRed` exists so a lesson author can prove it, and
 * tools/verify-lesson.mjs can fail the build when it is not true.
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelTraceMatch (before lab-plugin).
 *   - node:    module.exports (require in tests and in the verifier).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelTraceMatch = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  function steps(trace) {
    return (trace && Array.isArray(trace.steps)) ? trace.steps : [];
  }

  // A frame's receiver reads "Cat #2" - the type is everything before the #, so
  // two instances of one class stay tellable apart without parsing the number.
  function receiverType(recv) {
    if (!recv) return "";
    var hash = String(recv).indexOf("#");
    return (hash < 0 ? String(recv) : String(recv).slice(0, hash)).trim();
  }

  // Every frame that appeared anywhere in the run, de-duplicated by frame id.
  // A frame lives across many steps (it is on the stack while its callee runs),
  // so counting frames per step would count one call many times.
  function distinctFrames(trace) {
    var seen = Object.create(null);
    var out = [];
    steps(trace).forEach(function (step) {
      (step.frames || []).forEach(function (frame) {
        if (!frame || !frame.id || seen[frame.id]) return;
        seen[frame.id] = true;
        out.push(frame);
      });
    });
    return out;
  }

  // ---- the gates ------------------------------------------------------------
  // Each returns { ok, actual } - `actual` is what the run really did, so a
  // failing gate can tell the learner the number instead of just saying no.

  // A constructor frame is `kind: "ctor"`, and the tracer names it after the
  // type. Counting distinct ctor FRAMES counts constructions.
  function countConstructed(trace, type) {
    return distinctFrames(trace).filter(function (frame) {
      if (frame.kind !== "ctor") return false;
      return receiverType(frame.recv) === type || String(frame.name).indexOf(type) >= 0;
    }).length;
  }

  // "At once" is the whole point: two objects that existed at different moments
  // are not two objects on screen together. So this is the MAXIMUM over steps,
  // never a total across the run.
  function maxLiveObjects(trace, type) {
    var max = 0;
    steps(trace).forEach(function (step) {
      var live = (step.heap || []).filter(function (obj) { return obj && obj.type === type; }).length;
      if (live > max) max = live;
    });
    return max;
  }

  // Two objects of one type holding DIFFERENT values in the same field - the
  // evidence that the learner passed values in rather than hardcoding one.
  // Compared within a single step, because that is when both are on screen.
  function distinctFieldValues(trace, type, field) {
    var best = 0;
    steps(trace).forEach(function (step) {
      var values = Object.create(null);
      var count = 0;
      (step.heap || []).forEach(function (obj) {
        if (!obj || obj.type !== type) return;
        (obj.fields || []).forEach(function (pair) {
          if (!pair || pair[0] !== field) return;
          var value = String(pair[1]);
          if (!values[value]) { values[value] = true; count++; }
        });
      });
      if (count > best) best = count;
    });
    return best;
  }

  // A member call on instances of a type. `kind` is "method" for an instance
  // call and "static" for a static one; both count, because a lesson may teach
  // either, and the member name is matched against the frame label.
  function countCalls(trace, type, member) {
    return distinctFrames(trace).filter(function (frame) {
      if (frame.kind !== "method" && frame.kind !== "static") return false;
      var onType = type ? receiverType(frame.recv) === type || String(frame.name).indexOf(type) >= 0 : true;
      if (!onType) return false;
      return !member || String(frame.name).indexOf(member) >= 0;
    }).length;
  }

  // stdout is CUMULATIVE per step, so the last step that carries any holds the
  // whole program output.
  function stdoutOf(trace) {
    var all = steps(trace);
    for (var i = all.length - 1; i >= 0; i--) {
      if (all[i] && typeof all[i].stdout === "string" && all[i].stdout.length) return all[i].stdout;
    }
    return "";
  }

  function printedLines(trace) {
    return stdoutOf(trace).split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
  }

  // ---- one gate -------------------------------------------------------------
  // Returns { ok, message } where message is what the learner is told when the
  // gate is red. The message always names the NUMBER the run actually reached,
  // because "not yet" without a number leaves them guessing which half is wrong.
  function checkGate(trace, gate, tr) {
    var t = tr || function (key, fallback) { return fallback; };

    if (!gate || typeof gate !== "object") {
      return { ok: false, message: t("lab.gate.unknown", "This card has a goal we cannot check. That is our bug, not yours.") };
    }

    if (typeof gate.constructed === "string") {
      var wanted = typeof gate.times === "number" ? gate.times : 1;
      var built = countConstructed(trace, gate.constructed);
      return {
        ok: built >= wanted,
        actual: built,
        message: t("lab.gate.constructed", "The `{type}` constructor ran {actual} time(s); this card needs {wanted}.")
          .replace("{type}", gate.constructed).replace("{actual}", built).replace("{wanted}", wanted),
      };
    }

    if (typeof gate.liveObjects === "string") {
      var need = typeof gate.atLeast === "number" ? gate.atLeast : 2;
      var live = maxLiveObjects(trace, gate.liveObjects);
      return {
        ok: live >= need,
        actual: live,
        message: t("lab.gate.liveObjects", "At most {actual} `{type}` object(s) existed at the same time; this card needs {wanted}.")
          .replace("{type}", gate.liveObjects).replace("{actual}", live).replace("{wanted}", need),
      };
    }

    if (gate.distinctField && typeof gate.distinctField === "object") {
      var spec = gate.distinctField;
      var wantValues = typeof spec.atLeast === "number" ? spec.atLeast : 2;
      var found = distinctFieldValues(trace, spec.type, spec.field);
      return {
        ok: found >= wantValues,
        actual: found,
        message: t("lab.gate.distinctField", "Your `{type}` objects hold {actual} different value(s) in `{field}`; this card needs {wanted}. Pass the value in rather than fixing it inside the class.")
          .replace("{type}", spec.type).replace("{field}", spec.field)
          .replace("{actual}", found).replace("{wanted}", wantValues),
      };
    }

    if (gate.calls && typeof gate.calls === "object") {
      var call = gate.calls;
      var wantCalls = typeof call.times === "number" ? call.times : 1;
      var ran = countCalls(trace, call.type, call.member);
      return {
        ok: ran >= wantCalls,
        actual: ran,
        message: t("lab.gate.calls", "`{member}` ran {actual} time(s); this card needs {wanted}.")
          .replace("{member}", call.member || "that method").replace("{actual}", ran).replace("{wanted}", wantCalls),
      };
    }

    if (typeof gate.prints === "string") {
      var lines = printedLines(trace);
      var printed = lines.indexOf(gate.prints.trim()) >= 0;
      return {
        ok: printed,
        actual: lines.length,
        message: t("lab.gate.prints", "The program never printed `{text}`.").replace("{text}", gate.prints),
      };
    }

    return { ok: false, message: t("lab.gate.unknown", "This card has a goal we cannot check. That is our bug, not yours.") };
  }

  /**
   * gradeTrace(trace, gates, deps) -> { ok, reason, message, met }
   *
   * `met` is the per-gate verdict array, in the authored order, so the goal
   * tracker can tick each row on its own instead of one block going green at
   * the end.
   *
   * A card with NO gates cannot pass. Grading nothing and calling it correct is
   * how a lesson silently stops teaching, so it is an authoring error and says so.
   */
  function gradeTrace(trace, gates, deps) {
    var d = deps || {};
    var t = d.tr || function (key, fallback) { return fallback; };
    var list = Array.isArray(gates) ? gates : [];

    if (!list.length) {
      return {
        ok: false,
        reason: "no-gates",
        met: [],
        message: t("lab.noGates", "This card has nothing to check, so it cannot be marked. That is our bug, not yours."),
      };
    }

    var met = [];
    var firstFailure = null;
    list.forEach(function (gate) {
      var result = checkGate(trace, gate, t);
      met.push(!!result.ok);
      if (!result.ok && !firstFailure) firstFailure = result;
    });

    if (firstFailure) {
      return { ok: false, reason: "gate", met: met, message: firstFailure.message };
    }
    return {
      ok: true,
      reason: "ok",
      met: met,
      message: t("lab.pass", "That is it - your objects are on the right, exactly as your code made them."),
    };
  }

  /**
   * startsRed(trace, gates) -> [] | [index, ...]
   *
   * Which gates are ALREADY satisfied by the starter's own trace. A lesson is
   * only honest when this returns empty: a goal that is green before the learner
   * types is not a goal, it is decoration that pays XP. Returns the offending
   * indexes so an author is told WHICH one to tighten.
   */
  function startsRed(starterTrace, gates) {
    var already = [];
    (Array.isArray(gates) ? gates : []).forEach(function (gate, i) {
      if (checkGate(starterTrace, gate).ok) already.push(i);
    });
    return already;
  }

  return {
    gradeTrace: gradeTrace,
    startsRed: startsRed,
    // Exposed for the goal-tracker provider and for tests: one gate, one answer.
    checkGate: checkGate,
    countConstructed: countConstructed,
    maxLiveObjects: maxLiveObjects,
    distinctFieldValues: distinctFieldValues,
    countCalls: countCalls,
    printedLines: printedLines,
  };
});
