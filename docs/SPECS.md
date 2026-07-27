# SPECS.md - the repeatable lesson structure

The single spec an author (human or agent) follows to add a lesson without
inventing anything. It is descriptive of what the course already does, not a new
proposal. Authoritative companions, do not duplicate them here:

- Voice and prose rules: root `AGENTS.md`.
- Architecture, engines, build/deploy, how-to-add-a-lesson mechanics:
  `.github/copilot-instructions.md`.
- Editor rule (Monaco only, reuse first): `.github/instructions/code-editor.instructions.md`.
- Current content map, gaps, and the cycle plan: `docs/audit/README.md`.
- The portable syllabus (concept order + language-surface policy): `docs/concept-ledger.md`.

This file is the *shape* contract: which archetype, which config, what a good
card looks like, and the invariants that keep the course consistent as it grows
to hundreds of lessons.

## 0. Principles that outrank everything below

These four are why the invariants exist. When a detail conflicts, these win.

1. **Teach the portable concept, not the language.** The transferable idea (a
   function that returns a value, a list you can add to, handling an error) is
   the lesson. C#-specific sugar (`=>`, `var`, `$"..."`, records, `??`/`?.`) is
   disposable skin - prefer the form that maps to Java/Python/TS, and where you
   must use sugar, introduce it deliberately and mark it `(C#)` in the ledger.
   The course must stay portable.
2. **Nothing is used before it is taught - enforced by the ledger.**
   `docs/concept-ledger.md` is the ordered, language-independent syllabus. A
   lesson may use any concept at or above its own row and none below it. Do not
   reach forward for a concept (or a token) just because it is convenient. Update
   the ledger in the same change that adds or reorders a lesson.
3. **Runnable by default.** The reason this course ships an in-browser Roslyn
   compiler is that a beginner runs real code and sees it work. If a lesson's
   idea produces visible output, it MUST be runnable (a `build` task or a drill
   with `runnablePrograms`). Concept-only theory and pure recall are the only
   exceptions.
4. **The learner earns success through understanding.** Grading (below) must
   make the target technique unavoidable and block a hardcoded pass.

### Grading - how a build submission is judged

`build-engine` evaluates the student's source in three layers. Use all three:

- **Output match** (`expected`) - necessary but weak on its own; a constant can
  satisfy it.
- **Technique gate** (`requireSource[]`) - regex that forces the shape (e.g.
  "contains an `interface`", "no `switch`").
- **Hidden probe** (`verify`) - re-runs the learner's code from `class Program`
  onward with different inputs, so a value hardcoded to the visible case fails.

A build task graded on output alone is the recurring hole the audits keep
finding. `data-shapes` and `generics` are the reference implementations.

### Voice is owned by the human and iterated in `AGENTS.md`

The author (human) owns the learner-facing voice. When agent-written prose misses
it, the fix is to sharpen `AGENTS.md` with a concrete before/after, then
regenerate - so the voice steadily converges on what the author wants. Keep
drafts plain and factual; do not ship model-register warmth or hype.

## 1. Pick the archetype

| Pedagogy | Archetype | Engine | Config |
|---|---|---|---|
| Concept-only, absolute beginner, no code writing | Theory visual | `CodeLab.MemoryViz` via `theory-N.viz.js` | a `chip` + ordered `steps[]` |
| Recall + fill a blank in prose/code, optional Run | Drill | `drill-engine.js` | `window.DRILL_CONFIG` |
| Write C# from scratch, Run, match output | Build | `build-engine.js` | `window.BUILD_CONFIG` |
| Seal a Part | Checkpoint | `CodeLab.Quiz` via `theory-check-N.js` | question bank + `passRatio` |
| Integrative refactor, compiled + structurally checked | Capstone | Roslyn WASM host (`level3-app`) | `level3-exercise/*.cs` `IExercise` |

Reuse-first is non-negotiable: never write a new engine, runner, editor, or page
controller. If a new archetype seems needed, it almost certainly is not.

Direction (MANDATORY): every practical lesson that shows or runs code MUST use the
code-lab Monaco editor via `build-engine` (write real code, Run it). The
fill-in-the-blank `drill-engine` is **not acceptable** for practical lessons - do
not create or leave one. Reach for `drill`/quiz only for pure recall with no code.
Theory stays concept-only via the visual (`MemoryViz`). This rule is
non-negotiable; see `.github/instructions/code-editor.instructions.md`.

