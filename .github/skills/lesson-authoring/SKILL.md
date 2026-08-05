---
name: lesson-authoring
description: >-
  Author or edit a lesson in the C# junior-to-architect course (this repo).
  USE FOR: adding a new theory/drill/build/checkpoint lesson; editing lesson
  prose (intro, concept, context, goal, quiz, summary); choosing the right
  archetype (build/drill/viz/checkpoint/git); authoring the GIT track - its
  interactive `git` lessons and its `repo`-scene theory lessons; getting XP/total and prefix conventions
  right; writing the lesson's C# to the course's mandatory exemplary-code standard
  (see the exemplary-lesson-code skill); verifying a lesson compiles and renders. DO NOT USE FOR: changing the
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
7. `.github/skills/exemplary-lesson-code/SKILL.md` - only if the lesson ships
   C#. It is the mandatory standard for every line a learner sees.

## Procedure

`.github/copilot-instructions.md` already carries the generated flow (scaffold ->
`meta.js` -> `data.js` -> `generate` -> `validate`) and the rule that a lesson's
`index.html` is generated. It is always loaded, so it is not repeated here. What
follows is only what that flow does NOT tell you.

**Before you write.** Find the lesson's row in `docs/concept-ledger.md` and read
the neighbours' reports in `docs/audit/<track>/`; you may use only concepts at or
above that row. Then pick the archetype from the SPECS table - for a practical
lesson prefer `build` over `drill` - and copy the closest existing lesson as your
structural starting point.

**The traps.**

- `--new` does NOT seed `concepts`; only `--from` does. Fill them by hand, and
  remember the split: `meta.js` carries the ids and edges, the lesson's
  `res/strings/default/<lang>.json` carries each introduced concept's
  `concept.<id>.term` / `.def`. Put prose in `meta.js` and the chip renders
  `undefined`. Drop an `introduces` entry and `validate.mjs` fails wherever
  another lesson revisits it.
- A build `starter` may intentionally NOT compile when the objective is to WRITE
  a type or a member - the compile error is the teaching signal. Keep a stub
  compiling only when the learner fills a body.
- The card text is lesson-owned: `card.title` and `card.blurb` go in the lesson's
  own bundle for every language the site ships. Miss them and the path shows
  English beside a Spanish lesson.
