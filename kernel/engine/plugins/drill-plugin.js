/*
 * kernel/engine/plugins/drill-plugin.js - the "drill" archetype as a plugin for
 * the generic lesson engine (kernel/engine/lesson-engine.js).
 *
 * This is the archetype-specific MIDDLE of drill-engine.js and nothing else: the
 * fill-in-the-blank work surface (the snippet + numbered blanks, the coach points,
 * the optional knowledge-check quiz, the optional diagram), the Check / Hint /
 * Show Answer / Reset behaviour, and the pass/fail grading. Everything the core
 * now owns (header, XP + award, the result panel + its localized thunk, summary,
 * prev/next nav, setLocale fan-out, self-boot) is deliberately absent - the plugin
 * only mounts a surface, paints a card body, grades a check, and hands the result
 * back through ctx.report.
 *
 * Grading is NOT re-implemented: the plugin compares typed values through
 * window.KernelBlankMatch.gradeBlanks (kernel/grading/blank-match.js), which lifts
 * drill-engine's exact/close comparison verbatim, so grading is byte-identical. The
 * plugin only maps the grader's outcome (+ the quiz gate) to the SAME localized
 * chrome sentences drill-engine produces.
 *
 * Quiz gate: a card that carries a `quiz` requires BOTH every blank exact AND the
 * correct option picked before it passes - the same rule as drill-engine.check().
 *
 * Loaded two ways with no bundler (same UMD shape as build-plugin.js):
 *   - browser: a <script> loads it after lesson-engine.js; it self-registers.
 *   - node:    module.exports the plugin object, registered on the core it
 *     require()s, so it is unit-testable with a fake DOM (no runner - a drill has
 *     nothing external to stub).
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

  // Resolve LessonCommon (for renderInline / escapeHtml) and KernelBlankMatch the
  // same lazy way build-plugin does, so the plugin is testable off a fake global
  // and never hard-depends on load order at module-eval time.
  function resolveLC() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.LessonCommon) return g.LessonCommon;
    if (typeof require === "function") {
      try { return require("../../page-shell/lesson-common.js"); } catch (e) {}
    }
    return null;
  }
  function blankMatch() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.KernelBlankMatch) return g.KernelBlankMatch;
    if (typeof require === "function") {
      try { return require("../../grading/blank-match.js"); } catch (e) {}
    }
    return null;
  }

  // ---- text helpers (from drill-engine) -----------------------------------
  // Code mode: `{{n}}` markers become "__n__" gap placeholders in the snippet.
  function withGaps(snippet) {
    return String(snippet || "").replace(/\{\{(\d+)\}\}/g, function (_, n) { return "__" + n + "__"; });
  }
  // Theory mode: render the snippet as prose, turning `backtick` spans into inline
  // <code>, each `{{n}}` into a numbered blank slot, and newlines into <br>.
  // Reproduced from drill-engine.renderProse.
  function renderProseTheory(LC, text) {
    return (text || "")
      .split(/(`[^`]+`)/)
      .map(function (seg) {
        return seg.length > 1 && seg.charAt(0) === "`" && seg.charAt(seg.length - 1) === "`"
          ? "<code>" + LC.escapeHtml(seg.slice(1, -1)) + "</code>"
          : LC.escapeHtml(seg)
              .replace(/\{\{(\d+)\}\}/g, '<sup class="cloze-n">$1</sup><span class="cloze"></span>')
              .replace(/\n/g, "<br>");
      })
      .join("");
  }

  function modeOf(ctx) {
    return ctx.cfg && ctx.cfg.mode === "theory" ? "theory" : "code";
  }

  // Per-card state, created lazily and kept across navigation (like drill-engine's
  // progress[]/quizState[]), so returning to a card preserves typed values.
  function ensureState(surface, i) {
    if (!surface.states[i]) {
      surface.states[i] = { values: {}, hints: {}, inputs: {}, quizChosen: -1, quizOrder: null };
    }
    return surface.states[i];
  }

  // ---- optional multiple-choice quiz --------------------------------------
  // Faithful to drill-engine: whether the picked option is the correct one.
  function quizAnswered(task, state) {
    if (!task.quiz) return true;
    var chosen = state.quizChosen;
    var opts = task.quiz.options || [];
    return chosen >= 0 && Boolean(opts[chosen] && opts[chosen].correct);
  }

  function setQuizFeedback(surface, task, state) {
    var LC = resolveLC();
    var feedback = surface.el("QuizFeedback");
    if (!feedback) return;
    var chosen = state.quizChosen;
    var opts = task.quiz.options || [];
    if (chosen < 0) {
      feedback.hidden = true;
      feedback.textContent = "";
      feedback.classList.remove("is-good", "is-bad");
      return;
    }
    var correct = Boolean(opts[chosen] && opts[chosen].correct);
    feedback.hidden = false;
    feedback.innerHTML = LC.renderInline(
      ((correct ? "Correct. " : "Not quite. ") + (task.quiz.answerWhy || "")).trim()
    );
    feedback.classList.toggle("is-good", correct);
    feedback.classList.toggle("is-bad", !correct);
  }

  function renderQuiz(surface, task, state) {
    var LC = resolveLC();
    var quiz = surface.ctx.hosts.quiz;
    if (!quiz) return;
    if (!task.quiz) { quiz.hidden = true; return; }
    quiz.hidden = false;

    var question = surface.el("Question");
    var options = surface.el("Options");
    if (question) question.innerHTML = LC.renderInline(task.quiz.question || "");
    if (options) {
      options.innerHTML = "";
      // Shuffle the option order once per card so the correct answer is not always
      // in the same slot; `chosen` still indexes the original array. From
      // drill-engine.renderQuiz.
      if (!state.quizOrder) {
        state.quizOrder = (task.quiz.options || []).map(function (_, i) { return i; });
        for (var j = state.quizOrder.length - 1; j > 0; j--) {
          var k = Math.floor(Math.random() * (j + 1));
          var tmp = state.quizOrder[j];
          state.quizOrder[j] = state.quizOrder[k];
          state.quizOrder[k] = tmp;
        }
      }
      state.quizOrder.forEach(function (orig) {
        var opt = task.quiz.options[orig];
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn";
        btn.innerHTML = LC.renderInline(opt.text);
        if (state.quizChosen === orig) btn.classList.add(opt.correct ? "correct" : "wrong");
        btn.addEventListener("click", function () {
          state.quizChosen = orig;
          Array.prototype.slice.call(options.children || []).forEach(function (c) {
            c.classList.remove("correct", "wrong");
          });
          btn.classList.add(opt.correct ? "correct" : "wrong");
          setQuizFeedback(surface, task, state);
        });
        options.appendChild(btn);
      });
    }
    setQuizFeedback(surface, task, state);
  }

  // ---- optional mermaid diagram -------------------------------------------
  function renderDiagram(surface, task) {
    var diagram = surface.ctx.hosts.diagram;
    if (!diagram) return;
    if (!task.mermaid || typeof window === "undefined" || !window.mermaid) {
      diagram.hidden = true;
      diagram.innerHTML = "";
      return;
    }
    diagram.hidden = false;
    var id = surface.ctx.prefix + "-mmd-" + (surface.diagramSeq++);
    try {
      window.mermaid
        .render(id, task.mermaid)
        .then(function (r) { diagram.innerHTML = r.svg; })
        .catch(function () { diagram.hidden = true; });
    } catch (e) {
      diagram.hidden = true;
    }
  }

  // ---- blank input rows ---------------------------------------------------
  function renderBlanks(surface, task, state, mode) {
    var ctx = surface.ctx;
    var host = ctx.hosts.inputs;
    if (!host) return;
    var placeholder =
      (ctx.cfg && ctx.cfg.inputPlaceholder) ||
      (mode === "theory" ? "Type your answer" : "Write short C# code");

    host.innerHTML = "";
    state.inputs = {};
    (task.blanks || []).forEach(function (b, i) {
      var row = document.createElement("div");
      row.className = "input-row";

      var label = document.createElement("label");
      label.setAttribute("for", ctx.prefix + "-" + i);
      label.textContent = "Blank " + b.id + ": " + b.label;

      var input = document.createElement("input");
      input.id = ctx.prefix + "-" + i;
      input.value = state.values[b.id] != null ? state.values[b.id] : "";
      input.placeholder = placeholder;
      input.addEventListener("input", function (e) {
        state.values[b.id] = e && e.target ? e.target.value : input.value;
        input.classList.remove("correct", "wrong", "almost");
      });

      var hint = document.createElement("div");
      hint.className = "hint";
      var h = state.hints[b.id];
      if (h != null && h >= 0) {
        var hints = b.hints || [];
        var n = Math.min(h, hints.length - 1);
        hint.textContent = "Hint: " + (hints[n] || "");
      }

      row.appendChild(label);
      row.appendChild(input);
      row.appendChild(hint);
      host.appendChild(row);
      state.inputs[b.id] = input;
    });
  }

  var DrillPlugin = {
    archetype: "drill",

    // Wire the plugin's own action buttons (Check / Hint / Show Answer / Reset)
    // and return the surface the core threads back into renderCard / grade /
    // showSolution / reset. A drill has no editor and no runner, so there is
    // nothing to mount or warm.
    mount: function (ctx) {
      var hosts = ctx.hosts;
      var surface = {
        ctx: ctx,
        el: function (suffix) { return document.getElementById(ctx.prefix + suffix); },
        task: null,
        taskIndex: 0,
        states: [],
        diagramSeq: 0,
      };

      if (hosts.check) {
        hosts.check.addEventListener("click", function () {
          ctx.report(DrillPlugin.grade(surface, surface.task));
        });
      }
      if (hosts.hint) {
        hosts.hint.addEventListener("click", function () {
          DrillPlugin.hint(surface, surface.task);
        });
      }
      if (hosts.show) {
        hosts.show.addEventListener("click", function () {
          DrillPlugin.showSolution(surface, surface.task);
        });
      }
      if (hosts.reset) {
        hosts.reset.addEventListener("click", function () {
          DrillPlugin.reset(surface, surface.task);
        });
      }

      return surface;
    },

    // Paint one drill card body: the snippet (code or theory), the coach points,
    // the optional quiz + diagram, and the fill-in-the-blank inputs. Faithful to
    // drill-engine.render's practice branch.
    renderCard: function (surface, task, i) {
      var ctx = surface.ctx;
      var LC = resolveLC();
      surface.task = task;
      surface.taskIndex = i;
      var state = ensureState(surface, i);
      var mode = modeOf(ctx);

      var code = ctx.hosts.code;
      if (code) {
        if (mode === "theory") {
          code.className = "prose-text";
          code.innerHTML = task.snippet ? renderProseTheory(LC, task.snippet) : "";
        } else {
          code.className = "language-csharp";
          code.textContent = withGaps(task.snippet);
          if (typeof window !== "undefined" && window.Prism) window.Prism.highlightElement(code);
        }
      }

      var points = ctx.hosts.points;
      if (points) {
        points.innerHTML = "";
        (task.points || []).forEach(function (point) {
          var li = document.createElement("li");
          li.innerHTML = LC.renderInline(point);
          points.appendChild(li);
        });
      }

      renderQuiz(surface, task, state);
      renderDiagram(surface, task);
      renderBlanks(surface, task, state, mode);
    },

    // Grade the current card: compare typed values via KernelBlankMatch, paint the
    // per-blank correct/almost/wrong feedback on the inputs, apply the quiz gate,
    // and return { ok, reason, message } for the core's ctx.report. The messages
    // are the SAME sentences drill-engine.check produces.
    grade: function (surface, task) {
      var ctx = surface.ctx;
      var tr = ctx.tr;
      var BM = blankMatch();
      var state = ensureState(surface, surface.taskIndex);
      var mode = modeOf(ctx);

      var res = BM.gradeBlanks({ blanks: task.blanks, values: state.values });

      res.results.forEach(function (r) {
        var input = state.inputs[r.id];
        if (!input) return;
        input.classList.remove("correct", "wrong", "almost");
        if (r.status === "exact") input.classList.add("correct");
        else if (r.status === "almost") input.classList.add("almost");
        else input.classList.add("wrong");
      });

      if (!res.ok) {
        return {
          ok: false,
          reason: "blanks",
          message: tr("drill.keepGoing", "Keep going. Use the hint and try again."),
        };
      }
      if (!quizAnswered(task, state)) {
        return {
          ok: false,
          reason: "quiz",
          message: tr(
            "drill.quizPending",
            "Blanks are correct. Now pick the right answer to the knowledge check above to finish this card."
          ),
        };
      }
      return {
        ok: true,
        reason: "pass",
        message:
          mode === "theory"
            ? tr("drill.passTheory", "Nice - the idea and the recall both check out.")
            : tr("drill.passCode", "Good progress. This concept is now reinforced in code form."),
      };
    },

    // Hint: reveal the next hint for every blank (from -1 up to the last), then
    // re-render. From drill-engine.showHint.
    hint: function (surface, task) {
      var t = task || surface.task;
      if (!t) return;
      var state = ensureState(surface, surface.taskIndex);
      (t.blanks || []).forEach(function (b) {
        var hints = b.hints || [];
        var cur = state.hints[b.id];
        if (cur == null) cur = -1;
        state.hints[b.id] = cur < hints.length - 1 ? cur + 1 : cur;
      });
      DrillPlugin.renderCard(surface, t, surface.taskIndex);
    },

    // Show Answer: drop each blank's answer into its input, then re-render so the
    // learner can review it. From drill-engine.showAnswer (the input-filling part;
    // the result-panel copy is chrome the core governs).
    showSolution: function (surface, task) {
      var t = task || surface.task;
      if (!t) return;
      var state = ensureState(surface, surface.taskIndex);
      (t.blanks || []).forEach(function (b) { state.values[b.id] = b.answer; });
      DrillPlugin.renderCard(surface, t, surface.taskIndex);
    },

    // Reset: clear typed values, hints, and the quiz pick for the current card.
    // From drill-engine.resetDrill.
    reset: function (surface, task) {
      var t = task || surface.task;
      if (!t) return;
      surface.states[surface.taskIndex] = {
        values: {}, hints: {}, inputs: {}, quizChosen: -1, quizOrder: null,
      };
      DrillPlugin.renderCard(surface, t, surface.taskIndex);
    },

    // The core repaints title / context / concept and the result thunk; the plugin
    // repaints its own body (snippet, points, quiz, blanks) from the refreshed cfg,
    // preserving the learner's in-progress values.
    setLocale: function (surface, task) {
      var t = task || surface.task;
      if (!t) return;
      DrillPlugin.renderCard(surface, t, surface.taskIndex);
    },
  };

  return DrillPlugin;
});
