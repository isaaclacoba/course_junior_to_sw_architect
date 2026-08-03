# Page-shell split - design of record

Status: agreed with the owner on 2026-08-03. Plan: [docs/plans/page-shell-split.md](../plans/page-shell-split.md)

## Context & trigger

`page-shell.js` is 679 lines in one IIFE, loaded by all 83 lessons, and owns nine
responsibilities: the storage seam, `LessonCommon`, chrome text, the hero, the concept
agenda, two card templates, next-lesson derivation, archetype dispatch, and the mounting
of two vendored widgets.

The cost already shows in the tests. `test/lesson-common.test.js` loads all 679 lines into
a `vm` sandbox to reach 108 lines of pure helpers, and only works because the definitions
happen to precede the `window.PAGE` bail-out - an accident of statement ordering, not a
contract.

## The binding constraint

`page-shell.js` must finish all of its work - definitions and side effects - during its
own synchronous execution. `resource/kernel-controller.js:189` injects it, and the very
next `.then()` (191-203) immediately reads `PageShellHero`, `PageShellChrome`,
`PageShellViz`, `PageShellCheckpoint` and `PageShellConcepts` onto `surfaces`.

A script's `onload` fires when that script finishes, not when scripts it injected finish,
and a browser script cannot synchronously load another. So a thin `page-shell.js` that
injects children would resolve before they ran, leaving those globals `undefined` and
silently dropping every surface - language switching would break on every lesson, with no
error. That rules out the loader approach outright.

## Decision

`page-shell.js` becomes a **generated artifact**: sources under `kernel/page-shell/`
concatenated back into the same root file by `tools/generate.mjs`.

Chosen over changing the injectors to fetch each file: that touches both injectors, four
template variants, the generator's three tail-rewriting functions and `visualize.html`,
and gains only the deletion of one file.

Generation is not new here - `tools/generate.mjs` already writes the 83 `index.html` pages
and four `generated/` artifacts, gated by `git diff --exit-code`. The concat folds into
that entry point and that gate. The artifact stays at the repo root so every reference
path is unchanged; a header comment plus the gate carry the "generated" meaning.

## Module map

Order below is the current source order, so the concat reproduces today's behaviour.

| # | Module | Lines | Owns | Exposes |
|---|--------|-------|------|---------|
| 1 | `lesson-common.js` | 30-156 | storage seam, `escapeHtml`, `renderInline`, progress, output panel, `t()` | `LessonCommon` |
| 2 | `chrome-text.js` | 158-191 | `tHtml`, `tAttr`, `tSlot`, `repaintChrome` | `PageShellChrome` |
| 3 | `card-templates.js` | 398-534 | `drillCard` (dormant, kept), `buildCard` | card factories |
| 4 | `guard.js` | 193-203 | `page`/`hero` consts, the two early returns | - |
| 5 | `hero.js` | 205-287 | hero markup, intro, crumb, `repaintHero` | - |
| 6 | `concepts.js` | 288-396 | agenda and concept panel | `PageShellConcepts` |
| 7 | `boot.js` | 536-573 | `nextHref`, side-effect render, archetype dispatch | `PageShellHero` |
| 8 | `viz-checkpoint.js` | 575-678 | mounts `MemoryViz` and `Quiz` | `PageShellViz`, `PageShellCheckpoint` |

Eight files, not seven: isolating the guard is what lets the four fragment modules keep
the abort semantics they rely on. `PageShellHero` is exported from `boot.js` because line
567 sits inside the boot side effects today, not with the hero functions. The last module
must follow `vendor/code-lab/code-lab.global.js`, already loaded earlier by every
template variant.

## What a naive seven-module split breaks

Wrapping each of the seven in its own UMD closure is **not** behaviour-preserving. Three
things cross module boundaries today and would silently break:

- `page` and `hero` are `const`s declared at lines 193-199 and read by hero, concepts,
  boot and viz-checkpoint. Separate closures do not share them.
- The guards at 194-203 use a bare `return` to abort the **whole** IIFE when `window.PAGE`
  or `#pageHero` is missing. Inside a per-module closure that `return` would abort only
  that module, and the remaining four would run against undefined state.
- `tHtml`/`tAttr`/`tSlot` have 15 bare call-sites after line 191, and `LessonCommon` has
  four.

## Module shape - hybrid, by dependency not by uniformity

Three modules are self-contained and become real dual-UMD files, matching
`kernel/grading/output-match.js:15-23` - `window.*` in the browser, `module.exports` in
Node - so a unit test can `require()` one in isolation. These are exactly the three the
owner chose to unit-test: `lesson-common.js` (no deps), `chrome-text.js` (needs
`LessonCommon`) and `card-templates.js` (needs the chrome-text helpers).

The other four share `page`/`hero` and the early-return, so they stay **body fragments**
spliced into one shared outer IIFE, in their current order. Same statements, same scope,
same order - behaviour-identical by construction, which is the property that makes this
split safe to do without a rewrite.

The concatenated artifact is therefore:

```
<lesson-common.js>            UMD, self-contained
<chrome-text.js>              UMD, self-contained
<card-templates.js>           UMD, self-contained
(function () {
  "use strict";
  <alias block>               bare names re-bound from the three globals
  <guard fragment>            page/hero consts + the two early returns
  <hero.js> <concepts.js> <boot.js> <viz-checkpoint.js>
})();
```

The alias block keeps the 19 bare call-sites untouched: one line per name, instead of 19
edits and 19 chances to miss one.

One ordering change is accepted - `card-templates.js` is hoisted above the guard, so
`drillCard`/`buildCard` are defined even with no `window.PAGE`. They are pure definitions
with no side effects, and being reachable without a live page is what makes them
unit-testable.

## Scope discipline

Strictly behaviour-preserving. The 8 hardcoded strings, the i18n literal linter, and
enforcing `Localizable`/`WidgetController` are separate items and do not ride along, so
any regression is unambiguously the split.

## Consequences

- `page-shell.js` must no longer be hand-edited; the drift gate enforces this.
- `test/lesson-common.test.js` stops depending on statement-order luck.
- Adding a surface becomes a new module plus one concat entry, not a new region in a
  679-line file.
