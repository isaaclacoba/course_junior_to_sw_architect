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

- **Doing comes first, once.** Lesson 1 is practical with no viz before it on purpose: a
  first commit needs no model - you pick files, you save them, the graph draws a dot. The
  three zones are on screen while they do it, so lesson 2 has something to explain.
- **Viz before keyboard for every idea that is invisible.** A branch, a merge, a conflict
  and a reset are all pointer behaviour with no obvious surface, so each gets a narrated
  visual immediately before the practical that types it: **4 before 5**, **7 before 8**,
  **9 before 10**, **13 before 14**. Lesson 2 is the exception - it consolidates lesson 1.
- **What each may assume.** 3 assumes a repository with commits (1). 5 assumes graph reading
  (2) and `HEAD` (4). 6 needs a branch to contrast a tag against. 8 assumes two lines of work
  (5). 10 assumes a merge that worked (8), so failing is the only new thing. 11-14 assume the
  whole shape and only move labels.
- **Difficulty steps up three times.** At **5** (two lines of history, and `HEAD` starts to
  matter), at **10** (git stops mid-command and the learner must get the repository out of
  that state), and at **12** (a commit named by relation, not by pointing) - which is why 12
  sits before the reset pair: `reset HEAD~1` is unreadable without it.
- **Cards carry the difficulty, not lessons.** Each practical lesson is 2-3 cards, each with
  its own start state and one small win, per the ratified UX.

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

Shorthand for this doc only (lesson files spell every command out): `A f` = `git add f`,
`C "m"` = `git commit -m "m"`. Every start is replayed from an empty repository, and **every
card must end in a state change** - grading is DAG-only, so a card whose only action is
`status` or `log` cannot pass.

| Lesson | Card | Start | Goal in plain words | Target = start + |
|---|---|---|---|---|
| 1 | 1 | (empty) | Save `cat.txt` as the first commit, message `add cat`. | `A cat.txt; C "add cat"` |
| 1 | 2 | `A cat.txt; C "add cat"` | Save `dog.txt` on top as `add dog`. | `A dog.txt; C "add dog"` |
| 1 | 3 | `A cat.txt; C "add cat"` | Put `dog.txt` and `bird.txt` in ONE commit, `add two pets`. | `A dog.txt; A bird.txt; C "add two pets"` |
| 3 | 1 | `A cat.txt; C "add cat"` | Check `git status` first, then commit only `dog.txt` as `add dog`. | `A dog.txt; C "add dog"` |
| 3 | 2 | 3 commits | Read `git log --oneline`, then commit `fix the feeder` on top. | `A feeder.txt; C "fix the feeder"` |
| 5 | 1 | `A cat.txt; C "add cat"` | Make a branch called `feature` - do not move onto it yet. | `git branch feature` |
| 5 | 2 | 2 commits on `main` | Start `feature`, move onto it, and commit `add dog` there - `main` stays put. | `git switch -c feature; A dog.txt; C "add dog"` |
| 6 | 1 | 3 commits on `main` | Pin the tag `v1` to the current commit. | `git tag v1` |
| 6 | 2 | 3 commits on `main` | Pin `v0` to the commit before last, without moving anything. | `git tag v0 HEAD~1` |
| 8 | 1 | `C "add cat"`; `git switch -c fix; A dog.txt; C "add dog"; S main` | Bring `fix` into `main`. `main` added nothing, so no new commit appears. | `git merge fix` |
| 8 | 2 | as above but `main` has its own `C "feed the cat"` | Bring `fix` in again - this time it takes a merge commit called `merge fix`. | `git merge fix; C "merge fix"` |
| 10 | 1 | both branches commit touching `cat.txt` | Merge `fix`, then tell git `cat.txt` is settled and finish with `merge fix`. | `git merge fix; A cat.txt; C "merge fix"` |
| 10 | 2 | same, mid-conflict already | Call this merge off, then tag the commit you are on `before-merge`. | `git merge --abort; git tag before-merge` |
| 11 | 1 | 2 commits, last one `add dgo` | Fix that typo in the last commit's message - no extra commit. | `git commit --amend -m "add dog"` |
| 12 | 1 | 4 commits on `main` | Make a branch `old` at the commit two back from the tip. | `git branch old main~2` |
| 12 | 2 | 4 commits on `main` | Step onto the previous commit directly, standing on no branch. | `git checkout HEAD~1` |
| 14 | 1 | 3 commits, last one `oops` | Drop the last commit and keep its files staged. | `git reset --soft HEAD~1` |
| 14 | 2 | same | Drop it and put its files back in the working tree, unstaged. | `git reset --mixed HEAD~1` |
| 14 | 3 | same | Drop it and its files entirely. | `git reset --hard HEAD~1` |

## 5. What this track does NOT teach

`rebase` (and `-i` / `--onto`), `cherry-pick`, `stash`, `reflog`, and everything over the
network - `clone`, `fetch`, `push`, `pull`, remote-tracking branches, pull requests. Absent
by design too: file CONTENTS (so no `diff`, no `show`, no editing a conflict marker),
`.gitignore`, `restore` and `revert`. The seam for the next ("real git") track is clean: it
starts at remotes and rewriting history, on the same graph widget.

## 6. Open questions for the owner

1. **Untracked files do not exist in the model.** A path appears only when the learner types
   `git add <path>`, so the working-tree zone stays empty until a `reset --mixed` fills it
   (lesson 14). The prose can honestly say "tell git to include `cat.txt`", but the
   beginner's real story ("I made a file, `status` shows it untracked, I add it") is not
   tellable, and `git add .` stages nothing. Accept, or seed a worktree in the model?
2. **Concept prefix `gt-`** - existing tracks use `pr-`/`th-`/`ai-`; `gi-` is the alternative.
3. **Overlap with theory-20 "How code is shared"**, which already introduces `th-commit`,
   `th-history`, `th-vcs-branch`, `th-merge`, `th-version-control`. Ids are track-scoped so
   this is legal and the defs differ in angle (theory = why it exists, git = what it does).
   Keep both, or have the git track revisit the theory ids?
4. **Message-exact grading.** DAG equivalence matches commits by parent shape AND message, so
   every card must state the exact message to type. Fine, or relax messages per lesson?
5. **No literal hashes anywhere** - lesson 12 teaches `HEAD~1`/`main~2`, never `checkout
   <hash>`, because the verifier replays solutions. Agreed?
6. **`--abort` cannot be graded strictly** (it leaves no trace), so card 10.2 pairs it with a
   tag. Accept, or demote `--abort` to prose only?
7. **14 lessons, 9 practical / 5 viz** - right size for elementary, or too long?
8. **Ledger.** `docs/concept-ledger.md` has no Git section; adding one is a follow-up in the
   first authoring change.
