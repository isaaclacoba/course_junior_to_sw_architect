# Capstone: SOLID in Practice (`level3-exercise/`)

- **Track / Part:** Practical - Part 6 Design for change (final challenge)
- **Engine / format:** capstone / Roslyn WASM host with structural milestone checks
- **Difficulty pill:** Challenging  **XP cards (data-total):** n/a (linked as `data-final="1"`, no per-card XP)
- **Runnable:** yes (compiles and runs real C# in-browser via the Blazor/Roslyn host)  **Theme:** test-automation (`TestRunner`, `ReportFormatter`, `IReporter`)

## Concept(s) taught
The whole of SOLID applied to one program at once. The learner takes a small,
working `TestRunner` that does three jobs and is welded to the console, and
refactors it step by step. Seven milestones light up as the structure improves.
Unlike every other Practical lesson, grading is by **structure** (Roslyn syntax
analysis of the submitted code), not by output match or blank match.

## Source layout
- `CapstoneContent.cs` - `Capstone` static class: `StarterCode`, `ReferenceSolution`,
  and the seven `Milestone[]` (title, pass/todo messages, tiered `Hint`s, an
  explanation, and a per-milestone Mermaid diagram).
- `StructuralChecks.cs` - `StructuralChecks.Run(code)` parses the submission with
  `CSharpSyntaxTree` and runs one `IMilestoneRule` per milestone; `CapstoneSyntax`
  parses once and exposes the nodes every rule needs.
- `CapstoneExercise.cs` - `IExercise` implementation that hands the content and
  `Check(code)` to the generic code-lab host.

## Milestone-by-milestone (what the structural checks enforce)
| # | Milestone | SOLID letter | Pass condition (from `StructuralChecks.cs`) |
|---|---|---|---|
| 1 | A formatter class of its own | S | A non-`TestRunner`/`Program` class exists that *looks like a formatter* (a method taking a `bool`, returning a `string`) or mentions the `PASS`/`FAIL` literals. |
| 2 | TestRunner stops formatting | S | `TestRunner` exists and no longer contains the `"PASS"`/`"FAIL"` literals. |
| 3 | Inject the formatter - don't build it | DI | `TestRunner`'s constructor takes the formatter type *and* `TestRunner` no longer `new`s a `Formatter` inside itself. |
| 4 | Abstract the destination | DIP (seam) | An interface exists with a `Send` method (or an interface whose name contains `Report`). |
| 5 | Depend on the abstraction, injected | DIP | `TestRunner`'s constructor takes an interface parameter, and `TestRunner` neither `new`s a reporter nor touches `Console`. |
| 6 | A second reporter, no edits to the first | O | Two or more classes implement the reporter interface. |
| 7 | Prove substitutability | L | `TestRunner` is constructed with two *distinct* concrete reporter types (counted whether inlined or passed through a local variable). |

The five principles are covered as milestones tagged S (1-2), DI/DIP (3-5), O
(6), and L (7). Interface Segregation is not a separate milestone here - the
program is small enough that no fat interface arises; ISP is left to `level2.js`.

## Format
Write real C# and have it graded structurally. The learner edits the starter in
the code-lab Monaco editor; on Check, the host compiles/runs the code and
`StructuralChecks.Run` walks the syntax tree to decide each milestone. Because
checks are shape-based (does a formatter class exist? does the constructor take
an interface? are two reporter types wired up?), the learner is free to pick
their own names, wording, and ordering - the rules detect intent, not literals.
Each failing milestone returns `CodeAnchor`s pointing at the offending or target
node, and tiered `Hint`s escalate from nudge to a fill-the-hole shape. A worked
`ReferenceSolution` is available.

## Prerequisites
Effectively the whole course to this point. It assumes the learner can already:
extract a class (Refactor moves card 1, Part 4 encapsulation), inject a
dependency (Part 4 dependency-injection, Refactor moves card 3), depend on an
interface (Part 4 interfaces, Refactor moves card 2), add an implementation
without editing the old one (Open/Closed, level2 O drills), and reason about
substitutability (level2 L drills). Part 5 (testing, doubles) motivates why the
reporter seam matters. It is correctly positioned last.

## Complexity rung
The top rung of the Practical track. It removes all scaffolding: no blanks, no
fixed expected output, a whole program to reshape across seven interacting
milestones. The milestone lights and tiered hints keep it approachable, but this
is the one place the learner writes and restructures a full program unaided.

## Covered well
- Structural grading is the right tool: it rewards the shape of the refactor, not
  a magic output string, so the learner cannot fake a milestone with a hardcoded
  value.
- The checks were deliberately made shape-tolerant: `LooksLikeFormatter` detects
  a formatter by its `bool -> string` method rather than the exact `PASS`/`FAIL`
  text, and `DistinctInjectedReporterTypes` counts reporters passed via a local
  variable, not just inline `new` - both noted as fixes in prior work.
- `StructuralChecks` itself models the lesson: one `IMilestoneRule` per
  milestone, added without editing the orchestrator (open/closed), which is the
  principle being taught.
- Milestone explanations resist over-abstraction (milestone 3 injects a plain
  formatter with no interface; milestone 4 explains why the reporter *does* earn
  an interface - a real substitution seam).
- Tiered hints and `CodeAnchor` targeting give graded help without handing over
  the answer.

## Gaps / issues
- **ISP (the I) is absent** from the milestones; a learner who reaches the
  capstone expecting all five letters mirrored will find only S, DI/DIP, O, L. It
  is covered in `level2.js` but not reinforced here.
- **No XP integration:** the card is `data-final="1"` with no `data-total`, so
  the capstone sits outside the XP/progress system the rest of the course uses -
  completion is not tracked the same way.
- Milestone 3's `CreationInRunner("Formatter")` matches any type name containing
  `Formatter`; a learner who named their formatter something without that
  substring could pass the "not built inside" half trivially (the constructor
  half still gates it).
- Milestone 4 accepts either a `Send` method *or* any interface whose name
  contains `Report`, so an unrelated `IReport`-named interface could satisfy the
  seam check on its own.
- Depends on the 72MB Blazor/Roslyn host loading over HTTP; on `file://` or a
  cold cache the Check button stays disabled until the compiler warms up (a known
  boot constraint, not a content gap).

## Verification status
Read-only content audit (no compile performed here). The prior work-log records
end-to-end headless verification of the injected capstone build: the host booted,
rendered all seven milestones from this exercise, and the starter passed zero
milestones as expected. Structural rules were read directly from
`StructuralChecks.cs`.
