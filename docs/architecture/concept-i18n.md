# Design-of-Record: Concept term/def i18n (voice x language)

Status: **APPROVED, not yet implemented.** Owner-approved 2026-07-31.
Successor to the i18n rollout; scoped to the concept vocabulary only.

This is the plan of record. Track work in the **Progress log** at the bottom;
every phase has a Verify gate that must pass before the next begins.

---

## 1. Locked decisions (owner)

1. **Concept text is a resource, not metadata.** The `term` and `def` strings
   move OUT of each lesson's `meta.js` into the resource bundles, beside the
   lesson's prose. `meta.js concepts` keeps only the **graph** (`introduces`/
   `revisits`/`uses` as ids + relationships).
2. **One resource mechanism for all display text.** Concept text uses the same
   `res/strings/<voice>/<lang>.json` bundles, resolver, and validation as prose.
   No separate concept overlay, no validation carve-out.
3. **English is the base**, authored in `res/strings/default/en.json`, seeded
   from the canonical `docs/concepts/*.concepts.json`. Non-English are overlays.
4. **Build-time aggregation.** `generate.mjs` aggregates concept text into
   generated per-language artifacts; consumers load them. Editing a translation
   is a regenerate, exactly like editing an English string today.
5. **100% coverage is an ERROR gate.** Once a `(voice,lang)` pair is declared,
   every introduced concept must have a `def` in it (missing => CI fails).
6. **Ownership stays the existing hybrid.** A concept is introduced by exactly
   one lesson (`validate.mjs` already errors on >1 introducer); its text lives in
   that lesson's bundles. The generated index is the derived central registry.

## 2. Problem & forces (brief)

~208 concepts, each `{id, term, def}`, shown in two consumers: the **standalone
glossary** (`glossary.html`, no lesson kernel) and the in-lesson **click-to-define
panel + agenda chips + `[[concept:...]]` mentions** (`page-shell.js`). Must be
voice- AND language-aware, native Spanish first (`default`/`es`), other voices as
future slots. Forces: static hosting (client-side fetch only); the glossary has no
kernel/resolver wired; the English render must stay byte-identical; the audited
English graph (`docs/concepts`) must remain the single canonical source.

## 3. Architecture

Pipeline (one canonical source; two seeded targets; one derived index per voice/lang):

```
docs/concepts/<track>.concepts.json    (canonical: id, term, def, relationships; audited)
        |  seed-concepts.mjs
        +--> meta.js  concepts: { introduces:[{id}], revisits:[{id}], uses:[{id}] }   (GRAPH, metadata)
        +--> res/strings/default/en.json  concept.<id>.term / concept.<id>.def          (TEXT, English base)

res/strings/<voice>/<lang>.json  concept.<id>.term? / concept.<id>.def   (TEXT, translations - authored)

        |  generate.mjs (aggregate graph + text)
        v
generated/concept-index.js          window.ConceptIndex  = { defs:{id:{term,def}}, byConcept, byLesson }   (English, byte-identical)
generated/concept-i18n.<lang>.js    window.ConceptI18nData[<lang>] = { <voice>: { id: {term?, def?} } }    (raw overlays, per lang)
```

