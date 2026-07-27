# SOLID violations audit

An audit of the repository's **source code** for SOLID violations (Single
responsibility, Open/closed, Liskov, Interface segregation, Dependency
inversion). Four areas were reviewed; each has its own section. The concrete,
low-risk violations have since been fixed (see "Fixes applied" below).

- [Shared JS engines](solid/engines.md) - `build-engine.js`, `drill-engine.js`, `page-shell.js`
- [C# capstone exercise](solid/capstone-csharp.md) - `level3-exercise/*.cs`
- [Lesson example code](solid/lesson-examples.md) - content check, not a source-code fix target
- [code-lab component (TypeScript)](solid/code-lab.md) - `code-lab/src/`

## Summary

| Area | SOLID health | Biggest source-code issue |
|---|---|---|
| Shared JS engines | Weak | Monolithic IIFEs (SRP) + hard global/`localStorage` coupling (DIP) - untestable outside a live browser |
| C# capstone | Good | A couple of lenient milestone detectors; fields that should be `readonly` |
| code-lab (TS) | Strong core, some adapter leaks | Editors not injectable (OCP); a god-object `Step` shape (SRP) |

Scope: this audit and its section files are about SOLID violations in the
**source code**. The separate ["does the course practice what it preaches?"](solid/lesson-examples.md)
check is a content review and is kept out of the fix list below.

## Cross-cutting themes (source code)

1. **Duplication across the JS layer (DRY/SRP).** `escapeHtml`, `renderInline`
   and card-from-hash logic were copied between `build-engine.js` and
   `drill-engine.js` (and `escapeHtml` appears ~5 times in `code-lab/src`).
2. **DIP / testability in the browser layer.** The engines hard-depend on
   `localStorage`, `window.CodeLab`, `monaco`, `Prism` and `mermaid` with no
   injection seam, so grading and XP can't be unit-tested. code-lab's `core/` is
   the counter-example - genuinely DOM-free and unit-tested - but its DOM
   adapters still reach for globals (`getElementById("courseXpLabel")`, untyped
   `window.monaco`, a hard-coded `localStorage` in the quiz).
3. **OCP by branching, not extension.** `page-shell.js` hard-codes archetype
   branches and the entire course order; both engines inline their grading
   strategy; `code-lab` picks editors with an `EditorKind` enum + `if/else`
   while its `runner`/`highlighter` are cleanly injectable. New archetypes,
   graders or editors mean editing closed code.
4. **Capstone reference solution.** `TestRunner` held its `_formatter` and
   `_reporter` in mutable fields though both are assigned once in the
   constructor; and `StructuralChecks`'s header comment overstated OCP ("this
   class never changes"), while adding a milestone edits its `Rules` list.

## Fixes applied

- **DRY (engines).** `escapeHtml`, `renderInline` and `cardFromHash` now live
  once in `page-shell.js` (`window.LessonCommon`); both engines delegate to it.
  See [engines.md](solid/engines.md).
- **Capstone `readonly`.** `TestRunner._formatter` / `_reporter` (and the hint
  shape) are now `readonly` in the reference solution.
  See [capstone-csharp.md](solid/capstone-csharp.md).
- **Overstated OCP comment.** `StructuralChecks`'s header no longer claims the
  class "never changes"; it states that adding a milestone means adding a rule
  to the `Rules` list.

## Open source-code items (not yet fixed)

1. Split the two monolithic engine IIFEs by concern (SRP), or at least extract
   the remaining duplicated `showOutput` / `showErrors` / XP blocks - deferred
   because they are stateful (bound to different element containers) and share
   less than the pure helpers already extracted.
2. Introduce an injection seam for `localStorage` (and the runner URL) in the
   engines so grading/XP become testable (DIP).
3. Tighten the two lenient capstone detectors (milestones 1 and 6) so a
   false-positive shape cannot pass; verify milestone 6 also checks
   "closed to modification", not just that a second implementer exists.
4. In code-lab, allow injecting a custom `EditorAdapter` (match the
   already-clean `runner`/`highlighter` seams) and split the `Step` shape into
   per-scene discriminated types. (code-lab is a submodule; a fix needs a
   rebuild + re-vendor.)

## Verification status
The section files are a static review of the actual source. The fixes above were
applied and verified: `node --check` on the three touched JS files, and a
headless render of a build page (`control-flow.html`) and two drill pages
(`reading-objects.html`, `theory-1.html`) - all render their first card with
inline code/bold and zero `undefined`.
