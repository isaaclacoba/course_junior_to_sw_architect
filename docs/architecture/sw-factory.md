# The software factory - an FSM for the way we work

Status: built warn-only as `tools/factory.mjs`; hooks wired, delivery unconfirmed.
Ratified 2026-08-06 from 11 owner decisions. Progress: `docs/plans/sw-factory.md`.

## The problem, measured

The way of working is written down and largely ignored. Not a feeling - across
385 commits, of the 16 briefs in `docs/plans/`, **11 (69%) first appear in a
commit that also ships implementation code**; the worst shipped with 54 code
files. Caveat: a brief authored early but committed late looks identical to one
written afterwards, so this bounds the problem without proving intent.

The cause is not laziness. Every layer of the WoW is advisory:
`copilot-instructions.md`, `AGENTS.md` and `*.instructions.md` auto-load every
turn but cannot stop anything; skills may simply not fire; and an `.agent.md` is
selected by the user or inferred by the model. **An agent file is not "forced"** -
which rules it out as a GATE, not as where a state's knowledge lives (`D-22`).
Nothing in the repo could ever say no.

## What changed since the last time we asked

`docs/architecture/wow-enforcement.md` (2026-08-03) ran this round and concluded
enforcement was mostly ceremony. That rested on a premise which has expired: the
only candidate then was a **git** hook - opt-in, bypassable with `--no-verify`,
firing long after the agent had already gone the wrong way.

Copilot CLI now has **agent hooks**: committed at `.github/hooks/*.json`, firing
on the agent's own tool calls, and `preToolUse` is **fail-closed**. That is a
different mechanism, and the only reason this round was worth running. Two
things temper it - timeouts are **fail-open**, so a slow gate is an absent one;
and delivery is not yet proven here (see Risks).

## What this is not

Research into "agentic pipelines" found the term in marketing with **no source
code or production case study behind it**. The vendors argue the other way:
Anthropic warns that frameworks "obscure the underlying prompts and responses";
AutoGen says optimise a single agent before reaching for a team; Claude Code
notes instruction files over ~200 lines **measurably reduce adherence** - an
argument against fixing this by writing more always-on prose.

So this is not a graph framework, not an orchestrator, and not a multi-agent
pipeline. At one repo with one owner, the state machine is a text file.

## Who runs each state

Each state is an agent in `.github/agents/`, because the states carry genuinely
different knowledge - `recall` knows the journal; `building` needs the
architecture map, SOLID and the exemplary-code standard, which the design states
never use. One combined agent would carry five irrelevant rule sets every
invocation (`D-22`). An `.agent.md` loads only when invoked, so an unused one
costs nothing; the context-rot argument above applies to always-on files only.

Two SPECIALISTS sit beside the ladder, called BY the states and never instead of
them: `architect` for a structural question from `deciding` or `specifying`, and
`auditor` for a SOLID / code-quality investigation from `verifying` or `building`.

## The ladder

Six states. Every transition derives from an artifact that already exists, so
the agent cannot advance by claiming to have advanced (`D-3`).

| State | Means | Exit evidence | Agent |
|---|---|---|---|
| `recall` | retrieve what was already decided | a journal row citing prior decisions found, or explicitly `none` | `recall` |
| `grounding` | audit the real code, PoC, research | `audit` / `subagent` rows for the feature | `grounding` |
| `deciding` | batches of questions, owner answers | `D-<feature>-N` rows - **owner closes this one** | `deciding` |
| `specifying` | write it down | `docs/plans/<slug>.md` + `docs/architecture/<slug>.md` | `specifying` |
| `building` | implement to the design | commits to paths the brief owns | `building` |
| `verifying` | prove it | `npm run gate` / `verify-lesson` exit code | `verifying` |

`idle -> building` is not a legal transition. That single illegal edge is the
whole point of the machine (`D-4`).

`recall` is state 1 because the failure it prevents happened *during this design
round*: the agent proposed blocking hooks without noticing `D-wow-enforcement-6`
had already rejected exactly that (`D-10`, `D-11`). Only `deciding -> specifying`
requires a human - an agent judging its own ambiguity judges it near zero (`D-9`).

