# Generic lesson engine - design of record

Status: design ACCEPTED (owner ratified full unification, 2026-08-03). A big
refactor on WORKING content - phased and gate-verified, never a blind sweep.
Brief: [docs/plans/lesson-engine.md](../plans/lesson-engine.md)

## Why
`build-engine.js` + `drill-engine.js` are ~85% the same loop with different middles,
and today a THIRD path (`page-shell.js`/`boot.js`) renders the hero + concept agenda
and mounts the viz (`MemoryViz`) and checkpoint (`Quiz`) widgets - so a lesson's
chrome is split across an engine AND page-shell. A future git engine would add a
fourth. Owner's call: a GENERIC engine where each archetype is a PLUGIN over one
shared lesson SHELL, and NOTHING legacy remains. Mirrors the `kernel/lesson-validators/`
registry.

## Decided (owner, round 3, 2026-08-03)
- FULL migration, NO shim, NO retro-compat. After this refactor the old paths are
  GONE: delete `build-engine.js` + `drill-engine.js`; retire `page-shell.js`/`boot.js`'s
  lesson-render role (its pure modules live on, consumed by the core).
- ALL FOUR existing archetypes become plugins now: build, drill, viz, checkpoint
  (git is a fifth, added later by the git-track). Core in
  `kernel/engine/lesson-engine.js` + self-registering plugins in
  `kernel/engine/plugins/{build,drill,viz,checkpoint}-plugin.js` + a registry.
- Unify ALL FOUR config globals to one `window.LESSON_CONFIG { archetype, ... }`
  (BUILD_CONFIG / DRILL_CONFIG / LESSON_VIZ / QUIZ_CONFIG collapse).
- `kernel-controller.js` is editable: it creates `LessonEngine.create(LESSON_CONFIG)`
  DIRECTLY and dispatches by archetype - no `window.BuildEngine` indirection.
- Build drill-plugin now (spec-ready, unit-tested) though 0 drill lessons are
  migrated yet and the controller has no drill path today.
- i18n: prose localizes via kernel-controller; a viz/checkpoint widget re-creates on
  locale swap (as page-shell does today). Terminal + literal git commands English (git).

## The core (the lesson SHELL)
Universal chrome only: nextHref (from `window.CourseData`), hero (from
`kernel/page-shell/hero.js`), concept agenda/panel (`concepts.js`), the header
(meta/title/context/concept/progress), the XP ledger + `LessonCommon.createProgress`,
prev/next-LESSON nav + hashchange, `setLocale` fan-out, boot (self-boot + `data-manual`).
The result panel, the per-task grade, and in-lesson (task-to-task) nav are OPTIONAL -
supplied only for practice plugins. The core never knows editor/terminal/blanks/scenes.
It reuses the existing `kernel/page-shell/` modules rather than re-implementing them;
`page-shell.js`/`boot.js` (the assembled render entry) is retired.

## The plugin interface (the crux) - two shapes over one core
Every plugin has `archetype`, `mount(ctx) -> Promise<surface>`, and optional
`setLocale?(surface, task)` + `deactivate?`. Beyond that there are TWO shapes:

**Practice plugins** (build, drill, git) - a graded multi-task body:
```
  renderCard(surface, task, i),                            // paint task i
  grade(surface, task) -> Promise<{ok, reason, message}>,  // on Run/Check -> ctx.report
  showSolution?(surface, task), reset?(surface, task),
```
**Widget plugins** (viz, checkpoint) - one self-contained widget, no grading:
```
  renderCard(surface),   // mount CodeLab.MemoryViz / CodeLab.Quiz once (one body)
  // no grade: the widget owns its own transport/assessment and awards XP itself
  // (awardedKey -> localStorage); setLocale re-creates the widget with new strings.
```
`ctx = { hosts{editor,inputs,terminal,graph,vizHost,quizHost,output,errors,actions},
cfg, prefix, tr, runner (shared Roslyn, lazy), report(result), helpers{renderInline,
renderProse,...} }`.

Seam (practice): the plugin owns its action (Run/Check) and calls `ctx.report(result)`;
the core awards XP, paints the result panel, and owns task nav. This inversion lets
build's async-Run, drill's sync-Check, and git's Check share one XP/nav path. Widget
plugins skip that seam: the core shows no result panel / task nav for them.

