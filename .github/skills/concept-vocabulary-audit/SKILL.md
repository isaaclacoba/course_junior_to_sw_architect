---
name: concept-vocabulary-audit
description: >-
  Read-only audit of the course CONCEPT GRAPH (the live migrated content: each
  lesson's meta.js `concepts` ids/edges + res/strings/default/en.json concept
  term/def) - the shared vocabulary across tracks, NOT
  individual lessons. USE FOR: reviewing concept `def`s for accuracy and voice;
  checking introduce-once and whether the right lesson introduces each concept;
  coverage gaps and over-fragmentation; id hygiene; cross-track overlap; verdicts
  on judgment calls; deciding WHEN a re-audit is due (fingerprint staleness) and
  running one on request or after lessons/concepts change. DO NOT USE FOR:
  per-lesson content/pedagogy audits (use the course-audit skill); authoring or
  editing lessons (use lesson-authoring); APPLYING the fixes the audit recommends
  (that is a normal edit to the owning lesson's files, after the human signs off).
---

# Auditing the concept vocabulary

A concept-vocabulary audit is a read-only critique of the course's concept GRAPH -
the `{ id, term, def }` each lesson introduces plus its `revisits`/`uses` edges,
across all three tracks. It judges the vocabulary, not the lessons. It never edits
the graph or a lesson; it produces one findings report the human re-reviews.

This is NOT the `course-audit` skill: that maps what each individual lesson teaches
(`docs/audit/`). This skill looks across lessons at the shared concept graph.

## When to run (on request, or when an audit is due)

- **On request.**
- **Staleness (self-detect).** The graph has a fingerprint. Compute it (below); if it
  differs from the one recorded in the header of `docs/concepts/vocabulary-review.md`,
  the vocabulary changed since the last audit and a re-audit is DUE.
- **Event triggers** (any one):
  - A track finished migrating, or a batch of lessons/concepts was added or seeded.
  - Before building a concept-consuming feature - the glossary, the "in this lesson"
    agenda, or in-prose concept mentions (concept-index plan items 13-15).
  - `node tools/validate.mjs` starts reporting new duplicate-introduce or unknown-id
    errors, or the concept count jumps.
- **Cadence:** at least once per completed track migration.

## The fingerprint (the staleness marker)

```
node -e 'const fs=require("fs"),c=require("crypto");const w={};new Function("window",fs.readFileSync("course-registry.js","utf8"))(w);let a=[],L=0;for(const l of w.CourseRegistry.lessons){if(!l.path)continue;L++;const g={};new Function("window",fs.readFileSync(l.path+"/meta.js","utf8"))(g);const cc=(g.LESSON_META&&g.LESSON_META.concepts)||{};let en={};try{en=JSON.parse(fs.readFileSync(l.path+"/res/strings/default/en.json","utf8"));}catch(e){}for(const x of(cc.introduces||[]))a.push(x.id+"\u0001"+(en["concept."+x.id+".def"]||""));}a.sort();console.log("lessons="+L+" concepts="+a.length+" fp="+c.createHash("sha256").update(a.join("\n")).digest("hex").slice(0,12));'
```

It reads each lesson from `course-registry.js`, then hashes the sorted set of
introduced `id=def` pairs (id from `meta.js`, def from that lesson's
`res/strings/default/en.json`), so it moves only when a concept or a definition
changes. Record the result in the report header:
`<!-- audit: fp=<hash> lessons=<n> concepts=<n> date=<YYYY-MM-DD> -->`.
Baseline at skill creation: `lessons=76 concepts=207 fp=8b052068c017` (computed
against the old drafts). Migration is now COMPLETE: the drafts
(`docs/concepts/*.concepts.json`) were retired, and the live migrated content is
the authoritative source - the recipe above reads it directly. Post-migration
reference point: `lessons=83 concepts=225 fp=be2341fd08d6`.

## Inputs (ground truth - read-only)

1. The graph, split across each lesson's folder (the authoritative source now that
   migration is complete):
   - `content/<track>/<part>/<lesson>/meta.js` `concepts` = the GRAPH:
     `{ introduces:[{id}], revisits:[{id}], uses:[{id}] }` (ids + edges, no text).
   - `content/.../res/strings/default/en.json` = the TEXT:
     `concept.<id>.term` / `concept.<id>.def` (the English base; `es.json` etc. are
     overlays). A concept is introduced by exactly one lesson within its track (ids are
     track-scoped: `pr-`, `th-`, `ai-`), and that lesson owns its one-sentence `def`.
   The old `docs/concepts/*.concepts.json` drafts were RETIRED - do not read them.
