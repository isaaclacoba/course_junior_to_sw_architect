---
name: integration
description: >-
  Land a large, long-diverged branch onto a public deployed branch in this repo,
  safely and non-destructively. USE FOR: merging two multi-day lines of work (e.g.
  an audit/feature line and a restructure/i18n trunk) that share only an old
  merge-base; landing onto a GitHub-Pages-deployed origin/master without a
  force-push; porting features across a diverged history as tracked units;
  rebasing i18n/JSON with disjoint-key conflicts; auditing that "nothing is lost"
  before you land; getting the code-lab submodule + CI drift gate + workflow-scope
  push right so the deploy goes green. DO NOT USE FOR: routine single-branch
  commits/PRs (just commit); authoring lesson content (use lesson-authoring);
  theming (use theme-authoring); a genuine history rewrite to purge an identity
  (that is the "Git & GitHub identity" learnings, not this).
---

# Landing a large divergent branch (safe integration)

Two multi-day lines of work must become one, and one of them is the PUBLIC branch
that GitHub Pages deploys. This is the safeguarded, non-destructive playbook that
took a real 38-commit + 72-commit merge from "refused push" to a green deploy with
no `git push -f`. The one-line gotchas live in
`.github/instructions/learnings.instructions.md` (sections "Git & GitHub identity"
and "Landing a large divergent branch"); this skill is the end-to-end method.

## The mental model (read this first)

"master" is often TWO things: a local trunk you have been building, and a public
`origin/master` that is a DIFFERENT line (older, deployed, diverged). They split at
an old merge-base and each advanced. A plain `git push` is then refused - not
because you rewrote history, but because the two lines diverged. The fix is NOT
`-f`. If your trunk already contains the public line's CONTENT (because you ported
it feature-by-feature), you land it by recording the public line as a merge PARENT,
so it becomes an ancestor and the push fast-forwards.

Golden rules:
- Never `-f` a public deployed branch to "make it go". Diverged != rewritten.
- Pick ONE trunk and port the other line's features ONTO it as tracked units. Do
  not try to `git merge` two 38/72-commit trees blind.
- Work in a `git worktree`, never in-place. Keep a timestamped backup branch.
- Nothing is "done" until the CI deploy is GREEN, not just until the push succeeds.

## Phase 0 - Map the topology (do not skip)

Establish the exact shape before touching anything:

```
git fetch origin
git merge-base origin/master <trunk>            # the old split point
git rev-list --left-right --count origin/master...<trunk>   # ahead/behind both ways
git log --oneline --graph --decorate -20 --all
git submodule status                            # note each gitlink SHA
```

Write down: which line is DEPLOYED (origin/master), which is the structural/newer
trunk, the merge-base, how far each is ahead, and every submodule pointer. A push
that is "N ahead, M behind" is a divergence - plan a `-s ours` land, not a push.

## Phase 1 - Choose the trunk + safety net

- Choose the trunk that is more expensive to recreate - usually the structural /
  restructured / i18n line (moving files back is worse than re-porting features).
- Create the integration worktree and a timestamped backup BEFORE any rebase:

```
git worktree add ../wt-integration -b integration/<name> <trunk>
git branch backup/integration-pre-rebase-$(date +%Y%m%d-%H%M%S) integration/<name>
```

## Phase 2 - Port the other line's features as TRACKED units

Do not cherry-pick 38 commits and hope. Enumerate FEATURES and FILES, track them in
the session DB, and port each deliberately.

- Use SQL tables to track the merge (this repo has used `merge_features`,
  `merge_files`, `ped_edits`, `viz_port`): one row per feature/file with a status.
  Port, verify, mark done. This is what stops a feature silently going missing.
- Categorise every file the absorbed line changed:
  - ABSENT-in-trunk (flat files migrated to `content/`, decommissioned dirs,
    the submodule) - handle by re-porting the FEATURE into the new layout, not the
    old path.
  - IN-TREE shared files (engines, styles, docs) - 3-way merge them.
- i18n / JSON conflicts are almost always DISJOINT-KEY: each line added different
  keys to the same `en.json`/`es.json`. A key-level 3-way merge (base vs ours vs
  theirs, union of keys, flag only true same-key clashes) resolves them all with
  zero hand-editing. Append-only files (`docs/work-log.md`) are union keep-both.
