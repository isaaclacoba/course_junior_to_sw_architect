# The software factory - an FSM for the way we work

Status: designed, not built. Ratified 2026-08-06 from 11 owner decisions
(`D-sw-factory-1..11`). Grounding: `node tools/journal.mjs feature sw-factory`.

## The problem, measured

The way of working is written down and largely ignored. That is not a feeling -
385 commits from the last six months were counted, and of the 16 briefs in
`docs/plans/`, **11 (69%) first appear in a commit that also ships
implementation code**. The brief was written alongside the work, or after it,
not before. The worst case shipped a brief together with 54 code files.

One caveat, stated so nobody over-reads the number: a brief authored early but
committed late looks identical to one written afterwards. The measurement bounds
the problem; it does not prove intent.

The cause is not laziness. Every layer of the current WoW is advisory. Per
GitHub's own documentation, `copilot-instructions.md`, `AGENTS.md` and
`*.instructions.md` auto-load every turn but cannot stop anything; skills are
matched by description and may simply not fire; and a custom `.agent.md` is
selected by the user or inferred by the model. **An agent file is not "forced".**
Nothing in the repo could ever say no.

## What changed since the last time we asked

`docs/architecture/wow-enforcement.md` (2026-08-03) ran this round already and
concluded enforcement was mostly ceremony. That conclusion rested on a premise
that has since expired: at the time, the only candidate was a **git** hook -
opt-in, bypassable with `--no-verify`, and firing long after the agent had
already gone the wrong way.

Copilot CLI now has **agent hooks**. They live at `.github/hooks/*.json`, are
committed to the repo, fire on the agent's own tool calls, and a `preToolUse`
command hook is **fail-closed**: a non-zero exit denies the call. That is a
genuinely different mechanism, and it is the only reason this round was worth
running rather than re-deciding.

Two things temper it. Command hook **timeouts are fail-open**, even for
`preToolUse` - so a gate must be fast or it silently lets everything through.
And hook execution has **not yet been proven in this environment** (see Risks).

## What this is not

Research into "agentic pipelines" and "dark software factories" found the term
in marketing and **no source code or production case study behind it**. The
vendors argue the other way: Anthropic warns that frameworks "create extra
layers of abstraction that can obscure the underlying prompts and responses" and
tempt complexity "when a simpler setup would suffice"; AutoGen says optimise a
single agent before reaching for a team; Claude Code's own docs note that
instruction files over ~200 lines **measurably reduce adherence**, which is an
argument against fixing this by writing more prose.

So this is not a graph framework, not an orchestrator, and not a multi-agent
pipeline. At one repo with one owner, the state machine is a text file.

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

`idle -> building` is not a legal transition. That single illegal edge is the
whole point of the machine (`D-4`).

`recall` is state 1 because the failure it prevents happened *during this very
design round*: the agent proposed blocking hooks without noticing that
`D-wow-enforcement-6` had already rejected exactly that, superseding
`D-wow-enforcement-3`. The memory was there; nothing made the agent read it
(`D-10`, `D-11`).

Only `deciding -> specifying` requires a human. If the agent judged its own
ambiguity to be near zero, it would judge that early - the documented
"agents gaming their own gates" failure (`D-9`).

## Scope, and the fast-path

Every task enters the FSM (`D-6`). Entering is not the same as walking the full
ladder - under blocking, "every task" would otherwise mean a typo needs a brief,
which is precisely the friction the owner deleted every git hook to escape.

A task **fast-paths straight to `building`** only when all three hold (`D-7`):

- it creates no new file,
- it touches 3 files or fewer,
- it touches nothing under `.github/`, `kernel/`, `code-lab/`, `tools/`.

The thresholds are measured, not invented. Across 385 commits the median touches
4 files; `<=3` covers 46%, `<=5` covers 64%, `<=10` covers 80%. The `<=3` cut
deliberately sends the *typical* change down the full ladder. WoW files and
shared machinery never fast-path.

**The anti-gaming rule is the load-bearing part.** Classification is continuous,
not a one-time declaration. The FSM re-measures on every edit and escalates the
moment a threshold is crossed. The agent cannot declare "trivial" and then write
40 files.

## Attribution

Two sessions share this working tree and the `master` branch. At design time
`sw-factory` was in `deciding` while another session's `git-inside-track` was in
`building`. A tree-global FSM would have warned this agent for the other
session's edits, and a branch cannot tell them apart.

So work is attributed by **path** (`D-8`). The early phases are self-attributing:
journal rows carry `feature=`, and `docs/plans/<slug>.md` and
`docs/architecture/<slug>.md` carry the slug in the filename. From `building`
onward the brief declares its paths in a new `## Owns` section - required only at
that point.

Two consequences worth having. A file **no brief claims** cannot be attributed,
and that is exactly the drift being hunted, so it becomes the warning. And when
**two briefs claim one path**, both sessions get warned - which would fire today.

## Enforcement, and what it must never touch

**Agent hooks only. Never a git hook** (`D-2`). The distinction is the whole
safety argument:

| | git hooks - what burned us | agent hooks - what this uses |
|---|---|---|
| live in | `.git/hooks/` | `.github/hooks/*.json` |
| fire on | the **owner's** commit / push | the **agent's** tool calls |
| can block | the owner's push | the agent's next edit |
| effect on owner | waiting, `--no-verify`, a broken deploy | **none** |

Nothing in this design may touch git, CI, a commit or a push. The owner's rule
stands untouched - QA happens between development, never in the way of a commit
or a push - and it is respected by staying away from git entirely.

**Warn-only first; blocking only after we have watched it** (`D-1`). This is
mockup-first applied to enforcement: warn-only is cheap and produces the data we
actually lack - does the FSM identify the phase *correctly*? A wrong warning
costs a line of text. A wrong denial strands the agent mid-task.

The accepted cost, stated plainly: an over-tight FSM stops the **agent**, who
must then say so, rather than letting it drift silently. That trade was made
deliberately.

## What the owner sees

Three shapes were built as a runnable mockup against real `sw-factory` state and
measured (`D-5`). Measuring caught a defect prose would have hidden: the full
ladder wraps at 83 characters in an 80-column terminal.

| Shape | Lines | Widest | Fits 80 | When |
|---|---|---|---|---|
| rail | 2 | 54 | yes | session start |
| gate report | 6 | 66 | yes | only on a misstep |
| ladder | 8 | **83** | **no - must be fixed** | on demand |

The rail orients, the gate report warns, the ladder is detail on request.

## Risks

- **Hook execution is unproven here.** There is no standalone `copilot` binary on
  this machine, so an isolated session cannot be spawned to test it. A log-only
  user-level probe did not fire mid-session, consistent with hooks loading at
  session start. **Nothing may be built on hooks until a new session proves one
  fires.** If they do not fire, the fallback is the same FSM as a `tools/`
  command the agent runs - weaker, but the state derivation is unaffected.
- **Timeouts are fail-open.** A slow gate is an absent gate, so the derivation
  must stay fast - it reads parquet and a few file paths, nothing more.
- **A gate that greps for a word is trivially gamed.** Every transition check
  must read artifacts, never the agent's prose.
- **Context rot.** Adding to `copilot-instructions.md` has a documented cost to
  adherence. The FSM should replace advisory prose, not pile on top of it.
