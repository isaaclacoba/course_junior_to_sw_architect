---
name: update-skills
description: >-
  Turn a session learning or a repeated ad-hoc action into a persistent,
  reusable customization for THIS repo - and FIRST decide which kind. USE WHEN
  the user says "learn!", "distill/capture this", "make this reusable /
  repeatable", "create a tool", or "turn this into a skill / prompt /
  instruction / workflow"; or when you notice a recurring pattern, a non-obvious
  pitfall, or the same throwaway command typed over and over. It classifies the
  right primitive (learning / instruction / skill / tool / prompt / hook / custom
  agent), then creates it - delegating file mechanics to the built-in
  agent-customization skill.
---
<!-- Customize this skill and select save to override its behavior. Delete that copy to restore the built-in behavior. -->

# Capture reusable knowledge & tools

When something is worth keeping - a hard-won learning, a recurring pattern, a
non-obvious pitfall, an architectural constraint, or a command you have now
typed by hand three times - persist it so future sessions get it for free. The
first job is not "write it"; it is **decide which primitive fits**, so the user
does not have to specify.

## When to use

- The user says **"learn!"**, "distill this", "capture this", "make this
  reusable", "create a tool", or "turn this into a skill/prompt/instruction".
- You catch yourself re-deriving the same steps or re-writing a throwaway
  `/tmp/*.mjs` harness a second or third time.
- A correction from the user reveals a general principle worth preserving.
- You discover a pattern or constraint that cost meaningful debugging time.

## Step 0 - Classify: which primitive?

Match the *shape* of what you are capturing, not the topic. When more than one
fits, pick the lowest-ceremony row that fully holds it.

| If it is...                                                        | it is a...       | lives in                                                     | mechanics owned by      |
|-------------------------------------------------------------------|------------------|-------------------------------------------------------------|-------------------------|
| a short rule (1-4 sentences) refining existing guidance           | **learning**     | `.github/instructions/learnings.instructions.md`            | this skill              |
| an always-on convention or a file-pattern (`applyTo`) rule        | **instruction**  | `.github/instructions/<name>.instructions.md`              | this skill              |
| a multi-step procedure / domain playbook invoked by name          | **skill**        | `.github/skills/<name>/SKILL.md`                            | this skill              |
| a runnable script that automates repeated ad-hoc commands         | **tool**         | `tools/<name>.mjs` + a pointer from the owning skill/instr. | this skill (see below)  |
| a one-shot chat command a human types on demand                   | **prompt**       | `.github/prompts/<name>.prompt.md`                         | agent-customization     |
| deterministic enforcement at a tool/lifecycle event               | **hook**         | `.github/hooks/<name>.json`                                | agent-customization     |
| a context-isolated subagent or a tool-restricted stage            | **custom agent** | `.github/agents/<name>.agent.md`                           | agent-customization     |

**Changing the WoW is itself a line of work.** A one-off *learning* is a 2-line
append - just write it. But a NEW skill / instruction / tool, or a change that
spans several agent files, is a line of work like any other and takes a brief
(`docs/plans/<slug>.md`, the `work-brief` shape) BEFORE the edits - plus the
owner's pick on the shape, not just yours. This is easy to miss because
`work-brief` triggers read "feature / module / tool / refactor" and an agent-file
change does not obviously sound like one. It is one. Skipping it happened, was
caught by the owner, and is the reason this paragraph exists.

Three distinctions do most of the work:

- **Tool vs skill.** A tool is *code you run*; a skill is *a procedure the agent
  follows*. If the knowledge is "run X, then check Y" and X/Y are mechanical,
  write the **tool** and point a skill at it - do not narrate the steps in prose
  that will rot.
- **Prompt vs skill.** A prompt is *human-invoked* (`/name`, loads whole, no
  bundled assets, single shot). A skill is *agent-invoked* by description match,
  multi-step, can bundle assets, and loads sub-files on demand.
- **This repo prefers implicit over prompt.** If the goal is "this should always
  happen" (e.g. verification), do NOT make a prompt the user must remember to
  type. Bake it into the relevant skill/instruction recipe so it fires
  automatically. Reach for a prompt only when the user explicitly wants a typed,
  on-demand command.

For **prompt / hook / custom agent** mechanics (frontmatter, templates,
`applyTo`, anti-patterns), invoke the built-in **agent-customization** skill
rather than duplicating its templates here.

## The "tool" recipe (repo-specific)

When repeated ad-hoc commands become a script, follow the pattern that produced
`tools/verify-lesson.mjs`:

1. **Node built-ins only, zero deps.** Shell out to binaries the repo already
   needs (`dotnet`, `google-chrome`); do not add a package or a `package.json`
   script unless the user asks.
2. **Self-document in a header block** at the top of the file: its purpose, what
   it does per mode, every flag, and the exit-code contract. Exit non-zero on any
   failure so the tool doubles as a CI gate. The header - not a separate doc - is
   the tool's manual.
3. **Make it used by default, not on demand.** Add a one-line pointer as the
   FIRST step of the recipe that should use it (e.g. the "Verify" step of
   `lesson-authoring`, the "Verifying your work" section of
   `copilot-instructions.md`), and keep the manual steps beneath it as the
   explanation / fallback. Link, do not duplicate. Do NOT create a prompt for it.
4. **Carry the gotchas that bit us.** Prepend Node/dotnet to `PATH` before
   shelling out; if the tool runs its own HTTP server AND a child process, use
   async `spawn` (never `spawnSync`, which blocks the event loop and starves the
   server); never `kill $VAR` (shell-variable kills are blocked - close servers
   via the server object, kill children by numeric pid).

## Skill vs instruction vs learning (detail)

- **Learning** - the insight is small and refines an existing guideline. Append
  1-4 sentences to `learnings.instructions.md`. If it grows into a procedure,
  promote it to a skill and leave a pointer behind.
- **Skill** - substantial, multi-step, a distinct domain a future session should
  invoke by name. The `name` field MUST match the folder name exactly.
- **Instruction** - a convention or constraint that should apply automatically,
  globally or by `applyTo` glob. Keep `applyTo: '**'` rare - it loads every turn.

## Procedure

1. **Identify** the learning: the problem, the root cause, the correct approach,
   and whether it generalizes beyond this instance.
2. **Check for an existing home** before creating a file:

   ```
   ls .github/skills/ .github/instructions/ tools/ 2>/dev/null
   grep -rl "related-keyword" .github/skills .github/instructions
   ```

3. **Classify** with Step 0. If the answer is anything bigger than a learning -
   a new skill/instruction/tool, or edits across several agent files - write the
   brief and get the owner's pick on the SHAPE first. Show them the audit (what
   already covers this, and the gap) and the options, and let them choose; do not
   present your own classification as decided.
4. **Create or extend** the chosen primitive. Prefer extending an existing file
   over adding a near-duplicate, and prefer one canonical home plus pointers over
   restating the same rule in every file that touches it.
5. **Quality-check**: general enough to help future sessions, specific enough to
   act on, a concrete right-vs-wrong example where useful, no duplication, and a
   `description` clear enough that the agent knows WHEN to apply or invoke it.
6. **Inform the user**: what was captured, where, and why that primitive - and
   whether you extended existing content or created new.

Do not commit or push unless the user asks (pushing `master` deploys).
