# Standing on other code (`theory-21.viz.js`)

- **Track / Part:** Theory - Part 4 The development world (first lesson in path order, before "How code is shared")
- **Engine / format:** viz widget (`window.LESSON_VIZ`, mounted by `page-shell.js`; board scene with code region)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
That most of what you build reuses existing code. A `library` is ready-made code
someone else wrote and shared; every language ships a `standard library` (in
`.NET`, the Base Class Library); when that is not enough you pull in a `package`
(a published bundle) fetched from outside by a `package manager` (in `.NET`,
`NuGet`), which also resolves `dependencies` - the packages those packages rely
on. Your finished program runs as one thing: your code plus all the pulled-in
code loaded together.

## Card-by-card
One `LESSON_VIZ` run of five steps over a fixed 4-line `code` snippet that calls
into a `Json` library.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | Call `Json.Parse` | library | See you call shared code instead of writing it. |
| 2 | Built-in tools | standard library | Read that `.NET`'s BCL ships ready to use. |
| 3 | Pull in a package | package | Watch a bundle fetched from outside. |
| 4 | Resolve versions + deps | package manager, dependencies | See `NuGet` fetch the right versions and deps. |
| 5 | One program | your code + reused code | See it all loaded together in memory. |

## Prerequisites
Builds on Part 3's build/run cycle (see [theory-17.md](theory-17.md)) and the
idea that code is loaded into memory (see [theory-15.md](theory-15.md)). The
snippet is display-only. Introduces library, standard library, package, package
manager, dependency.

## Complexity rung
A gentle opener for Part 4: five short steps, one theme (reuse) with its
vocabulary. Small step from Part 3.

## Covered well
- Names the concrete `.NET` tools (BCL, `NuGet`) so the abstract terms land.
- The closing "look for what already exists before you build it" gives the
  lesson a working habit, not just definitions.
- Dependencies (packages relying on packages) shown as part of the resolve step.

## Gaps / issues
- **Dead sibling file.** `theory-21.js` exists but `theory-21.html` loads only
  `theory-21.viz.js`. Manifest lists both; only the viz is live.
- **Numbering vs path order.** The file is `theory-21` but it appears *before*
  `theory-20` ("How code is shared") in `index.html`. The filename ordering and
  the taught order disagree - a maintenance trap even though the live sequence is
  correct.
- No in-lesson check; retention rests on the Part 4 checkpoint.

## Verification status
Read-only content audit (no compile). The snippet is display-only. Confirmed
from the HTML that the viz widget is the live lesson and that this lesson
precedes theory-20 in the path.
