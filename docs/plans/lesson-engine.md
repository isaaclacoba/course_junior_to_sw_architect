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
Execution order was reworked during the build (grounded): wire the new engine reading the
EXISTING globals first, then delete the old engines, then rename to LESSON_CONFIG LAST -
the global rename couples all archetypes at once, so it is safest as a final mechanical sweep.
1. [x] kernel/engine/lesson-engine.js core + registry + plugin interface + unit tests (790b814).
2. [x] build-plugin (reuses KernelGrading.gradeOutput verbatim) + unit tests, zero churn (5a4a0f5).
3. [x] Generalize the core to the SHELL shape: optional grade/result/task-nav + widget plugins (5b7b9b0).
4. [x] viz-plugin + checkpoint-plugin (fold viz-checkpoint.js) - widget shape (ba38a06).
5. [x] drill-plugin + kernel/grading/blank-match.js (spec-ready; no live drill page) (3024aa2).
6a. [~] Wire kernel-controller: BUILD lessons boot LessonEngine + build-plugin over the page-shell
    scaffold, reading window.BUILD_CONFIG (archetype injected). No generator/page change (paths
    derived from the engine base). Canary encapsulation PASSED - verify: verify-lesson --all + EN/ES.
6b. [ ] Wire viz + checkpoint: controller mounts the widget plugins; STOP page-shell mounting them
    (retire viz-checkpoint.js mount) - verify: EN/ES round-trip on the 54.
7. [ ] DELETE build-engine.js + drill-engine.js + retire page-shell/boot render role; drop dead refs.
8. [ ] Unified LESSON_CONFIG (LAST): generate.mjs emits it + a data.js migration script + binders +
   controller read it; collapse BUILD/DRILL/VIZ/QUIZ globals - verify: validate + drift + round-trip.
9. [ ] git-plugin (git-track): CodeLab.LineTerminal + graph + parser + dag-match, Check grading; git page UX mockup first - verify: a git lesson reaches its goal DAG headlessly.

## Progress
- 2026-08-03 Round 3 (grounded): audited generate.mjs, the template, a live build page, kernel-controller, page-shell/boot, viz-checkpoint. Owner ratified the FULL migration: all four archetypes -> plugins, one LESSON_CONFIG, NO shim, delete build/drill engines + retire page-shell render role, drill-plugin now, controller editable. Steps 1-2 already landed; design-of-record revised.
- 2026-08-03 Built steps 3/4/8 (core shell + all four plugins), all ADD-only + tested (204 suite). Reordered the live cutover: wire reading existing globals first, rename LESSON_CONFIG last. Build slice (6a) wired in the controller; encapsulation canary passed verify-lesson (5/5 grade, EN/ES render clean).

## Open
- hosts role names (incl. vizHost/quizHost); per-archetype LESSON_CONFIG shape; migration-script rewrite rules per global; how much of the kernel/page-shell modules the core reuses vs. re-implements; the git page layout (UX mockup, owed to the owner).
