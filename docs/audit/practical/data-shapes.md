# Data shapes (`data-shapes.js`)

- **Track / Part:** Practical - Part 3 Know the language
- **Engine / format:** build-engine (write-from-scratch)
- **Difficulty pill:** Steady  **XP cards (data-total):** 5
- **Runnable:** yes (compiles and runs each solution)  **Theme:** animals

## Concept(s) taught
The everyday ways C# packages data: an auto-property `{ get; set; }`, a computed
read-only property (`=>`), an `enum`, a `struct` (value copy) and a `record`
(value equality). Graders are chosen so the concept is unavoidable - a `class`
where a `struct` or `record` is wanted prints the wrong answer.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Give it a property | Property | Add `Name { get; set; }` to `Cat`. requireSource `{ get; set; }`; verify re-runs with `Tom`. |
| 2 | A property that computes | Computed property | Add `Age` + read-only `HumanYears => Age * 7`. requireSource `HumanYears`; verify re-runs Age 5. |
| 3 | A fixed set of options | enum | Define `enum Mood` and a `switch` in `Say`. requireSource `enum Mood`; verify re-runs Sleepy. |
| 4 | A value that copies | struct | Define `Treats` as a `struct`; copy stays separate. requireSource `struct Treats`; no verify probe. |
| 5 | Two that are equal by value | record | Define `record Animal(string Name, int Legs)`. requireSource `record Animal`; no verify probe. |

Starters ship `// TODO` bodies that fail until filled; grading is output-match plus
the `requireSource` technique gate. No recap card.

## Prerequisites
Assumes classes, methods, `switch`, `var` and `Console.WriteLine` (Parts 1-2).
Introduces properties, `enum`, `struct` and `record` for the first time formally.

## Complexity rung
A steady Part 3 build lesson, but it carries five distinct type constructs. Each
card is one idea, yet the span (property -> computed -> enum -> struct -> record)
is wider than a single concept.

## Covered well
- Grader design makes the concept unavoidable: cards 4 and 5 print the wrong value
  if the learner reaches for a `class` instead of `struct`/`record`.
- Worked `example` boxes use a different subject than the exercise (Dog/Square/
  Light/Point/Color) so copying them does not produce the answer.
- Cards 1-3 carry a hidden `verify` probe that re-runs with different inputs, so a
  hardcoded literal is caught.

## Gaps / issues
- **Curriculum inversion:** properties (`{ get; set; }`) and `enum` are first taught
  here in Part 3, yet earlier lessons already used objects and fields (Collections'
  `Cat` used public fields). The learner met object data before the lesson that
  names properties.
- **Uneven verify coverage:** cards 4 (struct) and 5 (record) rely only on
  `requireSource` regex plus output-match; they have no hidden `verify` probe, so
  the value-copy / value-equality behaviour is checked by a single output line.
- No recap/summary card to consolidate the five shapes.
- `var` used without formal introduction.

## Verification status
Read-only content audit (no compile). Prior work-log sessions record dotnet
compile/run verification of the build solutions and verify probes.
