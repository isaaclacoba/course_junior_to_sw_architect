# Git track audit - findings and actionable steps

14 per-lesson reports in this directory, written against `docs/audit/TEMPLATE.md`
by two independent read-only audits. This index is the actionable summary.

Verdict from both auditors: **NO-GO for production as-is.** Not because the track
is broken - every lesson passes `verify-lesson` - but because two lessons state
things that are not true, and no card in the track asks the learner to make a
decision.

## The three headline findings

**1. Not one card in the track requires a decision.** Measured across ~20 cards:
median 2 commands, mode 1-2, and every `context` tells the learner exactly what to
type. `git-mark-a-version` and `git-merge-a-branch` are 1 command each. The only
card that comes close is `git-where-am-i` card 1, which makes the learner read
`git status` before choosing what to stage.

**2. Theory adds nothing, on all five theory lessons.** `git-a-history-of-snapshots`
restates lesson 1's "commits chain" across 5 steps. `git-what-a-branch-is` and
`git-how-merging-works` preview the graph the next practical displays. The conflict
and reset pairs show *identical* content to their practicals - the only difference
is who types the commands.

**3. Two lessons state falsehoods.**
- `git-undo-with-reset` `task.3.context` says `--hard` "can lose work you cannot
  get back". **`git reflog` gets it back.** The track teaches four destructive
  operations - `--amend`, detached-HEAD commits, `reset --hard` - and teaches
  recovery for none of them.
- The conflict pair teaches the *ceremony* (`git add`, `git commit`) and calls it
  resolution. A learner never sees the file, the markers, or an edit.

## Fix now - data only, no engine change

| Lesson | Today | Becomes |
|---|---|---|
| `git-undo-with-reset` | `task.3.context` claims work is unrecoverable | **Correct the sentence.** Either say `reflog` can recover it, or stop claiming permanence. This is a factual error and should not wait for a phase. |
| `git-mark-a-version` | 2 cards, **1 command each**, nothing to read | Start from 4 commits; the learner reads `git log --oneline` to find WHICH commit gets `v1`, then tags an earlier one by revision. 1 command -> 3 with a decision. |
| `git-merge-a-branch` | 2 cards, **1 command each** | Give `main` two candidate branches; the learner reads `git log` to find which one is behind and merges that. |
| `git-first-commit` | cards 1 and 3 have no decision | Prepend a `git status` read; card 3 chooses which of three files belong in one commit. |
| `git-make-a-branch` | card 1 is `git branch feature`, no decision | Branch at an OLDER commit, found by reading the log. |
| `git-point-at-a-commit` | goal states `HEAD~1` outright | State the goal verbally ("the commit before the tip") and make the learner derive the revision from `git log`. |
| `git-undo-with-reset` | each card names the mode to type | State the OUTCOME wanted ("keep `draft.txt` staged") and make the learner choose `--soft` / `--mixed` / `--hard`. |
| `git-fix-the-last-commit` | card 1 names the typo | Give two typos; the learner reads `git log` to find which one is actually the last commit. |

## Needs model phase 1 - file contents

These are MODEL limits, not authoring misses. `Commit` is
`{ id, parents, message, paths }`; the source says "no file contents". So:

| Lesson | Blocked on | What it becomes |
|---|---|---|
| `git-when-changes-collide` | contents | Shows the two versions of `cat.txt` as TEXT, the markers git writes, and why neither side wins. Today it can only assert that a conflict happened. |
| `git-settle-a-conflict` | contents + Monaco | The learner edits the conflicted file, removes the markers, then finishes the merge. Today they type the ceremony without ever resolving anything. |
| `git-what-reset-moves` | contents | `--soft`/`--mixed`/`--hard` shown as one file's text moving between the three areas, instead of chips appearing and disappearing. |
| `git-a-history-of-snapshots` | contents | A commit as a SNAPSHOT of text, which is the only way "snapshot" stops being a word. |
| `git-what-a-branch-is` | contents | What each branch actually holds, so "a branch is a name" has something concrete behind it. |

## Needs a new lesson

- **The three areas** (Part 1, theory). Staging is explained in ONE sentence in the
  whole track - "Staging is where you choose" - and the working tree never. Both
  are then used for 13 lessons. This is the largest single gap.
- **`reflog`** (Part 4). Recovery for the four destructive operations above.
  Ratified as mandatory.

## Order

The end-to-end plan lives in
[docs/plans/git-track-rebuild.md](../../plans/git-track-rebuild.md) - seven phases,
each shippable on its own, with a definition of done and a verification step.
Phases 0 and 1 need no engine work and fix what a learner would notice today.

## What the audit did NOT check

Read-only content audit. No compile, no browser render, no grading run - every
lesson does pass `node tools/verify-lesson.mjs` as of this audit, so these are
content and pedagogy findings only.
