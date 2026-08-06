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
- `docs/architecture/sw-factory.md`, `docs/plans/sw-factory.md`

## Plan
1. [x] Recall prior rulings - verify: found + cited `D-wow-enforcement-3/6`
2. [x] Ground it: measure the failure, audit infra, verify hook docs first-hand - verify: journal `audit` + `subagent` rows
3. [x] Decide with the owner - verify: `D-sw-factory-1..11` recorded
4. [x] Mock the status display, measure it, owner picks - verify: B+C chosen, ladder's 83-col wrap found
5. [x] Write design-of-record + this brief - verify: both exist, decided items only
6. [ ] **PROVE a hook fires in a new session** - verify: `/tmp/hook-poc.log` non-empty. BLOCKS everything below
7. [ ] `tools/factory.mjs state` - derive the phase from artifacts - verify: prints `deciding` for a feature with rows but no brief; `building` for one with both
8. [ ] Fast-path classifier - verify: unit-checked against the 3 predicates + auto-escalation past 3 files
9. [ ] Path attribution from `## Owns` - verify: correctly separates `sw-factory` from `git-inside-track` in this shared tree
10. [ ] `## Owns` added to the work-brief shape, required at `building` - verify: skill updated, no duplication
11. [ ] Rail renderer at session start - verify: 2 lines, <=80 cols
12. [ ] Gate report on a misstep - verify: fires warn-only, names the missing artifact
13. [ ] Ladder as an on-demand command, **fixed to fit 80 cols** - verify: measured <=80
14. [ ] `recall` enforced as state 1 - verify: FSM refuses to leave `recall` without a citing row
15. [ ] Watch it warn-only across real work - verify: false-positive count recorded here
16. [ ] Owner reviews the noise, then decides whether to flip to blocking - verify: a new decision row

## Progress
- 2026-08-06 Measured the failure: 69% of briefs ship with their code; 385 commits analysed for thresholds.
- 2026-08-06 Found agent hooks CAN deny, which expires the 2026-08-03 red-team's premise. Verified against GitHub's docs directly, not via the subagent.
- 2026-08-06 Research: "dark software factory" has no verifiable implementations; vendors warn against frameworks at this scale.
- 2026-08-06 11 decisions ratified. Design-of-record + brief written.

## Open
- **Hook execution unproven in this environment.** No standalone `copilot`
  binary, so no isolated session can be spawned. A log-only probe at
  `~/.copilot/hooks/_poc-probe.json` did not fire mid-session - consistent with
  hooks loading at session start. Step 6 settles it. **Delete that probe once
  it has answered; it lives outside the repo and never shows in `git status`.**
- If hooks do not fire, fall back to `tools/factory.mjs` run by the agent -
  weaker, but the state derivation is unchanged.
- Whether the FSM should replace some advisory prose in
  `copilot-instructions.md` rather than adding to it - instruction files over
  ~200 lines measurably reduce adherence.
