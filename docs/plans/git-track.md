# Git track - teach version control in the browser
Status: in progress  -  Design: [docs/architecture/git-track.md](../architecture/git-track.md) (draft)

## Goal
Add a fourth top-level track that teaches git from the ground up: a Theory part
(the mental model, via a new commit-DAG widget) and a Practical part where a
learner drives git commands in the browser - branch, merge, rebase, amend,
`rebase -i`, `rev-parse`/`rev-list` - and watches the graph react.

## Approach
Two runtimes, phased. Learning lessons use a controllable teaching-model git (a
commit-DAG plus a git command parser we own, Learn-Git-Branching style) - lightest,
fully animatable, every command ours to define. A later phase adds real git via
WASM for lessons that work on an actual GitHub-backed repo. The DAG visual is a new
`CodeLab.GitGraph` widget (render + animate + interactive) built and unit-tested in
the code-lab submodule, then vendored. The practical page is a new engine (terminal
input + GitGraph + model) driven by a per-lesson `GIT_CONFIG` (start state, goal
DAG, allowed commands).

## Plan
Phase 0 - design
1. [ ] Lock track name + kicker - verify: owner picks (see Open)
2. [ ] Design-of-record docs/architecture/git-track.md (model/parser/widget/engine contracts + phasing) - verify: reviewed
3. [ ] Concept graph for git theory (repo, commit, DAG, HEAD, ref, branch, fast-forward, three-way merge, rebase, amend, rebase -i, rev-parse, rev-list, detached HEAD) - verify: introduce-once, listed

Phase 1 - GitGraph widget (code-lab)
4. [ ] Git model (DOM-free): commits, refs, HEAD, ops - verify: code-lab/test unit tests
5. [ ] GitGraph view (.cl-git): render + animate DAG from state - verify: headless render of a known DAG
6. [ ] Interactivity: click a commit/ref to inspect (drag later) - verify: click emits inspect
7. [ ] Build + re-vendor bundle to course vendor/code-lab - verify: CodeLab.GitGraph in vendored IIFE

Phase 2 - command engine + practical page
8. [ ] Git command parser (git <cmd> -> op), incl. rebase -i / rev-parse / rev-list - verify: parser unit tests
9. [ ] course git-engine.js: terminal + GitGraph + model, driven by GIT_CONFIG - verify: a lesson reaches its goal DAG
10. [ ] page-shell mount path for the git archetype - verify: a git page renders headlessly

Phase 3 - content
11. [ ] Theory lessons (viz via GitGraph) - verify: verify-lesson + i18n round-trip clean
12. [ ] Practical lessons (CLI + goal DAG) - verify: reach-goal checks pass
13. [ ] Wire track into course-registry + generate - verify: node tools/validate.mjs clean

Phase 4 - future (real git)
14. [ ] Spike real git via WASM (isomorphic-git vs libgit2) for GitHub-backed repos - verify: clones + logs a repo in-browser

## Progress
- 2026-08-03 Kicked off. Locked: teaching-model git for learning + real-git-WASM later; one track with Theory + Practical parts; command-line interface; GitGraph widget render + animate + interactive. Brief created. Another agent is mid-fix, so no course push yet.
- 2026-08-03 Design-of-record drafted (docs/architecture/git-track.md): model / parser / widget / engine contracts + phasing. Pending owner review + the three Open decisions.

## Open
- Track name/kicker. Options: "Git in action" | "Version control" | "Git & GitHub" | "Working with Git" | "Git from the ground up". (Existing kickers: Practical="Hands on", Theory="From zero", AI="Agents from scratch".)
- MVP command scope: init, add, commit, branch, switch/checkout, merge (ff + 3-way), rebase, rebase -i, amend, reset, log, rev-parse, rev-list, tag, reflog - cut any for v1?
- Practical "goal" style: reach a target DAG, match command output, or both?
