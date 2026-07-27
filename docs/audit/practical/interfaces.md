# Why abstract? (`interfaces.js`)

- **Track / Part:** Practical - Part 4 Build with objects
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 5
- **Runnable:** yes (compiles and runs each solution)  **Theme:** animals (cat, dog, owl, keeper)

## Concept(s) taught
Interfaces: two classes with the same shape, the cost of depending on a concrete
type, naming the shared promise with `interface`, programming to the interface,
and adding a new type without touching the caller. The abstraction rung of
Part 4.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Two animals, same shape | A shared shape | Write `Cat` and `Dog`, each with `Speak()`. Gates: `class Cat`, `class Dog`. Verify prints them in the other order. |
| 2 | A keeper stuck on one animal | Concrete dependency | Write `Keeper.Greet(Cat cat)` returning `"heard: " + cat.Speak()`. Gates: `class Keeper`, `cat.Speak(`. No `verify`. |
| 3 | Name the promise | Define an interface | Write `interface IAnimal` and `Cat : IAnimal`, `Dog : IAnimal`. Gates: `interface IAnimal`, both `: IAnimal` classes. Verify holds a `Cat` in `IAnimal`. |
| 4 | Depend on the promise, not the animal | Program to an interface | Change `Greet` to take `IAnimal`. Gates: `class Keeper`, `Greet( IAnimal`. Verify greets a `Cat`. |
| 5 | A new animal walks in for free | Open to new types | Write `Owl : IAnimal` saying `"Hoot"`; the finished `Keeper` is unchanged. Gate: `class Owl : IAnimal`. No `verify`. |
| - | Why abstract? - recap | Recap | Summary card (not counted). |

Cards 1, 3, and 4 carry a hidden `verify` probe; cards 2 and 5 rely on
`requireSource` plus output-match (their `Main`/collaborator is fixed, so the
probe would add little).

## Prerequisites
Builds directly on Why objects? (classes, methods). Assumes the concrete
`Keeper.Greet(Cat)` from card 2 before the `interface` keyword arrives in card 3.
Introduces `interface`, `: IAnimal` implementation, and holding an object in an
interface-typed variable for the first time.

## Complexity rung
A steady climb: card 2 deliberately builds the pain (a method welded to `Cat`)
so card 3-4 resolve it. One new idea per card. The step from Why objects? is the
jump from a single class to a promise shared across classes.

## Covered well
- The card-2 "stuck on one animal" pain sets up the interface cleanly.
- Example boxes use a different subject (`IShape`/`Box`, `IShape`/`Stage`) than
  the exercise, per the authoring rule.
- Card 5 is a clean Open/Closed demonstration: new type, unchanged caller.
- Recap names each move; `summaryClose` points to polymorphism.

## Gaps / issues
- **SOLID mapping not stated.** Card 4 (depend on the promise) and card 5 (new
  type for free) are the I and O of SOLID, but no letter is named.
- `var` used untaught in several `Main` blocks.
- Cards 2 and 5 lack a `verify` probe; a solution that hardcodes the exact
  expected string could pass those two on output alone (mitigated by the fixed
  `Main` and the `requireSource` shape gates).

## Verification status
Read-only content audit only (no compile). Gates and probe expectations were
read for internal consistency.