- If you rebase the integration branch onto an advanced trunk, run that same
  key-level resolver for each conflicted JSON; verify master stayed a strict
  ancestor afterwards (`git merge-base --is-ancestor <trunk> <integration>`).

## Phase 3 - Verify the integrated tree

Before landing, prove the tree works (see also lesson-authoring / copilot-instructions
verify recipes):

```
export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH"
node --test test/                         # every gate (concept-coverage, i18n, ...)
node tools/generate.mjs && node tools/validate.mjs
python3 -m http.server 8093 &             # headless-render the key pages, 0 undefined
```

For runnable content, compile the extracted programs through real dotnet. Confirm
the code-lab submodule pointer is intact and the vendored bundle carries the
expected symbols.

## Phase 4 - The "nothing-lost" audit

List every commit the absorbed (public) line has that the trunk lacks, and confirm
each feature is present in the integrated tree:

```
git log --oneline <merge-base>..origin/master           # the commits being absorbed
git diff --stat <merge-base> origin/master              # the files they touched
```

For each changed file: is it ABSENT (migrated/decommissioned - feature re-ported
elsewhere?) or IN-TREE (edit present?). Anything not forward-ported is acceptable
ONLY because the `-s ours` merge keeps it reachable in history - record each such
item as a follow-up todo, do not lose track of it.

## Phase 5 - Land it (non-destructive, no -f)

Order matters. Submodule first, superproject second.

1. **Push the submodule commit to ITS remote first.** If the gitlink points at an
   unpushed submodule commit, CI's `--recurse-submodules` checkout dangles and the
   build fails. Verify it resolves: `git ls-remote <submodule-remote> | grep <sha>`.
2. **Fast-forward local trunk** to the integrated commits (no merge node yet).
3. **Fold the public line in as a parent:**

```
git merge -s ours origin/master            # keeps OUR tree 100%, records origin/master as parent 2
git diff --quiet <integrated-commit> HEAD  # MUST be silent: tree byte-identical
git merge-base --is-ancestor origin/master HEAD   # origin/master now an ancestor -> push will FF
```

4. **Plain push (fast-forward):**

```
git push <https-or-token-url> master:master   # NO -f
```

Push identity note: if SSH maps to the wrong account, push over an HTTPS URL with an
inline access token for the right account. A token-in-URL push does NOT update local
`origin/*` refs (fetch uses SSH), so verify the remote with
`git ls-remote https://github.com/<o>/<r>.git refs/heads/master`, not
`git rev-parse origin/master`.

Common Phase-5 rejections (neither is force/identity):
- "refusing to allow an OAuth App to ... workflow ... without `workflow` scope" -
  your commit edits `.github/workflows/*` and the token lacks the scope. Fix:
  `gh auth refresh -h github.com -s workflow`, then push with that token.

## Phase 6 - Deploy gate, then clean up

The push triggers the Pages deploy. It is not done until that is green.

- **Rehearse the CI drift gate locally BEFORE pushing** (it is the usual failure):
  `node tools/generate.mjs && git diff --exit-code generated/ content/`. If it
  fails, you edited a GENERATED file - move the edit to its source (`meta.js`
  `intro[]` / res `*.json`) and regenerate.
- Watch it: `gh run watch $(gh run list --limit 1 --json databaseId -q '.[0].databaseId') --exit-status`.
- Smoke-test the live site returns 200.
- Add a `docs/work-log.md` start/end entry with real `date` timestamps.
- Delete the "filthy" integration branch once contained
  (`git merge-base --is-ancestor <branch> master`). `git worktree remove` REFUSES a
  worktree holding a submodule (even `--force`) - fall back to
  `rm -rf <worktree> && git worktree prune`, then `git branch -d`. Keep the
  timestamped backup branch until the deploy is confirmed good.

## Anti-patterns (each one bit, once)

- Reaching for `git push -f` on a refused push to a deployed branch. It was
  divergence; a `-s ours` land was correct and lossless.
- `git merge`-ing the two big trees directly instead of porting features onto a
  chosen trunk. You lose the ability to verify per-feature.
- Editing a generated `content/.../index.html` for a prose/pedagogy change. The
  generator overwrites it and the deploy dies on drift. Edit the source.
- Bumping the submodule gitlink before pushing the submodule commit. Dangling
  pointer, broken CI.
- Trusting `git rev-parse origin/master` after a token-in-URL HTTPS push. Use
  `git ls-remote`.
- Calling it done at "push succeeded". Done is a green deploy + 200 from the live
  site.
