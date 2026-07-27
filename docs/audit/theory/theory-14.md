# Bugs: why programs go wrong (`theory-14.viz.js`)

- **Track / Part:** Theory - Part 2 From idea to running code (closes Part 2)
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
A `bug` is a mistake in the instructions - the computer did what you wrote, not
what you meant. A `syntax error` breaks the language's rules and the compiler
catches it before anything runs; a `logic error` builds and runs fine but does
the wrong thing (`-` where `+` was meant). `Debugging` means stepping line by
line, watching each slot, until you find the line that goes wrong.

## Card-by-card
One `MemoryViz` run - machine scene (board) + `code`/`stack` regions, six steps.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | A bug is a mistake in the instructions | Bug | See the setup slots and the "did what you wrote" framing. |
| 2 | A missing symbol stops the build | Syntax error | See `build error` before anything runs. |
| 3 | `-` used for `+` gives `5` not `15` | Logic error | See a wrong value with `got 5, expected 15`. |
| 4 | Step line by line: `a` gets `10` | Debugging | Watch the first slot fill. |
| 5 | Next line: `b` gets `5` | Debugging | Watch the second slot fill as expected. |
| 6 | The value goes wrong here - bug found | Fix | See `total` corrected to `15` after the fix. |

## Prerequisites
Builds on the whole of Part 2 (variables, expressions, assignment) and the Part 1
compile-vs-run distinction. Introduces `bug`, `syntax error`, `logic error`,
`debugging`.

## Complexity rung
Two error kinds plus the debugging loop in one lesson, but each is anchored to the
same tiny four-line routine, so the load stays low. A fitting, low-stress close to
Part 2.

## Covered well
- Contrasts syntax vs logic errors on the same code, so the difference is
  concrete: one blocks the build, the other passes it and lies.
- Debugging is shown as an activity - stepping and watching slots - not defined
  abstractly.
- Normalises bugs ("that is normal") which suits the very-junior audience.

## Gaps / issues
- **Dead sibling file.** `theory-14.js` (a `DRILL_CONFIG` quiz + fill-in-the-blank
  lesson) exists but is not loaded by `theory-14.html`; only `theory-14.viz.js`
  runs. Legacy content to remove or reconcile.
- **Hand-off to the practical track is implicit.** This lesson closes Part 2,
  which teaches variables, types, statements, decisions, functions and bugs as
  concepts - exactly the ground the practical track (`control-flow`,
  `writing-methods`, `first-builds`) then covers by typing and running real C#.
  The lesson names no such bridge: the widget links only "Back to the course",
  and the Part 2 checkpoint's `nextHref` continues within theory to `theory-15`
  (Part 3). A learner is never told that the place to now write this code for
  real is the practical track. Worth an explicit link.
- No in-lesson check; retention rests on the Part 2 checkpoint.

## Verification status
Read-only content audit (no compile). Confirmed from `theory-14.html` that the
viz widget is the live lesson and `theory-14.js` is not loaded.
