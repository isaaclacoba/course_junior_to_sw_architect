/*
 * kernel/engine/plugins/lab-plugin.js - the "lab" archetype for the generic
 * lesson engine (kernel/engine/lesson-engine.js).
 *
 * A LAB card is a practice card whose work surface is CodeLab.VizLab - the
 * learner's own C#, compiled for real, with the objects it creates drawn beside
 * it. It is graded on WHAT THE PROGRAM DID, read off the execution trace, rather
 * than on the text they typed or the line they printed. The thing marked is the
 * thing on screen.
 *
 * WHY A PRACTICE PLUGIN AND NOT A WIDGET ONE. `viz` is a widget plugin because a
 * viz lesson is one self-contained visual with nothing to grade. A lab card has a
 * task, a goal list and a verdict, so it wants every piece of core chrome the
 * build plugin gets - the card header, the goal panel, the result panel, task
 * nav and XP. Only the body differs.
 *
 * THE STACK, TOP DOWN, ONE WAY:
 *
 *   lab-plugin        this file  - the card: task, goals, verdict, XP
 *     CodeLab.VizLab             - editor + real Roslyn compiler + the trace
 *       CodeLab.MemoryViz        - draws a Step[]; knows nothing above it
 *
 * No new editor, no new runner, no new visual. VizLab already existed and
 * already worked; this plugin puts a task around it.
 *
 * ONE COMPILER PER PAGE. VizLab builds its own compiler iframe and warming it
 * costs seconds, so the widget is mounted ONCE and every card reuses it through
 * `setSource`. Never mount a lab card beside a build card.
 *
 * GRADING IS THE TRACE, NEVER THE SOURCE. `KernelTraceMatch` (kernel/grading/)
 * turns a task's `gates` into a verdict over the trace VizLab hands back. This
 * file decides WHEN to grade and what to do with the answer; what a gate means
 * is not its business.
 *
 * Loaded two ways with no bundler (same UMD shape as build-plugin.js):
 *   - browser: a <script> loads it after lesson-engine.js; it registers itself.
 *   - node:    module.exports the plugin, and it registers on the core it
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

  // Resolve collaborators lazily, the same way build-plugin does, so the plugin
  // is testable off fake globals and never hard-depends on script load order.
  function codeLab() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.CodeLab) return g.CodeLab;
    return (typeof window !== "undefined" && window.CodeLab) || null;
  }
  function chromeText() {
    if (typeof window !== "undefined" && window.ChromeText) return window.ChromeText;
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    return (g && g.window && g.window.ChromeText) || null;
  }
  function trackerWidget() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelGoalTracker) return g.KernelGoalTracker;
    if (typeof require === "function") {
      try { return require("../widgets/goal-tracker.js"); } catch (e) {}
    }
    return null;
  }
  // The trace gate vocabulary. Absent until it is loaded, and the plugin says so
  // rather than inventing a verdict - see gradeOutcome.
  function traceMatch() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelTraceMatch) return g.KernelTraceMatch;
    if (typeof require === "function") {
      try { return require("../../grading/trace-match.js"); } catch (e) {}
    }
    return null;
  }
  function traceGoals() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelTraceGoalProvider) return g.KernelTraceGoalProvider;
    if (typeof require === "function") {
      try { return require("../widgets/trace-goal-provider.js"); } catch (e) {}
    }
    return null;
  }

  // VizLab's own chrome + the MemoryViz panel labels it passes down, as viz.*
  // keys. Absent keys keep code-lab's English defaults, so the default language
  // stays byte-identical. Same mechanism as viz-plugin's applyVizLabels.
  // These MUST be the field names on code-lab's own VizLabels - a name that is not
  // one (this list once carried `hpStack`, `hpHeap`, `consoleTitle` and three
  // `hpFrame*` that never existed) is silently dropped by the widget, so the label
  // renders in English on a Spanish page and nothing anywhere complains.
  // `test/lab-plugin.test.js` asserts every key here is a real VizLabels field.
  var LAB_LABEL_KEYS = [
    "prev", "play", "pause", "next", "nextLesson", "reset", "step",
    "textSize", "textSmall", "textDefault", "textLarge",
    "hpMemory", "hpMemoryNote", "hpStatics", "hpStaticsNote", "hpConstants", "hpConstantsNote",
    "hpKindEntry", "hpKindStatic", "hpKindMethod", "hpKindCtor", "hpOn", "hpPaused",
    "hpThis", "hpSecParams", "hpSecLocals",
    "consoleHead", "consoleIdle",
    "vlVisualize", "vlPreparing", "vlTracing", "vlHint", "vlNoSteps", "vlNoStepsHint",
    "vlDidNotCompile", "vlFailedHint", "vlTracedOne", "vlTracedMany", "vlTruncated", "vlThrew",
    "vlBootDownload", "vlBootStart", "vlBootWarm", "vlTracingSecs",
  ];

  function labelsFromChrome() {
    var C = chromeText();
    if (!C) return null;
    var labels = {};
    var any = false;
    LAB_LABEL_KEYS.forEach(function (k) {
      var v = C["viz." + k];
      if (v != null) { labels[k] = v; any = true; }
    });
    return any ? labels : null;
  }

  // A migrated lesson lives four dirs deep (content/<track>/<part>/<lesson>/), so
  // the root-relative compiler host needs the same prefix its assets use; a flat
  // page (no LESSON_META) keeps the root-relative default. Same rule as build.
  function runnerUrl(cfg) {
    if (cfg && cfg.runnerUrl) return cfg.runnerUrl;
    var deep =
      typeof window !== "undefined" && window.LESSON_META && window.LESSON_META.id;
    return (deep ? "../../../../" : "") + "level3-app/index.html?runner=1";
  }

  // ---- the live goal tracker ------------------------------------------------
  // The panel is kernel/engine/widgets/goal-tracker.js and the meaning of a trace
  // goal is the provider's. This plugin only says WHEN to repaint and hands over
  // the state the provider reads: the last outcome, and whether the card passed.
  //
  // The tracker is a GUIDE, never a grade. XP comes ONLY from a real run.
  function tracker(surface) {
    var W = trackerWidget();
    var host = surface.ctx.hosts.goal;
    if (!W || !host) return null;
    if (!surface.tracker || surface.trackerHost !== host) {
      surface.tracker = W.create({
        host: host,
        provider: traceGoals(),
        escapeHtml: surface.ctx.helpers.escapeHtml,
      });
      surface.trackerHost = host;
    }
    return surface.tracker;
  }

  // Snapshot the freshly painted - and freshly localized - goal prose, then set
  // the goals the tracker paints. Runs on every render and every locale swap,
  // BEFORE the first sync of that card, or the tracker captures its own ticks.
  function captureGoals(surface) {
    var t = tracker(surface);
    if (!t) return;
    var goals = (surface.task && surface.task.goals) || [];
    t.capture().setGoals(goals);
    if (!goals.length && t.clear) t.clear();
  }

  function syncTracker(surface) {
    var task = surface.task;
    if (!task || !(task.goals && task.goals.length)) return;
    var t = tracker(surface);
    if (!t) return;
    var met = t.sync({
      outcome: surface.lastOutcome || null,
      passed: !!surface.runPassed,
    });
    if (met) surface.goalMet = met;
  }

  var warnedNoMatcher = false;

  // Turn a VizTraceOutcome into the { ok, reason, message } the core reports.
  //
  // The four not-traced statuses are NOT wrong answers, and none of them may
  // read as one: a program that did not compile, threw, produced no steps, or
  // met a compiler that never loaded has told us nothing about the learner's
  // understanding. Each gets its own message and none of them ticks a goal.
  function gradeOutcome(surface, task, outcome) {
    var ctx = surface.ctx;
    var tr = ctx.tr;

    if (!outcome || outcome.status === "failed") {
      return { ok: false, reason: "tracer", message: tr(
        "lab.tracerFailed",
        "The visualizer could not start, so there is nothing to check yet. Reload the page - a stale cached compiler is the usual cause.",
      ) };
    }
    if (outcome.status === "did-not-compile") {
      return { ok: false, reason: "compile", message: tr(
        "lab.didNotCompile",
        "The code did not compile, so it never ran. Fix the errors listed under the editor and visualize again.",
      ) };
    }
    if (outcome.status === "threw") {
      return { ok: false, reason: "runtime", message: tr(
        "lab.threw",
        "The program started and then crashed, so the picture stops where it broke. Read the last step, then visualize again.",
      ) };
    }
    if (outcome.status === "no-steps") {
      return { ok: false, reason: "empty", message: tr(
        "lab.noSteps",
        "The program ran but did nothing worth drawing. Make an object inside `Main` so there is something to see.",
      ) };
    }

    var M = traceMatch();
    if (!M || typeof M.gradeTrace !== "function") {
      // Say the check could not run. Reporting "correct" here would hand out XP
      // for a check nobody performed, and reporting "wrong" would blame the
      // learner for our missing file.
      if (!warnedNoMatcher) {
        warnedNoMatcher = true;
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[lab] kernel/grading/trace-match.js was never loaded - no card can be graded");
        }
      }
      return { ok: false, reason: "ungraded", message: tr(
        "lab.ungraded",
        "Your code ran and the picture is above, but this card's check could not run. This is a fault on our side, not yours.",
      ) };
    }

    return M.gradeTrace(outcome.trace, (task && task.gates) || [], {
      tr: tr,
      expected: task && task.expected,
    });
  }

  var LabPlugin = {
    archetype: "lab",

    // Mount VizLab ONCE into the card's work surface and keep it for every card:
    // it owns a compiler iframe, and warming a second one costs the learner
    // seconds for nothing. Returns the surface the core threads back into
    // renderCard / grade / showSolution / reset / setLocale.
    mount: function (ctx) {
      var CL = codeLab();
      var hosts = ctx.hosts;
      var host = hosts.editor || hosts.surface;
      if (!CL || !CL.VizLab || !host) {
        if (typeof console !== "undefined" && console.error) {
          console.error("lab-plugin: CodeLab.VizLab or the editor host is missing");
        }
        return Promise.resolve({ ctx: ctx, lab: null, task: null, taskIndex: 0 });
      }

      var surface = {
        ctx: ctx,
        lab: null,
        task: null,
        taskIndex: 0,
        runPassed: false,
        lastOutcome: null,
        // A trace takes seconds, and the learner can press Next while one is
        // still running. `cardEpoch` counts card renders; `runEpoch` is the value
        // stamped when Visualize was pressed. A trace whose stamp no longer
        // matches belongs to a card that is off screen, and grading it would
        // judge the new card on the old card's code - which passed card 2 before
        // it had been read, let alone run.
        cardEpoch: 0,
        runEpoch: -1,
      };

      // The trace arrives when the learner presses Visualize, which is the only
      // moment a lab card can be judged: grade it, repaint the goals, and report
      // to the core so it paints the verdict and awards XP exactly as it does
      // for a build card.
      surface.lab = CL.VizLab.create(host, {
        runnerUrl: runnerUrl(ctx.cfg),
        starter: "",
        labels: labelsFromChrome() || undefined,
        narration: (ctx.cfg && ctx.cfg.narration) || undefined,
        onTrace: function (outcome) {
          if (surface.runEpoch !== surface.cardEpoch) return; // a previous card's run
          surface.lastOutcome = outcome;
          var result = gradeOutcome(surface, surface.task, outcome);
          surface.runPassed = !!(result && result.ok);
          syncTracker(surface);
          ctx.report(result);
        },
      });

      // The card's own two buttons. There is no Run button to bind - VizLab owns
      // Visualize, and that press is the run this card grades.
      //
      // They are also MOVED into VizLab's toolbar, next to Visualize. All three
      // act on the same editor, so leaving Visualize alone above the editor and
      // the other two in a row below reads as two unrelated controls; the learner
      // has to look in two places for one set of actions.
      // The test double is a plain object, not an element - so ask before calling.
      var toolbar = (host && typeof host.querySelector === "function")
        ? host.querySelector(".cl-vl-toolbar") : null;

      // "A run started on the card that is on screen." The press and the trace
      // are separate events seconds apart, so this is the only moment the run
      // can be stamped with the card it belongs to. It hangs off the widget
      // handle because the widget is what knows a run began - the click listener
      // below is simply the browser's way of saying so.
      surface.lab.beginRun = function () { LabPlugin.beginRun(surface); };

      // Capture phase, so the stamp is set before VizLab's own handler runs.
      var vizBtn = toolbar && toolbar.querySelector(".cl-vl-run");
      if (vizBtn) {
        vizBtn.addEventListener("click", surface.lab.beginRun, true);
      }

      if (toolbar && hosts.actions) {
        var status = toolbar.querySelector(".cl-vl-status");
        [hosts.solution, hosts.reset].forEach(function (btn) {
          if (btn) toolbar.insertBefore(btn, status);
        });
        hosts.actions.hidden = true;
      }

      if (hosts.solution) {
        hosts.solution.addEventListener("click", function () {
          LabPlugin.showSolution(surface, surface.task);
        });
      }
      if (hosts.reset) {
        hosts.reset.addEventListener("click", function () {
          LabPlugin.reset(surface, surface.task);
        });
      }

      return Promise.resolve(surface);
    },

    // Paint one card body: load its starter, and clear the verdict state so the
    // previous card's pass cannot tick this card's goals.
    renderCard: function (surface, task, i) {
      surface.task = task;
      surface.taskIndex = i;
      surface.runPassed = false;
      surface.lastOutcome = null;
      surface.cardEpoch += 1; // any trace still in flight now belongs to no card
      // The core has just painted this card's goal list. Snapshot it BEFORE the
      // first sync, so the tracker never captures its own ticks as the prose.
      captureGoals(surface);
      if (surface.lab && surface.lab.setSource) surface.lab.setSource(task.starter || "");
      syncTracker(surface);
    },

    // "The learner pressed Visualize." The press and the trace are separate
    // events seconds apart, so the run has to be stamped with the card it
    // started on - see `cardEpoch`. This is the transition the button fires and
    // the one a test must fire to model a press honestly.
    beginRun: function (surface) {
      surface.runEpoch = surface.cardEpoch;
    },

    // A lab card is graded from the trace, which arrives on the widget's own
    // Visualize press - so there is no separate Run button and nothing to do
    // here. The core calls this only if a page wires one; answering honestly
    // beats reporting a pass nobody earned.
    grade: function (surface) {
      var tr = surface.ctx.tr;
      return Promise.resolve({ ok: false, reason: "not-run", message: tr(
        "lab.pressVisualize",
        "Press Visualize to run your code - that is what this card checks.",
      ) });
    },

    showSolution: function (surface, task) {
      if (surface.lab && surface.lab.setSource && task && task.solution) {
        surface.lab.setSource(task.solution);
        surface.runPassed = false;
        surface.lastOutcome = null;
        syncTracker(surface);
      }
    },

    reset: function (surface, task) {
      if (surface.lab && surface.lab.setSource) {
        surface.lab.setSource((task && task.starter) || "");
        surface.runPassed = false;
        surface.lastOutcome = null;
        syncTracker(surface);
      }
    },

    // A language swap re-binds cfg upstream, then the core repaints the card
    // prose and calls this. The learner's own code and the picture they just
    // produced both survive: only the goal panel is re-snapshotted, because the
    // core has just repainted it in the new language.
    setLocale: function (surface) {
      if (!surface) return;
      captureGoals(surface);
      syncTracker(surface);
    },
  };

  return LabPlugin;
});
