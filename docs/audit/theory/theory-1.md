# What a program is (`theory-1.viz.js`)

- **Track / Part:** Theory - Part 1 What a computer really is
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
The bottom-layer mental model of a program: a computer follows tiny exact
`instructions` in order, a `program` is an ordered list of them, instructions act
on `data`, the `CPU` runs them, and human-written code is turned into CPU
instructions by `compilation`.

## Card-by-card
The lesson is one `MemoryViz` run (board + `code` and `global` RAM regions) over
a four-line pseudo-program (`set a`, `set b`, `add sum`, `print sum`). Progress is
marked and XP awarded when the last step is reached.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | Follows steps exactly | Following instructions | Watch the CPU start and read line by line. |
| 2 | Each line is one instruction | Instruction | See `set a` write `a = 5` to a memory slot. |
| 3 | A program is an ordered list | Program | See order matter as `set b` runs next. |
| 4 | Instructions work on data | Data | Watch `a`, `b`, `sum` fill the `global` region. |
| 5 | The CPU runs them | CPU | Highlight the `SoC`/core carrying out each step. |
| 6 | Your code gets translated | Compilation | See that C# is compiled down to these steps. |

## Prerequisites
None within the track - this is the first Theory lesson. The hero states the
audience already knows hardware vs software; the lesson teaches the layer below
that. No prior syntax assumed.

## Complexity rung
The floor of the whole Theory track. Six named ideas, but one per visual step and
each built on a single running example, so the step size stays small.

## Covered well
- One idea per step, all anchored to the same four-line program the learner watches execute.
- Plain, concrete voice; terms bolded on first use in the narration.
- `compiler` step quietly connects to the C# the practical track will use.
- Final step advances to the next lesson via `nextHref` (no dead-end).

## Gaps / issues
- **Dead sibling file.** `theory-1.js` is a full `DRILL_CONFIG` (quiz +
  fill-in-the-blank + recap) but no HTML loads it - `theory-1.html` loads only
  `theory-1.viz.js` and `page-shell.js`. The drill content is legacy and unused;
  it should be removed or the two kept in sync to avoid confusion.
- No fill-in-the-blank or quiz check in the live widget - progress is by
  stepping to the end, so retention is not tested (the checkpoint covers Part 1).

## Verification status
Read-only content audit (no compile). The pseudo-program is display-only. Verified
from the HTML that the viz widget - not the drill engine - is what runs.
