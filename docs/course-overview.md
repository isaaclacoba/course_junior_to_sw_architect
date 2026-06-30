# Course Content Overview

A map of everything the C# OO Automation course currently teaches. Use this as the
baseline when designing new chapters.

## Identity

- Audience: colleagues practising C# fundamentals + OO basics, framed around
  test-automation examples (reporters, test runners, checks).
- Delivery: browser-only. Theory cards, fill-in-the-blank drills, and
  write-from-scratch builds. C# compiles and runs in-browser via the shared
  `code-lab` Roslyn/WASM host.
- Progression: two tracks chosen from `index.html` - a **Practical** track
  (write and run C#) and a **Theory** track (zero-background fundamentals).
  Progress + XP stored in `localStorage`.

## Practical track (in order)

### Part one — Understand the ideas

| # | Lesson | Page | Format | Cards | Teaches |
|---|--------|------|--------|-------|---------|
| 1 | Foundations | level1.html | Theory (quiz/blank) | 10 | What software is for; objects = state + behaviour |
| 2 | Practice the Basics | level1-coding.html | Runnable fill-blank | 10 | The same core ideas as runnable C# |
| 3 | Control Flow | control-flow.html | Quiz + blank | 7 (+recap) | if/else, boolean logic, while, for, foreach, break/continue, switch |
| 4 | Methods | writing-methods.html | Write-from-scratch | 5 | Return values, parameters, logic, reuse, composing methods |
| 5 | Reading Objects | reading-objects.html | Fill-blank + run | 10 | Object collaboration, delegation, one job per method/class (pre-SOLID) |
| 6 | Reuse Without Regret | level4.html | Guided reading + tour | 12 | Inheritance vs composition vs polymorphism; diamond problem |

### Part two — Build it for real

| # | Lesson | Page | Format | Cards | Teaches |
|---|--------|------|--------|-------|---------|
| 7 | First Builds | first-builds.html | Write-from-scratch | 5 | Class, single job, inject, interface, second impl (a quick taster) |
| 8 | Wiring It Up | wiring-it-up.html | Write-from-scratch | 6 | Control flow applied: if/else, bool logic, while, for, foreach+break/continue, switch |

### Part three — Know the language

| # | Lesson | Page | Format | Cards | Teaches |
|---|--------|------|--------|-------|---------|
| 9 | Collections | collections.html | Runnable fill-blank | 7 (+recap) | `List<T>`, foreach, indexing, list of objects, `Dictionary`, `ContainsKey`, manual tally |
| 10 | Data shapes | data-shapes.html | Write-from-scratch | 5 | Property, computed property, `enum`, `struct` (value copy), `record` (value equality) |
| 11 | LINQ | linq.html | Quiz + blank | 7 (+recap) | Where, Count, Any, All, Select, FirstOrDefault, OrderBy |
| 12 | Errors and null | errors-null.html | Runnable fill-blank | 7 (+recap) | try/catch, `e.Message`, finally, throw, null, `??`, `?.` |
| 13 | Generics | generics.html | Write-from-scratch | 4 | `Box<T>`, generic method, `Pair<A,B>`, generic method returning a generic type |

### Part four — Build with objects (the design building blocks, taught slowly)

Each lesson answers a "why" juniors struggle with, by feel, through code they run.
All write-from-scratch builds (build-engine.js), 5 tasks each.

| # | Lesson | Page | Answers | Ladder |
|---|--------|------|---------|--------|
| 14 | Why objects? | encapsulation.html | why classes/methods, not one monolith | group state → behaviour beside state → `private` → guard an invariant → change a rule in one place |
| 15 | Why abstract? | interfaces.html | why pull logic behind an interface | two look-alike classes → a caller stuck on one type → name the promise → program to it → add a type for free |
| 16 | Why many versions? | polymorphism.html | why many impls vs one branchy method | if-per-style pain → one call the object resolves → loop a `List<IReporter>` → runtime pick → add a class, loop unchanged |
| 17 | Inherit or compose? | composition.html | inherit everything? three parents? | real is-a → the is-a lie → C# one-base-class limit → compose three parts → swap a part behind `IEngine` |
| 18 | Why inject? | dependency-injection.html | why inject vs `new` everywhere | new-inside knot → editing the class to change it → constructor injection → inject `IReporter` → inject a fake to test |

### Part five — Design for change

| # | Lesson | Page | Format | Cards | Teaches |
|---|--------|------|--------|-------|---------|
| 19 | The SOLID Principles | level2.html | Trap-then-fix drills | 10 (+recap) | S, O, L, I, D each shown broken then fixed |
| 20 | Capstone: SOLID in Practice | level3-app/ | Milestone refactor | 7 | Refactor a broken program; enforces S, DI, O, DIP, L |

## Theory track (zero-background, in order)

Reuses the drill-engine in theory mode (multiple-choice check + fill-blank in prose).

- **Part one — What a computer really is** (theory-1..7): what a program is; how a
  program runs (fetch-execute); what starts a program (Main/entry); many programs at
  once (processes/scheduler); everything as numbers (binary); text/images/sound as
  numbers (encodings); the OS's bigger job (files/drivers).
- **Part two — From idea to running code** (theory-8..14): what a programming language
  is; variables; types; statements and expressions; decisions and repetition;
  functions; bugs and debugging. Hands off to the practical track.

## Concept Coverage

### Language fundamentals
- Variables / state, classes & objects, instantiation, reference vs value semantics —
  Foundations, Practice the Basics, Data shapes (`struct`/`record`).
- Control flow: if/else, `&&` `||` `!`, while, for, foreach, break/continue, switch,
  `++`/`--` — Control Flow (learn) + Wiring It Up (apply).
- Methods: return values, parameters, internal logic, reuse, calling other methods —
  Methods.
- Collections: `List<T>`, indexing, `Dictionary`, `ContainsKey` — Collections.
- Data shapes: properties, computed properties, `enum`, `struct`, `record` — Data shapes.
- LINQ: Where/Count/Any/All/Select/FirstOrDefault/OrderBy — LINQ.
- Errors and null: try/catch/finally, throw, `null`, `??`, `?.` — Errors and null.
- Generics (defining your own) — Generics.

### Object-oriented core
- Encapsulation — Foundations, Practice, **Why objects?** (focused).
- Interfaces / abstraction — First Builds, **Why abstract?** (focused), SOLID (I), Capstone.
- Polymorphism — Reading Objects, Reuse Without Regret, **Why many versions?** (focused).
- Composition vs inheritance — Reuse Without Regret, **Inherit or compose?** (focused).
- Dependency injection — Reading Objects, First Builds, **Why inject?** (focused), Capstone.

### Design principles
- SOLID (all five), each trap-then-fix — The SOLID Principles + Capstone milestones.
  Each letter now has a slow hands-on prior encounter in Part four
  (S←14, O←15/16, L←16/17, I←15, D←18).
- Inheritance pitfalls: is-a lie, fragile base class, diamond problem — Reuse Without
  Regret + Inherit or compose?.

## Pedagogical patterns in use
- Three formats: theory cards, fill-in-the-blank drills, write-from-scratch builds.
- One new idea per card; each card one small step above the last.
- Trap-then-fix (show broken first) for SOLID.
- Hidden `verify` probes reject hardcoded answers in build lessons (the probe re-runs
  the learner's types with different inputs).
- Guided code tour (spotlight + narration) in Reuse Without Regret.
- Friendly compiler-error panel shared across all runnable lessons.
- Consistent domain: test runners, checks, reporters, formatters.

## Not yet covered (candidate material for next chapters)
- Lambdas (used in LINQ but never taught; best placed at the end of Part three).
- Unit testing as a written discipline (Part four's DI lesson injects a fake, but a
  dedicated assertion/test-method lesson is still missing).
- async/await and tasks.
- abstract classes (`abstract`/`virtual`/`override` as a focused lesson).
- Pattern matching: `switch` expressions, `is`, deconstruction.
- String handling: interpolation, `Split`/`Join`, `int.TryParse`.
- LINQ aggregation: `Sum`/`Min`/`Max`/`GroupBy`/`ToList`.
- File / IO or HTTP — real automation side effects.
- Theory track continuation beyond code vocabulary (foundations of good code, design).

## File map
- Path/landing: index.html (renders status + XP from `localStorage`).
- Shared engines: drill-engine.js (fill-blank + quiz), build-engine.js
  (write-from-scratch), page-shell.js (hero + card scaffold).
- Compiler host: code-lab/ submodule (Roslyn/WASM); exercise injected from
  level3-exercise/ at build time; published output in level3-app/.
