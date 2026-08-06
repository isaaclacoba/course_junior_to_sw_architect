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
- `.github/hooks/*.json`, `.github/hooks/*.sh`
- `docs/journal/factory-config.json`, `docs/journal/factory/`
- `.github/skills/work-brief/SKILL.md`
- `.github/agents/*.agent.md`, `.github/prompts/factory.prompt.md`
- golden rule 7 in `.github/copilot-instructions.md`
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
11. [x] Rail renderer at session start - verify: measured 3 lines, 70 cols; names the state's agent and the ladder command, so a fresh session needs no prior knowledge; 2 sabotages (drop the line, name a non-state agent) both fail the selftest
12. [x] Gate report on a misstep - verify: exit 0 while warning; names `10 unticked plan step(s)`; silent on a clean changeset
13. [x] Ladder as an on-demand command, **fixed to fit 80 cols** - verify: measured 8 lines, 65 cols (mockup was 83)
14. [x] `recall` enforced as state 1 - verify: all later rungs met + no citing row still reads `recall`; 6 gaming attempts refused; sabotage makes the controls fail
15. [x] Watch it warn-only across real work - verify: `factory sweep`, 39 commits - see Findings
16. [x] Owner reviews the noise, then decides whether to flip to blocking - verify: `D-sw-factory-12` - stay warn-only, add an audit history
17. [x] Untracked list replaces the grandfather clause (`D-18`/`D-19`) - verify: 16 features report `untracked`; rail, gate and misstep all silent; 0 of 11 misreport (was 10 of 11); `git-inside-content`, created today, still reports `recall`
18. [x] Audit history in `docs/journal/factory/` (`D-17`) - verify: `sweep --record` then `history` reads the row back; 8 measures, render fits 80 cols
19. [x] Tick reminder (`D-20`) - verify: compares ticked steps against `HEAD`, warns with a real tick missing and goes silent when one is added; 6 `ok-` controls
20. [x] Hooks wired: `SessionStart` + `PostToolUse` + `Stop`, never `PreToolUse` (`D-16`/`D-21`) - verify: all three return valid JSON and exit 0 through the wrapper with no `node` on `PATH`; sabotaging `PreToolUse` and `stop_hook_active` both fail the selftest
21. [x] One agent per state + 2 specialists (`D-22`) - verify: 8 files with valid frontmatter, `name` matching the filename and a >60ch description; `architect` vs `deciding` description overlap cut from 10 shared words to 4; every description declares STATE or specialist
22. [x] Hook payload matched against the contract the CLI itself ships - verify: warnings moved off the undocumented `decision: "warn"` onto `systemMessage`; 4 assertions + an `ok-` control that no payload ever blocks or denies; both sabotages fail; 6 inputs incl. malformed all exit 0, never the blocking 2
23. [x] History dedupes - a Stop that measures nothing new writes nothing - verify: two identical Stops wrote 2 files before, 1 after; a dropped column now fails the selftest (it did not, because the test iterated the list it was checking)
24. [x] **The agent chain is the enforcement** - every state agent invokes the next by name with the `agent` tool - verify: 3 agents were missing the `agent` tool and could not have handed off; 24 assertions in `selftest`; 3 sabotages (skip a state, drop the tool, weaken the always-on rule) all fail the build
25. [x] Two entry doors, because a hook cannot be relied on - verify: `/factory` prompt derives the state and routes to its agent; golden rule 7 rewritten to say "invoke the agent named after that state" - 11 lines to 10, so the always-on budget shrank
26. [x] **Rung 1 reads the transcript, not the agent's own row** - verify: `docs/journal/activity/` was empty because the ETL had never once run; `feature --slug`/`search`/`show`/design-doc reads count, `record`/`decision` writes deliberately do not; 3 verdicts (`observed`/`absent`/`blind`), 24 assertions, 6 sabotages fail by name; on real transcripts sw-factory reads `observed: 106 read(s)`
27. [ ] Watch a real feature walk the chain end to end - verify: one line of work goes `recall` -> `verifying` with each handoff made by an agent, not by me

