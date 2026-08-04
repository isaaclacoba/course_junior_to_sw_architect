---
name: lesson-authoring
description: >-
  Author or edit a lesson in the C# junior-to-architect course (this repo).
  USE FOR: adding a new theory/drill/build/checkpoint lesson; editing lesson
  prose (intro, concept, context, goal, quiz, summary); choosing the right
  archetype (build/drill/viz/checkpoint); getting XP/total and prefix conventions
  right; writing the lesson's C# to the course's mandatory exemplary-code
  standard (naming, no magic numbers, SOLID); verifying a lesson compiles and
  renders. DO NOT USE FOR: changing the
  engine itself (the generic `kernel/engine/` core + its plugins, or page-shell)
  or the Roslyn/Blazor host (that is engine work, see copilot-instructions);
  auditing existing content (use the course-audit skill).
---

# Authoring a lesson

You are adding data fed to an existing engine. You are not building an engine,
runner, editor, or page controller. If you think you need one, re-read
`.github/copilot-instructions.md` - you are almost certainly wrong.

## Read first (in order)

1. `docs/SPECS.md` - the repeatable lesson-structure spec, starting with the four
   principles (portability, ledger-enforced ordering, runnable-by-default,
   grade-for-understanding).
2. `docs/concept-ledger.md` - the portable syllabus. Find the row your lesson
   belongs at; you may use only concepts at or above it.
3. `AGENTS.md` (root) - the prose voice rules. Non-negotiable, and iterated: when
   your prose misses the author's voice, expect the author to sharpen `AGENTS.md`
   and ask you to regenerate.
4. `.github/copilot-instructions.md` - architecture (the one generic engine +
   archetype plugins) and the generated "How to add a lesson" flow.
5. `.github/instructions/code-editor.instructions.md` - Monaco-only, reuse-first.
6. `docs/audit/README.md` - what already exists, so you slot in without
   duplicating or contradicting a neighbour, and so you avoid the known traps.

## Procedure

Every lesson lives in the generated, per-directory layout
(`content/<track>/<NN-part>/<NN-lesson>/`) - all 83 are migrated. Author only
through the generated flow below; the old flat `<name>.js` + `<name>.html` layout
and the per-archetype engines it loaded are gone.

1. **Log start** in `docs/work-log.md` with a real `date` timestamp.
2. **Place the lesson**: which track (Practical / Theory) and which Part. Find its
   row in `docs/concept-ledger.md`; read the neighbours' reports in
   `docs/audit/<track>/` so the new rung follows from the previous one and uses
   only concepts at or above its ledger row.
3. **Pick the archetype** from the SPECS table. For a practical lesson prefer
   `build` (real code, Run) over `drill`. `build`, `viz`, and `checkpoint` all
   have live instances under `content/` and run through the generic engine + their
   plugin; `drill` is scaffoldable but has no live instance yet. Copy the closest
   existing lesson's data as the structural starting point.

### Target flow (generated) — for new or migrated lessons

4. **Scaffold** with `node tools/new-lesson.mjs --new --track <t> --part
   <NN-part> --id <id> --archetype <build|drill|viz|checkpoint> --title "..."`, or
   migrate a flat lesson with `node tools/new-lesson.mjs --from <name>.js`. This
   creates `content/<track>/<NN-part>/<NN-lesson>/` and appends one line to
   `course-registry.js`.
5. **Fill `meta.js`** (`window.LESSON_META`): `id`, `key`, `total`, hero fields
   (`docTitle`, `eyebrow`, `title`, `intro`, `blurb`), `pill`, `time`,
   `archetype`, and the `concepts` graph
   `{ introduces:[{id,term,def}], revisits:[{id}], uses:[{id}] }`. A concept's
   `def` lives ONLY in the one lesson that introduces it.
   - `--new` does NOT seed `concepts` (only `--from` does) - fill them by hand: the
     `introduces`/`revisits`/`uses` ids + edges go in this `meta.js`, and each
     introduced concept's `term`/`def` go in this lesson's
     `res/strings/default/en.json` as `concept.<id>.term` / `concept.<id>.def` (with
     the `es.json` translation beside it). If this lesson is the sole introducer of a
     concept, its `introduces` entry MUST stay, or `validate.mjs` fails downstream
     where another lesson revisits/uses it.
