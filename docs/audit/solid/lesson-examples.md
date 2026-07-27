# Lesson example code - does the course practice what it preaches?

Read-only audit of the example code inside the lessons - the `starter`,
`solution`, `example`, and `snippet`/`runnablePrograms` fields in the lesson
`*.js` data files, plus the capstone `level3-exercise/*.cs`. The question: where
does the course's own code break the SOLID/OO/encapsulation ideas it teaches, in
a way that would mislead a beginner?

Files read in full: `encapsulation.js`, `interfaces.js`, `polymorphism.js`,
`composition.js`, `dependency-injection.js`, `testing-basics.js`,
`test-doubles.js`, `testable-design.js`, `refactor-moves.js`, `level2.js`,
`first-builds.js`, `reading-objects.js`, `level3-exercise/CapstoneContent.cs`,
`CapstoneExercise.cs`. Skimmed: `collections.js`, `linq.js`, `data-shapes.js`,
`generics.js`, `level1.js`, `level1-coding.js`, plus a cross-file grep for public
mutable fields and `new`-ing dependencies inside classes.

Summary up front: the Part 4/5/6 design lessons are disciplined. Every
anti-pattern in them is labelled as a "before" and fixed by a later task, with a
`requireSource` gate and a hidden `verify` probe that prove the fix is real. There
are no unframed contradictions in the design lessons themselves. The one place
worth flagging sits earlier - the Foundations lessons introduce public mutable
fields as the normal way to hold state, and the course never points back at that
once encapsulation is taught.

## Real contradictions (would mislead a learner)

### 1. Foundations model public mutable state, never revisited - `level1.js`, `level1-coding.js`

The earliest "state and behaviour" lessons present a public mutable field as the
way an object holds state, and `Main` reaches in and sets it:

- `level1.js` - `class Robot { public string Name = "Beep"; ... }`, and the drill
  `class Dog { public string Name = ""; ... }` whose gate literally requires
  `public string Name = "Rex";`.
- `level1-coding.js` - `class Thermostat { public int Temp = 0; ... }` where the
  TODO is "set `Temp` to 30", and `class Bottle { public int Fill = 0; ... }`.

The principle at stake is encapsulation. This is not framed as a "before":
nothing here or in the encapsulation lesson later says "we opened this field for
now; you will learn to close it". A beginner meets `public int Temp` as the
default shape of an object in Part 1, forms the habit, and the course corrects it
in Part 4 (`encapsulation.js` task 3, "Hide the inside") without ever
acknowledging the earlier code. It is mild - encapsulation genuinely has not been
taught yet, so the field is not contradicting a rule the learner has met - but it
is the one place where the course's own habit runs opposite to what it later
insists on, with no bridge between the two.

There are no other genuine contradictions. Everything else that models an
anti-pattern is explicitly the "before" of a fix in the same lesson.

## Intended "before" anti-patterns (acceptable, framed as such)

These deliberately show bad code, name it as the problem, and fix it in a later
task. Each is gated so the learner cannot pass by leaving the bad shape in place.

- **`encapsulation.js` - public fields on `Cat` (tasks 1-2).** `Cat` holds
  `public string Name = ""; public bool KnockedSomethingOver;` and `Main` sets
  them with an object initialiser. Task 3 ("Hide the inside") then teaches
  `private` with a guard method, and task 5 rebuilds `Cat` with a `private`
  field and a constructor. This matches the repo's own rule in `AGENTS.md` (a
  public mutable field is allowed only as an explicit "before"). One nuance: the
  `private` fix lands on new classes (`ScoreBoard`, `Bowl`) and on a later `Cat`,
  so the specific public-field `Cat` of tasks 1-2 is never itself refactored in
  front of the learner. Minor, and the lesson arc makes the intent clear.

- **`interfaces.js` task 2 - `Keeper.Greet(Cat cat)`.** A method tied to the
  concrete `Cat`. The context says outright "That is the cost of tying a method
  to one class; the next task removes it", and task 4 swaps it to `IAnimal`.

