# Git track - content plan (syllabus + concept graph)
Status: proposed - awaiting owner sign-off  -  Design: [docs/architecture/git-track.md](../architecture/git-track.md)  -  Build: [docs/plans/git-track.md](./git-track.md)

## Goal
The elementary git track: 14 lessons in 4 parts for someone who has never used git or a
command line. Only the v1 command set; two archetypes - `viz` (the mental model, localized)
and `git` (terminal + live graph, English). Track id `git`, name `Git`, concept prefix `gt-`.

## 1. Track shape

| # | Lesson id | Type | Title | Goal (one line) | Commands introduced |
|---|---|---|---|---|---|
| **Part 1** | `first-steps` | | **First steps** | | |
| 1 | `git-first-commit` | git | Your first commit | Save your first snapshot and see it appear on the graph. | `init`, `add`, `commit -m` |
| 2 | `git-a-history-of-snapshots` | viz | A history of snapshots | Watch commits chain into a history, each pointing back at the one before. | - |
| 3 | `git-where-am-i` | git | Where am I? | Read your own repository before changing it. | `status`, `log`, `log --oneline` |
| **Part 2** | `branches` | | **Branches** | | |
| 4 | `git-what-a-branch-is` | viz | What a branch really is | See that a branch is a name that moves, and `HEAD` says which one you are on. | - |
| 5 | `git-make-a-branch` | git | Make a branch and work on it | Split off a line of work and commit on it without touching `main`. | `branch`, `switch`, `switch -c` |
| 6 | `git-mark-a-version` | git | Mark a version with a tag | Pin a name to one commit so you can find it again. | `tag` |
| **Part 3** | `bringing-work-back` | | **Bringing work back** | | |
| 7 | `git-how-merging-works` | viz | How merging works | Tell a fast-forward from a merge commit with two parents. | - |
| 8 | `git-merge-a-branch` | git | Merge a branch back | Bring a branch's commits into `main`, both ways. | `merge` |
| 9 | `git-when-changes-collide` | viz | When two changes collide | See why git stops when both sides touched the same file. | - |
| 10 | `git-settle-a-conflict` | git | Settle a conflict | Finish a stopped merge - or call it off. | `merge` (conflict), `add` (mark resolved), `merge --abort` |
| **Part 4** | `fixing-mistakes` | | **Fixing mistakes** | | |
| 11 | `git-fix-the-last-commit` | git | Fix the last commit | Correct the commit you just made instead of piling an "oops" on top. | `commit --amend` |
| 12 | `git-point-at-a-commit` | git | Point at any commit | Name a commit without its hash, and stand on one directly. | `rev-parse`, `rev-list`, `HEAD~n`, `^`, `checkout <rev>` |
| 13 | `git-what-reset-moves` | viz | What reset actually moves | See what `--soft`, `--mixed` and `--hard` each leave behind. | - |
| 14 | `git-undo-with-reset` | git | Undo with reset | Move your branch back and choose what happens to your files. | `reset --soft/--mixed/--hard` |

## 2. Progression rationale

- **Doing comes first, once.** Lesson 1 is practical with no viz before it: a first
  commit needs no model, and it puts the three zones on screen for lesson 2 to explain.
- **Viz before keyboard for every invisible idea.** A branch, a merge, a conflict and a
  reset are pointer behaviour with no surface, so each gets a narrated visual immediately
  before the practical that types it: **4 before 5, 7 before 8, 9 before 10, 13 before 14**.
- **Difficulty steps up three times:** at 5 (two lines, `HEAD` starts to matter), at 10
  (git stops mid-command and the learner must recover), and at 12 (naming a commit by
  relation) - which is why 12 precedes the reset pair; `reset HEAD~1` is unreadable without it.
- **Cards carry the difficulty, not lessons.** Superseded on depth: see the audit - the
  built cards average 2 commands and none demands a decision.

## 3. Concept graph (introduce-once)

