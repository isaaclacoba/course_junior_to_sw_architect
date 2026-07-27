# Part four checkpoint (`theory-check-4.js`)

- **Track / Part:** Theory - Part 4 The development world (checkpoint; last checkpoint of the theory track)
- **Engine / format:** checkpoint quiz (`window.QUIZ_CONFIG`, `CodeLab.Quiz`; draw / shuffle / grade owned by the component)
- **Difficulty pill:** Checkpoint  **XP cards (data-total):** 1
- **Runnable:** no (multiple-choice quiz)  **Theme:** neutral

## Concept(s) taught
No new material - reviews Part 4: libraries, the standard library, packages, the
package manager, dependencies, version control, commits, history, and
collaboration. Draws 5 questions from a 9-question bank; pass at 4/5 (`passRatio`
0.7) awards 40 XP once via `theory_check_4_awarded`. `nextHref` is `index.html`
- the track ends here.

## Card-by-card
Single quiz screen; the component draws `askCount` 5 from the bank below.

| Bank concept | Reviews lesson |
|---|---|
| Libraries | [theory-21.md](theory-21.md) |
| Standard library | [theory-21.md](theory-21.md) |
| Packages | [theory-21.md](theory-21.md) |
| Package manager | [theory-21.md](theory-21.md) |
| Dependencies | [theory-21.md](theory-21.md) |
| Version control | [theory-20.md](theory-20.md) |
| Commits | [theory-20.md](theory-20.md) |
| History | [theory-20.md](theory-20.md) |
| Collaboration | [theory-20.md](theory-20.md) |

Each question carries a `stem`, four plain `options`, a `correct` index, and a
`why` explanation.

## Prerequisites
Both Part 4 lessons - [theory-21.md](theory-21.md) (Standing on other code) and
[theory-20.md](theory-20.md) (How code is shared). Assumes nothing new.

## Complexity rung
Review only. A 9-question bank over two lessons is proportionate; the random
5-draw with retry supports repeat passes.

## Covered well
- Balanced: five bank questions map to lesson 21, four to lesson 20 - both
  lessons well covered.
- `why` text teaches on a wrong answer rather than only marking it.
- Correctly routes back to `index.html` as the final track step.

## Gaps / issues
- Intro says "Score four or more to pass" while `passRatio` 0.7 of 5 rounds to 4
  - consistent, but the two must stay in sync if `askCount` changes.
- The bank references only the two Part 4 lessons in path order (21 then 20); no
  ordering or coverage problem, but the underlying file numbering still runs
  backwards relative to the taught order (see the lesson reports).

## Verification status
Read-only content audit (no compile). Answer keys and `why` text reviewed for
accuracy against the Part 4 lessons.
