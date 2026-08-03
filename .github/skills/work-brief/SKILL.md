---
name: work-brief
description: >-
  Create and maintain a "work brief" - one skimmable file that is BOTH the
  owner's readable status page and the agent's step tracker for a non-trivial
  task. USE FOR: starting a multi-step piece of work; giving the owner a
  <=100-line "what are we doing" view; tracking progress with checkable steps +
  a dated log; keeping a plan in sync across turns/sessions. DO NOT USE FOR:
  trivial one-step tasks (just do them); deep architecture/design rationale
  (write a design-of-record in docs/architecture/ and LINK it from the brief).
---

# Work brief - plan + readable status in one file

A work brief is one Markdown file per task that serves two readers at once: the
owner skims Goal / Approach / Progress to see what is happening; the agent tracks
the numbered Plan steps and their verify gates. It is deliberately SHORT - detail
lives in linked docs, not here.

## When to use
- Any task with more than ~3 steps, or that spans multiple turns or sessions.
- Whenever the owner wants to follow along without reading code.
- A NEW line of work triggers the design round below, WITH the owner, before any
  brief: a new feature/module/tool, a multi-hundred-line refactor, pulling scattered
  logic into a module, or any task >3 steps or whose steps are not yet well-defined.
  Rule of thumb: the more ambiguous, the more design.
- NOT for one-shot edits, and NOT as a home for design rationale (link that).

## Phase 0 - the design round (mandatory for a NEW line of work)

A new line of work does NOT start with a brief - it starts with a DESIGN ROUND run
WITH the owner. The single most important rule in this skill: the design phase is
never fully automated. You surface every decision and every ambiguity; the owner
decides. Never present your own choices as settled - an ambiguity is a question.

The loop (repeat until ambiguity is near zero):
1. **Ground it.** Audit the real codebase, run a PoC, or spawn an `architect`
   subagent, so options are grounded in what exists - not invented.
2. **Ask a batch of 5-10 questions** - each an explicit choice; RECOMMEND with the
   tradeoff, the owner DECIDES. Do NOT dump everything at once: overloading the
   owner is a way to sneak a bad design through, and it shows later (a bad design
   lands under ~50% of the goal, a tight one over ~80%).
3. **Learn more** (another PoC / grounding audit), then loop with the next batch.

Definition of done for the design (track it in the brief): long-term goal,
short-term goals, UX, UI, a success signal / KPI, and unit-test coverage.

- **UI/UX is shown as a non-functional HTML mockup** - layout, colour palette,
  visuals, UX interactions. Never a text description; the owner cannot approve text.
- **Fleeted subagents read the brief + design-of-record FIRST**, so they build the
  agreed design, not their own.
- **Record decisions** in a searchable, compact log (for later archaeology; the log
  mechanism is its own small design).

Only once ambiguity is near zero do you write the brief + design-of-record from the
DECIDED items, then build.

Anti-pattern (forbidden): ask a couple of questions, then extrapolate the rest of
the architecture and record it as "Locked". A few answers never license a full
design.

## Where it lives
`docs/plans/<task-slug>.md` - one brief per task. Deep design, if any, goes in
`docs/architecture/<task>.md` and is linked from the brief header.

## The shape (every brief uses these headings)

```
# <task title>
Status: <not started | in progress | blocked | done>  -  Design: <link or "none">

## Goal
<2-3 lines: what we are doing and why it matters.>

## Approach
<3-6 lines: the strategy in plain words. No code.>

## Plan
1. [ ] <step, one line> - verify: <the pass/fail check>
2. [x] <done step> - verify: <what proved it>

## Progress
- <YYYY-MM-DD> <one-line milestone / decision / result>

## Open
- <decision or question needing the owner>   (omit this section if none)
```

## The length rule (the point of this skill)
- Target ~100 lines. **Warn** yourself at 100; **hard stop at 150**. Past that,
  you are inlining detail that belongs in a linked doc - move it out.
- Keep it skimmable: one line per Plan step, one line per Progress entry. Link,
  do not paste. Prune stale or obvious Progress lines rather than letting them
  pile up.

## The tracking mechanism
- The **Plan** steps are the source of truth for "what is left". Mirror them into
  `manage_todo_list` for live in-session status; the brief is the durable copy.
- Mark a step `[x]` only when its **verify** gate has actually passed. Append a
  one-line **Progress** entry (real date from the `date` command) at each
  milestone.
- Start every work session by re-reading the brief; update Status + Plan +
  Progress before ending the turn. Keep the todo list and the brief in agreement.

## Relationship to a design-of-record
A brief is the "where are we"; a design-of-record (e.g.
`docs/architecture/concept-i18n.md`) is the "what/why + contracts". Big efforts
have both, linked. Small efforts have only a brief. Never duplicate the design
into the brief - link it.

Two hard rules when the brief links a design-of-record:
- **It must exist.** Never link a `docs/architecture/<task>.md` that has not been
  written - a dangling link is a bug. Create the file (at least its headings) in
  the SAME turn you add the link.
- **It stays under 100 lines.** The design doc holds contracts, not essays - the
  same skimmable discipline as the brief (warn at 100, hard stop at 150). Past
  that, split it or push detail into the code.

## Guardrails
- No code dumps and no rationale essays in the brief - those blow the line budget
  and belong in the design doc or the code.
- One brief per task. Do not fork status across the brief, the todo list, and
  chat - the brief wins.
- Plain voice per `AGENTS.md`. No emojis. Spaced hyphen ` - `.
