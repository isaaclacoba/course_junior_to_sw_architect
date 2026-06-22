# Course Content Overview

A map of everything the C# OO Automation course currently teaches. Use this as the
baseline when designing new chapters.

## Identity

- Audience: colleagues practising C# fundamentals + OO basics, framed around
  test-automation examples (reporters, test runners, checks).
- Delivery: browser-only. Theory cards, fill-in-the-blank drills, and
  write-from-scratch builds. C# compiles and runs in-browser via the shared
  `code-lab` Roslyn/WASM host.
- Progression: one guided path, two parts. Progress + XP stored in `localStorage`.

## The Path (in order)

### Part one — Understand the ideas

| # | Lesson | Page | Format | Cards | XP/card | Teaches |
|---|--------|------|--------|-------|---------|---------|
| 1 | Foundations | level1.html | Theory (quiz/blank) | 10 | 10 | What software is for; objects = state + behaviour |
| 2 | Practice the Basics | level1-coding.html | Runnable fill-blank | 10 | 10 | The same core ideas as runnable C# |
| 3 | Control Flow | control-flow.html | Quiz + blank | 7 (+recap) | 20 | if/else, boolean logic, while, for, foreach, break/continue, switch |
| 4 | Methods | writing-methods.html | Write-from-scratch | 5 | 20 | Return values, parameters, logic, reuse, composing methods |
| 5 | Reading Objects | reading-objects.html | Fill-blank + run | 10 | 20 | Object collaboration, delegation, one job per method/class (pre-SOLID) |
| 6 | The SOLID Principles | level2.html | Trap-then-fix drills | 10 (+recap) | 25 | S, O, L, I, D each shown broken then fixed |
| 7 | Reuse Without Regret | level4.html | Guided reading + tour | 12 | 10 | Inheritance vs composition vs polymorphism; diamond problem |

### Part two — Build it for real

| # | Lesson | Page | Format | Cards | XP/card | Teaches |
|---|--------|------|--------|-------|---------|---------|
| 8 | First Builds | first-builds.html | Write-from-scratch | 5 | 25 | Class, single job, inject, interface, second impl |
| 9 | Wiring It Up | wiring-it-up.html | Write-from-scratch | 6 | 25 | Control flow applied: if/else, bool logic, while, for, foreach+break/continue, switch |
| 10 | Capstone: SOLID in Practice | level3-app/ | Milestone refactor | 7 | — | Refactor a broken program; enforces S, DI, O, DIP, L |

## Concept Coverage

### Language fundamentals
- Variables / state, functions, classes & objects, instantiation, reference vs value
  semantics (memory model) — Foundations + Practice the Basics.
- Control flow: if/else, `&&` `||` `!`, while, for, foreach, break/continue, switch,
  `++`/`--` — Control Flow (learn) + Wiring It Up (apply).
- Methods: return values, parameters, internal logic, reuse, calling other methods —
  Methods.

### Object-oriented core
- Encapsulation — Foundations, Practice the Basics.
- Inheritance (is-a) — Foundations, Practice, Reuse Without Regret.
- Composition (has-a) — Foundations, Practice, Reading Objects, Reuse Without Regret.
- Polymorphism — Foundations, Practice, Reading Objects, Reuse Without Regret.
- Interfaces / abstraction — First Builds, SOLID (I), Capstone.
- Dependency injection — Foundations, Practice, Reading Objects, First Builds, Capstone.

### Design principles
- SOLID (all five), each trap-then-fix — The SOLID Principles + Capstone milestones.
- Inheritance pitfalls: is-a lie, fragile base class, diamond problem — Reuse Without Regret.

## Pedagogical patterns in use
- Three formats: theory cards, fill-in-the-blank drills, write-from-scratch builds.
- Trap-then-fix (show broken first) for SOLID.
- Hidden verify probes reject hardcoded answers in build lessons.
- Guided code tour (spotlight + narration) in Reuse Without Regret.
- Friendly compiler-error panel shared across all runnable lessons.
- Consistent domain: test runners, checks, reporters, formatters.

## Not yet covered (candidate material for next chapters)
- Collections in depth: `List<T>`, `Dictionary<TKey,TValue>`, arrays beyond `.Length`.
- Error handling: `try`/`catch`/`finally`, exceptions, custom exception types.
- Generics (defining, not just consuming `List<T>`).
- Nullability: `null`, nullable reference types, `?.`, `??`.
- LINQ basics (`Where`, `Select`, `Any`, `Count`).
- `enum`, `struct`, records, value vs reference types as a topic.
- Properties (get/set, auto-properties) and access modifiers as a focused lesson.
- `static` vs instance members.
- async/await and tasks.
- Unit testing as a written discipline (the domain is testing, but learners never
  write an assertion/test method themselves).
- File / IO or HTTP — real automation side effects.

## File map
- Path/landing: index.html (renders status + XP from `localStorage`).
- Shared engines: drill-engine.js (fill-blank), build-engine.js (write-from-scratch),
  page-shell.js (hero + card scaffold), drill-engine.js quiz support.
- Compiler host: code-lab/ submodule (Roslyn/WASM); exercise injected from
  level3-exercise/ at build time; published output in level3-app/.
