# WoW support - design-round scaffolding (not enforcement)

Status: design REFRAMED after an independent red-team (owner ratified, 2026-08-03).
Honest goal: make the design-round WoW EASIER and more RELIABLE for cooperating
agents, and give the human ONE dependable trigger - not to mechanically force it.
Brief: [docs/plans/wow-enforcement.md](../plans/wow-enforcement.md)

## Why the reframe (red-team)
The first design tried to ENFORCE the round with a hard-block hook + custom-agent
routing. An independent red-team (recorded in the journal, feature `wow-enforcement`,
D-5/6/7 supersede D-1/3) showed that is mostly ceremony:
- Custom-agent AUTO-routing does not exist on this platform - agents are manually
  selected; nothing auto-hands "new work" to an `architect`.
- The pre-commit hook is opt-in (`core.hooksPath`), `--no-verify`-able, and not in CI,
  so it constrains only already-cooperating agents. (Since 2026-08-03 it does not
  exist at all - the owner removed every hook so commits and pushes never block;
  QA rounds run between development. That only strengthens this point.)
- Its "proof" (a journal `decision` row) is one forgeable CLI call.
- A hard block repeats the friction the repo just removed with the pre-push gate (`42577c1`).
- 5 of the 6 layers only fire AFTER the agent already decided the work is "new" - the
  exact judgment we wanted to remove. No pre-code gate can force that classification.

Real enforcement would need a CI/PR chokepoint (the repo deploys straight from `master`,
none exists) + owner-attributable proof. Deferred until a PR gate exists (see Future).

## What we build (honest-small)
1. **Sharpen the design-round golden rule** (always-on, `copilot-instructions.md`) into a self-contained
   imperative: the trigger (feature / module / tool / refactor / ambiguous >3-step task),
   the loop (ground -> ask batches, recommend but the OWNER decides -> only then build),
   and the forbidden anti-pattern (your choices presented as decided). Framed honestly as
   a reliable prompt for cooperating agents, not a gate.
2. **`/design-round` prompt** (`.github/prompts/design-round.prompt.md`) - the ONE
   dependable trigger, because the HUMAN decides "this is new work" and types it. Kicks off
   the round for a named feature: ground -> batched decisions -> brief + design-of-record +
   journal decisions.
3. **`architect` agent** (`.github/agents/architect.agent.md`) - an OPT-IN tool the human
   or orchestrator invokes to run a round: read / search / ask / create-docs, records
   decisions to the journal, hands off a brief + design-of-record. Tool-restricted (no bulk
   source edits). Not auto-routed, not a gate.
4. **`auditor` agent** (`.github/agents/auditor.agent.md`) - an OPT-IN independent reviewer:
   read-only + report, run in a FRESH context seeded ONLY with the design-of-record + the
   owner's bar (architecture quality, code quality, test coverage, goal fit), never the
   authoring transcript. Fresh-context seeding is the only real independence available.
5. **Broaden the `work-brief` skill** description triggers so Phase 0 loads on
   feature / module / tool / refactor / ambiguous tasks, not only ">3 steps".

## Dropped (with reason)
- The hard-block hook (old layer 6) - theater; see red-team.
- The "auto-routing / strongest lever / enforcement" framing for the agents.

## Success signal (honest)
- A cooperating agent handed new work reliably runs the round (brief + design + journal
  decisions appear before code) - because the instruction + skill make it the path of least
  resistance, not because a gate forces it.
- The human has a one-command way (`/design-round`) to force a round regardless of agent judgment.
- Any design can get an independent auditor pass in a fresh context.
We do NOT claim a lazy or mis-classifying agent is stopped - that needs the CI/PR path below.

## Future - the real-teeth path (deferred)
If/when the repo grows a PR chokepoint (stops deploying straight from `master`): a CI check
that fails a PR whose diff is feature-shaped but carries no design-of-record + an
owner-attributable decision (a signal the agent cannot author alone).

## Build order
1 sharpen the design-round golden rule. 2 `/design-round` prompt. 3 `work-brief` triggers. 4 `architect`
agent. 5 `auditor` agent. Each verified: renders/loads; agents have valid frontmatter,
tool restrictions, and `name` matching the folder.

## Open (build-time)
- Exact tool allow-lists for `architect` (no bulk edits) / `auditor` (read-only).
- Prompt + agent frontmatter per the `agent-customization` skill.
