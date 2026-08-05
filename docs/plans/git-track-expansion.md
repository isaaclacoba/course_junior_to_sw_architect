# Git track expansion - what is missing, and what it costs

Scope beyond the 14 built lessons. Costs verified against
`code-lab/src/core/git-model.ts`. Companion to
[git-track-depth.md](./git-track-depth.md), which covers making the EXISTING
lessons good; this covers what the track does not teach at all.

## Cost, verified

`RepoState = { commits, refs, head, index, worktree, merge?, seq }`;
`Commit = { id, parents, message, paths[] }` - **no contents**.

| Concept | Cost | What it needs |
|---|---|---|
| `.gitignore` | **LOW** | `ignored: Set<string>`; filter `addFiles`/`stage` (~10 lines) |
| `restore` | **LOW** | New op, inverse of `add` for the worktree (~20 lines) |
| `revert` | **LOW** | New commit inverting a target's paths (~15 lines) |
| `reflog` | **MEDIUM** | `reflog[]` + instrument the **8 ops that move a ref** |
| `stash` | **MEDIUM** | A stash stack + push/pop/list/drop (~40 lines) |
| `cherry-pick` | **MEDIUM** | Copy one commit onto HEAD (~20 lines) |
| `rebase` | **HIGH** (corrected from MEDIUM) | Replay + re-parent. `-i` needs a todo-list UI - that is what makes it HIGH |
| remotes: `push`/`pull`/`clone`/`fetch` | **HIGH** | `remote` state, `refs/remotes/*`, two-pane graph, dual-state grading |
| `diff` / `show` | **BLOCKED** | Needs file contents - see git-track-depth.md P2 |

The only corrected estimate is `rebase`: the junior use case is `-i`, and that is
a new widget, not a model change.

## Shape

| Concept | Shape |
|---|---|
| `.gitignore` | Extra card on first-commit - it changes `add` behaviour, no new command |
| `restore` | Extra card on where-am-i, or paired with `reset` in Part 4 |
| `revert` | New Part 4 lesson - the SAFE undo, versus `reset --hard` |
| `reflog` | **Paired with the reset lessons.** Ratified: destruction is never taught without recovery |
| `stash` | New lesson - WIP management, not mistake-fixing |
| `cherry-pick` | Same part as `rebase`; teach rebase first |
| remotes | New Part 5, 3-5 lessons: what a remote is, what push/pull move, then clone/push/pull |
| `rebase` | New Part 6, after remotes - "rebase before you push" is meaningless without push |

## Sequence

1. **Cheap wins, no blockers:** `.gitignore`, `restore`, `reflog`. All ship on the
   existing engine.
2. **Decide the seam** (open question 1). Everything after depends on it.
3. **If local-only:** `revert`, then `stash`. Track is then complete for solo work.
4. **If collaboration:** Part 5 remotes - the largest single piece.
5. **`rebase`/`cherry-pick` last**, and only after remotes.

## Stays out

`diff`/`show` and editing real conflict markers are blocked on file contents
(addressed separately in git-track-depth.md). `git config`, commit-message
conventions, forks and pull requests are platform or habit topics, not git
mechanics. `rebase --onto` is expert-only.

Detached-HEAD recovery and tags are already taught (lessons 12 and 6).

## Open questions

1. **The seam: local-only, or collaboration-complete?**
   **[REC]** Local-only. Remotes are big enough to be their own track, and the
   current arc is coherent as "solo mastery". The alternative adds Part 5 at HIGH
   cost and grows the track to ~20 lessons.
2. **Does `revert` need its own theory viz?**
   **[REC]** Yes - "what revert creates" is invisible otherwise, and it is the
   contrast that makes `reset` safe to teach.
3. **Does `stash` belong in this track at all?**
   **[REC]** Yes, but last of the local set - it is the one command a junior hits
   accidentally when told to "just switch branches".
