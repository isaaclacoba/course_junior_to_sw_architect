<!-- audit: fp=be2341fd08d6 lessons=83 concepts=225 date=2026-08-03 -->
<!-- CG4 re-audit 2026-08-03: migration is COMPLETE (all 83 lessons under content/); the
     authoritative graph is now the migrated content - concept ids/edges in each
     meta.js, term/def in each res/strings/default/en.json (concept.<id>.term/.def).
     The docs/concepts/*.concepts.json DRAFTS are stale (75 lessons / 208 concepts,
     fp f9f9b2b89215) and were NOT the source read for this audit. Fingerprint above
     is over the live def source (en.json), not the drafts. No fixes applied. -->
<!-- fixes applied 2026-08-03: the two P3 one-sentence-rule defs collapsed to a single
     sentence in EN + ES - th-readability (write-for-readers) and th-comment
     (comments-say-why); regenerated concept-index.js + concept-i18n.es.js;
     validate 0 err/90 warn, check-i18n PASS. New live-def fp be2341fd08d6.
     P2 theory-19 (10-concept density) DEFERRED to a dedicated split (its own
     lesson audit), NOT applied here. -->
# Concept-graph vocabulary review (CG4 - post-elementary-foundation re-audit)

## Status / fingerprint

The graph grew since CG3: **83 lessons / 225 concepts** (was 76 / 208). The
`+7` lessons and `+17` concepts are the elementary Theory work built since - the
new Part 5 "Foundations of good code" (`good-names`, `no-repeats`, `one-job`,
`write-for-readers`, `comments-say-why`, `good-code-check`), the deepened Part 3
networking/storage beats (`theory-18`, `theory-19`), the deepened Part 4 VCS
beat (`theory-20`), the `keeping-data-safe` security lesson, and two AI-track
prompt concepts (`ai-few-shot`, `ai-output-format`).

Fingerprints (all `slice(0,12)`):
- CG3 recorded header: `617584744ca3`, 76 / 208 (`date=2026-07-29`).
- Live def source (this audit, over `en.json` `concept.<id>.def`): `d95e6adc9682`, 83 / 225;
  after the P3 fix below it is `be2341fd08d6` (two defs reworded).
- The `docs/concepts/*.concepts.json` drafts: `f9f9b2b89215`, 75 / 208 - **stale**.

The last two disagree because migration finished and the new concepts were
authored directly in `content/`, never back-ported to the drafts. See the
process finding below.

## Overall verdict

**Good enough to build on.** All 17 new defs are technically accurate at the
level the Theory track teaches; the introduce-once rule holds across all three
tracks (0 duplicate introducers); every `revisits`/`uses` edge resolves (0
dangling, 0 forward references); the Part 5 chain and the checkpoints wire the
new concepts correctly. Every CG3 fix has landed (reconciled below). The
remaining findings are two one-sentence-rule slips, one dense lesson, and a
process risk around the now-stale drafts. No blocker, no rebuild.

New counts (fresh findings only): **P1 = 0, P2 = 1, P3 = 2, plus 1 process risk.**
The two P3 items were FIXED this pass (EN + ES); the process risk was RESOLVED this
pass (drafts + seeder retired); the P2 density item is deferred to a dedicated
`theory-19` split.

## P0 (process) - the stale drafts were a hazard - RESOLVED 2026-08-03

**Resolved:** the three `docs/concepts/*.concepts.json` drafts and the one-time
`tools/seed-concepts.mjs` seeder were deleted; the migration-era
`loadPlannedConceptIds` tolerance was removed from `validate.mjs`; and
`concept-vocabulary-audit/SKILL.md`'s fingerprint recipe + "acting on findings"
workflow now read/write the live `en.json` + `meta.js` source. `validate` stays
0-error and the tests stay green. The finding as originally written is kept below
for the record.

Migration is complete: all 83 lessons live under `content/`, 0 remain on the old
flat layout. The pipeline now reads concept **ids and edges** from each
`meta.js` and concept **term/def** from each `res/strings/default/en.json`
(`generate.mjs` line ~208 reads them back from `en.json`, explicitly "not
meta.js"). The `docs/concepts/*.concepts.json` drafts are no longer read by
`generate.mjs`; they are only consulted by `validate.mjs` (`loadPlannedConceptIds`,
a migration-era tolerance for "not-yet-migrated introducers") and are the input
to the one-time `seed-concepts.mjs`.

Because the drafts are stale (missing all 17 new concepts and any CG3 def
rewordings applied in `en.json`), two hazards follow:

- **Re-running `tools/seed-concepts.mjs` would overwrite the live lessons with
  the stale drafts, deleting the 17 new concepts' defs.** It is now a foot-gun,
  not a maintenance tool.
- **This skill's own staleness fingerprint recipe reads the drafts** and so
  reports `75 / 208`, understating the true graph; and the skill's "acting on
  findings" step ("edit the drafts, then `generate.mjs` re-seeds each lesson")
  is outdated - `generate.mjs` reads `en.json`, so a draft edit no longer
  propagates.

Recommended fix (APPLIED 2026-08-03): retire the drafts and the `seed-concepts.mjs`
seeder, drop the migration-era `loadPlannedConceptIds` tolerance from
`validate.mjs`, and update `concept-vocabulary-audit/SKILL.md` so its fingerprint
and its "acting on findings" workflow read/write the live `en.json` concept text.
All done this pass.

## P1 - Correctness

**None.** No introduced def is technically wrong or misleading against its
lesson content or the domain. Spot-checks on the 17 new concepts:

- `theory-19 / th-ip-address` ("The number that identifies a machine on the
  internet ... like 142.250.1.14") - accurate at the elementary level; a real
  dotted-quad example.
- `theory-19 / th-dns`, `th-http`, `th-api` - the phone-book, request/response,
  and "menu" framings are correct and plain.
- `theory-18 / th-database` - "many programs can share and change at the same
  time without clashing, and can query for exactly the data they need" -
  correct (concurrency + query), positioned as "the step up from a single file".
- `keeping-data-safe / th-secret`, `th-validation` - both accurate; validation's
  "input from a user, another program, or the network can be wrong or hostile"
  is the right elementary framing (trust boundary without the jargon).
- `theory-20 / th-vcs-branch`, `th-merge`, `th-remote` - all correct; `th-remote`
  names GitHub only as an example of a hosting platform, not as the definition.
- Part 5 `th-good-name`, `th-duplication`, `th-single-purpose` - accurate and
  plain; `th-single-purpose` correctly frames itself as "the everyday seed of
  the single-responsibility idea" (a preview, not a re-definition of SRP).

## P2 - Introduction placement & coverage

- **`theory-19` introduces 10 concepts in one lesson** (`th-network`,
  `th-internet`, `th-client`, `th-server`, `th-request`, `th-response`,
  `th-ip-address`, `th-dns`, `th-http`, `th-api`) - the densest lesson in the
  graph by a wide margin (next is 7: `foundations`, `theory-20`). For an
  *elementary* foundation this is a lot of new vocabulary at once. It reads as a
  deliberate "how the internet works" overview, and the ids/edges are clean, so
  this is a judgment call rather than a defect: either accept it as a labelled
  survey lesson, or consider splitting addressing (`internet`/`ip-address`/`dns`)
  from the request cycle (`client`/`server`/`request`/`response`/`http`/`api`)
  into two beats to lower the load. Flag for the human; non-blocking.

- **Coverage of Part 5 looks complete for an elementary pass.** `good-names`,
  DRY (`th-duplication`), single-purpose, readability, and comments are the
  canonical clean-code starters and none is missing. One optional future
  candidate a mentor might expect - a named-constant / "no magic numbers" idea -
  is currently folded into `th-good-name`; that is a fine call at this level and
  adding it now would fragment. No action needed.

- **`th-inode` remains a borderline depth call** (carried, agreed at CG3). The
  def is accurate ("A file on disk is an inode - its bytes plus facts ... reached
  through a name in a folder") and it now has a distinct display term, but
  "inode" is a deep filesystem term for an elementary track. Keeping it is
  defensible because it anchors `th-persistence`/`th-storage`/`th-database`; noted
  only so a coverage reviewer is not surprised.

## P3 - Voice, id hygiene, edges

- **Two new defs were two sentences - the one-sentence-per-def rule** (the only
  two multi-sentence defs in all 225). **FIXED this pass in EN + ES:**
  - `write-for-readers / th-readability` was "How quickly a reader can understand
    code. Since code is read far more than it is written, the clearer version
    usually wins over the cleverer one." Now one sentence: "How quickly a reader
    can understand code - and since code is read far more than it is written, the
    clearer version usually beats the cleverer one." (ES reworded to match.)
  - `comments-say-why / th-comment` was "A note for humans written in the code that
    the computer ignores. A good comment explains why something is done, not what
    the code already shows." Now one sentence: "A note for humans that the computer
    ignores, best used to explain why something is done rather than what the code
    already shows." (ES reworded to match.)

- **`th-single-purpose` names `single-responsibility` before it is taught**
  ("the everyday seed of the single-responsibility idea"). It is a hedged
  preview, not a definition, so it is acceptable under the same latitude given to
  `ai-1`'s use of "token" at CG3 - noted, not a required fix.

- **`th-good-name` uses "comments" before `th-comment` is introduced** ("code
  explains itself and needs fewer comments"). "Comment" is an everyday word here,
  not the taught concept; harmless, noted for completeness only.

- **id hygiene: clean.** No near-duplicate ids within any track (checked
  singular/plural and shared-prefix pairs); the CG3 `pr-to-string` /
  `pr-tostring-override` pair now renders as distinct display terms ("ToString"
  vs "Custom text form"), so the glossary no longer collides. No new term
  collisions across the 225 concepts.

Solid, do-not-touch areas (fresh confirmation): the Part 5 revisit spine
(`th-good-name` introduced in `good-names`, revisited by the four later Part-5
lessons and `good-code-check`; `write-for-readers` revisits `th-single-purpose`;
`comments-say-why` revisits `th-readability`); the theory checkpoints
(`theory-check-3` pulls the new networking/storage/security ids,
`theory-check-4` pulls the VCS ids, `good-code-check` pulls all five good-code
ids); and `keeping-data-safe` revisiting `th-permissions` while using `th-file`
and `th-server`. Well modelled.

## Cross-track overlap (for the unify-or-keep-scoped decision)

The eight true synonym rows from CG3 are unchanged (`variable`, `type`,
`assignment`, `method`/`function`, `parameter`, `loop`, `conditional`/`branch`,
`arithmetic`/`operator` across practical/theory). Confirmed programmatically:
the only exact term collisions across track prefixes are `variable`,
`assignment`, `loop`, `parameter` - all expected, all pitched at a different
depth per track. Recommendation unchanged: **keep track-scoped for now.**

One NEW deliberate cross-track bridge from Part 5:

| Idea | practical | theory |
| --- | --- | --- |
| single purpose / SRP | `pr-single-responsibility` (the principle) | `th-single-purpose` (the elementary seed) |

`th-single-purpose`'s def explicitly links to `pr-single-responsibility`; this is
a good, intentional ramp (plain "one job" in Theory -> the named principle in
Practical), not an accidental duplicate. Keep both. The other four good-code
concepts (`th-good-name`, `th-duplication`, `th-readability`, `th-comment`) have
no named practical counterpart - Practical demonstrates them inside build
lessons rather than naming them - which is fine.

## Judgment-call verdicts

1. **Part 5 owns the good-code vocabulary in THEORY, not Practical** - **Agree.**
   The elementary track is the right home for the plain "one job / good name /
   don't repeat" ideas; Practical shows them in code and `pr-single-responsibility`
   carries the named principle. The `th-single-purpose` -> SRP bridge is correct.
2. **`theory-19` packing a 10-concept networking overview** - **Weak agree.**
   Defensible as a survey beat, but the densest lesson in the graph; see P2.
3. **`th-inode` kept at elementary depth** - **Agree (carried).** Anchors the
   storage/persistence/database trio; def is accurate.
4. Carried CG3 decisions still standing: **`pr-single-inheritance` vs
   `pr-favour-composition` keep split** (language fact vs design principle);
   **`pr-runtime-dispatch` vs `pr-polymorphism` keep split** (how vs what);
   **`ai-1` using "token" before `ai-2`** accepted (next-token prediction is the
   whole of lesson 1). No change.

## Reconciliation with CG3

**CG3 findings now RESOLVED in the live content (verified against `en.json`):**
- P3 `th-file` / `th-inode` "File" term collision - **fixed**: `th-inode`'s term
  is now "Inode" (was "File"). This was CG3's highest-value fix; it landed.
- P3 `ai-react` used "grounded" before `ai-grounding` - **fixed**: def now ends
  "repeated until the agent has what it needs to answer".
- P3 `ai-evaluation` "can never" absolute - **fixed**: now "so the same bug does
  not sneak back in".
- P2 practical value-type/reference/identity dependency - **fixed by
  rewording** (CG3 option b): `pr-struct` ("copied whole ... so two variables
  never share the same one"), `pr-record` ("count as equal when their values
  match, not just when they are the same object"), and `pr-nullable-value-type`
  ("A plain value like int or bool ... adding ?") no longer lean on the untaught
  bare terms. No `pr-value-type` was added, and none is needed.
- P3 `pr-to-string` / `pr-tostring-override` near-duplicate ids - display terms
  now distinct; id similarity remains but is harmless. Closed.

**CG3 findings still open BY DESIGN (unchanged):**
- `ai-1` naming "token" one lesson before `ai-2` introduces it (accepted).
- `pr-single-inheritance` / `pr-favour-composition` and `pr-runtime-dispatch` /
  `pr-polymorphism` overlaps (DECIDED: keep split).
- `theory-18` naming hard/soft link in prose without concept ids (accepted -
  shallow by intent).

## Bottom line

**P1 = 0, P2 = 1, P3 = 2, plus one process risk.** The elementary-foundation
concepts are accurate, well-placed, and correctly wired, and every CG3 fix has
landed. Status of the follow-ups:

- **DONE this pass:** the two P3 defs (`th-readability`, `th-comment`) were
  collapsed to one sentence in EN + ES and the generated files were rebuilt
  (live-def fp `be2341fd08d6`; validate 0 err, check-i18n PASS).
- **DONE this pass:** retired the stale `docs/concepts/*` drafts and the
  `seed-concepts.mjs` seeder, removed the dead `loadPlannedConceptIds` code from
  `validate.mjs`, and repointed this skill's fingerprint / "acting on findings"
  recipe at the live `en.json` + `meta.js` source.
- **DEFERRED (needs its own lesson audit):** split the 10-concept `theory-19`
  networking overview into two lighter beats.

No blocker.
