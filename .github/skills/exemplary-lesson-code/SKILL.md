---
name: exemplary-lesson-code
description: >-
  Write the C# that ships inside a lesson of this course to the mandatory
  exemplary-code standard. USE FOR: authoring or reviewing a build lesson's
  `starter`, `solution`, `runnablePrograms` or example snippet; naming,
  magic numbers, SOLID and warning-free compilation in lesson code; deciding
  what an anti-pattern example may show. DO NOT USE FOR: lesson prose, cards
  or archetypes (use lesson-authoring); engine or runner changes (see
  copilot-instructions).
---

# Exemplary code in a lesson

Every line of C# a learner sees is a worked example, whether or not it is the
point of the card. This standard is mandatory and was split out of
`lesson-authoring` so it can be read on its own when reviewing code.

## Every line of C# you ship is a worked example - MANDATORY

This course teaches people to write maintainable code. **Every C# line in a
lesson is therefore a worked example of the standard being taught**, and that
includes the parts that feel like scaffolding: `starter`, `solution`,
`verify.main`, `example`, and every runnable program. A student copies what they
see. Ship a sloppy `Main` and you have taught sloppiness, whatever the prose says.

This is not a style preference. A lesson whose own code breaks the rules it is
teaching is **broken content** and must not ship.

`example` deserves a special mention, because it is the one field an author is
tempted to treat as a scratch note. It is not. It renders on the card, in the
left column, above the goal - it is the first C# the learner reads, before they
have written anything, and it is the thing they pattern-match against. Hold it
to exactly the same bar as `solution`.

We learned this the hard way: the example box was built, styled and authored on
135 cards, but nothing ever un-hid it, so for a long time nobody saw any of it.
When it was finally switched on, 20 of those examples turned out to be breaking
the naming rule this very lesson set teaches - `int n`, `double x`, `string s`.
They had been flagged by `validate.mjs` the whole time and ignored, because a
warning about invisible content feels harmless. It is not: content nobody looks
at rots, and then it ships all at once. Treat an exemplary-code warning as a
blocker even when you cannot see the thing it is complaining about.

### What "proper coding guidelines" means here - concretely

Do not guess at this list. It is the whole rule.

1. **Names say what the thing IS.** No single letters, no abbreviations.
   `hoursSinceMeal`, not `h`. `hungryCount`, not `n`. `cat`, not `c`.
   The ONLY accepted single letter is a generic type parameter (`T`).
2. **No magic numbers or magic strings.** A literal that carries meaning gets a
   named constant: `const int HoursUntilHungry = 6;`. A bare `>= 6` in two places
   is exactly the duplication this course spends a whole Part teaching people to
   remove. Loop seeds (`0`), identity values (`1`) and array sizes are fine.
3. **One rule lives in ONE place.** No copy-pasted condition, no parallel
   `if`-chain repeating a decision another type already owns.
4. **A method does one job**, and its name says which. If the name needs "and",
   split it.
5. **Depend on the abstraction** once the lesson has introduced interfaces: take
   `ILog`, do not `new ConsoleLog()` inside the class that uses it.
6. **Fields are `private`**, exposed through a method or property when needed.
7. **No dead code, no commented-out code, no `TODO` left in a `solution`.**
8. **Formatting is uniform**: Allman braces, four spaces, braces even on a
   one-line `if` body, one statement per line, `PascalCase` for types/methods,
   `camelCase` for locals/parameters, `_camelCase` for private fields.

### The one deliberate exception

A lesson often has to SHOW bad code in order to fix it - that is the entire
pedagogy of the SOLID Part. That is allowed in exactly one place: the `starter`
of a card whose stated job is to repair it, and the flaw must be the one the
card is about.

That exception is narrow, and it is not a licence to be sloppy elsewhere:

- The flaw is **the lesson's subject**, never incidental. A card about removing
  a duplicated rule may ship the duplicated rule. It may NOT also ship `n` and
  `h` as variable names - that is unrelated sloppiness riding along.
- **Everything else in that starter still meets the full standard.** Good names,
  named constants, clean formatting - so the flaw stands out instead of drowning
  in noise.
- **The `solution` is always exemplary.** No exceptions. It is the last thing the
  student reads and the thing they will copy.
- Mark it for the reader (`// The desk repeats the rule the Cat already owns.`)
  so nobody mistakes the flaw for the house style.

### Worked example - the real bug this rule was written for

The SOLID lesson taught "one rule, one place" while its own code read:

