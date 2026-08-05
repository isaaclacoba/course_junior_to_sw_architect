# Mark a version with a tag (`content/git/02-branches/03-git-mark-a-version/`)

- **Track / Part:** Git - Part 2 Branches
- **Engine / format:** git (practice - terminal + live graph)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 2
- **Runnable:** yes (graded by DAG state-match)  **Theme:** animals (cat.txt, dog.txt, bird.txt)

## Concept(s) taught
A tag is a name pinned to one commit that never moves. Use it to mark a version worth finding again. `git tag <name>` tags `HEAD`; `git tag <name> <revision>` tags another commit.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Mark the commit you are on | `git tag` | Type `git tag v1` - **1 command**, straight sequence, no decision. |
| 2 | Mark an older commit | `git tag <name> <revision>` | Type `git tag v0 HEAD~1` - **1 command**, straight sequence, no decision. |

## Prerequisites
Lesson 5 (`git-make-a-branch`) - the learner knows branches move as you commit. This lesson introduces the fixed name that does NOT move. Also assumes lesson 3 (`git-where-am-i`) for the concept of a hash, though card 2 uses `HEAD~1` instead of a hash.

## Complexity rung
A tiny step: from "a name that moves" to "a name that does not." The command syntax is almost identical to `git branch`.

## Covered well
- The `intro` clearly states the contrast: "A branch moves as work continues. Sometimes you need a name that stays fixed."
- Card 2 introduces `HEAD~1` (one commit before `HEAD`), previewing the revision syntax that lesson 12 teaches in depth.

## Gaps / issues

**Both cards are 1-command straight sequences with no decision.** This is the owner's primary complaint: "mark-a-version needs ONE command." Measured:
- Card 1 solution: `git tag v1` (1 command).
- Card 2 solution: `git tag v0 HEAD~1` (1 command).

Neither card requires reading state, choosing between options, or making a decision. The learner types the exact command from the `goal` and passes.

**Card 2's use of `HEAD~1` is taught, not discovered.** The `context` says:
> "You can also tag a commit that is not the current one by naming a revision. `HEAD~1` means one commit before where you stand."

This is a definition, not a problem to solve. The card then says "Tag the commit before last with `git tag v0 HEAD~1`" - the solution is given in the goal statement. The learner learns vocabulary (`HEAD~1`) but does not use it to solve anything.

**The lesson introduces `gt-tag` but never contrasts it with `gt-branch` visually.** The `intro` and summary say "branches move; tags stay pinned," but the graph never shows a commit happening AFTER a tag to demonstrate that the tag does not follow. Both cards end immediately after placing the tag, so the learner never sees the "pinned" behaviour in action.

**Actionable fixes (per the owner's bar: 3-6 commands with a DECISION):**

**Card 1 replacement:** "Find the release commit and mark it."
- Start: 5 commits on `main`, messages are `"add cat"`, `"add dog"`, `"add bird"`, `"release: v1.0"`, `"add feeder"`.
- Goal: "Read the commit history to find the release commit (the one with `release:` in the message). Tag THAT commit with `v1`, without moving `HEAD`."
- Solution: `git log --oneline` (read the history), `git tag v1 main~1` (the release is the commit before the current tip).
- Commands: 2-3 (log, tag with revision). Decision: which commit gets the tag, found by reading messages.

**Card 2 replacement:** "Tag two versions at once, choosing the right commits."
- Start: 6 commits on `main`, where commits 2 and 5 have messages `"stable checkpoint"` and `"stable checkpoint"` (identical text, different commits).
- Goal: "Tag the FIRST stable checkpoint as `v0` and the SECOND stable checkpoint as `v1`. You will need to read the log, count commits, and tag both without moving `HEAD`."
- Solution: `git log --oneline` (read and count), `git tag v0 main~4` (first stable is 5 commits back), `git tag v1 main~1` (second stable is 2 commits back).
- Commands: 3 (log, tag, tag). Decision: which commits match the description, found by reading and counting.

**Alternative card 2:** "Tag, commit, and confirm the tag stayed."
- Start: 3 commits on `main`.
- Goal: "Tag the current commit `v1`, then add a new commit `add feeder`, then run `git log --oneline` to confirm `v1` stayed on the old commit."
- Solution: `git tag v1`, `git add feeder.txt`, `git commit -m "add feeder"`, `git log --oneline`.
- Commands: 4. Decision: none, but this card would SHOW that tags do not move - the current lesson's biggest gap.

**Summary:** The current lesson is the thinnest in the track (2 cards, 1 command each, no decisions). It teaches a term (`tag`) and syntax (`git tag <name> <revision>`) but not a skill. The fixes above turn it into a reading-and-deciding exercise that earns the 20 XP it awards.

## Verification status
Read-only content audit. Git lessons are data-only; the runtime is in `code-lab/src/core/git-model.ts`.
