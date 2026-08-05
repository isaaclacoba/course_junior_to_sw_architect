# When two changes collide (`git-when-changes-collide`)

- **Track / Part:** Git - Part 3 Bringing work back
- **Engine / format:** viz widget (narrated visual, `repo` panel)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (narrated visualization)  **Theme:** neutral (cat/dog)

## Concept(s) taught
Introduces `gt-conflict` - what it means when git stops mid-merge, and that a conflict is a question rather than a failure.

## Step-by-step
| # | Narration summary | What is shown |
|---|---|---|
| 1 | One commit, one name. Nothing can collide yet. | `add dog` on `main` |
| 2 | Two lines now. Both changed `cat.txt`. | `fix` has `cat sleeps in the sun`, `main` has `cat is hungry` |
| 3 | Two versions of one file, no rule to pick. | Same graph, prose explains the conflict condition |
| 4 | Run `git merge fix` - nothing was added. | Graph unchanged after merge attempt |
| 5 | You decide, git saves the result. | Merge commit appears after resolution |
| 6 | A conflict is a question, not a failure. | Same merge commit, prose recap |

## Prerequisites
Assumes merges (lesson 8), branches and commits (lesson 5).

## Complexity rung
A small step: the prior practical ran `git merge` successfully; this shows the case where it stops.

## Covered well
- The deliberate still frame: step 4 shows the graph UNCHANGED after the merge attempt, proving nothing was saved.
- The "conflict as question" framing.

## Gaps / issues

**CONTENT DEFECTS (fixable by editing data):**

1. **The lesson never shows what a conflict LOOKS LIKE.** The owner's complaint: "the lesson does not teach anything related with how to solve the conflict! No git checkout, does not show the diff, so we never show what a conflict looks like!" The narration says "both of them changed `cat.txt`" (step 2) and "you say what `cat.txt` should end up as" (step 5), but NO FILE TEXT is shown. The learner never sees the `<<<<<<<` markers, never sees the two versions side by side, never sees how to read which lines came from which side. **MODEL LIMIT, not fixable without the file-contents engine described in git-track-depth.md.** The model's `Commit` is `{ id, parents, message, paths }` - no `blobs` field yet.

2. **Step 5 jumps to "You decided" without showing HOW.** The narration says "You say what `cat.txt` should end up as, tell git that file is settled, and commit" but no commands are shown. The learner sees the RESULT (a merge commit) but never the RESOLUTION process. **Fix (CONTENT):** Add step text naming the commands: "`git add cat.txt` says the file is settled; `git commit` finishes the merge." But the file text itself is still missing - that remains a model limit.

3. **No mention of `git diff` or how to see the conflict markers.** The model cannot show them, but the prose could at least NAME the habit: "In a real conflict you would read the markers git writes inside the file and edit it to keep the right lines." **Fix (CONTENT):** Add one sentence to step 4 or 5 naming the missing step.

4. **Theory and practice show identical content.** The owner's complaint: "Why do we need the same twice?" This viz shows: (1) both sides changed the same file, (2) the merge stops, (3) you resolve and commit. Lesson 10 (the practical) shows: (1) both sides changed the same file, (2) the merge stops, (3) you resolve and commit. The only difference is *who* types the commands - the viz narrates them, the practical asks the learner to type them. The theory adds NOTHING the practical does not already show. **Fix (requires model):** After the model gains file contents (git-track-depth.md phase 1), rewrite this viz to show the FILE TEXT changing: step 2 shows `cat.txt` with two different lines on the two branches; step 4 shows the conflict MARKERS git writes into the file; step 5 shows the markers REMOVED and the file edited. Then theory teaches the MODEL (what a conflict is, what the markers mean, how resolution works) and practice teaches the TOOL (typing the commands on a simple case).

**MODEL LIMITS (needs engine work):**

1. **No file text.** `git-model.ts` line 10: "There is no rendering and no file contents here". A conflict is detected when `changedPaths(h, base)` and `changedPaths(o, base)` overlap (line 430), but the overlapping PATHS are all the model knows - no line-level conflict, no markers, no diff. **Requires the `Map<path, string>` blobs change in git-track-depth.md phase 1.**

## Verification status
Read-only content audit only. Viz lessons do not compile.
