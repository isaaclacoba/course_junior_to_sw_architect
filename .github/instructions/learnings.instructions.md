---
description: Hard-won workflow learnings for this repo - small, general rules that save future sessions time.
applyTo: '**'
---

# Learnings

Durable rules discovered the hard way. Keep each to 1-4 sentences. If a learning
grows into a procedure, promote it to a skill and leave a pointer here.

## Other agents' work (ABSOLUTE)

- **NEVER modify, revert, restore, stash or discard a file another session is
  working in - not even to "clean up", and never `git checkout --` on a shared
  build artefact.** Another Copilot session often works the same branch and
  worktree at the same time. Their uncommitted edits are invisible work in
  progress; touching them destroys it. This was violated once by reverting
  `vendor/code-lab/code-lab.global.js` (built from their in-flight
  `csharp-symbols.ts`), which silently made the vendored bundle stale.
- **Commit only your own files, by explicit pathspec, and leave everything else
  alone.** If a shared file blocks you, say so and stop - do not "fix" it. What
  you commit must stand on committed source; their uncommitted work simply does
  not ship, and that is fine.

## Design rounds (WoW)

- **A widget's look-and-behaviour is a UX design decision - mockup + owner-decide -
  even inside a "build" phase.** The design-of-record's contracts fix the DATA shapes
  (`RepoState`, `layout() -> {nodes,edges,chips}`), NOT the visual. Do not let "the
  design is done, this is just implementation" bypass the WoW: for any new visual
  surface (a graph, a panel, an animation) show a non-functional HTML mockup and get
  the owner's pick BEFORE coding the view. Symptom of the trap: fleeting agents to
  build the view and "approving" it yourself.

## Editing

- **Never put backticks in a `-m` commit message - write the message to a file and
  use `git commit -F`.** A double-quoted `-m "... `binder` field ..."` makes the
  shell RUN the backticked word as a command and substitute its (empty) output, so
  the commit silently lands with a mangled message ("one  field") and a stray
  "command not found" in the terminal. This repo's voice uses `backticks` constantly,
  so the trap is permanent: `cat > /tmp/msg.txt <<'EOF' ... EOF` then `commit -F`.
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

## Gates & pushing

- **There are NO git hooks, by owner's decision. Never add one back.** Both the
  `pre-push` and the `pre-commit` hook were removed: QA rounds happen BETWEEN
  development, and a commit or a push must never block on them. The owner
  accepts that a regression can slip in between rounds - that is the price he
  has chosen for fast pushes. Do not add a hook or a CI gate without being asked.
- **Run the health gate yourself: `npm run gate`** (also `gate:all`,
  `gate:staged`). It skips instantly when nothing i18n-relevant changed, so it is
  cheap to run often. If a push ever seems to hang for minutes with no output,
  suspect a hook someone re-added, not the network.
