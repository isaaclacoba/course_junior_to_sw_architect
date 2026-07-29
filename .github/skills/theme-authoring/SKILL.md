---
name: theme-authoring
description: >-
  Add or maintain a site-wide theme in the C# course (this repo). USE FOR:
  adding a new theme (e.g. a Critters/kids skin); building or fixing dark mode;
  making the theme follow the OS prefers-color-scheme; and - the hard part -
  re-skinning the vendored code-lab widgets (the Quiz, and the MemoryViz visual
  with its scenes) so they read cleanly under a non-default theme. DO NOT USE
  FOR: writing lesson content or prose (use lesson-authoring);
  changing the engines or the code-lab component itself (that is engine work,
  see copilot-instructions); auditing content (use course-audit).
---

# Theming the course

The site has one palette in CSS custom properties and a small runtime that swaps
it. A theme is data plus one CSS block - no logic edits. The hard part is not the
palette; it is the vendored `code-lab` widgets, which carry their own colors.

## Architecture

- `styles.css` `:root` (top of file) is the single source of color truth and IS
  the default ("Clean") theme. Every surface/ink/line/tint is a token; RGB-channel
  tokens (`--primary-rgb`, `--accent-rgb`, `--dark-rgb`, `--bg-1-rgb`, `--card-rgb`,
  `--shade-rgb`) let `rgba()` tints follow a recolor.
- A theme = one `[data-theme="<id>"]` override block appended to `styles.css` +
  one entry in `theme-registry.js`. Nothing else.
- `theme-registry.js` (data only, frozen `window.Themes`): each theme is
  `{ id, label, note, swatch:[bg,primary,ink], font?, scheme? }`. `id` must match
  the `[data-theme="<id>"]` block. `scheme:"dark"|"light"` opts the theme in as
  the OS-preference default. `default` carries no overrides (its rules are `:root`).
- `theme-switch.js` (runtime): applies `data-theme` on `<html>` in `<head>` before
  first paint (FOUC-safe), stores the choice in `localStorage["course_theme"]`,
  and renders the picker. With no saved choice it follows OS
  `prefers-color-scheme` via `registry.schemeDefault(scheme)`, and keeps following
  live OS changes until an explicit pick is made. An explicit choice always wins.
- Load order in every page head: `styles.css` -> `theme-registry.js` ->
  `theme-switch.js` -> `vendor/code-lab/code-lab.css`. Note `code-lab.css` loads
  AFTER `styles.css`; this matters for widget overrides (see below).

## Add a theme

1. Append a `[data-theme="<id>"] { ... }` block at the END of `styles.css`
   overriding the token groups you want (base surfaces/ink, warm/cool neutrals,
   dark surfaces, terminal, info/indigo, good/danger/warn tints, overlays, landing
   channels/pills/switch). For a dark theme also set `color-scheme: dark` so native
   controls/scrollbars follow.
2. Add the data entry to `theme-registry.js`. Set `scheme` only for a true
   dark/light auto-default.
3. Fix dual-role tokens (see gotchas) and re-skin the widgets (next section).
4. Verify (recipe below). Edit `styles.css` atomically via bash - it is large and
   the `edit`/`create` tools can be interrupted mid-write (see learnings.instructions).

## Re-skinning the code-lab widgets (the part that bites)

code-lab is a FAMILY of widgets, each a top-level `CodeLab.*` component for a
different scenario, each with its own `.cl-*` root class in
`vendor/code-lab/code-lab.css`:

- `MonacoEditor` (+ `loadMonaco`, `TextareaEditor`) - the code editor (`.cl-editor`,
  `.cl-ta`).
- `RoslynIframeRunner` - runs C# in-browser; the output + error panels
  (`.cl-runner`, `.cl-output`, `.cl-errors`, `.cl-error`).
- `Quiz` - the checkpoint assessment (`.cl-quiz`); mounted by `theory-check-*.js`.
- `MemoryViz` - a visual-explainer HOST that itself renders one of many SCENES,
  each with its own root: `.cl-mv` (machine board / RAM-die), `.cl-ag` (AI agent),
  `.cl-al` (agent loop), `.cl-ms` (memory shelf), `.cl-pb` (plan board), `.cl-tr`
  (tool rack), `.cl-tx` (transcript), `.cl-rg` (retrieval). Mounted by
  `theory-*.viz.js` and `ai-*.viz.js`.
- `Tour` - the guided tour (`.cl-tour`).

So there are two levels: WIDGETS (the components above) and, inside MemoryViz only,
SCENES. A theme must skin whichever widgets a lesson uses; today that is the Quiz
and the MemoryViz scenes (the editor/runner/tour inherit enough from the page, but
check them for any theme you add).

None of these use the course tokens; they carry their own colors. Within a widget,
two kinds of surface:

