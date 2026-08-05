# Fix the last commit (`git-fix-the-last-commit`)

- **Track / Part:** Git - Part 4 Fixing mistakes
- **Engine / format:** git (terminal + live graph)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 2
- **Runnable:** yes (state-based grading)  **Theme:** neutral (cat/dog/feeder/bowl)

## Concept(s) taught
Introduces `gt-amend` - replacing the last commit instead of stacking an `oops` on top.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Fix a message you got wrong | git commit --amend | Type `git commit --amend -m "add dog"`, `git log --oneline` - 2 commands. Fixes typo `add dgo`. |
| 2 | Fold in the file you left out | git add + --amend | Type `git add bowl.txt`, `git commit --amend -m "add the feeder and bowl"` - 2 commands. |

Grading is state-based. Card 2 deliberately changes the message as well as the file list because grading identifies commits by message + parent shape, so an amend keeping the same message would be indistinguishable from the original.

## Prerequisites
Assumes commits (lesson 1), staging (lesson 1), and `git log` (lesson 3).

## Complexity rung
A small step from prior lessons. Introduces one new command (`--amend`) in two variants (message-only, then message + files).

## Covered well
- Clean one-idea-per-card climb: card 1 is message-only, card 2 adds the staging step.
- The grading subtlety (card 2 must change the message) is explained in the code comment, so future editors do not break it.

## Gaps / issues

**CONTENT DEFECTS (fixable by editing data):**

1. **Card 1 solution is 2 commands, but no decision.** `solution: ["git commit --amend -m \"add dog\"", "git log --oneline"]`. The context TELLS the learner the typo is `add dgo`, and the goal TELLS the learner the fix is `add dog`. No reading, no choice. **Fix:** Give the learner TWO commits with typos (e.g. `add dgo` and `add cta`), require `git log --oneline` to find which one is LAST (only the last commit can be amended), and require the learner to fix only that one.

2. **Card 2 solution is 2 commands, but no decision.** `solution: ["git add bowl.txt", "git commit --amend -m \"add the feeder and bowl\""]`. The context TELLS the learner `bowl.txt` is the file to fold in. **Fix:** Give the learner TWO files in the working tree (`bowl.txt` and `trash.txt`), require `git status` to read what is sitting there, and require the learner to fold in only the RIGHT one (the one that belongs with the feeder).

3. **The `git log` command in card 1 is advisory.** The `goal` says "Check with `git log --oneline`" but the command is in the `solution` only for verification, not graded as part of the exercise. This is actually FINE - the learner should check, and the solution models that habit. **No fix needed.**

4. **No habit of verifying the amendment worked.** Both cards include `git log --oneline` in the solution, which is good, but the `goal` prose does not emphasize WHY - to confirm the history stayed the same length. **Fix:** Strengthen the `goal` prose: "Run `git log --oneline` after to confirm the history is still two commits long, not three."

5. **No explanation of what happens to the old commit.** The prose says "The old commit is left behind with nothing pointing at it" (card 1 context) but does not teach how to GET IT BACK if the amend was a mistake. **GAP:** No `reflog` is taught anywhere in the track (confirmed by the owner's complaint 4 and by git-track-depth.md decision 7: "reflog is mandatory"). **Requires git-track-depth.md phase 7.** Until then, the lesson teaches a DESTRUCTIVE operation with no recovery path.

**MODEL LIMITS (needs engine work):**

None for `--amend` itself - the git model handles it (line 283-295 in git-model.ts). The reflog gap is a curriculum gap, not a model limit.

## Verification status
Read-only content audit only. No compile step (git lessons).
