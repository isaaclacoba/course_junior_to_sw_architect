# Lesson Platform Kernel - design-of-record + action plan

Status: **Phase 1 COMPLETE (local commit; not pushed).** Owner: Isaac + agent.
Last updated: 2026-07-30.

This is the design-of-record for re-architecting the lesson runtime into a
domain-agnostic platform. It is the successor to the resource/i18n layer (see
`docs/concept-index-plan.md`). Nothing here is coded yet; Phase 1 is the first
increment.

Tracking convention (same as the index plan): each action item is a checkbox -
`- [ ]` todo, `- [~]` in progress, `- [x]` done AND its Verify gate passed. Keep
the Progress table and the Progress log in sync. Append a dated Progress-log line
after each step. This doc + the in-session todo list + `docs/work-log.md` + the
per-step Verify gates are the grounding: no step is "done" until its gate is green.

## Why

Switching reading voice/language today calls `preference.set()` -> `location.reload()`.
The reload re-boots Monaco + the Roslyn/WASM host (2-3s); the string swap itself is
instant. Worse, `build-engine.js` paints prose *inside* the `loadMonaco().then`
chain, so the new strings only appear after Monaco reloads. The fix is to swap in
place - but done the CLEAN way, because the real goal is a **domain-agnostic
learning platform** (software eng first, then finance, medicine): a lesson is a
fixed LAYOUT (a template) that composes WIDGETS with TEXT, plus gamification, rich
media, and interactive widgets (a level-0 debugger is already in flight).

"Clean from the start" = the CONTRACTS and SEAMS are fixed and final now, so
nothing built is throwaway. It does NOT mean instantiating a full kernel for one
widget - that ceremony is deferred behind a promotion map.

## The five pillars (target)

1. **Composition** - layout + named slots + a widget registry. The generator +
   `templates/lesson.html.tmpl` + the 4 archetypes are this in embryo.
2. **Widget contract / lifecycle** - the load-bearing pillar. A uniform
   `create(host, ctx) -> instance` with `setLocale / getState / setState / dispose`.
   The level-0 debugger is its acceptance test (drop-in: registry entry + factory +
   `res/strings`, zero core edits).
3. **Resource / asset model** - `resolver/store/manager` already are this; values
   generalize from strings to media descriptors later.
4. **Eventing (bus)** - the nervous system, and the cheapest pillar. Deferred until
   a real second subscriber exists (Phase 2 gamification).
5. **State / progress / gamification** - un-smear XP into one writer fed by
   `progress:*` events.

## Fixed contracts (decided now - permanent)

These are frozen so that deferring the kernel modules is mechanical later, not a
redesign.

Elements come in two kinds. The engine's cross-cutting concerns depend on NARROW
capability interfaces (ISP), never on a fat "widget" base type:

- **Content element** - text (+ maybe media), NO logic: the hero, a callout, a
  captioned image. Implements `Localizable` only.
- **Widget** - logic + text (+ media) + state: the build exercise, quiz, viz, the
  level-0 debugger. Implements `Localizable` plus the capabilities it actually needs.

```js
// The ONE contract the locale-swap fan-out depends on. Content AND widgets honor it.
Localizable = { setLocale() };   // repaint my text; the binder already refreshed my config

// A widget is an element that ALSO carries some of these capabilities (ISP - each
// is separable; nothing stubs a method it does not have):
WidgetController = {
  render(),            // initial paint (unchanged behavior)              [Renderable]
  setLocale(),         // PROSE-ONLY repaint; MUST preserve editor buffer
                       //   + card index + run/result state               [Localizable]
  getState() -> json,  // serializable snapshot (may be null)             [Stateful]
  setState(json),      // restore                                         [Stateful]
  dispose(),           // detach; contract-only until a router/panel       [Disposable]
};
```

Rules (permanent):

- **Capability, not inheritance.** The swap fan-out, gamification, and persistence
  each depend ONLY on the narrow role they use (`Localizable`, later an event emitter,
  later `Stateful`) - never on `WidgetController` as a whole (ISP + DIP).
- **Single binder.** The CONTROLLER calls `ResourceBindBuild.apply(manager,
  { page, config })` exactly once per swap to refresh the shared config
  (`PAGE.hero.intro` + `BUILD_CONFIG.tasks`) in place; each `Localizable.setLocale()`
  then repaints from it. `bind-build.js` stays the one home of the build key-schema -
  NOT duplicated into a widget, NOT called per-widget. Reused on kernel lessons, not retired.
