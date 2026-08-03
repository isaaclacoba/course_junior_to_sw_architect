# Page-shell split
Status: in progress  -  Design: [docs/architecture/page-shell-split.md](../architecture/page-shell-split.md)

## Goal

Break the 679-line `page-shell.js` God-module into single-responsibility modules under
`kernel/page-shell/`, without changing what any of the 83 lesson pages load or how they
behave.

## Approach

`page-shell.js` stops being hand-written and becomes a generated artifact: eight sources
are concatenated, in today's source order, back into the same root file by
`tools/generate.mjs`. Every caller keeps the exact path it uses today, so the split is
invisible outside `kernel/page-shell/`.

Three self-contained modules become real dual-UMD files so they can be unit-tested in
isolation. The other five share `page`/`hero` and the early-return, so they stay body
fragments in one outer IIFE - same statements, same scope, same order. Strictly
behaviour-preserving: no string extraction rides along, so any regression is
unambiguously the split.

## Plan

1. [x] Add the concat step to `tools/generate.mjs` + a generated-file header - verify: the concat reproduced all 679 lines byte-for-byte (only the 3-line header differs); 87/87 tests, gate PASS.
2. [x] Extend the CI drift gate to cover the artifact - verify: a hand edit makes `audit-gate` FAIL naming `page-shell.js`; deploy.yml diffs it too.
3. [x] Cut the three UMD modules: `lesson-common.js`, `chrome-text.js`, `card-templates.js` - verify: all three `require()` standalone in Node; 87/87 tests; 3 archetypes x 2 locales render clean.
4. [x] Cut the five fragments: `guard.js`, `hero.js`, `concepts.js`, `boot.js`, `viz-checkpoint.js` - verify: done in step 1 as exact slices; they keep the shared `page`/`hero` scope.
5. [x] Add the alias block and re-point the 19 bare call-sites - verify: generator emits the alias block; no `ReferenceError` in any headless render.
6. [ ] Unit-test the three pure modules - verify: each new test fails if its module is reverted to the inline form; `test/lesson-common.test.js` no longer loads 679 lines.
7. [ ] Manual + headless validation, and record the test/validation gaps found - verify: one build, one viz and one checkpoint lesson render EN and ES with no `undefined`.
8. [ ] Final verification - verify: `npm run gate` full fan-out passes once, before pushing.

## Progress

- 2026-08-03 Design round run with the owner. Decided: generated artifact at the repo root (not a thin loader, not injector changes); unit-test only the three pure modules; strictly behaviour-preserving; single full gate fan-out at the end.
- 2026-08-03 Architect review of the load contract corrected during grounding: a uniform 7x UMD split is not behaviour-preserving - `page`/`hero` are shared consts and the guards use a bare `return` to abort the whole IIFE. Design switched to the hybrid shape and an eighth `guard.js` module.

- 2026-08-03 Steps 1-2 done. Golden-master split: 8 exact slices under `kernel/page-shell/`, concatenated back byte-identically. Found and fixed two gaps the design missed - audit-gate's drift walker mapped every top-level mirror file to `generated/` (wrong for a root artefact), and a module on disk but absent from the manifest would have been silently dropped.

- 2026-08-03 Steps 3-5 done. The three pure modules are real dual-UMD files, hoisted above the shared IIFE, and now `require()` standalone in Node - previously impossible. UMD root is `window` (not `globalThis`): the vm sandbox in `test/lesson-common.test.js` sets `window` as a SEPARATE object, so a `globalThis` root would have silently stopped exposing `window.LessonCommon`.

## Open

- None. Ready to start at step 1.
