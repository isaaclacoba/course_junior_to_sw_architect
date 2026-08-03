# Grading subsystem - design of record

Status: design accepted. Kernel-home decided: `kernel/grading/` (owner, 2026-08-03).

## Context & trigger
`build-engine.js` owns C# output grading inside a DOM-heavy closure: output match,
`requireSource`, hidden probe building, hidden probe running, and expected text.
`tools/verify-lesson.mjs` copied the same policy, including the same `Program`
regex. That is a real drift risk: the tool can certify behavior the browser no
longer has.

There is also a second grading kind. `drill-engine.js` grades fill-in-the-blank
text with `norm()`, `canonical()`, and exact/close checks. That is not C# output
grading. The shared concept is a small `Grader` capability, not one generic rule.

The lesson-platform promotion map says to promote shared modules only when a real
second consumer appears. The trigger has fired: `verify-lesson.mjs` is a second
consumer of the output policy, and `drill-engine.js` proves a second grader kind.
This is a new grading pillar, not a reason to build the parked bus/registry/host.

## Grader seam
A grader is DOM-free. Callers own DOM, XP, navigation, i18n chrome, and editor
state. A runner is injected only when a grader needs to execute code.

```js
Grader = { grade(input, deps) -> Promise<GradeResult> };
GradeResult = { ok, reason, message?, items? };
OutputMatchGrader.grade({ source, output, expected, requireSource, verify }, { run });
BlankMatchGrader.grade({ blanks, values });
```

The role is narrow on purpose. It does not render, localize, store progress, or
know about Monaco/Roslyn if the caller does not pass a runner.

## OutputMatchGrader
First increment extracts the current C# output policy into one plain JS module.
It owns:

- `PROGRAM_CLASS_RE` - the `class Program` replacement point.
- `matches(output, expected)` - string means any trimmed line equals it; array
  means non-empty trimmed lines equal the array in order.
- `unmetRequirement(source, requireSource)` - first failing regex requirement.
- `buildProbe(source, verifyMain)` - keep learner source before `class Program`,
  append `verify.main`.
- `describeExpected(expected)` - current fallback text, with no dependency on
  `LessonCommon.t`.
- `passesHiddenVerify({ source, verify }, { run })` - async, runner injected.
- `gradeOutput({ source, output, expected, requireSource, verify }, { run })` -
  one call that returns the same pass/fail order as the engine.

The module imports no DOM, no CodeLab, and no `dotnet`. Browser code passes
`runner.run`; the Node verifier passes its `compileRun` adapter.

## BlankMatchGrader
This lands later with Workstream B. It moves the blank policy out of
`drill-engine.js`: `norm`, `canonical`, `answersFor`, exact match, close match,
and per-blank result messages. It returns item results such as `correct`,
`almost`, and `wrong`. The drill widget still owns DOM classes, hints, quiz
state, XP, and card flow. Quiz gating remains separate unless a later second
quiz-grading consumer appears.

## Consumers
1. `build-engine.js` consumes `OutputMatchGrader`; it still compiles through
   `CodeLab.RoslynIframeRunner`, shows output/errors, awards XP, and paints chrome.
2. `tools/verify-lesson.mjs` consumes the same `OutputMatchGrader`; visible
   output, `requireSource`, and hidden probes stop using local copies.
3. `drill-engine.js` later consumes `BlankMatchGrader`; `check()` becomes DOM
   plumbing around a tested text policy.

## SOLID fit
- SRP - one module owns C# output policy; one later module owns blank text policy.
- DRY - the browser and verifier stop carrying two copies.
- DIP - graders depend on an injected `run` function, not a Roslyn iframe or
  `dotnet` process.
- OCP - a new grader is a new implementation, not a shared `if build/drill` block.
- ISP - consumers depend on `grade` or specific helpers, not a fat widget type.

## Kernel-home - decided: `kernel/grading/`
The owner chose Option B (2026-08-03): the shared module lands in a new
`kernel/grading/` directory, the first `kernel/` dir. Scope stays narrow - this
holds the DOM-free grading capability only. No bus, registry, host, framework, or
page skeleton lands here; the promotion map still defers those until their own
triggers fire. The alternatives considered were `resource/grading/` (no new
top-level dir, but `resource` means i18n/assets/binders) and a neutral top-level
`grading/` (no existing convention).

## Unit tests enabled
The first increment can add fast Node tests with a fake runner and no DOM:
`matches` string/array behavior, `PROGRAM_CLASS_RE` and `buildProbe`,
`requireSource`, hidden verify success/failure, result ordering, and
`describeExpected`. Workstream B adds blank tests for whitespace, semicolons,
case, alternate accepted answers, and close-vs-wrong classification.
