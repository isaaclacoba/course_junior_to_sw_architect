/*
 * resource/bind-checkpoint.js - bind resolved strings onto a CHECKPOINT lesson.
 *
 * The checkpoint counterpart of resource/bind-viz.js. It knows the checkpoint
 * key schema and writes resolved strings onto window.PAGE (hero) and
 * window.QUIZ_CONFIG (the code-lab Quiz config) before page-shell.js mounts the
 * Quiz. Question order and option order are preserved, so the `correct` index
 * (which points into the original options array) stays valid after translation.
 *
 * Key schema:
 *   hero.eyebrow, hero.title, intro.N          -> the page hero (window.PAGE)
 *   quiz.title, quiz.intro, quiz.metaLabel     -> QUIZ_CONFIG display strings
 *   question.<n>.stem                          -> questions[n-1].stem
 *   question.<n>.concept                       -> questions[n-1].concept
 *   question.<n>.why                           -> questions[n-1].why
 *   question.<n>.option.<m>                    -> questions[n-1].options[m]
 *
 * Apply-if-present: a key is only overridden when the resolved bundle supplies
 * it, so a default (English) page with no bundle keeps its inlined data.js text.
 */
(function (global) {
  "use strict";

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

  function applyQuiz(cfg, R) {
    if (!cfg) return;
    var title = R.get("quiz.title");
    if (title !== undefined) cfg.title = title;
    var intro = R.get("quiz.intro");
    if (intro !== undefined) cfg.intro = intro;
    var metaLabel = R.get("quiz.metaLabel");
    if (metaLabel !== undefined) cfg.metaLabel = metaLabel;

    if (!Array.isArray(cfg.questions)) return;
    cfg.questions.forEach(function (q, i) {
      var n = i + 1;
      var stem = R.get("question." + n + ".stem");
      if (q && stem !== undefined) q.stem = stem;
      var concept = R.get("question." + n + ".concept");
      if (q && concept !== undefined) q.concept = concept;
      var why = R.get("question." + n + ".why");
      if (q && why !== undefined) q.why = why;
      if (q && Array.isArray(q.options)) {
        q.options.forEach(function (opt, m) {
          var v = R.get("question." + n + ".option." + m);
          if (v !== undefined) q.options[m] = v;
        });
      }
    });
  }

  // R: the resolver/manager (has get). ctx: { page, quiz } lesson globals.
  function apply(R, ctx) {
    if (!R || !ctx) return;
    applyHero(ctx.page && ctx.page.hero, R);
    applyQuiz(ctx.quiz, R);
  }

  global.ResourceBindCheckpoint = { apply: apply };
})(typeof window !== "undefined" ? window : this);
