# What a programming language is (`theory-8.viz.js`)

- **Track / Part:** Theory - Part 2 From idea to running code
- **Engine / format:** viz widget (`CodeLab.MemoryViz`, mounted by `page-shell.js` from `window.LESSON_VIZ`)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
Why we do not write raw CPU instructions: the CPU only runs tiny numeric
`machine code`; a `programming language` is human-friendly words and rules; a
tool `translates` one high-level line into many machine ops; and many languages
(C#, Python, JavaScript) target the same one machine. Opens Part 2.

## Card-by-card
One `MemoryViz` run - machine scene (board + `code` region), five steps.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | CPU runs only ones and zeros | Machine code | See the `soc` glow with a raw instruction pattern. |
| 2 | Hand-writing that is painful | Motivation | Read why nobody writes machine code by hand. |
| 3 | We write a language instead | Programming language | See a plain-English line light up in `code`. |
| 4 | A tool translates one line to many ops | Translation | Watch one line map to `-> 7 machine ops`. |
| 5 | Many languages, same machine | Languages | See different languages end at the same CPU. |

## Prerequisites
Builds directly on Part 1 (the CPU runs tiny instructions). No syntax assumed;
introduces the words `machine code`, `programming language`, `translate`.

## Complexity rung
A meta-concept lesson opening Part 2. One idea - "we write friendly code, a tool
turns it into machine code" - shown in a single clean thread. Small step.

## Covered well
- Motivates the whole part: names the problem (machine code is unwritable by
  hand) before the solution.
- The translation "one line -> many ops" is shown as a concrete count, not asserted.
- Closing "same one machine" beat sets up that language choice is secondary.

## Gaps / issues
- **Dead sibling file.** `theory-8.js` (a `DRILL_CONFIG` quiz + fill-in-the-blank
  lesson) exists but is not loaded by `theory-8.html`; only `theory-8.viz.js`
  runs. Legacy content to remove or reconcile.
- No in-lesson check (widget-only lessons award no XP and carry no quiz);
  retention rests on the Part 2 checkpoint.
- The widget names no next lesson - the drill-engine "each lesson names the
  next" hand-off is absent from the viz format; only a "Back to the course" link.

## Verification status
Read-only content audit (no compile). Confirmed from `theory-8.html` that the
viz widget is the live lesson and `theory-8.js` is not loaded.
