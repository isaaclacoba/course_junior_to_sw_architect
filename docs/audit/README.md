# Course content audit - cycle 1

A read-only pedagogy audit of every lesson in the course, one report per lesson,
plus the shared infrastructure. The two tracks (Practical and Theory) are audited
independently. Nothing here changes lesson content - it is the map you refactor
from.

## How to read this

- Per-lesson reports: [Practical index](practical/index.md) -
  [Theory index](theory/index.md).
- Shared engines and page scaffold: [infrastructure.md](infrastructure.md).
- Report shape: [TEMPLATE.md](TEMPLATE.md). Coverage tracker:
  `./check-progress.sh` (50 / 50 lesson reports present).
- Source-of-truth list of required reports: `manifest.txt`.

Prior audits (four rounds, recorded in the VS Code transcripts) drove the current
shape of the course. Several gaps they raised are now **closed**: a `Lambdas`
lesson exists before LINQ, a full testing arc exists (Part 5), and the theory
track gained Parts 3 and 4 plus four checkpoints. This audit reassesses the
grown course and separates what is now solid from what is still open.

---

## Practical track

### What is covered

A complete beginner-to-design ladder in six Parts:

1. **Understand the ideas** - the OO vocabulary named once (`Foundations`),
   drilled (`Practice the Basics`), then the raw control flow, methods, object
   reading, and reuse-vs-composition intuition.
2. **Build it for real** - the first write-from-scratch lessons.
3. **Know the language** - the everyday surface: collections, data shapes,
   lambdas, LINQ, errors and null, generics.
4. **Design with objects** - encapsulation, interfaces, polymorphism,
   composition, dependency injection (the five "why" lessons).
5. **Prove it works** - what a test is, test doubles, testable design.
6. **Design for change** - refactor moves, the five SOLID principles, and the
   in-browser capstone.

The spine is coherent: vocabulary, then language, then object design, then
testing, then SOLID, ending in one compiled refactor exercise.

### What is not covered (cycle 2 candidates)

- `async`/`await` and `Task` - concurrency is absent from the practical track.
- `abstract`/`virtual`/`override` as a focused lesson - used and named in passing
  (`Reuse Without Regret`, `Practice the Basics` drill 10) but never taught in
  its own rung.
- Pattern matching, `switch` expressions, `is` type tests.
- Strings and parsing, formatting, culture.
- File I/O and HTTP in real C# (the theory track introduces the ideas; the
  practical track never writes them).
- LINQ aggregation and grouping: `Sum`/`Min`/`Max`/`Average`/`GroupBy`/`ToList`
  are not shown, so LINQ stops at filtering and projecting.
- Collections beyond `List` and `Dictionary`: arrays, `HashSet`, tuples.
- An architecture/layering bridge above SOLID (the capstone is the current
  ceiling).

### Cross-cutting issues to fix before cycle 1 is "closed"

1. **Untaught syntax used before it is introduced.** `=>` (expression-bodied
   members and lambdas), the ternary `?:`, `$"..."` interpolation, `var`,
   `static`, and nullable `string?` all appear in earlier lessons than any
   explanation. Either introduce each once, early, or avoid it until taught.
   > Progress 2026-07-31: DONE. `string?` (`foundations` t5) and `$"..."`
   > (`strings` t0) were already introduced at first use in the grown course.
   > Added one-time notes at the earliest appearance of the rest: `static` +
   > `var` in `foundations` (t1/t2), ternary `?:` in `control-flow` t1 (before
   > its first use in `linq`), and expression-bodied `=>` in `reuse-without-regret`
   > step 1 (before `lambdas` teaches the lambda `=>`).
2. **Ordering inversions.** `First Builds` (Part 2) uses interface + injection +
   open/closed as a taster long before Part 4 teaches them; `Data shapes` (Part
   3) formally teaches properties and `enum` after earlier lessons already used
   them; `Generics` follows `List<T>` use. The taster is defensible, but the
   later "first real teaching" cards should acknowledge the earlier exposure.
3. **SOLID mapping is left implicit** across all five Part 4 lessons and the
   testing/refactor lessons. Each lesson IS a SOLID letter (S/O/L/I/D) but never
   says so, so the capstone's principle names arrive without a back-reference.
4. **Grading holes.** `writing-methods`, `lambdas`, `testing-basics`,
   `test-doubles` and `first-builds` set no hidden `verify` probe, so a hardcoded
   constant can pass. Copy the probe pattern from `data-shapes`/`generics`.
5. **Two high-value lessons are not runnable** - `Control Flow` and `LINQ` - even
   though the engine supports it and sibling lessons use it.
