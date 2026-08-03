# Git & GitHub - teach version control in the browser
Status: design accepted - build deferred (after WoW-enforcement)  -  Design: [docs/architecture/git-track.md](../architecture/git-track.md)

## Goal
A 4th top-level track that teaches git from the ground up: a Theory part (the mental
model via a commit-graph widget) and a Practical part where the learner drives real git
commands in the browser and watches the graph react. Teaching model only; real git over
the network is the separate next track.

## Approach
A teaching-model git we own - a commit-DAG + a minimal file/index model + a git command
parser, Learn-Git-Branching style - fully animatable, every command ours. The visual is a
new `CodeLab.GitGraph` widget built + unit-tested in code-lab, then vendored. The practical
page is a new `git-engine` (dep-free terminal + GitGraph + model) driven by a per-lesson
`GIT_CONFIG`. Grading is DAG-structural via a new shared `kernel/grading/dag-match.js`.

## Plan
Phase 0 - design
1. [x] Foundational + finer decisions ratified with owner + red-team - verify: this brief + design doc.
2. [x] Design of record (model / scope / contracts / grader / phasing) - verify: docs/architecture/git-track.md.
3. [ ] Concept graph for git theory (introduce-once list in the design) - verify: listed, introduce-once.
Phase 1 - GitGraph widget (code-lab)
4. [ ] git-model (DOM-free): RepoState + ops incl 3-way merge with path conflicts - verify: code-lab tests.
5. [ ] git-layout (DOM-free) + GitGraph view (.cl-git): render + slide-in/merge animation - verify: headless render.
6. [ ] Click-to-inspect interactivity - verify: click emits inspect.
7. [ ] Build + re-vendor to course vendor/code-lab - verify: CodeLab.GitGraph in the vendored IIFE.
Phase 2 - engine + grader + page
8. [ ] git-cli parser (v1 command set) - verify: parser unit tests.
9. [ ] kernel/grading/dag-match.js (browser+node) + verify-lesson parser path - verify: grader tests + a lesson graded headlessly.
10. [ ] git-engine.js + page-shell git mount + stepped theory branch - verify: a git page renders + reaches goal headlessly.
Phase 3 - content
11. [ ] Theory lessons (stepped GitGraph, narration localized) - verify: verify-lesson + i18n round-trip.
12. [ ] Practical lessons (CLI + goal DAG) - verify: reach-goal checks pass.
13. [ ] Wire git track into course-registry + generate - verify: node tools/validate.mjs clean.

## Progress
- 2026-08-03 Design round + independent red-team done. Scope cut to a local-git core (defer rebase/cherry-pick/stash/reflog/remotes to the real-git track); minimal file/index model added; conflicts modeled; hashes display-only + DAG-structural grading. Build deferred until after WoW-enforcement.

## Open (build-time)
- DAG equivalence strictness for merge parents; hash preimage + collision guard; conflict-resolution UX with no file contents.
- Deferred to the next (real-git) track: rebase family, cherry-pick, stash, reflog, remotes, xterm terminal.
