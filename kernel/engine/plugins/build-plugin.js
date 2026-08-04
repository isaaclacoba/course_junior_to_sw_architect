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

  // ---- the live goal tracker ----------------------------------------------
  // Two views of ONE question - what shape does the learner's code have RIGHT
  // NOW - answered by the shipped scanner (CodeLab.scanCSharp) and the pure
  // policy in kernel/grading/structure-match.js:
  //
  //   * the blueprint - the target types and their member SIGNATURES, ghosted
  //     until the learner's own code declares them. A signature says what to
  //     write without writing it, which is the gap that made a goal like
  //     "write a FeedingSign with string Format(bool hungry)" unreadable until
  //     you opened the solution.
  //   * the goal list - the very prose the core already painted and localized,
  //     with a tick on each goal that carries a gate.
  //
  // It is a GUIDE, never a grade. XP still comes only from a real run against
  // the real compiler; nothing here can pass a card. Every part is optional and
  // degrades quietly: no blueprint host, no scanner, or no onChange on the
  // editor simply means the card renders exactly as it did before.
  function scanTypes(source) {
    var CL = typeof CodeLab !== "undefined" ? CodeLab : null;
    if (!CL || typeof CL.scanCSharp !== "function") return null;
    try {
      var found = CL.scanCSharp(source || "");
      return (found && found.types) || [];
    } catch (e) {
      // A scanner is a heuristic over half-typed code; if it ever throws, the
      // lesson keeps working without the tracker.
      return null;
    }
  }

  // Three states, matching S.evaluate: true ticks, false shows an empty circle
  // waiting to be filled, and null - a goal with no structural test - shows an
  // invisible spacer. The spacer keeps every goal line indented to the same
  // margin, so an untracked goal reads as part of the list rather than as a
  // checkbox the learner can never satisfy.
  function tick(on) {
    if (on === null || on === undefined) {
      return '<span class="tracker-tick tracker-tick--none" aria-hidden="true"></span>';
    }
    return '<span class="tracker-tick" aria-hidden="true">' + (on ? "\u2713" : "") + "</span>";
  }

  // One blueprint box: the declaration line, then a chip per base and per
  // member, each lit on its own so a learner sees WHICH piece is still missing.
  function blueprintBox(ctx, S, types, want) {
    var esc = ctx.helpers.escapeHtml;
    var bases = want.bases || [];
    var members = want.members || [];
    var kind = want.kind || "class";
    var hasType = S.meets(types, { type: want.name, kind: want.kind });
    var baseHtml = bases.map(function (b) {
      var on = hasType && S.meets(types, { type: want.name, base: b });
      return '<li class="bp-chip bp-chip--base' + (on ? " is-met" : "") + '">: ' + esc(b) + "</li>";
    });
    var memberHtml = members.map(function (m) {
      var on = hasType && S.meets(types, { type: want.name, member: S.symbolName(m) });
      var label = typeof m === "string" ? m : (m.sig || m.name || "");
      return '<li class="bp-chip' + (on ? " is-met" : "") + '">' + esc(label) + "</li>";
    });
    var chips = baseHtml.concat(memberHtml);
    var whole =
      hasType &&
      bases.every(function (b) { return S.meets(types, { type: want.name, base: b }); }) &&
      members.every(function (m) { return S.meets(types, { type: want.name, member: S.symbolName(m) }); });
    return (
      '<div class="bp-box' + (whole ? " is-met" : "") + '">' +
      '<div class="bp-box-head">' + tick(whole) +
      '<span class="bp-kind">' + esc(kind) + "</span>" +
      '<span class="bp-name">' + esc(want.name) + "</span>" +
      "</div>" +
      (chips.length ? '<ul class="bp-chips">' + chips.join("") + "</ul>" : "") +
      "</div>"
    );
  }

  // Repaint both views. Cheap enough to run on every keystroke, but the DOM is
  // only touched when something actually changed, so typing stays smooth and a
  // half-typed identifier does not make the panel flicker.
  function syncTracker(surface) {
    var ctx = surface.ctx;
    var task = surface.task;
    var S = structure();
    if (!task) return;
    // A task that ASKED for a tracker and got no policy module is a wiring bug
    // (kernel/grading/structure-match.js missing from ARCHETYPE_DEPS.build), and
    // it fails invisibly - the panel simply never draws. Say so once.
    if (!S) {
      if (!warnedNoStructure && (task.blueprint || task.goalCheck)) {
        warnedNoStructure = true;
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[build] goal tracker disabled: window.KernelStructure was never loaded");
        }
      }
      return;
    }

    var wrap = ctx.hosts.blueprintWrap;
    var boxes = ctx.hosts.blueprint;
    var blueprint = task.blueprint || [];
    var gates = task.goalCheck || [];
    if (!blueprint.length && !gates.length) {
      if (wrap) wrap.hidden = true;
      return;
    }

    var types = scanTypes(surface.editor ? surface.editor.getValue() : "");
    // No scanner: leave the blueprint hidden rather than show a panel that can
    // never light up. A check that goes quiet is worse than no check.
    if (!types) {
      if (wrap) wrap.hidden = true;
      return;
    }

    if (boxes && blueprint.length) {
      if (wrap) wrap.hidden = false;
      var html = blueprint.map(function (want) { return blueprintBox(ctx, S, types, want); }).join("");
      if (html !== surface.blueprintHtml) {
        surface.blueprintHtml = html;
        boxes.innerHTML = html;
      }
    } else if (wrap) {
      wrap.hidden = true;
    }

    paintGoalTicks(surface, S.evaluate(types, gates));
  }

  // Decorate the goal list the CORE painted. The original prose is snapshotted
  // once per render so a tick can be re-applied without re-running renderInline
  // and without the markup accumulating ticks on every keystroke.
  function paintGoalTicks(surface, met) {
    var list = surface.ctx.hosts.goal;
    if (!list || !met.length) return;
    var items = list.children;
    if (!items || !items.length) return;
    // No snapshot yet means the prose has not been read; writing a tick now
    // would replace the goal text with an empty string.
    if (!surface.goalHtml) return;
    var base = surface.goalHtml;
    for (var i = 0; i < met.length && i < items.length; i++) {
      if (surface.goalMet && surface.goalMet[i] === met[i]) continue;
      var li = items[i];
      if (!li) continue;
      li.innerHTML = tick(met[i]) + (base[i] || "");
      if (li.classList) li.classList.toggle("is-met", met[i] === true);
    }
    surface.goalMet = met;
  }

  // Snapshot the freshly painted (and freshly localized) goal prose, and forget
  // any previous tick state so the next sync repaints from scratch.
  function captureGoals(surface) {
    var list = surface.ctx.hosts.goal;
    surface.goalHtml = [];
    surface.goalMet = null;
    surface.blueprintHtml = null;
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
            surface.unwatch = editor.onChange(function () { syncTracker(surface); });
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
