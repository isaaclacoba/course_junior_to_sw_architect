---
description: "DEPRECATED - use /factory instead, which derives which state the work is actually in rather than assuming it needs a design round. Kept because a design round is still the right thing when you already know the work is new and undesigned; it enters the state machine at `grounding`."
name: "Design round"
argument-hint: "the feature / module / tool / refactor to design, e.g. add a settings page"
agent: "agent"
---

You have been handed a new line of work: **${input:topic}**.

> Prefer `/factory`. It asks `tools/factory.mjs` which of the six states this work
> is actually in and hands it to that state's agent, instead of assuming a design
> round is what is needed. Use this prompt only when you already know the work is
> new and undesigned - it is the same thing, entered at `grounding`.

The human typed `/design-round` to declare this is new work and to start a design
round WITH them - Phase 0 of the [`work-brief`](../skills/work-brief/SKILL.md) skill.
Do NOT jump to a brief or to code. Run the Phase 0 loop; the fuller machinery is the
[`architect`](../agents/architect.agent.md) agent - lean on it, do not re-explain it.

Run the loop until ambiguity is near zero:

1. **Ground first.** Audit the real codebase, run a small PoC, or spawn an
   `architect` subagent - so options come from what exists, not from invention.
2. **Ask a batch of 5-10 explicit decisions.** Each is a real choice: RECOMMEND
   with the tradeoff, the OWNER decides. Never present your choices as settled - an
   ambiguity is a question. Do not dump everything at once.
3. **Show every option as a mockup, then MEASURE it** - the
   [`mockup-first`](../skills/mockup-first/SKILL.md) skill has the procedure.
   Never a text description; the owner cannot approve text.
4. **Learn more** (another PoC or grounding audit), then loop with the next batch.
5. **Record each decision** to the journal as it lands:
   `node tools/journal.mjs decision --feature <slug> --question "..." --options "a|b|c" --chosen "..." --why "..."`.
6. **Optional red-team.** Before finalizing, spawn an independent reviewer in a FRESH
   context, seeded only with the design-of-record + the owner's bar - not this transcript.

Design done = long-term goal, short-term goals, UX, UI, a success signal / KPI, and
unit-test coverage are all decided. ONLY THEN write the brief
(`docs/plans/<slug>.md`) and, if the effort is large, the design-of-record
(`docs/architecture/<slug>.md`) from the DECIDED items - then build.

Forbidden: ask a couple of questions, extrapolate the rest, and record it as "Locked".
A few answers never license a full design.