- **Intentionally dark "hardware" surfaces** (the green board, the agent strip,
  core, tool cards, memory stores, plan steps, transcript messages). These already
  read fine on ANY page background - leave them alone.
- **Hardcoded LIGHT panels** that glare on a dark page - these are the ones to fix:
  the narration note (`.cl-mv-narr`), the step controls
  (`.cl-mv-controls button`, `.cl-mv-action`, text-size), the pastel RAM region
  cards (`.cl-mv-global/-data/-bss/-rodata/-mmap/-stack/-heap`) and the stack
  frames/slots/heap objects inside the die, the AI next-token panel (`.cl-ag-fan`
  + rows), and the whole `.cl-quiz` (light `#fff` card, question cards, options,
  results).

How to fix them, correctly:

1. **Re-point the widget's own CSS variables first**, don't repaint element by
   element. `.cl-mv` defines `--mv-ink/--mv-muted/--mv-line/--mv-stack/--mv-heap`;
   `.cl-quiz` defines `--clq-line/--clq-accent/--clq-good/--clq-bad`. Map them to
   course tokens: `[data-theme="dark"] .cl-mv { --mv-ink: var(--ink); --mv-muted:
   var(--ink-soft); --mv-line: var(--line); }`. Check each var's USAGE first
   (`grep 'var(--mv-heap)' code-lab.css`) - some are backgrounds needing white text
   (e.g. `--mv-heap` on the primary button) and must NOT move like an ink token.
2. **Darken only the hardcoded-light surfaces**, deriving every value from existing
   course tokens (`--card`, `--bg-2`, `--bg-3`, `--warn-*`, `--good-*`, `--danger-*`,
   `--indigo-*`, `--slate-*`). Do not invent a parallel palette.
3. **Keep the semantic hue identity.** A darkened region/frame/message should keep
   its meaning color in the tag/accent (amber global, blue stack, teal heap,
   per-process frame accent), so the visual still teaches.
4. **Scope + ancestor-qualify every rule** as `[data-theme="<id>"] .cl-<root>
   <selector>`. The ancestor is required: `code-lab.css` loads AFTER `styles.css`,
   so a bare `[data-theme] .cl-mv-narr` can lose specificity ties. Keeping `.cl-mv`
   in the selector wins.
5. Never edit the vendored bundle. This is theme CSS only; the code-lab submodule
   is usually not even checked out here.

Put all of this in a clearly commented "interactive widgets" section at the end of
the theme's block in `styles.css`.

## Verify (the recipe that catches the real bugs)

1. `node --check` any JS you touched; brace/paren-balance `styles.css`
   (`awk '{o+=gsub(/{/,"{");c+=gsub(/}/,"}")}END{print o-c}'` == 0).
2. Seed the theme, then headless-screenshot representative pages. Seed via a temp
   `_seed_<theme>.html` that `localStorage.setItem("course_theme","<id>")` then
   `location.replace(target)`, or set localStorage in the driver.
3. **Drive multi-step widgets to their later states** - step 1 hides the panels
   that break (a filled probability fan, populated stack/heap slots, quiz result).
   Use `puppeteer-core` with the SYSTEM Chrome (no download):
   `npm i puppeteer-core` in `/tmp`, launch with
   `executablePath:"/usr/bin/google-chrome", headless:"new", args:["--no-sandbox"]`,
   then click the widget's Next control a few times:
   `document.querySelectorAll(".cl-mv-controls button")` -> the one whose text
   matches /next/ and is not disabled. Screenshot after each advance.
4. **WCAG AA on every NEW fg/bg pair** (target >= 4.5:1). A small Python relative-
   luminance function over each `(foreground, background)` you introduced; list the
   worst. Bump a token if any pair is under.
5. **Screenshot the DEFAULT theme too** and confirm it is pixel-unchanged. Every
   rule you add MUST be `[data-theme="<id>"]`-scoped; this proves no regression.
6. Remove the temp seed/driver files; append a work-log end entry with a real
   `date`.

## Gotchas

- `[hidden] { display: none !important }` (near the top of `styles.css`) is what
  makes the theme picker panel's `hidden` toggle work. Do not remove it.
- Dual-role tokens: some tokens are BOTH a background and a foreground in different
  rules (e.g. `--dark` is a code-block bg AND inline-code text color; `--primary-2`
  is a button bg AND link text). A pure swap can invert contrast; add a couple of
  targeted `[data-theme] <element>` fixes.
- `--shade-rgb` is used for translucent hairlines/shadows over light surfaces; on a
  dark theme flip it to `255,255,255` and make hairlines white alphas.
- Only push when explicitly asked; commit the whole theme (palette + runtime +
  widget skin + this doc) as one cohesive change.
