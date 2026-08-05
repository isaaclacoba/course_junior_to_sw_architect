# Git track rebuild - brief

Owner-ratified. Evidence: [audit](../audit/git/README.md) (14 reports, both
auditors NO-GO). Design: [git-track-depth.md](./git-track-depth.md). Decisions:
journal `git-track-depth` D-1..11.

## Goal

The 14 lessons ship and pass every gate, but no card asks the learner to decide
anything, the five theory lessons narrate the graph their practical already shows,
and two lessons state falsehoods. Fix all three without growing past 16 lessons.

## What the audit changed in the plan

- **Theory is redundant in EXECUTION, not structure.** Each theory lesson already
  owns concepts its practical does not. The fix is not a panel - it is giving each
  lesson the ONE question only it can answer.
- **Lesson 1 already owns `gt-working-tree` and `gt-staging-area`.** A three-areas
  lesson must TAKE them and lesson 1 drop to `revisits`, or `validate.mjs` fails.
- **Step count is not content.** 5-6 steps per theory lesson, judged padding.
  Deepen with ideas, not slides.

## Plan

- [ ] **P0** Correct the false sentence in `git-undo-with-reset` - `--hard` is
      recoverable via `reflog`. Three files, no engine.
- [ ] **P1** Every practical card becomes 3-6 commands with a read that changes
      what comes next. Per-card specs in the design doc.
- [ ] **P2** Model gains file text: `Commit.blobs`, text in `index`/`worktree`,
      LCS alignment, 3-way merge, `diff3` markers. **`paths` stays derivable** -
      3 call sites, and that is a hard exit criterion.
- [ ] **P3** File-text panel; Monaco as the conflict editor; `git diff` as a
      habit, not a lesson.
- [ ] **P4** Rebuild the five theory lessons to their owned question.
- [ ] **P5** Two new lessons: the three areas, and `reflog` **before** the reset
      pair. `reflog` needs no file text, so it is not gated on P2.
- [ ] **P6** `rebase -i` on Monaco. Last.

Each phase ships on its own and leaves the track green. P0 and P1 need no engine
work.

## Progress

- 2026-08-05 14 lessons built and verifying; audit run, both auditors NO-GO
- 2026-08-05 Design ratified (D-1..9); reflog moved before the reset pair (D-10);
  `--hard` sentence corrected rather than the command pulled (D-11)
- 2026-08-05 Docs cut to the 100-line rule after the owner caught them at 140/147

## Open

- Does `history-of-snapshots` survive P4? It keeps its slot only if it can answer
  "does a commit store a change or a whole snapshot?". If not, merge into lesson 1
  and the track is 15. Recommend deciding at P4, not now.
