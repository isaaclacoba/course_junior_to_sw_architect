# Lesson Platform Kernel - design-of-record + action plan

Status: **APPROVED (lean-conformant), Phase 1 NOT started.** Owner: Isaac + agent.
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

```js
// The renderer contract every widget/engine honors.
WidgetController = {
  render(),                       // initial paint (unchanged behavior)
  setLocale(resources),           // PROSE-ONLY repaint; MUST preserve editor
                                  //   buffer + card index + run/result state
  getState() -> json,             // serializable snapshot (may be null)
  setState(json),                 // restore
  dispose(),                      // detach; contract-only until a router/panel needs it
};
```

Rules (permanent):

- **Single binder.** A widget's `setLocale` REUSES `ResourceBindBuild.apply(manager,
  { page, config })` then repaints. `bind-build.js` stays the one home of the build
  key-schema - it is NOT duplicated into a widget (this preserves the SRP refactor
  already landed). `bind-build` does NOT retire on kernel lessons; it is reused.
- **Hero intro ownership.** The voiced hero intro stays `page-shell` chrome,
  repainted via a new `PageShell.repaintHeroIntro()` driven by the controller on
  swap. The hero does NOT become a widget in Phase 1.
- **Swap fan-out.** The controller holds a plain array of localizable surfaces
  `[page-shell hero, widget]` and calls each on a locale change. Promotes to the bus
  in Phase 2.
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
| 4 | Hero intro on swap | `page-shell` chrome via `repaintHeroIntro()`, controller-driven. |
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
| 1 - Kernel-lite + instant locale swap on reading-objects | contracts fixed; instant voice/lang | 0 / 9 |
| 2 - Gamification un-smear (+ the bus) | single writer, `progress:*` | 0 / 1 |
| 3 - viz/checkpoint as widgets (+ registry, chrome widgets) | 2nd/3rd widget | 0 / 1 |
| 4 - Media widgets | video/image + descriptor resources | 0 / 1 |
| 5 - Level-0 debugger (drop-in proof) | zero core edits | 0 / 1 |
| 6 - Domain #2 (finance) | same kernel, new content tree | 0 / 1 |

## Phase 1 - action items (lean-conformant)

Goal: `reading-objects` runs with **instant** voice/lang switching (no reload),
editor buffer + card index + run state preserved, default render byte-identical.
No bus, no registry, no host, no LAYOUT, no context object.

- [ ] **1. Extract the BuildEngine factory.** Split `build-engine.js` into a
      side-effect-free `window.BuildEngine = { create(root, cfg, ctx) -> controller }`
      plus a 3-line footer `if (window.BUILD_CONFIG) BuildEngine.create(...).render();`.
      Kernel pages do NOT load the footer; legacy pages do and behave identically.
      No global flag. Verify: `node --check`; a legacy build page renders byte-identical.
- [ ] **2. `controller.setLocale(resources)`.** Re-applies `ResourceBindBuild.apply(
      manager, { page: window.PAGE, config: cfg })`, then repaints PROSE ONLY
      (title/concept/context/goal/summary), never touching Monaco, `idx`, output, or
      result. Verify: unit test "repaint preserves buffer + idx + run".
- [ ] **3. `PageShell.repaintHeroIntro()`.** Add to `page-shell.js`, guarded so the
      first default render stays byte-identical. Verify: drift on non-kernel pages 0.
- [ ] **4. `preference` silent path.** Add `create({ reload:false })` or `setSilent`
      so a kernel lesson persists without reloading. Theme/legacy keep reload. Verify: node --check.
- [ ] **5. `lesson/controller.js` (or extend bootstrap).** Compose prefs/store/manager;
      `init()` -> `bind-build.apply` -> page-shell -> hold the BuildEngine controller.
      On settings select: silent-set pref -> generation-guarded `await manager.init()`
      -> `bind-build.apply` -> `repaintHeroIntro()` -> `controller.setLocale()`.
- [ ] **6. Generator `runtime:"kernel"` tail.** `tools/generate.mjs` emits the kernel
      script tail (factory + controller, no footer, no bootstrap) when
      `meta.runtime === "kernel"`; supersedes the resource tail. Set
      `reading-objects/meta.js` `runtime:"kernel"`. Verify: `node tools/validate.mjs` 0 err.
- [ ] **7. Unit tests.** bind-build mapping + "repaint preserves state" (no kernel deps).
- [ ] **8. Acceptance gates (all must pass).** `VALIDATE_DRIFT=1 node tools/validate.mjs`
      shows ONLY `reading-objects/index.html` changed; headless post-Monaco `<main>`
      outerHTML matches the pre-kernel render; deep-link `#3` lands on card 3; a voice
      flip changes prose WITH NO reload and the Monaco buffer + card index survive;
      0 `undefined`.
- [ ] **9. Commit Phase 1** (local, not pushed).

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
