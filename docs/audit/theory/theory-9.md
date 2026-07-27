# Variables (`theory-9.viz.js`)

- **Track / Part:** Theory - Part 2 From idea to running code
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
A `variable` is a named slot in memory that holds one value: the `name` is a
label for people while the machine uses the address; the `value` can change by
writing over it; the two operations are `read` and `write`; and a slot holds
only one value at a time, each new value replacing the old.

## Card-by-card
One `MemoryViz` run - memory scene, no board, `stack` region only, five steps.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | `int score = 10` sets up a slot | Variable | See a named slot `score` holding `10`. |
| 2 | The name is a label; address underneath | Name vs address | See `score` mapped to `0x7000`. |
| 3 | `score = 25` writes a new value | Write | Watch the slot value change to `25`. |
| 4 | `print score` reads what is there | Read | See the current value read back. |
| 5 | One value at a time | Replacement | See that `10` is gone once `25` is written. |

## Prerequisites
Builds on the Part 1 memory model (working memory holds slots) - the narration
calls back to it explicitly. Introduces `variable`, name, value, read, write.

## Complexity rung
One idea - a named slot you read and write - carried through a single value's
life. Small, steady steps; the "one value at a time" point is the only subtlety
and it is shown.

## Covered well
- Directly reuses the Part 1 memory picture, so the slot is not a new metaphor.
- Separates the human name from the machine address, heading off a common myth.
- Read vs write is named as the two things you do, not left implicit.

## Gaps / issues
- **Dead sibling file.** `theory-9.js` (a `DRILL_CONFIG` quiz + fill-in-the-blank
  lesson) exists but is not loaded by `theory-9.html`; only `theory-9.viz.js`
  runs. Legacy content to remove or reconcile.
- No in-lesson check; retention rests on the Part 2 checkpoint.
- The widget names no next lesson - only a "Back to the course" link.

## Verification status
Read-only content audit (no compile). Confirmed from `theory-9.html` that the
viz widget is the live lesson and `theory-9.js` is not loaded.