6. **Fill `data.js`** with the lesson content (`window.LESSON_CONFIG` - the one
   global for every archetype; a viz lesson sets it in `viz.js`) to the config
   shape in SPECS. Honour the principles and cadence invariants (below).
   Do NOT put `nextHref`/`nextLabel` in the data file; nav derives from the
   registry.
   - A build `starter` may intentionally NOT compile when the objective is to
     WRITE a type/inheritance/member - the compile error is the teaching signal.
     Keep a stub compiling only when the learner fills a body, not when they must
     declare the shape.
7. **Generate and validate**: `node tools/generate.mjs` writes
   `generated/course-data.js`, `generated/concept-index.js`, and the lesson's
   `content/.../index.html`; then `node tools/validate.mjs` checks alignment.
   - The lesson's `index.html` is GENERATED - never hand-edit it.
   - Order comes from `course-registry.js` array order, not filenames; the `NN-`
     dir prefixes are cosmetic.
   - Do NOT hand-wire a card into the root `index.html`; the card data comes from
     `meta.js` via `generated/course-data.js`.
   - **Localize the card (lesson-owned).** The lesson's own bundle carries its
     card text: for every target language the site ships (currently `es`), add
     `card.title` and `card.blurb` to `res/strings/default/<lang>.json`, alongside
     `hero.title` and the rest. The generator collects these into
     `generated/landing-i18n.<lang>.json` (what the index reads); there is NO
     central `res/landing` file any more. A card left untranslated renders English
     on the path while the lesson inside is Spanish - so `check-i18n` and
     `verify-lesson` (step 9) fail if you forget, the same as any other key. Match
     the neighbours' voice and the lesson's own `hero.title`.
   - **If this lesson opens a NEW Part**, translate the Part chrome in
     `course-registry.js`: add `i18n: { es: { title } }` to the part, and (for a new
     track) `i18n: { es: { name, kicker, blurb, partPrefix } }` to the track, next to
     the English. The part kicker ("Parte cinco") is DERIVED from `partPrefix` + a
     localized ordinal - do not hand-write it. The landing gate fails on any track or
     part missing its i18n block.
8. **Update `docs/concept-ledger.md`** in this same change: add or move the
   lesson's row and any concept/surface it introduces.
9. **Verify** with the one-command harness: `node tools/verify-lesson.mjs
   <lesson-dir>`. It runs the whole SPECS recipe - `node --check`; real-`dotnet`
   compile of every runnable program and the rebuilt `verify` probe; viz
   scene-resolver checks on every step; headless EN+ES render with no
   `undefined`; and a global landing-chrome gate (every track + part in
   `course-registry.js` must carry a full i18n block for each language a lesson
   targets; cards are covered by the per-lesson check) - and exits non-zero on
   failure. Add `--no-dotnet` / `--en-only` to iterate faster. It cleans up after
   itself, so there is nothing to delete.
10. **Log end** in `docs/work-log.md` with a real `date` timestamp.

## Preflight checklist (run before calling it done)

- [ ] Every concept and token used is at or above this lesson's ledger row.
- [ ] No C#-only sugar used before its ledger row (`=>`, `var`, `$"..."`, records).
- [ ] One idea per card; a recap closes a multi-card lesson.
- [ ] **Prose reads like a person wrote it**: full sentences, no fragments, no
      `**Term:** definition` headers replacing prose. Re-read `AGENTS.md` and
      apply the read-aloud test. Existing prose that already passes was NOT
      rewritten to hit a word count.
- [ ] Prose is formatted: lists use `- ` bullets (never comma-packed), distinct
      points use blank-line paragraphs, `**bold**` for the new term, `code` in backticks.
- [ ] Runnable if it produces visible output.
- [ ] **Every C# line is exemplary**: no single-letter names, no magic numbers,
      one rule in one place, private fields, uniform formatting - in `starter`,
      `solution`, `verify.main` and `example` alike. The only bad code allowed is
      the specific flaw a card exists to fix, and its `solution` is still clean.
