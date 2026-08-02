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
| 8 | strings | 2 | text is a value: build from parts, change case, search inside, rewrite pieces | `$"..."` interpolation `(C#)`, `.ToUpper()`/`.Contains()`/`.Replace()`/`.Substring()` | 1,7 |
| 9 | arrays | 2 | a fixed-size ordered sequence: index (from 0), length, iterate; split text into pieces | `int[]`/`string[]`, `new[] { }`, `a[i]`, `.Length`, foreach, `.Split()` | 4,8 |
| 10 | class-members | 2 | behaviour/data that belongs to the type not the instance; a value fixed for good | `static` (method/field), `const`, `readonly` | 1,4 |
| 11 | null-safety | 2 | a value may be absent ("no value"); handle the absent case instead of crashing | `int?`/`string?`, `??`, `?.`, `??=`, `== null` `(C#)` | 1,7 |
| 12 | access-properties | 2 | control what is visible; expose state through a property, not a raw field | `public`/`private`/`protected`, `{ get; set; }`, `init`, expression-bodied get `(C#)` | 1,4 |
| 13 | type-system | 2 | an abstract base you cannot create; override a behaviour; overload a name; a type's own text form; deterministic cleanup | `abstract`, `virtual`/`override`, overloading, `override ToString()`, `IDisposable`/`using` | 6,12 |
| 14 | collections | 3 | an ordered many; a keyed lookup; iterate and tally | List<T>, Dictionary<K,V>, foreach | 3,4 |
| 15 | data-shapes | 3 | ways to package data: property, computed value, a fixed set, value-copy, value-equality | `{ get; set; }` `[inversion]`, `=>` `(C#)`, enum, struct, record `(C#)` | 1,14 |
| 16 | lambdas | 3 | a function passed as a value; capturing surrounding locals | `=>` lambda `(C#)`, Func/Predicate | 4,14 |
| 17 | linq | 3 | query a collection without loops: filter, count, exists, all, map, first, order | Where/Count/Any/All/Select/FirstOrDefault/OrderBy `(C#)` | 14,16 |
| 18 | errors-null (Exception handling) | 3 | handle things going wrong; keep a program standing when it fails | try/catch/finally, throw (`??`/`?.` now in null-safety, row 11) | 4 |
| 19 | generics | 3 | write a type or method that works for any type | `Box<T>`, `First<T>`, `Pair<A,B>` | 14 |
| 20 | encapsulation (why objects?) | 4 | group data, put behaviour beside it, hide internals, guard a rule, keep it in one place - **S** | private, class | 1,4 |
| 21 | interfaces (why abstract?) | 4 | name a shared promise; depend on the promise not the concrete; add a type without touching callers - **D/O** | interface | 6,20 |
| 22 | polymorphism (why many versions?) | 4 | each type carries its own behaviour; one call site, many types; choose at run time - **O** | interface, virtual/override, List<IAnimal> | 21 |
| 23 | composition (inherit or compose?) | 4 | true is-a vs hold-a-part; the one-base-class limit; delegate to parts; swap a part behind an interface - **L** | inheritance, composition, interface | 6,21,22 |
| 24 | dependency-injection (why inject?) | 4 | don't build your dependency inside; receive it; depend on an interface; hand in a double - **D** | constructor injection, interface | 7,21 |
| 25 | testing-basics | 5 | a test = arrange, act, assert; assert the exact result; a reusable assert; expect a throw | method, throw, assert helper | 4,24 |
| 26 | test-doubles | 5 | fake, stub, spy - injected stand-ins for a real dependency | interface, injection | 24,25 |
| 27 | testable-design | 5 | the habits that make code testable are the SOLID habits: inject, one job, no hidden state | interface, injection | 20,24,25 |
| 28 | refactor-moves | 6 | change the shape, keep the behaviour; five moves, each a SOLID action | interface, injection, polymorphism, extract/split | 20,21,22,23,24 |
| 29 | the-solid-principles (level2) | 6 | all five principles as write-the-fix builds; trap in prose, fix graded (requireSource + verify) | interface, injection, polymorphism | 20,21,22,23,24,28 |
| 30 | capstone | 6 | apply all of SOLID to one program; milestones S, DI, O, DIP, L (ISP missing) | full C#, structural checks | 20-29 |

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
| 18 | saving-data | 3 | RAM is wiped at exit; save to a file; a file is bytes plus metadata and a separate name; a database is the step up from one file for shared, concurrent, queryable data | 15,7 |
| 19 | programs-that-talk | 3 | the internet joins networks into one; client asks, server answers; DNS resolves a name to an IP address; a request gets a response back into memory; HTTP is the web's request/response rules; an API is the fixed menu a server offers | 4,7 |
| - | keeping-data-safe | 3 | some data is a secret - keep it out of code and logs and never show it back; permissions control who may read or change data; don't trust input - validate it before use | 7,18,19 |
| - | checkpoint-3 | 3 | (review of Part 3) | 15-19, keeping-data-safe |
| 21 | standing-on-other-code | 4 | you don't write everything; libraries and dependencies are code others wrote | 8 |
| 20 | how-code-is-shared | 4 | version control keeps a history; a branch is a safe parallel line, a merge brings the work back; a remote is the shared copy a platform hosts so a team works on one codebase | - |
| - | checkpoint-4 | 4 | (review of Part 4) | 20,21 |
| 22 | good-names | 5 | a name should say what a value holds or what a function does; clear beats short or long | 9,13 |
| 23 | no-repeats | 5 | duplication is the same knowledge in many places; a fix has to be repeated and a copy is easy to miss; say it once (DRY) | 13,22 |
| 24 | one-job | 5 | a function that does one job earns a clear name and can be reused alone; the seed of single responsibility | 13,22 |
| 25 | write-for-readers | 5 | code is read more than written; prefer readability over cleverness | 22,24 |
| 26 | comments-say-why | 5 | a comment explains why, not the what the code already shows; a good name removes most comments | 22,25 |
| - | checkpoint-5 | 5 | (review of Part 5) | 22-26 |

Note: Part 4 is taught Standing on other code (`theory-21`) then How code is
shared (`theory-20`) - you reach for libraries the moment you code; version
control comes with managing your own. The file numbers (20/21) are legacy and do
not drive order; no rename was made.
