# Methods (`writing-methods.js`)

- **Track / Part:** Practical - Part 1 Understand the ideas
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 5
- **Runnable:** yes (compiles and runs each solution)  **Theme:** test-automation flavour (tester framing; `Status`, `Category`)

## Concept(s) taught
What a method is FOR, one small step at a time: returning a value, taking a
parameter, holding a decision rule, reusing that rule across many inputs, and
finally one method calling another. Syntax stays trivial so the focus is the
purpose of a method.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | A method hands back a result | Return a value | Make `Status()` return `"OK"`. |
| 2 | Give the method some input | Parameter | Return `"Age: " + age` from `Label(int age)`. |
| 3 | Let the method decide | A rule inside | Return `"adult"`/`"minor"` from `Category(int age)`. |
| 4 | One method, many cases | Write once, reuse | Print `Category` for 16, 18, 40 (three lines). |
| 5 | A method that uses another method | Build from small parts | `Summary` returns `"Status: " + Category(age)`. |

Grading is output-match; each starter ships a `// TODO` body that fails until
filled. These tasks carry no `requireSource` gate and no hidden `verify` probe.

## Prerequisites
Assumes `if`/comparison from Control Flow and string `+` concatenation.
Introduces `static` methods, parameters, and return values as the lesson's own
subject.

## Complexity rung
A clean, shallow climb - one new method idea per card. It is the first
write-from-scratch lesson in Part 1 and sits well after Control Flow, whose
`if` it reuses in card 3.

## Covered well
- Genuinely one idea per step, from `return` to method-calls-method.
- Plain, warm voice with the tester framing ("you ran checks like this by
  hand") that motivates why a method holds the check.
- Card 4's three-line expected output resists a single hardcoded answer.

## Gaps / issues
- **No verification gate:** cards 1-3 and 5 grade on one output line only, so a
  hardcoded literal (e.g. `return "adult";` for `Category(20)`) passes without
  the intended `if` logic. Unlike `wiring-it-up`, there is no `requireSource` or
  hidden `verify` probe to force the real rule.
- `static` is used throughout but never explained - acceptable at this level,
  but it is untaught syntax the learner must accept on faith.
- No recap/summary card.

## Verification status
Read-only content audit. Solutions are straightforward console programs; prior
work-log entries record dotnet verification of build-engine solutions.
