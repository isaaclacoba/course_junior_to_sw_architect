# Git & GitHub track - design of record

Status: design ACCEPTED (owner ratified this round + independent red-team,
2026-08-03). BUILD DEFERRED - after the WoW-enforcement layers.
Brief: [docs/plans/git-track.md](../plans/git-track.md)

## What & why
A new 4th top-level track, "Git & GitHub", that teaches version control in the
browser: a Theory part (stepped narration over a commit graph) and a Practical part
(the learner types real git commands into a terminal and watches the graph react).
No real git here - a teaching model we own. Real git over the network is the SEPARATE
next track ("real projects backed on GitHub"), which reuses this track's visual.

## Ratified decisions (owner, 2026-08-03; * = changed by the red-team)
- New top-level track, Theory + Practical parts. Name: "Git & GitHub".
- Teaching-model git (a commit-DAG + a parser we own), Learn-Git-Branching style.
  Real-git-WASM is the next track, not this one.
- Practical interface: a dependency-free line terminal. xterm.js waits for the next track.
- Visual: a new `CodeLab.GitGraph` widget in code-lab (DOM-free model + layout, animated
  view), unit-tested there, then vendored.
- Commit ids: realistic short hashes - deterministic, DISPLAY-ONLY, never graded.*
- Grading: per lesson - DAG-structural isomorphism (default) + optional output-match.
- v1 scope CUT to a coherent local-git core (see Scope).*
- A minimal file/index model underpins the working area (see Model).*
- Conflicts ARE modeled, at path granularity, with `--abort`/`--continue`.*
- i18n: practical terminal English-only (like the runnable drills); theory narration localized.

## Model (RepoState) - paths + states, no file contents
```
RepoState = {
  commits:  Map<hash, { id, parents[], message, paths[] }>, // paths[] = files this commit touched
  refs:     Map<name, hash>,                                 // branches + tags
  head:     { kind:"branch", name } | { kind:"detached", commit },
  index:    Map<path, "staged">,                             // staging area
  worktree: Map<path, "modified">,                           // unstaged edits
  merge?:   { mergeHead, conflicted: path[] },               // transient, only mid-conflict
}
```
`paths[]` is what lets a merge detect "both sides touched `app.js`" and raise a conflict.
Not modeled in v1: stash shelf, remote-tracking refs + a remote RepoState, reflog.

## Scope (v1)
Ship: `init, add, status, commit -m, commit --amend, branch, switch/checkout -b, log,
tag, reset --soft/--mixed/--hard` (meaningful because the file/index model exists),
`merge` (fast-forward + 3-way with path conflicts + `--abort`/`--continue`),
`rev-parse, rev-list` (`HEAD~n, ^, A..B`), detached HEAD. Single-pane graph.
Defer to v1.1 / the real-git track: `rebase, rebase -i, rebase --onto, cherry-pick,
stash, reflog`, and all remotes (`clone/fetch/push/pull`, remote-tracking refs, the
two-pane view). Those are where the fake model teaches least honestly.

## The runtime seam
GitGraph renders a `RepoState` and does not care where it came from - so the teaching
model (this track) and real-git-WASM (next track) share one visual, `RepoState` unchanged.

## Visual & UX (owner-ratified 2026-08-03, via HTML mockup)
- **Orientation: HORIZONTAL** (Learn-Git-Branching style) - time flows left->right,
  branches are stacked rows, a merge dips to a branch row and rejoins. NOTE:
  `git-layout` was first built vertical (y=time, x=lane); it needs an axis rework to
  emit horizontal coordinates (x=time index, y=branch row) - the ordering + lane
  algorithm are reusable, only the output mapping flips.
- **Commit label: hash + message** under each dot (realistic 7-hex + readable message).
- **Colour: one per branch** (main indigo, feature teal; tag amber; HEAD dark pill);
  must follow the course dark theme.
