/*
 * resource/bind-lab.js - bind resolved strings onto a LAB lesson's globals.
 *
 * The lab counterpart of resource/bind-build.js and resource/bind-git.js. A lab
 * lesson's cards are painted by the generic core (kernel/engine/lesson-engine.js),
 * which owns the same prose fields for every archetype - title, concept, context,
 * the goal list and the trailing recap card - so the key schema below is
 * deliberately identical to theirs. What differs is what a lab task carries
 * besides its prose.
 *
 * Key schema:
 *   hero.eyebrow, hero.title, intro.N   -> the page hero (window.PAGE)
 *   meta.label                          -> LESSON_CONFIG.metaLabel (breadcrumb)
 *   task.<n>.title                      -> tasks[n-1].title
 *   task.<n>.concept                    -> tasks[n-1].concept
 *   task.<n>.context                    -> tasks[n-1].context
 *   task.<n>.goal.<i>                   -> tasks[n-1].goal[i]        (prose)
 *   task.<n>.goal.<i>.code.<k>          -> tasks[n-1].goals[i].code[k] (chip)
 *   task.<n>.summaryIntro               -> tasks[n-1].summaryIntro   (recap card)
 *   task.<n>.summaryItems.<i>.title     -> tasks[n-1].summaryItems[i].title
 *   task.<n>.summaryItems.<i>.text      -> tasks[n-1].summaryItems[i].text
 *   task.<n>.summaryClose               -> tasks[n-1].summaryClose
 *
 * NEVER TOUCHED - the mechanics. `starter` and `solution` are C# SOURCE that the
 * real compiler compiles, and `gates` (with each goal's own `gate`) is the
 * machine-readable claim the trace is graded against. Translating C# does not
 * translate the lesson, it stops it compiling; translating a gate's `type` or
 * `field` unhooks it from the class the learner actually wrote, and the goal
 * becomes unreachable in that language. Same rule the git track ratified for its
 * commands: the code stays as written, the teaching prose around it localizes.
 *
 * WHY A GOAL IS TWO ARRAYS. The core paints the visible checklist from
 * `task.goal` - a plain array of sentences - exactly as it does for a build
 * lesson, and it knows nothing about gates. The machine-readable half lives in
 * `task.goals[i]`, whose `gate` the tracker evaluates and whose `code` is the
 * short chip it shows on the tick ("two Cat objects"). Index i means the same
 * goal in both, so key `task.<n>.goal.<i>` feeds the sentence and
 * `task.<n>.goal.<i>.code.<k>` feeds that goal's chip.
 *
 * Both are prose and both must localize, or a Spanish lesson ticks a goal with
 * an English label on it. The chip is apply-if-present: a goal that declares no
 * chip keeps whatever its data file inlined, and the provider falls back to
 * describing the gate itself.
 *
 * `collect` stops at the first gap, so it reads `goal.0`, `goal.1`, ... and never
 * mistakes `goal.0.code.0` for a sentence - that key is not `goal.<int>`.
 *
 * Policy matches bind-build and bind-git: task prose is ALWAYS taken from the
 * resolver (which falls back through the default voice) and coerced so the engine
 * never sees undefined; the hero is apply-if-present, so a default page keeps its
 * inlined intro and a round-trip back to the default restores it.
 */
(function (global) {
  "use strict";

  function str(v) { return v === undefined ? "" : v; }

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

  // One goal's TRACKER CHIP. The sentence is not here - the core paints that from
  // `task.goal` - and the gate is left exactly as authored; see the header.
  //
  // This REPLACES the goal object rather than writing into it, for the reason
  // bind-git replaces its `files` array: two cards that share one authored goal
  // const would otherwise end up sharing one card's translated text.
  function applyGoal(goal, R, prefix) {
    if (!goal || typeof goal !== "object") return goal;
    var next = {};
    for (var k in goal) {
      if (Object.prototype.hasOwnProperty.call(goal, k)) next[k] = goal[k];
    }
    var code = global.ResourceOrigin.collect(R, prefix + ".code.");
    if (code && code.length) next.code = code;
    return next;
  }

  function applyTasks(cfg, R) {
    if (!cfg || !Array.isArray(cfg.tasks)) return;
    var label = R.get("meta.label");
    if (label !== undefined) cfg.metaLabel = label;
    cfg.tasks.forEach(function (t, i) {
      var n = i + 1;
      t.title = str(R.get("task." + n + ".title"));
      t.concept = str(R.get("task." + n + ".concept"));
      t.context = str(R.get("task." + n + ".context"));
      // The checklist the core paints. Same key run and same field as bind-build,
      // so a lab card's goal list localizes by the rule every archetype uses.
      t.goal = global.ResourceOrigin.collect(R, "task." + n + ".goal.");
      if (Array.isArray(t.goals)) {
        t.goals = t.goals.map(function (g, k) {
          return applyGoal(g, R, "task." + n + ".goal." + k);
        });
      }
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
    global.ResourceOrigin.hero(ctx.page && ctx.page.hero, R);
    applyTasks(ctx.config, R);
  }

  global.ResourceBindLab = { apply: apply };
})(typeof window !== "undefined" ? window : this);
