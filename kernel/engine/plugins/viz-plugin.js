/*
 * kernel/engine/plugins/viz-plugin.js - the "viz" archetype as a WIDGET plugin for
 * the generic lesson engine (kernel/engine/lesson-engine.js).
 *
 * A viz lesson has no graded tasks: its whole body is one self-contained
 * CodeLab.MemoryViz visual that tracks its own progress and awards its own XP when
 * the last step is reached. This plugin is therefore the archetype-specific MIDDLE
 * of page-shell.js's LESSON_VIZ block and nothing else - the MemoryViz mount, the
 * viz.* chrome-label application, the awardedKey derivation, and the destroy +
 * re-create on a language change (PageShellViz.setLocale). Everything the core owns
 * (header, the final "Next lesson" step, the setLocale fan-out) is deliberately
 * absent; the core marks a widget plugin with plugin.body === "widget" and skips
 * all card chrome / result panel / task nav for it.
 *
 * This is a faithful extraction of page-shell.js's `applyVizLabels` closure +
 * `window.CodeLab.MemoryViz.create(host, LESSON_VIZ)` + the `PageShellViz`
 * setLocale that destroys the old controller and re-creates it so the new-language
 * strings paint. The behaviour is byte-identical; only the seam differs (the core
 * hands the plugin ctx instead of page-shell reaching for window.LESSON_VIZ).
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

  // The MemoryViz chrome strings (viz.* keys) - the SAME key list page-shell's
  // applyVizLabels reads. Absent keys keep code-lab's English defaults, so the
  // default language stays byte-identical.
  var VIZ_LABEL_KEYS = [
    "prev", "play", "pause", "next", "nextLesson", "reset", "step",
    "textSize", "textSmall", "textDefault", "textLarge",
    "authorYou", "authorApp", "authorModel", "authorCode",
    "toolCall", "toolError", "toolResult", "fanCaption",
  ];

  function applyVizLabels(cfg) {
    var C = chromeText();
    if (!C || !cfg) return;
    var labels = {};
    var any = false;
    VIZ_LABEL_KEYS.forEach(function (k) {
      var v = C["viz." + k];
      if (v != null) { labels[k] = v; any = true; }
    });
    if (any) cfg.labels = labels;
  }

  // Track progress: MemoryViz marks the lesson done + awards XP when the last step
  // is reached, keyed by cfg.awardedKey. A migrated lesson carries its exact key in
  // LESSON_META; a flat page derives it from the filename (theory-5.html ->
  // theory_5_awarded). Same derivation page-shell does, guarded so an explicit key
  // wins. (page-shell also seeds nextHref for the widget's own transport.)
  function deriveMeta(cfg) {
    if (!cfg) return;
    if (!cfg.nextHref) {
      var page = typeof window !== "undefined" && window.PAGE;
      if (page && page.nextHref) cfg.nextHref = page.nextHref;
    }
    if (cfg.awardedKey) return;
    if (typeof window !== "undefined" && window.LESSON_META && window.LESSON_META.key) {
      cfg.awardedKey = window.LESSON_META.key;
      return;
    }
    if (typeof location !== "undefined" && location.pathname) {
      var file = (location.pathname.split("/").pop() || "").replace(/\.html$/, "");
      if (/^[a-z0-9]+(-[a-z0-9]+)*$/i.test(file)) {
        cfg.awardedKey = file.replace(/-/g, "_") + "_awarded";
      }
    }
  }

  var VizPlugin = {
    archetype: "viz",
    body: "widget",

    // Mount the MemoryViz visual ONCE into a <section class="lesson-viz"> inside the
    // generic surface host (ctx.hosts.surface). Returns the surface the core threads
    // back into setLocale on a language change.
    mount: function (ctx) {
      var CL = codeLab();
      var host = document.createElement("section");
      host.className = "lesson-viz";
      if (ctx.hosts && ctx.hosts.surface) ctx.hosts.surface.appendChild(host);
      else if (typeof document !== "undefined" && document.body) document.body.appendChild(host);

      deriveMeta(ctx.cfg);
      applyVizLabels(ctx.cfg);
      var controller = CL.MemoryViz.create(host, ctx.cfg);
      return { host: host, controller: controller, ctx: ctx };
    },

    // A language swap re-binds cfg's narrations upstream (bind-viz), then this
    // destroys the old controller and re-creates the visual so the new text paints.
    // destroy() removes the old root; a fresh create restarts at step 1, which is
    // acceptable on a language change. Exactly PageShellViz.setLocale.
    setLocale: function (surface) {
      if (!surface) return;
      var CL = codeLab();
      try {
        if (surface.controller && surface.controller.destroy) surface.controller.destroy();
      } catch (e) {}
      if (surface.host) surface.host.innerHTML = "";
      try {
        applyVizLabels(surface.ctx.cfg);
        surface.controller = CL.MemoryViz.create(surface.host, surface.ctx.cfg);
      } catch (e) {
        if (typeof console !== "undefined") console.error("viz-plugin relocalize failed", e);
      }
    },
  };

  return VizPlugin;
});
