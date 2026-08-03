# WoW enforcement
Status: designed - build deferred (journal-first)  -  Design: [docs/architecture/wow-enforcement.md](../architecture/wow-enforcement.md)

## Goal
Make the design-round way-of-working something agents reliably FOLLOW, not just a
documented rule they can skim past. Today it lives in one skill (loads
probabilistically) and one golden rule (a skimmable pointer); nothing routes a new
line of work through it or gates code on it.

## Approach
Five layers, from cheapest reach to strongest guarantee: an imperative always-on
instruction; an `architect` agent whose whole contract is the round; an
independent `auditor` agent; broader `work-brief` skill triggers; a `/design-round`
prompt; and a hard-block hook (an extension of `tools/audit-gate.mjs`) that refuses
new feature code lacking a brief + design + recorded decision. The hook needs the
decision-log to exist, so it lands last.

## Plan
1. [ ] Build the decision-log journal first - blocks layer 6. See its brief.
2. [ ] Sharpen golden rule 6 into a self-contained imperative rule - verify: reads as trigger+loop+anti-pattern with no external pointer needed.
3. [ ] Add `architect` agent (`.github/agents/architect.agent.md`), tool-restricted - verify: spawns, refuses bulk source edits, runs the round.
4. [ ] Add `auditor` agent (`.github/agents/auditor.agent.md`), read-only + report - verify: produces a review against the owner's bar.
5. [ ] Broaden `work-brief` skill `description` triggers - verify: loads on feature/module/tool/refactor tasks.
6. [ ] Add `/design-round` prompt - verify: kicks off a round for a named feature.
7. [ ] Extend `audit-gate.mjs` hard-block gate - verify: new-feature diff without the trio fails; with it passes; non-feature diff exempt.

## Progress
- 2026-08-03 Design round done: all 5 layers, two agents (architect+auditor), hard block, journal-first. Recorded in the design-of-record.

## Open
- "Feature code" trigger heuristic for the hook (start with new `tools/*.mjs` + new top-level dirs).
- Exact tool allow-lists for `architect` / `auditor`.
- Hook home: extend `audit-gate.mjs` vs a new `.github/hooks/*.json`.
