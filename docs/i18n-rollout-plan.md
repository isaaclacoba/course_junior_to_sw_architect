# Full-site Spanish (i18n rollout) - plan of record

Status: **APPROVED, T0 (pilot) starting.** Owner: Isaac + agent. Last updated: 2026-07-30.

Goal: the entire course available in Spanish - every lesson (practical, theory, AI),
every hero, all lesson content, AND the chrome (buttons, headings, progress/result/XP
labels, agenda, Settings, landing page). Built on the shipped Phase-1 kernel
(`docs/architecture/lesson-platform-kernel.md`) - the resource layer, the global `lang`
preference, the live no-reload swap, and the binder pattern already work on one lesson.

Owner decisions (2026-07-30):
- **Pilot first**: prove ONE page 100% Spanish end-to-end (T0), then roll out.
- **Translation source**: agent machine-translates a first pass; owner reviews (native ES).
- **Capstone deferred**; the C# WASM host content is out of scope for now.
- **This is the priority.** The parked kernel Phases 2-6 (bus/gamification/debugger) stay
  parked - they are unrelated to language.

## Scope inventory (grounded in the repo)

| Bucket | Where | Size | Mechanism today |
|---|---|---|---|
| Lesson content (hero + tasks/drills/viz) | inline in each `data.js` / `viz.js` | 29 build + 42 viz + 4 checkpoint = 75 | only `build` has a binder; only `reading-objects` extracted |
| Chrome (buttons, headings, progress/result/XP, agenda, Settings) | hardcoded in `page-shell.js` / `build-engine.js` / `drill-engine.js` / `settings.js` | dozens, shared | none - not localizable |
| Landing page | `index.html` (+ generated card data) | 1 page | none |
| Concepts | `docs/concepts` / `generated` (glossary/agenda/panel) | ~200 defs | none |
| Capstone | `level3-exercise/*.cs` (WASM host) | whole exercise | none - DEFERRED |

## Architecture (reuse, don't reinvent)

- **Content**: the existing resource layer (`res/strings/<voice>/<lang>.json` + a per-archetype
  binder). `build` = `bind-build` (exists). ADD `bind-drill` (if needed), `bind-viz`,
  `bind-checkpoint`. Extend `tools/extract-res.mjs` to those archetypes.
- **Chrome-i18n**: a lang-keyed chrome catalog resolved by the same `manager`; a
  `LessonCommon.t(key, englishFallback)` that returns the English fallback when no catalog is
  active (so the 74 non-i18n pages stay byte-identical) and the localized string otherwise.
  Chrome becomes a `Localizable` surface so it swaps live.
