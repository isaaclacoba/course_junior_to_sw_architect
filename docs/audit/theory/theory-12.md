# Decisions and repetition (`theory-12.viz.js`)

- **Track / Part:** Theory - Part 2 From idea to running code
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
A program can `choose` what to do next, not just march down the list. A
`condition` is a yes/no question (`temp > 10`); `if`/`else` picks which branch
runs based on the answer; and a `loop` is the other move - it jumps back to
re-check the condition and repeat while it stays `true`, tying both back to the
Part 1 idea of jumps.

## Card-by-card
One `MemoryViz` run - machine scene (board) + `code`/`stack` regions, six steps.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | One variable drives the choice | Choosing | See `temp` hold `12`. |
| 2 | `temp > 10` works out to `true` | Condition | See `12 > 10 -> true`. |
| 3 | The `if` branch runs, `else` skipped | if branch | See `"warm"` printed. |
| 4 | With `temp = 5` the question is `false` | Condition (other way) | See `5 > 10 -> false`. |
| 5 | The `else` branch runs instead | else branch | See `"cold"` printed. |
| 6 | A loop jumps back to re-check | Loop | See `check again -> repeat`. |

## Prerequisites
Builds on [theory-11.md](theory-11.md) (an expression produces a value - here a
`true`/`false` one) and the Part 1 idea of jumps. Introduces `condition`,
`if`/`else`, `loop`.

## Complexity rung
Two related ideas (decision and repetition) in one lesson, but repetition gets a
single closing step framed as "the other move", so decisions carry most of the
weight. Medium step for the theory track.

## Covered well
- Shows both branches of the same `if` by re-running the condition with a
  different value, so `true` and `false` are both concrete.
- Explicitly connects loops and branches back to Part 1 jumps - reinforces the
  through-line that control flow is jumps.
- The `hot` slot highlight draws the eye to the variable driving each choice.

## Gaps / issues
- **Dead sibling file.** `theory-12.js` (a `DRILL_CONFIG` quiz + fill-in-the-blank
  lesson) exists but is not loaded by `theory-12.html`; only `theory-12.viz.js`
  runs. Legacy content to remove or reconcile.
- Repetition gets a single step at the end; a loop body is never actually stepped
  through repeating, so "repeat while true" is told more than shown. The
  practical track's `control-flow` lesson is where loops get real coverage.
- No in-lesson check; retention rests on the Part 2 checkpoint.

## Verification status
Read-only content audit (no compile). Confirmed from `theory-12.html` that the
viz widget is the live lesson and `theory-12.js` is not loaded.
