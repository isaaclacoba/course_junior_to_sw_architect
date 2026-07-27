# Errors and null (`errors-null.js`)

> Updated 2026-07-27: retitled to **Exception handling**, the `null` card was
> removed (null is now taught in Foundations), and the whole lesson was converted
> from a fill-in-the-blank drill to a code-lab write-and-run **build** lesson
> (Monaco + Roslyn). Six tasks: try/catch, the message, finally, throw, `??`,
> `?.` (data-total 7 -> 6). The notes below predate that change.

- **Track / Part:** Practical - Part 3 Know the language
- **Engine / format:** drill-engine (runnable fill-in-the-blank)
- **Difficulty pill:** Steady  **XP cards (data-total):** 7
- **Runnable:** yes (each drill is a complete program that runs to completion)  **Theme:** animals

## Concept(s) taught
How C# handles things going wrong and values that are missing: `try`/`catch`, the
exception `Message`, `finally`, `throw`, `null`, the null-coalescing `??` and the
null-conditional `?.`. Every runnable program catches its exception, so Run always
shows real output instead of a crash.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Catch a problem | try / catch | Fill `try` and `catch` around a divide-by-zero. |
| 2 | What went wrong | The message | Fill the caught variable `e` and read `e.Message`. |
| 3 | Always clean up | finally | Fill `finally` after a `try`. |
| 4 | Raise your own | throw | Fill `throw` for a negative-argument guard. |
| 5 | Nothing there: null | null | Fill `==` in a `null` check on a `string?`. |
| 6 | A fallback with ?? | Null-coalescing | Fill `??` to supply a default. |
| 7 | Safe access with ?. | Null-conditional | Fill `?.` for safe member access. |
| 8 | Errors and null - recap | Recap | Summary card, no blanks (excluded from data-total). |

Snippets are display-only; the Run button compiles the matching `runnablePrograms`
entry (the recap entry is `null`).

## Prerequisites
Assumes `if`, arrays, methods, `int[]` and `Console.WriteLine` (Parts 1-2).
Introduces exceptions, `finally`, `throw`, `null`, nullable reference types
(`string?`, `int?`), `??` and `?.` for the first time.

## Complexity rung
A steady lesson with seven distinct tokens across two related themes (exceptions
and null). Each card is one keyword/operator, so the individual steps stay small
even though the surface is broad.

## Covered well
- Every drill runs to completion because exceptions are caught, so a beginner sees
  handled output rather than a stack trace - a good match for the topic.
- Clear split: cards 1-4 cover exceptions, cards 5-7 cover null, recap ties both.
- Blanks target exactly the new keyword/operator; hints and explanations are
  accurate.

## Gaps / issues
- Nullable reference types (`string?`) are used without discussing the nullable
  context/annotations that enable them - fine for a first look, but the `?` on a
  type is presented as settled.
- `int?` (nullable value type) in card 7 is a second, subtly different meaning of
  `?` from `string?` in cards 5-6; the distinction is not called out.
- Otherwise self-contained; recap present and forward-links to Generics.

## Verification status
Read-only content audit (no compile). `runnablePrograms` are complete, each catches
its exception; prior work-log sessions record dotnet verification of the runnable
set.
