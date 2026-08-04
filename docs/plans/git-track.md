# Git & GitHub - teach version control in the browser
Status: design accepted - build deferred (after WoW-enforcement)  -  Design: [docs/architecture/git-track.md](../architecture/git-track.md)

## Goal
A 4th top-level track that teaches git from the ground up: a Theory part (the mental
model via a commit-graph widget) and a Practical part where the learner drives real git
commands in the browser and watches the graph react. Teaching model only; real git over
the network is the separate next track.

## Approach
A teaching-model git we own - a commit-DAG + a minimal file/index model + a git command
parser, Learn-Git-Branching style - fully animatable, every command ours. The visual is the
`CodeLab.GitGraph` widget built + unit-tested in code-lab, then vendored. The practical page
is a **git-plugin on the generic lesson engine** (`archetype: "git"`, one
`window.LESSON_CONFIG`) - terminal under the widget, **no Check button** (Enter runs and
re-checks). The target is drawn IN PLACE on one canvas: missing commits ghosted, off-plan
commits flagged. Grading is DAG-structural via `kernel/grading/dag-match.js`.

## Plan
Phase 0 - design
1. [x] Foundational + finer decisions ratified with owner + red-team - verify: this brief + design doc.
2. [x] Design of record (model / scope / contracts / grader / phasing) - verify: docs/architecture/git-track.md.
3. [x] Practical page UX ratified via a 5-case stress-test mockup (D-git-track-23..26) - verify: design doc "Practical page UX".
4. [ ] Concept graph for git theory (introduce-once list in the design) - verify: listed, introduce-once.
Phase 1 - GitGraph widget (code-lab)
5. [x] git-model (DOM-free): RepoState + ops incl 3-way merge with path conflicts - verify: code-lab tests.
6. [x] git-layout (DOM-free, horizontal) + GitGraph view (.cl-git) + click-to-inspect - verify: tests + headless render.
7. [x] Build + re-vendor to course vendor/code-lab - verify: CodeLab.GitGraph in the vendored IIFE.
Phase 2 - engine + grader + page
8. [x] git-cli parser (v1 command set) - verify: parser unit tests.
9. [x] kernel/grading/dag-match.js (browser+node) - verify: grader tests.
10. [x] Export the git runtime from code-lab `src/index.ts` (model ops + `git-cli.run`) and
    re-vendor - verify: the vendored IIFE exposes them (done, verified in a browser).
11. [x] GitGraph ghost model: `setState(state, { ghost, diverged })` + next-step-only ghosting
    (in `kernel/engine/git-progress.js`) + `{all:true}` for "Show whole target" - verify: 11 widget
    tests + 18 progress tests + a live browser render of ghost/diverged/edge-ghost.
12. [x] `CodeLab.LineTerminal` widget (dep-free line console, ArrowUp/Down history) - verify: 19 tests.
13. [x] git-plugin on the generic engine (terminal + GitGraph + parser + git-progress, continuous
    grading, Reset + Show solution, multi-card) - verify: 10 tests + a real page rendered.
14. [x] Make the archetype renderable: git card scaffold in page-shell, `@variant git` in the
    template + `ARCHETYPE_RENDER` map in the generator, `ARCHETYPE_DEPS` in the controller,
    six git chrome keys EN+ES, `git` registered in `tools/lib.mjs` - verify: a git lesson
    renders (graph + zones + terminal, one ghost, no Check) with 0 undefined in EN and ES.
15. [x] verify-lesson validator REGISTRY (injected deps) + the git validator: replays each task's
    solution through the vendored bundle and fails unless it reaches the target with zero
    off-plan commits - verify: 22 tests; build/viz/checkpoint unchanged.
Phase 3 - content
16. [ ] Theory lessons (stepped GitGraph, narration localized) - verify: verify-lesson + i18n round-trip.
17. [ ] Practical lessons (CLI + goal DAG) - verify: reach-goal checks pass.
18. [ ] Wire the git track into course-registry + generate - verify: node tools/validate.mjs clean.

## Progress
- 2026-08-03 Design round + independent red-team done. Scope cut to a local-git core (defer rebase/cherry-pick/stash/reflog/remotes to the real-git track); minimal file/index model added; conflicts modeled; hashes display-only + DAG-structural grading. Build deferred until after WoW-enforcement.
- 2026-08-04 Phase 1 + the model half of phase 2 are LANDED (git-model, git-layout, GitGraph vendored, git-cli, dag-match). Practical-page UX ratified via a stress-test mockup: one canvas laid out from the target (ghost/diverged tagging), no Check button, terminal under the widget, next-step ghosting + "Show whole target", off-plan blocks the pass, multi-card. Found: the vendored bundle exports GitGraph + gitLayout only, so it cannot yet RUN a command.
- 2026-08-04 Steps 10-12 landed in parallel (code-lab `feat(git)`, course `f737c1e`): git runtime exported + re-vendored, GitGraph ghost/diverged model, CodeLab.LineTerminal, and `kernel/engine/git-progress.js` (ghost/diverged/solved/union/nextStep). Verified end-to-end in a real browser: the solution reaches solved with 0 ghosts, an off-plan commit blocks the pass, and ghost/diverged render correctly.
- 2026-08-04 Steps 13-15 landed: the git-plugin plus all the plumbing that makes the archetype renderable (page-shell git card, generator variant-by-name + ARCHETYPE_RENDER, controller ARCHETYPE_DEPS, chrome keys, validator registry + git validator). PROVEN with a throwaway lesson: the page mounts graph + zones + terminal, shows one ghosted next step, has no Check button, renders 0 undefined EN+ES, and the validator confirms the solution reaches the target. Zero drift on the 83 existing lessons. **The engine work is done - what remains is CONTENT.**

## Open (build-time)
- DAG equivalence strictness for merge parents; hash preimage + collision guard; conflict-resolution UX with no file contents.
- Where the "next missing step" is computed (grader vs plugin) for next-step-only ghosting.
- Deferred to the next (real-git) track: rebase family, cherry-pick, stash, reflog, remotes, xterm terminal.
