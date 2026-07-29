---
description: Hard-won workflow learnings for this repo - small, general rules that save future sessions time.
applyTo: '**'
---

# Learnings

Durable rules discovered the hard way. Keep each to 1-4 sentences. If a learning
grows into a procedure, promote it to a skill and leave a pointer here.

## Editing

- **Edit large shared files atomically via bash, not the `edit`/`create` tools.**
  On big files that take several seconds to write - `index.html`,
  `page-shell.js` - the `edit`/`create` tools can be interrupted mid-write when a
  new user message arrives, leaving a half-written file and a stuck-looking
  agent. For those, prefer one atomic `python3` heredoc that string-replaces with
  a uniqueness guard (`assert s.count(old) == 1`), or a `cat > file <<'EOF'`
  full-file write with the delimiter quoted so the shell does not expand the body.
  Small, quick files are fine with the normal tools.

## Course structure

- **Card counts and the next-lesson button are data-driven - do not hand-maintain
  them.** `index.html`'s per-track count reads the `.c-card` elements, and
  `page-shell.js` derives `awardedKey`/`nextHref` from the filename plus the
  `PRACTICAL`/`THEORY` arrays. When you add a lesson you only add its card and its
  filename to the right `page-shell.js` array (in reading order); never bump a
  count by hand, and never set `awardedKey`/`nextHref` in a lesson data file.
- **Scaffold a new generated lesson only after clearing any flat registry line for
  that id.** `new-lesson.mjs --new` picks the `NN-` index from the count of
  same-part `course-registry.js` rows, so a leftover flat line yields the wrong
  number plus a duplicate-id row; and `--from --move` throws in `detectArchetype`
  for a bespoke page that loads no standard engine. To rebuild a flat lesson the
  standard way, delete its registry line (and the flat files) first, then `--new`.

## Theming

- **Theming and dark mode is a skill - see `theme-authoring`.** A theme is one
  `[data-theme="<id>"]` block in `styles.css` plus one entry in
  `theme-registry.js`; keep every rule `[data-theme]`-scoped so the default stays
  byte-for-byte unchanged. The real work is re-skinning the vendored `code-lab`
  widgets - the `Quiz` and the `MemoryViz` scenes (`.cl-quiz`, `.cl-mv`/`.cl-ag`
  ...): re-point their OWN CSS vars
  (`--mv-*`, `--clq-*`) to course tokens and darken only their hardcoded-light
  panels, ancestor-qualified (`[data-theme="x"] .cl-mv <sel>`) so they beat
  `code-lab.css`, which loads after `styles.css`. Verify by driving the widgets to
  later steps with puppeteer-core on the system Chrome, WCAG-checking new pairs,
  and screenshotting the default theme to prove no regression.