- **`polymorphism.js` task 1 - `Zoo.Sound(string kind)` with `if` per animal.**
  Named as "The type switch" and "every new animal means another `if` in here".
  Task 2 onward replaces it with `IAnimal` and one loop.

- **`composition.js` - parts built with `new` inside (`Parrot`, `Chimera`).**
  `private Megaphone _mega = new Megaphone();` etc. This is the has-a lesson;
  injecting the part behind an interface is introduced in task 5 (`ILegs`) and is
  the whole subject of the next lesson, `dependency-injection.js`.

- **`dependency-injection.js` tasks 1-2 - `new Cat()`/`new Dog()` inside
  `Keeper.Greet()`.** Titled "new it inside (the tight knot)" and "To change it,
  you must edit the keeper". Tasks 3-5 move to constructor injection and then to
  `IAnimal`.

- **`refactor-moves.js` - every task ships a tangled starter.** Public-field
  `Cage` with an external `static IsFull`, a `Vet` welded to `Dog`, a `Coop` that
  news its own clock (`private readonly IClock _clock = new SunClock();`, with the
  comment "builds its own clock, so a test cannot swap it"), a `Zoo` that branches
  on `kind`, and a `PetShow` doing two jobs. Each `requireSource` set forbids the
  old shape (for example a negative-lookahead against `kind ==` and `switch`), and
  each hidden `verify` probe re-runs the type with new inputs to prove the refactor
  is behavioural, not faked.

- **`level2.js` - the SOLID drills.** Each principle is shown as "the trap" /
  "problem version on purpose" first, then "the fix". The DIP drill's welded
  `TestRunner` (`private ConsoleReporter _reporter = new ConsoleReporter()`) is
  explicitly "the weld", fixed by injecting `IReporter`.

- **`level3-exercise/CapstoneContent.cs` - the starter `TestRunner`.** Comment in
  the code: "This works, but TestRunner does three jobs and is welded to the
  console. Refactor it step by step." The seven milestones walk SRP, DI, an
  interface seam, DIP, OCP and Liskov, and milestone 3 deliberately warns against
  reaching for an interface where a plain injected class suffices.

## Clean examples worth noting

- **`interfaces.js` / `polymorphism.js` solutions** - textbook OCP/DIP: depend on
  `IAnimal`, add `Owl` with no change to `Keeper` or the loop.

- **`reading-objects.js`** - seeds SRP and "receive, don't build" with plain
  collaborators and constructor injection, before naming any principle. `Cart`
  delegates pricing to `PriceList`; `Mailer` and `Worker` receive their
  collaborators. No public mutable state, no fat classes presented as good.

- **`first-builds.js`** - a clean five-step arc (one method -> one job ->
  inject -> depend on interface -> add a second implementation) with no
  anti-pattern left standing.

- **`testable-design.js` / `testing-basics.js`** - single-purpose classes
  (`Scorer`, `Prices`, `Adder`) and injected clocks; nothing tangled.

- **`refactor-moves.js` SRP task and capstone milestone 3** - both actively teach
  restraint: keep `Judge`/`Announcer` and the injected formatter as plain classes,
  "an interface earns its place when you need to swap a part out, and here you do
  not yet". The course avoids over-abstraction as deliberately as it teaches
  abstraction.

- **Test doubles using public fields** - `SpyMailer.WasCalled`
  (`test-doubles.js`), `SpyLog.WasCalled`, and `FakeReporter.Last` (`level2.js`)
  are `public` mutable fields. This is not an encapsulation violation: a spy/fake
  exposes what it recorded so a test can assert on it. Idiomatic, correct.

## Verdict

The course largely practices what it preaches. In the design lessons (Parts 4-6)
it is exemplary: every bad shape is named as the problem and fixed in the same
lesson, gated so the learner cannot skip the fix, and often accompanied by prose
that also warns against the opposite failure (needless interfaces). The single
item that would mislead is upstream of the principles: the Foundations lessons
(`level1.js`, `level1-coding.js`) teach public mutable fields as the ordinary way
to hold state and never close the loop once encapsulation is introduced. It is a
missing back-reference rather than a lesson that contradicts itself, but it is the
one place a beginner could carry a habit the course later spends a whole lesson
undoing.
