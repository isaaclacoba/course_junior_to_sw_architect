# Merge a branch back (`git-merge-a-branch`)

- **Track / Part:** Git - Part 3 Bringing work back
- **Engine / format:** git (terminal + live graph)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 2
- **Runnable:** yes (state-based grading via git runtime)  **Theme:** neutral (cat/dog/feeder)

## Concept(s) taught
The lesson revisits `gt-merge`, `gt-fast-forward`, and `gt-merge-commit` - the two outcomes of `git merge` decided by whether `main` moved since the split.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Bring it back when `main` stayed put | git merge | Type `git merge fix` - `main` has not moved, so git fast-forwards. |
| 2 | Bring it back when both sides moved | git merge (two parents) | Type `git merge fix` again - `main` now has its own commit, so a merge commit appears. |

Grading is state-based: card 1 ends with both names on one commit and no new commit; card 2 ends with a two-parent merge commit.

## Prerequisites
Assumes branches and splitting (lesson 5 `git-make-a-branch`), and the merge theory from lesson 7 `git-how-merging-works`.

## Complexity rung
A gentle step: the prior viz lesson explained the two merge outcomes, so this is the keyboard version with no new idea.

## Covered well
- The deliberate comparison: identical command, two different start states, two different results - the point prose cannot make alone.
- Clean one-idea-per-card climb.

## Gaps / issues

**CONTENT DEFECTS (fixable by editing data):**

1. **Card 1 solution is 1 command.** `solution: ["git merge fix"]`. No decision is required - the learner never reads the repo state. **Fix:** Add a decision by giving `main` two candidate branches (`fix` and `feature`), requiring the learner to run `git log --oneline fix` and `git log --oneline feature` to find which one is actually ahead of `main`.

2. **Card 2 solution is 1 command.** `solution: ["git merge fix"]`. Again, a straight sequence with no choice. **Fix:** Same as card 1 - require reading state first to pick the right branch.

3. **No habit of checking first.** Neither card requires `git status` or `git log` before acting. The context says "You made `fix`" (card 1) and "after switching back you also committed" (card 2), handing the learner the decision rather than making them read it. **Fix:** Rewrite the context to "You made two branches, `fix` and `feature`. Only one is ahead of `main`; find which and merge it" for card 1. For card 2, say "Both branches have commits. Merge the one that adds the feeder" and require `git log` to find which branch that is.

4. **Grading permits no verification.** `goal` prose says "`main` stayed put, so no new commit appears" (card 1), but nothing in the graded target enforces reading - a hardcoded `git merge fix` passes without ever running `git log`. **Fix:** Pair each merge with a pre-check command that must appear in the solution: `git log --oneline fix` or `git status`.

5. **The `git status` command in goals is advisory prose, not graded.** Card 2 `goal` says "Run `git status` after" but `solution` does not include it, so the learner can skip it. **Fix:** Include `git status` or `git log --oneline` in `solution` so it is graded.

**MODEL LIMITS (needs engine work, not data):**

None - the git model handles branches, merges, fast-forwards and merge commits. The thinness is a content choice.

## Verification status
Read-only content audit only. No compile step (git lessons).
