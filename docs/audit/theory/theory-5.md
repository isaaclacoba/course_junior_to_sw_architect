# How computers store everything as numbers (`theory-5.viz.js`)

- **Track / Part:** Theory - Part 1 What a computer really is
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
The data-representation foundation: underneath, everything is `numbers`; those
numbers are built from `bit`s (single on/off values); two states are used because
they are reliable; counting with only 0 and 1 is `binary` and each extra bit
doubles the reach; eight bits grouped together make one `byte` (256 values).

## Card-by-card
One `MemoryViz` run (board + `stack` region relabelled `ONE BYTE`) showing a byte
of eight bit slots that flip and count upward.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | A byte of eight bits, all off | Bit | See eight `0` slots making one byte. |
| 2 | Flip bit 0 on | Bit / two states | Watch a single bit read `1`; reliability explained. |
| 3 | `0000 0001` = 1 | Binary | See the pattern read as the number one. |
| 4 | Count up to `0000 0010` = 2 | Binary / doubling | Watch bits flip; each bit doubles the reach. |
| 5 | `0000 0101` = 5 | Binary | See another pattern read as five. |
| 6 | Group eight = one byte | Byte | See eight bits named a byte (256 values, one letter). |

## Prerequisites
Builds on the memory ideas of [theory-2.md](theory-2.md). No syntax assumed.
Introduces bit, binary, byte.

## Complexity rung
A clean single-thread lesson: one byte, watched flipping and counting. Small,
steady steps; the doubling idea is the only mildly abstract point and it is shown.

## Covered well
- Abstract binary made concrete by watching real bit slots flip and count.
- Reliability of two states is justified (wire carries current or not), not asserted.
- Sets up Lesson 6 (encoding) with the closing "enough for a single letter" line.

## Gaps / issues
- **Dead sibling file.** `theory-5.js` (`DRILL_CONFIG` with quiz + recap) is not
  loaded by `theory-5.html`; only `theory-5.viz.js` runs. Legacy content to
  remove or reconcile - note the manifest lists both `.js` files for this lesson,
  but only the viz is live.
- No in-lesson check; retention rests on the checkpoint.

## Verification status
Read-only content audit (no compile). Bit patterns are display-only. Confirmed
from HTML that the viz widget is the live lesson.
