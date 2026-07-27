# Lambdas (`lambdas.js`)

- **Track / Part:** Practical - Part 3 Know the language
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 4
- **Runnable:** yes (compiles and runs each solution)  **Theme:** animals

## Concept(s) taught
A junior's first contact with lambdas: a tiny function with no name stored in a
variable (`=>`), used as a yes/no rule over a list, and - the part a named method
cannot do - reading (capturing) the locals around it, including baking in a value
to configure a step. It is placed immediately before LINQ because every LINQ
operator takes a lambda.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Store it once, call it twice | Reuse a stored function | Store `addLeg = (int legs) => legs + 1`; print two calls. requireSource `var`, `=>`, `+ 1`. |
| 2 | Run a rule over a list | Apply a yes/no rule | Store `isFourLegged` (`== 4`); `foreach`-count matches. requireSource `var`, `== 4`, `for(each)`. |
| 3 | A rule that reads a local | Capture | Store `enough` reading local `minLegs`; count matches. requireSource `=> ... minLegs`, `for(each)`. |
| 4 | Configure a step, then run it | Capture to configure | Store `reward = score + bonus` reading local `bonus`; print each total. requireSource `=> ... bonus`, `for(each)`. |
| 5 | Why care about lambdas? - recap | Recap | Summary card, no task (excluded from data-total). |

Starters leave the `Main` body empty with a `// TODO`; grading is output-match
plus `requireSource` gates. Worked `example` boxes use numbers/prices, a different
subject than the animal exercise.

## Prerequisites
Assumes `var`, arrays, `foreach`, `if`, comparison and arithmetic (Part 1). This is
the first lesson to teach the `=>` lambda form and capture. It intentionally avoids
`Func<>`/`Action<>` and `Array.Find`.

## Complexity rung
A steady step that owns one syntax family. The four cards climb: store -> run a
rule -> capture a local -> capture to configure, one new idea each.

## Covered well
- Fills the biggest historical hole: lambdas were used in LINQ but never taught.
  This lesson now teaches `=>` and capture directly, and sits **before** `linq.js`.
- Capture (card 3) is motivated by contrast with a named method, which is the real
  reason to prefer a lambda.
- `requireSource` gates force the actual technique (a `=>` reading the named local),
  not just a matching output.

## Gaps / issues
- No hidden `verify` probe on any task - grading is `requireSource` regex plus a
  fixed expected output, so a solution that happens to print the right lines while
  side-stepping the intended shape is caught only by the regex.
- `var` is relied on throughout (the lesson notes this on purpose to avoid
  `Func<>`), but `var` itself is still not formally taught anywhere earlier.
- No recap consolidation of the `=>` syntax beyond the summary card's bullets.

## Verification status
Read-only content audit (no compile). Prior work-log sessions record the lambdas
rework and dotnet verification of the build solutions.
