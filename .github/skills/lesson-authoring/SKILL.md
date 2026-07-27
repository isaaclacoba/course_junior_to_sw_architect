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

1. `docs/SPECS.md` - the repeatable lesson-structure spec (archetypes, config
   shapes, cadence invariants, XP/wiring conventions, verify recipe).
2. `AGENTS.md` (root) - the prose voice rules. Non-negotiable.
3. `.github/copilot-instructions.md` - architecture and the concrete
   "How to add a lesson" mechanics and load orders.
4. `.github/instructions/code-editor.instructions.md` - Monaco-only, reuse-first.
5. `docs/audit/README.md` - what already exists, so you slot in without
   duplicating or contradicting a neighbour, and so you avoid the known traps.

## Procedure

1. **Log start** in `docs/work-log.md` with a real `date` timestamp.
2. **Place the lesson**: which track (Practical / Theory) and which Part. Read the
   neighbours' reports in `docs/audit/<track>/` so the new rung follows from the
   previous one and uses only concepts already taught.
3. **Pick the archetype** from the SPECS table. Copy the closest existing lesson
   of that archetype as the structural starting point (e.g. `control-flow.*` for
   a theory drill, `first-builds.*` for a build, a `theory-N.viz.js` for a
   visual). Do not invent a second data file for the same lesson.
4. **Write the data file** to the config shape in SPECS. Honour every cadence
   invariant: one idea per card, a recap to close, nothing used before taught,
   grade the concept (set `requireSource` + a hidden `verify` probe for builds),
   make it runnable if it executes cleanly, state the SOLID letter if relevant,
   one example family per Part, one difficulty rung at a time.
5. **Write the HTML page** with the exact load order for the archetype (SPECS /
   copilot-instructions). Set `window.PAGE` with a unique `prefix`.
6. **Wire the card** into the right Part stage in `index.html`. Ensure
   `awardedKey == data-key`, and `data-total` = XP-awarding cards excluding the
   recap.
7. **Verify** per the SPECS recipe: `node --check`; real-`dotnet` compile of
   every runnable program and the rebuilt `verify` probe; headless render with no
   `undefined`. Delete temp harness files.
8. **Log end** in `docs/work-log.md` with a real `date` timestamp.

## Guardrails

- No emojis, no marketing language, minimal docs. No new markdown unless asked.
- Spaced hyphen ` - `, not em-dash. Code terms in `backticks`.
- Do not push or commit unless explicitly asked - pushing `master` deploys.
- If a lesson naturally runs, it must have a Run button. If a build task grades
  on output, it must have a `verify` probe. These are the two most common misses.