- **Scope decides the gate's cost, so check what you touched.** `audit-gate
  --push` fans out to all ~83 voiced lessons only when the diff includes
  `page-shell.js` or a `resource/bind-*.js` binder; otherwise it checks just the
  changed lesson dirs (4 lessons = ~30s, all 83 = ~5min).
- **Size a browser worker pool by MEMORY, not cores.** A headless lesson tab is a
  real renderer holding Monaco plus the page and measures ~1.7GB, so "one per two
  cores" on a 16-core box asks for ~14GB and OOM-kills the machine. Budget from
  `MemAvailable`, and never scale a concurrency knob from 3 items straight to 83.
- **Kill Chrome's process GROUP, not its parent.** Signalling only the parent
  leaves renderer/zygote children writing into the temp profile, so `rmSync`
  loses the race with `ENOTEMPTY` and abandons ~50MB per run. `spawn` it
  `detached: true` and `process.kill(-pid)`.

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
- **This repo's `origin` is SSH, and that SSH key maps to the DENIED identity - so
  push over HTTPS with the `isaaclacoba` token.** Read it from
  `~/.config/gh/hosts.yml` (`oauth_token:`); `gh auth token` does not exist in the
  installed `gh`. Capture it into a variable and sanity-check it FIRST (`curl -H
  "Authorization: Bearer $T" .../user` -> `isaaclacoba`); never inline a
  command-substitution that can fail into the URL, or its error text lands in the
  URL (`fatal: credential url cannot be parsed`). Redact the token from any echoed
  output, and set `GIT_TERMINAL_PROMPT=0` so a bad credential fails fast instead of
  blocking on a prompt.
- The "token-in-URL push does not advance `origin/*`, read the tip with `git
  ls-remote`" rule lives in the `integration` skill.

## Theming

- **Theming/dark mode is a skill - see `theme-authoring`.** A theme is one
  `[data-theme="<id>"]` block in `styles.css` + one `theme-registry.js` entry; keep
  every rule `[data-theme]`-scoped so the default stays byte-for-byte unchanged. The
  real work is re-skinning the vendored `code-lab` widgets: re-point their OWN CSS
  vars (`--mv-*`, `--clq-*`) to course tokens, ancestor-qualified (`[data-theme="x"]
  .cl-mv <sel>`) so they beat `code-lab.css` (loads after `styles.css`); verify by
  driving the widgets to later steps, WCAG-checking new pairs, and screenshotting
  the default for no regression.

## Waiting and failing (UX)

- **A wait longer than a second must report what it is doing, and a wait that can
  fail must say so.** The Run button showed one frozen "Preparing compiler..." for
  the whole 5-60s WebAssembly boot, so a slow connection and a dead boot looked
  identical. Report named PHASES, not just a percentage - "downloading" vs
  "starting" vs "warming up" is what actually answers "is it stuck?", and the
  phase with no measurable progress is usually the longest one.
- **Never `.catch(function () {})` around something a control depends on.** That
  line enabled the Run button and labelled it "Run" after the compiler had failed
  to boot, handing the learner a button that could not work and no reason why. If
  a failure leaves a control unusable, disable it, name the failure, and say the
  one thing that fixes it (a hard reload, for a stale cached runtime).
- **Own the message the learner reads.** A rejection's own text is developer
  English written at the throw site (`"The code runner took too long to load."` in
  `code-lab`), outside the course's string files. Translate at the DISPLAY site
  from `res/chrome/*.json`; never paint a raw `error.message`.
- **A `tr()` fallback must be the shipped string, character for character.**
  `tr("run.bootDownload", "Downloading compiler...")` silently dropped the
  `{percent}` placeholder that `en.json` carried, so every path without loaded
  strings - including the tests - showed a label with no number in it.

- **A sweep that prints nothing is indistinguishable from a hang.** Same rule as
  the Run button, applied to our own tools. `ui-audit --all` is minutes long and
  only prints at the end; it now writes a page counter to stderr, so stdout can
  still be piped to a report.

## Browser-driven checks

Applies to `tools/ui-audit.mjs`, `tools/i18n-roundtrip.mjs` and anything else
driving Chrome over CDP through `tools/lib/browser.mjs`.

- **Never build in-page code as a template literal. Stringify a real function.**
  A template literal processes escapes before the browser sees the code, so a
  regex written `/\.\.\.|\d+\s*%/` arrives as `/...|d+s*%/`, where `...`
  matches any three characters. A `stuck-control` check matched a button labelled
  "Previous" that way. Write `async function probeFn(...)` and pass
  `` `(${probeFn.toString()})(${JSON.stringify(args)})` `` - then there is no
  escaping layer to get wrong.

- **A finding that appears under the harness and not under
  `python3 -m http.server` is the harness.** `startServer` was writing the head
  without `Content-Length`; node fell back to chunked encoding and the Blazor
  loader cancels its own `blazor.boot.json` when no length is declared. Every
  build page looked like a hung compiler. Confirm against the plain server before
  reporting a course defect.

- **Never let a timeout decide whether the page is settled.** A rule that fires on
  98 pages in a parallel sweep and on none of them individually is measuring
  machine load, not the course. The animation cap was being beaten by a loaded
  machine mid-fade. Ask the page for the state instead - "is an animation running
  on this element" - because any cap loses to a slower machine.

- **`background-color` is not what is painted.** A gradient paints too, and a
  backdrop walk that reads only the colour goes straight past it to the body:
  pale mint on a dark gradient card was reported as 1.29:1 against white, 123
  times. Collect the gradient's colour stops and judge against the worst one.

- **Know what actually removes an element from the tab order** before calling it a
  focus trap: `display: none`, `visibility: hidden` and `[hidden]` all remove an
  element *and its whole subtree* from sequential focus navigation. `opacity: 0`
  and a zero-size box do not - those stay tabbable, and those are the defects. A
  control that fades out with `opacity` alone needs `visibility` too.

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
