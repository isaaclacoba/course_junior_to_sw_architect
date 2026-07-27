# C# capstone exercise - SOLID audit

Scope: a read-only SOLID review of the capstone exercise code in
`level3-exercise/` - `CapstoneContent.cs` (the starter code the learner
refactors, the reference solution, and the seven milestone definitions),
`StructuralChecks.cs` (the Roslyn-based milestone validators), and
`CapstoneExercise.cs` (the `IExercise` wiring). No code was changed.

The exercise premise is stated in `CapstoneContent.cs` and
`CapstoneExercise.cs`: a `TestRunner` that "does three jobs at once and is
welded to the console", which the learner reshapes across seven milestones.
The starter code is therefore an intentional "before" - its violations are the
teaching material, not defects. This audit separates those from real problems
in the validator, harness, and reference solution.

## Intended starting-point violations (the exercise premise)

These live in `Capstone.StarterCode` (`CapstoneContent.cs`, the
`StarterCode` const). They are the whole point of the exercise and are labelled
as such by the brief and the milestones. All are "intended - the exercise
premise".

- **S - one class, several reasons to change.** `TestRunner.Run()` does the
  check (`bool passed = true`), decides the words
  (`passed ? "PASS" : "FAIL"`), and writes the output
  (`Console.WriteLine(report)`). Milestones 1 and 2 exist to split the
  formatting job out. Intended premise.
- **D - high-level code welded to a concrete detail.** `Run()` calls
  `Console.WriteLine` directly, so `TestRunner` depends on the console rather
  than an abstraction. Milestones 4 and 5 introduce `IReporter` and inject it.
  Intended premise.
- **D - dependencies built, not received.** The starter `TestRunner` has no
  constructor; it owns everything internally. Milestones 3 and 5 move
  construction outside. Intended premise.
- **O - not yet open to extension.** With no interface, a new destination would
  mean editing `TestRunner`. Milestone 6 (a second reporter) is the payoff.
  Intended premise.

These are correctly framed. The starter deliberately avoids modelling
anti-patterns the exercise does not later fix (for example there is no public
mutable field), which matches the project's authoring rule.

## Real issues (validator / harness / reference)

Issues here are candidate real problems, not intended teaching material. Most
are minor; none block the exercise.

- **(b) I / structural - `CapstoneSyntax` mixes several responsibilities.**
  `StructuralChecks.cs`, `internal sealed class CapstoneSyntax`. It parses the
  tree, exposes raw node collections (`Classes`, `Interfaces`, `Root`), holds
  the located nodes (`Runner`, `FormatterClass`, `ReporterInterface`), and also
  carries query/predicate logic (`RunnerConstructorTakesInterface`,
  `DistinctInjectedReporterTypes`, `ConcreteReporterType`, `LooksLikeFormatter`,
  `Implements`). It is a shared helper by design - the class comment says it
  keeps rules "free of duplicated parsing and querying" - so this is a
  deliberate trade of a fat helper for thin rules. Worth noting as an ISP/SRP
  smell in the harness, but it is a reasonable, contained choice, not a bug.
- **(b) O - the "never changes" claim on `StructuralChecks` is overstated.**
  `StructuralChecks.cs`, class comment: "adding a milestone means adding a rule
  - this class never changes (open/closed)." Adding a milestone in fact
  requires editing the `Rules` array literal in this same class
  (`new FormatterExtractedRule(), ...`). The rule set is closed to the `Run`
  logic but not fully closed to modification - the registration list is
  hand-maintained here. Minor: a factual overclaim in a comment, not a defect
  in behaviour. **FIXED.** The comment no longer claims the class "never
  changes"; it states that adding a milestone means adding a rule to the
  `Rules` list.
- **(b) correctness - milestone 1 formatter detection can match the wrong
  class.** `CapstoneSyntax.FormatterClass` accepts any non-`TestRunner`,
  non-`Program` class that either `LooksLikeFormatter` (a `bool -> string`
  method) or `MentionsLiterals(..., "PASS", "FAIL")`. A learner who splits the
  check into some other `bool -> string` class, or leaves a stray class quoting
  `"PASS"`/`"FAIL"`, could pass milestone 1 without a genuine formatter. This is
  a deliberate leniency (the `LooksLikeFormatter` comment says detection by
  shape keeps the milestone honest when wording differs), so it is an accepted
  trade-off, but it is a real false-positive surface. Low impact.
- **(b) correctness - milestone 6 counts implementers, not usable second
  behaviour.** `SecondReporterRule` passes when
  `ReporterImplementerCount() >= 2`, i.e. two classes with the interface in
  their base list. An empty second implementer still counts. Given milestone 7
  then requires two distinct injected reporter types, the gap is small, but
  milestone 6 alone does not verify the second reporter does anything. Intended
  leniency, low impact.
