# Git track - design of record

Status: draft  -  Brief: [docs/plans/git-track.md](../plans/git-track.md)

Contracts other work must honour (the brief holds "where are we"). Locked at
kickoff: teaching-model git for the learning lessons, real git via WASM later for
GitHub-backed repos; one Git track (Theory + Practical); a command-line practical
interface; a `CodeLab.GitGraph` widget that renders + animates + is interactive.

## The runtime seam
GitGraph renders a `RepoState` and does not care where it came from - so the
teaching model (Phases 1-3) and real-git-WASM (Phase 4) share one visual, and
`RepoState` is unchanged between them.

## Contract 1 - the git model (code-lab `src/core/git-model.ts`, DOM-free)

Shapes (teaching model; ids are sequential `C1, C2, ...` for legibility, with a
display option for realistic short hashes later):

```
Commit    = { id, parents: id[], message }
Ref name  = "refs/heads/<b>" (branch) | "refs/tags/<t>" (tag)     // remotes: Phase 4
HEAD      = { kind: "branch", name } | { kind: "detached", commit: id }
RepoState = { commits: Map<id,Commit>, refs: Map<name,id>, head, lanes? }
```

Pure ops `RepoState -> { state, effect }` (effect drives animation): `commit`
(parent = HEAD commit; advance branch or move detached HEAD); `branch`/`tag(at?)`;
`switch`/`checkout(create?)` (detached when a commit); `merge` (fast-forward, else a
3-way merge commit); `rebase(onto, plan?)` (replay `mergeBase..HEAD` as new commits;
`-i` plan = ordered `pick|reword|squash|drop`); `amend` (replace HEAD commit, move
branch); `reset(mode, target)` (soft|mixed|hard); `revParse`, `revList`.

Rev syntax to resolve: `HEAD`, `@`, `<branch>`, `<tag>`, `<shortid>`, `HEAD~n`,
`HEAD^`, `HEAD^2`. Ranges for rev-list: `A..B`, `A...B`, `--all`.

## Contract 2 - the command parser (code-lab `src/core/git-cli.ts`)

`run(line, state) -> { state, output, effect, error? }`. Parses a `git <sub> ...`
line into a model op, applies it, returns terminal text + an animation effect.

MVP subcommands: `init, add, commit -m, commit --amend, log, status, branch,
switch/checkout [-b], merge, rebase [--onto] [-i], reset [--soft|--mixed|--hard],
tag, rev-parse, rev-list`. Unknown/blocked commands return a git-like error.

## Contract 3 - the GitGraph widget (code-lab `src/dom/git-graph-view.ts`)

Export `CodeLab.GitGraph`. Root class `.cl-git`. Layout math lives DOM-free in
`src/core/git-layout.ts` (`layout(state) -> { nodes:[{id,x,y}], edges, chips }`) so
it is unit-testable; the view only paints and animates.

```
const g = new CodeLab.GitGraph();
g.mount(host, { state });            // sized container required
g.setState(state, { animate: true }); // slide-in commit, re-lay rebase, draw merge
g.on("inspect", ({ commit|ref }) => …); // v1 interactivity: click a node/chip
g.destroy();
```

v1 interactivity = click a commit or ref chip to inspect/highlight. Drag-to-act is
deferred.

## Contract 4 - the practical engine (course `git-engine.js` + `window.GIT_CONFIG`)

Mirrors `build-engine.js`: config-driven, mounted by page-shell. Mounts a
dep-free line terminal (input + scrollback) beside the GitGraph.

```
GIT_CONFIG = { prefix, start: RepoState-seed,
  goal: {type:"dag",target} | {type:"output",expected} | {type:"both"},
  allowed: [...subcommands], hints, xpKey, awardedKey, awardAmount }
```

Each typed command runs through the parser, re-renders the graph, then checks the
goal (target-DAG isomorphism, or expected output, or both). Reaching it awards XP.

## Contract 5 - theory lessons (viz)

Theory lessons step through git STATES with narration - GitGraph in a stepped mode,
one state + narration per step (like MemoryViz). Reconcile the mount with
page-shell's viz path in Phase 1 once the widget exists.

## Where it lives
code-lab `src/core` (`git-model`, `git-cli`, `git-layout` + `test/`), `src/dom`
(`git-graph-view`), `src/index.ts` (export `CodeLab.GitGraph` + types),
`src/code-lab.css` (`.cl-git`). Course: `git-engine.js`, a page-shell git mount,
re-vendored `vendor/code-lab`. Content: `content/git/<part>/<lesson>/` + a `git`
track in `course-registry.js`.

## Phasing
Phases 1-3 ship the teaching runtime end to end (widget -> engine -> content).
Phase 4 spikes real git (isomorphic-git first; libgit2-WASM only if rebase fidelity
demands it; GitHub auth via device flow/token is a Phase 4 concern).

## Open (decisions to settle as we build)
- Commit ids: `Cn` (leaning, Learn-Git-Branching-like) vs realistic short hashes.
- Terminal: dep-free custom line terminal (leaning) vs `xterm.js`.
- Staging depth: only as deep as `reset --soft|--mixed|--hard` + `add`/`commit` need.
- Theory viz integration; goal grading = target-DAG isomorphism (match shape + refs).
