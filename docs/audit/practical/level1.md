# Foundations (`level1.js`)

- **Track / Part:** Practical - Part 1 Understand the ideas
- **Engine / format:** custom controller (recognition quiz + Mermaid diagram per topic; not drill-engine)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 10
- **Runnable:** no (no Run button; multiple-choice only)  **Theme:** neutral (generic `BankAccount`, `OrderService`, `Counter`)

## Concept(s) taught
A guided tour of the whole object-oriented vocabulary. In ten topics it names
state and behaviour, class vs object, reference assignment, encapsulation,
polymorphism, inheritance, composition, and dependency injection, then closes
with an integration check. It is a conceptual map, not hands-on practice.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Why Software Exists | Modeling state + transitions | Pick what a variable represents. |
| 2 | Variables and Functions | State + mechanism | Pick the role of a function. |
| 3 | Class and Object | Blueprint vs instance | Distinguish class from instance. |
| 4 | Memory Model (Intro) | Assignment semantics | Choose what `var b = a` does with a reference. |
| 5 | Encapsulation | Protecting state | Pick the goal of encapsulation. |
| 6 | Polymorphism | Same call, different behaviour | Pick what polymorphism enables. |
| 7 | Inheritance | is-a hierarchy | Pick what inheritance models. |
| 8 | Composition | has-a collaborators | Pick the definition of composition. |
| 9 | Dependency Injection (Intro) | Supplying dependencies | Pick the benefit of DI. |
| 10 | Level 1 Closing Check | Integrated model | Order state -> behaviour -> identity -> abstraction. |

Each topic carries a `mermaid` diagram, a short `explain`, `points`, and one
multiple-choice `question` with `answerWhy`. The renderer only shows the first
two sentences of `explain` and the first two `points`, so some authored prose
is never displayed. Answers award 10 XP each to the global course counter.

## Prerequisites
None assumed - this is the entry lesson. It nonetheless references `var`,
`new`, and reference semantics (`var b = a`) in its questions before any syntax
lesson has run.

## Complexity rung
The first lesson, but conceptually the widest: it previews every Part 1 and
Part 4 idea at once. Recognition-only keeps the per-card effort low, yet the
sheer number of new terms is heavy for the stated Gentle pill.

## Covered well
- One diagram per topic gives every abstract idea a visual anchor.
- Each `answerWhy` restates the correct idea, so a wrong pick still teaches.
- Topics map 1:1 onto the `level1-coding` drills that follow, so the pairing
  reinforces the same ten ideas in the same order.

## Gaps / issues
- **Voice:** the prose is dense and academic, against the plain, warm voice the
  repo requires - e.g. "Programs are formal models of a domain, expressed as
  state and valid transitions" and "functions define computations over those
  values". For a very junior audience this is the biggest issue.
- **Conceptual load:** eight-plus OO concepts introduced as recognition in one
  Gentle lesson, with no fill-blank or Run to practise any of them.
- **Ordering:** Polymorphism (topic 6) is taught before Inheritance (topic 7),
  which is the mechanism most learners expect first.
- Untaught syntax (`var`, `new`, reference copy) appears in questions before it
  is introduced anywhere.
- The renderer truncates `explain` to two sentences and `points` to two items,
  silently hiding authored content.
- No recap card as such; topic 10 doubles as the closing check.

## Verification status
Read-only content audit (no compile). Snippets here are prose/diagram only, so
no code execution applies.
