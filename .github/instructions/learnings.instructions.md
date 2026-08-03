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
- **A `str_replace`/`multi_replace` whose `oldString` spans more lines than the
  `newString` reproduces silently deletes the surplus.** To change one token on a
  line, keep `oldString`/`newString` line-balanced; do not drag trailing lines (a
  `return;`, a closing brace) into `oldString` unless you reproduce them. Then
  `node --check` and eyeball the diff right after the edit - this repaired a run()
  block that lost its `return;` from exactly this mistake.

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
- **A root-relative default asset URL in a shared engine 404s on a migrated lesson.**
  Migrated lessons live four dirs deep (`content/<track>/<part>/<lesson>/`), so a
  root-relative default like `level3-app/index.html?runner=1` resolves lesson-relative
  and 404s - the runner never warms and Run silently does nothing. Gate the default
  with a `LESSON_META`-based `../../../../` prefix (flat pages, no `LESSON_META`, keep
  the bare default); explicit per-lesson `runnerUrl`s are already prefixed.

## Git & GitHub identity

- **Attribution comes ONLY from commit author/committer email + `Co-authored-by:`
  trailers** (never an email in prose). After a purge, confirm the identity is gone
  via backend sources, not the cached web UI: `gh api
  'repos/<o>/<r>/contributors?anon=1'`, the Insights contributor graph, an anon
  `curl` of the overview HTML, and `gh api .../commits/<sha>` (`.author.login`).
- **A history rewrite isn't done until EVERY local ref is reset** - stray branches,
  `backup/*`, `refs/original/*`, and reflogs - AND the repo's local
  `git config user.email` is fixed (a stale value there re-introduces the wrong
  identity on the next commit). Verify `git log --all --format='%ae%n%ce' | grep -c
  <bad-email>` returns `0`.
- Push/remote identity specifics (SSH-vs-HTTPS, which token maps to which account)
  live in `/memories/repo/course-git.md`; the "token-in-URL push does not advance
  `origin/*`, read the tip with `git ls-remote`" rule lives in the `integration` skill.

## Theming

- **Theming/dark mode is a skill - see `theme-authoring`.** A theme is one
  `[data-theme="<id>"]` block in `styles.css` + one `theme-registry.js` entry; keep
  every rule `[data-theme]`-scoped so the default stays byte-for-byte unchanged. The
  real work is re-skinning the vendored `code-lab` widgets: re-point their OWN CSS
  vars (`--mv-*`, `--clq-*`) to course tokens, ancestor-qualified (`[data-theme="x"]
  .cl-mv <sel>`) so they beat `code-lab.css` (loads after `styles.css`); verify by
  driving the widgets to later steps, WCAG-checking new pairs, and screenshotting
  the default for no regression.

## i18n

- **Re-localize every dynamically-painted surface, not just render-time prose.**
  `kernel-controller.relocalize()` fans out to `surfaces.forEach(s => s.setLocale())`,
  so a surface's `setLocale` must also re-paint whatever an event handler wrote - the
  run result, run errors - or it keeps the old language after a switch. Store that
  event-time text as a re-derivable thunk and re-paint it in `setLocale`, gated on the
  panel being visible so a stale thunk never shows.
- **Only build/viz/checkpoint lessons localize; runnable drills are English-only.**
  `kernel-controller.bind()` handles `BUILD_CONFIG`/`LESSON_VIZ`/`QUIZ_CONFIG` but has
  no `DRILL_CONFIG` branch, and legacy flat drill pages carry no `LESSON_META`, so they
  never join the surface list. Do not chase a "drill result will not translate" bug -
  those lessons are not in the i18n system.

## Landing a large divergent branch (integration)

- **This is a skill - see `.github/skills/integration/SKILL.md`.** It carries the
  full playbook plus the one-line scars that used to live here: a refused push to a
  diverged deployed branch is landed with `git merge -s ours` (never `-f`); a FF
  push is rejected when the commit edits `.github/workflows/*` without `workflow`
  token scope; push the bumped submodule commit to its remote BEFORE the
  superproject; an edit to a GENERATED file fails the deploy drift gate (fix the
  source, rehearse `node tools/generate.mjs && git diff --exit-code generated/
  content/`); and `git worktree remove` refuses a worktree holding a submodule (use
  `rm -rf` + `git worktree prune`).
