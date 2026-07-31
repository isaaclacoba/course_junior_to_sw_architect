# Practice the Basics (`level1-coding.js`)

> Rewritten 2026-07-27: replaced the OO-vocabulary fill-in-the-blank drills with a
> code-lab write-and-run `build` lesson that bridges Foundations to Control Flow -
> arithmetic, string concatenation, comparisons to a `bool`, and an object that
> answers a yes/no question about its own state. The premature OO design content
> (encapsulation/polymorphism/inheritance/composition/DI) is gone; those are
> taught in Part 4. The notes below describe the earlier version.
>
> Follow-up 2026-07-31: because of that rewrite, the "drill 10 difficulty spike"
> (cross-cutting item 8) no longer exists - the lesson is now four single-idea
> tasks. Item 8 is closed for this lesson.

- **Track / Part:** Practical - Part 1 Understand the ideas
- **Engine / format:** drill-engine (fill-in-the-blank) with per-drill Run button
- **Difficulty pill:** Gentle  **XP cards (data-total):** 10
- **Runnable:** yes (each drill has an index-aligned complete program)  **Theme:** mixed (door, `Counter`, `Animal`/`Dog`/`Cat`, `Vehicle`/`Car`, `ILogger`, `Notification`)

## Concept(s) taught
The hands-on counterpart to `Foundations`. The same ten ideas - state,
behaviour, class/object, reference assignment, encapsulation, polymorphism,
inheritance, composition, dependency injection - are each turned into a
one- or two-blank drill, ending with a full multi-concept synthesis program.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Model State With Variables | State as data | Fill `true` for a boolean door. |
| 2 | Behavior As Transformation | Function rule | Return `value * 2` from `Double`. |
| 3 | Instantiate A Class | Blueprint vs instance | Fill `Counter` and `Increment`. |
| 4 | Reference Assignment | Reference copy | Assign `user` to a second variable. |
| 5 | Encapsulation Accessor | Controlled read | Name the getter `GetBalance`. |
| 6 | Polymorphic Call | One call, many types | Call `Speak` across a `List<Animal>`. |
| 7 | Inheritance Declaration | is-a + override | Fill base `Vehicle` and `4` wheels. |
| 8 | Composition Field | has-a collaborator | Assign the constructor param to the field. |
| 9 | Dependency Injection | Inject collaborator | Pass `logger` into `ReportService`. |
| 10 | Closing Synthesis | All ideas together | Fill 7 blanks in one full notification program. |

The drill snippets are teaching fragments (some are class-only or mix top-level
statements after type declarations, so they do not compile alone). Each is
paired with a validated complete program in `runnablePrograms`, which is what
the Run button compiles through the shared Roslyn/WASM host.

## Prerequisites
Assumes the concept names from `Foundations`. The `explain` steps teach `var`,
`new`, `=>`, `return`, and the dot-call inline as they appear, so the lesson is
mostly self-contained on syntax.

## Complexity rung
Gentle for drills 1-9 (one or two tokens each), then a real jump at drill 10:
the synthesis program combines an `interface`, an `abstract` base class,
`override`, constructor chaining (`: base(logger)`), `List<Notification>`,
`$"..."` interpolation, and `Object.ReferenceEquals` in a single 7-blank
exercise.

## Covered well
- Tight pairing with `Foundations`: same ten ideas, same order, now produced
  rather than recognised.
- Every drill is actually runnable, so a filled blank can be executed and seen.
- The `explain` steps unpack new syntax (`var`, `=>`, references) at the point
  of use, in plain voice.

## Gaps / issues
- **Difficulty jump:** drill 10 stacks interfaces, abstract classes,
  inheritance, DI, generics, and string interpolation at once, which is beyond
  the Gentle pill and well ahead of where those topics get dedicated lessons.
- `=>` (expression-bodied members), `$"..."` interpolation, and the `?:` idea
  appear in later snippets before any lesson formally owns them.
- Snippets 8 and 9 carry inconsistent leading indentation from the source data,
  which reads oddly next to the clean `runnablePrograms`.
- Theme is mixed rather than consistent - acceptable for a practice set, but
  worth noting against the animal theme used later in Part 4.
- No recap/summary card; drill 10 serves as the finale.

## Verification status
Read-only content audit. Prior work-log notes record dotnet compile/run of all
ten `runnablePrograms` and a live page boot (drill 0 Run -> `True`).
