# Text, images, and sound as numbers (`theory-6.viz.js`)

- **Track / Part:** Theory - Part 1 What a computer really is
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, board off, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
How real things become numbers via an agreed `encoding`: `text` maps each
character to a number (Unicode), an `image` is a grid of pixels each stored as
red/green/blue numbers, `sound` is measured thousands of times a second into
`sample` numbers, and the same numbers mean different things only by the encoding
a program applies.

## Card-by-card
One `MemoryViz` run with the board hidden - just the `stack` region relabelled
`SLOTS`, filled with labelled key/value pairs that show things turning into numbers.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | The agreed code | Encoding | See `'A' = 65`, `'B' = 66` as an agreed mapping. |
| 2 | Text | Encoding of text | See `"Hi"` stored as `H = 72`, `i = 105` (Unicode). |
| 3 | Image | Pixels as numbers | See pixels stored as `(r, g, b)` triples. |
| 4 | Sound | Samples as numbers | See a wave sampled into numbers over time. |
| 5 | It is all numbers | Encoding decides meaning | See text, image, sound side by side as numbers. |

## Prerequisites
Builds directly on [theory-5.md](theory-5.md) (everything is numbers; a byte holds
one character). Introduces encoding, pixels, samples.

## Complexity rung
A step up in abstraction (a number means nothing without its encoding) but each
medium is shown in the same slot format, so the pattern reads clearly. The closing
synthesis step lands the single idea.

## Covered well
- One representation per step, all in the same slot layout so the "same numbers,
  different meaning" point is visible in the final step.
- Board hidden to keep focus on the data (a deliberate scene choice, config-driven).
- Correctly names Unicode and RGB without over-explaining.

## Gaps / issues
- **Dead sibling file.** `theory-6.js` (`DRILL_CONFIG` with quiz + recap) is not
  loaded by `theory-6.html`; only `theory-6.viz.js` runs. Legacy content to remove
  or reconcile.
- No in-lesson check; retention rests on the checkpoint.

## Verification status
Read-only content audit (no compile). Slot values are display-only. Confirmed from
HTML that the viz widget is the live lesson.
