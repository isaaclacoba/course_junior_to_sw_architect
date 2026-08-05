# Make a branch and work on it (`content/git/02-branches/02-git-make-a-branch/`)

- **Track / Part:** Git - Part 2 Branches
- **Engine / format:** git (practice - terminal + live graph)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 2
- **Runnable:** yes (graded by DAG state-match)  **Theme:** animals (cat.txt, dog.txt, bird.txt)

## Concept(s) taught
How to make a branch and step onto it: `git branch <name>` makes the name without moving, `git switch -c <name>` makes and moves in one command. Committing on the new branch moves only that name, leaving `main` where it was.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Name a second line of work | `git branch` | Type `git branch feature` (stay on `main`), then `git branch` to list both - 2 commands, straight sequence. |
| 2 | Step onto it and commit there | `git switch -c` | Type `git switch -c feature`, `git add dog.txt`, `git commit -m "add dog"` while `main` stays at commit 2 - 3 commands, small decision (make-and-move vs make-only). |

## Prerequisites
Lesson 4 (`git-what-a-branch-is`) teaches the concepts `gt-branch` and `gt-head`. This lesson lets the learner type them. Also assumes lessons 1-3 (commits, staging, history).

## Complexity rung
A small step from lesson 4: the learner already watched branches and `HEAD` move in the viz; here they type the commands that move them. The new surface is the two-step sequence (make, then move) vs the one-step shortcut (`switch -c`).

## Covered well
- Card 1 teaches the two-step split: making a name does NOT move you. Running `git branch` at the end (to see the `*`) reinforces that you are still on `main`.
- Card 2 teaches the shortcut and the payoff: committing on `feature` moves only `feature`, so the graph forks.
- The `intro` explicitly states "Nothing is copied - a branch is only a name pointing at a commit," echoing lesson 4's main point.

## Gaps / issues

**Card 1 is a straight 2-command sequence with no decision.** The solution is `git branch feature`, `git branch` (list). There is nothing to read and nothing to choose - the learner types the two commands in order and passes. Per the owner's bar (3-6 commands with a DECISION), this is too thin.

**Card 2's "decision" is minimal.** The `context` says `git switch -c` "does both jobs at once: make the name, then step onto it," contrasting it with the two-step `git branch` + `git switch`. But the card does not require the learner to CHOOSE between the two approaches - it tells them which one to use. The only choice is "type the shortcut, not the long way," which is following instructions, not deciding.

**The `files` arrays are empty.** Both cards have `files: []`, so no files appear in the working tree panel. Card 2's goal says "The folder holds `dog.txt`" and asks to stage and commit it, but the file is not seeded - the learner cannot see it. This appears to be a data inconsistency: the `start` commands set up commits, but the files those commits should contain are not listed.

**Concept ownership note in `meta.js`:** The file header says:
> "Concept ownership note: `gt-branch` and `gt-head` are introduced here because the viz lesson that owns them in the plan (`git-what-a-branch-is`, the 01- slot of this part) is not built yet. When that lesson lands, move both ids..."

But lesson 4 (`git-what-a-branch-is`) DOES exist and DOES introduce those concepts (per its `meta.js`). This note is stale - the ownership migration happened, but the comment was not deleted. `meta.js` currently shows `"introduces": []` and `"revisits": ["gt-branch", "gt-head", "gt-commit"]`, which is correct.

**Actionable fixes:**
1. **Card 1: Add a decision about WHEN to move.** Start with `main` at commit 2. Goal: "Make a branch called `experiment` at commit 1 (not at `HEAD`), without moving onto it." Solution: `git log --oneline` (to see which commit is which), `git branch experiment main~1`. This requires reading the history, counting back, and using a revision instead of defaulting to `HEAD`. It previews `HEAD~n` (taught in lesson 12) and turns card 1 into a 2-3 command decision.
2. **Card 2: Require choosing the approach.** Start with no branch `feature` yet. Give two goals in the `context`: "You can make the branch and move onto it in two commands (`git branch feature; git switch feature`), or one (`git switch -c feature`). Try the one-step way." Then in the `goal`, say "Use whichever approach you prefer, but both must end with you on `feature` having committed `add dog`." Grading is DAG-only, so both paths pass. This makes the shortcut a learner choice, not a prescribed command.
3. **Fix the `files` array or clarify the model.** Either add `files: ["dog.txt"]` to card 2 so the file appears, or revise the `goal` prose to say "Stage and commit `dog.txt` (the file is available to `git add`)" - acknowledging that files exist in the model even when not displayed.
4. **Delete the stale concept-ownership comment** in `meta.js` (lines 1-5 of the file).

## Verification status
Read-only content audit. Git lessons are data-only; the runtime is in `code-lab/src/core/git-model.ts`.
