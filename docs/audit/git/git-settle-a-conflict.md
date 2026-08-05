# Settle a conflict (`git-settle-a-conflict`)

- **Track / Part:** Git - Part 3 Bringing work back
- **Engine / format:** git (terminal + live graph)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 2
- **Runnable:** yes (state-based grading)  **Theme:** neutral (cat/dog)

## Concept(s) taught
Introduces `gt-abort` (calling a stopped merge off). Revisits `gt-conflict`.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Finish the stopped merge | git add (mark it settled) | Type `git merge fix`, `git add cat.txt`, `git commit -m "merge fix"` - 3 commands. |
| 2 | Call one off instead | git merge --abort | Type `git merge --abort`, `git tag before-merge` - 2 commands. Card starts with merge already stopped. |

Grading is state-based. Card 2 pairs `--abort` with a tag because aborting leaves no trace of its own.

## Prerequisites
Assumes the conflict condition from lesson 9 `git-when-changes-collide`, and merges from lesson 8.

## Complexity rung
A small step: the prior viz explained what a conflict is; this is the keyboard version of resolving one.

## Covered well
- Card 2 opens with the merge already stopped, so `--abort` is the first thing the learner types - a clean isolation.
- The tag pairing is clever: `--abort` cannot be graded alone (it leaves no state change), so card 2 asks for a tag, which IS checkable.

## Gaps / issues

**CONTENT DEFECTS (fixable by editing data):**

1. **The lesson never shows the learner a conflict's file text.** The owner's complaint (on the 9+10 pair): "the lesson does not teach anything related with how to solve the conflict! No git checkout, does not show the diff, so we never show what a conflict looks like!" Card 1 `context` says "both changed `cat.txt`, so the merge stops" and `goal` says "Say `cat.txt` is settled with `git add cat.txt`", but the learner NEVER SEES the `<<<<<<<` markers, never edits the file, never learns how to read which lines are which. The practical lesson teaches the CEREMONY (`git add` + `git commit`) but not the CONFLICT RESOLUTION (reading the markers, choosing the right lines, editing the file). **MODEL LIMIT.** The git model has no file contents - `Commit.paths` is a string array, no `blobs`. The practical lesson cannot show Monaco with a conflict because the conflict text does not exist in the model.

2. **Card 1 solution is a straight 3-command sequence with no decision.** `solution: ["git merge fix", "git add cat.txt", "git commit -m \"merge fix\""]`. The learner is TOLD which file is in conflict (the `context` says "both changed `cat.txt`") and TOLD to mark it settled. No reading, no choice. **Fix (CONTENT, after model has file text):** After the model gains file contents (git-track-depth.md phase 1), rewrite card 1 to: (a) give TWO files in conflict (`cat.txt` and `dog.txt`), (b) require `git status` to read which files are unmerged, (c) require the learner to resolve them in the right order (e.g. "`cat.txt` must be resolved before `dog.txt` because..."). Until then, the 3-command sequence is the best the model can support.

3. **No habit of checking the conflict state first.** Card 1 `goal` says "run `git merge fix` and read what it prints" but the `solution` does not include `git status` or any read-before-acting command after the merge stops. **Fix (CONTENT):** Add `git status` to `solution` between the merge and the add, so the learner sees "both modified: cat.txt" before resolving.

4. **Card 2 `goal` says "Check where you are with `git status`" but the `solution` does not include it.** The command is advisory prose, not graded. **Fix (CONTENT):** Prepend `git status` to `solution: ["git status", "git merge --abort", "git tag before-merge"]`.

5. **The conflict is TOLD, not SHOWN.** The setup comment (line 7-16) explains how the conflict is manufactured - `git reset --mixed` to put `cat.txt` back in the folder, then commit it again on `main` - but this is a replayed setup, never shown to the learner. The learner "just finds two branches whose newest commits both touched `cat.txt`" (line 16). Fine for a manufactured exercise, but the learner never learns how to RECOGNIZE a conflict before running the merge - no "look at both branches with `git log` and see they touched the same file" step. **Fix (CONTENT):** Add a pre-merge card: "Card 0: Read both branches with `git log --oneline main` and `git log --oneline fix` and predict whether they will conflict." Then card 1 confirms the prediction.

6. **The conflict file is never actually EDITED.** Real conflict resolution is: (a) read the markers, (b) edit the file to keep the right lines and delete the markers, (c) save, (d) `git add`, (e) `git commit`. This lesson teaches (d) and (e) only. Steps (a), (b), (c) are MISSING. **MODEL LIMIT.** Until the model has file contents and a Monaco surface for editing them (git-track-depth.md phase 2), the lesson cannot teach the editing step.

**MODEL LIMITS (needs engine work):**

1. **No file contents, so no conflict markers, no editing surface.** Same as lesson 9. `git-model.ts` detects a conflict when both sides changed the same PATH (line 430 `conflicted = [...hPaths].filter(p => oPaths.has(p))`), but the model has no `blobs` field, no line-level merge, no markers. **Requires git-track-depth.md phase 1 (file contents) + phase 2 (Monaco conflict editor in the practical surface).**

## Verification status
Read-only content audit only. No compile step (git lessons).
