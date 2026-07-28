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

1. **Log start** in `docs/work-log.md` with a real `date` timestamp.
2. **Place the lesson**: which track (Practical / Theory) and which Part. Find its
   row in `docs/concept-ledger.md`; read the neighbours' reports in
   `docs/audit/<track>/` so the new rung follows from the previous one and uses
   only concepts at or above its ledger row.
3. **Pick the archetype** from the SPECS table. For a practical lesson prefer
   `build` (real code, Run) over `drill`. Copy the closest existing lesson of
   that archetype as the structural starting point (e.g. `first-builds.*` for a
   build, `control-flow.*` for a theory drill, a `theory-N.viz.js` for a
   visual). Do not invent a second data file for the same lesson.
4. **Write the data file** to the config shape in SPECS. Honour the principles
   and cadence invariants: teach the portable concept in plain surface (avoid
   C#-only sugar until its ledger row), one idea per card, a recap to close,
   nothing used before taught, grade the concept (set `requireSource` + a hidden
   `verify` probe for builds), make it runnable if it executes cleanly, state the
   SOLID letter if relevant, one example family per Part, one difficulty rung at
   a time.
5. **Write the HTML page** with the exact load order for the archetype (SPECS /
   copilot-instructions). Set `window.PAGE` with a unique `prefix`.
6. **Wire the card** into the right Part stage in `index.html`. Ensure
   `awardedKey == data-key`, and `data-total` = XP-awarding cards excluding the
   recap.
7. **Update `docs/concept-ledger.md`** in this same change: add or move the
   lesson's row and any concept/surface it introduces.
8. **Verify** per the SPECS recipe: `node --check`; real-`dotnet` compile of
   every runnable program and the rebuilt `verify` probe; headless render with no
   `undefined`. Delete temp harness files.
9. **Log end** in `docs/work-log.md` with a real `date` timestamp.

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
