# Part three checkpoint (`theory-check-3.js`)

- **Track / Part:** Theory - Part 3 How software runs and connects (checkpoint)
- **Engine / format:** checkpoint quiz (`window.QUIZ_CONFIG`, `CodeLab.Quiz`; draw / shuffle / grade owned by the component)
- **Difficulty pill:** Checkpoint  **XP cards (data-total):** 1
- **Runnable:** no (multiple-choice quiz)  **Theme:** neutral

## Concept(s) taught
No new material - reviews Part 3: where data lives (RAM, stack, heap), value vs
reference types and copying, compile time vs run time and build errors,
cross-compilation, persistence to files, inodes and links, and request/response
plus APIs. Draws 5 questions from a 14-question bank; pass at 4/5 (`passRatio`
0.7) awards 40 XP once via `theory_check_3_awarded`.

## Card-by-card
Single quiz screen; the component draws `askCount` 5 from the bank below.

| Bank concept | Reviews lesson |
|---|---|
| Where data lives (RAM) | [theory-15.md](theory-15.md) |
| The stack | [theory-15.md](theory-15.md) |
| The heap | [theory-15.md](theory-15.md) |
| Value vs reference types | [theory-16.md](theory-16.md) |
| Copying a reference | [theory-16.md](theory-16.md) |
| Copying a value | [theory-16.md](theory-16.md) |
| Compile time | [theory-17.md](theory-17.md) |
| Build errors | [theory-17.md](theory-17.md) |
| Cross-compilation | [theory-17.md](theory-17.md) |
| Persistence | [theory-18.md](theory-18.md) |
| Files and inodes | [theory-18.md](theory-18.md) |
| Links | [theory-18.md](theory-18.md) |
| Request and response | [theory-19.md](theory-19.md) |
| APIs | [theory-19.md](theory-19.md) |

Each question carries a `stem`, four plain `options`, a `correct` index, and a
`why` explanation. `nextHref` is `theory-21.html` - matching the live path order
where Part 4 opens with "Standing on other code" before "How code is shared".

## Prerequisites
All five Part 3 lessons ([theory-15.md](theory-15.md) through
[theory-19.md](theory-19.md)). Assumes nothing new.

## Complexity rung
Review only. A 14-question bank covering five lessons is thorough, and the
random 5-draw with retry encourages repeat passes.

## Covered well
- Every Part 3 lesson maps to at least two bank questions - even coverage.
- `why` text teaches on a wrong answer rather than only marking it.
- Source comment enforces plain options (no emphasis that would leak the answer).
- `nextHref` correctly routes to `theory-21.html`, honouring the t21-before-t20
  path order.

## Gaps / issues
- Intro says "Score four or more to pass" while `passRatio` 0.7 of 5 rounds to 4
  - consistent, but the two representations must stay in sync if `askCount`
  changes.
- No issues of ordering or coverage found.

## Verification status
Read-only content audit (no compile). Answer keys and `why` text reviewed for
accuracy against the Part 3 lessons.
