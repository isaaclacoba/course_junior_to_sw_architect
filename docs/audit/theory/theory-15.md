# Where data lives (`theory-15.viz.js`)

- **Track / Part:** Theory - Part 3 How software runs and connects
- **Engine / format:** viz widget (`window.LESSON_VIZ`, mounted by `page-shell.js`; board scene with process-memory regions)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
Where a running program keeps its data. A program starts on `UFS` storage,
is copied into `RAM` (volatile working memory) at power-on, and RAM is a row of
numbered slots (`address`es) split into `regions`: `code`/`text`, `rodata`,
`data`, `bss`, `heap`, and `stack`. Locals go on the `stack` (one `frame` per
call, popped automatically on return); objects made with `new` go on the `heap`
and are reclaimed by the garbage collector when nothing refers to them.

## Card-by-card
One `LESSON_VIZ` run of twelve steps over a fixed 7-line `code` snippet.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | Program on `UFS`, RAM empty | storage vs memory | See the program on non-volatile flash; RAM empty. |
| 2 | Copy into RAM at power-on | RAM is volatile | Watch the load; note quick but wiped on power loss. |
| 3 | Numbered slots | address | See memory as numbered lockers. |
| 4 | Split into regions | regions | See the row divided into named areas. |
| 5 | `code`/`text` + `rodata` | read-only code, constants | See instructions and `PI` constant. |
| 6 | `greeted = 0` in `BSS` | globals, `DATA` vs `BSS` | See zero-init global land in `BSS`. |
| 7 | `score = 7` on stack | stack frame | See a local placed in `run()`'s frame. |
| 8 | `new Dog` on heap | heap, references | See the object on the heap; slot holds its address. |
| 9 | Call `greet()` | fresh frame | See a second frame stacked on top. |
| 10 | `greet()` returns | automatic pop | See the frame removed with no clean-up code. |
| 11 | `run()` ends | garbage collection | See the last frame gone; heap object now unreferenced. |
| 12 | Recap, low to high | full region map | Read the ordered list of all regions. |

## Prerequisites
Builds on the RAM/CPU/storage ideas from Part 1 (see [theory-2.md](theory-2.md))
and functions from Part 2 (see [theory-13.md](theory-13.md)). Uses `new` and an
object with a field, and the word "garbage collector" - all introduced here in
plain terms. No syntax mastery assumed; the snippet is display-only.

## Complexity rung
The heaviest single theory lesson so far: six memory regions plus stack/heap
lifetime and garbage collection in one run. It is paced step-by-step and each
region is shown as it is named, but the step from Part 2's function idea to a
full process-memory map is large.

## Covered well
- Concrete: each region lights up exactly as the matching line runs.
- Distinguishes `DATA` vs `BSS`, stack vs heap, and justifies why `new` goes on
  the heap (lifetime not tied to one call) rather than asserting it.
- Closing recap lists all regions low-to-high, a clean reference.

## Gaps / issues
- **Dead sibling file.** `theory-15.js` exists but `theory-15.html` loads only
  `theory-15.viz.js`. The manifest lists both; only the viz is live. Legacy
  content to remove or reconcile.
- **Density.** Six regions plus GC in one lesson is a lot for the theory
  audience; `rodata`/`data`/`bss` may blur together. No in-lesson check - the
  Part 3 checkpoint carries retention.

## Verification status
Read-only content audit (no compile). Snippet and slot values are display-only.
Confirmed from the HTML that the viz widget is the live lesson.