- [ ] **Every `solution` compiles warning-free.** `verify-lesson` fails on the
      warnings the learner is shown (CS1718, CS0219, CS0162, ...) and notes
      CS8618. A warning on the answer we call correct is broken content.
- [ ] Build tasks have a technique gate AND a hidden `verify` probe, and the probe
      passes an input the visible run does NOT use - otherwise code that only
      looks right can pass the card.
- [ ] **The goal tracker is granular**: every member the solution adds has its
      own row, every move inside a method body has its own step row, and every
      goal starts RED on the starter. See "The live goal tracker".
- [ ] SOLID letter stated if this is a design/testing/refactor lesson.
- [ ] One example family for the Part; difficulty rises one rung.
- [ ] `awardedKey == data-key`; `data-total` excludes the recap; unique `prefix`.
- [ ] Ledger updated; work-log start and end logged.

## The live goal tracker - `goals`

A build card's `goals` array is what the learner watches while they type. It is
rendered as UML class boxes, and it is the single biggest driver of whether a
student feels guided or lost. Index-aligned with the localized `task.N.goal.M`
prose, which becomes the caption inside each box.

```js
goals: [
  {
    code: ["class Cat", "int _hoursSinceMeal", "Cat(int hoursSinceMeal)", "bool IsHungry()"],
    gate: { type: "Cat", member: "IsHungry" }
  },
  { gate: { absent: "CheckAndSign" } },   // a removal - struck-through box
  { gate: null }                          // behaviour: only a passing Run ticks it
]
```

**`code` decides box-vs-row. `gate` decides how it ticks.** A goal with `code` is
always a box: `code[0]` is the header, `code[1..n]` are the rows inside it. The
box goes green only when the gate AND every row under it is green.

### Granularity is MANDATORY, and it is the thing authors get wrong

A box listing nothing but `class Cat` passes every mechanical check while telling
the learner nothing, and its tick jumps grey-to-green in one step with no sense
of progress. So:

1. **Every member the solution adds gets its own row.** Each field, the
   constructor, each method that is in the `solution` but not in the `starter`.
   `checkGranularity` in `tools/lib/lesson-validators.mjs` fails the build
   otherwise, and it names the field you forgot.
2. **Every move inside a method body gets a STEP row.** Building a list, newing
   up the new collaborator, changing which argument gets passed - none of that
   declares a symbol, so a member lookup can never see it and the row would sit
   grey while the student does exactly the right thing. A step row carries its
   own source probe instead:

   ```js
   {
     code: [
       "class Program",
       { row: "var cats = new List<Cat> { ... }", writes: "new List<Cat>" },
       { row: "var sign = new FeedingSign()",     writes: "new FeedingSign" },
       { row: "sign.Format(cat.IsHungry())",      writes: ".Format(" },
       { row: "desk.HungryCount(cats)",           writes: "HungryCount(cats)" }
     ],
     gate: { type: "Program", member: "Main" }
   }
   ```

   `row` is the label shown; `writes` is a source fragment looked for inside that
   type's body (comment-stripped, whitespace-insensitive). Use `gone` for the
   mirror case - a row that ticks when something disappears.

   Rewriting `Main` is exactly this case. "Refactor `Main`" as a single row is a
   cliff; four step rows are a staircase. **Assume the student needs help with
   every step** - this course teaches design, not C# recall, so never make them
   guess the mechanics.

### Two rules that keep the tracker honest

- **Every goal must start RED on the untouched starter.** A goal that is already
  green teaches nothing. Pinned by a test; check with `S.verdicts`, never
  `S.evaluate` - `evaluate` is an intermediate value that ignores the rows.
- **When you change code a gate watches, move the gate with it.** Renaming a
  literal to a `const` breaks any `writes`/`gone` that named the literal, plus the
  `requireSource` regexes and their EN+ES messages. This repo's worst recurring
  bug is a check that goes quiet.

Pick the tick source deliberately:

| gate | ticks when | use for |
| --- | --- | --- |
| `{ type, member }` | that member exists on that type | a class the student must add |
| `{ type, member, writes }` | ...and the source fragment appears in that type's body | a signature change a member lookup cannot see |
| `{ absent: "X" }` | `X` is gone from the file | a removal |
| `null` | the Run passes | a claim about OUTPUT, not shape |

## Every line of C# you ship is a worked example - MANDATORY

This course teaches people to write maintainable code. **Every C# line in a
lesson is therefore a worked example of the standard being taught**, and that
includes the parts that feel like scaffolding: `starter`, `solution`,
`verify.main`, `example`, and every runnable program. A student copies what they
see. Ship a sloppy `Main` and you have taught sloppiness, whatever the prose says.

This is not a style preference. A lesson whose own code breaks the rules it is
teaching is **broken content** and must not ship.

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

## Word budget for build-task context

**Read the next section first.** The budget below is subordinate to the voice
rules in `AGENTS.md`, and shortening prose is never worth losing them.

A build card's `task.<n>.context` (the prose above the editor) is the first
thing a student reads, so every word should earn its place. The measured course
distribution is:

- Median ~47 words, 75th percentile ~60, 90th percentile ~76.
- **Aim for 45-60 words when the card is a straightforward "here is the
  technique, now use it".**

`tools/validate.mjs` emits a WARN above 75 words. Treat that warning as a
**question, not a command**: "is any of this restating the goals or the code?"
If yes, cut that. If no, the card is allowed to be long, and you leave it alone.

### NEVER trim prose into note form - the failure this rule exists to stop

A previous agent read the cap as a target and rewrote all seven SOLID cards down
to ~55 words each. Card 3 went from 198 words to 64 and lost the entire argument
the lesson was making. It became this:

> Two edits, two classes, one decision by the vet. Change only one and nothing
> goes red: two `FEED` cards beside a tally reading `1`.
>
> That is the **S**. `Cat` had two jobs - deciding *and* wording - and the
> deciding was sealed behind words, so the desk copied it.

That is not concise writing, it is **note form**, and it breaks the voice rules
outright: a verb-less fragment opening (`AGENTS.md` rule 5), the tricolon rhythm
(rule 7), and telegraphic compression no colleague would say aloud (rule 9). The
original said the same things in full sentences that a human could follow:

> Count what that change touched: two edits, in two classes, for one decision by
> the vet. And if you had changed only one of them, nothing would have gone red.
> The program would have printed two `FEED` cards next to a tally reading `1`,
> and nobody would have known until a cat went hungry.

Longer, and better - because the point of that card is the *cost* of the shape,
and the cost needs a sentence to land.

Concretely:

- **Never rewrite existing prose to hit the number.** The budget guides prose
  you are writing now. Prose that already works and reads like a person wrote it
  is not a defect, whatever it counts.
- **A card that motivates, tells a story, or explains a cost is allowed to run
  long.** The SOLID cards, and any card that opens a Part, routinely should.
- **Cut restatement, not substance.** Delete a sentence that repeats the goal
  list or narrates the code. Never delete the setup, the motivation, or the
  concrete consequence.
- **Every sentence stays a sentence.** No fragments, no `**Term:** definition`
  headers standing in for prose, no dropped subjects.
- **If you cannot shorten it without losing the argument, stop.** Leave it and
  move on. The warning is not a build failure.

### What context is for

Set the scene, state the change, stop. Three moves:

1. Name the problem or concept (one or two sentences).
2. Show the C# syntax or pattern.
3. If there is a worked example above the editor, point to it briefly.

Do not restate what the goal list already says. Do not restate what the code
already shows.

### Goal lines

Each goal is one short sentence. It names the type, the method, and the
visible effect. The student should be able to read the goals alone and know
what to build.

### Before / after example

**Before** (107 words - null-safety, task 1):

> Sometimes a value is simply **absent** - a name nobody filled in, a lookup
> that found nothing. In C# an absent value is `null`. Ask for its length and
> the program crashes.
>
> The safe move is to supply a fallback: *use this value, or that default when
> there is nothing*. C# writes it with `??` - `given ?? "stray"` means
> "`given`, unless it is `null`, in which case `"stray"`".
>
> Write a `Shelter` whose `NameOr(string? given)` returns the name it is
> handed, or `"stray"` when that name is `null`.