- **code-lab chrome** (the vendored widgets' own text): code-lab already exposes a labels API
  (`this.labels = { ...DEFAULT_LABELS, ...(opts.labels ?? {}) }`) on the main widget (Run label),
  the error panel, MemoryViz chip labels and the die view - so those translate as **course-side
  config** (pass Spanish `labels` into the widget), no submodule change. GAP: the `Quiz` widget
  (`quiz-view.ts`) HARDCODES its result strings ("Correct." / "Not quite." / "Checkpoint passed" /
  "Not passed yet" / the "Knowledge check" title fallback) with no labels hook, and some MemoryViz
  scene chrome (e.g. the scrubber `aria-label="Step"`) is inline. Those need a small code-lab
  SUBMODULE change (add `QuizLabels` etc., mirroring the existing `DEFAULT_LABELS + opts.labels`
  pattern) + rebuild + re-vendor. Bounded + low-risk, but it is submodule work - scheduled in
  T2 (viz) / T3 (checkpoint), NOT in the T0 pilot (a build lesson uses only the injectable widgets).
- **code-lab i18n boundary (DECISION).** code-lab must NOT gain its own resource manager
  (resolver/store/fallback) - that stays in the COURSE as the single localization authority;
  code-lab stays i18n-agnostic (renders final, resolved strings; never resolves). Two bounded
  code-lab extensions ARE needed for widget lessons: (a) complete the labels surface (the Quiz
  gap above); (b) a live `setLabels(labels)` / `setLocale()` updater - confirmed there is NO
  post-create label update in code-lab today (labels are create-time only), so a live language
  swap on a Quiz/MemoryViz page would otherwise force a widget re-create (losing widget state),
  breaking the kernel's preserve-state-on-swap contract. Seam: course resolves -> injects labels at
  create -> calls `setLabels` on swap; code-lab renders from what it is given. (Cheaper fallback if
  we skip (b): accept re-create-on-flip for widget lessons = state loss. Recommend (b).)
- **Where strings live (two tiers).** (1) Per-lesson CONTENT (hero + task/drill/viz prose) stays
  in the lesson's own `content/.../<lesson>/res/strings/<voice>/<lang>.json` - VOICE x LANG,
  lesson-specific. (2) SHARED chrome + widget labels live in a site-wide, LANG-ONLY catalog
  `res/chrome/<lang>.json` (chrome has no reading-voice), namespaced: `nav.*` / `card.*` /
  `settings.*` / `agenda.*` (course chrome, read via `t()`) and `quiz.*` / `viz.*` (code-lab widget
  labels). The widget strings live HERE, in the course; a course-side binder (`bind-quiz`/`bind-viz`)
  maps the `quiz.*`/`viz.*` keys onto the widget's `labels` prop. code-lab holds ONLY its English
  `DEFAULT_LABELS` (fallback), never Spanish. Shared, not per-lesson: the Quiz strings are identical
  across all 4 checkpoints, MemoryViz across all 42 viz lessons - one file, no duplication.
- **Hero**: extend `bind-build`/the hero `Localizable` to also cover `title` + `eyebrow`
  (today only `intro` is overridable).
- **Global lang**: the Language control appears on every page (via the Settings popover), and
  every lesson loads the resource runtime. `course_lesson_lang` already persists site-wide.

## Phases

| Phase | Goal | Done |
|---|---|---|
| **T0 - Pilot** | `reading-objects` 100% Spanish end-to-end (hero + chrome-i18n capability + live swap); English byte-identical elsewhere | 5 / 6 |
| T1 - Chrome + landing site-wide | shared frame + `index.html` localizable; global lang control on every page | 0 / 1 |
| T2 - Content rollout | viz/checkpoint binders + extract/translate all 75 lessons (practical -> theory -> AI); code-lab `QuizLabels` + MemoryViz label additions (submodule + re-vendor) | 0 / 1 |
| T3 - Concepts | ~200 concept terms/defs localizable | 0 / 1 |

## T0 - action items (the pilot)

Goal: at `lang=es`, `reading-objects` is a fully Spanish page (hero + content + chrome); at
`lang=en` it is byte-identical to today; the other 74 pages are byte-identical; a live lang
swap flips hero + content + chrome with no reload.

- [x] **1. Tracking scaffold** (this doc + todo + work-log). DONE: committed 6f2ab81.
- [x] **2. Hero i18n.** Added `hero.title` / `hero.eyebrow` / `intro.0` to reading-objects
      `en`/`es` bundles (en = the meta values, so no drift); `bind-build.applyHero` applies
      title/eyebrow when present; the hero `Localizable` (now `repaintHero`) repaints eyebrow +
      title + intro. DONE: es hero = "Lectura de objetos" / "Parte uno..." / Spanish intro; en
      hero unchanged (English); the only render diffs are Monaco/compiler timing (Run-button
      state, editor internals), not the hero; 0 undefined; arity clean.
- [x] **3. Chrome-i18n capability.** `LessonCommon.t(key, english)` reads `window.ChromeText`
      with English fallback; template helpers `tHtml`/`tAttr`/`tSlot` emit a `data-t` marker ONLY
      when a catalog is active; `window.PageShellChrome = { setLocale }` re-targets `[data-t]`
      elements. DONE: control-flow/landing/viz/type-conversion all 0 data-t + 0 undefined (inert
      without a catalog); node --check OK.
- [x] **4. Wire reading-objects chrome through `t()`.** page-shell buildCard headings/buttons +
      build-engine Run/Next/XP/result/run-state read via `t()` (data-t on the static chrome; the
      engine re-applies its dynamic labels on `setLocale`). Authored `res/chrome/en.json` +
      `es.json` (namespaced nav.*/card.*/result.*/run.*); the controller loads it into
      `window.ChromeText`. DONE: control-flow byte-identical (0 non-Monaco diff). DEFERRED to T1:
      Settings/agenda labels, the interpolated `describeExpected` mismatch message, and
      `progressNoun` (per-lesson data) - secondary, off the build card's critical path.
- [x] **5. Acceptance (all pass).** reading-objects `es` = fully Spanish (hero "Lectura de objetos"
      + content + chrome "Objetivo"/"Ejecutar"/"XP del curso:"/...), 0 leftover English on the card;
      control-flow + type-conversion (build) + index (landing) + ai-21 (viz) all byte-safe (0 data-t,
      0 undefined); LIVE swap = `{reload:ALIVE, bufferPreserved:true, hashPreserved:true, Goal->
      Objetivo, Reading Objects->Lectura de objetos, Two objects talk->Dos objetos se comunican}`.
      reading-objects itself gains data-t (it is the i18n page). 0 undefined.
- [ ] **6. Commit T0** (local, not pushed).

## Grounding protocol

Same as the kernel doc: flip checkboxes + append a Progress-log line per step; the in-session todo
list mirrors T0; session memory carries state; every item has an objective Verify gate (not done
until green); `docs/work-log.md` per session; commit per phase.

## Progress log

- **2026-07-30** - Initiative approved (pilot-first; machine-translate + owner review; capstone
  deferred; this is the priority). Analysis grounded in the repo (75 lessons: 29 build / 42 viz /
  4 checkpoint; only reading-objects i18n-ready; chrome hardcoded in the shared engines). Plan
  documented here. NEXT: T0 item 2 - hero i18n.
- **2026-07-30** - T0 items 1-2 DONE. (1) Scaffold committed `6f2ab81`. (2) Hero i18n:
  `hero.title`/`eyebrow`/`intro.0` in en+es bundles, `bind-build.applyHero`, page-shell
  `repaintHero` (eyebrow + title + intro). Verified: es hero fully Spanish, en unchanged (the byte
  diffs were Monaco/compiler timing only - the hero region is identical), arity clean, 0 undefined.
  NEXT: item 3 - the chrome-i18n capability (the shared-engine work).
- **2026-07-30** - T0 items 3-5 DONE (chrome-i18n). page-shell: `LessonCommon.t(key,fallback)` +
  `tHtml`/`tAttr`/`tSlot` (data-t only when a catalog is active) + `window.PageShellChrome`
  (`[data-t]` re-targeter). buildCard headings/buttons wired; build-engine Run/Next/XP/result/
  run-state wired via `tr()` and re-applied on `setLocale`. Authored `res/chrome/en.json` +
  `es.json` (nav.*/card.*/result.*/run.*). kernel-controller loads the lang-only catalog into
  `window.ChromeText` before page-shell and on swap, and registers `PageShellChrome` as a surface.
  Verified: 74 pages byte-safe (control-flow/type-conversion/landing/ai-21 = 0 data-t, 0 undefined);
  reading-objects es fully Spanish; live en->es swap flips chrome+hero+content, no reload,
  buffer+hash preserved. Deferred to T1: Settings/agenda labels, the interpolated describeExpected
  message, progressNoun (per-lesson data). NEXT: item 6 - commit T0.
- **2026-07-30** - /fleet wave 1 (translation/authoring only; committed d8008af). Two disjoint
  agents, shared spine kept serial (main agent): (A) T1 - added 103 shared chrome keys
  (drill.*/agenda.*/concept.*/settings.*/landing.*) to `res/chrome/{en,es}.json` (INERT until the
  engines are wired to read them; existing wired keys 0-diff, reading-objects unaffected) +
  `docs/i18n/t1-landing.md` (47-string landing map). (B) T2 - Spanish drafts for all 28 build
  lessons under `docs/i18n/drafts/*.es.json` (task.N.* schema, mirroring reading-objects; code +
  output literals kept verbatim). Verified: only owned files changed, all JSON valid.
  PENDING (serial): T1 = wire drill-engine/settings/agenda/landing to `t()` + load chrome/lang
  site-wide on every page; T2 = extract each build lesson -> `res/strings` bundle + drop in its es
  draft + `meta.runtime:"kernel"` + regenerate + verify. Owner review of the machine-translated
  Spanish (native ES) also pending.
- **2026-07-30** - T2 first integration: `control-flow` kernel-ized end-to-end (2nd kernel lesson
  after `reading-objects`). Proven per-lesson recipe: (1) `node tools/extract-res.mjs <dir> --lang
  en --write` (default en bundle = task.* only; mechanics data.js; meta.resources). (2) augment the
  default en bundle with `hero.eyebrow`/`hero.title`/`intro.N` VERBATIM from meta (the extractor
  omits them, but a non-default-lang bundle needs hero keys present in default or arity errors -
  hero.* is NOT whitelisted, only intro.\d+ is). (3) write es bundle = Spanish hero+intro + the
  draft's task.* (drafts are TASK-ONLY: hero/intro Spanish must be added per lesson). (4) meta:
  `runtime:"kernel"` + `resources.langs:["en","es"]`. (5) regenerate + validate (0 errors) + verify
  render. VERIFIED: en unchanged (hero/card/chrome English, 0 undefined, 0 es-leak); es fully
  Spanish (hero "Flujo de control", card "Ramifica con if / else", chrome Objetivo/Salida
  esperada/Tu código/Ver solución/Reiniciar/Anterior); key-align 30/30.
- **KNOWN GAP (T1, shared, DRY once):** the hero breadcrumb `<p id="<p>Meta" class="meta">` (e.g.
  "Understand the ideas · Control Flow") and the document `<title>` stay English on es - filled from
  the English course registry, not repainted by `repaintHero`. Confirmed the accepted pilot
  `reading-objects` has the identical gap (parity), so it is a shared page-shell fix (localize
  cfMeta + title in `repaintHero`/kernel setLocale, sourced from the translated title + a chrome
  part label), done ONCE for all kernel lessons - not per lesson. Remaining build lessons: 26.
- **2026-07-30** - T2 build-lesson rollout COMPLETE: batch kernel-ized the remaining 27 build
  lessons (all 29 build lessons now en/es: reading-objects + control-flow + 27). Same recipe as
  control-flow, scripted; drafts were task-only so Spanish hero+intro was authored per lesson (6
  part eyebrows mapped once). Edge cases handled: `reuse-without-regret` keeps both intro lines;
  `the-solid-principles` intro[1] is a `{html,class:"solid-intro"}` object - default en skips
  intro.* to preserve the inline object (verified solid-intro class intact in en), es supplies both
  lines as strings. validate: 0 errors. Verified headless (sample across all 6 parts + the object
  edge): en unchanged (hero English, 0 undefined, 0 es-leak); es full Spanish (hero title + mapped
  eyebrow + Objetivo chrome). Machine-first-pass Spanish; native review pending.
  REMAINING for full site: T1 chrome site-wide wiring (drill/settings/agenda/landing + cfMeta/title
  page-shell fix) and the 42 viz + 4 checkpoint lessons (binders + translations not yet drafted);
  code-lab Quiz labels.
- **2026-07-30** - VOICE QUALITY PASS (owner-driven, COMPLETE for build lessons). Owner (native ES,
  Spain) rejected the machine first pass as unnatural on two axes: (1) literal/calqued Spanish, then
  (2) "AI-voice" - essayistic noun-label colon scaffolds ("La respuesta sincera:", "La solución:").
  Locked a Spain-native voice guide in repo memory `/memories/repo/es-voice.md`: keep ESTABLISHED
  English tech terms (array/string/override/mock/stub/spy/fake/test double/log/feed/mailer/...),
  informal `tú`, Spain idioms (merece la pena, echa mano de, tocar el código, porque sí, revienta),
  guillemets « », and a second AI-voice pass that kills noun-label scaffolds (say it straight / verb-
  first, e.g. "The fix:" -> "Arréglalo así:"). Owner approved on the-solid-principles #4. Then
  hand-re-translated ALL 29 build lessons against the guide (not delegated - owner chose option 1
  for consistency), wave by wave (Parts 1-6), each: key-aligned, `[[concept:]]` markup preserved,
  AI-voice-grep clean, `validate` 0 errors, es render spot-checked. **All 29 build-lesson es bundles
  are now native Spain Spanish.** Commits: cc78f77..7671787 (calibration 8b74355/1cf714f, then per-
  wave). Still machine-authored (one native speaker = owner reviewed the voice, not every string);
  a full native proofread is the remaining QA. The es-voice guide now governs any future ES pass
  (viz/checkpoint/chrome), so those buckets should be authored native-first, not literal-then-fixed.
- **2026-07-30** - Finding (owner-raised): chrome-i18n also involves the vendored code-lab widgets.
  code-lab ALREADY has a labels-injection API (`DEFAULT_LABELS + opts.labels`) on the main widget,
  error panel, MemoryViz chips and die view -> those are course-side config. GAP: the `Quiz` widget
  hardcodes result strings ("Correct."/"Checkpoint passed"/...) and some MemoryViz scene chrome is
  inline -> needs a small pattern-following code-lab submodule change + re-vendor, scheduled T2/T3.
  T0 pilot (build lesson) is UNAFFECTED - only injectable widgets. Recorded in the architecture.
