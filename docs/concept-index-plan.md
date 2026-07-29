# Concept-index architecture - action plan

Status: IN PROGRESS. `course-manifest.js` RETIRED (item 12 done) - `course-registry.js` is now the
single source of the course path (chrome + order + the capstone's inlined card), and every lesson's
display data lives in its `meta.js`. 75/76 lessons migrated (only the external capstone stays flat, by
design). Phase 0 done (10/10); concept graph drafted (208), audited, applied. CG3 re-audit done
(fingerprint stable since CG2; P1=0, a few P2/P3 refinements pending sign-off); Phases 1-3 cleared to
start. Owner: Isaac + agent. Last updated: 2026-07-29.

Tracking: each action item is a checkbox. Flip `- [ ]` to `- [x]` when the item is
DONE and its Verify step passes. Use `- [~]` for in-progress. Keep the Progress
table in sync.

## Progress

| Phase | Items | Done |
|---|---|---|
| 0 - Foundation (source of truth + tooling) | 1-8 (incl. 4b, 5b) | 10 / 10 |
| Pilot migration | 9-12 (incl. 11b, 12b) | 6 / 6 |
| Concept graph (feeds 1-3) | CG1-CG3 | 3 / 3 |
| 1 - Glossary | 13 | 0 / 1 |
| 2 - Agenda | 14 | 0 / 1 |
| 3 - Concept mentions | 15 | 0 / 1 |
| 4 - Evaluation (submodule) | 16-18 | 0 / 3 |

## Progress log

- **2026-07-28** - Data-source first slice landed (NOT committed). New files: `tools/generate.mjs`
  (reads `course-manifest.js`, emits `generated/course-data.js` + `generated/concept-index.js`),
  `tools/generate.test.mjs` (parity 5/5 + determinism), `course-registry.js` (76 lines seeded,
  1 external), `templates/lesson.html.tmpl` (4 variants), `templates/meta.example.js` (schema
  sample). Wired: `index.html` now loads `generated/course-data.js`; `course-index.js` +
  `page-shell.js` prefer `window.CourseData` (id-then-filename nav fallback). The 76 flat lesson
  pages still load `course-manifest.js` (fall back to `window.Course`) - they migrate later.
  Verified: parity green, generator deterministic, headless index renders 3 tracks / ~76 cards /
  0 undefined, a flat lesson keeps its manifest + Next. Deferred within these items (`[~]`
  1/2/4b/5/7): generator not yet dual-source (manifest-only, no `meta.js` read, no per-lesson
  generated `index.html`); template variants not render-verified (open Q: the "drill" archetype -
  no live page loads `drill-engine.js`, `control-flow.html` is now `build`); flat->nested nav
  boundary untestable until a lesson moves.
- **2026-07-28 (Wave 2)** - Toolchain + first real migration (NOT committed). New tools, all verified:
  dual-source `tools/generate.mjs` (flat lesson via manifest, migrated via its `meta.js`, emits the
  lesson `index.html`), `tools/new-lesson.mjs` (`--from` migrate incl. asset-path fix + `--new`
  scaffold), `tools/validate.mjs` (15/15 fixture checks, clean on repo). Parity test evolved to be
  migration-aware (6/6). Item 7 finished: all 76 pages now load `generated/course-data.js` (the
  manifest is a generator input only). CI (`deploy.yml`) gained setup-node + generate + validate +
  drift guard; authoring docs updated (target flow + legacy noted). PILOT: `type-conversion` migrated
  to `content/practical/02-everyday-essentials/01-type-conversion/`; verified parity 6/6, validate
  clean, headless render 0-undefined + editor mounts, boundary nav correct (reuse-without-regret ->
  content/ -> strings), runner URL resolves HTTP 200. BUG caught + fixed by the pilot: the
  page-relative `runnerUrl` in `data.js` 404'd four dirs deep; `new-lesson` now prefixes it with
  `../../../../` at move time. Open: template drill/viz/checkpoint variants unproven until one
  migrates; a live-browser Run click was not done (no puppeteer) - relied on equivalence + runner-200.
  NEXT: Wave 3 bulk migration fleet (items 10-11).
- **2026-07-28 (Wave 3a)** - Pilot unit + archetype proofs (NOT committed). Migrated the 6 remaining
  everyday-essentials build lessons (strings, arrays, class-members, null-safety, access-properties,
  type-system) and proved the viz (theory-1) + checkpoint (theory-check-1) template variants
  end-to-end: 9 migrated total, parity 6/6, validate 0 errors (9 untagged-concept warnings), all
  render headless 0-undefined with editor/viz/quiz mounts. BUG found + fixed: page-shell derived the
  viz `awardedKey` from the filename (now `index.html` on a migrated page) - it now prefers
  `LESSON_META.key`, filename fallback for flat pages. All 4 template variants proven except "drill"
  which has no live instance (nothing loads `drill-engine.js`). REALITY on fleeting: bulk migration is
  SERIAL - each `--from` mutates `course-registry.js` + regenerates `generated/`, so parallel agents
  would corrupt them; and `reuse-without-regret` is a non-standard walkthrough lesson (own inline
  runner) outside the 4 variants, needing manual handling. So migration is done directly; the FLEET is
  aimed at the per-track concept graph (read-only, disjoint). NEXT: concept-research fleet -> apply to
  meta.js -> continue migration (theory/ai + practical remainder) -> item 12 retire manifest.
- **2026-07-28 (Wave 3b)** - Concept graph fleet (NOT committed). 3 read-only per-track agents drafted
  the concept graph into `docs/concepts/{practical,theory,ai}.concepts.json`: 76 lessons, 207
  track-scoped concepts (`pr-`/`th-`/`ai-`), introduce-once holds within each track, all references
  resolve. `new-lesson.mjs` now SEEDS `meta.js` concepts from these drafts on migration, and I applied
  them to the 9 already-migrated lessons -> `generated/concept-index.js` now carries 27 concepts / 9
  lessons. `validate.mjs` made transition-aware: a `revisits`/`uses` ref to a concept whose introducing
  lesson is not migrated yet resolves against the draft vocabulary (0 errors; 23 orphan warnings =
  concept whose revisiter is still flat - expected, non-blocking). parity 6/6. Judgment calls flagged
  for review: SRP owned by `reading-objects` (not the SOLID lesson); the OO trio owned by the
  `reuse-without-regret` preview; DI vs DIP split; ai memory taxonomy (5 kinds); grounding owned by
  `ai-22` not `ai-14`. The drafts are the reviewable authority; `meta.js` is seeded from them. NOTE:
  validate's opt-in drift guard (`VALIDATE_DRIFT=1`) still assumes `generate.mjs --out` which doesn't
  exist - CI uses regenerate+git-diff, so off by default; reconcile later. NEXT: review the concept
  vocabulary, then continue migration (concepts auto-seed; orphans resolve as tracks complete).
- **2026-07-29 (audit + skill)** - Concept vocabulary audited (NOT committed). A single global
  reviewer critiqued the 3 drafts -> `docs/concepts/vocabulary-review.md`: verdict "good first draft,
  build on it", P1=2 / P2=7 / P3=6, none blocking. Top items for the human: missing `Constructor`
  concept (practical); `ai-embedding` def describes ahead-of-time embedding when the lesson embeds the
  query live; `ai-retrieval` overlaps `ai-rag`; a few `ai-` defs break the one-sentence voice rule;
  `th-run-time`/`th-runtime-platform` display terms collide. Cross-track overlap set listed for a
  unify-or-keep decision. No draft edited - awaiting the human's own re-review. Also packaged the
  audit as a reusable SKILL: `.github/skills/concept-vocabulary-audit/SKILL.md` (rubric +
  one-global-reviewer rule + a fingerprint staleness trigger; baseline recorded in the review header:
  fp=8b052068c017, lessons=76, concepts=207). NEXT (unchanged): human re-reviews the vocabulary ->
  apply agreed fixes to the drafts (`generate` re-seeds `meta.js`) -> continue migration (item 11) ->
  retire the manifest (item 12) -> build the glossary / agenda / mentions features (Phases 1-3).
- **2026-07-29 (CG2 applied)** - Approved vocabulary fixes applied (NOT committed). 3-agent fleet
  (one per track, disjoint drafts) folded ALL P1/P2/P3 findings from `vocabulary-review.md` into
  `docs/concepts/*.json`: practical 78->81 concepts (added `pr-constructor`/`pr-field`/`pr-class`,
  fixed `pr-readonly`), theory 83->81 (folded inode/hard-link/soft-link -> one `File` concept, fixed
  the `theory-3` "function" forward reference, renamed `th-runtime-platform` term to ".NET runtime"),
  ai (corrected `ai-embedding`, narrowed `ai-retrieval` vs `ai-rag`, trimmed editorial tails on
  `ai-llm`/`ai-workflow`, sharpened `ai-transcript` vs `ai-trace`). New tool `tools/seed-concepts.mjs`
  re-seeds every migrated `meta.js` from the drafts (needed because `generate` reads `meta.js`, it
  does not re-seed). Re-seeded the 9 migrated lessons, regenerated (concept-index 27->28), parity 6/6,
  validate 0 errors. Fingerprint `617584744ca3`; review marked RESOLVED. Cross-track overlap left
  track-scoped. NEXT: item 11 - continue migration (concepts now auto-seed the corrected graph).
- **2026-07-29 (item 11: practical track)** - Migrated the 21 remaining practical `build` lessons
  (foundations ... the-solid-principles) with `new-lesson.mjs --from ... --move`, one loop. Now
  **30/76 migrated** (all of practical bar two). SKIPPED `reuse-without-regret` (non-standard
  walkthrough, engine=NONE - its archetype detection would mis-file it; handle by hand) and the
  external capstone. Verified: parity 6/6, validate 0 errors / 43 orphan warnings (transition),
  concept-index 28->82 concepts / 30 lessons (now includes `pr-constructor`@reading-objects and
  `pr-class`@foundations). Headless: `foundations` + `the-solid-principles` render with editor,
  0 undefined; the still-flat `reuse-without-regret` renders 0 undefined (its root-relative runner
  still resolves because it stays at repo root); index shows all cards. Boundary nav correct across
  the flat `reuse-without-regret` (reading-objects -> reuse -> type-conversion). NEXT: migrate theory
  (viz + checkpoints) then ai; then the two practical exceptions; then item 12 retire the manifest.
- **2026-07-29 (item 11: theory + ai)** - Migrated the 23 remaining theory lessons (viz + the 4
  `theory-check-*` checkpoints) and all 21 ai viz lessons via `new-lesson.mjs --from ... --move`.
  Now **74/76 migrated** - only `reuse-without-regret` (item 11b) and the external capstone are flat.
  Parity 6/6, validate 0 errors / 87 orphan warnings (transition; the remaining orphans are mostly
  concepts whose revisiter is `reuse-without-regret`, still flat). concept-index 82 -> 204 concepts /
  74 lessons. Headless: an ai viz mounts, a theory checkpoint renders its quiz, the index shows all
  cards - all 0 undefined. Item 11 DONE. NEXT: 11b (hand-migrate the walkthrough) -> item 12 retire
  the manifest -> CG3 audit gate -> Phases 1-3 (glossary / agenda / mentions).
- **2026-07-29 (code review + fixes, then commit)** - Read-only review of the 5 tools + runtime
  seams found 2 P1s, both fixed + verified: (1) a migrated page's "Next" used a root-relative href
  that 404s from four dirs deep - `page-shell` now prefixes it with `../../../../` when `LESSON_META`
  is present (verified: bare href 404s, prefixed href 200s); (2) validate's `VALIDATE_DRIFT=1` guard
  shelled `generate.mjs --out` which did not exist and would rewrite the real `generated/` -
  `generate.mjs` now supports `--out <dir>` (data files only, skips index.html); guard is green +
  non-destructive. P2 fixes: `new-lesson` fails loud on an undetectable archetype (no silent
  "checkpoint"), pre-checks the registry before writing (no half-migrated dir), handles single-quoted
  `runnerUrl` + warns on a remaining bare one; `seed-concepts` guards its positional rewrite (unique
  marker + `};` tail). Deferred (noted, not blocking): P3 dedup of shared helpers into `tools/lib.mjs`.
  All gates green (parity 6/6, validate 0 err, deterministic). Banked the whole migration in one commit.
- **2026-07-29 (remaining review findings, no deferrals)** - Closed every leftover finding. P2-#6:
  the drift guard now also diffs each migrated `content/**/index.html` - `generate.mjs --out <dir>`
  mirrors the pages into the scratch dir and `driftGuard` compares them (proven: perturbing one page
  makes the guard ERROR on that file, and it still writes nothing to the real tree). P3-#8: extracted
  `loadBrowserGlobal` / `loadWindowBag` / `idFromHref` / `conceptsLiteral` into `tools/lib.mjs`; the
  four tools import them (validate re-exports for its harness), so the meta.js format can no longer
  drift between `new-lesson` and `seed-concepts`. P3-#9: the `prefix:` line the generator injects is
  now indented to match `archetype:` and the match is anchored to that real property line (re-indented
  28 build pages; viz/checkpoint untouched). #11: added the trust-model note where the registry `path`
  is joined. #10 (ReDoS) was an all-clear - no code change. Gates: parity 6/6, validate 0 err, drift
  guard 0 err + non-destructive, `seed-concepts` idempotent (0 meta.js churn), two build pages render 0
  undefined. Committed the fixes.
- **2026-07-29 (item 11b: re-create reuse-without-regret)** - Re-authored the last flat lesson as a
  standard `build` lesson via a 3-agent read-only research fleet (content inventory / archetype +
  tooling / concepts + neighbours) then serial authoring. Chose `build` over the plan's default `drill`
  on the fleet's evidence: 28 live build lessons vs 0 live drill lessons in `content/`, and the
  authoring skill prefers build for practical Part 1. Distilled the 12 read-and-choose cards into 4
  write-from-scratch tasks - inheritance (is-a), composition (has-a), `virtual`/`override` polymorphism,
  and the diamond dissolved by composition - plus a recap (total 4). Calibrated to ledger row 6:
  `virtual`/`override` not `abstract`, no `=>`/`var`/`$""`, explicit types + full bodies. Scaffolding
  caveat: a bare `--new` would have made `07-` + a duplicate id, and `--from --move` throws at the new
  fail-loud archetype check (the bespoke page loads no engine) - so removed the flat registry line first,
  then `--new` landed it at `06-`. Preserved all four `introduces` (sole introducer; 5 downstream OO/SOLID
  lessons revisit them) + revisits `pr-delegation` + uses `pr-object`/`pr-method`. Verified with real
  dotnet: all 4 solutions compile + match expected, every `requireSource` gate matches, every reordering
  `verify` probe passes (hardcoding defeated) - 0 failures. generate + validate 0 err; page renders 0
  undefined with the `rwr` build scaffold + Monaco; root card data-driven (gentle/25 min/total 4); both
  boundary next targets reachable (200). Deleted the flat `reuse-without-regret.{html,js}`. Item 12 unblocked.
- **2026-07-29 (11b review + skill capture)** - A read-only fleet reviewed the new lesson and the skills
  gaps. Code review found 2 P2s, both fixed + re-verified with dotnet: (1) task 4 "Two abilities" was
  cheatable - a learner could hold both parts unused and hardcode the returns, passing `expected` + the
  field gates + the reorder `verify` (which only reorders the calls) - added two per-method delegation
  gates and a negative check now confirms the cheat is blocked; (2) the recap falsely claimed the learner
  had "already shipped" a capstone `TestRunner`/`IReporter` (rows 20-30 - untaught jargon in a Part-1
  recap) - reworded to a plain has-a teaser. Also softened two TODOs that handed the literal
  `class Dog : Animal` (the `context`/`example` carry the syntax). Skill capture: the flat-registry-line
  scaffold caveat went to `learnings.instructions.md`; the build-is-the-only-live-archetype fact, the
  `--new`-doesn't-seed-concepts / sole-introducer rule, and the intentionally non-compiling starter
  nuance went to the `lesson-authoring` skill. All 4 tasks re-verified 0 failures; validate 0 err.
- **2026-07-29 (item 12: retire the manifest)** - `course-registry.js` is now the single source of the
  course path. A 2-agent read-only fleet mapped the blast radius (build-time consumers + a definitive
  "no runtime page loads the manifest"). Moved the track/part chrome (name/kicker/blurb/partPrefix +
  part titles) into a `tracks[]` structure on the registry and inlined the external capstone's card
  fields on its lessons[] line; `generate.mjs` now walks the registry and re-derives each part's kicker
  from `partPrefix + ORDINALS[position]`. Retargeted `validate.mjs` (dropped manifestInfo + the vacuous
  order check), rewrote `generate.test.mjs` to invariants over CourseData + registry + meta (no
  manifest), pointed `new-lesson.mjs --new` at `registry.tracks` (and made `--from` fail loud), updated
  the template to load `generated/course-data.js` directly, and DELETED `course-manifest.js`. PROOF:
  `generated/course-data.js` + `concept-index.js` are byte-identical except the one-line header comment;
  parity 7/7 (added a kicker-derivation test); validate + drift guard 0 err; root index + a lesson page
  render 0 undefined with no manifest refs. Post-change code review (fleet) found no must-fix; fixed the
  three stale \"source = manifest\" comments (page-shell/course-index/lib).
- **2026-07-29 (item 12 follow-up: prune dead --from)** - Removed the now-unreachable `--from` migration
  path from `new-lesson.mjs`: dropped `migrateFrom` + its 8 helpers (`locateInManifest`, `readPageHero`,
  `detectArchetype`, `loadConceptDraft`, `stripNav`, `fixAssetPaths`, `assertRegistryHasFlat`,
  `updateRegistry`) + the unused `vm`/`loadWindowBag` imports + `manifestPath`. `--new` (the only live
  path) is unchanged; `--from` now prints a clear retired message. node --check + `--new`/`--from`/usage
  dispatch verified; parity 7/7, validate 0 err, generated/ unchanged.
- **2026-07-29 (CG3: standing vocabulary audit)** - Re-ran the `concept-vocabulary-audit` skill as the
  gate before Phases 1-3 (all tracks migrated). The graph fingerprint is UNCHANGED since CG2
  (`617584744ca3`, 76 lessons / 208 concepts) and the drafts == the migrated `meta.js`, so every
  introduced def is identical to the CG2-resolved state. A single global reviewer (the skill's prescribed
  method over a per-track fleet) confirmed all CG2 fixes still hold and did a fresh-eyes pass on what the
  fingerprint does not cover (edges/placement/coverage/cross-track/voice). Verdict: good-enough-to-build-on,
  Phases 1-3 CLEARED. New findings (NOT applied - the skill gates fixes on sign-off): P1=0; P2 x4
  (practical leans on an untaught \"value type\" in `pr-struct`/`pr-record`/`pr-nullable-value-type`;
  `pr-single-inheritance` overlaps `pr-favour-composition`; `pr-runtime-dispatch` vs `pr-polymorphism`;
  `ai-1` uses \"token\" before `ai-2`); P3 x4 (top: `th-file` and `th-inode` both render the term \"File\"
  - a collision CG2's inode-fold introduced; `ai-react` \"grounded\" before `ai-grounding`; `ai-evaluation`
  \"can never\"; `pr-to-string`/`pr-tostring-override` near-dup ids). Report -> `vocabulary-review.md`. Also
  fixed the audit skill's stale ground-truth (`course-manifest.js` -> `course-registry.js`).

---

## The idea (hard constraints)

1. Directory tree: each lesson lives in its own directory - `content/<track>/<NN-part>/<NN-lesson>/`.
2. Lesson-local metadata: each lesson owns its `meta.js`, including the concepts it
   introduces / revisits / uses. A concept's definition lives ONLY in the one lesson
   that introduces it (introduces is unique course-wide).
3. Thin registry: `course-registry.js` references lessons + order only. Adding a lesson
   is one line; removing a lesson is deleting that one line and never touches the lesson.
4. Generated indexes: a node generator turns lesson-local metadata into committed
   aggregate index files, so concept existence and a concept's lessons are detectable
   without reading every lesson.

## Architecture summary

Author-time inputs -> generator (node) -> committed generated indexes + generated
per-lesson HTML -> runtime pages consume the generated indexes.

```
content/<track>/<NN-part>/<NN-lesson>/
    meta.js      # window.LESSON_META: title/key/total/pill/time/blurb + concepts{introduces,revisits,uses}
    data.js      # window.BUILD_CONFIG / DRILL_CONFIG (lesson content)
    viz.js       # optional window.LESSON_VIZ (theory/ai)
    index.html   # GENERATED from templates/lesson.html.tmpl - never hand-edited
course-registry.js            # thin: track/part/lesson-path + order only
tools/new-lesson.mjs          # scaffold: create dir + stubs + registry line; --from migration mode
tools/generate.mjs            # generator
tools/validate.mjs            # alignment validator
templates/lesson.html.tmpl    # single HTML template the generator fills (per archetype variants)
generated/course-data.js      # window.CourseData (replaces course-manifest.js at runtime)
generated/concept-index.js    # window.ConceptIndex (concept -> def + introducedBy/revisitedBy/usedBy)
glossary.html                 # Phase 1 (reads generated/concept-index.js)
# shared engines/vendor STAY at repo root: page-shell.js build-engine.js drill-engine.js styles.css vendor/ course-index.js
```

Key decisions:
- Lesson HTML is GENERATED (kills the ~76x shared-`src` path-rewrite risk); fixed-depth
  dirs mean a constant `../../../../` prefix baked into every generated page (works on
  GitHub project pages; no `<base>`/absolute paths).
- Join key = `lessonId`, NOT filename (every nested page is `index.html`, so
  `pathname.pop()` would collide). Nav + XP key on `id`.
- Generated files are committed (deploy is a plain static rsync, no node step; local dev
  serves files directly), with a CI drift guard that re-runs the generator and fails if
  the committed output is stale.

---

## Phase 0 - Foundation: source of truth + tooling

- [x] **1. Lesson `meta.js` schema.** `window.LESSON_META`: `id` (= current flat basename,
  stable across the move), `key`, `total`, `docTitle`, `eyebrow`, `title`, `intro` (array of
  string | `{html,class}`), `blurb`, `links` (default `[{href:"index.html",label:"Back to the course"}]`),
  `pill`, `time`, `archetype` (build/drill/viz/checkpoint/**external**), `engine`,
  `concepts:{ introduces:[{id,term,def}], revisits:[{id}], uses:[{id}] }` (`introduces` owns the
  canonical `def`). Also define the concept-mention token grammar here - `[[concept:id|label]]` -
  so it can't collide with `renderInline`'s `` `code` `` / `**bold**` splitter. Verify: `node --check` a sample.
- [x] **2. `templates/lesson.html.tmpl`** with FOUR archetype variants (build, drill, viz,
  checkpoint): Prism tags for drill + viz only; engine script for build + drill; `*.viz.js`
  for viz; `QUIZ_CONFIG` data + no engine for checkpoint; all load `meta.js`. Fixed
  `../../../../` relative prefix; assert every lesson dir sits at exactly that depth. Verify:
  a rendered page of EACH variant matches today's `<head>` + script set/order (type-conversion
  = build, a drill, theory-1 = viz, theory-check-1 = checkpoint).
- [x] **3. `tools/new-lesson.mjs` (scaffold).** `--track --part --id --archetype --title`
  creates the lesson dir, writes `meta.js` + `data.js` (+ `viz.js`) stubs, and appends the
  one `course-registry.js` line in order. `--from <flatfile>` mode moves an existing flat
  lesson into the tree, pre-fills `meta.js` from the current manifest entry AND the current
  HTML hero (eyebrow/intro), and STRIPS any literal `nextHref`/`nextLabel` from the moved
  data file (nav derives from the registry). Verify: scaffold a throwaway lesson ->
  `node --check` stubs -> generate renders its `index.html` -> validate passes -> delete it.
- [x] **4. `course-registry.js` (thin registry).** Lines carry `{track, part, id, path|href, kind?}`
  - structure + order only, no display/concepts. Order lives ONLY in the registration
  sequence; `NN-` dir prefixes are cosmetic and MUST NOT drive order (theory registers 21
  before 20). Seed with all 76 lessons by current flat href + the capstone as `kind:"external"`.
  Verify: `node --check`; 76 lessons + 1 external.
- [x] **4b. Registry flat fallback + external entries.** Every non-external line resolves to a
  `meta.js` if its dir exists, else (until migrated) to its matching `course-manifest.js`
  `register()` entry. `kind:"external"` (capstone `level3-app/`) has href only - no dir, no
  meta, no generated HTML, exempt from dir/meta/total checks. Verify: generator + validator
  handle a mixed flat/nested/external set.
- [x] **5. `tools/generate.mjs` (DUAL-SOURCE generator).** For each registry line: read its
  `meta.js` if the dir exists, else the matching `course-manifest.js` entry (so `CourseData`
  is complete from day one, before any migration). Emit committed `generated/course-data.js`
  (`window.CourseData` with `id` + `href` + `locateById`), `generated/concept-index.js`
  (`window.ConceptIndex` reverse maps + defs), and a generated `index.html` per MIGRATED
  lesson (external + un-migrated lessons keep their existing file). Verify: `CourseData`
  reproduces today's `window.Course` shape for all 76; `node --check` outputs.
- [x] **5b. Generator tests.** `tools/generate.test.mjs` under `node --test`: `CourseData`
  projection deep-equals legacy `window.Course` for all 76 (order, href, key, total, kind);
  re-run generator and diff committed output (unit form of the drift guard). Verify: green;
  a mutated manifest fails it.
- [x] **6. `tools/validate.mjs` (alignment).** Checks: unknown concept id (used/revisited but
  never introduced); concept introduced by >1 lesson; orphan concept (warn); untagged lesson
  (warn); registry -> missing dir (error, external exempt); dir not in registry (warn);
  duplicate `id`/`key`; `meta.total` != card count (external exempt); generated files stale
  vs a fresh run. Verify: green now; a planted bad concept fails it.
- [x] **7. Retarget runtime on `id`.** Pages load `generated/course-data.js`. `page-shell`
  nav (`location.pathname` basename -> lookup) and the viz `awardedKey` fallback prefer
  `window.LESSON_META.id`, else the filename basename; both resolve through
  `CourseData.locateById` (flat basename == id, so no special-casing). `course-index.js`
  unchanged. Verify: headless index (3 tracks, counts, CTA) + prev/next across a flat->flat
  AND a flat->nested boundary.
- [x] **8. CI wiring.** Add `actions/setup-node` to `.github/workflows/deploy.yml`; run
  generate + validate + drift guard before rsync (generated files stay committed; `content/`
  + `generated/` ship via the existing `rsync ./`; `level3-app` still `cp`s from
  `blazor-publish`). Verify: CI green; a stale `course-data.js` fails it.

## Pilot migration (scaffold `--from` is the engine)

- [x] **9. One lesson.** `new-lesson.mjs --from type-conversion.js` ->
  `content/practical/02-everyday-essentials/01-type-conversion/`; fill concepts; generate;
  repoint the registry line. One lesson per commit (`git revert`-able). Verify: headless
  render + Run + prev/next crossing into still-flat `strings.html`; no literal `nextHref` remains.
- [x] **10. Pilot unit.** Migrate the rest of everyday-essentials (strings ... type-system).
  Verify per lesson: `node --check`, the dotnet compile harness, headless, `total` == card count.
- [x] **11. Remaining tracks.** practical -> theory (incl. viz + `theory-check-*`
  `QUIZ_CONFIG`) -> ai, one track at a time. Verify: validator green after each; spot headless
  a viz lesson + a checkpoint. (DONE 2026-07-29: all three tracks migrated, **74/76** - practical
  (build), theory (viz + 4 checkpoints), ai (viz); parity 6/6, validate 0 errors. Two lessons are
  NOT auto-migratable and are tracked as **11b**: `reuse-without-regret` and the external capstone.)
- [x] **11b. Re-create `reuse-without-regret` the standard way.** It is the only lesson NOT built as
  data-for-a-shared-engine - a bespoke ~42KB guided walkthrough with its own page markup, custom
  controller, and its own inline `RoslynIframeRunner`. Decision (2026-07-29): do NOT port the one-off
  and do NOT add a single-use `walkthrough` archetype; instead RE-CREATE it as a standard-archetype
  lesson via the `lesson-authoring` skill (its "read the code, then answer" shape fits `drill`;
  `build` is the alternative), scaffolded with `new-lesson.mjs` so it lands in
  `content/practical/01-understand-the-ideas/06-reuse-without-regret/` like every other lesson, then
  delete the flat `reuse-without-regret.{html,js}`. Preserve its content (is-a vs has-a, favour
  composition, the diamond problem) and its concepts (already in the practical draft). Blocks item 12.
- [x] **12. Retire `course-manifest.js`.** Delete it AND the manifest-fallback branch in
  `generate.mjs` once every lesson has a `meta.js`. Verify: no page loads it; generator green
  with meta-only input; full headless pass per archetype. (UNBLOCKED as of 11b: only the external
  capstone lacks a `meta.js`, and it is exempt - the generator must still emit its manifest-sourced card.)
- [x] **12b. Update authoring docs.** Rewrite `.github/skills/lesson-authoring/SKILL.md`,
  `.github/copilot-instructions.md`, and `AGENTS.md` for the `new-lesson.mjs` ->
  `meta.js`/`data.js` -> generate/validate flow and the `content/` layout, so future authors
  don't create flat lessons. Verify: no stale "create `<name>.js` + `<name>.html`" guidance remains.

## Concept graph (feeds Phases 1-3)

The shared vocabulary the glossary, agenda, and mentions render. It has its OWN tooling and
docs - tracked here so they are not forgotten: the drafts
`docs/concepts/{practical,theory,ai}.concepts.json`, the audit skill
`.github/skills/concept-vocabulary-audit/SKILL.md`, and the latest review
`docs/concepts/vocabulary-review.md`. `new-lesson.mjs` seeds a migrated lesson's `meta.js`
concepts from the drafts; `generate` aggregates them into `generated/concept-index.js`; re-seed the
already-migrated lessons after a draft change with `node tools/seed-concepts.mjs`.

- [x] **CG1. Draft + audit the vocabulary.** 76 lessons, 207 track-scoped concepts drafted;
  audited by one global reviewer (verdict good-first-draft; P1/P2/P3 in the review). Audit
  skill + fingerprint baseline (`fp=8b052068c017`) recorded in the review header.
- [x] **CG2. Apply the audited fixes.** DONE 2026-07-29: a 3-agent fleet folded ALL approved
  P1/P2/P3 fixes into the drafts - practical +3 (`pr-constructor`/`pr-field`/`pr-class`, `pr-readonly`
  def); theory -2 (folded the filesystem internals, fixed the `theory-3` forward reference and the
  `Run time`/`Runtime` term clash); ai (fixed `ai-embedding`, split `ai-retrieval`/`ai-rag`, trimmed
  editorial tails, sharpened transcript/trace). Re-seeded the 9 migrated `meta.js` with
  `node tools/seed-concepts.mjs`, regenerated, `validate` clean (0 err / 23 orphan warnings), parity
  6/6. Review fingerprint bumped `8b052068c017 -> 617584744ca3` (208 concepts). Cross-track overlap:
  kept track-scoped (no merge).
- [x] **CG3. Audit as a standing gate.** Re-run the `concept-vocabulary-audit` skill (its
  fingerprint says whether it is due) AFTER each track finishes migrating and BEFORE building any
  of Phases 1-3 - do not build a concept feature on an unaudited graph. (Drafts are the source
  until item 12 retires the manifest; then each lesson's `meta.js` is.)

## Phase 1 - Glossary (gated by CG3)

- [ ] **13. `glossary.html`** - searchable, reads `generated/concept-index.js`; each concept
  shows its def + links to its introduce/revisit/use lessons. Shared CSS in `styles.css`.
  Verify: headless - search filters; links resolve.

## Phase 2 - Agenda (gated by CG3)

- [ ] **14. "In this lesson"** in `page-shell.js` from the page's own `LESSON_META.concepts`;
  chip styles in `styles.css`. Verify: headless shows the list; empty is safe.

## Phase 3 - Concept mentions (gated by CG3)

- [ ] **15. Linkify** in `LessonCommon.renderInline` using the `[[concept:id|label]]` grammar
  from item 1 + a concept panel (styled in `styles.css`) populated from `window.ConceptIndex`
  (the many-to-many set). Verify: headless click opens the correct set; no collision with the
  existing `` `code` ``/`**bold**` rendering.

## Phase 4 - Evaluation (touches the code-lab submodule)

- [ ] **16. Tag checkpoint questions** with concept ids in `theory-check-*` data
  (course-side). Verify: validator resolves every id.
- [ ] **17. Extend `CodeLab.Quiz`** (`code-lab/src/dom/quiz-view.ts`) to surface/persist
  per-question/per-concept results; rebuild + re-vendor; commit the submodule first, then
  bump the pointer. Verify: `npm run typecheck && test && build` in code-lab; headless
  checkpoint persists per-concept.
- [ ] **18. Per-concept progress** on glossary + agenda from stored results. Verify: a
  passed concept shows covered.

---

## Smallest safe first slice (corrected after review)

NOT "items 1-8 then pilot". The genuinely smallest reversible slice is DATA-SOURCE ONLY,
zero file moves:
1. Item 5 (dual-source generator) reading the EXISTING `course-manifest.js` for all 76 ->
   emit `generated/course-data.js`.
2. Item 5b parity test proving `CourseData` deep-equals legacy `Course`.
3. Item 7 flip the ~4 `<script src>` swaps (index + lesson pages) to load `course-data.js`
   and resolve nav by id-with-filename-fallback.
No `content/` dirs, template, `new-lesson`, or registry restructure yet - those are the
pilot's enabling tooling. Behaviour is byte-identical; rollback = delete `generated/` +
revert the script swaps. Item 9 is the first step that actually moves a file (one lesson,
one commit).

## Standard workflows this locks in

- Add a lesson: `new-lesson.mjs ...` -> fill `meta.js` + `data.js` -> `generate` -> `validate`.
- Remove a lesson: delete its one `course-registry.js` line; files untouched;
  `validate --prune` optionally removes the orphaned dir.
- Alignment: the validator + CI drift guard.
- Scale: generator O(lessons), indexes precomputed, no runtime full-scan.

## Risks

- ~76 path rewrites -> mitigated by generated HTML (item 2).
- Filename-as-key collisions -> `id` = flat basename, page carries `LESSON_META.id` (items 1, 7).
- Generated-file-in-git -> committed + CI drift guard + parity test (items 5b, 8).
- GitHub project-page base path -> baked relative prefix (item 2); confirm project vs
  custom-domain page early.
- Literal `nextHref` in data files -> stripped on migration (items 3, 9).
- Capstone / checkpoints -> `kind:"external"` + checkpoint archetype (items 4, 4b, 2).
- Phase 4 needs the code-lab submodule change (sequenced last, items 16-17).

## Review amendments (architect rubber-duck, 2026-07-28)

Folded in: **D1** dual-source generator (items 4b, 5) - fixes the blocker that flat lessons
had no `meta.js` during Phase 0; **D2** `id` = flat-basename join key (items 1, 7); **D3**
`external` kind for the capstone (items 4, 4b); **D4** hero fields eyebrow/intro/docTitle/links
in the schema (item 1); **D5** strip literal `nextHref` on migration (items 3, 9); **D6** four
template variants (item 2); **D7** `actions/setup-node` in CI + generator parity test (items
8, 5b); **D8** order from registry not `NN` prefixes (item 4); **D9** concept-token grammar +
glossary/agenda/popover styles + authoring-docs update (items 1, 12b, 13-15); **D10**
one-lesson-per-commit rollback (item 9). Corrected smallest-first-slice = data-source only,
no file moves (see above).

## Coordination notes

- Phases 0-3 are course-side; only Phase 4 touches the code-lab submodule.
- A separate effort is recovering the pre-reset worktree (untracked
  course-manifest.js/course-index.js/course-nav.js/course-progress.js). Do not collide -
  start Phase 0 only once the worktree is settled.
