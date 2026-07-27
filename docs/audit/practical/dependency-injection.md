# Why inject? (`dependency-injection.js`)

- **Track / Part:** Practical - Part 4 Build with objects
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 5
- **Runnable:** yes (compiles and runs each solution)  **Theme:** animals (cat, dog, keeper, toy dog)

## Concept(s) taught
Dependency injection: the tight knot of `new`-ing a dependency inside a class,
the pain when it must change, receiving it through the constructor, depending on
an interface instead of a concrete type, and handing in a stand-in double. The
last Part 4 lesson; it closes with the stand-in that opens Part 5.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | new it inside (the tight knot) | Self-made dependency | Write `Keeper.Greet()` that `new Cat()`s inside. Gates: `class Keeper`, `new Cat(`. No `verify`. |
| 2 | To change it, you must edit the keeper | Hardwired dependency | Same shape, now `new Dog()` inside - shows the cost. Gates: `class Keeper`, `new Dog(`. No `verify`. |
| 3 | Hand it in through the constructor | Constructor injection | Write `Keeper(Dog)` stored in a field, used in `Greet()`. Gates: `class Keeper`, `Keeper( Dog`. No `verify`. |
| 4 | Inject the promise, not the animal | Depend on an interface | Change the constructor to take `IAnimal`. Gates: `class Keeper`, `Keeper( IAnimal`. Verify injects a `Dog` (`Woof`). |
| 5 | Hand in a stand-in | Swap in a double | Write `ToyDog : IAnimal` saying `"squeak"`; `Main` checks the keeper used it (`rehearsal ok`). Gate: `class ToyDog : IAnimal`. Verify checks `Greet()` returns `squeak`. |
| - | Why inject? - recap | Recap | Summary card (not counted). |

Cards 4 and 5 carry a hidden `verify` probe. Cards 1-3 rely on `requireSource`
(including the `new Cat(` / `new Dog(` / `Keeper( Dog` shape) plus output-match;
their point is the deliberate "before", so the probe is not needed.

## Prerequisites
Assumes constructors, `private readonly` fields, interfaces and implementation
(Why abstract?), and the constructor-injection preview from Inherit or compose?
card 5. Card 5's `Main` uses a ternary (`?:`) to print `rehearsal ok`.

## Complexity rung
Steady. A clean five-step narrative from anti-pattern to injected double, each
card one edit beyond the last. The step over composition is naming and isolating
the pattern that card 5 of that lesson already used.

## Covered well
- Cards 1-2 build the pain (welded dependency) before cards 3-5 relieve it.
- The `ToyDog` stand-in in card 5 is a deliberate bridge; `summaryClose`
  explicitly hands into Part 5 ("now use it to actually test").
- Example boxes use unrelated subjects (`Hammer`, `Drill`, `IInstrument`).
- Recap names each move and ties back to "open to change and easy to test".

## Gaps / issues
- **SOLID mapping not stated.** This is the D (dependency inversion) of SOLID and
  the file comment says it "sets up SOLID", but no letter is named.
- `var`, `private readonly`, and the ternary `?:` (card 5) are used without a
  prior formal lesson.
- Cards 1-3 have no `verify` probe; because their intended output is a single
  fixed word (`Meow`/`Woof`), a hardcoded return could pass them (acceptable -
  they are the "before" the lesson is dismantling).

## Verification status
Read-only content audit only (no compile). Gate patterns and probe outputs read
for internal consistency.
