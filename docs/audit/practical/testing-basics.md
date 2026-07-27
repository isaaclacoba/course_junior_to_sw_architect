# What a test is (`testing-basics.js`)

- **Track / Part:** Practical - Part 5 Prove it works
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 4
- **Runnable:** yes (compiles and runs each solution)  **Theme:** test-automation (dog test, adder, gate)

## Concept(s) taught
What a test actually is: Arrange-Act-Assert, asserting the exact result, a
reusable assertion helper, and expecting a throw on purpose. The opening lesson
of Part 5, cashing in the `ToyDog` stand-in from dependency injection.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Arrange, Act, Assert | What a test is | In `Main`, arrange a `Dog`, act with `Speak()`, print `PASS`/`FAIL`. Gates: `.Speak(`, `PASS`. No `verify`. |
| 2 | Check the exact result | A real assertion | Call `Add(2, 3)` and assert `== 5`. Gates: `Add(2, 3)`, `== 5`. No `verify`. |
| 3 | A reusable assert | Assertion helper | Write `AssertEqual(int actual, int expected)` and call it. Gate: `AssertEqual(`. No `verify`. |
| 4 | Expect it to fail | Testing errors | Call `Enter(-1)` in a `try`; `catch` prints `PASS`. Gates: `try`, `catch`. No `verify`. |
| - | What a test is - recap | Recap | Summary card (not counted). |

Unlike the Part 4 build lessons, **no card carries a hidden `verify` probe**.
Grading is `requireSource` shape gates plus output-match; the tasks themselves
produce a fixed `PASS`, so the gate keywords (`try`/`catch`, `AssertEqual(`,
`== 5`) are what confirm the technique.

## Prerequisites
Assumes classes/methods, `bool`, and comparison. Card 1 uses the ternary `?:`;
card 3 introduces a `static` helper method; card 4 assumes `try`/`catch`/`throw`
and `ArgumentException` (Errors and null, Part 3). Injection (Part 4) motivates
the "run your code and check it" framing.

## Complexity rung
Steady, and the gentlest possible entry to testing: each card is one new testing
idea on plain C# the learner already writes. The step from Part 4 is a change of
purpose - code that checks other code - not new language surface, apart from the
`static` helper and ternary.

## Covered well
- Frames a test as "ordinary code", removing the mystique - matches the recap.
- AAA is shown as literal `// Arrange / Act / Assert` comments in the solution.
- Card 4 teaches that a thrown error can be the passing result - often skipped.
- Example boxes use unrelated subjects (`Box`, `cart.Total`, `account.Withdraw`).

## Gaps / issues
- **No `verify` probes anywhere.** Because each task's correct output is a fixed
  `PASS`, a learner could satisfy the output and gates without a genuinely
  correct assertion (e.g. printing `PASS` unconditionally in card 1 alongside a
  `.Speak()` call). The gates narrow this but do not fully close it.
- `var`, `static` (card 3's helper), and the ternary `?:` are used without a
  dedicated prior lesson.
- Theme switches to test-automation after Part 4's animals; card 1 reuses `Dog`,
  softening the jump, but the surrounding subjects (`Adder`, `Gate`) are new.

## Verification status
Read-only content audit only (no compile). Gate patterns and expected outputs
read for consistency.
