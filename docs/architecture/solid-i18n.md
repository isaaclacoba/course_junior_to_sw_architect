# SOLID + DRY analysis - the i18n resource system

Scope: `resource/*.js` (resolver, store, manager, preference, settings, the
section adapters, `concept-i18n`, the binders, the two controllers) plus root
`page-shell.js` and the engines. Focus is on violations that cause real
maintenance pain or bug-risk - this is a recurring bug class - not academic ones.

Findings are ranked by impact. Each has a cost/risk note and a recommendation.
The "status" line records what this pass changed.

---

## 1. DRY / SRP - the snapshot/restore pattern had no single home (HIGH)

The "remember a leaf's inline default-language value once; write the resolved
translation when present, else restore the snapshot; never create an absent key"
logic was copied verbatim into **four** places:

- `bind-viz.js`, `bind-checkpoint.js`, `bind-build.js` - each a module-local
  `bindLeaf` over its own `WeakMap`;
- `page-shell.js` `repaintCrumb` - a bespoke `origCrumb` snapshot for the
  breadcrumb (`p.meta`) and `document.title`.

Cost/risk: this is exactly the logic the recent "language switch gets stuck" bug
lived in. Four copies means the fix (and any future edge-case fix) must be made
four times, and the copies can silently drift. A cross-cutting concern (snapshot
+ restore of a default value across a locale swap) with no owner is the single
highest-risk item here.

Recommendation: extract one shared module owning the pattern; call it from all
four sites.

Status: DONE. Extracted to `resource/bind-origin.js` exposing
`window.ResourceOrigin.bind(obj, key, resolved)`. The three binders and
`page-shell.repaintCrumb` now delegate to it. One home, one place to fix.

---

## 2. DRY - the binder helpers `collect` and `applyHero` were triplicated (HIGH)

`collect(R, prefix)` (gather an indexed `prefix0..prefixN` run) and
`applyHero(hero, R)` (bind `intro`/`title`/`eyebrow`) were byte-identical in all
three binders.

Cost/risk: same class of drift as (1). The hero key schema in particular is a
contract; three copies invite one to be updated and the others forgotten.

Recommendation: co-locate them with the snapshot/restore module since they share
its load path and concern (mapping resolved strings onto lesson globals).

Status: DONE. `collect` and `hero` now live on `window.ResourceOrigin` and are
called from all three binders. Build-only `collectItems` stayed local (single
caller, build recap schema).

---

## 3. OCP - adding a voiced surface requires editing multiple binders identically (MEDIUM)

Each new localizable engine needs a sibling `bind-<archetype>.js` plus a matching
guarded branch in **both** controllers' `bind()` and in the surface fan-out. The
shape of each binder (`apply(R, ctx)` -> hero + engine-specific fields) is fixed
and repeated.

Cost/risk: real but bounded - the archetype set is small and stable
(build/viz/checkpoint). The duplication is now mostly the schema mapping itself,
which legitimately differs per engine. The remaining identical parts (hero,
snapshot/restore, collect) are the ones extracted in (1)/(2).

Recommendation: do NOT introduce a plugin registry or a base "binder" abstraction
now - that would be speculative generality for three known callers (KISS). Revisit
only if a fourth archetype with the same hero+leaf shape appears. Left as-is by
design.

---

## 4. SRP - `page-shell.js` mixes hero, concepts, breadcrumb, scaffold and i18n (MEDIUM)

`page-shell.js` renders the hero, builds the "in this lesson" concept agenda and
click-to-define panel, paints the breadcrumb/title, renders the card scaffold, AND
carries the in-place `setLocale` repaint logic for several of those surfaces. It
is one large file with several reasons to change.

Cost/risk: it is the file most likely to be edited mid-write (the repo learnings
already call it out as needing atomic edits), and a change to one surface risks
another. However, the surfaces share DOM and a single injection point, so a split
would add cross-file coordination and load-order surface for modest gain.

Recommendation: do not split now. The concrete win available today was removing
its private breadcrumb snapshot (folded into finding 1). A full split into
`hero` / `concepts` / `scaffold` modules is a larger, separately-scoped change
that needs the generator's per-page `<script>` list updated - deferred.
Status: partial - breadcrumb snapshot de-duplicated only.

---

## 5. SRP/DRY - the two controllers duplicate composition wiring (LOW)

`kernel-controller.js` and `bootstrap.js` both read the same `data-*` attributes,
build the same `store`/`manager`/preferences, mount the same Settings sections,
and run the same first-load `bind`. `kernel-controller` adds live re-localization;
`bootstrap` is the reload-only path.

Cost/risk: low and intentional - they are two deliberately different composition
roots (live-swap vs inject-once). Sharing their wiring would couple them and blur
that distinction. The newly added `ensureOrigin`/`bindOriginSrc` are the only
lines duplicated by this pass, and duplicating ~5 trivial lines is cheaper than a
shared helper module that both must load in the right order.

Recommendation: leave separate. Not worth a shared "controller-common" module.

---

## Why finding 1/2 could be fully extracted without regenerating pages

A generated lesson page lists its own resource `<script>` tags (resolver, store,
..., `bind-<archetype>`) and loads a controller LAST. Adding a new
`resource/*.js` to those tags would mean editing `tools/generate.mjs` and
regenerating all ~76 `content/**/index.html` - currently blocked by unrelated WIP.

The controllers, by contrast, are shared files referenced by the pages but not
themselves generated, so editing them needs no regeneration. Both controllers now
inject `resource/bind-origin.js` (resolved as a sibling of the controller's own
`src`, overridable via `data-bind-origin`) as their first async step - before the
first `bind()`. `page-shell.repaintCrumb` runs later still (at `setLocale`), so
`window.ResourceOrigin` is guaranteed present by then. No page HTML changed.
