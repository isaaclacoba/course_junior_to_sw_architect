# Why objects? (`encapsulation.js`)

- **Track / Part:** Practical - Part 4 Build with objects
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 5
- **Runnable:** yes (compiles and runs each solution)  **Theme:** animals (cats, treats, food bowl, nine lives)

## Concept(s) taught
Encapsulation, one rung at a time: group related data in a `class`, put the
behaviour beside the data, hide a field with `private`, guard a rule from inside
the class, and keep that rule in one place. This is the "why objects at all"
lesson that opens Part 4.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Write a class to hold state | Group state | Write a `Cat` holding `Name` and `KnockedSomethingOver`; `Main` prints `Mittens: True`. Gate: `class Cat`. Verify re-runs with a different cat (`Smudge: False`). |
| 2 | Put the behaviour with the data | Behaviour with state | Add `Verdict()` returning `": guilty"`/`": innocent"` from the flag. Gate: `string Verdict(`. Verify re-runs an innocent cat. |
| 3 | Hide the inside | `private` state | Write a `ScoreBoard` with a `private` count, `Give(bool)` adding only when true, `Total()`. Gates: `class ScoreBoard`, `private`. Verify feeds a different sequence (expects `3`). |
| 4 | Guard the rule | Protect an invariant | Write a `Bowl` whose `Fill(int)` ignores amounts of 0 or less. Gates: `class Bowl`, `private`. Verify feeds different scoops (expects `150`). |
| 5 | Change it in one place | One reason to change | Write a `Cat` taking used lives in its constructor (`private` field), `LivesLeft()` returns `9 - used`. Gates: `class Cat`, `private`. Verify makes three cats (expects `9`,`0`,`5`). |
| - | Why objects? - recap | Recap | Summary card (not counted in data-total). |

Every task ships a `// TODO` starter that fails until filled, a `requireSource`
gate, and (all five) a hidden `verify` probe that re-runs the learner's own type
with different values, so a hardcoded output cannot pass.

## Prerequisites
Assumes classes, methods, return values, `bool`, `if`, and string
concatenation (Part 1 Methods / Practice the Basics, Control Flow) and the
constructor idea previewed in First Builds. Introduces `private` fields and an
invariant guard for the first time in a build.

## Complexity rung
The first rung of Part 4 and a gentle one: each card adds a single new move on
top of the previous (data -> behaviour -> hiding -> guarding -> one place to
change). Much slower than First Builds, which packed the same territory into one
lesson.

## Covered well
- One idea per card; each card's starter is the prior card's end state.
- All five cards carry a `verify` probe - the strongest grading in the set.
- Consistent animal theme; recap restates each of the five moves.
- Plain voice; the "nine lives" framing lands the SRP-style "one reason to change".

## Gaps / issues
- **SOLID mapping not stated.** The file comment and recap describe the moves
  but never name a SOLID letter, though card 5 ("one reason to change") is the
  S/single-responsibility seed. A reader gets the idea, not the label.
- `var` is used in every `Main` without having been formally taught.
- Uses `public string Name = "";` (public mutable field with a default) - a
  convention the course elsewhere flags; here it is deliberate for the first
  card, before `private` is introduced in card 3.
- No expression-bodied members (`=>`) appear - a cleaner contrast with First
  Builds, worth keeping consistent.

## Verification status
Read-only content audit only (no compile). The `verify` probes and expected
outputs were read for consistency; no dotnet run performed in this pass.
