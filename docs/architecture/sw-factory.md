# The software factory - an FSM for the way we work

Status: built warn-only as `tools/factory.mjs`; hooks wired, delivery unconfirmed.
Ratified 2026-08-06, 22 decisions. Progress: `docs/plans/sw-factory.md`.
## The problem, measured

The way of working is written down and largely ignored. Not a feeling - of the 16
briefs in `docs/plans/`, **11 (69%) first appear in a commit that also ships
implementation code**; the worst shipped with 54 code files. Caveat: a brief
authored early but committed late looks identical to one written afterwards, so
this bounds the problem without proving intent.

The cause is not laziness. Every layer of the WoW is advisory: the instruction
files auto-load every turn but cannot stop anything; skills may simply not fire;
and an `.agent.md` is selected by the user or inferred by the model. **An agent
file is not "forced"** - which rules it out as a GATE, not as where a state's
knowledge lives (`D-22`). Nothing in the repo could ever say no.

## What changed, and what this is not

`docs/architecture/wow-enforcement.md` (2026-08-03) ran this round and concluded
enforcement was ceremony - on a premise that has expired. The only candidate then
was a **git** hook: opt-in, bypassable, firing long after the agent had gone the
wrong way. Two things are different now. Custom **agents can invoke each other**,
so a process can be a chain instead of a paragraph - that is the mechanism. And
**agent hooks** fire on the agent's own tool calls, which only surfaces it.

It is still not a framework. "Agentic pipeline" appears in marketing with **no
source code or case study behind it**, and the vendors argue the other way:
Anthropic warns frameworks "obscure the underlying prompts and responses", and
instruction files over ~200 lines **measurably reduce adherence**. Here, the state
machine is a text file and a chain of agents.

## Who runs each state

Each state is an agent of the same name in `.github/agents/`, because the states
carry different knowledge - `recall` knows the journal; `building` needs the
architecture map, SOLID and the exemplary-code standard, which the design states
never use (`D-22`). An `.agent.md` loads only when invoked, so an unused one costs
nothing; the context-rot argument above applies to always-on files only.
Two SPECIALISTS sit beside the ladder, called BY the states and never instead of
them: `architect` for a structural question from `deciding` or `specifying`, and
`auditor` for a SOLID / code-quality investigation from `verifying` or `building`.

**The agents ARE the enforcement.** Each state agent ends by invoking the next
one by name with the `agent` tool; that chain is the machine, and nothing else
holds the order. Entry is by two doors, because a hook cannot be relied on: the
human types `/factory`, or golden rule 7 - which auto-loads every turn - says to
derive the state and invoke its agent. `verifying` is terminal and hands back to
`building` on failure. `deciding` is the one link that waits for the owner.

## The ladder

Six states. Every transition derives from an artifact that already exists, so
the agent cannot advance by claiming to have advanced (`D-3`).

| State | Means | Exit evidence |
|---|---|---|
| `recall` | retrieve what was already decided | a journal row citing prior decisions found, or explicitly `none` |
| `grounding` | audit the real code, PoC, research | `audit` / `subagent` rows for the feature |
| `deciding` | batches of questions, owner answers | `D-<feature>-N` rows - **owner closes this one** |
| `specifying` | write it down | `docs/plans/<slug>.md` + `docs/architecture/<slug>.md` |
| `building` | implement to the design | commits to paths the brief owns |
| `verifying` | prove it | `npm run gate` / `verify-lesson` exit code |

`idle -> building` is not a legal transition; that single illegal edge is the whole
point (`D-4`). `recall` is state 1 because the failure it prevents happened *during
this design round* - the agent proposed blocking hooks without noticing
`D-wow-enforcement-6` had rejected exactly that (`D-10`, `D-11`). Only
`deciding -> specifying` needs a human (`D-9`).

**`untracked` is not a seventh state.** The first three rungs read the journal,
which no work predating it can satisfy; those features are listed in
`docs/journal/factory-config.json` and the machine claims *nothing* about them
(`D-18`). Not a waiver - `deriveRungs` has no waiver parameter. Backfilling was
refused: it forges the evidence the FSM demands (`D-15`). A feature opts back in
by being deleted from the list (`D-19`).

## Scope, and the fast-path

Every task enters the FSM (`D-6`), but entering is not walking the full ladder -
otherwise a typo needs a brief, the friction every git hook was deleted to escape.

A task **fast-paths straight to `building`** only when all three hold (`D-7`): it
creates no new file, touches 3 files or fewer, and touches nothing under
`.github/`, `kernel/`, `code-lab/` or `tools/`.

The thresholds are measured: across 385 commits the median touches 4 files, so
`<=3` (46%) deliberately sends the *typical* change down the full ladder.

**The anti-gaming rule is load-bearing.** Classification is continuous - the FSM
re-measures and escalates the moment a threshold is crossed, so the agent cannot
declare "trivial" and then write 40 files.

## Attribution

Two sessions share this tree and the `master` branch, so a tree-global FSM would
warn this agent for the other's edits, and a branch cannot tell them apart. Work
is attributed by **path** (`D-8`): journal rows carry `feature=`, the two `docs/`
files carry the slug, and from `building` on the brief declares its paths in
`## Owns`. Two consequences worth having: a file **no brief claims** cannot be attributed -
the drift being hunted, so it becomes the warning - and when **two briefs claim
one path**, both sessions get warned.

## Enforcement, and what it must never touch

**Agent hooks only. Never a git hook** (`D-2`) - the whole safety argument:

| | git hooks - what burned us | agent hooks - what this uses |
|---|---|---|
| live in | `.git/hooks/` | `.github/hooks/*.json` |
| fire on | the **owner's** commit / push | the **agent's** tool calls |
| can block | the owner's push | the agent's next edit |
| effect on owner | waiting, `--no-verify`, a broken deploy | **none** |

Nothing here may touch git, CI, a commit or a push. `SessionStart`, `PostToolUse`
and `Stop` are wired; `PreToolUse` deliberately is not - fail-closed, a broken one
denies tool calls account-wide (`D-21`).

**Warn-only first** (`D-1`). It produces the data we lack - does the FSM identify
the phase *correctly*? A wrong warning costs a line; a wrong denial strands the
agent. Sweeps are recorded to `docs/journal/factory/`, so it is measured (`D-17`).

## What the owner sees

Three shapes, mocked up and measured (`D-5`) - which caught what prose hid: the
ladder wrapped at 83 columns, since refitted. The rail names the agent for the
current state.

| Shape | Lines | Widest | When |
|---|---|---|---|
| rail | 3 | 70 | session start |
| gate report | 6 | 66 | only on a misstep |
| ladder | 8 | 65 | on demand |

## Risks

- **Hooks are a convenience, not the mechanism.** The AGENT CHAIN advances the
  machine; hooks only surface it. Ours has never been seen to fire, and the
  design does not depend on it - which is the point.
- **Timeouts are fail-open**, so the derivation stays fast - parquet and a few
  file paths, nothing more.
- **A gate that greps for a word is trivially gamed.** Every check reads
  artifacts, never the agent's prose.
- **Exit code 2 is BLOCKING.** `factory hook` exits 0 on every path (`D-1`).
- **The briefs themselves rot.** `wow-enforcement` shipped all 5 deliverables with
  0 of 5 steps ticked, so `building` under-reports. The tick reminder compares
  against `git show HEAD:` - not "was the file touched".
- **Context rot.** Golden rule 7 shrank from 11 lines to 10 when it became the
  FSM entry point. That is the only advisory prose replaced so far.