## Unified config
`window.LESSON_CONFIG = { archetype:"build"|"drill"|"viz"|"checkpoint"|"git", prefix,
xpKey, awardedKey, awardAmount, meta, ...archetype-specific }` - practice archetypes
carry `tasks:[...]`; viz carries the scene/step data; checkpoint the question set.
`generate.mjs` emits it; a one-time migration script rewrites every existing
`BUILD_CONFIG`/`DRILL_CONFIG`/`LESSON_VIZ`/`QUIZ_CONFIG` data.js. The core normalizes;
binders (`bind-*.js`) + `kernel-controller` read `LESSON_CONFIG`.

## The plugins
- **build-plugin** (done, step 2) - Monaco (`CodeLab.loadMonaco`) + `RoslynIframeRunner` +
  output-match (`requireSource` + hidden `verify`). Grades on Run.
- **drill-plugin** - fill-blank inputs + optional quiz; a new
  `kernel/grading/blank-match.js` (extracted from drill-engine's inlined `check`). Grades on Check.
- **viz-plugin** - mounts `CodeLab.MemoryViz` (the `viz-checkpoint.js` viz half) into
  `hosts.vizHost`; no grade; awards XP on completion (awardedKey); `setLocale` re-creates.
- **checkpoint-plugin** - mounts `CodeLab.Quiz` (the `viz-checkpoint.js` checkpoint half)
  into `hosts.quizHost`; no grade (the Quiz self-assesses); `setLocale` re-creates.
- **git-plugin** (later, git-track) - `CodeLab.LineTerminal` + `CodeLab.GitGraph` +
  the git-cli parser + `dag-match`. Terminal + literal git commands English. Grades on Check.

## i18n
Core is manual-mode capable; `kernel-controller` holds it and re-localizes in place. New
`resource/bind-git.js` writes resolved prose onto `LESSON_CONFIG` (context/goal/hints/
result) - NOT the terminal I/O; a `kernel-controller.bind()` branch beside build/viz; the
engine registered as a `surfaces` entry for `relocalize()`. All prose localizes; the
terminal + literal git commands stay English.

## Migration (full, no legacy) - phased + gate-verified
1. `kernel/engine/lesson-engine.js` core + registry + plugin interface (+ unit tests). DONE.
2. **build-plugin** built + unit-tested, reusing `KernelGrading.gradeOutput` verbatim. DONE
   (zero churn so far - not yet wired live).
3. Generalize the core to the SHELL shape (optional grade/result/task-nav; reuse the
   `kernel/page-shell/` modules for hero + concept agenda; own nextHref). Unit-tested.
4. **viz-plugin + checkpoint-plugin**: fold `viz-checkpoint.js`'s two halves into widget
   plugins. Gate: EN/ES i18n round-trip on the 49 viz + 5 checkpoint lessons.
5. Unified `LESSON_CONFIG`: `generate.mjs` emits it; a one-time migration script rewrites
   every data.js (BUILD/DRILL/VIZ/QUIZ -> LESSON_CONFIG + archetype); binders read it.
   Gate: validate + generator drift + round-trip.
6. Rewire `kernel-controller.js`: inject the core + the archetype's plugin, call
   `LessonEngine.create(LESSON_CONFIG).boot()`, dispatch bind by archetype, register the
   engine as the localizable surface. Flip ALL build lessons at once.
   Gate: `verify-lesson --all` (real-dotnet grade of every build task) + EN/ES round-trip.
7. **DELETE** `build-engine.js`, `drill-engine.js`, and `page-shell.js`/`boot.js`'s render
   role once nothing loads them; drop the old globals from binders/validators/tests.
8. **drill-plugin** + `kernel/grading/blank-match.js` (spec-ready now; no live drill page).
9. **git-plugin** (git-track): `CodeLab.LineTerminal` in code-lab first, then re-vendor;
   the git page layout is its own UX mockup (owner-decided) before build.
Each step independently verified; live lessons never go red.

## Verification
`verify-lesson --all` (per-archetype validators - see the validator-registry design),
EN<->ES i18n round-trip, code-lab + course test suites, generator drift.

## Open (build-time)
- Exact `hosts` role names (incl. `vizHost`/`quizHost`); the per-archetype
  `LESSON_CONFIG` shape; the migration script's data.js rewrite rules per global; the
  order the core reuses vs. re-implements the `kernel/page-shell/` modules; the git page
  layout (its own UX mockup, owed).
