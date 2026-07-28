# Concept ledger - the portable syllabus

This is the backbone of the course: the ordered list of **concepts** a learner
meets, independent of any one language. The concept order is the asset we keep if
the course is ever ported to Java, Python, or TypeScript. The C# surface is the
disposable skin - the only column that changes on a port.

Two rules govern every lesson:

1. **Each concept is introduced exactly once, at its row.** A lesson may use any
   concept at or above its own row, and none below it. If you need a concept that
   is not yet taught, either move your lesson down or teach that concept first -
   do not reach forward.
2. **Teach the portable concept in plain surface; treat language sugar as
   optional skin.** Prefer the form that maps to other languages. When you must
   use C#-specific sugar, mark it `(C#)` here and introduce it deliberately.

Order = live `index.html` path order, never file numbers (numbers drift as
lessons are inserted). This ledger is a living document - update it in the same
change that adds or reorders a lesson.

Status: first seed, reconstructed from the cycle 1 audit. Rows flagged
`[inversion]` / `[taster]` / `[untaught]` record a known ordering problem to fix,
not an endorsement.

## Language-surface policy

| C# surface | Portable concept behind it | Rule |
|---|---|---|
| explicit type (`int x`) | a typed value | default everywhere |
| `var` | type inference | avoid; only after a dedicated note; never in early lessons |
| `=>` expression body | a one-line member | write the full `{ return ...; }` form until lambdas are taught |
| `=>` lambda | a function passed as a value | taught in `lambdas`; the concept is portable, the arrow is `(C#)` |
| `$"..."` interpolation | building a string from parts | prefer `"a " + b` early; introduce once, marked `(C#)` |
| `record` | value equality | Part 3 only, framed as a C# shortcut for a hand-written equals |
| `??` / `?.` | default-if-missing / safe access | taught in `errors-null`; concept portable, operators `(C#)` |
| `switch` expression | multi-way choose | prefer statement `switch` first |

## Practical track

