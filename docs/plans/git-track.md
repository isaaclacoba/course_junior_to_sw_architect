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
10. [ ] Export the git runtime from code-lab `src/index.ts` (model ops + `git-cli.run`) and
    re-vendor - TODAY the bundle can render a graph but cannot RUN a command - verify: the
    vendored IIFE exposes them.
11. [ ] GitGraph ghost model: `setState(state, { ghost, diverged })` + next-step-only ghosting
    + "Show whole target" - verify: unit tests + headless render of the 5 stress cases.
12. [ ] `CodeLab.LineTerminal` widget (dep-free line console, command history) - verify: code-lab tests.
13. [ ] git-plugin on the generic engine (terminal + GitGraph + parser + dag-match, continuous
    grading, Reset + Show solution, multi-card) - verify: a git lesson reaches its goal headlessly.
14. [ ] verify-lesson git-validator (tsx runs the parser) + the validator registry - verify: verify-lesson --all.
Phase 3 - content
15. [ ] Theory lessons (stepped GitGraph, narration localized) - verify: verify-lesson + i18n round-trip.
16. [ ] Practical lessons (CLI + goal DAG) - verify: reach-goal checks pass.
17. [ ] Wire git track into course-registry + generate - verify: node tools/validate.mjs clean.

## Progress
- 2026-08-03 Design round + independent red-team done. Scope cut to a local-git core (defer rebase/cherry-pick/stash/reflog/remotes to the real-git track); minimal file/index model added; conflicts modeled; hashes display-only + DAG-structural grading. Build deferred until after WoW-enforcement.
- 2026-08-04 Phase 1 + the model half of phase 2 are LANDED (git-model, git-layout, GitGraph vendored, git-cli, dag-match). Practical-page UX ratified via a stress-test mockup: one canvas laid out from the target (ghost/diverged tagging), no Check button, terminal under the widget, next-step ghosting + "Show whole target", off-plan blocks the pass, multi-card. Found: the vendored bundle exports GitGraph + gitLayout only, so it cannot yet RUN a command.

## Open (build-time)
- DAG equivalence strictness for merge parents; hash preimage + collision guard; conflict-resolution UX with no file contents.
- Where the "next missing step" is computed (grader vs plugin) for next-step-only ghosting.
- Deferred to the next (real-git) track: rebase family, cherry-pick, stash, reflog, remotes, xterm terminal.
