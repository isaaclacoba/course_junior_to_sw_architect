---
name: course-audit
description: >-
  Run or extend the read-only content/pedagogy audit of the C# course (this
  repo). USE FOR: writing a per-lesson audit report; refreshing reports after
  lessons change; checking audit coverage; producing the track indexes or master
  README; reconciling findings with prior audits; planning cycle 1 close / cycle
  2 start. DO NOT USE FOR: editing lesson content (use lesson-authoring); changing
  engines; compiling or running lessons (the audit is read-only, no dotnet).
---

# Auditing the course

A lesson audit is a factual MAP of what a lesson teaches and where it has gaps -
not a rewrite and not an opinion piece. One report per lesson. Read-only: never
modify a lesson file, never compile or run anything.

## Read first

1. `docs/audit/README.md` - the master index, current findings, and cycle plan.
2. `docs/audit/TEMPLATE.md` - the required report shape (every heading).
3. Two exemplars that set the quality bar:
   `docs/audit/practical/first-builds.md` (build) and
   `docs/audit/practical/control-flow.md` (drill).
4. `docs/SPECS.md` - so you judge each lesson against the intended structure.
5. `docs/concept-ledger.md` - the portable syllabus; diff each lesson against it
   to catch "used before taught" and language-sugar leaks.
6. `AGENTS.md` - the voice the reports themselves are written in.

## The tracking mechanism

- `docs/audit/manifest.txt` - tab-separated authoritative list:
  `report-path <TAB> source-files <TAB> title`, in live `index.html` path order.
  Add a row here when a lesson is added to the course.
- `docs/audit/check-progress.sh` - marks a report OK when it exists and has
  >= 15 non-blank lines. Modes: default (summary + missing), `--all`, `--missing`.
  Run it to see coverage; target is 100%.

## Writing one report

1. Read the lesson's data file FULLY and its HTML (to learn which engine the HTML
   actually loads - a `theory-N.viz.js` visual vs a `theory-N.js` drill; flag any
   sibling data file that is loaded by nothing as dead code).
2. Fill every TEMPLATE heading from the actual file: track/part, engine/format,
   difficulty pill + `data-total`, runnable + theme, concept(s) taught, a
   card-by-card table, prerequisites, complexity rung, what is covered well,
   gaps/issues, verification status.
3. In "Gaps / issues" run the **recurring-defect scan** and list only
   genuinely-present problems. These are the patterns every audit keeps finding:
   - **Used before taught** - a concept or token used before its
     `docs/concept-ledger.md` row. Diff the lesson against the ledger.
   - **Language sugar leaking in** - C#-only surface (`=>`, `var`, `$"..."`,
     records, `??`/`?.`) where the portable form would do, especially early.
   - **Weak grading** - a build task graded on output only, no hidden `verify`.
   - **Not runnable when it could be** - visible output but no Run button.
   - **Implicit spine** - the SOLID letter or the "builds on the last rung" link
     left unstated.
   - **Missing recap**; **difficulty spike at a seam**; **theme switch mid-Part**;
     **dead sibling file**; **ordering inversion** (file numbers vs path order).
   - **Voice drift** toward AI-register (hype, tricolon-plus-dash, jargon before
     it is taught) - measured against `AGENTS.md`.
4. Voice of the report itself: plain, factual, code terms in `backticks`, spaced
   hyphen ` - `, no emojis, no hype.

To fill the "verification status" heading without editing the lesson, run the
read-only checks of the shared harness: `node tools/verify-lesson.mjs
<lesson-dir> --no-dotnet` (the audit compiles nothing; `--no-dotnet` keeps it to
`node --check` + viz resolvers + headless render). Report its result; never
change lesson content from an audit.

## Scaling with subagents

For a batch of lessons, dispatch parallel subagents (they write independent
files safely). Give each subagent: the TEMPLATE, both exemplars, the explicit
lesson list with metadata, the specific findings to check, and the tracker
command to self-confirm each report shows OK. Then run `check-progress.sh`
yourself to confirm the batch.

## Aggregate deliverables

After the per-lesson reports: `docs/audit/infrastructure.md` (shared engines),
`docs/audit/<track>/index.md` (TOC + one-liners per Part), and
`docs/audit/README.md` (covered / not covered / close cycle 1 / start cycle 2,
each track independently). Reconcile with prior audits: state which past gaps are
now closed and which remain open.

## Guardrails

- Read-only. No content edits, no compile/run, no push/commit unless asked.
- Base every statement on the actual file - do not infer from filenames.
- Log start and end in `docs/work-log.md` with a real `date` timestamp.