6. **Theme split.** `First Builds`, `The SOLID Principles`, the testing arc and
   the capstone use a test-automation/reporter flavour, while Part 4 uses
   animals. Pick one running example family per Part so the learner is not
   re-oriented each lesson.
7. **Capstone milestones omit ISP** (the `I`), so the one integrative exercise
   does not exercise every principle it teaches.
8. **Difficulty spikes.** `Practice the Basics` drill 10 and `The SOLID
   Principles` jump to several classes at once; add a step between.

---

## Theory track

### What is covered

A from-zero mental model in four Parts, taught with the `MemoryViz` visual widget
(no code writing), each Part sealed by a checkpoint quiz:

1. **What a computer is** - program, running, start-up, processes, numbers,
   encoding, the OS.
2. **How code works** - languages, variables, types, statements/expressions,
   decisions/loops, functions, bugs.
3. **How software runs and connects** - where data lives (stack/heap),
   references vs values, compile vs run time, saving to files, networking.
4. **The development world** - standing on other code (libraries/dependencies)
   and how code is shared (version control).

This is a genuinely gentle, well-sequenced foundation for an absolute beginner.

### What is not covered (cycle 2 candidates)

- **Foundations of good code** - naming, duplication, abstraction, readability -
  the planned theory bridge from "how code works" to "how to design" is missing;
  Part 4 jumps to tooling instead.
- Databases and persistence beyond a single file.
- Security basics (permissions are touched; auth, secrets, injection are not).
- Deeper networking (the internet, addresses, protocols) past client/server.
- Concurrency concepts to partner the practical `async` gap.
- How a compiler/interpreter works, past the one build-and-run lesson.

### Issues to fix before cycle 1 is "closed"

> Progress 2026-07-27: items 1, 2, 3 and 5 addressed; item 4 raised (askCount now
> 7/7/10/7). Remaining: distractor quality in the checkpoints.

1. **~21 dead sibling data files.** DONE - moved to `archive/theory-drills/`
   (git history preserved); the shipped pages load only `theory-N.viz.js`.
2. **Part 4 ordering.** DONE - kept the teaching order `theory-21` (Standing on
   other code) then `theory-20` (How code is shared); the card order in the index
   matches it. File numbers (20/21) are legacy and do not drive order; no rename.
3. **`theory-7` has no closing synthesis** step. DONE - added a closing recap
   step so Part 1's rhythm is consistent (now 5 steps).
4. **Checkpoints under-sample.** Partly addressed - `askCount` raised from 5 to
   7/7/10/7 (Parts 1-4) so each pass covers most of the Part. Distractor quality
   (some options too easy) is still open.
5. **`theory-18` intro overpromises.** DONE - the intro no longer promises
   databases; it matches the file-focused lesson.

---

## Closing cycle 1

Cycle 1 is "a gap-free introductory ladder on both tracks, with a repeatable
lesson structure and no load-bearing concept used before it is taught." To get
there:

- DONE - Removed the dead theory `.js` files (archived) and settled the single
  theory engine (`theory-N.viz.js`).
- DONE - Introduced (once, early) every syntax token that was used before it was
  taught: `static`/`var` in `foundations`, ternary `?:` in `control-flow`,
  expression-bodied `=>` in `reuse-without-regret`; `string?` and `$"..."` were
  already introduced at first use.
- DONE - `Control Flow` and `LINQ` are now runnable (LINQ is a build lesson).
  Still to do: add the missing hidden `verify` probes to the other build lessons.
- State the SOLID letter each Part 4 / Part 5 / Part 6 lesson embodies, and add
  the ISP milestone to the capstone.
- Normalise one example family per Part and smooth the two difficulty spikes.
- DONE (theory rhythm) - fixed the `theory-20`/`theory-21` order, added the
  `theory-7` recap, corrected the `theory-18` intro, and widened checkpoint
  coverage. Still to do: the missing practical recaps and checkpoint distractors.

None of these add new topics - they make the existing ladder airtight.

## Starting cycle 2

Cycle 2 is the next tier, built gently on a closed cycle 1, at the same slow
pace (this course is a year-long climb for a very-junior audience - no
bachelor-speed jumps). Build it as new Parts appended to each track, each new
lesson resting on a cycle-1 rung already taught:

- **Practical Part 7+** - `async`/`await`; focused `abstract`/`virtual`; pattern
  matching; strings and parsing; file I/O and HTTP; LINQ aggregation and
  grouping; more collections; then an architecture/layering bridge above SOLID.
- **Theory Part 5+** - foundations of good code (naming, duplication,
  abstraction) as the missing bridge; databases; security basics; deeper
  networking and the internet; concurrency concepts.

Sequence each new Part the same way this audit reads the current one: one idea
per card, a recap to close, a checkpoint to seal, nothing used before it is
taught.
