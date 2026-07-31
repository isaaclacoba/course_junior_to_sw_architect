# The SOLID Principles (`the-solid-principles.js`, formerly `level2.js`)

> Rewritten since this report: the lesson is now a write-from-scratch `build`
> lesson (`window.BUILD_CONFIG`) of five tasks, one SOLID principle each (S, O, L,
> I, D) plus a recap, on the ANIMAL family (Cat/FeedingSign, IAnimal/Cat/Dog,
> Sparrow/Penguin, Fish/IWalker/ISwimmer/IFlyer, ILog/Keeper). Each task states
> the trap in prose then has the learner write one small focused fix, gated by
> `requireSource` and a hidden `verify` probe. This resolves two cross-cutting
> items: (item 8) the "several classes at once" difficulty spike - each task now
> writes one interface plus one or two tiny classes, the same grain as
> `refactor-moves` and Part 4, and a one-sentence intro bridge now links the two
> lessons; (item 6) the theme split - the lesson moved from test-automation to the
> animal family shared by Part 4 and `refactor-moves`. The notes below describe
> the earlier 10-drill fill-in-the-blank version.

- **Track / Part:** Practical - Part 6 Design for change
- **Engine / format:** drill-engine (runnable: quiz-less fill-in-the-blank with a Run button per drill)
- **Difficulty pill:** Challenging  **XP cards (data-total):** 10
- **Runnable:** yes (`toRunnable` wraps each snippet in `class __Lab` and runs it)  **Theme:** test-automation (test runners, reporters, plugins)

## Concept(s) taught
All five SOLID principles, each taught trap-then-fix: a broken version that
shows the pain, then the corrected version. One small test-automation codebase
is improved one principle per pair of drills, with a Mermaid diagram on every
card.

## Card-by-card
| # | Card title | Principle | Trap or fix | What the learner does |
|---|---|---|---|---|
| 1 | S - One class doing three jobs (the trap) | Single Responsibility | trap | Fill the tangled `LoginTest` class name and its mixed `RunAndReport` method. |
| 2 | S - The fix: one class, one job | Single Responsibility | fix | Wire up the extracted `ReportFormatter` and call `Format`. |
| 3 | O - Editing old code for every new style (the trap) | Open/Closed | trap | Build the growing if-chain `ReportFormatter`, pick a style string. |
| 4 | O - The fix: add behavior without editing | Open/Closed | fix | Pick an `IReport` implementation (`PlainReport`/`EmojiReport`), call shared `Build`. |
| 5 | L - When a subtype lies (the trap) | Liskov Substitution | trap | Create the `SkippedTest` whose `Run()` throws, call the inherited method (surfaces the throw). |
| 6 | L - The safe fix | Liskov Substitution | fix | Return `TestOutcome.Skipped`, call through `IRunnable`. |
| 7 | I - One fat interface forcing empty methods (the trap) | Interface Segregation | trap | Implement the one real method (`Report`) on a class forced to fake `Run`/`Retry`. |
| 8 | I - The fix: small, focused interfaces | Interface Segregation | fix | Implement only `IReportable`, provide `Report`. |
| 9 | D - When code is glued together (the trap) | Dependency Inversion | trap | Hard-wire `new ConsoleReporter()`, call `Send`. |
| 10 | D - Inject it, and unlock testing | Dependency Inversion | fix | Create a `FakeReporter`, inject it into `TestRunner`, read `fake.Last`. |
| - | What you learned | SOLID recap | recap | `summary: true` card (excluded from `data-total`); one line per principle plus the tie to testing. |

Each drill carries a `pain` (the failure story), a `map` (where the principle
sits in SOLID), `context`, a `snippet` with `{{n}}` blanks, `points`, a
`mermaid` diagram, and per-blank `hints` + step-by-step `explain`.

## Trap-then-fix format
The lesson pairs every principle: an odd-numbered trap drill runs the broken code
on purpose (the L trap's `Run()` intentionally throws and that throw surfaces in
the run output), then an even-numbered fix drill wires the corrected shape. The
`pain` field on the fix drill restates the trap's failure so the contrast is
explicit. This is the same structure as the capstone, at fill-in-the-blank grain
rather than free-writing.

## Runnable
Yes. `toRunnable(drill)` fills every blank with its `answer`, wraps the snippet
in `using System; class __Lab { ... }`, and `runnablePrograms` (index-aligned,
`null` for the summary) feed the per-drill Run button through the shared Roslyn
host (`runnerUrl` is inherited by the engine). The traps are meant to run and
show their bad or throwing behaviour.

## Mermaid usage
Every non-summary drill has a `mermaid` flowchart, loaded from the mermaid@10 CDN
in `level2.html`. The trap diagrams show the tangle/weld; the fix diagrams show
the separated shape. This is the only Practical lesson that leans on Mermaid this
heavily, alongside the capstone milestones.

## Prerequisites
Classes, interfaces, `virtual`/`override`, `enum`, expression-bodied members,
the ternary, `List`-free but reference-heavy code, and dependency injection as a
concept. These come from Part 4 (encapsulation -> dependency-injection), Part 5
(testing, doubles), and the immediately preceding Refactor moves lesson, which
performs each of these moves without the SOLID names.

## Complexity rung
Challenging, and it is a real jump. Refactor moves handles one class at a time;
here several classes, an interface, `virtual`/`override`, and an `enum` can all
appear in a single snippet, and the learner must hold the five-principle map in
mind. The fill-in-the-blank grain softens the jump (the learner completes rather
than writes whole programs), but the conceptual load is the highest in the
Practical track before the capstone.

## Covered well
- Trap-then-fix makes each principle answer a felt problem rather than a
  definition.
- Every fix's `map` connects the principle to its neighbours (e.g. O's fix names
  polymorphism; D's fix names dependency injection and points at testing).
- Blanks are minimal (one class name, one method name) so the cognitive work is
  reading and understanding, not typing.
- The L drills teach `virtual`/`override` inline in the `explain` steps rather
  than assuming them.
- Runnable traps let the learner see the failure, including the Liskov throw.

## Gaps / issues
- **Difficulty jump to Challenging with several classes at once:** a single
  snippet can hold three or more types, which is a steep step up from Refactor
  moves' one-class drills and from the rest of the Practical track.
- **Title drift:** the lesson's `PAGE.title` is "Level 2: SOLID, One Step at a
  Time" and `metaLabel` is "SOLID, one step at a time", while the course card
  and this report call it "The SOLID Principles" - three names for one lesson.
- No `requireSource`/`verify` equivalent exists for drill-engine, so a learner
  can reveal answers and run without demonstrating understanding; grading is
  blank-match only.
- Prism is loaded for snippet highlighting *and* the Roslyn runner is active on
  the same page - a heavier page than the pure-theory drills.
- The I-trap and D-trap snippets model anti-patterns (throwing fakes, welded
  `new`) which is intentional here but relies on the paired fix landing.

## Verification status
Read-only content audit (no compile performed here). The prior work-log records
that all 10 level2 drills were dotnet-verified in an earlier session (9 clean +
1 intentional Liskov throw surfaced correctly).
