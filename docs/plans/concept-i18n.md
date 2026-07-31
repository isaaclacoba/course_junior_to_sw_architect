# Concept term/def i18n (voice x language)

Status: es done (Phase A+B complete; Phase C = future slot)  -  Design: [docs/architecture/concept-i18n.md](../architecture/concept-i18n.md)

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
1. [x] Migrate `meta.js` `term`/`def` -> `res/strings/default/en.json` (scripted) - verify: `concept-index.js` diff 0
2. [x] Update `seed-concepts.mjs`: graph -> `meta.js`, text -> `default/en.json` - verify: re-seed is idempotent (no content change)
3. [x] `generate.mjs` reads concept text from the en bundle - verify: English index byte-identical (concept-i18n.<lang>.js emission moved to Phase B, verified with data)
4. [x] `ConceptI18n` adapter (`resource/concept-i18n.js`), DOM-free, graph fallback - verify: 6 unit tests pass
5. [x] page-shell: `conceptDef` via injected source + `PageShellConcepts` surface + re-callable `renderAgenda` - verify: en panel/agenda identical
6. [x] kernel-controller: load `concept-i18n.<lang>.js`, inject source, push surface - verify: en no-fetch; agenda renders via source
7. [x] glossary: use `ConceptI18n` + rebuild `dataset.search` from resolved text - verify: en DOM diff 0
8. [x] validate.mjs: concept coverage gate (100% = ERROR) + id subset check - verify: 5 fixture tests pass; real repo stays 0 errors (inert)
9. [x] Phase A verify + commit - verify: regenerate no drift, validate 0 err, 41/41 tests, tree clean
10. [x] Phase B: author es defs to 100% coverage, fleet by track (`pr-`/`th-`/`ai-`) - verify: coverage gate green course-wide
11. [ ] Phase C: extra voices/langs slots (`child`/`academic`, new lang) - verify: fallback child->default->graph

## Progress
- 2026-07-31 Design approved, decisions locked, design-of-record + this brief committed. Not started.
- 2026-07-31 Phase A: fanned out steps 4 (ConceptI18n) + 8 (validate gate) - both tested + committed (b4313bd), inert until migration. Migration (1-3) next.
- 2026-07-31 Migration done (7a82f2c): 71 lessons' term/def moved to default/en.json, meta.js graph-only, generate reads from bundles. Gate PASSED: concept-index.js + course-data.js byte-identical; validate 0 errors (coverage gate live); seed-concepts idempotent. Next: consumers (5-7) + verify (9), then architect review.
- 2026-07-31 Phase A COMPLETE: consumers wired - glossary (166bc64), page-shell + kernel (21e30e6). All gates green: generate no drift, validate 0 err, 41/41 tests, en byte-identical (glossary DOM diff 0, kernel agenda renders via source, no en fetch).
- 2026-07-31 Architect review: SHIP-WITH-FIXES, no blockers, byte-identical confirmed. Fixed all 4 findings - live-swap gen-guard on the concept source, en = null (true legacy path + panel sentinel), English-base 100% now enforced by the validator, meta.js rewrite last-property guard. NITs 5/6 (term-null invariant, en.json normalization) documented as accepted. Re-verified: validate 0 err, 41/41 tests, seed idempotent, en byte-identical. Next: Phase B (author es + emit concept-i18n.es.js).
- 2026-07-31 Phase B COMPLETE (90447ac): generate emits concept-i18n.<lang>.js; fleeted 208 es concept defs by track (control-flow proof + practical 77 / theory 81 / ai 46). All gates green: validate 0 err (es 100% course-wide), concept-index + course-data byte-identical, AI-voice clean, es glossary/agenda/panel render native with English fallback for kept terms; en unchanged. Concept i18n for Spanish is DONE. Phase C (child/academic voices, more langs) is an on-demand slot - the machinery already supports it.

## Open
- None. Spanish concept i18n is complete (Phase A+B). Phase C (child/academic voices, additional languages) is an on-demand slot - the machinery already supports it.
