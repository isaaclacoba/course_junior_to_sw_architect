# Generic lesson engine
Status: design accepted - phased build (big refactor on working content)  -  Design: [docs/architecture/lesson-engine.md](../architecture/lesson-engine.md)

## Goal
One `kernel/engine/` core + archetype plugins (build/drill/viz/checkpoint, git later) so a
lesson kind is a plugin over one shared lesson SHELL (hero/concept/XP/nav/i18n). Ends the
parallel-engine duplication AND the page-shell split; NO legacy remains.

## Approach
A core = the lesson shell (reusing the `kernel/page-shell/` modules) with a self-registering
plugin registry. Two plugin shapes: PRACTICE (build/drill/git: multi-task, graded, calls
`ctx.report`) and WIDGET (viz/checkpoint: mount one `MemoryViz`/`Quiz`, no grade, self-award).
One unified `window.LESSON_CONFIG { archetype, ... }` (generator-emitted, data.js migrated
mechanically). NO shim: `kernel-controller` calls `LessonEngine.create` directly. Delete
`build-engine.js` + `drill-engine.js` + retire `page-shell.js`/`boot.js` render role.
Verified by the existing gates so live lessons never regress.

## Plan
1. [x] kernel/engine/lesson-engine.js core + registry + plugin interface + unit tests (790b814).
2. [x] build-plugin (reuses KernelGrading.gradeOutput verbatim) + unit tests, zero churn (5a4a0f5).
3. [ ] Generalize the core to the SHELL shape: optional grade/result/task-nav; reuse
   kernel/page-shell hero + concept modules; own nextHref - verify: core tests green.
4. [ ] viz-plugin + checkpoint-plugin (fold viz-checkpoint.js) - verify: EN/ES round-trip on the 54.
5. [ ] Unified LESSON_CONFIG: generate.mjs emits it + a data.js migration script + binders read it - verify: validate + drift + round-trip.
6. [ ] Rewire kernel-controller to LessonEngine.create + archetype bind dispatch; flip all build lessons - verify: verify-lesson --all + EN/ES round-trip.
7. [ ] DELETE build-engine.js + drill-engine.js + retire page-shell.js/boot.js render role; drop old globals - verify: gate:all + no dead refs.
8. [ ] drill-plugin + kernel/grading/blank-match.js (spec-ready; no live drill page) - verify: drill tests.
9. [ ] git-plugin (git-track): CodeLab.LineTerminal + graph + parser + dag-match, Check grading; git page UX mockup first - verify: a git lesson reaches its goal DAG headlessly.

## Progress
- 2026-08-03 Round 3 (grounded): audited generate.mjs, the template, a live build page, kernel-controller, page-shell/boot, viz-checkpoint. Owner ratified the FULL migration: all four archetypes -> plugins, one LESSON_CONFIG, NO shim, delete build/drill engines + retire page-shell render role, drill-plugin now, controller editable. Steps 1-2 already landed; design-of-record revised.

## Open
- hosts role names (incl. vizHost/quizHost); per-archetype LESSON_CONFIG shape; migration-script rewrite rules per global; how much of the kernel/page-shell modules the core reuses vs. re-implements; the git page layout (UX mockup, owed to the owner).
