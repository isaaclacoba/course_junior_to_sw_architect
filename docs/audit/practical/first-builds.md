# First Builds (`first-builds.js`)

- **Track / Part:** Practical - Part 2 Build it for real
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 5
- **Runnable:** yes (compiles and runs each solution)  **Theme:** test-automation (reporters / test runner)

## Concept(s) taught
The first write-from-scratch lesson. In five steps it compresses a mini
S/O/D of SOLID: a class with one method, one job per method, constructor
injection, depending on an `interface`, and adding a new implementation without
editing the old one.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | A class with one method | Objects | Make `Greeting.Say()` return `"hello"`; `Main` prints it. |
| 2 | One method, one job | Single job | Return `"PASS"`/`"FAIL"` from `ReportFormatter.Format(bool)`. |
| 3 | Hand the work in | Inject | Store a `ReportFormatter` passed into `TestRunner`'s constructor (`private readonly`). |
| 4 | Depend on an interface | Abstraction | Declare `string Report(bool)` on `IReporter`; a class implements it. |
| 5 | Swap in a new reporter | Open to extend | Add `EmojiReporter : IReporter` returning `"OK"`/`"X"` with no edit to the old one. |

Grading is output-match; starters ship a `// TODO` body that fails until filled.
(No `requireSource`/`verify` probe visible in the data - grading is by expected
output only.)

## Prerequisites
Assumes classes, methods, return values (from Part 1 Methods / Practice the
Basics) and `bool`. Introduces `constructor`, `private readonly`, `interface`,
and implementing an interface - all used here for the first time in a build.

## Complexity rung
A real jump: it is labelled a "Bridge" (`metaLabel: "Bridge: First Builds"`) and
packs constructor injection + interfaces + OCP into five cards. This is the
early "taster" the progression audit flagged - the same ideas Part 4 later
teaches one rung at a time. It lands here before the Part 3 language surface.

## Covered well
- Clean one-idea-per-card climb from "a class" to "extend without editing".
- Each card's starting code is the previous card's end state, so the step is small.
- Explicitly names the payoff ("the same move the capstone asks for").

## Gaps / issues
- **Theme inconsistency:** uses `ReportFormatter` / `TestRunner` / `IReporter`
  (test-automation), while Part 4 was deliberately re-themed to animals. A
  learner meets reporters here, then cats/dogs for the same concepts later.
- **Ordering tension:** teaches `interface`, constructor injection and OCP in
  Part 2, but these are only reinforced much later in Part 4 / SOLID - a long
  gap with no intervening practice (noted in the prior progression audit).
- `var` and expression-bodied members (`=>`) appear without being taught.
- No hidden `verify` probe, so a hardcoded `"PASS"` string could pass cards 2-4
  without the intended structure.

## Verification status
Read-only content audit. Work-log records dotnet compile/run verification of
this lesson's solutions during earlier sessions.
