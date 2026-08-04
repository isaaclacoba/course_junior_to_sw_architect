/*
 * kernel/engine/lesson-engine.js - the generic lesson engine CORE + plugin registry.
 *
 * Design of record: docs/architecture/lesson-engine.md. This is the archetype-BLIND
 * core that owns all shared chrome, plus a plugin registry keyed by archetype. It
 * supports TWO plugin shapes: a PRACTICE plugin (build/drill/git) drives a graded
 * tasks[] through the card loop + result panel + ctx.report; a WIDGET plugin
 * (viz/checkpoint, plugin.body === "widget") owns one self-contained body (a
 * MemoryViz / Quiz) with no tasks, no grading, and no result panel - it awards its
 * own XP. It knows NOTHING about editors, Monaco,
 * Roslyn, blanks, terminals, or git - a plugin (a later step) owns its work
 * surface + its primary action and reports the result back through ctx.report.
 *
 * What the core owns (reproduced from build-engine.js / drill-engine.js, verbatim
 * in behaviour, minus the archetype middle):
 *   - the header (meta / title / context / concept / progress badge)
 *   - XP via LessonCommon.createProgress + one-time award gating per card
 *   - the result panel (show/hide + the localized-thunk repaint on locale change)
 *   - the summary / recap card (intro / list / close)
 *   - card index from location.hash + history.replaceState + a hashchange listener
 *   - prev / next nav, the "Next lesson" label + nextHref on the last card
 *   - LessonCommon.t chrome text + a setLocale() fan-out (manual/kernel mode)
 *   - the self-boot footer with the data-manual opt-out
 *
 * Loaded two ways with no bundler (same UMD shape as kernel/grading/output-match.js):
 *   - browser: a <script> sets window.LessonEngine; self-boots from window.LESSON_CONFIG.
 *   - node:    module.exports, so the core is unit-testable with a fake DOM + fake plugin.
 *
 * ---------------------------------------------------------------------------
 * PINNED OPEN 1 - ctx.hosts (the role -> element contract)
 * ---------------------------------------------------------------------------
 * hosts maps a stable ROLE name to the page element resolved by the existing
 * prefix + Suffix id convention (el(role) = getElementById(prefix + Suffix)), or
 * null when that page has no such element. The core never reads a host itself;
 * it is the seam a plugin uses to find its work surface + action buttons. The
 * documented role set (superset covering build / drill / git):
 *
 *   role      element suffix   used by / meaning
 *   --------  --------------   --------------------------------------------------
 *   surface   Surface          generic mount point for a plugin's work surface
 *   editor    Editor           build: the Monaco editor host
 *   inputs    Inputs           drill: the fill-in-the-blank input row
 *   terminal  Terminal         git:   the CodeLab.LineTerminal host
 *   graph     Graph            git:   the CodeLab.GitGraph host
 *   diagram   Diagram          drill: the coach diagram / mermaid host
 *   code      Code             drill: the read-only snippet host
 *   example   Example          build: the "here's the pattern" example host
 *   expected  Expected         build: the expected-output line
 *   goal      Goal             the per-card goal / checklist list
 *   points    Points           drill: the coach points list
 *   quiz      Quiz             drill: the knowledge-check box
 *   output    Output           run output surface
 *   errors    Errors           compile/run error surface
 *   actions   Actions          the action-button row
 *   result    Result           the pass/fail result panel
 *   run       Run              build/drill: the Run button
 *   check     Check            drill/git: the Check button
 *   solution  Solution         build: the Show Solution button
 *   reset     Reset            the Reset button
 *   hint      Hint             drill: the Hint button
 *   show      Show             drill: the Show Answer button
 *
 * ---------------------------------------------------------------------------
 * PINNED OPEN 2 - report(result) (what a plugin passes back)
 * ---------------------------------------------------------------------------
 *   ctx.report({ ok: boolean, message?: string, reason?: string })
 *   - ok === true  -> the core awards XP once for this card and paints a green
 *                     "Passed" result whose body is `message` (or a default).
 *   - ok === false -> the core paints a red "Not yet" result whose body is
 *                     `message` (falling back to `reason`, then a default).
 * `message` is the already-localized, learner-facing sentence; `reason` is a
 * shorter machine-ish cause a plugin may send instead of a full message. The
 * core stores it as a re-derivable thunk so setLocale() repaints it in the new
 * language while it is visible.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.LessonEngine = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  // role -> element-id Suffix. Documented in the file header (PINNED OPEN 1).
  var HOST_ROLES = {
    surface: "Surface",
    editor: "Editor",
    inputs: "Inputs",
    terminal: "Terminal",
    graph: "Graph",
    diagram: "Diagram",
    code: "Code",
    example: "Example",
    expected: "Expected",
    goal: "Goal",
    points: "Points",
    quiz: "Quiz",
    output: "Output",
    errors: "Errors",
    actions: "Actions",
    result: "Result",
    run: "Run",
    check: "Check",
    solution: "Solution",
    reset: "Reset",
    hint: "Hint",
    show: "Show",
  };

  // The plugin registry, keyed by archetype. Mirrors kernel/lesson-validators/.
  var registry = {};

  function register(plugin) {
    if (!plugin || !plugin.archetype) {
      throw new Error("LessonEngine.register: a plugin needs an { archetype } key");
    }
    registry[plugin.archetype] = plugin;
    return plugin;
  }

  // Resolve LessonCommon the same way the browser engines do (a global set by
  // kernel/page-shell/lesson-common.js), with a Node require fallback so the core
  // is testable. A test may replace globalThis.LessonCommon before create().
  function lessonCommon() {
    var g = typeof globalThis !== "undefined" ? globalThis : null;
    if (g && g.LessonCommon) return g.LessonCommon;
    if (typeof require === "function") {
      try { return require("../page-shell/lesson-common.js"); } catch (e) {}
    }
    return null;
  }

  // Prose can carry structure: a blank line starts a new paragraph, a run of
  // "- " lines becomes a bullet list, a single newline is a soft break. Backticks
  // and **bold** render inline. Identical to build-engine's renderProse; it is
  // shared chrome (block prose), not an archetype concern, so the core owns it and
  // also exposes it through ctx.helpers.
  function makeRenderProse(LC) {
    return function renderProse(text) {
      return (text || "")
        .split(/\n{2,}/)
        .map(function (block) {
          var lines = block.split("\n");
          var isList = lines.length > 0 && lines.every(function (l) { return /^\s*-\s+/.test(l); });
          if (isList) {
            var items = lines
              .map(function (l) { return "<li>" + LC.renderInline(l.replace(/^\s*-\s+/, "")) + "</li>"; })
              .join("");
            return '<ul class="context-list">' + items + "</ul>";
          }
          return '<span class="para">' + LC.renderInline(block).replace(/\n/g, "<br>") + "</span>";
        })
        .join("");
    };
  }

  // create(config) - the entry point. Looks up registry[config.archetype], builds
  // the ctx, and drives the shared lifecycle over config.tasks[]. In this step the
  // core takes a config OBJECT directly; the unified window.LESSON_CONFIG wiring is
  // a later step. Returns a controller { boot, render, setLocale } - the same shape
  // as BuildEngine.create, so kernel-controller can hold it in manual mode.
  function create(config) {
    var LC = lessonCommon();
    if (!LC) throw new Error("LessonEngine.create: LessonCommon is not available");

    var plugin = config && registry[config.archetype];
    if (!plugin) {
      if (typeof console !== "undefined") {
        console.error("LessonEngine.create: no plugin registered for archetype '" + (config && config.archetype) + "'");
      }
      return { boot: function () { return Promise.resolve(); }, render: function () {}, setLocale: function () {} };
    }
    if (!config || !Array.isArray(config.tasks) || !config.tasks.length) {
      // A PRACTICE plugin needs tasks; a WIDGET plugin (viz/checkpoint) owns one
      // self-contained body and carries none, so it is exempt from this guard.
      if (!(plugin.body === "widget")) {
        return { boot: function () { return Promise.resolve(); }, render: function () {}, setLocale: function () {} };
      }
    }
    var isWidget = plugin.body === "widget";

    var prefix = config.prefix;
    var tasks = Array.isArray(config.tasks) ? config.tasks : [];
    var metaLabel = config.metaLabel || "";
    var progressNoun = config.progressNoun || "Task";
    var xpKey = config.xpKey || "course_global_xp";
    var awardedKey = config.awardedKey || (prefix + "_awarded");
    var awardAmount = typeof config.awardAmount === "number" ? config.awardAmount : 20;
    var nextHref =
      config.nextHref ||
      (typeof window !== "undefined" && window.PAGE && window.PAGE.nextHref) ||
      "index.html";

    var el = function (suffix) { return document.getElementById(prefix + suffix); };

    // The role -> element host map (PINNED OPEN 1). Resolved once; a role with no
    // matching element on this page is null.
    var hosts = {};
    Object.keys(HOST_ROLES).forEach(function (role) {
      hosts[role] = el(HOST_ROLES[role]) || null;
    });

    // Core-owned chrome elements.
    var meta = el("Meta");
    var title = el("Title");
    var context = el("Context");
    var concept = el("Concept");
    var progress = el("Progress");
    var goal = el("Goal");
    var result = el("Result");
    var resultTitle = el("ResultTitle");
    var resultBody = el("ResultBody");
    var summary = el("Summary");
    var summaryIntro = el("SummaryIntro");
    var summaryList = el("SummaryList");
    var summaryClose = el("SummaryClose");
    var prevBtn = el("Prev");
    var nextBtn = el("Next");
    var xpLabel = document.getElementById("courseXpLabel");

    var course = LC.createProgress({ xpKey: xpKey, awardedKey: awardedKey });
    // A trailing recap card (task.summary) is content, not a graded task - it is
    // excluded from the count shown and from XP.
    var gradedCount = tasks.filter(function (t) { return !t.summary; }).length;

    var tr = LC.t;
    var renderInline = LC.renderInline;
    var escapeHtml = LC.escapeHtml;
    var renderProse = makeRenderProse(LC);

    function cardFromHash() { return LC.cardFromHash(tasks.length); }
    var idx = isWidget ? 0 : cardFromHash();
    var surface = null; // whatever plugin.mount returns

    var ctx = {
      hosts: hosts,
      cfg: config,
      prefix: prefix,
      tr: tr,
      runner: null, // a later plugin injects / creates its own shared Roslyn runner
      report: report,
      helpers: {
        renderInline: renderInline,
        renderProse: renderProse,
        escapeHtml: escapeHtml,
        createOutputPanel: LC.createOutputPanel,
      },
    };

    // ---- XP + award --------------------------------------------------------
    function renderXP() {
      if (xpLabel) xpLabel.textContent = tr("nav.xp", "Course XP:") + " " + course.xp();
    }
    function award(taskIndex) {
      if (course.isAwarded(taskIndex)) return;
      course.markAwarded(taskIndex);
      course.addXP(awardAmount);
      renderXP();
    }

    // ---- result panel (+ localized thunk) ----------------------------------
    function showResult(ok, body) {
      if (!result) return;
      result.hidden = false;
      result.classList.toggle("is-pass", ok);
      result.classList.toggle("is-fail", !ok);
      if (resultTitle) resultTitle.textContent = ok ? tr("result.passed", "Passed") : tr("result.notyet", "Not yet");
      if (resultBody) resultBody.textContent = body;
    }
    // Remember the last result as a re-derivable thunk so setLocale can repaint it
    // in the new language (title localizes via chrome; body is re-derived). Gated
    // on the panel being visible, so a stale thunk is never shown.
    var lastResult = null;
    function setResult(ok, bodyFn) {
      lastResult = { ok: ok, bodyFn: bodyFn };
      showResult(ok, bodyFn());
    }

    // The seam (PINNED OPEN 2): a plugin wires its own action and calls this. The
    // core awards XP, paints the result panel, and leaves nav enabled.
    function report(res) {
      res = res || {};
      var task = tasks[idx];
      if (res.ok) {
        award(idx);
        setResult(true, function () {
          return res.message || tr("result.pass", "Output matched what the task asked for. XP awarded.");
        });
      } else {
        setResult(false, function () {
          return res.message || res.reason || tr("result.notyet", "Not yet");
        });
      }
      if (nextBtn) nextBtn.disabled = false;
      return res;
    }

    // ---- prose painters ----------------------------------------------------
    // The goal list lives in its own <section class="coach">, which carries the
    // "Goal" heading. Emptying the list is not enough - the heading would sit
    // there over nothing - so the whole section is hidden on a card that has no
    // goal, and shown again on one that does.
    function hideGoalSection(hidden) {
      if (!goal) return;
      var section = goal.closest ? goal.closest("section") : null;
      if (section) section.hidden = hidden;
    }
    function paintGoal(task) {
      if (!goal) return;
      goal.innerHTML = "";
      (task.goal || []).forEach(function (g) {
        var li = document.createElement("li");
        li.innerHTML = renderInline(g);
        goal.appendChild(li);
      });
    }
    function paintSummaryProse(task) {
      if (summaryIntro) summaryIntro.innerHTML = renderInline(task.summaryIntro || "");
      if (summaryList) {
        summaryList.innerHTML = "";
        (task.summaryItems || []).forEach(function (item) {
          var li = document.createElement("li");
          var strong = document.createElement("strong");
          strong.innerHTML = renderInline(item.title || "");
          li.appendChild(strong);
          var span = document.createElement("span");
          span.innerHTML = renderInline(item.text || "");
          li.appendChild(span);
          summaryList.appendChild(li);
        });
      }
      if (summaryClose) summaryClose.innerHTML = renderInline(task.summaryClose || "");
    }

    // Re-apply the dynamic chrome the core owns (labels page-shell has no data-t
    // for): the XP counter and the idx-dependent Next label.
    function applyChrome() {
      renderXP();
      if (nextBtn) {
        nextBtn.textContent = idx === tasks.length - 1 ? tr("nav.nextLesson", "Next lesson") : tr("nav.next", "Next");
      }
    }

    // ---- render ------------------------------------------------------------
    function render() {
      if (isWidget) {
        // A widget lesson's whole body is created by plugin.mount; the core adds no
        // card chrome, result panel, or task nav - only the final "Next lesson" step.
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) {
          nextBtn.disabled = false;
          nextBtn.textContent = tr("nav.nextLesson", "Next lesson");
        }
        return;
      }
      var task = tasks[idx];
      try { history.replaceState(null, "", "#" + (idx + 1)); } catch (e) {}
      if (meta) meta.textContent = metaLabel;
      if (title) title.textContent = task.title || "";
      if (context) context.innerHTML = renderProse(task.context);
      if (concept) concept.textContent = task.concept || "";
      if (progress) {
        progress.textContent = task.summary
          ? tr("card.recap", "Recap")
          : progressNoun + " " + (idx + 1) + " / " + gradedCount;
      }

      if (task.summary) {
        // Recap card: core-owned content. Hide the plugin's work surface and the
        // result panel, show the summary section.
        if (result) result.hidden = true;
        if (summary) summary.hidden = false;
        if (plugin.deactivate) plugin.deactivate(surface, task);
        // A recap has no goal, so the previous card's goal list must go with it.
        // Leaving it behind showed the last exercise's steps under a "Goal"
        // heading on the recap - and because setLocale only repaints the CURRENT
        // card's prose, a language switch left that stale list in the old
        // language while everything around it changed.
        paintGoal(task);
        hideGoalSection(true);
        paintSummaryProse(task);
        if (prevBtn) prevBtn.disabled = idx === 0;
        if (nextBtn) {
          nextBtn.disabled = false;
          nextBtn.textContent = idx === tasks.length - 1 ? tr("nav.nextLesson", "Next lesson") : tr("nav.next", "Next");
        }
        return;
      }

      // Practice card: core paints header + goal, then hands the body to the plugin.
      if (summary) summary.hidden = true;
      if (result) result.hidden = true;
      lastResult = null;
      paintGoal(task);
      hideGoalSection(false);
      plugin.renderCard(surface, task, idx);
      if (prevBtn) prevBtn.disabled = idx === 0;
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.textContent = idx === tasks.length - 1 ? tr("nav.nextLesson", "Next lesson") : tr("nav.next", "Next");
      }
    }

    // ---- setLocale (kernel/manual mode) ------------------------------------
    // Repaint ONLY voiced prose of the current card from the already-refreshed
    // cfg, then let the plugin repaint its own surface. Never touches the card
    // index or the learner's in-progress work.
    function setLocale() {
      if (isWidget) {
        // A widget owns its own prose; the core only refreshes the XP counter + the
        // Next label, then lets the plugin re-localize (re-create) its widget.
        renderXP();
        if (nextBtn) nextBtn.textContent = tr("nav.nextLesson", "Next lesson");
        if (plugin.setLocale) plugin.setLocale(surface);
        return;
      }
      var task = tasks[idx];
      if (title) title.textContent = task.title || "";
      if (context) context.innerHTML = renderProse(task.context);
      if (concept) concept.textContent = task.concept || "";
      if (progress) {
        progress.textContent = task.summary
          ? tr("card.recap", "Recap")
          : progressNoun + " " + (idx + 1) + " / " + gradedCount;
      }
      if (task.summary) paintSummaryProse(task);
      else paintGoal(task);
      applyChrome();
      if (plugin.setLocale) plugin.setLocale(surface, task);
      if (lastResult && result && !result.hidden) showResult(lastResult.ok, lastResult.bodyFn());
    }

    // ---- nav wiring --------------------------------------------------------
    function goTo(next) {
      if (next === idx) return;
      idx = next;
      render();
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (idx > 0) goTo(idx - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (idx < tasks.length - 1) goTo(idx + 1);
        else if (typeof window !== "undefined") window.location.href = nextHref;
      });
    }
    if (!isWidget && typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("hashchange", function () {
        var next = cardFromHash();
        if (next !== idx) goTo(next);
      });
    }

    // ---- boot --------------------------------------------------------------
    // Mount the plugin's work surface ONCE, then render the first card.
    function boot() {
      return Promise.resolve(plugin.mount(ctx)).then(function (mounted) {
        surface = mounted;
        renderXP();
        render();
      });
    }

    return { boot: boot, render: render, setLocale: setLocale };
  }

  var LessonEngine = {
    register: register,
    create: create,
    plugins: registry,
    hostRoles: HOST_ROLES,
  };

  // Self-boot for a browser page that includes this file directly. A kernel page
  // tags its <script ... data-manual> and drives create() from its controller, so
  // the engine can be re-localized in place without a reload. The unified config is
  // window.LESSON_CONFIG (+ window.PAGE for nextHref).
  if (typeof document !== "undefined") {
    var selfScript = document.currentScript;
    if (
      typeof window !== "undefined" &&
      window.LESSON_CONFIG &&
      !(selfScript && selfScript.hasAttribute("data-manual"))
    ) {
      LessonEngine.create(window.LESSON_CONFIG).boot();
    }
  }

  return LessonEngine;
});
