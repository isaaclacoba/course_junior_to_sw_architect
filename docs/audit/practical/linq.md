# LINQ (`linq.js`)

- **Track / Part:** Practical - Part 3 Know the language
- **Engine / format:** drill-engine (theory mode: quiz + fill-in-the-blank)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 7
- **Runnable:** no (pure theory, no Run button)  **Theme:** animals

## Concept(s) taught
The everyday LINQ operators as the loop-free way to query the collections from
earlier lessons: `Where`, `Count`, `Any`, `All`, `Select`, `FirstOrDefault` and
`OrderBy`. Every example queries a `List<Animal>` where each animal has `Name` and
`Legs`. Each card is a multiple-choice check first, then a fill-in-the-blank on the
same operator.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Filter with Where | Where | Quiz on what `Where` returns; fill `Where`. |
| 2 | Count what matches | Count | Quiz on the return; fill `Count`. |
| 3 | Is there at least one? Any | Any | Quiz on return type `bool`; fill `Any`. |
| 4 | Do they all match? All | All | Quiz on when `All` is true; fill `All`. |
| 5 | Transform with Select | Select | Quiz on projection; fill `Select` and `Name`. |
| 6 | Grab one safely: FirstOrDefault | FirstOrDefault | Quiz on no-match behaviour; fill `FirstOrDefault`. |
| 7 | Sort with OrderBy | OrderBy | Quiz on sort key; fill `OrderBy`. |
| 8 | LINQ recap | Recap | Summary card, no blanks (excluded from data-total). |

## Prerequisites
Opens by assuming lambdas are already known - the header comment states "The
learner has already met lambdas, so the blanks focus on which operator to reach
for." That prerequisite is now met by `lambdas.js`, which sits immediately before
this lesson. Also assumes `List<T>` and objects with properties from Collections /
Data shapes.

## Complexity rung
A gentle recognition lesson: one operator per card, no code to write. The step from
Lambdas (writing `=>` by hand in a loop) to LINQ (naming the operator that does the
loop) is small and well-motivated.

## Covered well
- Directly builds on the manual `foreach` tally from Collections and the lambda
  rules from Lambdas - card 2 explicitly calls `Count` "the whole manual tally from
  Collections, in one line."
- Two-mode cards (quiz then blank) reinforce each operator.
- Recap lists all seven operators with what each returns.

## Gaps / issues
- **Not runnable.** Unlike Collections and Errors and null (both runnable in this
  same Part), LINQ has no `runnablePrograms` and no Run button - it is pure theory.
  Running `Where`/`Select`/`Count` over the animal list would land harder.
- **Missing aggregation operators.** It omits `Sum`, `Min`, `Max`, `GroupBy` and
  `ToList` - the aggregation and materialisation half of everyday LINQ is absent.
- Snippets assume a pre-existing `animals` list that is never declared in the card
  (acceptable as display-only, but worth noting).

## Verification status
Read-only content audit (no compile). Snippets are display-only and there is no
runnable set to verify; prose and blank answers were reviewed for accuracy.
