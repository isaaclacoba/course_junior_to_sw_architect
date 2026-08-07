---
description: "Enter the way-of-working state machine for a line of work. Derives which of the six states you are actually in from artifacts on disk, then hands the job to that state's agent. Type this instead of describing what you want to build."
name: "Factory"
argument-hint: "the line of work - a feature, module, tool or refactor. Its slug if it already has one."
agent: "agent"
---
Line of work: **${input:topic}**

Do not start work. Do not write code, a brief, or a plan. Find out which state
this is in, then hand it to the agent that owns that state.

## 1. Ask the machine, do not guess

```bash
export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH"
node tools/factory.mjs ladder --feature <slug>
```

Guess the slug from the topic (kebab-case). If nothing exists under that name it
is new work, and new work starts at `recall` - rung 1, always.

Read the output. The `[>]` marks the rung you are on. That is not advisory; it is
derived from artifacts - journal rows, `docs/plans/`, `docs/architecture/`,
tick marks in the brief - so it cannot be talked out of.

If it says `untracked`, the machine declines to judge this feature (it predates
the journal). Say so and ask the owner how they want to proceed.

## 2. Hand it to that state's agent

Invoke the agent whose name matches the state, with the `agent` tool:

| State | Agent | It does |
|---|---|---|
| `recall` | `recall` | find what was already decided, so we do not re-decide it |
| `grounding` | `grounding` | make the options real - audit the code, run a PoC |
| `deciding` | `deciding` | put real options to the OWNER, in batches |
| `specifying` | `specifying` | write down only what was decided |
| `building` | `building` | implement to the design, nothing beyond it |
| `verifying` | `verifying` | prove it works, and prove the checks can fail |

Pass it the slug, the ladder output, and anything the owner just told you. It
starts in a fresh context and knows none of it otherwise.

Each agent hands off to the next when its rung clears. Your job ends here.

## 3. Whatever the state, the report has an Artifacts table

If the turn produced anything the owner can open - a mockup, a lesson page - the
report MUST carry the table, and it is derived rather than remembered:

```bash
node tools/factory.mjs artifacts --feature <slug>
```

It picks the port actually serving those paths and fetches every URL, so a link
that does not work is caught here and not by the owner. Full shape:
`.github/agents/factory-report.md`.

## What you may not do

- Do not skip to `building` because the task looks small. If it truly is small,
  `node tools/factory.mjs classify` says so and the fast path is legitimate -
  but the machine decides that, not you.
- Do not run a state's work yourself instead of invoking its agent. The agent
  carries rules this context does not have.
- Do not advance `deciding -> specifying`. Only the owner closes that one.
