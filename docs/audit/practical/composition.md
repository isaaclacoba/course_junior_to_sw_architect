# Inherit or compose? (`composition.js`)

- **Track / Part:** Practical - Part 4 Build with objects
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 5
- **Runnable:** yes (compiles and runs each solution)  **Theme:** animals (dog, parrot, chimera, legs)

## Concept(s) taught
When to inherit and when to compose: a true `is-a` inheritance, the "is-a lie"
(hold a part instead), C#'s one-base-class limit, delegating to several held
parts, and swapping a part behind an interface. This is the lesson that hands
into dependency injection.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Inherit when it is truly is-a | `is-a` reuse | Write `Dog : Animal` adding `Fetch()`; `Breathe()` comes for free. Gate: `class Dog : Animal`. No `verify`. |
| 2 | The is-a lie | has-a over is-a | Write a `Parrot` that holds a `Megaphone` part and boosts a constructor word. Gates: `class Parrot`, `Megaphone <field>`. Verify uses a different word (`BYE`). |
| 3 | You cannot inherit three | One base class only | Write a `Chimera` holding `Wings`, `Fins`, `Paws`; `Go()` uses the wings. Gates: `class Chimera`, `Wings`, `Fins`, `Paws` fields. No `verify`. |
| 4 | Combine the parts | Delegate to each part | Write `Chimera.Show()` joining all three parts' moves. Gates: `class Chimera`, `.Fly`, `.Swim`, `.Run`. No `verify`. |
| 5 | Swap a part, leave the rest | Composition is flexible | Write `CheetahLegs : ILegs`; `Chimera` takes `ILegs` in its constructor. Gate: `class CheetahLegs : ILegs`. Verify hands in `DogLegs` (`running`). |
| - | Inherit or compose? - recap | Recap | Summary card (not counted). |

Cards 2 and 5 carry a hidden `verify` probe. Cards 1, 3, and 4 rely on
`requireSource` shape gates plus output-match; card 4's gates check that each
part method (`.Fly`/`.Swim`/`.Run`) is actually called rather than the string
hardcoded.

## Prerequisites
Assumes classes, methods, constructors, `private readonly`, and interfaces
(Why abstract?). This is the first build lesson to teach base-class
**inheritance** (`: Animal`) directly - the concept was previewed in Reuse
Without Regret but is exercised here. Uses `string.ToUpper()` in a given class.

## Complexity rung
Steady, and the densest Part 4 lesson: it introduces inheritance, contrasts it
with composition, hits the one-base-class limit, and ends on interface-based
part-swapping (constructor injection). The step over polymorphism is conceptual -
choosing between two reuse mechanisms rather than applying one.

## Covered well
- Card 1 grants a real `is-a` before card 2 exposes the lie - honest ordering.
- The chimera makes the one-base-class limit concrete and memorable.
- Card 5 previews DI (constructor + `ILegs`) so the next lesson lands softly.
- Example boxes use unrelated subjects (`Singer`/`Mic`, `Car`/`Engine`).

## Gaps / issues
- **SOLID mapping not stated.** The lesson is the Liskov/"favour composition"
  message, but no SOLID letter is named in the file.
- `var`, `private readonly`, and `.ToUpper()` all appear without a prior formal
  lesson (readable in context, but untaught tokens).
- Cards 1, 3, 4 have no `verify` probe; card 3's fixed `Main` and shape gates
  carry the grade, so a partial `Chimera` that only implements `Go()` still
  passes card 3 (intended - `Show()` is card 4's job).

## Verification status
Read-only content audit only (no compile). Gates and probe outputs read for
internal consistency.
