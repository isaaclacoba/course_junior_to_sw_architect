/*
 * resource/bind-checkpoint.js - bind resolved strings onto a CHECKPOINT lesson.
 *
 * The checkpoint counterpart of resource/bind-viz.js. It knows the checkpoint
 * key schema and writes resolved strings onto window.PAGE (hero) and
 * window.LESSON_CONFIG (the code-lab Quiz config) before page-shell.js mounts the
 * Quiz. Question order and option order are preserved, so the `correct` index
 * (which points into the original options array) stays valid after translation.
 *
 * Key schema:
 *   hero.eyebrow, hero.title, intro.N          -> the page hero (window.PAGE)
 *   quiz.title, quiz.intro, quiz.metaLabel     -> LESSON_CONFIG display strings
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

  // Snapshot/restore (bindLeaf), indexed-run collection and the hero mapping live
  // in resource/bind-origin.js (window.ResourceOrigin), which the controllers load
  // before the first bind. bindLeaf here just forwards to it (resolved lazily, as
  // the shared module is injected after this script tag parses).
  function bindLeaf(obj, key, resolved) {
    global.ResourceOrigin.bind(obj, key, resolved);
  }

  function applyQuiz(cfg, R) {
    if (!cfg) return;
    bindLeaf(cfg, "title", R.get("quiz.title"));
    bindLeaf(cfg, "intro", R.get("quiz.intro"));
    bindLeaf(cfg, "metaLabel", R.get("quiz.metaLabel"));

    if (!Array.isArray(cfg.questions)) return;
    cfg.questions.forEach(function (q, i) {
      if (!q) return;
      var n = i + 1;
      bindLeaf(q, "stem", R.get("question." + n + ".stem"));
      bindLeaf(q, "concept", R.get("question." + n + ".concept"));
      bindLeaf(q, "why", R.get("question." + n + ".why"));
      if (Array.isArray(q.options)) {
        q.options.forEach(function (opt, m) {
          bindLeaf(q.options, m, R.get("question." + n + ".option." + m));
        });
      }
    });
  }

  // R: the resolver/manager (has get). ctx: { page, quiz } lesson globals.
  function apply(R, ctx) {
    if (!R || !ctx) return;
    global.ResourceOrigin.hero(ctx.page && ctx.page.hero, R);
    applyQuiz(ctx.quiz, R);
  }

  global.ResourceBindCheckpoint = { apply: apply };
})(typeof window !== "undefined" ? window : this);
