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
- **Hero**: extend `bind-build`/the hero `Localizable` to also cover `title` + `eyebrow`
  (today only `intro` is overridable).
- **Global lang**: the Language control appears on every page (via the Settings popover), and
  every lesson loads the resource runtime. `course_lesson_lang` already persists site-wide.

## Phases

| Phase | Goal | Done |
|---|---|---|
| **T0 - Pilot** | `reading-objects` 100% Spanish end-to-end (hero + chrome-i18n capability + live swap); English byte-identical elsewhere | 0 / 6 |
| T1 - Chrome + landing site-wide | shared frame + `index.html` localizable; global lang control on every page | 0 / 1 |
| T2 - Content rollout | viz/checkpoint binders + extract/translate all 75 lessons (practical -> theory -> AI) | 0 / 1 |
| T3 - Concepts | ~200 concept terms/defs localizable | 0 / 1 |

## T0 - action items (the pilot)

Goal: at `lang=es`, `reading-objects` is a fully Spanish page (hero + content + chrome); at
`lang=en` it is byte-identical to today; the other 74 pages are byte-identical; a live lang
swap flips hero + content + chrome with no reload.

- [ ] **1. Tracking scaffold** (this doc + todo + work-log). Verify: doc committed with T0 list.
- [ ] **2. Hero i18n.** Add `hero.title` / `hero.eyebrow` (+ `intro.1`) keys to reading-objects
      `en`/`es` bundles; extend `bind-build` to apply hero title/eyebrow when present; extend the
      hero `Localizable` (`repaintHeroIntro` -> repaint title/eyebrow too). Verify: es shows Spanish
      hero; en byte-identical; other pages byte-identical.
- [ ] **3. Chrome-i18n capability.** `LessonCommon.t(key, english)` reading `window.ChromeText`
      (lang catalog) with English fallback; a chrome `Localizable` surface; the kernel controller
      loads the catalog + adds it to `surfaces`. Verify: `t` returns fallback when no catalog
      (74 pages byte-identical); node --check + a unit test.
- [ ] **4. Wire reading-objects chrome through `t()`.** page-shell card headings + build-engine
      buttons/progress/result/XP + Settings/agenda labels read via `t()`; author `es` chrome
      catalog. Verify: control-flow (non-i18n) dump-dom diff 0.
- [ ] **5. Acceptance.** es = fully Spanish reading-objects (hero+content+chrome); en byte-identical;
      control-flow + one viz + the landing byte-identical; live en<->es swap flips everything, no
      reload, editor buffer preserved; 0 undefined.
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