- **Hero = `Localizable` content element.** The voiced hero intro is a `Localizable`
  content element (text, no logic); its `setLocale()` repaints the intro paragraph in
  place. It is NOT a widget and does NOT stub `getState/setState/dispose`. The repaint
  helper lives in `page-shell` (the hero is page-shell's DOM).
- **Swap fan-out.** The controller holds a `Localizable[]` (`[hero, buildWidget]`) and
  calls `setLocale()` on each on a locale change - homogeneous by the narrow interface.
  Promotes to the bus in Phase 2.
- **Silent preference.** `preference` gains a no-reload path used only by kernel
  lessons; theme + legacy resource lessons keep the reload path unchanged.
- **Kernel gate.** `meta.runtime: "kernel"` opt-in (mirrors `meta.resources`). It
  SUPERSEDES the resource tail - the generator must never emit both.
- **No wrapper.** The widget mounts into the EXISTING card scaffold ids (no new
  wrapper `<div>`), or it breaks `getElementById(prefix + suffix)` and shifts the DOM
  path (byte drift).
- **Last-write-wins.** The locale swap re-resolves under a generation token; a
  stale bundle can never paint over a newer selection.

## Decisions (owner-confirmed)

| # | Decision | Choice |
|---|---|---|
| 1 | Scope of Phase 1 | **Lean-conformant** - contracts fixed, kernel modules deferred behind the promotion map. |
| 2 | Kernel adoption gate | Per-lesson `meta.runtime:"kernel"` opt-in. |
| 3 | bind-build fate on kernel lessons | **Reused** (single binder), not duplicated, not retired. |
| 4 | Hero intro on swap | Hero is a `Localizable` **content element** (text, no logic); `setLocale()` repaints it in place - no fat widget interface, no stubbed lifecycle. |
| 5 | Gamification keys | Keep legacy `localStorage` keys (`course_global_xp`, `*_awarded`, `course_concept_progress`) for continuity. |
| 6 | code-lab widgets | Course-side thin adapters, no submodule change. |
| 7 | Chrome (hero/agenda) -> widgets | Deferred to Phase 3. |

## Promotion map (deferred module -> the trigger that builds it)

- `kernel/bus.js` -> Phase 2 (gamification = the real 2nd subscriber).
- `kernel/registry.js` + `CourseWidgets` -> Phase 3 (viz/checkpoint = the real 2nd entry).
- `kernel/host.js` + `kernel/context.js` + `window.LAYOUT`/`$ref` -> first lesson with >= 2 slots.
- `canLiveLocalize` flag + `every()`/reload fallback -> first non-localizable widget
  (e.g. a viz that bakes text into an SVG at create-time).
- `dispose`-on-nav wiring -> only if an SPA router or an in-page panel appears (nav
  is a full document load today, so nothing fires it).

## YAGNI boundaries + framework threshold

Do NOT build yet: a data-driven multi-template engine; chrome-as-widgets; media
descriptors; sibling-to-sibling messaging (ever); a gamification rules DSL; a
`getState/setState` persistence layer; an async bus. **No framework on the page
skeleton or in the kernel - ever.**

Framework threshold (a micro-runtime - Preact+htm / lit / Alpine - INSIDE one
widget only): when a single widget's view needs a keyed list/tree diff, OR more
than ~3 independent reactive fields, OR >~150 lines of hand-written imperative
DOM-sync. Expected first trigger: the level-0 debugger (Phase 5).

## Progress

| Phase | Goal | Done |
|---|---|---|
| Design | Rubber-duck -> lead design -> red-team -> approved | 1 / 1 |
| 1 - Kernel-lite + instant locale swap on reading-objects | contracts fixed; instant voice/lang | 9 / 9 |
| 2 - Gamification un-smear (+ the bus) | single writer, `progress:*` | 0 / 1 |
| 3 - viz/checkpoint as widgets (+ registry, chrome widgets) | 2nd/3rd widget | 0 / 1 |
| 4 - Media widgets | video/image + descriptor resources | 0 / 1 |
| 5 - Level-0 debugger (drop-in proof) | zero core edits | 0 / 1 |
| 6 - Domain #2 (finance) | same kernel, new content tree | 0 / 1 |

## Phase 1 - action items (lean-conformant)

Goal: `reading-objects` runs with **instant** voice/lang switching (no reload),
editor buffer + card index + run state preserved, default render byte-identical.
No bus, no registry, no host, no LAYOUT, no context object.

- [x] **1. Extract the BuildEngine factory.** `build-engine.js` is now a
      side-effect-free `window.BuildEngine = { create(cfg, opts) -> controller }`
      (controller exposes `boot()` + `render()`; `setLocale` lands in item 2). A footer
      at the file's end self-boots (`create(BUILD_CONFIG).boot()`) for every page that
      includes the file directly, UNLESS its `<script>` tag carries `data-manual` - the
      declarative, per-tag opt-out a kernel page uses (no global flag; the ~60
      plain-`<script>` build pages are untouched, so zero drift). DONE: `node --check`
      OK; control-flow renders byte-for-byte identical (dump-dom diff = 0, 150251 bytes).
- [x] **2. `buildWidget.setLocale()`.** Repaints PROSE ONLY from the already-refreshed
      `cfg` (title/concept/context/goal/summary) via reused `paintGoal`/`paintSummaryProse`
      helpers; never touches Monaco, `idx`, output, or result; does NOT call `bind-build`.
      DONE: `node --check` OK; control-flow render still byte-identical (diff 0) after the
      helper extraction; `setLocale` exposed on the controller. Formal "preserves
      buffer + idx + run" unit test lands in item 7; end-to-end swap proof in item 8.
- [x] **3. Hero as a `Localizable` content element.** `page-shell.js` exposes
      `window.PageShellHero = { setLocale: repaintHeroIntro }` - a content element that
      repaints ONLY the hero intro paragraphs in place from `window.PAGE.hero`, preserving
      the `#courseXpLabel` node (so the engine's cached ref stays valid), links and agenda.
      `heroHTML` now shares `heroIntroHTML` with it (DRY); the default render path is
      unchanged. DONE: `node --check` OK; control-flow render byte-identical (diff 0). No
      stubbed lifecycle. Functional swap proof in item 7 (unit) + item 8 (end-to-end).
- [x] **4. `preference` silent path.** `create({ onChange })`: when a handler is passed
      (kernel lessons), `set()` updates the in-memory value, persists, and calls `onChange(v)`
      instead of reloading; without it (theme/legacy) the reload path is unchanged. DONE:
      `node --check` OK; vm harness proves default=reload, onChange=silent (no reload, get()
      updated), and the same-value/invalid guards fire neither.
- [x] **5. `resource/kernel-controller.js`** (kernel composition root; sibling of
      `bootstrap.js`, chosen over the doc's `lesson/controller.js` to keep the resource
      layer cohesive). Composes prefs/store/manager + Settings; first load: `manager.init`
      -> `bind` (once) -> inject page-shell -> mount Settings -> inject engine with
      `data-manual` -> `BuildEngine.create(cfg).boot()`; holds `surfaces = [PageShellHero,
      widget]`. Voice/lang prefs get `onChange: relocalize`; `relocalize()` = refresh the
      Settings highlight + gen-guarded `manager.init` -> `bind` once -> fan `setLocale()`
      over `surfaces`. DONE: `node --check` OK; `data-manual` opt-out empirically confirmed
      (dynamic-inject `currentScript` = MANUAL). End-to-end swap proof in item 8.
- [x] **6. Generator `runtime:"kernel"` tail.** `tools/generate.mjs` `applyResourceTail`
      now takes the controller module; `meta.runtime === "kernel"` selects
      `kernel-controller.js` over `bootstrap.js` (the kernel tail = the resource tail with
      that one swap; the engine is injected by the controller, not statically). Set
      `reading-objects/meta.js` `runtime:"kernel"`. DONE: regen OK; `validate` 0 errors;
      reading-objects/index.html now loads `kernel-controller.js` with intact `data-*`; only
      that generated page changed.
- [x] **7. Unit tests.** `test/bind-build.test.js` (6) locks the key schema (task prose,
      coercion-to-`""`, summary items, hero-intro-if-present, no-op guards);
      `test/build-engine.test.js` (4) asserts the factory is exposed, `setLocale` repaints
      the current card's prose and does NOT call `editor.setValue` (buffer + idx preserved),
      and the footer does not self-boot without `BUILD_CONFIG`. DONE: `node --test test/`
      = 30/30 pass.
- [x] **8. Acceptance gates (all pass).** (1) only `reading-objects/index.html` changed
      among generated files (git status; regen clean). (2) kernel `<main>` byte-identical
      to the pre-kernel bootstrap render (30755 B). (3) deep-link `#3` -> card 3 ("A method
      that does one thing", "Step 3 / 6"). (4) LIVE SWAP en->es proven in real Chrome:
      `{reloadCheck:"ALIVE", bufferPreserved:true, titleBefore:"Two objects talk",
      titleAfter:"Dos objetos se comunican", proseChanged:true, hashPreserved:true}` - no
      reload, Monaco buffer + card index survive, prose re-localized. (5) 0 `undefined`.
- [x] **9. Commit Phase 1** (local, not pushed).

## Grounding protocol (so we don't lose the thread mid-run)

1. This doc = the design + phased plan; flip checkboxes + append a Progress-log line per step.
2. The in-session todo list mirrors the Phase-1 items (one in-progress at a time).
3. `/memories/session/*` carries the running state across context compaction.
4. Every item has an objective Verify gate; a step is not "done" until its gate is green.
5. `docs/work-log.md` gets a start + end line per working session.
6. Commit at the end of each phase (local) so progress is durable in git.

## Progress log

- **2026-07-30** - Design phase done (NOT coded). Rubber-duck architect -> lead
  platform-architect design-of-record -> independent red-team. Red-team verdict:
  "ship the contracts, not the module count"; the 6-file kernel is Phase-2+
  architecture for a one-widget milestone, so build the minimal conformant slice and
  defer the modules behind the promotion map (no throwaway because contracts are
  pinned). Two red-team must-fixes folded into the design: (a) the build widget's
  `setLocale` REUSES `bind-build` (single binder) instead of copying the schema;
  (b) the hero intro is repainted by `page-shell` via `repaintHeroIntro()`, not left
  stale. Owner approved lean-conformant + `meta.runtime:"kernel"` opt-in. Plan
  documented here + incorporated into `docs/concept-index-plan.md`. NEXT: Phase 1.
- **2026-07-30** - Contract refinement before coding (owner rubber-duck): the fat
  `WidgetController` was an ISP smell - the hero has no logic and would stub three
  no-op methods. Split into narrow capabilities; the locale-swap fan-out now depends
  ONLY on `Localizable = { setLocale() }`. Hero reclassified as a `Localizable` CONTENT
  element (not a widget); `bind-build` is called ONCE per swap by the controller, then
  each element repaints from the refreshed config. Updated Fixed contracts, Decision 4,
  and Phase-1 items 2/3/5. Still lean-conformant, and less code (no stubbed methods, no
  special-case function). NEXT: item 1 - extract the BuildEngine factory.
- **2026-07-30** - Phase 1 item 1 DONE (build-engine factory). `build-engine.js`
  wrapped into `window.BuildEngine.create(cfg, opts) -> { boot, render }` + an in-file
  self-boot footer guarded by a `data-manual` `<script>` attribute (read via
  `document.currentScript`). Chose in-file + per-tag opt-out over a separate footer file
  because ~60 generated pages load `build-engine.js` by a plain `<script>` tag - a
  separate file or template change would drift all 60 and fail the "only
  reading-objects/index.html changes" gate. Verify GREEN: `node --check` OK; control-flow
  dump-dom byte-identical (diff 0, 150251 B) between the original and factory engine.
  NEXT: item 2 - `buildWidget.setLocale()`.
- **2026-07-30** - Item 2 DONE. Added `buildWidget.setLocale()` (prose-only repaint of the
  current card from `cfg`) and extracted `paintGoal`/`paintSummaryProse` so `render()` and
  `setLocale()` share the painting (DRY/SRP). `setLocale` never calls `editor.setValue` /
  `bind-build` / touches `idx`, so the buffer + card index + run state survive a swap by
  construction. Verify GREEN: `node --check` OK; control-flow dump-dom still byte-identical
  (diff 0) after the extraction, proving `render()` output unchanged. NEXT: item 3 - hero as
  a `Localizable` content element.
- **2026-07-30** - Item 3 DONE. Hero is now a `Localizable` CONTENT element: `page-shell.js`
  exposes `window.PageShellHero = { setLocale: repaintHeroIntro }`, which surgically rebuilds
  only the hero's intro `<p>`s in place from `window.PAGE.hero`, leaving eyebrow / title /
  `#courseXpLabel` / links / agenda untouched (so the engine's cached XP-label ref survives).
  `heroHTML` now shares `heroIntroHTML` (DRY). Default render path untouched. Verify GREEN:
  `node --check` OK; control-flow dump-dom byte-identical (diff 0, 150251 B). NEXT: item 4 -
  `preference` silent (no-reload) path.
- **2026-07-30** - Item 4 DONE. `preference.js` gained an optional `onChange` hook: `set()`
  now updates `current` + persists, then calls `onChange(v)` if provided (kernel silent path)
  else reloads (theme/legacy unchanged). Verify GREEN: `node --check` OK; vm harness 3/3
  (default reload; `onChange` silent + `get()` live; no-op guards). NEXT: item 5 -
  `lesson/controller.js` (compose + `Localizable[]` fan-out).
- **2026-07-30** - Item 5 DONE. Wrote `resource/kernel-controller.js` (path chosen over the
  doc's `lesson/controller.js` to sit beside `bootstrap.js`). It is `bootstrap.js` + live
  swap: prefs carry `onChange: relocalize`; first load binds, injects page-shell, mounts
  Settings, injects the engine with `data-manual` and boots it via `BuildEngine.create().boot()`,
  holding `surfaces = [PageShellHero, widget]`. `relocalize()` refreshes the Settings highlight,
  then under a generation token re-resolves (`manager.init`), binds once, and fans `setLocale()`
  over the surfaces (last write wins). Verify: `node --check` OK; `data-manual` dynamic-inject
  opt-out empirically = MANUAL in real Chrome. Full browser swap proof deferred to item 8 (needs
  the generated kernel page from item 6). NEXT: item 6 - `generate.mjs` `runtime:"kernel"` tail.
- **2026-07-30** - Item 6 DONE. `generate.mjs` `applyResourceTail` gained a `controllerModule`
  param; `runtime:"kernel"` picks `resource/kernel-controller.js` over `bootstrap.js` (kernel
  tail = resource tail minus the one filename; the engine is still injected by the controller).
  Set reading-objects `meta.runtime:"kernel"`, regenerated. Verify GREEN: `validate` 0 err (87
  pre-existing orphan warns); reading-objects/index.html loads `kernel-controller.js` with
  `data-*` intact; only that generated page changed (clean drift). NEXT: item 7 unit tests +
  item 8 browser acceptance (live swap).
- **2026-07-30** - Item 8 DONE (acceptance gates all GREEN). (1) Only reading-objects/index.html
  changed among generated files (regen clean). (2) kernel `<main>` byte-identical to the
  pre-kernel bootstrap render (30755 B). (3) deep-link `#3` -> card 3. (4) LIVE SWAP en->es in
  real Chrome: reloadCheck ALIVE (no reload), bufferPreserved true (Monaco buffer survived),
  prose "Two objects talk" -> "Dos objetos se comunican", hashPreserved true (card index
  survived). (5) 0 undefined. Driven by an in-page harness (no puppeteer dependency; deleted
  after). NEXT: item 7 unit tests, then item 9 commit.
- **2026-07-30** - Item 7 DONE. Added `test/bind-build.test.js` (6) + `test/build-engine.test.js`
  (4). bind-build tests lock the key schema; build-engine tests prove `setLocale` repaints prose
  and does NOT call `editor.setValue` (buffer/idx preserved) - the unit-level backup of the e2e
  swap proof. Fixed cross-realm `deepEqual` via JSON-normalize; the sandbox window needed
  `addEventListener`. `node --test test/` = 30/30. NEXT: item 9 - commit Phase 1 (local).
- **2026-07-30** - PHASE 1 COMPLETE. All 9 items done, every Verify gate green: 30/30 unit
  tests; byte-identical default render (control-flow diff 0; kernel `<main>` == pre-kernel
  30755 B); live en->es swap with no reload and the Monaco buffer + card index preserved.
  reading-objects is the first kernel lesson (`meta.runtime:"kernel"`); everything else
  unchanged. Committed locally (not pushed). Contracts pinned for Phase 2 (bus/gamification)
  per the promotion map.
