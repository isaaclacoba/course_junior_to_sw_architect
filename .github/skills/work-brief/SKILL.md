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
- NOT for one-shot edits, and NOT as a home for design rationale (link that).

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

## Guardrails
- No code dumps and no rationale essays in the brief - those blow the line budget
  and belong in the design doc or the code.
- One brief per task. Do not fork status across the brief, the todo list, and
  chat - the brief wins.
- Plain voice per `AGENTS.md`. No emojis. Spaced hyphen ` - `.
