---
name: i18n-roundtrip
description: >-
  Find and fix "language switch gets stuck" bugs in voiced lessons of the C#
  course (this repo) - where switching a lesson EN->ES works but switching back
  ES->EN leaves some prose stuck in Spanish. USE FOR: adding a new voiced surface
  (a binder leaf, a page-shell chrome repaint, a widget's setLocale) without
  reintroducing the stuck-language bug; verifying a voiced lesson round-trips
  cleanly; diagnosing a reported "still in Spanish after switching back". DO NOT
  USE FOR: authoring lesson prose or adding a voice (use resource-authoring);
  translating strings (that is the i18n JSON bundles); non-voiced lessons.
---

# i18n round-trip - the "stuck language" bug

## The mental model (root cause)

A voiced lesson's DEFAULT-language (English) prose lives INLINE in the data file
(`meta.js` hero, `data.js`/`*.viz.js` config), NOT in `en.json`. Only the
non-default bundles (`es.json`) carry translations. A surface that binds prose
with an "apply-if-present" idiom - overwrite a leaf only when the bundle has its
key - has a latent bug:

- First switch EN -> ES: the bundle has the key, so the inline English is
  overwritten with Spanish. Fine.
- Switch back ES -> EN: the `en` bundle has NO key (the English was inline), so
  "apply-if-present" does nothing - the leaf stays Spanish. STUCK.

The fix is a snapshot/restore: record a leaf's inline value ONCE, write the
translation when the bundle supplies it, else RESTORE the snapshot. This lives in
`resource/bind-origin.js` (`ResourceOrigin.bind`), shared by the binders
(`bind-viz.js`, `bind-build.js`, `bind-checkpoint.js`) and by `page-shell.js`
`repaintCrumb` (breadcrumb `p.meta` + `document.title`).

This bug class RECURS every time a new voiced surface is added and forgets the
restore branch. The live swap runs through `kernel-controller.relocalize()` ->
each surface's `setLocale()`, so the leak only manifests in a real DOM after a
switch-back - a static render never shows it.

## Detect it - run the tool

```bash
# authoritative browser round-trip (drives the real Settings gear via CDP)
node tools/i18n-roundtrip.mjs <lesson-dir>
node tools/i18n-roundtrip.mjs --all              # every voiced lesson (has es.json)

# fast, dependency-free binder pre-check (no browser; misses chrome leaks)
node tools/i18n-roundtrip.mjs <lesson-dir> --static

# flags: --langs es,fr  --json  --settle <ms>  --verbose  --port <n>
```

The tool serves the repo on an ephemeral port, opens the lesson in the default
language with system `google-chrome`, snapshots every visible element's own-text
(plus `document.title` and `p.meta`), switches to each non-default language and
back through the real gear popover, and reports any text that was shown in the
foreign language and did NOT return to its default value. Exit non-zero on any
leak, so it is a CI gate. It is zero-dependency (built-in CDP/WebSocket client;
no puppeteer, no npm install).

Read the output as: `sel` (a stable selector, or `document.title` / `p.meta`),
`default:` the original text, `leaked:` the foreign text left behind. A clean run
prints `PASS <lesson> round-trip clean`.

Note the detector compares against the strings shown DURING the foreign phase, so
it is immune to two look-alikes that are NOT leaks: a widget that reshuffles its
own English content on re-render (the checkpoint `Quiz` samples/shuffles), and
async English chrome (the build "Run" button warming from "Preparing compiler...").

## Fix it - the pattern

Never bind a leaf with bare "apply-if-present". Route every localizable leaf
through the shared snapshot/restore so switching back restores the inline default:

```js
// in a binder: use the shared helper, do not hand-roll
ResourceOrigin.bind(obj, key, R.get(key)); // writes translation, else restores inline
ResourceOrigin.hero(page.hero, R);         // the shared hero mapping
```

For NON-binder chrome painted at event/render time (a breadcrumb, a title, a run
result), snapshot the inline default ONCE on first paint and restore it when the
resolver has no key - see `page-shell.js` `repaintCrumb` and the i18n learning in
`.github/instructions/learnings.instructions.md` ("Re-localize every dynamically
-painted surface").

## Add a new voiced surface without reintroducing the bug

1. Bind its prose through `ResourceOrigin.bind` (or snapshot/restore inline if it
   is event-painted chrome). Add it to the surfaces fanned out by
   `kernel-controller` if it has its own `setLocale`.
2. Run `node tools/i18n-roundtrip.mjs <lesson-dir>` and confirm PASS.
3. To prove the check is live, momentarily break the restore branch of
   `ResourceOrigin.bind` in a SCRATCH COPY only (never in the repo) and confirm
   the tool now reports the surface's text as leaked; then discard the scratch.

Keep this off the default-language path: English has no bundle, so a correctly
snapshotted surface leaves the inline text untouched on first load and restores
it on switch-back.
