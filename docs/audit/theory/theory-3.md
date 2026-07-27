# What starts a program (`theory-3.viz.js`)

- **Track / Part:** Theory - Part 1 What a computer really is
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
The start-up chain: the `operating system` launches a program, its `loader` copies
it into memory, execution begins at a fixed `entry point`, that entry point is by
convention a function called `Main`, and when the program ends the OS frees its
memory.

## Card-by-card
One `MemoryViz` run (board + `code` region) over a tiny `Main() { greet(); print
done }` sketch.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | Something has to start it | Operating system | See the machine idle until the OS launches the program. |
| 2 | The loader brings it into memory | Loader | Watch the program copied into `RAM`. |
| 3 | Execution begins at the entry point | Entry point | See the CPU need one agreed first instruction. |
| 4 | Usually called Main | `Main` | Watch running begin inside `Main`. |
| 5 | It runs, then it ends | Program lifecycle | See the OS free the memory at exit. |

## Prerequisites
Builds on [theory-2.md](theory-2.md) (loaded into memory, CPU runs instructions).
Introduces the OS, the loader, and the `Main` entry point.

## Complexity rung
Same gentle picture, now framing the OS role and naming `Main`. The `Main` step
deliberately pre-teaches the `static void Main()` the practical track opens with.

## Covered well
- Ties the whole open -> load -> start -> run -> end path into one trace.
- Naming `Main` here removes later mystery in the practical track.
- Lifecycle step (memory freed) sets up isolation and process ideas in Lesson 4.

## Gaps / issues
- **Dead sibling file.** `theory-3.js` (`DRILL_CONFIG` with quiz + recap) is not
  loaded by `theory-3.html`; only the viz runs. Legacy content to remove or reconcile.
- No in-lesson check; retention relies on the checkpoint.

## Verification status
Read-only content audit (no compile). Confirmed from HTML that the viz widget is
the live lesson.
