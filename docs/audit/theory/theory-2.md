# How a program runs (`theory-2.viz.js`)

- **Track / Part:** Theory - Part 1 What a computer really is
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
What happens between pressing run and the work getting done: the program is
loaded from storage into `RAM`, the CPU repeats the `fetch-execute` loop, it keeps
its place with a `program counter`, some instructions `jump` to change that order,
and the working `data` lives in memory too.

## Card-by-card
One `MemoryViz` run (board + `code` and `global` regions) over a small counting
loop (`set x`, `add x`, `if x < 3 goto 2`, `print x`).

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | Loaded into memory first | Loading | See the program copied from `UFS` storage into `RAM`. |
| 2 | The run loop | Fetch and execute | Watch the CPU fetch then execute an instruction. |
| 3 | It keeps its place | Program counter | See the counter move line 1 -> line 2 in order. |
| 4 | Some instructions jump | Jumps | Watch the `goto` send the counter back - a loop. |
| 5 | Data lives in memory too | Data in memory | See `x` read and written until it reaches 3. |

## Prerequisites
Builds directly on [theory-1.md](theory-1.md): instruction, program, CPU, data.
Introduces storage-vs-memory, the program counter, and jumps.

## Complexity rung
A small step up from Lesson 1: same board-and-memory picture, now adding the
runtime loop and the idea that order can change. One new idea per step.

## Covered well
- The `fetch-execute` loop is shown, not just described, on a running loop program.
- `jump` is framed as the basis of decisions and loops - a hook the later Part 2 lessons pay off.
- Storage-vs-`RAM` distinction is made concrete with the load step.

## Gaps / issues
- **Dead sibling file.** `theory-2.js` (`DRILL_CONFIG` with quiz + recap) is not
  loaded by `theory-2.html`; only the viz runs. Legacy drill content should be
  removed or reconciled.
- No in-lesson knowledge check; retention rests on the Part 1 checkpoint.

## Verification status
Read-only content audit (no compile). Pseudo-program is display-only. Confirmed
from HTML that the viz widget is the live lesson.