## Progress
- 2026-08-06 The owner was right and I was not. `npm run journal:etl` had **never run**: `resolveTranscripts` had no default while its sibling `resolveSessionStore` did, so it always threw. `activity/` held 0 files, and `factory.mjs` never referenced it - rung 1 was an agent grading its own homework. Both fixed; the ETL also only read the older flat `<id>.jsonl` layout, missing 560 of 693 transcripts (both sw-factory sessions among them).
- 2026-08-06 Measured a real false positive before trusting the new rung: an unbounded match credited `derive-goals` with 2 journal reads that were unrelated text in the same heredoc. Bounding the slug to within 100 non-backslash chars of the verb took derive-goals 2 -> 0 and sw-factory 108 -> 106.
- 2026-08-06 The mechanism was wrong and the owner said so: hooks are a convenience, the AGENT CHAIN is the enforcement. Agents can invoke agents, so the process is a chain, not a paragraph. Three state agents could not even hand off - they lacked the `agent` tool.
- 2026-08-06 My first chain sabotage passed because the sabotage itself was case-wrong (`invoke` vs `Invoke`) and so was the check. Both fixed; skipping a state now fails by name.
- 2026-08-06 My own history test was vacuous: it iterated `HISTORY_MEASURES` to check `HISTORY_MEASURES`, so deleting a column deleted its own coverage and the sabotage passed. Now derived from the stored schema instead.
- 2026-08-06 Found the CLI ships its own hook reference (`agent-customization/references/hooks.md`). It confirms `.github/hooks/*.json` is a real discovery location, and shows my warning field was invented: the contract documents `systemMessage`, `continue`, `stopReason` and a PostToolUse-only `decision: block`. The Stop warnings would most likely never have been shown.
- 2026-08-06 Rail made self-sufficient: it now names WHICH agent runs the current state, which is the only thing linking the derivation to the six agent files.
- 2026-08-06 Measured the failure: 69% of briefs ship with their code; 385 commits analysed for thresholds.
- 2026-08-06 Found agent hooks CAN deny, which expires the 2026-08-03 red-team's premise. Verified against GitHub's docs directly, not via the subagent.
- 2026-08-06 Research: "dark software factory" has no verifiable implementations; vendors warn against frameworks at this scale.
- 2026-08-06 11 decisions ratified. Design-of-record + brief written.
- 2026-08-06 Hooks DO fire here: `sessionStart` + `postToolUse` both logged. Repo-level `.github/hooks/` and fail-closed `preToolUse` stay unproven - unsafe to test while a second session is live.
- 2026-08-06 `tools/factory.mjs` built: state, classify, attribute, rail, gate, ladder, selftest. Warn-only, every command exits 0. `classify` 0.19s, `rail` 0.94s.
- 2026-08-06 Every pre-FSM feature reads `recall` - no old feature ever recorded one. A true reading, not a bug, and it is the backlog.
- 2026-08-06 Six state agents + `architect`/`auditor` rewritten as specialists. The context-rot argument was mine and it was wrong: it applies to always-on instruction files, not to `.agent.md`, which loads only when invoked.
- 2026-08-06 Step 14 is already implemented by the derivation (recall is rung 1, and prose alone does not satisfy it) but is left unticked for the owner to verify.

## Findings from the warn-only watch (step 15)
The derivation is right and the phase it reports is usually wrong - because the
journal is younger than the work. Both numbers matter to step 16.

- **10 of the 11 features with any ticked plan step read `recall`.** Only
  `sw-factory` reports its true phase. Every literal claim is accurate - those
  features really have no journal row - but as a phase report it is wrong, and
  under blocking all 10 would be frozen at rung 1.
- **Attribution cannot be judged yet: 1 of 17 briefs declares `## Owns`.** Over 39
  commits, 22 are wholly unclaimed and 34 partly. That measures a missing
  convention, not misattribution.
- **One confirmed false positive, from my own change.** A `## Owns` claim is
  retroactive, so claiming `work-brief/SKILL.md` made the 39-commit replay
  attribute `d0d4fbe` - which was `mockup-first-wow` work - to `sw-factory` too.
  `sweep` now prints the caveat instead of letting the count read as pure drift.
- Lane classification looks sane: 28% of 39 commits fast-path, against the
  design's measured 46% for `<=3 files` - lower because new files and guarded
  dirs also escalate. No commit was claimed by two briefs.
- **I did not backfill recall rows for the other 10 features.** Writing "recall
  done" on work I did not recall would forge the exact evidence the FSM exists to
  demand. That is the owner's call, and it is one row per feature.

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
