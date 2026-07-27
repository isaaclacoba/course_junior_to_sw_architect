# Generics (`generics.js`)

- **Track / Part:** Practical - Part 3 Know the language
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 4
- **Runnable:** yes (compiles and runs each solution)  **Theme:** neutral (boxes / pairs)

## Concept(s) taught
Writing your own generic types and methods, having already used `List<T>`: a
generic class `Box<T>`, a generic method `First<T>`, a two-parameter `Pair<A, B>`,
and a generic method that returns a generic type (`Wrap<T>` returning `Box<T>`).
Each task is graded so the concept is unavoidable.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | A box for anything | Generic class | Define `Box<T>` with a constructor-set `Value`. requireSource `Box<T>`; verify re-runs with `string`. |
| 2 | A method that works on any array | Generic method | Define `First<T>(T[] items) => items[0]`. requireSource `First<...>(`; verify re-runs with strings. |
| 3 | Two types at once | Two type parameters | Define `Pair<A, B>` with `First`/`Second`. requireSource `Pair<...,...>`; verify re-runs `Pair<int,string>`. |
| 4 | Put them together | Generic method returning a generic type | Add `Wrap<T>(T item) => new Box<T>(item)`. requireSource `Wrap<...>(`; verify re-runs with `string`. |

Starters ship `// TODO` bodies; grading is output-match plus a `requireSource`
technique gate. There is no recap/summary card.

## Prerequisites
Assumes classes, constructors, properties (`{ get; }`), expression-bodied members
(`=>`), arrays and `var` (Parts 1-3). Directly builds on `List<T>` usage from
Collections; this is the lesson that finally explains the `<T>` placeholder.

## Complexity rung
A steady close to Part 3. Four cards climb from one type parameter to two, then to a
generic method that feeds its `T` into a generic type - a genuine but well-scaffolded
final step.

## Covered well
- **Every task carries a hidden `verify` probe** that re-runs the learner's type with
  a different `T` (e.g. `Box<string>`, string arrays), so a version hardcoded to
  `int` fails - the strongest grading discipline of the Part 3 build lessons.
- `example` boxes show the shape on a different subject (`Crate`, `Point`, `Picker`)
  so copying them does not produce the answer.
- Retroactively closes the "`<T>` used before taught" gap from Collections.

## Gaps / issues
- **No recap/summary card** - the only Part 3 lesson reviewed here that ends without
  one, so the four generic forms are not consolidated at the end.
- **Ordering tension:** `List<T>` and `Dictionary<TKey,TValue>` were used back in
  Collections and are relied on throughout Part 3; the explanation of type
  parameters arrives only now, at the end of the Part.
- Expression-bodied members (`=>`) and `var` are used without being formally taught.

## Verification status
Read-only content audit (no compile). Prior work-log sessions record dotnet
compile/run verification of the build solutions and their verify probes.
