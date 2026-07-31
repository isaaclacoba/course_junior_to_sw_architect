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

## Git & GitHub identity

- **GitHub attributes contributors from commit author/committer email and
  `Co-authored-by:` trailers only - never from an email that merely appears in a
  commit message's prose.** To confirm a denied identity is really gone after a
  history rewrite, check four independent backend sources, not the web UI (which
  caches): `gh api 'repos/<o>/<r>/contributors?anon=1&per_page=100'` (a removed
  user still shows by its numeric id), the Insights contributor-graph data, an
  anonymous `curl` of the overview HTML grepped for the name / email / avatar id,
  and `gh api repos/<o>/<r>/commits/<sha>` (`.author.login` / `.committer.login`).
  A sighting that survives all four is the browser cache or GitHub's async
  recompute (minutes to ~24h), not a git problem - hard-refresh, don't re-rewrite.

- **A history rewrite is not finished until EVERY local ref is reset - checking
  only the branch you are on gives a false "clean".** After `filter-repo` +
  force-push, the old commits (and their author email) stay reachable through
  stale local branches you never touched (a `master` left behind), `backup/*`
  branches, `refs/original/*`, and the reflogs. Point or delete all of them, then
  `git reflog expire --expire=now --all && git gc --prune=now`, and verify with
  `git log --all --format='%ae%n%ce' | grep -c <bad-email>` returning `0`. Also
  fix the repo's local `git config user.email` - a stale value there (e.g. a work
  address carried into a worktree) is what re-introduces the wrong identity on the
  next commit in the first place.

- **When the default SSH remote maps to a denied identity, push over HTTPS.** If a
  machine's SSH key is tied to the account you are trying to purge, pushes will
  re-attribute to it; use the HTTPS remote with a token in `~/.git-credentials`
  for the correct account instead of switching the key.

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
