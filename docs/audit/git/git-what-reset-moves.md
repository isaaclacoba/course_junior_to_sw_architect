# What reset actually moves (`git-what-reset-moves`)

- **Track / Part:** Git - Part 4 Fixing mistakes
- **Engine / format:** viz widget (narrated visual, `repo` panel)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (narrated visualization)  **Theme:** neutral (cat/dog/draft)

## Concept(s) taught
Introduces `gt-reset` - moving a branch back and choosing where the files land. Revisits `gt-staging-area` and `gt-working-tree`.

## Step-by-step
| # | Narration summary | What is shown |
|---|---|---|
| 1 | Three commits, `main` on the newest. Last one is a mistake. | `add cat`, `add dog`, `oops` with `draft.txt` |
| 2 | `--soft` moves `main` back; `draft.txt` is still staged. | Branch on `add dog`, `draft.txt` in staging |
| 3 | `--mixed` makes the same move; file is in the working tree. | Branch on `add dog`, `draft.txt` in folder |
| 4 | `--hard` makes the same move; file is gone. | Branch on `add dog`, both zones empty |
| 5 | The mode decides where your files go. | `--soft` lets you recommit with a new message |

## Prerequisites
Assumes commits, staging, and the working tree (lesson 1), and `HEAD~n` notation (lesson 12).

## Complexity rung
A small step: the prior lesson taught `HEAD~1` for reaching back; this uses it as the target of a destructive command.

## Covered well
- The controlled comparison: steps 2-4 replay the SAME reset (`HEAD~1`), changing only the mode, so the branch lands on the same commit every time and the ONLY visible difference is where `draft.txt` ends up.
- The explicit naming of the danger: step 4 says "this is the one to read twice before you run it."

## Gaps / issues

**CONTENT DEFECTS (fixable by editing data):**

1. **The viz shows no file text.** Steps 2-4 say "`draft.txt` is sitting there" (staging), "back in the folder" (working tree), or "gone" (hard), but the learner never SEES the file or its content. The three zones are CHIPS with filenames, not file TEXT. **MODEL LIMIT.** The git model has no `blobs` field yet. The chips are all the model can show until git-track-depth.md phase 1.

2. **No mention of `reflog` to recover from `--hard`.** Step 4 narration: "`--hard` makes the same move once more, and this time it puts `draft.txt` nowhere. Staging empty, folder empty - what that commit was holding is gone. This is the one to read twice before you run it." The prose warns but does not teach RECOVERY. **GAP:** No `reflog` is taught anywhere. The lesson teaches a DESTRUCTIVE command without teaching the undo. **Requires git-track-depth.md phase 7.**

3. **Theory and practice show identical content.** This viz shows: (1) three commits, (2) reset with `--soft`/`--mixed`/`--hard`, (3) files land in staging/worktree/nowhere. Lesson 14 (the practical) shows: (1) three commits, (2) reset with `--soft`/`--mixed`/`--hard`, (3) files land in staging/worktree/nowhere. The theory adds NOTHING the practical does not already show - the only difference is who types the commands. **Fix (after model has file text):** After git-track-depth.md phase 1, rewrite this viz to show FILE TEXT moving between zones: step 1 shows `draft.txt` inside the `oops` commit (a box with the file's lines); step 2 shows the same lines in the staging area; step 3 shows them in the working tree; step 4 shows them deleted. Then theory teaches the MODEL (what each zone IS, what reset MOVES) and practice teaches the TOOL (typing the commands).

**MODEL LIMITS (needs engine work):**

1. **No file text.** Same as lessons 9/10. The model's `index` and `worktree` are `Map<string, "staged">` and `Map<string, WorktreeStatus>` (git-model.ts lines 38-41) - paths only, no content. The chips showing filenames are the best the model can do until git-track-depth.md phase 1 adds `Map<path, string>`.

## Verification status
Read-only content audit only. Viz lessons do not compile.