**After** (45 words):

> Sometimes a value is simply **absent** - a name nobody filled in, a lookup
> that found nothing. In C# that is `null` - ask for its length and the
> program crashes.
>
> `??` supplies a fallback: `given ?? "stray"` means "`given`, unless it is
> `null`, in which case `"stray"`".

What changed: the last paragraph restated the goal list and was cut. The
"safe move" sentence rephrased what `??` already explains - also cut.

## Visual (viz) lessons - the third archetype

Beside `drill` and `build` there is a narrated, stepped **visual** with no code
editor. It powers the Theory "AI track" (`ai-N.*`) and the `theory-N.viz.js`
visuals. It is data fed to the shared **MemoryViz** engine in `code-lab`; you do
not write rendering code. (Building a *new* scene is engine work - see
`.github/copilot-instructions.md`, section "Engine work (code-lab + MemoryViz
scenes)".)

Under the generated flow a viz lesson is `archetype: viz`; its scene data lives
in the lesson dir's `viz.js` (`window.LESSON_CONFIG`) and its `index.html` is
generated.

**One visual per lesson.** `layout.visual` is a single panel type for the whole
lesson; you cannot switch panels between steps. Each step re-states its scene
field in full - steps are snapshots, not diffs.

**Reuse a scene before asking for a new one.** Panel types and their step field:

| panel | field | shows |
| --- | --- | --- |
| `transcript` | `transcript` | a growing message list (system/developer/user/assistant/tool), author-tagged and colour-coded; the workhorse for anything conversational - reasoning, ReAct, reflection, guardrails, grounding, traces |
| `agentloop` | `agentLoop` | the perceive-reason-act-observe loop: active nodes, `ctx` lines, memory, tool `chips` |
| `memoryshelf` | `memoryShelf` | the memory store and its episodic/semantic/procedural kinds |
| `toolrack` | `toolRack` | tools with typed schemas, a call, an error, a retry |
| `retrieval` | `retrieval` | a doc-chunk store, a query vector, similarity scores, retrieved chunks, a grounded answer (RAG) |
| `planboard` | `plan` | a goal decomposed into ordered pending/active/done/blocked steps, with re-planning |

Copy the closest existing `ai-N.viz.js` as the template. Keep the animal/test
flavour in the DATA; keep `narr` in the plain course voice (it renders
`**bold**`, `*italic*`, `` `code` `` and the spaced hyphen ` - `).

**Verify a viz lesson (no dotnet needed):**

Fastest: `node tools/verify-lesson.mjs <lesson-dir> --no-dotnet` - it runs the
resolver against every step and the EN+ES render in one shot. The manual steps
below are what it automates:

1. `node --check ai-N.viz.js`.
2. Run the real resolver against **every** step - this catches bad scene data a
   first-step headless render misses. `tsx` is only installed inside `code-lab`,
   so run from there: load each viz file into a bare `{}` window with
   `new Function("window", src)` and call `resolveTranscript` /
   `resolveRetrieval` / `resolvePlan` on `steps[i][field]`.
3. Headless render every page: `google-chrome --headless --no-sandbox
   --disable-gpu --dump-dom --virtual-time-budget=4000 URL`; assert 0
   `undefined`, the panel class is present (`cl-tx` transcript, `cl-al`
   agentloop, `cl-rg` retrieval, `cl-pb` planboard), and the counter reads `1 / N`.
4. Render `index.html`: new cards resolve, new stage titles show, the AI-card
   count is data-driven (nothing to bump by hand).

## Guardrails

- No emojis, no marketing language, minimal docs. No new markdown unless asked.
- Spaced hyphen ` - `, not em-dash. Code terms in `backticks`.
- Keep the course portable: teach the concept, not the C# sugar.
- Do not push or commit unless explicitly asked - pushing `master` deploys.
- If a lesson naturally runs, it must have a Run button. If a build task grades
  on output, it must have a `verify` probe. These are the two most common misses.
