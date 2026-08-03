# Grading subsystem
Status: increment 1 done (OutputMatchGrader shared by build-engine + verify-lesson)  -  Design: [docs/architecture/grading-subsystem.md](../architecture/grading-subsystem.md)

## Goal

Remove the drift between browser build grading and `tools/verify-lesson.mjs`,
while designing the full `Grader` seam for build and drill lessons.

## Scope

In: the design, the first output-grading extraction plan, tests for the extracted
policy, and the later Workstream B path for blank grading.

Out: engine edits in this design round, a new bus/registry/host, a framework, a
new runner, and landing the drill refactor before Workstream B.

## Approach

Design full, build incrementally. First ship one DOM-free C# output-match module
used by both `build-engine.js` and `tools/verify-lesson.mjs`. Keep the runner
injected so the module is unit-testable. Defer `BlankMatchGrader` and the full
shared `Grader` role until the drill-engine refactor in Workstream B.

## Plan

Step group 1 - first increment: kill output-grading drift.

1. [x] Create `kernel/grading/` (owner-chosen home) - verify: the new dir holds only the grading module, no bus/registry/host.
2. [x] Create the OutputMatchGrader module in `kernel/grading/` - verify: it exports `matches`, `unmetRequirement`, `buildProbe`, `describeExpected`, and hidden verify helpers.
3. [x] Update `build-engine.js` to consume the module - verify: run ordering and result messages match current behavior.
4. [x] Update `tools/verify-lesson.mjs` to consume the same module - verify: no local copy of `matches`, `buildProbe`, or the `Program` regex remains.
5. [x] Add grading unit tests with a fake runner - verify: visible match, source gate, hidden verify, and probe-building cases pass without DOM.
6. [x] Run first-increment verification - verify: the existing test suite and representative lesson verification stay green.

Step group 2 - lands with Workstream B: complete the Grader seam.

7. [ ] Extract `BlankMatchGrader` from `drill-engine.js` - verify: whitespace, semicolon, case, accepted-answer, close, and wrong cases are covered.
8. [ ] Introduce the shared `Grader` role documentation in code comments or module docs - verify: build and drill depend on narrow grading capabilities only.
9. [ ] Wire drill `check()` around `BlankMatchGrader` - verify: DOM classes, hints, quiz gating, and XP behavior stay unchanged.

## Verification - first increment

- `export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH" && node --test test/`
  stays green.
- New grading unit tests use a fake runner; no DOM, Monaco, Roslyn iframe, or
  `dotnet` process is required.
- `build-engine.js` behavior is unchanged: compile errors, runtime errors,
  output mismatch, source gate failure, hidden verify failure, and pass still
  happen in the same order.
- `tools/verify-lesson.mjs` still certifies the same build lessons it certified
  before the extraction.

## Progress

- 2026-08-03 - Design-only brief written.
- 2026-08-03 - Increment 1 landed: `kernel/grading/output-match.js` (first `kernel/`
  dir); `build-engine.js` and `tools/verify-lesson.mjs` both consume it, drift gone;
  23 grading unit tests (fake runner, no DOM); suite 76/76; verify-lesson certifies
  build lessons unchanged; browser render + engine wiring confirmed headless.

## Open

- Kernel-home decided: `kernel/grading/` (owner, 2026-08-03) - the first `kernel/`
  dir, scoped to the grading capability only.
- Browser + Node module shape must stay bundler-free and plain-script friendly.
- `describeExpected` should preserve current fallback text now; a later i18n pass
  can convert result reasons into localized copy if needed.
