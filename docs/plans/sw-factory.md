# Software factory - an FSM for the way we work
Status: in progress  -  Design: docs/architecture/sw-factory.md

## Goal
The WoW is advisory, so it gets skipped - measured at 11 of 16 briefs (69%)
shipping in the same commit as their code. Make the phase of work explicit and
derived from artifacts, so drift is visible instead of silent. Warn first, block
later.

## Approach
Six states - `recall`, `grounding`, `deciding`, `specifying`, `building`,
`verifying` - each entered on evidence that already exists (journal rows, briefs,
design-of-records, gate exit codes). A `tools/factory.mjs` derives the state; a
Copilot **agent** hook surfaces it. Never a git hook: the owner's commit and push
must stay instant. Start warn-only. Small tasks fast-path on measured thresholds
and auto-escalate if they grow.

## Owns
- `tools/factory.mjs`
- `.github/hooks/*.json`
- `.github/skills/work-brief/SKILL.md`
- `docs/architecture/sw-factory.md`, `docs/plans/sw-factory.md`

## Plan
1. [x] Recall prior rulings - verify: found + cited `D-wow-enforcement-3/6`
2. [x] Ground it: measure the failure, audit infra, verify hook docs first-hand - verify: journal `audit` + `subagent` rows
3. [x] Decide with the owner - verify: `D-sw-factory-1..11` recorded
4. [x] Mock the status display, measure it, owner picks - verify: B+C chosen, ladder's 83-col wrap found
5. [x] Write design-of-record + this brief - verify: both exist, decided items only
6. [x] **PROVE a hook fires in a new session** - verify: `/tmp/hook-poc.log` 524B; `sessionStart` fired 11:37:15 + `postToolUse` x16
7. [x] `tools/factory.mjs state` - derive the phase from artifacts - verify: rows-no-decisions -> `deciding`, rows+brief -> `building`; real `sw-factory` -> `building`
8. [x] Fast-path classifier - verify: `selftest` - 3 predicates, all 4 guarded dirs, and 3-files-fast -> 4-files-escalates
9. [x] Path attribution from `## Owns` - verify: `selftest` separates the two live features; `tools/derive-goals.mjs` reads unclaimed
10. [x] `## Owns` added to the work-brief shape, required at `building` - verify: one shape line + one section; `factory attribute` reads it
11. [x] Rail renderer at session start - verify: measured 2 lines, 61 cols
12. [x] Gate report on a misstep - verify: exit 0 while warning; names `10 unticked plan step(s)`; silent on a clean changeset
13. [x] Ladder as an on-demand command, **fixed to fit 80 cols** - verify: measured 8 lines, 65 cols (mockup was 83)
14. [ ] `recall` enforced as state 1 - verify: FSM refuses to leave `recall` without a citing row
15. [ ] Watch it warn-only across real work - verify: false-positive count recorded here
16. [ ] Owner reviews the noise, then decides whether to flip to blocking - verify: a new decision row

## Progress
- 2026-08-06 Measured the failure: 69% of briefs ship with their code; 385 commits analysed for thresholds.
- 2026-08-06 Found agent hooks CAN deny, which expires the 2026-08-03 red-team's premise. Verified against GitHub's docs directly, not via the subagent.
- 2026-08-06 Research: "dark software factory" has no verifiable implementations; vendors warn against frameworks at this scale.
- 2026-08-06 11 decisions ratified. Design-of-record + brief written.
- 2026-08-06 Hooks DO fire here: `sessionStart` + `postToolUse` both logged. Repo-level `.github/hooks/` and fail-closed `preToolUse` stay unproven - unsafe to test while a second session is live.
- 2026-08-06 `tools/factory.mjs` built: state, classify, attribute, rail, gate, ladder, selftest. Warn-only, every command exits 0. `classify` 0.19s, `rail` 0.94s.
- 2026-08-06 Every pre-FSM feature reads `recall` - no old feature ever recorded one. A true reading, not a bug, and it is the backlog.
- 2026-08-06 Step 14 is already implemented by the derivation (recall is rung 1, and prose alone does not satisfy it) but is left unticked for the owner to verify.

## Open
- **`.github/hooks/` is not wired yet, on purpose.** User-level hooks are proven
  to fire; repo-level discovery and fail-closed `preToolUse` are not, and a
  broken `preToolUse` denies tool calls for every session under this account.
  That needs a window with no second session running. Until then the agent runs
  `tools/factory.mjs` itself - the fallback from the design, unchanged.
- The gate warns on the other session's files, because no brief claims them.
  That is the designed behaviour, not noise to suppress - but step 15 should
  count how often it fires before anyone argues to flip it to blocking.
- Whether the FSM should replace some advisory prose in
  `copilot-instructions.md` rather than adding to it - instruction files over
  ~200 lines measurably reduce adherence.