## 2. Config shapes (the exact surface)

### DRILL_CONFIG
```
prefix, metaLabel, progressNoun, awardedKey, awardAmount,
drills: [{
  title, concept, context,
  snippet,                 // display-only, {{1}} markers become blanks
  points: [...],
  blanks: [{ id, label, answer, accept?, hints:[...], explain:[{text,highlight}] }],
  quiz?: { question, options:[{text,correct}], answerWhy },
}],
// runnable drills only:
runnablePrograms: [ /* index-aligned complete programs */ ],
runnerUrl, xpKey
// optional final recap card, excluded from the progress count:
{ summary:true, summaryIntro, summaryItems:[{title,text}], summaryClose, blanks:[] }
```

### BUILD_CONFIG
```
prefix, runnerUrl, xpKey, awardedKey, awardAmount,
tasks: [{
  title, concept, context, example?, goal:[...],
  expected,                // string (any line equals it) OR array (exact ordered lines)
  requireSource?: [{ pattern, message }],   // technique gate
  verify?: { main, expected, message },      // hidden anti-hardcode probe; main starts with "class Program"
  starter, solution
}]
```

### Theory visual (`theory-N.viz.js`)
```
CodeLab.MemoryViz(host, {
  chip,
  steps: [{ ...visual fields..., narr }]   // one idea per step, last step recaps
})
```
`theory-N.html` load order: Prism (3 tags, if used) -> `vendor/code-lab/code-lab.global.js`
-> `page-shell.js` -> `theory-N.viz.js`. (Do NOT also ship a `theory-N.js`
drill file for the same lesson - that is the dead-file trap the audit found.)

## 3. The cadence invariants (what makes a good lesson here)

1. **One idea per card / step.** A card teaches exactly one move. If a card needs
   the word "and" to describe its concept, split it.
2. **Recap to close.** Every multi-card lesson ends with a `summary` (drill) or a
   final recap step (visual). Checkpoints do not need one.
3. **Nothing used before it is taught.** Check `docs/concept-ledger.md`: a lesson
   may use only concepts at or above its own row. Prefer the portable form and
   avoid C#-only sugar (`=>`, `var`, `$"..."`, records) until its ledger row -
   see principles 1 and 2 above.
4. **Grade the concept, not the output.** For build tasks, set `expected`,
   `requireSource`, and a hidden `verify` probe so the target technique is
   unavoidable and a hardcoded constant cannot pass (see the grading section
   above). `data-shapes` and `generics` are the reference implementations.
5. **Make it runnable when it executes cleanly** (principle 3). If the concept
   has visible output, ship `runnablePrograms` (drill) or a Run task (build). Do
   not leave a naturally-runnable lesson button-less.
6. **State the SOLID letter** a design/testing/refactor lesson embodies, so the
   capstone's principle names have a back-reference.
7. **One example family per Part.** Keep the light animal / test-automation
   flavour, but do not switch families mid-Part.
8. **Difficulty rises one rung at a time.** No card jumps to several new classes
   at once; insert an intermediate card instead.

## 4. XP and wiring conventions

- `awardedKey` (lesson config) == `data-key` (the `index.html` card) == the
  `localStorage` key. A mismatch silently breaks progress.
- `data-total` on the card = the number of XP-awarding cards, **excluding** the
  recap summary card.
- Element ids are `prefix + suffix`; every new lesson needs a unique `prefix`.
- Pills: `gentle` / `steady` / `challenging` (checkpoints: `Checkpoint`).

## 5. Wire into the path

Add one `<li class="c-step">` card to the correct Part stage in `index.html`
(template in `.github/copilot-instructions.md`), inside the correct track.

## 6. Verify before "done"

1. `node --check <name>.js` for every JS file touched.
2. For runnable content, extract each program, compile with real `dotnet`, and
   compare to `expected`; rebuild the hidden `verify` probe exactly as the engine
   does and run the `requireSource` regexes against the `solution`.
3. Headless render (`python3 -m http.server` + `--headless --dump-dom`), confirm
   the first card, inputs/quiz, progress label, and NO `undefined`. Real C# in
   WASM needs real wall-clock time.
4. Delete every temp harness (`_*.html`, `/tmp/...`).
5. Log start and end in `docs/work-log.md` with a real `date` timestamp.