| id | Term | def | Introduced by |
|---|---|---|---|
| `gt-repository` | Repository | The folder git is watching, together with every snapshot you have saved in it. | 1 |
| `gt-working-tree` | Working tree | Your files as they are right now, before you have told git about them. | 1 |
| `gt-staging-area` | Staging area | The short list of files you have picked for the next commit, so you choose what goes in instead of saving everything. | 1 |
| `gt-commit` | Commit | A saved snapshot of the files you picked, with a short message saying what the change was. | 1 |
| `gt-parent` | Parent | The commit that came just before this one - the link that turns loose snapshots into a history. | 2 |
| `gt-history` | History | The chain of commits behind where you stand now, each pointing back at its parent. | 2 |
| `gt-hash` | Hash | The short code git gives a commit as its name, so you can point at that exact snapshot. | 3 |
| `gt-branch` | Branch | A name that points at a commit and moves forward with you as you commit, so two lines of work can grow side by side. | 4 |
| `gt-head` | HEAD | The marker for where you are - the branch you are on, and the commit your next one will build on. | 4 |
| `gt-tag` | Tag | A name pinned to one commit that never moves, for marking a version worth finding again. | 6 |
| `gt-merge` | Merge | Bringing another branch's commits into the one you are on, so two lines become one. | 7 |
| `gt-fast-forward` | Fast-forward | When your branch has added nothing since the split, git just slides its name forward and makes no new commit. | 7 |
| `gt-merge-commit` | Merge commit | The commit a merge makes when both sides moved on - the one commit with two parents. | 7 |
| `gt-conflict` | Conflict | When both branches changed the same file, git stops and asks you to decide which result is right. | 9 |
| `gt-abort` | Aborting a merge | Calling a stopped merge off and going back to how things were before you started it. | 10 |
| `gt-amend` | Amending | Replacing the commit you just made with a corrected one, rather than leaving the mistake in the history. | 11 |
| `gt-revision` | Revision | A way to name a commit without its hash - `HEAD`, a branch name, or a step back from one like `HEAD~1`. | 12 |
| `gt-detached-head` | Detached HEAD | Standing on a commit directly instead of on a branch, so a commit made there has no branch name holding on to it. | 12 |
| `gt-reset` | Reset | Moving your branch's name to another commit, with a choice of what happens to the files you had staged or edited. | 13 |

Revisits: 2 -> `gt-commit`; 4 -> `gt-history`; 5 -> `gt-branch`,`gt-head`; 8 -> `gt-merge`,
`gt-fast-forward`,`gt-merge-commit`; 10 -> `gt-conflict`; 12 -> `gt-hash`; 14 -> `gt-reset`,
`gt-staging-area`,`gt-working-tree`.

## 4. Practical exercise sketches

Superseded - the lessons are built. What each card should BECOME is in
`docs/audit/git/` and `docs/plans/git-track-rebuild.md`.

## 5. What this track does NOT teach

`rebase` (and `-i` / `--onto`), `cherry-pick`, `stash`, `reflog`, and everything over the
network - `clone`, `fetch`, `push`, `pull`, remote-tracking branches, pull requests. Absent
by design too: file CONTENTS (so no `diff`, no `show`, no editing a conflict marker),
`.gitignore`, `restore` and `revert`. The seam for the next ("real git") track is clean: it
starts at remotes and rewriting history, on the same graph widget.

## 6. Open questions

Most are now decided - see the journal (`git-track-depth` D-1..11) and
`docs/plans/git-track-rebuild.md`. Resolved: untracked files DO exist (seeded per
card); the `gt-` prefix stands; `--abort` is paired with a tag because it leaves no
trace to grade; no literal hashes anywhere.

Still open:

1. **Overlap with theory-20 "How code is shared"**, which owns `th-commit`,
   `th-history`, `th-merge`. Ids are track-scoped so both are legal and the angles
   differ (theory = why it exists, git = what it does). Keep both, or cross-link?
2. **Message-exact grading.** Every card must state the exact commit message, because
   DAG equivalence matches on parent shape AND message. Relax per lesson?
3. **Ledger.** `docs/concept-ledger.md` still has no Git section.
