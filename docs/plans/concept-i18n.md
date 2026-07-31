# Concept term/def i18n (voice x language)

Status: not started  -  Design: [docs/architecture/concept-i18n.md](../architecture/concept-i18n.md)

## Goal
Translate the ~208 concept `term`/`def`s (glossary + in-lesson define-panel) to
native Spanish, voice- and language-aware, so the last English surface is gone -
without regressing the byte-identical English render.

## Approach
Concept text becomes a normal resource string (not metadata): `def`/`term` move
out of each `meta.js` into `res/strings/<voice>/<lang>.json` beside the lesson's
prose; `meta.js` keeps only the concept graph. `generate.mjs` aggregates text per
language; a small `ConceptI18n` adapter (English graph = fallback) feeds both the
standalone glossary and the page-shell panel. English stays the base.

## Plan
1. [ ] Migrate `meta.js` `term`/`def` -> `res/strings/default/en.json` (scripted) - verify: `concept-index.js` diff 0
2. [ ] Update `seed-concepts.mjs`: graph -> `meta.js`, text -> `default/en.json` - verify: re-seed is idempotent
3. [ ] `generate.mjs` reads text from bundles + emits `concept-i18n.<lang>.js` - verify: English index byte-identical
4. [ ] `ConceptI18n` adapter (`resource/concept-i18n.js`), DOM-free, graph fallback - verify: unit shape + no-op = English
5. [ ] page-shell: `conceptDef` via injected source + `PageShellConcepts` surface + re-callable `renderAgenda` - verify: en panel identical
6. [ ] kernel-controller: load `concept-i18n.<lang>.js`, inject source, push surface - verify: live en->es swap re-renders chips
7. [ ] glossary: use `ConceptI18n` + rebuild `dataset.search` from resolved text - verify: en DOM diff 0; es search matches
8. [ ] validate.mjs: concept coverage gate (100% = ERROR) + id subset check - verify: 3 guard fixtures pass
9. [ ] Phase A verify + commit - verify: gate 1-5 in design doc all green
10. [ ] Phase B: author es defs to 100% coverage, fleet by track (`pr-`/`th-`/`ai-`) - verify: coverage gate green course-wide
11. [ ] Phase C: extra voices/langs slots (`child`/`academic`, new lang) - verify: fallback child->default->graph

## Progress
- 2026-07-31 Design approved, decisions locked, design-of-record + this brief committed. Not started.

## Open
- None open; ready to start Phase A step 1 on the owner's go.
