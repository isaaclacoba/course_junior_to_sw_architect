# Refactor moves (`refactor-moves.js`)

- **Track / Part:** Practical - Part 6 Design for change
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 5
- **Runnable:** yes (compiles and runs each solution)  **Theme:** animals (cages, pets, vets, coops, zoos, pet shows)

## Concept(s) taught
Refactoring: changing the shape of code while its behaviour stays the same.
Five behaviour-preserving moves, each the concrete action a SOLID principle will
name next - encapsulate, program to an interface, inject, replace a branch with
polymorphism, split a fat class. The expected output never changes across a
drill; only the structure does.

## Card-by-card
| # | Card title | Concept | What the learner does | Gate + hidden probe |
|---|---|---|---|---|
| 1 | Move the behaviour onto the data | Encapsulation | Give `Cage(int animals, int capacity)` a constructor + private fields, move `IsFull()` onto `Cage` as an instance method; output stays `FULL`. | `requireSource`: `bool IsFull()` no-arg, `Cage(int` ctor, no `static IsFull`, no `public int Animals/Capacity`. `verify`: builds `Cage(2,5)`, expects `ROOM`. |
| 2 | Depend on the shape, not the thing | Program to an interface | Declare `IPet { string Checkup(); }`, make `Dog` implement it, have `Vet` hold an `IPet`; output stays `HEALTHY`. | `requireSource`: `interface IPet`, `Dog : IPet`, `Vet(IPet`. `verify`: injects a `Parrot`, expects `COUGH`. |
| 3 | Hand it in, don't build it in | Inject the dependency | Change `Coop` to receive an `IClock` instead of newing `SunClock`; `Main` passes `new SunClock()`; output stays `open`. | `requireSource`: `Coop(IClock`. `verify`: injects a `NightClock` (hour 20), expects `shut`. |
| 4 | Let each object answer for itself | Polymorphism | Declare `IAnimal { string Speak(); }`, write `Cat`/`Dog`, refactor `Zoo` to hold a `List<IAnimal>` with `Add`/`SpeakAll` and no `kind` checks; output stays `Meow` then `Woof`. | `requireSource`: `interface IAnimal`, `Cat : IAnimal`, `Dog : IAnimal`, `List<IAnimal>`, `Add(IAnimal`, no `kind ==`, no `switch`, calls `.Speak()`. `verify`: adds an unseen `Bird`, expects `Tweet`. |
| 5 | One class, one job | Single responsibility | Pull scoring into `Judge.Score(int,int)` and announcing into `Announcer.Announce(bool)`, give `PetShow` a constructor that receives both and delegates; output stays `GOOD DOG`. | `requireSource`: `class Judge`, `Score(int`, `class Announcer`, `Announce(bool`, `class PetShow`, `PetShow(Judge...Announcer`, calls `.Score(` and `.Announce(`. `verify`: `Run(1, 9)` expects `BAD DOG`. |
| - | Refactor moves - recap | Recap | `summary: true` card (excluded from `data-total`); names each move and ties it forward to a SOLID principle. | none |

Each starter ships a tangled-but-working program; grading is output-match plus
the `requireSource` shape gate plus a hidden `verify` probe that re-runs the
learner's classes against fresh inputs so a hardcoded answer cannot pass.

## The SOLID bridge mapping
The lesson is explicitly a bridge to Part 6's SOLID lesson. The moves map:

- Card 1 Encapsulation -> the tool SOLID's principles lean on (put state and its
  rules together).
- Card 2 Program to an interface -> the seam behind O, L, I, D.
- Card 3 Inject the dependency -> Dependency Inversion / DI (the D).
- Card 4 Replace a branch with polymorphism -> Open/Closed (the O).
- Card 5 Split a fat class -> Single Responsibility (the S).

The recap card states the thread directly: each move "turns up again in the next
part as one of the SOLID principles."

## Prerequisites
Classes, constructors, private fields, `interface`, implementing an interface,
`List<T>`, `foreach`, the ternary operator, and dependency injection as a shape -
all introduced across Part 2 (First Builds, Wiring It Up), Part 3 (Collections),
and Part 4 (encapsulation, interfaces, polymorphism, dependency-injection). This
lesson assembles those into deliberate refactors rather than teaching new syntax.

## Complexity rung
Steady, and well placed: it asks the learner to *transform* existing code rather
than write from a blank slate, which is a smaller cognitive step than First
Builds despite covering the same five ideas. It is the on-ramp to the
Challenging SOLID lesson that follows.

## Covered well
- Behaviour-preserving discipline is enforced, not just described: the visible
  output is constant while the `verify` probe changes inputs to prove the
  refactor is real.
- Each `requireSource` gate names the target shape *and* forbids the anti-pattern
  (no `static IsFull`, no `kind ==`, no `switch`), so a learner cannot pass by
  half-refactoring.
- Card 5 explicitly resists over-abstraction ("Keep `Judge` and `Announcer` as
  plain classes - an interface earns its place when you need to swap a part
  out"), matching the capstone's own restraint.
- Consistent animal theme, aligned with Part 4.
- Every card's `example` shows the technique on a different subject than the
  drill, per the authoring rules.

## Gaps / issues
- Card 4's `requireSource` forbids `switch` anywhere in the source via a negative
  lookahead on the whole file; harmless here, but a learner who legitimately used
  a `switch` elsewhere would be blocked.
- `var` and expression-bodied members appear in starters/examples; both are
  used freely by Part 6 but neither is formally taught before this point.
- The recap `summaryItems` titles carry a trailing " - " (e.g. "Put behaviour
  with its data - ") that leans on the engine to join the following text; fine
  visually, worth noting as a formatting convention rather than prose.

## Verification status
Read-only content audit (no compile performed here). The prior work-log records
dotnet compile/run verification of build-lesson solutions and `verify` probes in
earlier sessions; the `requireSource` regexes were read and match the reference
solutions.