2. Order + structure: `course-registry.js` (`window.CourseRegistry.tracks` = the
   track/part chrome in display order; `lessons` = every lesson in reading order).
   (This replaced the retired `course-manifest.js`.)
3. Lesson CONTENT to check `def`s against: a flat `<id>.js` (`BUILD_CONFIG`/`DRILL_CONFIG`
   per-card `title`/`concept`/`context`/`goal`), `<id>.viz.js` (`LESSON_VIZ` narrated
   `steps`), `<id>.html` hero - OR, if migrated, `content/<track>/<NN-part>/<NN-id>/`.
4. `AGENTS.md` - the voice a `def` must follow: plain, warm, ONE sentence, no
   jargon-before-taught, a spaced hyphen ` - ` not em-dashes, no hype, not circular.

## The rubric (produce PRIORITIZED, CONCRETE findings)

Cite `lessonId` + `conceptId` + the exact issue + a suggested fix. Do not restate every
entry; focus on what is wrong, questionable, or inconsistent, and name the areas that
look solid so the human knows where to focus.

- **P1 Correctness** (highest value) - a `def` technically wrong or misleading given the
  lesson content or the domain. Quote it and say what is off.
- **P2 Introduction placement** - is each concept introduced by the earliest lesson that
  genuinely teaches it (not one that only mentions it, and not after a lesson that already
  references it)? Flag mis-assignments.
- **P2 Coverage** - a core concept a mentor would expect that is missing; or the opposite,
  over-fragmentation into trivia to merge or drop.
- **P3 Voice** - `def`s that break `AGENTS.md` (multi-sentence, circular, jargon before it
  is taught, hype, em-dashes, an opinion tail after a ` - `).
- **P3 id hygiene** - near-duplicate ids within a track (`pr-method` vs `pr-methods`), a
  name that does not match its meaning, kebab-style drift, display `term`s that collide.
- **Graph edges** - obviously missing `revisits`/`uses` dependencies, or references that
  look wrong (a late lesson `uses` something never plausibly introduced).
- **Cross-track overlap** - concepts that appear in more than one track under different ids
  (e.g. variable, type, function, null). List the set; the human decides unify vs keep
  track-scoped. (This is why one GLOBAL reviewer beats a per-track fleet - see Process.)
- **Judgment calls** - a one-line agree/disagree verdict on each choice the drafters flagged
  (e.g. which lesson owns SRP; whether a preview lesson owns a concept the dedicated lesson
  revisits; taxonomy splits).

## Process

1. Decide if due (fingerprint or a trigger). If running, note the reason.
2. Read the ground-truth inputs; sample enough lessons per track to judge `def` accuracy -
   you need not read all 76, but read every lesson named in a finding.
3. Prefer ONE global reviewer over a per-track fleet: a single reviewer sees cross-track
   overlap and id-convention drift that per-track reviewers cannot. Dispatch a read-only
   subagent for depth on a large graph; hand it this rubric and the ground-truth list.
4. Write the report to `docs/concepts/vocabulary-review.md` (overwrite): the fingerprint
   header, a short overall verdict (good-enough-to-build-on vs systemic problems), the
   P1/P2/P3 sections, the cross-track overlap list, then the judgment-call verdicts.
   Reconcile with the prior report - state which earlier findings are now fixed and which
   remain open.
5. Report the verdict + P1/P2/P3 counts + the few most important issues to the human. Do
   NOT apply fixes.

## Acting on the findings (a SEPARATE step, after the human signs off)

The live content is the authority. Applying an accepted fix is a normal edit to the
owning lesson: a `def`/`term` change edits that lesson's `res/strings/default/en.json`
(and its `es.json` etc. so translations stay in step); an edge or id change edits that
lesson's `meta.js` `concepts`. Then `node tools/generate.mjs` rebuilds
`generated/concept-index.js` + `generated/concept-i18n.<lang>.js`, and
`node tools/validate.mjs` confirms the graph (0 errors; orphan warnings are expected).
Never fold fixes in during the audit.

## Guardrails

- Read-only. Never edit a `meta.js`, a lesson's `en.json`/`es.json`, or any lesson
  content; never compile or run a lesson; no push or commit unless asked.
- Base every finding on the actual file - do not infer a concept's meaning from its id or a
  lesson's content from its filename.
- Voice of the report itself: plain, factual, ids/terms in `backticks`, spaced hyphen, no
  hype, no emojis.
