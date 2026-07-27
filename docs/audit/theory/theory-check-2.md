# Part two checkpoint (`theory-check-2.js`)

- **Track / Part:** Theory - Part 2 From idea to running code (checkpoint)
- **Engine / format:** checkpoint quiz (`CodeLab.Quiz`, driven by `window.QUIZ_CONFIG`)
- **Difficulty pill:** Checkpoint  **XP cards (data-total):** 1
- **Runnable:** no (multiple-choice quiz, no Run button)  **Theme:** neutral

## Concept(s) taught
No new concept - a mixed review of Part 2. A bank of ten questions covers
languages, high vs low level, variables, assignment, types, type checking,
statements and expressions, decisions, functions, and bugs. Five are drawn per
attempt (`askCount: 5`), shuffled fresh on retry.

## Card-by-card
Single `CodeLab.Quiz` surface. Draws 5 of 10 bank questions; pass at
`passRatio: 0.7` (four or more correct) awards `awardAmount: 40` XP once via
`awardedKey: theory_check_2_awarded`. On pass, hands off to `theory-15.html`
("Continue to Part three").

| Bank topic | Maps to lesson | Correct-answer idea |
|---|---|---|
| Languages | [theory-8.md](theory-8.md) | A language is human-friendly; a tool translates it to CPU instructions. |
| High vs low level | [theory-8.md](theory-8.md) | One high-level line becomes many machine instructions. |
| Variables | [theory-9.md](theory-9.md) | A named slot in memory that holds a value. |
| Assignment | [theory-9.md](theory-9.md) | A new value replaces the old one. |
| Types | [theory-10.md](theory-10.md) | The type decides which operations are allowed. |
| Type checking | [theory-10.md](theory-10.md) | The compiler catches a mismatch before it runs. |
| Statements & expressions | [theory-11.md](theory-11.md) | An expression produces a value. |
| Decisions | [theory-12.md](theory-12.md) | `if`/`else` chooses a path from a yes/no condition. |
| Functions | [theory-13.md](theory-13.md) | A call pushes a frame holding its locals. |
| Bugs | [theory-14.md](theory-14.md) | A build-and-run-but-wrong result is a logic error. |

## Prerequisites
All of Part 2 (theory-8 through theory-14). Each bank question has a one-line
`why` explaining the answer, so it doubles as a light reteach.

## Complexity rung
Review-only, no new load. One question per Part 2 lesson keeps coverage even; the
5-of-10 draw and reshuffle-on-retry discourage rote answer memorisation.

## Covered well
- Bank coverage is complete: every Part 2 lesson is represented by at least one
  question, and the two densest topics (languages, types) get two.
- Every question carries a `why`, turning a wrong answer into a short reteach.
- Randomised draw plus retry means a pass reflects understanding, not recall of a
  fixed set.

## Gaps / issues
- The distractors are mostly easy to eliminate (e.g. "The CPU understands English
  directly"), so the check leans recognition-easy for a checkpoint - acceptable
  for the very-junior audience but worth noting.
- Functions (theory-13) was the densest lesson yet gets a single question, same
  weight as lighter topics; the frame/local/return cluster is under-probed.

## Verification status
Read-only content audit (no compile). Confirmed from `theory-check-2.html` that
`theory-check-2.js` (the `QUIZ_CONFIG` bank) is the loaded data file and drives
`CodeLab.Quiz`.
