# Collections (`collections.js`)

- **Track / Part:** Practical - Part 3 Know the language
- **Engine / format:** drill-engine (runnable: quiz-free fill-in-the-blank + Run)
- **Difficulty pill:** Steady  **XP cards (data-total):** 7
- **Runnable:** yes (each drill ships an index-aligned complete program)  **Theme:** animals

## Concept(s) taught
The everyday container types: `List<T>` (create, `Add`, `Count`, index, `foreach`),
a list of your own objects, and `Dictionary<TKey, TValue>` (store, look up,
`ContainsKey`). It deliberately shows the manual `foreach`-and-count tally so the
later LINQ lesson can replace it in one line.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Make a list | A growable list | Fill `string` type arg and `Count` on a `List<string>`. |
| 2 | Walk a list with foreach | Visit each item | Fill the collection name and loop variable in a `foreach`. |
| 3 | Read by position | Index into a list | Fill index `0` and the `Count - 1` offset for the last item. |
| 4 | A list of your own objects | A list of objects | Fill `Cat` type arg and the `bool` field name read per item. |
| 5 | Look up by key | Dictionary lookup | Fill the `int` value type and the string key to read. |
| 6 | Check before you read | Safe lookup | Fill `ContainsKey` and the not-found fallback string. |
| 7 | Count what matches | Tally a list | Fill `++` and `Count` in a manual `foreach` tally. |
| 8 | Collections recap | Recap | Summary card, no blanks (excluded from data-total). |

Each drill is display-only in the snippet; the Run button compiles the matching
entry in `runnablePrograms`.

## Prerequisites
Assumes `var`, `foreach`, `if`, `bool`, classes with fields, and arrays (Part 1
Control Flow / Reading Objects). `List<T>`/`Dictionary<TKey,TValue>` angle-bracket
generics are introduced here as usage, before the Generics lesson formally
teaches type parameters.

## Complexity rung
First lesson of Part 3. A steady step: one container operation per card, building
from a bare list to a dictionary with a guarded lookup and a manual tally.

## Covered well
- One idea per card, each snippet targeting exactly the new token.
- The manual tally in card 7 is set up on purpose as the "before" LINQ improves.
- Runnable, so the learner sees `2`, the roll call, `4` legs, etc. actually print.
- Recap card closes the set and points forward to data shapes.

## Gaps / issues
- **Fields-vs-properties convention:** `Cat` uses public fields
  (`public string Name = "";` and `public bool KnockedSomethingOver;`), not
  `{ get; set; }` properties. Properties are only introduced later in Data shapes,
  so this lesson models the field style that the encapsulation lessons later argue
  against.
- **Generics used before taught:** `List<T>` / `Dictionary<TKey,TValue>` angle
  brackets appear here; the Generics lesson that explains `<T>` comes at the end of
  Part 3.
- `var` is used throughout without being formally introduced.

## Verification status
Read-only content audit (no compile). `runnablePrograms` are complete programs
index-aligned to the drills; prior work-log sessions record dotnet verification of
this lesson's runnable set.
