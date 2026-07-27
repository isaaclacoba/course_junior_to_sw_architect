# Testable by design (`testable-design.js`)

- **Track / Part:** Practical - Part 5 Prove it works
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 3
- **Runnable:** yes (compiles and runs each solution)  **Theme:** test-automation / neutral (notifier, scorer, prices)

## Concept(s) taught
The habits that make code easy to test are the habits behind SOLID: inject
dependencies so they can be substituted, give a class one job, and keep it free
of hidden state (input in, output out). The bridge lesson from Part 5 into
"Design for change".

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Inject so you can substitute | Testable dependencies | Write `Notifier(IClock)` whose `Ping()` returns `"early"`/`"late"`; inject a fixed clock. Gate: `Notifier( IClock`. No `verify`. |
| 2 | One job, one easy test | Single responsibility | Write `Scorer.Score(int hits, int misses)` returning `hits - misses`; check `Score(5, 2) == 3`. Gates: `class Scorer`, `Score( int`. No `verify`. |
| 3 | No hidden state to trip on | Pure and predictable | Write `Prices.Discount(int price, int percent)` returning `price - price * percent / 100`; check `Discount(100, 10) == 90`. Gates: `class Prices`, `Discount( int`. No `verify`. |
| - | Testable by design - recap | Recap | Summary card (not counted). |

No hidden `verify` probes; grading is `requireSource` shape gates plus a
`PASS`/`FAIL` output-match driven by a fixed assertion in `Main`.

## Prerequisites
Assumes injection and interfaces (Why inject?), single-responsibility intuition
seeded in Why objects? card 5, and the AAA/`PASS`/`FAIL` pattern from What a test
is. Card 3 uses integer arithmetic and operator precedence.

## Complexity rung
Steady and short (three cards), each a self-contained habit. Lighter than the
Part 4 lessons; its job is to name the through-line ("testable = changeable")
rather than introduce new machinery. The step is synthesis, not new syntax.

## Covered well
- Explicitly frames the three habits as the shape SOLID will formalise; the
  `summaryClose` hands directly into Design for change.
- Each card isolates one habit with a single, checkable method - matching its own
  "one job, one easy test" message.
- Example boxes use unrelated subjects (`Report`/`IClock`, `Tally`, `Mix`).
- Prose is clean (the earlier stray `*emphasis*` markers were removed).

## Gaps / issues
- **SOLID letters implied, not enumerated.** It names single responsibility and
  the SOLID connection in the recap but does not map each card to its letter
  (S / D), leaving the tie to Part 6 to make explicit.
- **No `verify` probes.** Each task's correct output is a fixed `PASS`, so a
  learner who hardcodes the compared value could pass; the shape gates narrow but
  do not close this.
- `var`, the ternary `?:`, and `private readonly` are used untaught.

## Verification status
Read-only content audit only (no compile). Gate patterns and expected outputs
read for consistency.
