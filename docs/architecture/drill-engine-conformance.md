# Drill engine conformance - design of record

Status: design proposed. Workstream B starts after Workstream A's first grading increment.

## Context & trigger

`build-engine.js` now has the platform shape: `BuildEngine.create(cfg, opts)` returns a
controller with `boot`, `render`, and `setLocale`, and its self-boot footer stands down
when the script tag has `data-manual`. `drill-engine.js` does not: it reads
`window.DRILL_CONFIG` at load time, self-boots inside one IIFE, has no factory, no
`setLocale`, no `data-manual` gate, and no resource binder.

That leaves drill and theory-drill lessons outside the live EN/ES composition path. The
same boot path also carries the God-module finding: one 746-line file owns element lookup,
XP/progress, prose helpers, code highlighting, the explain overlay, Mermaid, MCQ quiz,
fill-blank grading, runnable examples, and navigation.

`solid-i18n.md` finding 3 deferred a base binder until a fourth archetype appeared.
`bind-drill.js` is that fourth binder. The trigger has fired, but this still does not
mean a kernel registry or plugin system; the promotion map keeps that deferred.

## Target contract

`drill-engine.js` exposes:

```js
window.DrillEngine = { create };
DrillEngine.create(cfg, opts) -> { boot, render, setLocale };
```

The footer mirrors build-engine: if `window.DRILL_CONFIG` exists and the current script
has no `data-manual`, call `DrillEngine.create(window.DRILL_CONFIG).boot()`. Kernel pages
inject the same file with `data-manual`, then hold the returned controller.

The controller implements the narrow `Renderable` and `Localizable` roles used today. It
does not stub `getState`, `setState`, or `dispose` until a real caller needs them.
`setLocale()` assumes `ResourceBindDrill.apply(...)` already refreshed `cfg`; it repaints
only chrome and prose on the current card. It preserves card index, blank values, hint
counters, quiz choice/order, run output, visible result state, and awarded XP.

## Decomposition

| Unit | Owns | Home |
|---|---|---|
| `DrillController` | factory, boot, element lookup, nav/hash, XP, card flow, runner wiring | `drill-engine.js` |
| `DrillProseView` | `renderInline` use, theory cloze prose, code snippet gaps, Prism repaint, code-line highlight API | internal collaborator first |
| `ExplainOverlay` | overlay/card creation, close/resize, clip-path spotlight, card positioning, calling the highlighter | open sub-axis; separate module recommended |
| `DrillQuiz` | option order, chosen state, answer feedback, `answered()` gate, localized feedback prefix | open sub-axis; separate module recommended |
| `BlankInputs` | input rows, labels, hints, explain buttons, value persistence, result list painting | internal collaborator |
| `BlankMatchGrader` | text normalization, accepted answers, exact/close/wrong result policy | `kernel/grading/` (A's module); B lands extraction |
| `DrillDiagram` and `RunExample` | Mermaid render and runnable-program output panel | internal collaborators |

Open sub-axis - where sub-widgets live:

1. Keep all collaborators inside `drill-engine.js` - lowest load-order churn, weaker SRP.
2. Add root `drill/` modules such as `drill/explain-overlay.js` and `drill/quiz.js` -
   clearer ownership, small generator/template load-order change.
3. Move them into `code-lab` - not recommended; these are course-engine helpers, not
   reusable vendored widgets.

Recommendation: option 2 for `ExplainOverlay` and `DrillQuiz` after the factory and
locale tests are green. Keep prose, Mermaid, run output, and blank-input DOM as internal
collaborators unless a second consumer appears.

## i18n and binder

Add `resource/bind-drill.js` beside `bind-build.js` and `bind-viz.js`. Its shape is the
same: `apply(R, { page, config })`, call `ResourceOrigin.hero(...)`, then bind the
`DRILL_CONFIG` schema with snapshot/restore. Suggested keys: `drill.N.title`, `concept`,
`context`, `pain`, `map`, `snippet`, `point.M`, `blank.M.label`, `blank.M.hint.K`,
`blank.M.explain.K.text`, `quiz.question`, `quiz.option.M.text`, `quiz.answerWhy`, and
summary `summaryIntro`, `summaryItems.M.title/text`, `summaryClose`. Code-only snippets
and `runnablePrograms` stay inline unless a bundle supplies an override; theory snippets
are localizable prose.

Engine-owned chrome uses `const tr = LessonCommon.t`: `nav.xp`, `drill.close`,
`drill.explainTitle`, `drill.quizCorrect`, `drill.quizNotQuite`, `nav.next`,
`nav.nextLesson`, `card.recap`, `drill.fillBlanks`, `drill.complete`, `nav.run`, and
`run.running`. As each hardcoded result or hint line is touched, route it through existing
`drill.*`, `result.*`, or `run.*` keys. Static scaffold labels in `page-shell.js` remain
page-shell chrome and use the existing `data-t`/`PageShellChrome` path.

`resource/kernel-controller.js` gains one KISS branch:
`ResourceBindDrill.apply(R, { page: PAGE, config: DRILL_CONFIG })`, and first load boots
`DrillEngine.create(DRILL_CONFIG)` when that global is present. Finding 6's dispatch
growth is accepted here; do not add a registry for this.

## Consumes A

Drill fill-blank grading moves into A's `kernel/grading/` module as `BlankMatchGrader`; this design
only wraps drill `check()` around that tested text policy.

## SOLID fit

- SRP - overlay, quiz, prose rendering, input DOM, runner output, and grading each get one reason to change.
- DIP - the controller depends on `LessonCommon.t`, `ResourceBindDrill`, and a grader role, not hardcoded globals or copied policies.
- OCP - a drill language or blank policy change adds bundle keys or a grader implementation, not another engine fork.
- ISP - locale swap depends only on `setLocale`; grading depends only on `grade`.
- DRY - build and drill share the factory/manual gate pattern, binder pattern, chrome catalog, and A's grading seam.
