# LINQ (`linq.js`)

> Update 2026-07-27: converted from a theory drill to a write-from-scratch
> `build` lesson - the learner writes each query and runs it. The intro and
> task 1 now name the lambda link explicitly. The operators and ordering are
> unchanged from the drill version.

- **Track / Part:** Practical - Part 3 Know the language
- **Engine / format:** build-engine (write-from-scratch; requireSource gate + hidden verify probe per task)
- **Difficulty pill:** Steady  **XP cards (data-total):** 7
- **Runnable:** yes (each query is written and run through the Roslyn host)  **Theme:** animals

## Concept(s) taught
The everyday LINQ operators as the loop-free way to query the collections from
earlier lessons: `Where`, `Count`, `Any`, `All`, `Select`, `FirstOrDefault` and
`OrderBy`. Every task queries a `List<Animal>` where each animal has `Name` and
`Legs`. Each task shows a worked example on a different subject, then the learner
writes the query; grading uses a `requireSource` gate for the operator plus a
hidden `verify` probe.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Keep only what matches: Where | Where | Write `Where` with a predicate lambda to filter. |
| 2 | How many match: Count | Count | Write `Count` with a lambda to tally. |
| 3 | Is there at least one: Any | Any | Write `Any` returning a `bool`. |
| 4 | Do they all match: All | All | Write `All` returning a `bool`. |
| 5 | Turn each into something else: Select | Select | Write `Select` to project each animal to its name. |
| 6 | The first match, or nothing: FirstOrDefault | FirstOrDefault | Write `FirstOrDefault`; `Main` handles the default. |
| 7 | Sort by a key: OrderBy | OrderBy | Write `OrderBy` with a key lambda. |
| 8 | LINQ recap | Recap | Summary card, no task (excluded from data-total). |

## Prerequisites
Opens by assuming lambdas are already known - the header comment states "The
learner has already met lambdas, so the blanks focus on which operator to reach
for." That prerequisite is now met by `lambdas.js`, which sits immediately before
this lesson. Also assumes `List<T>` and objects with properties from Collections /
Data shapes.

## Complexity rung
A steady write-from-scratch lesson: one operator per task, a short query to write
each time. The step from Lambdas (writing `=>` by hand) to LINQ (passing that
lambda to an operator that does the loop) is small and well-motivated, and the
intro plus task 1 name the lambda link explicitly.

## Covered well
- Builds directly on the manual `foreach` tally from Collections and the lambda
  from Lambdas; the intro and task 1 spell out that each operator takes a lambda.
- Worked example on a different subject (`List<int>` scores) per task, so the
  learner sees the shape and still writes the animal query themselves.
- Every task gates on the operator and blocks hardcoding with a hidden probe.
- Recap lists all seven operators with what each returns.

## Gaps / issues
- **Aggregation still missing.** Even after the build conversion it omits `Sum`, `Min`, `Max`, `GroupBy` and
  `ToList` - the aggregation and materialisation half of everyday LINQ is absent.
- Snippets assume a pre-existing `animals` list that is never declared in the card
  (acceptable as display-only, but worth noting).

## Verification status
Compiled with real dotnet 2026-07-27: all seven solutions build warning-free and
match their expected output; each hidden `verify` probe passes with different
data; starters do not pre-pass; every `requireSource` gate holds. Headless render
confirmed the build card and the recap card with no `undefined`.
