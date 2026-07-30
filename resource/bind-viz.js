/*
 * resource/bind-viz.js - bind resolved strings onto a VIZ lesson's globals.
 *
 * The viz counterpart of resource/bind-build.js. It knows the viz key schema
 * (intro.N, hero.title/eyebrow, legend.i, step.i.narr) and writes the resolved
 * strings onto window.PAGE (hero) and window.LESSON_VIZ (legend labels + step
 * narrations) before page-shell.js mounts the MemoryViz visual.
 *
 * Apply-if-present: a key is only overridden when the resolved bundle supplies
 * it, so a default (English) page with no bundle keys keeps its inlined viz.js
 * text unchanged. Only a non-default lang/voice bundle (e.g. es) carries the
 * translated narrations, so the visual swaps language without touching data.
 */
(function (global) {
  "use strict";

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

  function applyHero(hero, R) {
    if (!hero) return;
    var intro = collect(R, "intro.");
    if (intro.length) hero.intro = intro;
    var title = R.get("hero.title");
    if (title !== undefined) hero.title = title;
    var eyebrow = R.get("hero.eyebrow");
    if (eyebrow !== undefined) hero.eyebrow = eyebrow;
  }

  function applyViz(viz, R) {
    if (!viz) return;
    if (Array.isArray(viz.legend)) {
      viz.legend.forEach(function (item, i) {
        var v = R.get("legend." + i);
        if (item && v !== undefined) item.label = v;
      });
    }
    if (Array.isArray(viz.steps)) {
      viz.steps.forEach(function (step, i) {
        var v = R.get("step." + i + ".narr");
        if (step && v !== undefined) step.narr = v;
      });
    }
  }

  // R: the resolver/manager (has get). ctx: { page, viz } lesson globals.
  function apply(R, ctx) {
    if (!R || !ctx) return;
    applyHero(ctx.page && ctx.page.hero, R);
    applyViz(ctx.viz, R);
  }

  global.ResourceBindViz = { apply: apply };
})(typeof window !== "undefined" ? window : this);
