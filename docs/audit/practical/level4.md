# Reuse Without Regret (`level4.js`)

- **Track / Part:** Practical - Part 1 Understand the ideas
- **Engine / format:** custom controller (code + line-by-line walk + Mermaid + one quiz + optional Run per card)
- **Difficulty pill:** Steady  **XP cards (data-total):** 12
- **Runnable:** yes (each card ships a full `runCode`; `RoslynIframeRunner` -> `level3-app`)  **Theme:** animals (`Cat`, `Dog`, `Penguin`, `Duck`) with a test-automation tie-back at the end

## Concept(s) taught
Inheritance (is-a) versus composition (has-a), why to favour composition, and
the diamond problem as the core "why" C# forbids two parents. Polymorphism is
framed as the payoff both approaches unlock. Reading-to-understand: the learner
reads code and chooses one answer per card.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Two ways to build, one payoff | Big picture | Pick what is-a and has-a share. |
| 2 | Inheritance is an is-a promise | is-a | Say why `rex` inherits `Breathe()`. |
| 3 | Composition is a has-a promise | has-a | Identify the `Dog`/`Voice` relationship. |
| 4 | Polymorphism: one call, many answers | payoff | Explain three words from one call. |
| 5 | Predict the pen | Trace polymorphism | Predict `Baa Quack Baa`. |
| 6 | Trace the robo-duck | Trace composition | Predict `Quack-vroom`. |
| 7 | Spot the difference | is-a vs has-a | Pick which version composes. |
| 8 | The is-a lie | When inheritance hurts | Explain the `Penguin : Bird` trap (seeds Liskov). |
| 9 | The fragile base class | When inheritance hurts | Count classes a base edit affects. |
| 10 | The diamond problem | Why composition wins | Explain why C# forbids two parents. |
| 11 | Composition dissolves the diamond | Favour composition | Show how has-a gives both abilities. |
| 12 | You already shipped this | Tie-back to capstone | Name composition + polymorphism in the runner. |

Each card has a display `code`, a runnable `runCode`, a `walk` (per-line
narration), a `mermaid` diagram, and a single multiple-choice `question`.
Answering awards 10 XP to the global counter (`level4_awarded`).

## Prerequisites
Assumes classes, methods, and fields. Introduces a large syntax surface -
`abstract`, `virtual`, `override`, `new` (method hiding), `interface`,
`Animal[]`, and `foreach` - but read-only recognition keeps the demand at
"follow it", not "write it".

## Complexity rung
The heaviest Part 1 lesson: it reaches the diamond problem and the fragile base
class. The Steady pill and the read-only format soften what is otherwise
advanced material. It is a clear step above the fill-blank drills before it.

## Covered well
- Strong pedagogy: every card pairs runnable code, a line walk, a diagram, and
  a check on the same single idea.
- Animal theme is consistent within the lesson and matches Part 4's theme.
- The `is-a lie` and `diamond problem` cards deliberately forward-seed Liskov
  and multiple-inheritance, so those land as recognition later.

## Gaps / issues
- **Forward reference in the wrong tense:** card 12 says "the SOLID capstone you
  finished" and "you already shipped this", but in path order the capstone is
  Part 6, far ahead of this Part 1 lesson. A learner here has not shipped it.
- `new`-keyword method hiding (cards 7 and 10) is an advanced, rarely-advised
  feature shown only to build the diamond - acceptable, but untaught and easy to
  misread as `override`.
- Large untaught syntax surface for a Part 1 lesson (`abstract`, `virtual`,
  `override`, interfaces) - mitigated by the read-only format.
- Recognition only (one option per card); no fill-blank or write, so the ideas
  are recognised rather than produced.

## Verification status
Read-only content audit. Prior work-log entries record level4 as runnable and
dotnet-verified through the shared Roslyn runner.
