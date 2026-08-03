# Drill engine conformance
Status: not started  -  Design: [docs/architecture/drill-engine-conformance.md](../architecture/drill-engine-conformance.md)

## Goal

Bring drill and theory-drill lessons into the same factory, binder, and live EN/ES locale
contract that build lessons already use, while reducing the drill God-module risk.

## Scope

In: `DrillEngine.create(cfg, opts)`, `boot/render/setLocale`, `data-manual`,
`resource/bind-drill.js`, drill string bundles, kernel dispatch, SRP collaborators, and
`BlankMatchGrader` wiring from Workstream A.

Out: a kernel registry, bus, framework, new runner, code-lab changes, build-engine
redesign, and re-specifying A's grading policy or kernel-home decision.

## Approach

Start only after Workstream A's first increment has landed: the chosen grading module
home exists, `OutputMatchGrader` is tested, and the test pattern is available for
`BlankMatchGrader`. Then make drill conform without behavior change, add the binder and
chrome strings, split the largest responsibilities, and finally wrap `check()` around A's
blank grader.

## Plan

1. [ ] Confirm A first increment is present - verify: `OutputMatchGrader` module path is recorded and its tests pass.
2. [ ] Add the drill factory, `boot/render/setLocale`, and `data-manual` gate without behavior change - verify: `node --check drill-engine.js`; legacy self-boot and manual boot both render the same first card.
3. [ ] Add `resource/bind-drill.js`, drill resource schema, chrome bundles, and kernel-controller `ResourceBindDrill` dispatch - verify: bind-drill unit tests mirror `bind-build.test.js` and the branch runs exactly once per swap.
4. [ ] Route drill chrome through `LessonCommon.t` and page-shell drill scaffold through existing chrome helpers - verify: EN remains unchanged and ES swap changes XP, Run, Next, recap, quiz feedback, fill heading, overlay labels.
5. [ ] Decompose the God-module into controller, explain overlay, quiz, prose/highlight, blank-input, Mermaid, and run-output units - verify: default render and card navigation stay unchanged in headless checks.
6. [ ] Land `BlankMatchGrader` in `kernel/grading/` and wrap drill `check()` around it - verify: exact, accepted, close, wrong, quiz-gated, and XP-award cases match prior behavior.

## Verification

- `export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH" && node --test test/` is green.
- Add `bind-drill` tests mirroring `bind-build.test.js`, plus a drill `setLocale` live-swap test.
- Headless render one drill page and one theory-drill page: no `undefined`, correct counters, and ES swap re-renders chrome and prose without losing learner state.
- `export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH" && node tools/check-i18n.mjs` passes.

## Progress

- 2026-08-03 Design-only brief written; implementation not started.

## Open

- A's grading module home is decided: `kernel/grading/`; Workstream B consumes that path.
- Sub-widget home is open: recommendation is root `drill/` modules for `ExplainOverlay` and `DrillQuiz`, with other helpers internal until a second consumer appears.
- Main risk: `setLocale()` must not reuse today's full render path if that would hide results or reset run output.
