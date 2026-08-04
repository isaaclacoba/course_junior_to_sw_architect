/*
 * kernel/engine/plugins/build-plugin.js - the "build" archetype as a plugin for
 * the generic lesson engine (kernel/engine/lesson-engine.js).
 *
 * This is the archetype-specific MIDDLE of build-engine.js and nothing else: the
 * Monaco editor work surface, the shared Roslyn runner, the run-and-grade flow,
 * and the Show Solution / Reset behaviour. Everything the core now owns (header,
 * XP + award, the result panel + its localized thunk, summary, prev/next nav,
 * setLocale fan-out, self-boot) is deliberately absent here - the plugin only
 * mounts a surface, paints a card body, grades a run, and hands the result back
 * through ctx.report.
 *
 * Grading is NOT re-implemented: the plugin runs the learner source through the
 * runner and calls window.KernelGrading.gradeOutput (kernel/grading/output-match.js)
 * verbatim - the exact policy build-engine uses today - so grading is byte-identical
 * and real-dotnet equivalence holds by construction. The plugin only maps the
 * grader's `reason` to the SAME localized chrome message build-engine produces.
 *
 * Loaded two ways with no bundler (same UMD shape as the core):
 *   - browser: a <script> loads it after lesson-engine.js; it registers itself on
 *     window.LessonEngine and exposes nothing else.
 *   - node:    module.exports the plugin object, and it registers on the core it
 *     require()s, so it is unit-testable with a fake DOM + fake CodeLab.
 */
