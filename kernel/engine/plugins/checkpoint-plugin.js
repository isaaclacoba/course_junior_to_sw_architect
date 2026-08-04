/*
 * kernel/engine/plugins/checkpoint-plugin.js - the "checkpoint" archetype as a
 * WIDGET plugin for the generic lesson engine (kernel/engine/lesson-engine.js).
 *
 * A checkpoint lesson has no graded tasks of the core's kind: its whole body is one
 * self-contained CodeLab.Quiz assessment that scores itself and awards its own XP.
 * This plugin is therefore the archetype-specific MIDDLE of page-shell.js's
 * LESSON_CONFIG block and nothing else - the Quiz mount, the quiz.* chrome-label
 * application, and the destroy + re-create on a language change
 * (PageShellCheckpoint.setLocale). Everything the core owns (header, the final
 * "Next lesson" step, the setLocale fan-out) is deliberately absent; the core marks
 * a widget plugin with plugin.body === "widget" and skips all card chrome / result
 * panel / task nav for it.
 *
 * This is a faithful extraction of page-shell.js's `applyQuizLabels` closure +
 * `window.CodeLab.Quiz.create(host, LESSON_CONFIG)` + the `PageShellCheckpoint`
 * setLocale that destroys the old controller and re-creates it so the new-language
 * strings paint. The behaviour is byte-identical; only the seam differs (the core
 * hands the plugin ctx instead of page-shell reaching for window.LESSON_CONFIG).
 *
 * Loaded two ways with no bundler (same UMD shape as build-plugin.js):
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

  // Resolve CodeLab the same lazy way build-plugin resolves its collaborators, so
  // the plugin is testable off a fake global and never hard-depends on load order.
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

  // The Quiz chrome strings (quiz.* keys) - the SAME key list page-shell's
  // applyQuizLabels reads. Absent keys keep code-lab's English defaults, so the
  // default language stays byte-identical.
  var QUIZ_LABEL_KEYS = [
    "knowledgeCheck", "submit", "retry", "continue",
    "progressPassed", "progressFresh", "progressScored",
    "answerAll", "stillNeeds", "correctPrefix", "notQuitePrefix",
    "passTitle", "failTitle", "scoredLine", "passTail", "failTail",
    "xpLine", "courseXp",
  ];

  function applyQuizLabels(cfg) {
    var C = chromeText();
    if (!C || !cfg) return;
    var labels = {};
    var any = false;
    QUIZ_LABEL_KEYS.forEach(function (k) {
      var v = C["quiz." + k];
      if (v != null) { labels[k] = v; any = true; }
    });
    if (any) cfg.labels = labels;
  }

  // The Quiz seeds nextHref for its own "continue" transport; page-shell sets it
  // from the page's nextHref when the data file omits it. Same guard here.
  function deriveMeta(cfg) {
    if (!cfg) return;
    if (!cfg.nextHref) {
      var page = typeof window !== "undefined" && window.PAGE;
      if (page && page.nextHref) cfg.nextHref = page.nextHref;
    }
  }

  var CheckpointPlugin = {
    archetype: "checkpoint",
    body: "widget",

    // Mount the Quiz assessment ONCE into a <section class="lesson-quiz"> inside the
    // generic surface host (ctx.hosts.surface). Returns the surface the core threads
    // back into setLocale on a language change.
    mount: function (ctx) {
      var CL = codeLab();
      var host = document.createElement("section");
      host.className = "lesson-quiz";
      // Mount right under the hero, exactly where page-shell placed it. A test
      // page with no #pageHero falls back to the generic surface host / body.
      var anchor = typeof document !== "undefined" && document.getElementById("pageHero");
      if (anchor) anchor.insertAdjacentElement("afterend", host);
      else if (ctx.hosts && ctx.hosts.surface) ctx.hosts.surface.appendChild(host);
      else if (typeof document !== "undefined" && document.body) document.body.appendChild(host);

      deriveMeta(ctx.cfg);
      applyQuizLabels(ctx.cfg);
      var controller = CL.Quiz.create(host, ctx.cfg);
      return { host: host, controller: controller, ctx: ctx };
    },

    // A language swap re-binds cfg's strings upstream (bind-checkpoint), then this
    // destroys the old controller and re-creates the Quiz so the new text paints.
    // destroy() removes the old root; a fresh create redraws the question set, which
    // is acceptable on a language change. Exactly PageShellCheckpoint.setLocale.
    setLocale: function (surface) {
      if (!surface) return;
      var CL = codeLab();
      try {
        if (surface.controller && surface.controller.destroy) surface.controller.destroy();
      } catch (e) {}
      if (surface.host) surface.host.innerHTML = "";
      try {
        applyQuizLabels(surface.ctx.cfg);
        surface.controller = CL.Quiz.create(surface.host, surface.ctx.cfg);
      } catch (e) {
        if (typeof console !== "undefined") console.error("checkpoint-plugin relocalize failed", e);
      }
    },
  };

  return CheckpointPlugin;
});