- **Working-area panel: three zones** - Working tree | Staging | Repository - with
  files sliding between them on `add`/`commit`. Makes the worktree/index/repo model
  visible; it is the practical view beside the graph.
- **Animation: gentle (~400ms)** fade+slide for a new commit/edge. Merge draws the new
  dot + both incoming edges (no full re-layout); the HEAD pill glides to its commit;
  honour `prefers-reduced-motion` (instant for those users).

## Contracts
1. **git-model** (code-lab `src/core/git-model.ts`, DOM-free): `RepoState` + pure ops
   `RepoState -> { state, effect }` (effect drives animation): `commit, add, branch,
   tag, switch/checkout(-b), merge (ff | 3-way; conflict when both sides touch a path),
   reset(soft|mixed|hard), revParse, revList`. A conflict yields transient
   `{ mergeHead, conflicted[] }`; resolve = mark paths resolved then `commit`, or abort.
2. **git-cli** (code-lab `src/core/git-cli.ts`): `run(line, state) -> { state, output,
   effect, error? }` - parse a `git <sub>` line into an op, apply, return terminal text
   + effect. Unknown/deferred commands return a git-like error.
3. **GitGraph widget** (code-lab `src/dom/git-graph-view.ts`): `CodeLab.GitGraph`, root
   `.cl-git`. Layout math DOM-free in `src/core/git-layout.ts`
   (`layout(state) -> { nodes, edges, chips }`). `mount / setState({animate}) /
   on("inspect")`. v1 interactivity: click a commit/chip to inspect. Animation honesty:
   slide-in for new commits + fast-forward, a drawn merge node; no rebase/cross-pane
   tween in v1 (those ops are deferred anyway).
4. **git-engine** (course `git-engine.js` + `window.GIT_CONFIG`): terminal + GitGraph +
   model, mounted by page-shell (mirrors build-engine). Goal:
   `{type:"dag",target} | {type:"output",expected} | {type:"both"}`.
5. **DAG grader** (NEW shared `kernel/grading/dag-match.js`, browser + node - like
   `output-match.js`): equivalence = refs matched by name; HEAD checked; commits matched
   by parent-structure + message, IGNORING id (so cherry-pick/rebase copies match);
   merge parents order-insensitive by default (per-lesson strict opt-in). Wired into
   `tools/verify-lesson.mjs` via a NEW headless parser path (neither exists today).
6. **Theory viz**: GitGraph stepped mode (one `RepoState` + narration per step, like
   MemoryViz). NEW `GIT_CONFIG`/stepped-GitGraph branch in `resource/kernel-controller.js`
   + `page-shell.js`, surviving the relocalize destroy/re-create cycle.

## Where it lives
code-lab `src/core` (git-model, git-cli, git-layout + `test/`), `src/dom`
(git-graph-view), `src/index.ts` (export `CodeLab.GitGraph`), `src/code-lab.css`
(`.cl-git`). Course: `git-engine.js`, a page-shell git mount, `kernel/grading/dag-match.js`,
re-vendored `vendor/code-lab`. Content: `content/git/<part>/<lesson>/` + a `git` track
in `course-registry.js`.

## Concept graph (introduce-once)
repo, commit, hash, DAG, HEAD, ref, branch, tag, working tree, index/staging area,
fast-forward, three-way merge, conflict, abort/continue, reset modes, detached HEAD,
rev-parse, rev-list.

## Phasing
0 design (this doc + concept graph). 1 GitGraph widget (model + layout + view, code-lab
tests). 2 parser + DAG grader + verify path + git-engine + page-shell mount. 3 content
(theory viz + practical CLI + registry/generate). Real git = the NEXT track.

## Build-time detail (ratify at build)
- Merge-parent strictness in the equivalence relation (default order-insensitive).
- Hash preimage (`parents + message + creation-order salt`) + a collision guard.
- Conflict-resolution UX with no file contents (mark a path resolved, then commit).
