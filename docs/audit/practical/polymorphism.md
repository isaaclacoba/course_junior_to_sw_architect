# Why many versions? (`polymorphism.js`)

- **Track / Part:** Practical - Part 4 Build with objects
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 5
- **Runnable:** yes (compiles and runs each solution)  **Theme:** animals (cat, dog, owl, zoo, shelter)

## Concept(s) taught
Polymorphism: replace a method full of type branches with each type carrying its
own behaviour, drive many types from one call site, loop a mixed
`List<IAnimal>`, choose the implementation at runtime, and add a type without
touching the loop. Builds on the `IAnimal` promise from Why abstract?.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | A branch for every animal | The type switch | Write `Zoo.Sound(string kind)` with `if`s for `"cat"`/`"dog"`/else. Gates: `class Zoo`, `if`. Verify asks for the dog. |
| 2 | Let each animal carry its own sound | One call, many behaviours | Write `Cat : IAnimal`, `Dog : IAnimal`; one `.Speak()` call, two results. Gates: both `: IAnimal` classes. Verify swaps the print order. |
| 3 | One loop, the whole pen | Polymorphism over a list | In `Main`, build a `List<IAnimal>` and `foreach` it. Gates: `List<IAnimal>`, `foreach`. No `verify` (logic lives in `Main`). |
| 4 | Pick the animal at runtime | Runtime selection | Write `Shelter.Adopt(string kind)` returning `IAnimal`. Gates: `class Shelter`, `IAnimal Adopt(`. Verify adopts a cat. |
| 5 | Add an animal, leave the loop alone | Open to new behaviour | Write `Owl : IAnimal` saying `"Hoot"`; list/loop unchanged. Gate: `class Owl : IAnimal`. No `verify`. |
| - | Why many versions? - recap | Recap | Summary card (not counted). |

Cards 1, 2, and 4 carry a hidden `verify` probe. Cards 3 and 5 put the logic in
a fixed `Main`, so they are gated by `requireSource` (`List<IAnimal>` + `foreach`;
`class Owl : IAnimal`) and output-match instead.

## Prerequisites
Assumes `IAnimal` and interface implementation (Why abstract?), plus
`List<T>`/`foreach` (Collections, Control Flow) used first in card 3. Card 1
reuses `if`/`string` from Control Flow.

## Complexity rung
Steady. Card 1 deliberately shows the branch-heavy "before", cards 2-5 replace it
with dispatch. The new step over Why abstract? is using the interface at scale -
a list and a runtime factory - rather than a single typed parameter.

## Covered well
- Card 1's `if`-per-kind is the honest anti-pattern the rest of the lesson cures.
- Card 5 mirrors the interfaces lesson's OCP move, reinforcing it over a loop.
- Example boxes use `IShape`/`Box`/`Ball` and a plain `List<int>`, not the answer.
- Recap contrasts the type switch with dispatch; `summaryClose` -> Inherit or compose?.

## Gaps / issues
- **SOLID mapping not stated.** Card 5 is Open/Closed and the whole lesson is the
  Liskov/substitution payoff, but no letter is named.
- `var` used untaught in most `Main` blocks.
- Cards 3 and 5 have no `verify` probe; because their `Main` is the graded
  surface, a learner who prints the expected lines directly could pass card 3
  without a real loop (the `foreach` gate reduces but does not close this).

## Verification status
Read-only content audit only (no compile). Gate patterns and probe outputs read
for consistency.
