---
name: resource-authoring
description: >-
  Make a lesson voice-driven in the C# course (this repo) - and understand the
  resource engine that does it. USE FOR: voicing a lesson (extracting its
  teaching prose out of data.js into per-voice res/strings bundles so a learner
  can switch reading voice); adding a new voice to an already-voiced lesson;
  understanding the resolver/store/manager/settings engine and the course
  binder. DO NOT USE FOR: writing new lesson pedagogy or exercises (use
  lesson-authoring); changing the engines, runner, or page-shell (that is engine
  work, see copilot-instructions); theming or dark mode (use theme-authoring);
  auditing concept vocabulary (use concept-vocabulary-audit).
---

# Voicing a lesson

A voiced lesson keeps its mechanics (code, expected output, grading probes) in
`data.js` and moves its teaching prose into per-voice JSON bundles. At load a
learner-chosen "reading voice" is resolved onto the lesson globals before the
engine renders - the default voice renders byte-identical to the un-voiced page.

You are feeding data to an existing engine. You are NOT changing the engine,
runner, or page-shell. The generated `index.html` is never hand-edited.

## Read first

1. `.github/copilot-instructions.md` - architecture, load orders, generated flow.
2. `AGENTS.md` (root) - the prose voice rules each bundle must honour.
3. The pilot lesson
   `content/practical/01-understand-the-ideas/05-reading-objects/` - `meta.js`
   (the `resources` field), `data.js` (mechanics only), and
   `res/strings/{default,child,academic}/en.json` (the key schema, three voices).

## Architecture

Two halves. The generic engine (in `resource/`) knows nothing about the course's
data shape and could be lifted into a shared library:

- `resolver.js` - pure, DOM-free fallback POLICY. `chain(selection)` is the
  ordered, de-duplicated bundle list `(voice,lang) -> (default,lang) ->
  (voice,defaultLang) -> (default,defaultLang)`. `get(key)` walks that order and
  returns `undefined` for an unknown key.
- `store.js` - swappable async loader. Fetches `<base>/<voice>/<lang>.json`,
  caches by `voice/lang`, resolves a missing bundle to `{}` (so the chain falls
  back rather than throws). `fetch` is injectable for tests.
- `manager.js` - facade (DIP). `init()` loads exactly the bundles the current
  selection can reach and builds a resolver; `get`/`has` read a resolved string.
- `settings.js` - one floating "Settings" popover built from declarative
  sections (each section supplies data - title, `options`, `onSelect`; the
  popover owns all markup).
- `preference.js` - a persisted single choice from a fixed set. `set()` writes
  to `localStorage` and reloads the page; the engines re-read on the next load,
  so there is no live re-render path.

The course adapter (also in `resource/`) maps the generic engine to this course:

- `bind-build.js` - the key-schema mapper for BUILD lessons. Knows the schema
  (`intro.N`, `task.N.title|concept|context|goal.i`, the recap's
  `summaryIntro|summaryItems.i.title|text|summaryClose`) and writes resolved
  strings onto `window.PAGE` (hero intro) and `window.LESSON_CONFIG` (task prose).
- `theme-section.js` / `voice-section.js` - section data for the popover (theme
  list from `theme-switch.js`; reading-voice list + human labels).
- `bootstrap.js` - the composition root. Reads config from its own `data-*`
  attributes, wires store + manager + preference + sections, loads the selected
  voice, binds via `bind-build`, then injects the UNCHANGED `page-shell.js` and
  engine last.

Only BUILD lessons have a binder today. A drill/viz/checkpoint lesson would each
need a sibling binder with its own key schema - the generic
resolver/store/manager/settings/preference stay unchanged.

## Recipe - voice a build lesson

1. **`meta.js`** - add the opt-in field:
   ```js
   resources: { base: "res/strings", lang: "en", voices: ["default", "child", "academic"] },
   ```
