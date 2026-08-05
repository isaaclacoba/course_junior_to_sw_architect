# Undo with reset (`git-undo-with-reset`)

- **Track / Part:** Git - Part 4 Fixing mistakes
- **Engine / format:** git (terminal + live graph)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 3
- **Runnable:** yes (state-based grading)  **Theme:** neutral (cat/dog/draft)

## Concept(s) taught
Revisits `gt-reset`, `gt-staging-area`, `gt-working-tree`.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Undo the commit, keep the files staged | git reset --soft | Type `git reset --soft HEAD~1`, `git status` - 2 commands. |
| 2 | Put the file back in the folder instead | git reset --mixed | Type `git reset --mixed HEAD~1`, `git status` - 2 commands. |
| 3 | Drop the commit and its file | git reset --hard | Type `git reset --hard HEAD~1`, `git status` - 2 commands. |

All three cards start from the same three commits (`add cat`, `add dog`, `oops` with `draft.txt`). Grading is three-area state-based - the commit graph is identical in all three; the only difference is which zone holds `draft.txt`.

## Prerequisites
Assumes the reset theory from lesson 13 `git-what-reset-moves`, and `HEAD~n` notation from lesson 12.

## Complexity rung
A gentle step: the prior viz explained what each mode does; this is the keyboard version with no new idea.

## Covered well
- The deliberate repetition: all three cards start from the same state and ask for the same step back (`HEAD~1`), so the ONLY thing that changes is the mode - clean isolation.
- The grading subtlety: three-area grading distinguishes the modes by where `draft.txt` lands, not by the commit graph (which is identical).

## Gaps / issues

**CONTENT DEFECTS (fixable by editing data):**

1. **All three cards are 2-command straight sequences with no decision.** Card 1: `solution: ["git reset --soft HEAD~1", "git status"]`. Card 2: same with `--mixed`. Card 3: same with `--hard`. Every card TELLS the learner which mode to use in the title and context. No reading, no choice. **Fix:** Give the learner a GOAL ("The last commit was a mistake, but you want to keep `draft.txt` staged for the next commit") and require them to READ the reset theory or the man page to choose the RIGHT mode (`--soft`). Card 2: "You want `draft.txt` back in the folder, not staged" -> learner chooses `--mixed`. Card 3: "You want `draft.txt` gone" -> learner chooses `--hard`.

2. **The `git status` command is verification, not a decision.** All three cards include `git status` in the solution, which is GOOD (models the habit of checking the result), but it is not a READ-BEFORE-ACTING check. **Fix:** Add a pre-reset `git log --oneline` to every card so the learner sees the three commits before choosing to drop one.

3. **No warning about the irreversibility of `--hard` in the practical.** The viz (lesson 13) warns "this is the one to read twice before you run it" (step 4), but this practical lesson does not repeat the warning. Card 3 `context` says "It is the only one of the three that can lose work you cannot get back, so read it twice before you run it" - GOOD. But the `goal` prose does not emphasize the danger. **Fix:** Strengthen the `goal` prose: "WARNING: `--hard` destroys work. Run `git log --oneline` first to confirm you are dropping the right commit."

4. **No `reflog` to recover from `--hard`.** Card 3 teaches a DESTRUCTIVE command (`git reset --hard HEAD~1`) with NO recovery path. The context says "work you cannot get back" but that is FALSE - `git reflog` CAN get it back. **GAP:** Same reflog gap as lessons 11 and 12. The lesson LIES to the learner by saying `--hard` is permanent. **Requires git-track-depth.md phase 7.** Until reflog is taught, either (a) do not teach `--hard` at all, or (b) change the prose to "work you cannot easily get back without learning `reflog`."

5. **Theory and practice show identical content.** The owner's complaint: "Why do we need the same twice?" Lesson 13 (theory) shows: (1) three commits, (2) reset with `--soft`/`--mixed`/`--hard`, (3) files land in staging/worktree/nowhere. Lesson 14 (practice) shows: (1) three commits, (2) reset with `--soft`/`--mixed`/`--hard`, (3) files land in staging/worktree/nowhere. The theory adds NOTHING the practical does not already show - the only difference is who types the commands. **Fix (after model has file text):** After git-track-depth.md phase 1, rewrite the theory to show FILE TEXT moving between zones (see lesson 13 gaps), so theory teaches the MODEL and practice teaches the TOOL.

**MODEL LIMITS (needs engine work):**

None for reset itself - the git model handles `--soft`/`--mixed`/`--hard` (git-model.ts lines 473-512). The reflog gap is a curriculum gap, not a model limit.

## Verification status
Read-only content audit only. No compile step (git lessons).
