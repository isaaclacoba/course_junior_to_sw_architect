# Practical track - lesson index

Every lesson in the Practical track, in live `index.html` path order, grouped by
Part. Each row links to its full audit report and gives a one-line summary. See
[README.md](README.md) for the cross-track findings and cycle plan, and
[infrastructure.md](infrastructure.md) for the shared engines.

## Part 1 - Understand the ideas

| Lesson | Report | One line |
|---|---|---|
| Foundations | [level1.md](practical/level1.md) | Guided tour of the whole OO vocabulary in ten topics, closing with an integration read. |
| Practice the Basics | [level1-coding.md](practical/level1-coding.md) | The same ten ideas as one/two-blank drills; hands-on counterpart to Foundations. |
| Control Flow | [control-flow.md](practical/control-flow.md) | `if`/`else`, boolean logic, `while`/`for`/`foreach`, `break`/`continue`, `switch` - quiz + fill-blank. |
| Methods | [writing-methods.md](practical/writing-methods.md) | What a method is for: return, parameter, decision rule, reuse, one method calling another. |
| Reading Objects | [reading-objects.md](practical/reading-objects.md) | Object-collaboration intuition; quietly seeds Single Responsibility and Dependency Inversion. |
| Reuse Without Regret | [level4.md](practical/level4.md) | Inheritance vs composition, the diamond problem, polymorphism as the shared payoff. |

## Part 2 - Build it for real

| Lesson | Report | One line |
|---|---|---|
| First Builds | [first-builds.md](practical/first-builds.md) | First write-from-scratch lesson; a mini S/O/D taster (class, one job, inject, interface, new impl). |
| Wiring It Up | [wiring-it-up.md](practical/wiring-it-up.md) | Turns the control-flow theory into small working methods, one tool per card. |

## Part 3 - Know the language

| Lesson | Report | One line |
|---|---|---|
| Collections | [collections.md](practical/collections.md) | `List<T>`, a list of your own objects, `Dictionary<TKey,TValue>`; runnable. |
| Data shapes | [data-shapes.md](practical/data-shapes.md) | Auto/computed properties, `enum`, `struct` (value copy), `record` (value equality). |
| Lambdas | [lambdas.md](practical/lambdas.md) | First contact with lambdas: unnamed function in a variable, a yes/no rule, capture of locals. |
| LINQ | [linq.md](practical/linq.md) | `Where`/`Count`/`Any`/`All`/`Select`/`FirstOrDefault`/`OrderBy` as loop-free queries. |
| Errors and null | [errors-null.md](practical/errors-null.md) | `try`/`catch`/`finally`, `throw`, `null`, `??`, `?.`; runnable. |
| Generics | [generics.md](practical/generics.md) | Write your own generic type/method: `Box<T>`, `First<T>`, `Pair<A,B>`, `Wrap<T>`. |

## Part 4 - Design with objects

| Lesson | Report | One line |
|---|---|---|
| Why objects? | [encapsulation.md](practical/encapsulation.md) | Encapsulation rung by rung: group data, behaviour beside data, `private`, guard a rule, one place. |
| Why abstract? | [interfaces.md](practical/interfaces.md) | Interfaces: shared shape, cost of depending on concretes, program to the promise, add a type freely. |
| Why many versions? | [polymorphism.md](practical/polymorphism.md) | Replace type branches with each type carrying its own behaviour; one call site, many types. |
| Inherit or compose? | [composition.md](practical/composition.md) | True `is-a` vs the "is-a lie", C#'s one-base-class limit, delegate to held parts, swap behind an interface. |
| Why inject? | [dependency-injection.md](practical/dependency-injection.md) | The `new`-inside-a-class knot, receive through the constructor, depend on an interface, hand in a double. |

## Part 5 - Prove it works

| Lesson | Report | One line |
|---|---|---|
| What a test is | [testing-basics.md](practical/testing-basics.md) | Arrange-Act-Assert, asserting the exact result, a reusable assert helper, expecting a throw. |
| Test doubles | [test-doubles.md](practical/test-doubles.md) | Fake, stub and spy - stand-ins you inject to keep a test fast, repeatable and under your control. |
| Testable by design | [testable-design.md](practical/testable-design.md) | The habits behind SOLID that make code testable: inject, one job, no hidden state. |

## Part 6 - Design for change

| Lesson | Report | One line |
|---|---|---|
| Refactor moves | [refactor-moves.md](practical/refactor-moves.md) | Five behaviour-preserving moves, each the concrete action a SOLID principle will name next. |
| The SOLID Principles | [level2.md](practical/level2.md) | All five principles, each taught trap-then-fix over one small codebase, with a Mermaid diagram per card. |
| Capstone: SOLID in Practice | [capstone.md](practical/capstone.md) | Refactor a welded `TestRunner` step by step; seven milestones checked structurally by the Roslyn host. |
