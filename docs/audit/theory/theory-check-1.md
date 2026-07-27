# Part one checkpoint (`theory-check-1.js`)

- **Track / Part:** Theory - Part 1 What a computer really is (checkpoint)
- **Engine / format:** checkpoint (`CodeLab.Quiz`, mounted by `page-shell.js` from `window.QUIZ_CONFIG`)
- **Difficulty pill:** Checkpoint  **XP cards (data-total):** 1
- **Runnable:** no (multiple-choice assessment)  **Theme:** neutral

## Concept(s) taught
Nothing new - a graded review of Part 1: program, CPU, time-sharing, cores, bits,
byte, encoding, files, operating system. Draws 5 questions from a 9-question bank,
shuffles options, and awards 40 XP once on a pass (4 of 5, `passRatio` 0.7). Retry
draws a fresh set.

## Card-by-card
Single `CodeLab.Quiz` component. Bank of 9 scenario-based questions, one per Part 1
concept, each with a `why` explanation shown after grading.

| Concept | Stem framing |
|---|---|
| Program | Double-clicking an app hands the CPU an ordered list of instructions. |
| CPU | "One thing at a time" means one instruction after another, fast. |
| Time-sharing | One core appears to run two apps by switching thousands of times a second. |
| Cores | Four cores allow real at-once running. |
| Bits | A bit is a single 0-or-1 value. |
| Byte | A byte (8 bits) holds 256 values. |
| Encoding | A photo is stored as per-pixel colour numbers. |
| Files | A file is a named bundle of bytes on storage. |
| Operating system | The OS turns raw storage into files and folders. |

## Prerequisites
All of Part 1: [theory-1.md](theory-1.md) through [theory-7.md](theory-7.md). No
new material.

## Complexity rung
Assessment, not instruction. Sits at the end of Part 1 and gates the sense of
progress before Part 2; `nextHref` points to `theory-8.html` ("Continue to Part two").

## Covered well
- One question per Part 1 concept, so coverage of the Part is complete.
- Scenario stems with plausible distractors rather than obviously wrong options.
- Random draw + option shuffle + fresh-set retry discourage rote answer memorisation.
- Per-answer `why` turns a wrong pick into a short re-teach.

## Gaps / issues
- Bank draws 5 of 9, so on any single attempt roughly four Part 1 concepts go
  unassessed - acceptable for a light checkpoint, but a learner could pass without
  being tested on, for example, encoding or the scheduler.
- No open-response or applied item - recognition only, which is appropriate for
  this no-code track.

## Verification status
Read-only content audit (no compile). Answer keys (`correct` indices) were reviewed
against the stems for accuracy. Confirmed from HTML that the `CodeLab.Quiz`
component is the live lesson.
