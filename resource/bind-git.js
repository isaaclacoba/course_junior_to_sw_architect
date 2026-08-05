/*
 * resource/bind-git.js - bind resolved strings onto a GIT lesson's globals.
 *
 * The git counterpart of resource/bind-build.js. A git lesson's cards are painted
 * by the generic core (kernel/engine/lesson-engine.js), which owns exactly the
 * same prose fields for every archetype - title, concept, context, the goal list
 * and the trailing recap card - so the key schema here is deliberately identical
 * to the build one. What differs is what a git task carries BESIDES its prose.
 *
 * Key schema:
 *   hero.eyebrow, hero.title, intro.N   -> the page hero (window.PAGE)
 *   meta.label                          -> LESSON_CONFIG.metaLabel (breadcrumb)
 *   task.<n>.title                      -> tasks[n-1].title
 *   task.<n>.concept                    -> tasks[n-1].concept
 *   task.<n>.context                    -> tasks[n-1].context
 *   task.<n>.goal.<i>                   -> tasks[n-1].goal[i]
 *   task.<n>.summaryIntro               -> tasks[n-1].summaryIntro   (recap card)
 *   task.<n>.summaryItems.<i>.title     -> tasks[n-1].summaryItems[i].title
 *   task.<n>.summaryItems.<i>.text      -> tasks[n-1].summaryItems[i].text
 *   task.<n>.summaryClose               -> tasks[n-1].summaryClose
 *
 * NEVER TOUCHED - the mechanics. `start`, `target` and `solution` are ARRAYS OF
 * REAL GIT COMMANDS: `start`/`target` are replayed through CodeLab.gitRun to
 * build the RepoStates the exercise is graded against, and `solution` is printed
 * for the learner to type. Translating any of them does not translate the lesson,
 * it breaks it - the replay fails and the goal becomes unreachable. Same for
 * `commands`/`targetCommands` (their aliases) and `prefix` (element ids). This is
 * the ratified rule in docs/architecture/git-track.md: the terminal and the git
 * commands stay English, the teaching prose around them localizes. This binder
 * therefore writes an explicit, closed list of prose fields and nothing else.
 *
 * Policy matches bind-build: task prose is ALWAYS taken from the resolver (which
 * falls back through the default voice) and coerced so the engine never sees
 * undefined; the hero is apply-if-present, so a default page keeps its inlined
 * intro and a round-trip back to the default restores it.
 */
(function (global) {
  "use strict";

  function str(v) { return v === undefined ? "" : v; }

  // Snapshot/restore + indexed-run collection live in resource/bind-origin.js
  // (window.ResourceOrigin), which the controllers load before the first bind.
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

  // Prose only. Adding a field here is adding a translatable string - never add
  // start/target/solution (see the header).
  function applyTasks(cfg, R) {
    if (!cfg || !Array.isArray(cfg.tasks)) return;
    // The breadcrumb above the card title ("Branches - Make a branch"). It is
    // prose, so it localizes; it was the one visible English string left on a
    // Spanish git lesson. Apply-if-present, like the hero, so a lesson with no
    // key keeps whatever its data file inlined.
    var label = R.get("meta.label");
    if (label !== undefined) cfg.metaLabel = label;
    cfg.tasks.forEach(function (t, i) {
      var n = i + 1;
      t.title = str(R.get("task." + n + ".title"));
      t.concept = str(R.get("task." + n + ".concept"));
      t.context = str(R.get("task." + n + ".context"));
      t.goal = global.ResourceOrigin.collect(R, "task." + n + ".goal.");
      // A file's CONTENTS are prose the learner reads, so they localize; its
      // PATH is an argument to a git command, so it does not. Apply-if-present,
      // so a card that declares no text key keeps whatever its data file
      // inlined - and a card that does declare one must declare it in every
      // language, or switching back leaves the file stuck in the other one.
      //
      // This REPLACES the array rather than writing into the objects. Two cards
      // that share one `files` const - an obvious thing to author, and it has
      // been authored twice already - would otherwise end up sharing one card's
      // text, because mutating in place mutates the other card's file too.
      if (Array.isArray(t.files)) {
        t.files = t.files.map(function (f, k) {
          if (!f || typeof f !== "object") return f;
          var text = R.get("task." + n + ".files." + k + ".text");
          return { path: f.path, text: text === undefined ? f.text : text };
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

  global.ResourceBindGit = { apply: apply };
})(typeof window !== "undefined" ? window : this);
