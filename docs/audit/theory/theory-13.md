# Functions (`theory-13.viz.js`)

- **Track / Part:** Theory - Part 2 From idea to running code
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
A `function` is a named bundle of steps that live in the `code` area of memory;
you write them once and `reuse` them by calling. A call pushes a `frame` (the
function's own local memory) onto the stack, arguments arrive as `local`
variables, the body computes a `return` value, the frame is `popped` off when it
returns, and programs are built from many functions calling each other from `main`.

## Card-by-card
One `MemoryViz` run - machine scene (board) + `code`/`stack` regions, six steps.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | `add` lives in the code area | Function | See the function's steps highlighted in `ram`. |
| 2 | Call it wherever you need it | Reuse | See `main` about to call `add`. |
| 3 | `add(3, 5)` pushes a frame | Call / frame / arguments | Watch `a = 3`, `b = 5` appear in a new frame. |
| 4 | The body computes `a + b` | Local variables | See `a + b = 8` from the frame's locals. |
| 5 | Return `8`, frame popped | Return / pop | Watch the frame vanish and `8` land in `r`. |
| 6 | Many functions call each other | Composition | See `main` as just the starting function. |

## Prerequisites
Builds on [theory-9.md](theory-9.md) (variables/slots), the Part 1 stack, and
the call-stack idea. Introduces `function`, `frame`, argument, `local`,
`return`, `main`.

## Complexity rung
The densest lesson in Part 2: call, frame, arguments, locals, return, and pop are
all introduced in one run. Each maps to a visible stack change, but this is a
medium-to-large step for the theory track - the most moving parts of any Part 2
lesson.

## Covered well
- Every abstract term (frame, local, return, pop) is bound to a concrete stack
  animation - the push and pop are watched, not just named.
- Reuse is motivated up front (write once, call many), matching the hero's
  copy-paste hook.
- The nesting/`main` closing step sets up how whole programs are structured.

## Gaps / issues
- **Dead sibling file.** `theory-13.js` (a `DRILL_CONFIG` quiz + fill-in-the-blank
  lesson) exists but is not loaded by `theory-13.html`; only `theory-13.viz.js`
  runs. Legacy content to remove or reconcile.
- Several new terms land in a single card sequence with no in-lesson check; the
  frame/local/return cluster is a lot for a very-junior learner to hold before
  the Part 2 checkpoint. The practical track's `writing-methods` lesson is where
  functions get typed for real.

## Verification status
Read-only content audit (no compile). Confirmed from `theory-13.html` that the
viz widget is the live lesson and `theory-13.js` is not loaded.