| # | Lesson (slug) | Part | Concept introduced (portable) | C# surface | Depends on |
|---|---|---|---|---|---|
| 1 | foundations | 1 | printing output; a variable holds a value; datatypes; assignment (store, not equals); `null` (nothing yet); what an object is (state + behaviour, class vs instance) | `Console.WriteLine`, `int`/`long`/`double`/`decimal`/`bool`/`char`/`string`, `=`, `string?`+`null`, class/field/method, `new` | - |
| 2 | practice-the-basics | 1 | compute with values (arithmetic); join text; ask a yes/no question (comparison to a `bool`); an object that answers about itself - bridges to Control Flow | `+` `-` `*` `/`, string `+`, `==` `!=` `>` `<` `>=` `<=`, class/field/method | 1 |
| 3 | control-flow | 1 | choose a branch; combine yes/no; repeat; skip/stop; multi-way choose (write-and-run methods) | if/else, `&&` `||` `!`, while, for, foreach, break/continue, switch, `string[]` | 1,2 |
| 4 | writing-methods | 1 | a named step: return a value, take input, hold a rule, reuse it, call another | method, return, parameters | 3 |
| 5 | reading-objects | 1 | objects collaborate: one asks another and acts (seeds one-job, receive-don't-build) | class, field, constructor, method, if/else, comparison, string `+` | 1,4 |
| 6 | reuse-without-regret | 1 | is-a vs has-a; favour composition; the diamond problem; polymorphism as payoff | inheritance, virtual/override, interface (named) | 1,5 |
| 7 | type-conversion | 2 | text to number and back; drop decimals with a cast; parse safely | `int.Parse`/`int.TryParse`, `(int)` cast, `.ToString()`, `out` | 1,4 |
| 9 | collections | 3 | an ordered many; a keyed lookup; iterate and tally | List<T>, Dictionary<K,V>, foreach | 3,4 |
| 10 | data-shapes | 3 | ways to package data: property, computed value, a fixed set, value-copy, value-equality | `{ get; set; }` `[inversion]`, `=>` `(C#)`, enum, struct, record `(C#)` | 1,9 |
| 11 | lambdas | 3 | a function passed as a value; capturing surrounding locals | `=>` lambda `(C#)`, Func/Predicate | 4,9 |
| 12 | linq | 3 | query a collection without loops: filter, count, exists, all, map, first, order | Where/Count/Any/All/Select/FirstOrDefault/OrderBy `(C#)` | 9,11 |
| 13 | errors-null (Exception handling) | 3 | handle things going wrong; keep a program standing when it fails | try/catch/finally, throw, `??` `?.` `(C#)` (null itself is taught in Foundations, row 1) | 4 |
| 14 | generics | 3 | write a type or method that works for any type | `Box<T>`, `First<T>`, `Pair<A,B>` | 9 |
| 15 | encapsulation (why objects?) | 4 | group data, put behaviour beside it, hide internals, guard a rule, keep it in one place - **S** | private, class | 1,4 |
| 16 | interfaces (why abstract?) | 4 | name a shared promise; depend on the promise not the concrete; add a type without touching callers - **D/O** | interface | 6,15 |
| 17 | polymorphism (why many versions?) | 4 | each type carries its own behaviour; one call site, many types; choose at run time - **O** | interface, virtual/override, List<IAnimal> | 16 |
| 18 | composition (inherit or compose?) | 4 | true is-a vs hold-a-part; the one-base-class limit; delegate to parts; swap a part behind an interface - **L** | inheritance, composition, interface | 6,16,17 |
| 19 | dependency-injection (why inject?) | 4 | don't build your dependency inside; receive it; depend on an interface; hand in a double - **D** | constructor injection, interface | 16,7 |
| 20 | testing-basics | 5 | a test = arrange, act, assert; assert the exact result; a reusable assert; expect a throw | method, throw, assert helper | 4,19 |
| 21 | test-doubles | 5 | fake, stub, spy - injected stand-ins for a real dependency | interface, injection | 19,20 |
| 22 | testable-design | 5 | the habits that make code testable are the SOLID habits: inject, one job, no hidden state | interface, injection | 15,19,20 |
| 23 | refactor-moves | 6 | change the shape, keep the behaviour; five moves, each a SOLID action | interface, injection, polymorphism, extract/split | 15,16,17,18,19 |
| 24 | the-solid-principles (level2) | 6 | all five principles as write-the-fix builds; trap in prose, fix graded (requireSource + verify) | interface, injection, polymorphism | 15,16,17,18,19,23 |
| 25 | capstone | 6 | apply all of SOLID to one program; milestones S, DI, O, DIP, L (ISP missing) | full C#, structural checks | 15-24 |

## Theory track

| # | Lesson (slug) | Part | Concept introduced (portable) | Depends on |
|---|---|---|---|---|
| 1 | what-a-program-is | 1 | an instruction; a program is an ordered list; instructions act on data; the CPU runs them | - |
| 2 | how-a-program-runs | 1 | loaded from storage into RAM; the fetch-execute loop; the program counter; jumps | 1 |
| 3 | what-starts-a-program | 1 | the OS launches a program; a loader copies it in; execution begins at an entry point (`Main`) | 2 |
| 4 | running-many-programs | 1 | a running program is a process; time-sharing one core; the scheduler; cores give real parallelism | 3 |
| 5 | everything-as-numbers | 1 | underneath, everything is numbers built from bits; binary; each bit doubles the range | 1 |
| 6 | text-images-sound | 1 | agreed encodings: characters to numbers, pixels as RGB, sound as samples | 5 |
| 7 | the-os-bigger-job | 1 | files, folders and paths; permissions; mediating hardware devices | 3 |
| - | checkpoint-1 | 1 | (review of Part 1) | 1-7 |
| 8 | what-a-language-is | 2 | the CPU runs numeric machine code; a language is human-friendly; a tool translates | 1 |
| 9 | variables | 2 | a named slot holding one value; name vs value; read and write; one value at a time | 8 |
| 10 | types | 2 | every value has a kind that decides what you can do; the compiler catches misuse | 9 |
| 11 | statements-expressions | 2 | a statement is one step; an expression produces a value; assignment stores it | 9 |
| 12 | decisions-repetition | 2 | a condition is a yes/no question; branch on it; a loop re-checks and repeats | 11 |
| 13 | functions | 2 | a named bundle of reusable steps; a call pushes a frame; arguments arrive as locals | 11 |
| 14 | bugs | 2 | the computer did what you wrote, not what you meant; syntax error vs logic error | 12,13 |
| - | checkpoint-2 | 2 | (review of Part 2) | 8-14 |
| 15 | where-data-lives | 3 | RAM as numbered slots; regions: code, rodata, data, stack, heap | 2,9 |
| 16 | references-vs-values | 3 | value types hold the data; reference types hold an address to an object on the heap | 15 |
| 17 | build-and-run cycle | 3 | compile time vs run time; a build error; compiled vs interpreted vs in-between | 8 |
| 18 | saving-data | 3 | RAM is wiped at exit; save to a file; a file is bytes plus metadata and a separate name | 15,7 |
| 19 | programs-that-talk | 3 | client asks, server answers; a request gets a response back into memory | 4,7 |
| - | checkpoint-3 | 3 | (review of Part 3) | 15-19 |
| 21 | standing-on-other-code | 4 | you don't write everything; libraries and dependencies are code others wrote | 8 |
| 20 | how-code-is-shared | 4 | version control keeps a history so many people work on one codebase | - |
| - | checkpoint-4 | 4 | (review of Part 4) | 20,21 |

Note: Part 4 is taught Standing on other code (`theory-21`) then How code is
shared (`theory-20`) - you reach for libraries the moment you code; version
control comes with managing your own. The file numbers (20/21) are legacy and do
not drive order; no rename was made.
