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

- **A token-in-URL HTTPS push does not advance the local `origin/*` tracking
  refs, and `git fetch origin` may even fail when it uses the SSH remote.** When
  SSH maps to the wrong identity you push over HTTPS with an inline access token;
  afterwards do not trust `git rev-parse origin/master`, read the real remote tip
  with `git ls-remote https://github.com/<o>/<r>.git refs/heads/master`.

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

- **A refused `git push` between two long-diverged lines is not always a history
  problem - it is often plain divergence, landed with `-s ours` (no `-f`).** When a
  public *deployed* branch and your local trunk share only an old merge-base (each
  advanced independently), a normal push is rejected. If your trunk already carries
  the public line's *content* (ported feature-by-feature), land it
  non-destructively: fast-forward local to the integrated tree, `git merge -s ours
  <public-branch>` (keeps your tree 100%, folds the public history in as a second
  parent - verify with `git diff --quiet <integrated-commit> HEAD`), then a plain
  fast-forward `git push`. Every absorbed commit stays reachable/cherry-pickable, so
  nothing is lost even if a couple of items were never forward-ported.
- **A clean fast-forward push is still rejected if the commit edits
  `.github/workflows/*` and the token lacks the `workflow` scope.** The error reads
  "refusing to allow an OAuth App to create or update workflow ... without
  `workflow` scope" - a token-scope issue, not force/identity. Fix with
  `gh auth refresh -h github.com -s workflow`, then push with that token
  (`oauth_token` lives in `~/.config/gh/hosts.yml`; older `gh` has no
  `gh auth token`).
- **Push a bumped submodule's own commit to the submodule remote BEFORE pushing the
  superproject.** CI checks out `--recurse-submodules` and `dotnet publish`es the
  compiler-host; a gitlink pointing at an unpushed submodule commit dangles and the
  deploy fails. Confirm first with `git ls-remote <submodule-remote> | grep <sha>`,
  and stage ONLY the intended files so a locally-advanced submodule HEAD does not
  bump the pointer by accident.
- **An edit that only touches a generated file fails the deploy's drift gate - fix
  the SOURCE.** CI runs `node tools/generate.mjs` then
  `git diff --exit-code generated/ content/`; a prose/pedagogy edit pasted straight
  into a generated `content/.../index.html` renders fine locally but the generator
  overwrites it from `meta.js`/res strings, so the gate fails and the deploy dies.
  Put the edit in `meta.js` `intro[]` (or the res `*.json`) and rehearse locally:
  `node tools/generate.mjs && git diff --exit-code generated/ content/`.
- **`git worktree remove` refuses (even `--force`) a worktree that contains a
  submodule.** Fall back to `rm -rf <worktree-path> && git worktree prune`, then
  `git branch -d <branch>` - safe once `git merge-base --is-ancestor <branch>
  master` confirms the branch is fully contained.