Fallback (resolved at runtime, one policy - the resolver's chain, then the graph):

```
(voice,lang).field -> (default,lang).field -> (voice,en)=none -> ConceptIndex.defs[id].field (English graph)
```

`term` and `def` fall back **independently** (a kept-English term omits its
`.term` key and falls through to the graph term).

## 4. Contracts

### 4.1 Bundle key schema (in `res/strings/<voice>/<lang>.json`)
```
"concept.<id>.def":  "<one-line definition>"      // required for 100% coverage
"concept.<id>.term": "<display term>"             // optional; omit => English term
```
`<id>` must be a concept **introduced** by that lesson (validated).

### 4.2 Generated artifacts
- `concept-index.js` - unchanged shape, English only, **byte-identical** after migration.
- `concept-i18n.<lang>.js` - `window.ConceptI18nData = window.ConceptI18nData || {}`;
  `window.ConceptI18nData["<lang>"] = { "<voice>": { "<id>": { term?, def? } } }`.
  Only voices/ids actually present in the bundles; no fallback baked in.

### 4.3 `ConceptI18n` (new, DOM-free module `resource/concept-i18n.js`)
```
ConceptI18n.create({ overlays, base, selection })
  // overlays  : window.ConceptI18nData[lang] || {}   (voice -> id -> {term?,def?})
  // base      : window.ConceptIndex.defs             (id -> {term,def})  terminal English fallback
  // selection : { voice, lang }
  -> { term(id), def(id), ids(), search(id) }
```
- No dependency on the kernel, `LESSON_META`, or the DOM (usable on the bare glossary).
- Fallback order per field = the resolver's `(voice,lang)->(default,lang)->...->base[id]`.
- English path: no overlays loaded => every value comes from `base` => byte-identical.

### 4.4 `PageShellConcepts` (new Localizable surface in `page-shell.js`)
```
window.PageShellConcepts = { setConceptSource(ci18n), setLocale() }
```
- `conceptDef`/`conceptTerm` read through the injected source; unset => read
  `ConceptIndex.defs` exactly as today (byte-identical, legacy pages safe).
- `setLocale()` re-renders the agenda chips (extract `renderAgenda` to be
  re-callable) and re-fills an open panel. Pushed onto the kernel-controller
  `surfaces` so a language swap re-localizes concepts with the rest.

## 5. Component changes (what to build)

| File | Change |
|---|---|
| `tools/seed-concepts.mjs` | Seed text into `res/strings/default/en.json` (`concept.<id>.term/.def`); seed only the graph (ids + relationships) into `meta.js`. |
| every `content/**/meta.js` | `concepts.introduces[]` becomes `[{id}]` (drop `term`/`def`); `revisits`/`uses` unchanged. (Migration, scripted.) |
| every `content/**/res/strings/default/en.json` | gains `concept.<id>.term/.def` for concepts that lesson introduces. (Migration, scripted.) |
| `tools/generate.mjs` | Read concept `term`/`def` from `default/en.json` (not meta); still emit byte-identical `concept-index.js`. Emit `concept-i18n.<lang>.js` per non-default lang from the bundles. |
| `tools/validate.mjs` | For each declared `(voice,lang)`: every introduced concept has `concept.<id>.def` (missing => ERROR = 100% gate); `concept.<id>` ids subset of graph (unknown => ERROR). Concept keys excluded from the prose subset/arity check. |
| `resource/concept-i18n.js` | New `ConceptI18n` adapter (above). |
| `page-shell.js` | `conceptDef/conceptTerm` via injected source + `PageShellConcepts` surface + re-callable `renderAgenda`. |
| `resource/kernel-controller.js` | Load `concept-i18n.<lang>.js`, build `ConceptI18n`, `setConceptSource`, push `PageShellConcepts` onto `surfaces`; re-init on `relocalize()`. |
| `glossary.html` | Load the graph + (when `lang!=en`) `concept-i18n.<lang>.js`; build `ConceptI18n`; render `term/def` + rebuild `dataset.search` from resolved text. |

## 6. Phased plan (each phase gated by Verify)

### Phase A - migration + contracts + scaffold (NO translations)
Move English term/def into `default/en.json`; wire `seed-concepts`/`generate` to
the new home; ship `ConceptI18n`, `PageShellConcepts`, the two consumers, and the
validator coverage rule; create no es concept keys yet.
**Verify (byte-identical-English gate):**
1. `node tools/generate.mjs` => `generated/concept-index.js` **byte-identical** to pre-change (diff 0).
2. `node tools/validate.mjs` => 0 new errors.
3. Headless `glossary.html` at `lang=en` => DOM diff 0 vs pre-change; 0 `undefined`.
4. A kernel lesson (`control-flow`) agenda + panel identical at `lang=en`; 0 `undefined`.
5. No `concept-i18n.*` fetch fires on English.

### Phase B - the es translation to 100% (fleetable)
Add `concept.<id>.def` (+ `term` where translated) to every lesson's
`res/strings/default/es.json`, native-first per `/memories/repo/es-voice.md`,
in waves by track prefix (`pr-`/`th-`/`ai-`), disjoint files per subagent.
**Verify per wave:** coverage gate passes for the wave's concepts; es glossary shows
es term+def and es search matches; a kernel lesson live-swaps an agenda chip +
panel en->es with no reload. **Done = 100% es coverage (gate green course-wide).**

### Phase C - extra voices / languages (slots)
Add `child`/`academic` es, or a new `<lang>`, one bundle set at a time.
**Verify:** fallback resolves `child->default->graph`; missing `child` def paints
the `default` def then the English term.

## 7. Risks / YAGNI

- **Risk:** the migration silently alters an English def => caught by the Phase-A
  byte-identical `concept-index.js` diff gate.
- **Risk:** graph rename orphans an es key => validator ERROR (id subset check).
- **YAGNI (not building):** no per-lesson concept fetch (glossary needs the
  aggregate); no build-time fallback resolution (kept in `ConceptI18n`, one
  policy); no live-swap on the glossary (reference page, reload is fine); no
  pluggable concept backend (the resolver already is that).

## 8. Progress log

- 2026-07-31 - Design approved (owner). Decisions locked (section 1). Not started.
