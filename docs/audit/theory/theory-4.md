# Running many programs at once (`theory-4.viz.js`)

- **Track / Part:** Theory - Part 1 What a computer really is
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
How one machine seems to run many programs together: a running program is a
`process`, one core does one instruction at a time, the OS `time-shares` the CPU
in tiny slices, the `scheduler` picks who runs next, extra `cores` add real
parallelism, and each process is walled off by memory `isolation`.

## Card-by-card
One `MemoryViz` run (board + `stack` region relabelled `PROCESSES`) with two
colour-coded processes (browser, music) and colour-tied CPU cores.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | A running program is a process | Process | See two programs in separate patches of `RAM`. |
| 2 | One core does one thing | The puzzle | See a single lit core and the "how?" question. |
| 3 | The OS switches, fast | Time-sharing | Watch one core run a slice of A, then B. |
| 4 | Scheduler decides next | Scheduler | See the core switch to the music process. |
| 5 | More cores, real at-once | Cores | Watch two cores run both processes truly at once. |
| 6 | Scheduler strategies | Scheduler | See the choices more cores open up (bulleted). |
| 7 | Each keeps its own memory | Isolation | See processes walled off so a crash stays contained. |

## Prerequisites
Builds on [theory-2.md](theory-2.md) (one instruction at a time) and
[theory-3.md](theory-3.md) (the OS launches programs, memory is freed).
Introduces process, time-sharing, scheduler, cores, isolation.

## Complexity rung
The busiest Part 1 lesson - seven steps and six named ideas - but the colour
coding (each process and its core share a colour) carries the load, and each step
adds one idea.

## Covered well
- Colour-tied cores make time-sharing vs parallelism visible rather than abstract.
- Reuses the `stack` region relabelled `PROCESSES` (config, not a new engine feature).
- Isolation is motivated by a concrete payoff (one crash does not take down the rest).

## Gaps / issues
- **Dead sibling file.** `theory-4.js` (`DRILL_CONFIG` with quiz + recap) is not
  loaded by `theory-4.html`; only the viz runs. Legacy content to remove or reconcile.
- Densest lesson of the Part (seven steps); acceptable but the step count is the
  ceiling for this format's one-idea-per-step pacing.

## Verification status
Read-only content audit (no compile). Confirmed from HTML that the viz widget is
the live lesson.
