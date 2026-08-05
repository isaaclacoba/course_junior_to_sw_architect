# Point at any commit (`git-point-at-a-commit`)

- **Track / Part:** Git - Part 4 Fixing mistakes
- **Engine / format:** git (terminal + live graph)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 2
- **Runnable:** yes (state-based grading)  **Theme:** neutral (cat/dog/bird/fish)

## Concept(s) taught
Introduces `gt-revision` (naming a commit with `HEAD~n` / `main~2`) and `gt-detached-head` (standing on a commit rather than a branch).

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Put a branch on an older commit | main~2 | Type `git rev-parse main~2`, `git branch old main~2` - 2 commands. |
| 2 | Stand on a commit, not a branch | git checkout HEAD~1 | Type `git checkout HEAD~1`, `git status` - 2 commands. |

Both cards start from the same four-commit history. Grading is state-based.

## Prerequisites
Assumes branches (lesson 5), commits (lesson 1), and `git log` (lesson 3).

## Complexity rung
A small step: the prior lesson (`git-fix-the-last-commit`) operated on `HEAD` only; this adds the `~n` suffix to reach further back.

## Covered well
- The deliberate repetition: both cards start from identical state, so the ONLY thing that changes is what the learner does.
- Card 1 pairs `rev-parse` with `branch`, modeling the habit of checking before acting.

## Gaps / issues

**CONTENT DEFECTS (fixable by editing data):**

1. **Card 1 solution is 2 commands, but no decision.** `solution: ["git rev-parse main~2", "git branch old main~2"]`. The context TELLS the learner to use `main~2` and TELLS the learner where the branch should land ("on `add dog`"). No reading, no choice. **Fix:** Give the learner a verbal goal ("Put a branch called `old` on the commit two before the tip of `main`") and require them to derive `main~2` themselves by counting commits in `git log --oneline`.

2. **Card 2 solution is 2 commands, but no decision.** `solution: ["git checkout HEAD~1", "git status"]`. The context TELLS the learner to type `HEAD~1`. **Fix:** Give the learner a goal like "Stand on the commit where `bird.txt` was added" and require them to read `git log --oneline` to find that commit is `HEAD~1` (counting back from `add fish`).

3. **The `git rev-parse` and `git status` commands are verification, not decisions.** Card 1 includes `git rev-parse main~2` in the solution, and card 2 includes `git status`. Both are GOOD habits - checking before acting, confirming the result - but neither is a DECISION the learner makes based on state they read. **Fix:** Reframe the cards so the learner must READ state FIRST to choose which `~n` to use, THEN use `rev-parse` or `status` to confirm.

4. **No explanation of the danger of detached HEAD.** Card 2 `context` says "a commit made here would have no branch name holding on to it" but does not teach (a) how to GET BACK to a branch, or (b) what happens to a commit made in detached HEAD state. **GAP:** The learner is taught to enter detached HEAD but not taught to exit it safely. **Fix:** Add a card 3: "Return to `main` with `git switch main`" so the learner knows the escape route.

5. **No `reflog` to find a lost commit.** If a learner makes a commit in detached HEAD and then checks out a branch, that commit is left dangling with no name. The lesson does not teach `git reflog` to find it again. **GAP:** Same reflog gap as lesson 11. **Requires git-track-depth.md phase 7.**

**MODEL LIMITS (needs engine work):**

None - the git model handles `rev-parse`, `~n` suffixes, and detached HEAD (git-model.ts lines 562-590).

## Verification status
Read-only content audit only. No compile step (git lessons).