- **(b) reference solution - `TestRunner` fields are mutable.**
  `Capstone.ReferenceSolution`: `private ReportFormatter _formatter;` and
  `private IReporter _reporter;` are assigned once in the constructor and never
  reassigned; they could be `readonly`. Idiomatic C# would mark them
  `readonly`. This is a small style miss in the model answer the learner may
  copy from. Cosmetic. **FIXED.** Both fields (and the hint shape) are now
  `readonly` in the reference solution.
- **(b) reference solution - `TestRunner` depends on the concrete
  `ReportFormatter`, not an abstraction.** `Capstone.ReferenceSolution`, the
  `TestRunner` constructor takes `ReportFormatter formatter`. This is
  intentional and is explicitly taught: milestone 3's summary says "we inject a
  plain class, no interface ... Don't reach for an interface until you actually
  need to swap or fake something." So it is (a) intended premise, not a DIP
  violation to fix - the lesson's thesis is that a pure function needs no seam.
  Flagged only because a naive SOLID reading might mistake it for a problem; it
  is deliberate and well justified in the milestone prose.
- **(b) harness - no compile/parse guard in `Check`.**
  `CapstoneExercise.Check` calls `StructuralChecks.Run`, which calls
  `CSharpSyntaxTree.ParseText`. Roslyn parsing tolerates malformed code (it
  produces a partial tree), so this will not throw, but the rules silently
  report "not done" for unparseable input rather than surfacing a syntax error.
  That is acceptable for a structural check that runs alongside a separate
  compile step, so this is informational, not a fault.

## Does each milestone enforce its SOLID letter?

The milestones (`Capstone.Milestones`) and their validators
(`StructuralChecks.Rules`) map to letters as follows. "Enforced" means the
Roslyn rule actually gates on the structure the letter describes.

| # | Milestone | Letter it teaches | Rule | Enforced? |
|---|-----------|-------------------|------|-----------|
| 1 | Formatter class of its own | S (SRP) | `FormatterExtractedRule` - a formatter class exists | Yes (leniently - see false-positive note) |
| 2 | TestRunner stops formatting | S (SRP) | `RunnerStopsFormattingRule` - `TestRunner` no longer mentions `"PASS"`/`"FAIL"` | Yes |
| 3 | Inject the formatter | D (DIP/DI) | `InjectFormatterRule` - constructor takes the formatter type and it is not `new`-ed in `TestRunner` | Yes |
| 4 | Abstract the destination | interface seam (no letter claimed) | `ReporterInterfaceRule` - an `IReporter`-shaped interface exists | Yes, for what it claims |
| 5 | Depend on the abstraction, injected | D (DIP) | `InjectReporterRule` - constructor takes an interface, no reporter `new`-ed, no `Console` in `TestRunner` | Yes |
| 6 | Second reporter, no edits to the first | O (OCP) | `SecondReporterRule` - two implementers of the interface | Partially - counts implementers, does not verify the first was left unedited |
| 7 | Prove substitutability | L (LSP) | `ProveSubstitutabilityRule` - two distinct concrete reporter types injected into `TestRunner` | Yes |

Coverage by letter:

- **S (SRP): enforced** - milestones 1 and 2.
- **O (OCP): enforced, partially** - milestone 6 checks that a second
  implementer exists (extension) but does not check the first reporter was not
  modified (the "closed" half is taught in prose, not validated).
- **L (LSP): enforced** - milestone 7 requires the same `TestRunner` to run
  with two different reporter types.
- **I (ISP): not enforced, and not taught.** No milestone targets interface
  segregation. `IReporter` happens to be a one-method interface, so it is
  already segregated, but nothing in the milestones or rules makes ISP a
  learning objective or a pass condition. The audit's suspicion is confirmed:
  ISP is absent from the milestones.
- **D (DIP): enforced** - milestones 3 and 5. Milestone 3 injects a concrete
  (DI without an interface, deliberately); milestone 5 is full DIP against the
  `IReporter` abstraction.

So the exercise covers **S, O, L, D** across its seven milestones (O only
partially), and **omits I**. Milestone 4 introduces an interface but is framed
as "creating a seam" rather than as ISP, and its summary is careful to say the
formatter got no interface because it needed no seam - which is an argument
against gratuitous interfaces, adjacent to ISP but not ISP itself.

## Verdict

The starter code's SOLID violations are all intentional and correctly framed as
the "before" the learner refactors; none are defects. The harness and reference
solution are sound, with only minor issues: a couple of overstated or
letter-adjacent comments, some deliberate leniency in the milestone-1 and
milestone-6 detectors that can admit false positives, non-`readonly` fields in
the reference `TestRunner`, and an OCP check that verifies extension but not the
"closed to modification" half. The one substantive coverage gap is **ISP: it is
neither enforced by a milestone nor taught** - the exercise delivers S, O
(partially), L, and D. If full SOLID coverage is a goal, ISP is the missing
letter; if the intent is "the five ideas a junior meets first, with ISP
deferred", the current set is coherent and the DIP-without-an-interface framing
in milestone 3 is a genuine strength.
