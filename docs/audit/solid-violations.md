# SOLID violations audit

A read-only audit of the repository's code for SOLID violations (Single
responsibility, Open/closed, Liskov, Interface segregation, Dependency
inversion). Four areas were reviewed; each has its own section. No code was
changed.

- [Shared JS engines](solid/engines.md) - `build-engine.js`, `drill-engine.js`, `page-shell.js`
- [C# capstone exercise](solid/capstone-csharp.md) - `level3-exercise/*.cs`
- [Lesson example code](solid/lesson-examples.md) - does the course practice what it preaches?
- [code-lab component (TypeScript)](solid/code-lab.md) - `code-lab/src/`

## Summary

| Area | SOLID health | Biggest issue |
|---|---|---|
| Shared JS engines | Weak | Monolithic IIFEs (SRP) + hard global/`localStorage` coupling (DIP) - untestable outside a live browser |
| C# capstone | Good | ISP is neither enforced nor taught; a couple of lenient milestone detectors |
| Lesson example code | Strong | One mild gap: Foundations models public fields with no later back-reference |
| code-lab (TS) | Strong core, some adapter leaks | Editors not injectable (OCP); a god-object `Step` shape (SRP) |

The teaching content is in good shape - the course largely practices the SOLID
it preaches. The weakest code is the two lesson **engines**, which are internal
plumbing (not learner-facing), and the most important gap is a **content** one:
**ISP**.

## Cross-cutting themes

1. **ISP is the weak letter (highest-value fix).** The capstone enforces S, O,
   L and D but not **I** (interface segregation), and the earlier content audit
   found ISP is not taught as its own idea either. A course that teaches SOLID
   should close the `I`: add an ISP milestone to the capstone and a short lesson
   or card that motivates splitting a fat interface.
2. **Duplication across the JS layer (DRY/SRP).** `escapeHtml`, `renderInline`,
   the XP/`localStorage` block and card-from-hash logic are copied between
   `build-engine.js` and `drill-engine.js`, and `escapeHtml` appears ~5 times in
   `code-lab/src`. One shared helper would remove drift risk.
3. **DIP / testability in the browser layer.** The engines hard-depend on
   `localStorage`, `window.CodeLab`, `monaco`, `Prism` and `mermaid` with no
   injection seam, so grading and XP can't be unit-tested. code-lab's `core/` is
   the counter-example - genuinely DOM-free and unit-tested - but its DOM
   adapters still reach for globals (`getElementById("courseXpLabel")`, untyped
   `window.monaco`, a hard-coded `localStorage` in the quiz).
4. **OCP by branching, not extension.** `page-shell.js` hard-codes archetype
   branches and the entire course order; both engines inline their grading
   strategy; `code-lab` picks editors with an `EditorKind` enum + `if/else`
   while its `runner`/`highlighter` are cleanly injectable. New archetypes,
   graders or editors mean editing closed code.
5. **The content itself is disciplined.** The Part 4/5/6 lessons frame every
   anti-pattern as an explicit "before" fixed by a later task and gated by a
   `requireSource` rule plus a hidden `verify` probe. There is no over-
   abstraction either - `refactor-moves` and capstone milestone 3 deliberately
   keep injected plain classes and warn against reaching for an interface too
   early.

## Prioritised recommendations

Content (learner-facing, highest value):
1. **Close ISP.** Add an interface-segregation milestone to the capstone and
   teach the idea (a fat interface forcing empty implementations, split into
   focused ones). This is the one SOLID letter the course under-serves.
2. **Fix the Foundations back-reference.** Foundations models `public string
   Name` / `public int Temp` poked from `Main`; once encapsulation is taught in
   Part 4, add a one-line callback so the early public field is not left looking
   like the norm. (Mild - see [lesson-examples.md](solid/lesson-examples.md).)
3. Tighten the two lenient capstone detectors (milestones 1 and 6) so a
   false-positive shape cannot pass; verify milestone 6 also checks
   "closed to modification", not just that a second implementer exists.

Internal code health (not learner-facing, lower urgency):
4. Extract the duplicated `escapeHtml` / `renderInline` / XP helpers into one
   shared module used by both engines (and align with code-lab's).
5. Introduce an injection seam for `localStorage` (and the runner URL) in the
   engines so grading/XP become testable.
6. In code-lab, allow injecting a custom `EditorAdapter` (match the
   already-clean `runner`/`highlighter` seams) and split the `Step` shape into
   per-scene discriminated types.

## Verification status
Read-only static review of the actual source. No code compiled or changed. Each
finding in the section files is grounded in a specific file and location.
