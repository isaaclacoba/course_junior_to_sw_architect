# WoW support - design-round scaffolding
Status: reframed after red-team - ready to build (honest-small)  -  Design: [docs/architecture/wow-enforcement.md](../architecture/wow-enforcement.md)

## Goal
Make the mandatory design-round WoW easier and more reliable for cooperating agents, and
give the human one dependable trigger - not to mechanically force it (a red-team showed
that isn't achievable here without a CI/PR chokepoint the repo doesn't have).

## Approach
Honest-small: sharpen the always-on rule, ship a `/design-round` prompt (the human is the
reliable trigger), build `architect` + `auditor` as opt-in tools, and broaden the
`work-brief` skill's triggers. No hard-block hook, no auto-routing claims.

## Plan
1. [ ] Sharpen golden rule 6 in copilot-instructions.md (imperative, self-contained) - verify: reads as trigger+loop+anti-pattern, no external pointer needed.
2. [ ] `/design-round` prompt (.github/prompts/design-round.prompt.md) - verify: kicks off a round for a named feature.
3. [ ] Broaden the work-brief skill description triggers - verify: loads on feature/module/tool/refactor tasks.
4. [ ] `architect` agent (.github/agents/architect.agent.md), tool-restricted, records to journal - verify: valid frontmatter, no bulk edits.
5. [ ] `auditor` agent (.github/agents/auditor.agent.md), read-only + report, fresh-context - verify: valid frontmatter, produces an independent review.

## Progress
- 2026-08-03 Design round + independent red-team. Red-team showed the enforcement framing was mostly ceremony (no auto-routing here; opt-in/--no-verify-able/not-in-CI hook; forgeable proof; repeats the just-removed pre-push gate). Reframed to honest-small; dropped the hard-block hook; kept architect/auditor as opt-in tools. Journal: D-5/6/7 supersede D-1/3.

## Open
- Tool allow-lists for architect/auditor; prompt + agent frontmatter (agent-customization skill).
- Deferred: the real-teeth CI/PR path, until the repo has a PR chokepoint.