(function (root, factory) {
  "use strict";
  var LessonEngine =
    (root && root.LessonEngine) ||
    (typeof require === "function" ? require("../lesson-engine.js") : null);
  var plugin = factory();
  if (LessonEngine && LessonEngine.register) LessonEngine.register(plugin);
  if (typeof module === "object" && module.exports) {
    module.exports = plugin;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  // Resolve LessonCommon (for fill) and KernelGrading the same lazy way the core
  // does, so the plugin is testable off a fake global and never hard-depends on
  // load order at module-eval time.
  function resolveLC() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.LessonCommon) return g.LessonCommon;
    if (typeof require === "function") {
      try { return require("../../page-shell/lesson-common.js"); } catch (e) {}
    }
    return null;
  }
  function grading() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelGrading) return g.KernelGrading;
    if (typeof require === "function") {
      try { return require("../../grading/output-match.js"); } catch (e) {}
    }
    return null;
  }
  var warnedNoStructure = false;
  function structure() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelStructure) return g.KernelStructure;
    if (typeof require === "function") {
      try { return require("../../grading/structure-match.js"); } catch (e) {}
    }
    return null;
  }

  // ---- example / expected painters (archetype chrome) ----------------------
  // The "here's the pattern" example is highlighted with Monaco (the same engine
  // as the editor), so no separate highlighter is needed. Identical to
  // build-engine.render's example branch.
  function colorizeExample(ctx, task) {
    var example = ctx.hosts.example;
    if (!example) return;
    if (task.example) {
      if (typeof window !== "undefined" && window.monaco && monaco.editor && monaco.editor.colorize) {
        example.textContent = task.example;
        monaco.editor
          .colorize(task.example, "csharp", {})
          .then(function (html) { example.innerHTML = html; })
          .catch(function () {});
      } else {
        example.textContent = task.example;
      }
    } else {
      example.textContent = "";
    }
  }
  function paintExpected(ctx, task) {
    var expected = ctx.hosts.expected;
    if (!expected) return;
    expected.textContent = Array.isArray(task.expected)
      ? task.expected.join("\n")
      : (task.expected || "");
  }

  // ---- the live goal tracker (UML class boxes) -----------------------------
  // ONE panel that IS the goal list: structural goals render as UML-style class
  // boxes (a header with the type name and one row per member), behaviour goals
  // (gate: null) are short lines below the boxes with a run marker, and removal
  // goals (gate.absent) are struck-through ghosted boxes. Each element ticks
  // independently as the learner types, so the learner sees exactly which piece
  // is still missing.
  //
  // The tracker is a GUIDE, never a grade. XP comes ONLY from a real run.
  function scanTypes(source) {
    var CL = typeof CodeLab !== "undefined" ? CodeLab : null;
    if (!CL || typeof CL.scanCSharp !== "function") return null;
    try {
      var found = CL.scanCSharp(source || "");
      return (found && found.types) || [];
    } catch (e) {
      return null;
    }
  }

  // Build the UML box HTML for the entire goal panel. Three kinds of goal:
  //   - structural (gate.type): a class box with header + member rows
  //   - absent (gate.absent): a struck-through removal line
  //   - run-gated (gate: null): a behaviour line with ▶ marker
  //
  // The box renders the CODE field as the visual, and the localized prose as a
  // caption INSIDE the box (not repeated beside it). Each row ticks independently.
  function buildTrackerHtml(surface, met, types, source) {
    var goals = surface.task.goals || [];
    var proseList = surface.goalHtml || [];
    var esc = surface.ctx.helpers.escapeHtml;
    var S = structure();
    var boxes = [];
    var behaviours = [];

    // One member row = one subtask. Row 0 is the type header, rows 1..n are its
    // members; each carries its own tick so a learner sees which piece is still
    // missing rather than one box that stays grey until the last keystroke.
    function memberRows(codeArr, gate, boxMet) {
      var verdicts = (S && S.rows) ? S.rows(types || [], gate, codeArr, source) : [];
      return codeArr.slice(1).map(function (m, k) {
        var ok = verdicts.length ? verdicts[k + 1] === true : boxMet === true;
        return '<code class="goal-code goal-member' + (ok ? " is-met" : "") + '">' +
          '<span class="goal-member-tick" aria-hidden="true">' + (ok ? "\u2713" : "") + "</span>" +
          esc(S && S.rowLabel ? S.rowLabel(m) : m) + "</code>";
      }).join("");
    }

    for (var i = 0; i < goals.length; i++) {
      var g = goals[i];
      var gate = g && g.gate !== undefined ? g.gate : undefined;
      var prose = proseList[i] || "";
      var isMet = met[i];

      var codes0 = g && g.code;
      var hasBlueprint = !!codes0 && (!Array.isArray(codes0) || codes0.length > 0);

      if (hasBlueprint && (gate === null || gate === undefined)) {
        // A blueprint the learner already has on screen (an empty method to fill,
        // a class to edit). The BOX is the help - it shows the shape being aimed
        // at - but the tick has to come from a passing run, because "the
        // signature exists" is not the same as "it works".
        var rCodes = Array.isArray(codes0) ? codes0 : [codes0];
        boxes.push(
          '<li class="goal-box goal-box--run' + (isMet === true ? " is-met" : "") + '">' +
          '<span class="tracker-tick tracker-tick--run" aria-hidden="true">' +
          (isMet === true ? "\u2713" : "\u25B6") + "</span>" +
          '<div class="goal-box-inner">' +
          '<div class="goal-box-header"><code class="goal-code">' +
          esc(S && S.rowLabel ? S.rowLabel(rCodes[0]) : rCodes[0]) + "</code></div>" +
          (rCodes.length > 1 ? '<div class="goal-box-members">' +
            memberRows(rCodes, null, isMet) + "</div>" : "") +
          '<div class="goal-box-caption">' + prose + "</div>" +
          "</div></li>"
        );
      } else if (gate === null || gate === undefined) {
        // Behaviour / run-gated goal
        behaviours.push(
          '<li class="goal-behaviour' + (isMet === true ? " is-met" : "") + '">' +
          '<span class="tracker-tick tracker-tick--run" aria-hidden="true">' +
          (isMet === true ? "\u2713" : "\u25B6") + "</span>" +
          '<span class="goal-prose">' + prose + "</span></li>"
        );
      } else if (gate.absent && !gate.type) {
        // Removal goal (absent-only gate) - struck-through box
        boxes.push(
          '<li class="goal-box goal-box--absent' + (isMet === true ? " is-met" : "") + '">' +
          '<span class="tracker-tick" aria-hidden="true">' + (isMet === true ? "\u2713" : "") + "</span>" +
          '<div class="goal-box-inner">' +
          '<div class="goal-box-header goal-box-header--absent">' +
          '<del><code class="goal-code">' + esc(gate.absent) + "</code></del></div>" +
          '<div class="goal-box-caption">' + prose + "</div>" +
          "</div></li>"
        );
      } else if (gate.type) {
        // Structural goal - UML class box
        var codes = g.code;
        var codeArr = !codes ? [] : (Array.isArray(codes) ? codes : [codes]);
        var header = codeArr.length > 0
          ? (S && S.rowLabel ? S.rowLabel(codeArr[0]) : codeArr[0])
          : (gate.kind ? gate.kind + " " : "class ") + gate.type;
        var members = codeArr.length > 1 ? codeArr.slice(1) : [];

        boxes.push(
          '<li class="goal-box' + (isMet === true ? " is-met" : "") + '">' +
          '<span class="tracker-tick" aria-hidden="true">' + (isMet === true ? "\u2713" : "") + "</span>" +
          '<div class="goal-box-inner">' +
          '<div class="goal-box-header"><code class="goal-code">' + esc(header) + "</code></div>" +
          (members.length ? '<div class="goal-box-members">' +
            memberRows(codeArr, gate, isMet) + "</div>" : "") +
          '<div class="goal-box-caption">' + prose + "</div>" +
          "</div></li>"
        );
      } else {
        // Fallback: just a prose line
        behaviours.push(
          '<li class="goal-behaviour">' +
          '<span class="goal-prose">' + prose + "</span></li>"
        );
      }
    }

    return boxes.join("") + behaviours.join("");
  }

  // Repaint the goal panel. Cheap enough to run on every keystroke - DOM is only
  // touched when something actually changed (diffed by the HTML string).
  function syncTracker(surface) {
    var ctx = surface.ctx;
    var task = surface.task;
    var S = structure();
    if (!task) return;
    if (!S) {
      if (!warnedNoStructure && (task.goals && task.goals.length)) {
        warnedNoStructure = true;
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[build] goal tracker disabled: window.KernelStructure was never loaded");
        }
      }
      return;
    }

    var goals = task.goals || [];
    if (!goals.length) return;

    var gates = goals.map(function (g) { return g && g.gate !== undefined ? g.gate : undefined; });
    var source = surface.editor ? surface.editor.getValue() : "";
    var types = scanTypes(source);
    if (!types) return;

    // S.verdicts is the one place that decides what a learner sees: the gate AND
    // every row under it. Reading S.evaluate here instead would let this view
    // drift from the tests and the validator.
    var met = S.verdicts
      ? S.verdicts(types, goals, source)
      : S.evaluate(types, gates, source);
    // Layer in run-gated state: a null gate is ticked by a passing run.
    for (var i = 0; i < met.length; i++) {
      if (met[i] === null && surface.runPassed) met[i] = true;
    }
    paintGoalTicks(surface, met, types, source);
  }

  // Render the UML goal panel. Only touches the DOM when the HTML actually changed.
  function paintGoalTicks(surface, met, types, source) {
    var list = surface.ctx.hosts.goal;
    if (!list || !met.length) return;
    if (!surface.goalHtml) return;

    // The rendered HTML is the only honest diff: a member row can change while
    // the box-level verdict does not, so comparing the met array would swallow
    // the repaint.
    surface.goalMet = met;
    var html = buildTrackerHtml(surface, met, types, source);
    if (list.innerHTML !== html) {
      list.innerHTML = html;
      // The tracker replaces each bullet with its own tick, so the list drops
      // the marker and the indent. It is opt-IN: `coach-list` is shared with the
      // drill Points list and the git goal list, which still want plain bullets.
      list.classList.add("has-tracker");
    }
  }

  // Snapshot the freshly painted (and freshly localized) goal prose so the tracker
  // can rebuild the UML boxes with the correct localized captions on each sync.
  function captureGoals(surface) {
    var list = surface.ctx.hosts.goal;
    var task = surface.task;
    surface.goalHtml = [];
    surface.goalMet = null;
    if (!list || !list.children) return;
    for (var i = 0; i < list.children.length; i++) {
      surface.goalHtml.push(list.children[i].innerHTML || "");
    }
  }

  // Output mismatch is the one result message that embeds lesson data (the
  // expected output), so the grading kernel cannot own its localized copy - it
  // stays English there and the plugin maps it to the active language here,
  // byte-for-byte as build-engine.mismatchMessage does.
  function mismatchMessage(ctx, expected) {
    var tr = ctx.tr;
    var LC = resolveLC();
    var G = grading();
    if (typeof window === "undefined" || !window.ChromeText || !LC) {
      return G ? G.describeExpected(expected) : "";
    }
    return Array.isArray(expected)
      ? LC.fill(
          tr("result.mismatchLines", "Expected these lines, in order:\n{lines}\nAdjust your code and run again."),
          { lines: expected.join("\n") }
        )
      : LC.fill(
          tr("result.mismatch", 'Expected a line equal to "{expected}". Adjust your code and run again.'),
          { expected: expected }
        );
  }

  // Map the grader's structured reason -> the SAME localized learner sentence
  // build-engine produces today. Compile/runtime/error branches are produced in
  // grade() before gradeOutput runs, so this only covers the grade reasons.
  function messageFor(ctx, task, result) {
    var tr = ctx.tr;
    switch (result.reason) {
      case "pass":
        return tr("result.pass", "Output matched what the task asked for. XP awarded.");
      case "mismatch":
        return mismatchMessage(ctx, task.expected);
      case "requirement":
        // The unmet-requirement message is lesson-authored (English), passed
        // through exactly as build-engine did.
        return result.message;
      case "verify":
        return (task.verify && task.verify.message) ||
          tr("result.verifyFail", "Your code printed the right answer for this example, but a hidden check with different inputs failed. Make the logic work for any input, not just this one.");
      default:
        return result.message || tr("result.notyet", "Not yet");
    }
  }

  // Best-effort warm-up: the runner warms on construction; reflect it in the Run
  // button so the learner knows the first run is being prepared.
  function warm(surface) {
    var ctx = surface.ctx;
    var runBtn = ctx.hosts.run;
    var tr = ctx.tr;
    if (runBtn) {
      runBtn.disabled = true;
      runBtn.textContent = tr("run.preparing", "Preparing compiler...");
    }
    return Promise.resolve(surface.runner.warm ? surface.runner.warm() : null)
      .catch(function () {})
      .then(function () {
        if (runBtn) {
          runBtn.disabled = false;
          runBtn.textContent = tr("nav.run", "Run");
        }
      });
  }

  var BuildPlugin = {
    archetype: "build",

    // Mount the Monaco editor + the shared Roslyn runner ONCE, wire the plugin's
    // own action buttons (Run / Show Solution / Reset), and return the surface the
    // core threads back into renderCard / grade / showSolution / reset.
    mount: function (ctx) {
      var hosts = ctx.hosts;
      var editor = new CodeLab.MonacoEditor();

      // A migrated lesson lives four dirs deep (content/<track>/<part>/<lesson>/),
      // so the root-relative runner host needs the same prefix its assets use; a
      // flat page (no LESSON_META) keeps the root-relative default. Same rule as
      // build-engine.
      var rootPrefix =
        typeof window !== "undefined" && window.LESSON_META && window.LESSON_META.id
          ? "../../../../"
          : "";
      var runnerUrl =
        (ctx.cfg && ctx.cfg.runnerUrl) || rootPrefix + "level3-app/index.html?runner=1";
      var runner = new CodeLab.RoslynIframeRunner({ url: runnerUrl });

      var outputPanel = ctx.helpers.createOutputPanel({
        output: hosts.output,
        errors: hosts.errors,
      });

      var surface = {
        ctx: ctx,
        editor: editor,
        runner: runner,
        outputPanel: outputPanel,
        task: null,
        taskIndex: 0,
        running: false,
      };

      // Run: run the current source, grade it, and report the result to the core
      // (which awards XP + paints the result panel). Exactly build-engine's flow.
      if (hosts.run) {
        hosts.run.addEventListener("click", function () {
          BuildPlugin.grade(surface, surface.task).then(function (result) {
            ctx.report(result);
          });
        });
      }
      if (hosts.solution) {
        hosts.solution.addEventListener("click", function () {
          BuildPlugin.showSolution(surface, surface.task);
        });
      }
      if (hosts.reset) {
        hosts.reset.addEventListener("click", function () {
          BuildPlugin.reset(surface, surface.task);
        });
      }

      return Promise.resolve(CodeLab.loadMonaco())
        .then(function () {
          return editor.mount(hosts.editor, {
            value: "",
            language: "csharp",
            readOnly: false,
            autoHeight: { minHeight: 160, maxHeight: 640 },
          });
        })
        .then(function () {
          // The live half of the goal tracker. onChange is OPTIONAL on the
          // editor contract, so an editor that cannot report edits leaves the
          // tracker painted at its last known state instead of being polled.
          if (typeof editor.onChange === "function") {
            surface.unwatch = editor.onChange(function () { surface.runPassed = false; syncTracker(surface); });
          }
          syncTracker(surface);
          warm(surface);
          return surface;
        });
    },

    // Paint one practice card body: load the starter into the editor, colorize the
    // example, show the expected line, and clear any prior output/errors.
    renderCard: function (surface, task, i) {
      surface.task = task;
      surface.taskIndex = i;
      surface.runPassed = false;
      var editor = surface.editor;
      // The core has just painted this card's goal list. Snapshot it BEFORE
      // touching the editor: setValue reports as a change, so the tracker can
      // run mid-render, and it must never capture its own ticks as the prose.
      captureGoals(surface);
      editor.setValue(task.starter || "");
      if (editor.setMarkers) editor.setMarkers([]);
      colorizeExample(surface.ctx, task);
      paintExpected(surface.ctx, task);
      surface.outputPanel.hideOutput();
      surface.outputPanel.clearErrors();
      syncTracker(surface);
    },

    // Run the learner source and grade it. Returns { ok, reason, message } for the
    // core's ctx.report. Compile / runtime / thrown-error branches short-circuit
    // before gradeOutput, exactly like build-engine.run.
    grade: function (surface, task) {
      var ctx = surface.ctx;
      var tr = ctx.tr;
      var editor = surface.editor;
      var runner = surface.runner;
      var op = surface.outputPanel;
      var runBtn = ctx.hosts.run;
      var G = grading();

      var source = editor.getValue();
      surface.code = source;
      surface.running = true;

      if (runBtn) {
        runBtn.disabled = true;
        runBtn.textContent = tr("run.running", "Running...");
      }
      op.showOutput(tr("run.compiling", "Compiling and running..."), false);
      op.clearErrors();
      if (ctx.hosts.result) ctx.hosts.result.hidden = true;

      return Promise.resolve(runner.run(source))
        .then(function (res) {
          if (res.errors && res.errors.length) {
            op.hideOutput();
            op.showErrors(res.errors);
            if (editor.setMarkers) editor.setMarkers(res.errors);
            return {
              ok: false,
              reason: "compile",
              message: tr("result.compileFail", "The code did not compile. Read the errors above and try again."),
            };
          }
          if (editor.setMarkers) editor.setMarkers([]);
          op.clearErrors();
          // Compiled, so nothing is blocked - but a warning here means the code
          // that just "worked" is not doing what it looks like it does, and that
          // is worth more than a green tick.
          if (op.showWarnings) op.showWarnings(res.warnings);
          if (res.runtimeError) {
            op.showOutput((res.output + "\n" + res.runtimeError).trim(), true);
            return {
              ok: false,
              reason: "runtime",
              message: tr("result.runtimeError", "It ran but threw an error. Fix it and run again."),
            };
          }
          var out = (res.output || "").trim();
          op.showOutput(out || tr("run.noOutput", "(no output)"), false);
          return Promise.resolve(
            G.gradeOutput(
              {
                source: source,
                output: out,
                expected: task.expected,
                requireSource: task.requireSource,
                verify: task.verify,
              },
              { run: function (src) { return runner.run(src); } }
            )
          ).then(function (result) {
            surface.runPassed = result.ok;
            syncTracker(surface);
            return {
              ok: result.ok,
              reason: result.reason,
              message: messageFor(ctx, task, result),
            };
          });
        })
        .catch(function (err) {
          op.showOutput((err && err.message) || tr("run.couldNotRun", "Could not run the code."), true);
          return {
            ok: false,
            reason: "error",
            message: tr("result.error", "Something went wrong running the code."),
          };
        })
        .then(function (result) {
          surface.running = false;
          if (runBtn) {
            runBtn.disabled = false;
            runBtn.textContent = tr("nav.run", "Run");
          }
          return result;
        });
    },

    // Drop the reference solution into the editor (does not grade).
    showSolution: function (surface, task) {
      var t = task || surface.task;
      if (!t) return;
      surface.code = t.solution;
      surface.editor.setValue(t.solution || "");
      syncTracker(surface);
    },

    // Restore the starter and clear the run/result surfaces.
    reset: function (surface, task) {
      var t = task || surface.task;
      if (!t) return;
      surface.code = t.starter;
      surface.runPassed = false;
      surface.editor.setValue(t.starter || "");
      if (surface.editor.setMarkers) surface.editor.setMarkers([]);
      surface.outputPanel.hideOutput();
      surface.outputPanel.clearErrors();
      if (surface.ctx.hosts.result) surface.ctx.hosts.result.hidden = true;
      syncTracker(surface);
    },

    // The core's applyChrome re-localizes XP + Next only; the Run label and the
    // code-only expected line are the plugin's to refresh on a locale swap. The
    // editor buffer, output, and result are left untouched (the core repaints the
    // result thunk).
    setLocale: function (surface, task) {
      var ctx = surface.ctx;
      var runBtn = ctx.hosts.run;
      if (runBtn && !surface.running) runBtn.textContent = ctx.tr("nav.run", "Run");
      paintExpected(ctx, task);
      // The core repainted the goal list in the new language, so the snapshot
      // the ticks are rebuilt from has to be retaken before they go back on.
      captureGoals(surface);
      syncTracker(surface);
    },
  };

  return BuildPlugin;
});