**`untracked` is not a seventh state.** The first three rungs are read from the
journal, which no work predating it can satisfy; those features are listed in
`docs/journal/factory-config.json` and the machine reports `untracked` and
claims *nothing* (`D-18`). It is not a waiver - `deriveRungs` has no waiver
parameter, so no rung can be marked satisfied. Backfilling was refused: it would
forge the evidence the FSM exists to demand (`D-15`). A feature opts back in by
being deleted from that list (`D-19`).

## Scope, and the fast-path

Every task enters the FSM (`D-6`), but entering is not walking the full ladder -
otherwise a typo needs a brief, the friction every git hook was deleted to escape.

A task **fast-paths straight to `building`** only when all three hold (`D-7`):

- it creates no new file,
- it touches 3 files or fewer,
- it touches nothing under `.github/`, `kernel/`, `code-lab/`, `tools/`.

The thresholds are measured: across 385 commits the median touches 4 files, so
`<=3` (46%) deliberately sends the *typical* change down the full ladder.

**The anti-gaming rule is load-bearing.** Classification is continuous, not a
one-time declaration - the FSM re-measures on every edit and escalates the moment
a threshold is crossed. The agent cannot declare "trivial" and then write 40 files.

## Attribution

Two sessions share this tree and the `master` branch, so a tree-global FSM would
warn this agent for the other session's edits, and a branch cannot tell them apart.

Work is attributed by **path** (`D-8`). The early phases self-attribute: journal
rows carry `feature=`, and the two `docs/` files carry the slug in the filename.
From `building` onward the brief declares its paths in `## Owns`.

Two consequences worth having: a file **no brief claims** cannot be attributed -
exactly the drift being hunted, so it becomes the warning - and when **two briefs
claim one path**, both sessions get warned.

## Enforcement, and what it must never touch

**Agent hooks only. Never a git hook** (`D-2`). The distinction is the whole
safety argument:

| | git hooks - what burned us | agent hooks - what this uses |
|---|---|---|
| live in | `.git/hooks/` | `.github/hooks/*.json` |
| fire on | the **owner's** commit / push | the **agent's** tool calls |
| can block | the owner's push | the agent's next edit |
| effect on owner | waiting, `--no-verify`, a broken deploy | **none** |

Nothing here may touch git, CI, a commit or a push. `SessionStart`, `PostToolUse`
and `Stop` are wired; `PreToolUse` deliberately is not - fail-closed, a broken one
denies tool calls account-wide (`D-21`).

**Warn-only first; blocking only after we have watched it** (`D-1`). Warn-only
produces the data we lack - does the FSM identify the phase *correctly*? A wrong
warning costs a line of text; a wrong denial strands the agent mid-task. Each
sweep is recorded to `docs/journal/factory/`, so the answer is measured over time
rather than argued (`D-17`).

## What the owner sees

Three shapes, mocked up against real state and measured (`D-5`) - which caught
what prose hid: the ladder wrapped at 83 columns, since refitted.

| Shape | Lines | Widest | When |
|---|---|---|---|
| rail | 2 | 61 | session start |
| gate report | 6 | 66 | only on a misstep |
| ladder | 8 | 65 | on demand |

## Risks

- **Hooks fire; repo-level discovery is unproven.** A probe logged `sessionStart`
  and `postToolUse`, so hooks load at session start; `.github/hooks/` discovery is
  wired but unconfirmed. Until then the FSM is a command the agent runs.
- **Timeouts are fail-open**, so the derivation must stay fast - it reads parquet
  and a few file paths, nothing more.
- **A gate that greps for a word is trivially gamed.** Every check reads
  artifacts, never the agent's prose.
- **The briefs themselves rot.** `wow-enforcement` shipped all 5 deliverables with
  0 of 5 steps ticked, so `building` under-reports. The `Stop` hook reminds the
  agent to tick, comparing against `git show HEAD:<brief>` - not "was it touched".
- **Context rot.** The FSM should replace advisory prose, not pile on top of it.
