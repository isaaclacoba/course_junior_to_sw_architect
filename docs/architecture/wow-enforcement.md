# WoW enforcement - design of record

Status: designed (owner decided, 2026-08-03). BUILD DEFERRED - owner chose
journal-first; the hook layer depends on the decision-log. See
[docs/architecture/decision-log.md](decision-log.md).
Brief: [docs/plans/wow-enforcement.md](../plans/wow-enforcement.md)

## Context & trigger
The design-round way-of-working is documented - golden rule 6 in
`copilot-instructions.md` and Phase 0 in the `work-brief` skill - but not
enforced. A skill only loads when its `description` probabilistically matches, so
an agent that does not recognize "new line of work" never sees Phase 0. The
instruction is every-turn but skimmable and delegates. Nothing routes a new line
of work to a design-first flow, and nothing gates code on a round having happened.

## Decided (owner, 2026-08-03)
- Build **all five** layers below.
- **Two agents**: `architect` (runs the round) + `auditor` (independent review).
- Hook gate is a **hard block**, not a warning.
- **Journal-first** sequencing: build the decision-log, then these layers.

## The five layers
1. **Instruction (always-on).** Rewrite golden rule 6 to be self-contained and
   imperative - the trigger (feature / module / tool / refactor / ambiguous >3-step
   task), the loop (ground -> ask batches, recommend but owner decides -> only then
   build), and the forbidden anti-pattern (presenting your own choices as decided).
   No longer a bare pointer to the skill.
2. **`architect` custom agent** (`.github/agents/architect.agent.md`). Its whole
   contract IS the round: ground (audit / PoC / subagent), ask batched decisions,
   show UX as a non-functional HTML mockup, record each decision to the journal,
   and hand off a brief + design-of-record. Tool-restricted: read / search / fetch
   / ask / create docs + mockups + journal writes - NOT bulk source edits.
3. **`auditor` custom agent** (`.github/agents/auditor.agent.md`). Independent
   review against the owner's bar: architecture quality, code quality, unit-test
   coverage, goal achievement. Read-only + writes a report. It never reviews a
   design it authored (independence).
4. **`work-brief` skill.** Broaden its `description` so it loads on
   feature/module/tool/refactor/ambiguous-task, not only ">3 steps".
5. **`/design-round` prompt** (`.github/prompts/design-round.prompt.md`).
   Owner-typed kickoff for a named feature. A complement, not the enforcement.
6. **Hook gate.** EXTEND the existing `tools/audit-gate.mjs` (reuse, do not add a
   parallel hook): when a staged diff introduces new feature code, HARD BLOCK
   unless the feature has `docs/plans/<slug>.md` + `docs/architecture/<slug>.md` +
   at least one journal `decision` row. The journal is the machine-checkable proof
   that a round happened.

## The coupling (why journal-first)
A design round is not lint-checkable in general. It becomes checkable only because
the decision-log emits evidence: a `feature` row + >=1 `decision` row + the linked
brief/design md. So layer 6 cannot exist until the journal does - hence the owner's
journal-first order. The journal's first back-filled entries are these very
decisions (dogfood).

## Success signal / KPI
- An agent handed a new line of work produces a brief + design + recorded decisions
  BEFORE any feature code - observable in the diff order.
- A bypass attempt (feature code, no round) is refused by the hook.
- The `auditor` produces an independent report an agent did not author.

## Unit tests
- Hook: a staged "new feature" diff with no brief/design/decision fails; the same
  diff with the trio passes; a non-feature diff (content/docs/test) is exempt.
- Agent/prompt/instruction files: lint their frontmatter (valid YAML, name matches
  folder for agents) via the existing gate.

## Open - proposed, awaiting owner ratification
1. **"Feature code" trigger for the hook.** Start conservative: a new
   `tools/*.mjs` or a new top-level module/dir (excluding `content/`, `docs/`,
   `test/`, generated). Tune from false positives. Precise glob = TBD.
2. **Agent tool allow-lists.** Exact allowed tool sets for `architect` (no bulk
   edits) and `auditor` (read-only + report) - drafted above, ratify the specifics.
3. **Hook home.** Extend `tools/audit-gate.mjs` (recommended, reuses `.githooks`)
   vs a new `.github/hooks/*.json` lifecycle hook.
