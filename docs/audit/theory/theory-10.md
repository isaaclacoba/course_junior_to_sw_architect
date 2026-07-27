# Types (`theory-10.viz.js`)

- **Track / Part:** Theory - Part 2 From idea to running code
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
Every value has a `type` - a kind. The type decides what you can do with a value
(you can add two `int`s, not a `bool` to a word), so the compiler stops a misuse
before the program runs. The common types are `int`, `double`, `string`, `bool`.
The type travels with the variable and stays fixed for the slot's whole life.

## Card-by-card
One `MemoryViz` run - memory scene, no board, `stack` region only, five steps.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | `age`/`name`/`ready` each hold a kind | Type | See `int`, `string`, `bool` values in slots. |
| 2 | Type decides allowed operations | Type rules | See `age + 1` work; adding a `bool` to a word rejected. |
| 3 | The common four types | int/double/string/bool | See `price` (a `double`) added alongside. |
| 4 | Type travels with the variable | Fixed kind | See a number slot refuse `"Rex"`. |
| 5 | Type fixed for the slot's life | Compile-time check | See why the compiler can catch misuse early. |

## Prerequisites
Builds on [theory-9.md](theory-9.md) (a variable is a named slot). Introduces
`type`, `int`, `double`, `string`, `bool`, and the idea of a compile-time check.

## Complexity rung
One idea - each value has a fixed kind that limits what you can do - shown across
four sample slots. The compile-time-check point is the only abstract beat and it
is tied to a concrete "adding a bool to a word" example. Small step.

## Covered well
- The four everyday types are introduced together as a short reference list.
- "Type decides what you can do" is the through-line, not just a definition.
- Links the fixed-type rule to the practical payoff (the compiler catches misuse).

## Gaps / issues
- **Dead sibling file.** `theory-10.js` (a `DRILL_CONFIG` quiz + fill-in-the-blank
  lesson) exists but is not loaded by `theory-10.html`; only `theory-10.viz.js`
  runs. Legacy content to remove or reconcile.
- The hero intro still says "Answer a quick check on each idea, then fill the gap
  in a plain sentence" - copy inherited from the old drill format, but the live
  widget has no quiz or fill-in-the-blank. Stale intro text.
- No in-lesson check; retention rests on the Part 2 checkpoint.

## Verification status
Read-only content audit (no compile). Confirmed from `theory-10.html` that the
viz widget is the live lesson and `theory-10.js` is not loaded.