2. **`res/strings/default/en.json`** - hold the lesson's CURRENT prose VERBATIM,
   so the default render stays byte-identical. Then author `child/en.json` and
   `academic/en.json` as re-voiced siblings (same keys, different wording),
   following `AGENTS.md`.
3. **`data.js`** - strip the voiced fields (title, concept, context, goal,
   summary prose) from each task. Keep the mechanics inline: `example`,
   `expected`, `requireSource`, `verify`, `starter`, `solution`, and the recap
   card's `summary: true` flag.
4. **`node tools/generate.mjs`** - regenerates the lesson `index.html`. Because
   `meta.resources` is set, `applyResourceTail` swaps the static `page-shell +
   engine` tail for the resource modules + `bootstrap.js`. NEVER hand-edit
   `index.html`.
5. **Verify** (recipe below).

## Key schema (1-based task index)

| Key | Voiced? | Where |
| --- | --- | --- |
| `intro.N` (hero intro lines) | voiced - in NON-default bundles only | default keeps its inline `meta.intro` |
| `task.N.title` | voiced | bundle |
| `task.N.concept` | voiced | bundle |
| `task.N.context` | voiced | bundle |
| `task.N.goal.0`, `.goal.1`, ... | voiced (indexed run) | bundle |
| `task.N.summaryIntro` (recap card) | voiced | bundle |
| `task.N.summaryItems.0.title` / `.0.text`, ... | voiced (indexed run) | bundle |
| `task.N.summaryClose` | voiced | bundle |
| `example` | NOT voiced (C# code) | `data.js` |
| `expected`, `verify`, `requireSource`, `starter`, `solution` | NOT voiced (mechanics) | `data.js` |

The recap card is the task carrying `summary: true` in `data.js`; its prose keys
live under that task's index like any other.

## Rules and gotchas

- **Default stays byte-identical.** `bind-build` applies the default bundle back
  onto `LESSON_CONFIG`, so `default/en.json` must reproduce the original prose
  exactly. The hero intro is apply-if-present: the default keeps its inline
  `meta.intro`; only a non-default voice supplies `intro.N`.
- **Concept markers live in the bundle prose.** `[[concept:id|label]]` sits
  inside the JSON strings now; `validate.mjs`'s `loadProseMentions` scans
  `res/strings/**/*.json` for unknown ids, so a typo'd id fails validation.
- **A missing key never renders "undefined".** It falls back through the chain
  and `bind-build` coerces the result to `""`.
- **Voice is a course-wide preference.** `preference.js` persists it in
  `localStorage["course_lesson_voice"]`; switching reloads the page. The Settings
  popover auto-lists the voices from `meta.resources.voices` (via
  `voice-section.js`), so you add a voice by adding a bundle + the id to `voices`.

## Verify

1. `node --check` every JS you touched (`meta.js`, `data.js`).
2. `node tools/generate.mjs` then `node tools/validate.mjs` - expect 0 errors.
3. `VALIDATE_DRIFT=1 node tools/validate.mjs` - expect 0 drift (committed
   generated output matches a fresh build).
4. Serve and headless-render per voice:
   ```bash
   python3 -m http.server 8091
   google-chrome --headless --virtual-time-budget=20000 --dump-dom \
     http://localhost:8091/content/.../05-reading-objects/index.html > /tmp/v.html
   ```
   Confirm 0 `undefined`, the Settings gear is present, and the voiced
   title/intro render. Seed a non-default voice before rendering by setting
   `localStorage["course_lesson_voice"]` (e.g. via a tiny page script or a
   puppeteer step) and re-render to prove the child/academic prose appears.
5. Remove any temp artefacts before finishing.

## Adding a language (e.g. Spanish)

The resolver chain already carries `lang`. Per lesson, add
`res/strings/<voice>/es.json` alongside the `en.json` bundles, and add a language
preference + a Settings section (a sibling of `voice-section.js`) so a learner
can pick it. Code identifiers and `expected` outputs stay language-neutral - only
the prose translates.
