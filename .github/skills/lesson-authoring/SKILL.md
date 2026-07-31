---
name: lesson-authoring
description: >-
  Author or edit a lesson in the C# junior-to-architect course (this repo).
  USE FOR: adding a new theory/drill/build/checkpoint lesson; editing lesson
  prose (intro, concept, context, goal, quiz, summary); wiring a lesson card into
  index.html; choosing the right archetype and engine; getting XP/data-total and
  prefix conventions right; verifying a lesson compiles and renders. DO NOT USE
  FOR: changing the engines themselves (drill-engine/build-engine/page-shell) or
  the Roslyn/Blazor host (that is engine work, see copilot-instructions);
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
4. `.github/copilot-instructions.md` - architecture and the concrete
   "How to add a lesson" mechanics and load orders.
5. `.github/instructions/code-editor.instructions.md` - Monaco-only, reuse-first.
6. `docs/audit/README.md` - what already exists, so you slot in without
   duplicating or contradicting a neighbour, and so you avoid the known traps.

## Procedure

The course is migrating to a generated, per-directory layout
(`content/<track>/<NN-part>/<NN-lesson>/`). New and migrated lessons MUST use the
generated flow. The old flat `<name>.js` + `<name>.html` flow is **legacy** -
still valid for the many not-yet-migrated lessons, but do NOT author a new flat
lesson.

1. **Log start** in `docs/work-log.md` with a real `date` timestamp.
2. **Place the lesson**: which track (Practical / Theory) and which Part. Find its
   row in `docs/concept-ledger.md`; read the neighbours' reports in
   `docs/audit/<track>/` so the new rung follows from the previous one and uses
   only concepts at or above its ledger row.
3. **Pick the archetype** from the SPECS table. For a practical lesson prefer
   `build` (real code, Run) over `drill` - `build` is the only archetype with live
   instances under `content/`, so `drill`/`checkpoint` are scaffoldable but
   unproven in the generated pipeline. Copy the closest existing lesson's data
   as the structural starting point.

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
   - `--new` does NOT seed `concepts` (only `--from` does) - fill them by hand, or
     run `node tools/seed-concepts.mjs` to push `docs/concepts/<track>.concepts.json`
     into every migrated `meta.js`. If this lesson is the sole introducer of a
     concept, its `introduces` entry (with the `def`) MUST stay, or `validate.mjs`
     fails downstream where another lesson revisits/uses it.
6. **Fill `data.js`** with the lesson content (`window.BUILD_CONFIG` /
   `DRILL_CONFIG`, plus `viz.js` `window.LESSON_VIZ` for a viz lesson) to the
   config shape in SPECS. Honour the principles and cadence invariants (below).
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
8. **Update `docs/concept-ledger.md`** in this same change: add or move the
   lesson's row and any concept/surface it introduces.
9. **Verify** with the one-command harness: `node tools/verify-lesson.mjs
   <lesson-dir>`. It runs the whole SPECS recipe - `node --check`; real-`dotnet`
   compile of every runnable program and the rebuilt `verify` probe; viz
   scene-resolver checks on every step; headless EN+ES render with no
   `undefined` - and exits non-zero on failure. Add `--no-dotnet` / `--en-only`
   to iterate faster. It cleans up after itself, so there is nothing to delete.
10. **Log end** in `docs/work-log.md` with a real `date` timestamp.

### Legacy flow (flat files) — only for not-yet-migrated lessons

The cadence invariants are the same; only the file split and the hand-written
page differ.

- **Write the data file** `<name>.js` to the config shape in SPECS. Honour the
  principles: teach the portable concept in plain surface, one idea per card, a
  recap to close, nothing used before taught, grade the concept (set
  `requireSource` + a hidden `verify` probe for builds), make it runnable if it
  executes cleanly, state the SOLID letter if relevant.
- **Write the HTML page** `<name>.html` with the exact load order for the
  archetype (SPECS / copilot-instructions). Set `window.PAGE` with a unique
  `prefix`.
- **Wire the card** into the right Part stage in `index.html`. Ensure
  `awardedKey == data-key`, and `data-total` = XP-awarding cards excluding the
  recap.

## Preflight checklist (run before calling it done)

- [ ] Every concept and token used is at or above this lesson's ledger row.
- [ ] No C#-only sugar used before its ledger row (`=>`, `var`, `$"..."`, records).
- [ ] One idea per card; a recap closes a multi-card lesson.
- [ ] Prose is formatted: lists use `- ` bullets (never comma-packed), distinct
      points use blank-line paragraphs, `**bold**` for the new term, `code` in backticks.
- [ ] Runnable if it produces visible output.
- [ ] Build tasks have a technique gate AND a hidden `verify` probe.
- [ ] SOLID letter stated if this is a design/testing/refactor lesson.
- [ ] One example family for the Part; difficulty rises one rung.
- [ ] `awardedKey == data-key`; `data-total` excludes the recap; unique `prefix`.
- [ ] Ledger updated; work-log start and end logged.

## Visual (viz) lessons - the third archetype

Beside `drill` and `build` there is a narrated, stepped **visual** with no code
editor. It powers the Theory "AI track" (`ai-N.*`) and the `theory-N.viz.js`
visuals. It is data fed to the shared **MemoryViz** engine in `code-lab`; you do
not write rendering code. (Building a *new* scene is engine work - see
`.github/copilot-instructions.md`, "Adding a MemoryViz scene".)

Under the generated flow a viz lesson is `archetype: viz`; its scene data lives
in the lesson dir's `viz.js` (`window.LESSON_VIZ`) and its `index.html` is
generated. The two-file mechanics below are the **legacy** flat layout, still
valid for not-yet-migrated `ai-N.*` / `theory-N.viz.js` lessons.

Two files, same split as the other archetypes:

- `ai-N.html` - sets `window.PAGE` (hero `eyebrow`/`title`/`intro`, a unique
  `prefix` like `ai14`, a `links` back-to-course). Load order:
  `vendor/code-lab/code-lab.global.js` -> `ai-N.viz.js` -> `page-shell.js`.
  No Prism, no Monaco, no `archetype` key.
- `ai-N.viz.js` - data only:
  `window.LESSON_VIZ = { code:[], legend:[...], layout:{ visual:[{type}],
  aside:[{type:"narration"},{type:"controls"}] }, steps:[{ narr, <field>:{...} }] }`.

`page-shell` derives the rest from the filename - do NOT set these in the viz
file: `awardedKey` (`ai-14.html` -> `ai_14_awarded`), `xpKey`, and `nextHref`
(from the `THEORY`/`PRACTICAL` arrays in `page-shell.js`). When you add a viz
lesson you MUST add its filename to the right array in `page-shell.js` in reading
order, or the next-lesson button skips it.

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
