# SPECS.md - the repeatable lesson structure

The single spec an author (human or agent) follows to add a lesson without
inventing anything. It is descriptive of what the course already does, not a new
proposal. Authoritative companions, do not duplicate them here:

- Voice and prose rules: root `AGENTS.md`.
- Architecture, engines, build/deploy, how-to-add-a-lesson mechanics:
  `.github/copilot-instructions.md`.
- Editor rule (Monaco only, reuse first): `.github/instructions/code-editor.instructions.md`.
- Current content map, gaps, and the cycle plan: `docs/audit/README.md`.

This file is the *shape* contract: which archetype, which config, what a good
card looks like, and the invariants that keep the course consistent as it grows
to hundreds of lessons.

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
3. **Nothing used before it is taught.** No syntax token (`=>`, `?:`, `$"..."`,
   `var`, `static`, `string?`) appears before a lesson that introduces it. When
   an earlier lesson gives a taster of a later idea, the later "real" lesson
   acknowledges the earlier exposure.
4. **Grade the concept, not the output.** For build tasks, choose `expected`,
   `requireSource`, and a hidden `verify` probe so the target technique is
   unavoidable and a hardcoded constant cannot pass. `data-shapes` and
   `generics` are the reference implementations.
5. **Make it runnable when it executes cleanly.** If the concept has visible
   output, ship `runnablePrograms` (drill) or a Run task (build). Do not leave a
   naturally-runnable lesson button-less.
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
