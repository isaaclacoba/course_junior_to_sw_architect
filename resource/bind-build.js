/*
 * resource/bind-build.js - bind resolved strings onto a BUILD lesson's globals.
 *
 * This is the course/engine-specific half of the resource system: it knows the
 * lesson key schema (intro.N, task.N.title/concept/context/goal.i, and the recap's
 * summaryIntro/summaryItems.i.title|text/summaryClose) and writes the resolved
 * strings onto window.PAGE (hero intro) and window.BUILD_CONFIG (task prose) before
 * build-engine.js renders. A different engine (a drill lesson) would be a sibling
 * binder with its own schema; the generic resolver/store/manager stay unchanged.
 *
 * Task prose lives only in the bundles now (default voice included), so those
 * fields are always taken from the resolver - which resolves through the default
 * fallback - and coerced so the engine never sees undefined. The hero intro is
 * apply-if-present: the default keeps its inlined intro unless a voice supplies one.
 */
(function (global) {
  "use strict";

  function str(v) { return v === undefined ? "" : v; }

  // Collect an indexed run "<prefix>0", "<prefix>1", ... until a gap.
  function collect(R, prefix) {
    var out = [];
    for (var i = 0; ; i++) {
      var v = R.get(prefix + i);
      if (v === undefined) break;
      out.push(v);
    }
    return out;
  }
  function collectItems(R, prefix) {
    var out = [];
    for (var i = 0; ; i++) {
      var title = R.get(prefix + i + ".title");
      var text = R.get(prefix + i + ".text");
      if (title === undefined && text === undefined) break;
      out.push({ title: title || "", text: text || "" });
    }
    return out;
  }

  function applyIntro(hero, R) {
    if (!hero) return;
    var intro = collect(R, "intro.");
    if (intro.length) hero.intro = intro; // only override when a voice supplies one
  }

  function applyTasks(cfg, R) {
    if (!cfg || !Array.isArray(cfg.tasks)) return;
    cfg.tasks.forEach(function (t, i) {
      var n = i + 1;
      t.title = str(R.get("task." + n + ".title"));
      t.concept = str(R.get("task." + n + ".concept"));
      t.context = str(R.get("task." + n + ".context"));
      t.goal = collect(R, "task." + n + ".goal.");
      if (t.summary) {
        t.summaryIntro = str(R.get("task." + n + ".summaryIntro"));
        t.summaryClose = str(R.get("task." + n + ".summaryClose"));
        t.summaryItems = collectItems(R, "task." + n + ".summaryItems.");
      }
    });
  }

  // R: the resolver/manager (has get). ctx: { page, config } lesson globals.
  function apply(R, ctx) {
    if (!R || !ctx) return;
    applyIntro(ctx.page && ctx.page.hero, R);
    applyTasks(ctx.config, R);
  }

  global.ResourceBindBuild = { apply: apply };
})(typeof window !== "undefined" ? window : this);