```csharp
public int HungryCount(List<int> hours)
{
    int n = 0;
    foreach (int h in hours)
    {
        if (h >= 6) n++;      // magic number, single-letter names, no braces
    }
    return n;
}
```

Three violations the card never intended to teach: `n`, `h`, and a bare `6`. The
card's actual subject was the duplicated `>= 6` rule. Corrected - the duplication
stays (it IS the lesson), everything else meets the standard:

```csharp
public int HungryCount(List<Cat> cats)
{
    // The desk repeats the rule the Cat already owns - card 2 removes this.
    const int HoursUntilHungry = 6;
    int hungryCount = 0;
    foreach (Cat cat in cats)
    {
        if (cat.HoursSinceMeal() >= HoursUntilHungry)
        {
            hungryCount++;
        }
    }
    return hungryCount;
}
```

`tools/validate.mjs` gates the mechanical half of this (single-letter names,
magic numbers). The rest is your judgement - the gate is a floor, not the bar.

### The compiler is part of the marking, so your solution must be warning-clean

The run surface shows the learner a curated set of compiler **warnings**, not just
errors. These are the diagnostics that mean "this line cannot be doing what it
looks like it does": a comparison or assignment with the same thing on both sides,
unreachable code, a variable or field written but never read, a condition whose
answer never changes.

That has a direct consequence for authoring: **if a task's `solution` trips one of
those warnings, the learner is shown a warning panel sitting on top of the answer
we just told them was correct.** So it is a hard failure, not a nitpick, and
`tools/verify-lesson.mjs` fails the lesson with the exact ids it saw:

```
FAIL task 1 "..." solution compiles with warning(s) the learner would be shown: CS0219
```

The list lives in `TeachingWarningIds` in
`code-lab/compiler-host/Services/CompilerService.cs`, mirrored in
`SHOWN_WARNING_IDS` in `tools/lib/lesson-validators.mjs`. **Change one and you must
change the other**, or the tool will pass content the runtime then complains about.

### Adding a diagnostic the learner can see

Three tables in `CompilerService.cs` describe a diagnostic, and a diagnostic is only
finished when it appears in the right ones:

| Table | Answers | Required |
|---|---|---|
| `TeachingWarningIds` | should we show this warning at all? | warnings only |
| `FriendlyHint` | what is wrong, in plain words | **always** |
| `WhyHint` | the idea behind it, behind "Learn why" | **always** |

Miss `WhyHint` and nothing breaks loudly - the panel just renders with no "Learn why"
link, which reads as "this feature is not built" rather than "this entry is
incomplete". That is precisely how ten of the most common errors a beginner hits
(missing `;`, missing `}`, unknown name) shipped with no explanation at all.
`code-lab/test/compiler-hints.test.ts` now fails on any table that drifts out of step.

Write `FriendlyHint` as the sentence you would say pointing at the screen. Write
`WhyHint` as the reason the rule exists - the concept, never the fix. The learner
opens it because they want to understand, not because they want the answer pasted in.
Both are course prose: plain, warm, spaced hyphen ` - `, no compiler jargon left
unexplained. Note that this text comes from the C# host and is **English only** - it
does not pass through `self.t()`, so the panel's headings translate but the
per-diagnostic text does not.

One id is deliberately in the host list but NOT in the tool's: **CS8618**
(uninitialised non-nullable field). `dotnet new console` enables nullable reference
types and the browser host does not, so the verifier sees CS8618 on code the
learner is never warned about. Failing on it would fail lessons over a diagnostic
that does not exist where it matters, so it is reported as a note. Still fix it -
`public string Name { get; set; } = "";` - because a string field that starts null
is a real defect, just not one the browser will point at.

Two things follow for the prose you write:

- A `starter` MAY trip a warning when that warning is the lesson's subject - the
  same narrow exception as above. That is a feature: the learner runs the broken
  starter and the compiler explains the flaw in the same words the card does.
- Never write a card whose success depends on the learner NOT noticing a warning.
  If the card passes while the compiler is objecting, the card is wrong.

### Correct output is not proof of correct code

This is the reason the warnings are shown at all, and it is worth stating in the
lessons themselves where it fits.

A reader of the SOLID card wrote `hoursSinceMeal >= hoursSinceMeal`. It compiles.
It runs. It prints `FEED`, which is exactly what the visible card asked for. It is
also always true, so the method has stopped deciding anything at all - and only
the hidden `verify` probe, which passes a different number, caught it.

**A card that only checks the visible output can be passed by code that does not
work.** That is what `verify` is for, and it is why a build task that makes a
decision should nearly always have one. Write the probe so it passes an input the
visible run does not use.
