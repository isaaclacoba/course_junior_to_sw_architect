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

Each step names the file it touches and what "done" looks like. P0 and P1 need no
engine work.

**P0 - stop saying something untrue**
- [x] 1. `git-undo-with-reset` `task.3.context`: `--hard` is recoverable via
      `reflog`. Edit `data.js` + `en.json` + `es.json`.
- [x] 2. Grep the track for any other "cannot get back" claim.

**P1 - every card demands a decision** (data only; done = 3-6 commands, one of
them a read that changes what comes next)
- [x] 3. `mark-a-version`: start at 4 commits; read `log`, tag the release, then
      tag an earlier commit by revision. 1 command -> 3.
- [x] 4. `merge-a-branch`: two candidate branches; read `log` to find which is
      behind, merge that one.
- [x] 5. `first-commit` cards 1+3: read `status` first; card 3 chooses which of
      three files belong together.
- [x] 6. `make-a-branch` card 1: branch at an OLDER commit, found in the log.
- [x] 7. `point-at-a-commit`: state the goal in words; the learner derives
      `HEAD~1` instead of being told it.
- [x] 8. `undo-with-reset`: state the OUTCOME wanted; the learner picks
      `--soft`/`--mixed`/`--hard`.
- [x] 9. `fix-the-last-commit`: two typos; read the log to find which is last.
- [x] 10. **Gate:** re-count commands and decisions per card, `verify-lesson` on
      all 14, EN/ES parity.

**P2 - the model gains file text**
- [x] 11. `Commit.blobs` + text in `index`/`worktree`. **`paths` stays derivable**
      (3 call sites: `state-match.js`, `git-progress.js`).
- [x] 12. LCS line alignment, unit-tested first.
- [x] 13. 3-way merge; a conflict is an OVERLAP. Test that a one-line insertion
      does NOT conflict - that is the bug naive line-indexing would ship.
- [x] 14. `diff3` marker writer, showing the ancestor.
- [x] 15. **Gate:** re-vendor; all 14 lessons verify unchanged.

**P3 - surfaces**
- [x] 16. File-text panel: one file shown in worktree / index / commit.
- [ ] 17. Monaco wired as the conflict-resolution editor.
- [x] 18. `git diff` as a command and as the read step in P1's cards. No lesson.

**P4 - theory**
- [x] 19. Rebuild the five theory lessons, each to the one question it owns
      (table in the design doc).

**P5 - the two missing lessons**
- [x] 20. Three-areas lesson; it TAKES `gt-working-tree` + `gt-staging-area` and
      lesson 1 drops to `revisits`.
- [x] 21. `reflog`: model support + lesson, placed BEFORE the reset pair. Not
      gated on P2.

**P6**
- [x] 22. `rebase` - model, command and lesson. `rebase -i` not done.

## Progress

- 2026-08-05 14 lessons built and verifying; audit run, both auditors NO-GO
- 2026-08-05 Design ratified (D-1..9); reflog moved before the reset pair (D-10);
  `--hard` sentence corrected rather than the command pulled (D-11)
- 2026-08-05 Docs cut to the 100-line rule after the owner caught them at 140/147
- 2026-08-06 P0+P1 landed (9434bf4): median commands/card 2 -> 3, no 1-command
  card left; `gt-revision` moved to lesson 5, its earliest genuine use
- 2026-08-06 P3-P6 landed: file panel (collapsing), `git diff`, `echo`, real
  conflicts, the three-areas lesson, five theory lessons rebuilt, `reflog`
  and `rebase` - model, commands and lessons. 17 git lessons.
- 2026-08-06 P2 landed (code-lab d603c3d, course 8a76d5b): commits carry a full
  snapshot, index/worktree carry text, merge is LCS + 3-way + diff3 markers.
  14 lessons verify unchanged; every card is now 3-5 commands

## Open

- Does `history-of-snapshots` survive P4? It keeps its slot only if it can answer
  "does a commit store a change or a whole snapshot?". If not, merge into lesson 1
  and the track is 15. Recommend deciding at P4, not now.
