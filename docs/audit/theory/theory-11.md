# Statements and expressions (`theory-11.viz.js`)

- **Track / Part:** Theory - Part 2 From idea to running code
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
Code is built from two kinds of thing: a `statement` is one complete step, and
an `expression` is a piece of code that produces a value (`2 + 3` works out to
`5`). Statements use expressions to get values, `assignment` (`=`) stores the
computed value into a slot, and statements run in order, top to bottom.

## Card-by-card
One `MemoryViz` run - memory scene, no board, `code` + `stack` regions, six steps.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | The whole line is one statement | Statement | See a line marked as one step. |
| 2 | `2 + 3` produces a value | Expression | See the sub-piece marked, works out to `5`. |
| 3 | The statement stores that value | Statement uses expression | See `5` land in the `total` slot. |
| 4 | `=` writes the value in | Assignment | See the assignment operator highlighted. |
| 5 | Next line: `total + 1` runs in order | Order / operators | See `total` become `6`. |
| 6 | Last line reads and prints | Order | See `total` (`6`) read out. |

## Prerequisites
Builds on [theory-9.md](theory-9.md) (slots) and [theory-10.md](theory-10.md)
(values have types). Introduces `statement`, `expression`, `assignment`, and
operator-marked code.

## Complexity rung
Two named ideas in one lesson (statement, expression) plus assignment - but they
are complementary halves of the same picture and shown together, so it reads as
one idea with two faces. Small-to-medium step.

## Covered well
- The statement/expression split is the exact framing a beginner needs and it is
  made visual with per-token `codeMark` kinds (`stmt`, `expr`, `op`).
- "Statements use expressions to get values" ties the two together rather than
  defining them in isolation.
- Order-of-execution is shown by stepping the program counter, not asserted.

## Gaps / issues
- **Dead sibling file.** `theory-11.js` (a `DRILL_CONFIG` quiz + fill-in-the-blank
  lesson) exists but is not loaded by `theory-11.html`; only `theory-11.viz.js`
  runs. Legacy content to remove or reconcile.
- Two vocabulary words land in one card sequence; a learner who confuses them has
  no in-lesson check to catch it before the Part 2 checkpoint.

## Verification status
Read-only content audit (no compile). Confirmed from `theory-11.html` that the
viz widget is the live lesson and `theory-11.js` is not loaded.
