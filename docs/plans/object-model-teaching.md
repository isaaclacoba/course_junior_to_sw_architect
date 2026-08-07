# Teaching the object model - class vs instance, constructors, parameters
Status: building - phase 1 of 4  -  Design: [docs/architecture/object-model-teaching.md](../architecture/object-model-teaching.md)

## Goal
Students finish Part 1 unable to tell a class from an instance and cannot say what a
parameter is. Give the practical track a picture of an object, and exercises where the
difference is something the learner causes rather than something they are told.

## Why now (measured, all 141 build tasks)
The learner first writes a constructor at lesson 19 of 29, and it is inside a generic
`Box<T>`. They first declare a parameter at lesson 5, then not again until 19. Lesson 1's
task 6 - the entire class-vs-instance teaching - pre-writes the class, pre-writes `new
Dog()`, hardcodes the name inside the class, and makes exactly one object. The parameter
concept chip defines an argument, not a parameter. The practical track is 29 of 29 build
lessons with no visual at all.

## Approach
Reuse the execution tracer the repo already owns and no lesson uses: `Tracer.cs` (real
Roslyn instrumentation), `traceToSteps()`, and the `CodeLab.VizLab` widget. Add a `lab`
archetype that mounts VizLab at full card width and grades from the trace itself, so the
thing the card shows is the thing it marks. Fix the three content faults in the same pass.

## Plan
Phase 0 - design
1. [x] Ground the problem across all 141 build tasks - verify: table in the design doc.
2. [x] Prove the tracer end to end against the real compiler (two cats, ctor frames,
   two heap cards) - verify: screenshot + step dump.
3. [x] Measure tracer robustness: loops, infinite loop, syntax error, runtime crash, speed.
4. [x] Measure the Spanish gap (~25 strings, ~14 narration templates generated in code).
5. [x] Layout mockup with the real widget, 4 options measured - verify: option A ratified.
6. [x] Tracker placement mockup, 3 options measured - verify: P2 ratified, edges align 0px.
7. [x] Owner decisions 1-8 - verify: `D-object-model-teaching-1..8` in the journal.
8. [x] Design of record - verify: docs/architecture/object-model-teaching.md.
Phase 1 - code-lab (upstream of everything)
9. [x] `VizLabConfig.onTrace` so the course can grade what the widget shows - verify: unit test.
10. [x] `VizLabConfig.labels` + extend `VizLabels` to badges, MEMORY caption, console text,
    VizLab's own 5 chrome strings - verify: unit test asserting no English leaks with labels set.
11. [x] Make `traceToSteps` take translated narration templates (~14) - verify: unit test.
12. [x] typecheck + tests + build + re-vendor - verify: the new symbols are in the vendored IIFE.
Phase 2 - the `lab` archetype
13. [~] STRUCK - the tracker is already built and shared by the build and git tracks
    (`kernel/engine/widgets/goal-tracker.js`, provider-based). Nothing to design.
14. [x] `kernel/engine/plugins/lab-plugin.js` on the generic engine - verify: plugin tests.
15. [x] Trace gate vocabulary in `kernel/grading/` - verify: gate tests, every goal starts RED.
16. [x] Card scaffold + the P2 header grid in page-shell/styles - verify: headless render, edges align.
17. [x] `resource/bind-*.js` binder so a lab lesson localizes - verify: EN/ES round-trip.
Phase 3 - content
18. [ ] MOCKUP: ONE authored card of the new constructor lesson, real chrome, owner reads
    it - verify: shape approved before the other cards are written.
19. [ ] Rework `01-foundations` task 6: two instances, values passed in, introduces `pr-field`.
20. [ ] New build lesson: constructors (revisits `pr-field`), after `04-writing-methods`.
21. [x] New lab lesson: one class, many objects.
22. [x] Fix the parameter definition; add `pr-argument`; update `docs/concept-ledger.md`.
23. [ ] Registry + directory renumbering (array order is the real order, not the `NN-` prefix).
Phase 4 - close
24. [ ] `node tools/verify-lesson.mjs` on every changed lesson, EN+ES.
25. [ ] `npm run gate`, delete the mockups, commit submodule first then the course.

## Constraints that bit during design
- The lab editor is 686px, about **75 characters**. A longer starter line puts a
  horizontal scrollbar under the learner's own code.
- `.challenge-head` is a flex row, so the header grid needs `flex: 1 1 100%; width: 100%;
  min-width: 0` or it will not fill the card.
- VizLab builds its **own** compiler iframe, so it cannot share a build card's runner.
  Two compilers on one page costs 6.4s of warm-up each - never put both on one page.
- Narration is generated in code, not data, so Spanish needs a code-lab change first.

## Open
- How the lab lesson awards XP and counts toward track progress.

## Log
- 2026-08-07 - Owner stopped the run: reports were long, carried no plan and no
  position, and a question asked without context got answered on wrong premises.
  Fixed the FSM, not this feature: `.github/agents/factory-report.md` is now the
  fixed four-block report (whole plan every turn, <=5 done-bullets, one next step,
  one `needs you`), wired into all 8 states. `recall` now searches the CODE before
  the journal and reports an exists/partial/absent inventory FIRST - the miss that
  cost an hour re-designing `visualize.html` + `CodeLab.VizLab`, which already ship
  a working editor + real compiler + real trace + memory picture.
  Step 13 struck: the goal tracker exists.
- 2026-08-06 - Design round run with the owner: 8 decisions ratified, grounded on a
  141-task measurement, a proven tracer, and two measured mockups. Design of record and
  this brief written. No code yet.
- 2026-08-07 - Phase 1 landed: `onTrace` grading seam, `VizLabels` extended to the
  memory captions/badges/console and VizLab's own chrome, `traceToSteps` translatable.
  Both "no English leaks" tests passed while sabotaged at first - rewritten, then each
  watched failing before restore. Vendored bundle verified by loading it, not grepping.
- 2026-08-07 - Bookkeeping so the factory can track this feature. The grounding really
  happened but was never written to the journal, so the FSM was skipping the feature as
  pre-FSM. Recorded the 141-task measurement (`audit`) and the tracer/mockup runs (`poc`)
  as retro-labelled output rows, removed the slug from `docs/journal/factory-config.json`,
  and set the feature status to `building`. The ladder now reads
  `recall/grounding/deciding/specifying` green and `building` at 8/25. Starting phase 1.