- If the lesson opens a NEW Part, add the part's `i18n: { es: { title } }` in
  `course-registry.js` (and a track's full block for a new track). The kicker is
  DERIVED from `partPrefix` - never hand-write it.
- Update `docs/concept-ledger.md` in the same change.

## Preflight checklist (run before calling it done)

- [ ] Every concept and token is at or above this lesson's ledger row, and no
      C#-only sugar arrives early (`=>`, `var`, `$"..."`, records).
- [ ] One idea per card; a recap closes a multi-card lesson.
- [ ] Prose passes `AGENTS.md`'s read-aloud test - full sentences, no fragments,
      no `**Term:** definition` standing in for prose. Run
      `node tools/check-voice.mjs <lesson-dir>`: it counts the four tells that
      keep slipping through (tricolon, antithesis flourish, `So ...` openers,
      naming an abstraction). Each hit is a question, not a verdict.
- [ ] Every C# line meets `.github/skills/exemplary-lesson-code/SKILL.md`, and
      every `solution` compiles warning-free. A warning on the answer we call
      correct is broken content.
- [ ] Build tasks have a technique gate AND a hidden `verify` probe, and the
      probe uses an input the visible run does not - otherwise code that merely
      looks right passes.
- [ ] The goal tracker is granular and every goal starts RED (see below).
- [ ] Runnable if it produces visible output.
- [ ] `awardedKey == data-key`; `data-total` excludes the recap; unique `prefix`.
- [ ] `node tools/verify-lesson.mjs <dir>` passes; ledger and work-log updated.

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

3. **If `Main` changes, it gets a box. If it does not, say so in prose.** The
   caller is the step authors forget, because rewiring it declares nothing and
   so every declaration-based check stays quiet. `checkCallSiteTracked` now
   compares the body of the type holding `Main` between `starter` and
   `solution` and fails the lesson when nothing tracks the difference.

   The mirror case matters just as much. When `Main` genuinely needs no edit,
   a student who was just told the rule lives in two places will go hunting for
   a third, so name `Main` in a goal line - as prose, `{ gate: null }`, with no
   `code` box. Never a box: it would be green before they typed anything, and
   an unearned tick is worse than no tick.

4. **Keep `writes`/`gone` on the ROW, not on the box gate, when it is the edit
   itself.** A source condition on the gate is a prerequisite for every row
   beneath it, so the whole box sits grey and then flips green in one jump -
   the exact all-or-nothing lamp the rows exist to replace. Put the structural
   shape in the gate (`{ type: "Cat", member: "CheckAndSign" }`) and the edit in
   its own row (`{ row: "const int HoursUntilHungry = 4", writes: "...", gone: "..." }`).

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

The full standard - naming, magic numbers, SOLID, warning-free compilation, and
what an anti-pattern example may show - is its own skill:
`.github/skills/exemplary-lesson-code/SKILL.md`. Read it before writing any C#
that ships in a lesson. The one-line version: a learner copies what they see, so
lesson code is held to the standard the lesson teaches.

## Word budget for build-task context

A build card's `task.<n>.context` is the first thing a student reads. The course
measures ~47 words median, ~76 at the 90th percentile; **aim for 45-60** on a
straightforward "here is the technique, now use it" card. `validate.mjs` WARNs
above 75.

Treat that warning as a **question, not a command**: is any of this restating the
goals or narrating the code? Cut that. If not, the card is allowed to be long.

**The budget is subordinate to `AGENTS.md`.** Shortening is never worth losing
the voice, and this rule exists because it was broken: an agent read the cap as a
target and cut all seven SOLID cards to ~55 words. Card 3 went 198 -> 64 and lost
its whole argument, becoming verb-less fragments no colleague would say aloud -
`AGENTS.md` rules 5, 7 and 9 in one edit. The point of that card was the COST of
a bad shape, and a cost needs a sentence to land.

So:

- **Never rewrite working prose to hit the number.** The budget guides prose you
  are writing now.
- **Cut restatement, not substance.** Delete what repeats the goals or narrates
  the code; never the setup, the motivation, or the consequence.
- **A card that motivates or explains a cost may run long** - Part openers and
  the SOLID cards routinely should.
- **Every sentence stays a sentence.** No fragments, no `**Term:** definition`
  headers standing in for prose.
- **If you cannot shorten it without losing the argument, stop.** The warning is
  not a build failure.

Context does three things and then stops: name the problem, show the syntax,
point at the worked example if there is one. Each goal line is one short sentence
naming the type, the method, and the visible effect - a student who reads only
the goals should know what to build.

**A task with `goals` shows no "Here's the pattern".** The two say the same thing
twice - the pattern as a finished still life in another domain, the live tracker
as the learner's own code ticking off piece by piece - and they stack in the same
narrow column, where the taller static one pushes the tracker out of line with
the editor and off the bottom of the screen. `build-plugin.colorizeExample` drops
the example whenever the task has goals, so authoring both is not an error, it is
just wasted words. Write an `example` for a task with no tracker; write `goals`
and let them carry it for a task that has one.

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

## The git track - two archetypes that must never mix

The git track teaches with a pair of archetypes, and the split is a rule, not a
preference:

| Archetype | What it is | Used for |
|---|---|---|
| `git` | terminal + live graph, the learner types real commands | every PRACTICAL lesson |
| `viz` with a `repo` scene | the same board, stepped and narrated, read-only | every THEORY lesson |

**A practical lesson uses the interactive mode ONLY. A theory lesson uses the viz
ONLY.** Do not put a stepped visual inside a practical lesson or a terminal
inside a theory one.

**Order is pedagogy, not decoration.** The syllabus
(`docs/plans/git-content.md`) puts the visual immediately BEFORE the lesson that
types the idea - 4 before 5, 7 before 8, 9 before 10, 13 before 14 - because a
branch, a merge, a conflict and a reset are all pointer behaviour with no
obvious surface. Building the practicals first and "adding the viz later"
inverts the one thing the plan is most deliberate about. If the viz engine is
missing, build it; do not route around the order.

### Authoring a `git` (practical) lesson

- `data.js` cards carry `start`, `target`, `solution` as arrays of REAL git
  commands, plus `files: [...]` naming what the folder holds. Files are also
  inferred from the card's own `git add` lines; `files` is the override for a
  file the card SHOWS but never adds (the `notes.md` a learner must leave out).
- **Grading is state-based**, so `git status` and `git log` cannot be graded on
  their own. Every card must end in a state change, and the reading command is
  what tells the learner WHICH change to make. A card solvable without looking
  does not teach looking.
- `metaLabel` is the breadcrumb; it MUST also exist in the bundles as
  `meta.label`, or it stays English on a Spanish page.

### Authoring a `viz` (theory) lesson with the `repo` scene

Each step is `repo: { files, commands, ran, note }`:

- `commands` are real git commands replayed through the SAME runtime the
  practicals are graded against, so the picture and the exercise cannot drift.
- `ran` is how many trailing commands are new at this step (default 1). The view
  prints them above the board, which is what lets a learner see *what moved
  `HEAD`*. Use `ran: 0` for a step that only re-explains the previous picture.
- Set `legend` explicitly - three entries, copied from an existing git viz.
  Without it the visual falls back to MemoryViz's default legend, which talks
  about RAM and CPU cores from a different lesson.
- A `RepoState` is full of `Map`s and the stepper deep-clones every step, which
  is exactly why a step authors COMMANDS rather than a prebuilt state.

### Rules that bit us, in the order they bit

1. **Concept prose lives in the string bundles, never in `meta.js`.** `meta.js`
   carries `{ "id": "gt-branch" }` and nothing else; the bundles carry
   `concept.gt-branch.term` and `concept.gt-branch.def`. Put a `term`/`def` in
   `meta.js` and the chip renders `undefined`.
2. **Only the lesson that INTRODUCES a concept carries its prose.** Everyone
   else lists the id under `revisits`/`uses`.
3. **`en.json` and `es.json` must have exactly the same key set.** Check with a
   symmetric difference, not by eye.
4. **Never translate a git command.** `start`/`target`/`solution`, commit
   messages and file names stay English in BOTH bundles - translating them
   breaks the replay and the goal becomes unreachable. Only prose translates.
5. **Read the runtime before authoring an exercise.** It is a teaching model,
   not real git: `code-lab/src/core/git-model.ts` and
   `code-lab/src/terminal/commands/git.ts`. A committed path leaves the folder,
   so "both branches edit the same file" needs a deliberate setup.
6. **Prove every card.** Replay its `solution` through the vendored runtime and
   assert it reaches `target` - `tools/lib/git-validate.mjs`'s `checkGitTask`
   does this, and also rejects a card whose start already solves it.
7. **The scaffolder appends to the registry.** `new-lesson.mjs` numbers the
   directory from the count of same-part rows, so a lesson inserted mid-syllabus
   needs its directory renamed and its registry line moved - registry ARRAY
   ORDER is the real order; the `NN-` prefixes are cosmetic.
8. **`verify-lesson.mjs` needs `index.html`.** Run `node tools/generate.mjs`
   first, or it prints "not a lesson" and checks nothing - while still exiting 0.

## Guardrails

- No emojis, no marketing language, minimal docs. No new markdown unless asked.
- Spaced hyphen ` - `, not em-dash. Code terms in `backticks`.
- Keep the course portable: teach the concept, not the C# sugar.
- Do not push or commit unless explicitly asked - pushing `master` deploys.
- If a lesson naturally runs, it must have a Run button. If a build task grades
  on output, it must have a `verify` probe. These are the two most common misses.
