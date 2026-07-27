# How code is shared (`theory-20.viz.js`)

- **Track / Part:** Theory - Part 4 The development world (second lesson in path order, after "Standing on other code"; the last theory lesson)
- **Engine / format:** viz widget (`window.LESSON_VIZ`, mounted by `page-shell.js`; no board, stack region relabelled HISTORY)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
How code itself is tracked and shared. A `version control` tool records every
change; when you reach a point worth keeping you make a `commit` (a saved
snapshot with a message); all commits form a `history` you can review or undo
from; and version control lets a team `work together`, each committing their own
copy so the work merges without anyone overwriting anyone.

## Card-by-card
One `LESSON_VIZ` run of four steps; no code, the stack region relabelled HISTORY
with the newest commit on top.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | Code keeps changing | version control | Read that changes are tracked so nothing is lost. |
| 2 | First commit | commit | See a snapshot with a message land in history. |
| 3 | Second commit | history | See commits stack into a timeline. |
| 4 | Ana's commit joins | collaboration | See a teammate's commit merge without overwriting. |

## Prerequisites
Builds on [theory-21.md](theory-21.md) (the development-world framing) and the
Part 3 idea of files and saved data (see [theory-18.md](theory-18.md)). No
syntax; introduces version control, commit, history, collaboration.

## Complexity rung
A light, four-step close to the whole theory track. One idea (tracked snapshots)
carried into teamwork. Small step from lesson 21.

## Covered well
- Reuses the stack region as a commit HISTORY, a fitting "newest on top" visual.
- Ends the track on a practical, motivating note (work together, never lose work).
- Each commit shows which files it changed, making a snapshot concrete.

## Gaps / issues
- **Dead sibling file.** `theory-20.js` exists but `theory-20.html` loads only
  `theory-20.viz.js`. Manifest lists both; only the viz is live.
- **Numbering vs path order.** `theory-20` appears *after* `theory-21` in
  `index.html`, so the higher-numbered file is taught first. The filenames and
  the taught order disagree - a maintenance trap.
- No in-lesson check; retention rests on the Part 4 checkpoint. The term "branch"
  is not introduced (arguably out of scope for a first pass).

## Verification status
Read-only content audit (no compile). Commit snapshots are display-only.
Confirmed from the HTML that the viz widget is the live lesson and that this
lesson follows theory-21 in the path.
