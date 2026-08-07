# The factory report - every FSM state, every turn, same shape

Not a template to adapt. The shape is fixed so the owner can read six different
states the same way and never hunt for where he is.

## Why this exists

An agent reported a phase as a wall of detail about what it had built, with no
plan and no position. The owner could not tell finished work from scaffolding,
was asked a question whose context he did not have, answered it the only way the
question allowed, and an hour went into re-designing something the repo already
had. The report was the defect. Long is not thorough - it is unreadable.

## The five blocks

In this order. Every turn. Nothing outside them.

```
**Plan** - <slug>
Phase 1 <name>  [x] done
Phase 2 <name>  [>] step 14 of 14-17   <- you are here
  13. [~] STRUCK - already built, see <where>
  14. [>] <the step, verbatim from the brief>  <- doing now
  15. [ ] <the step, verbatim>
  16. [ ] <the step, verbatim>
  17. [ ] <the step, verbatim>
Phase 3 <name>  [ ]
Phase 4 <name>  [ ]

**Artifacts**                        (whenever there is one - see below)
| What   | Where                                    | Serving |
| mockup | http://localhost:8099/_mockup-x.html     | 200     |
| lesson | http://localhost:8099/content/.../07-x/  | 200     |
| brief  | docs/plans/<slug>.md                     | -       |

**Done this turn**
- <what changed, not how>            (max 5 bullets, one line each)

**Next**
<the single next step, named, with the verify that will prove it>

**Needs you**
<nothing | the one thing that is genuinely blocked>
```

Rules that make it work:

- **Always print the WHOLE plan**, every phase, every turn - including phases
  long finished. "The remaining steps" is not the plan; the owner is tracking a
  whole, not a window onto it.
- **The ACTIVE phase expands to its numbered steps**, verbatim from the brief,
  each with its own `[x]` / `[>]` / `[ ]` / `[~]`. A phase name alone does not
  say what is happening - "Phase 2 the lab archetype" could be anything, and the
  owner cannot judge a step he cannot see. Finished and future phases stay
  collapsed to one line each.
- **Exactly one `<- you are here`**, on the phase line, and one `<- doing now`
  on the step.
- **Done-this-turn is capped at 5 bullets.** More than five means it belongs in
  the commit message, not the report.
- **Say what a thing IS before what it does.** "VizLab - the editor+compiler
  wrapper around MemoryViz" costs six words and prevents the wrong answer.
- Verdicts bolded (**Yes** / **No** / **Zero**). No emojis, no filler.
- Detail lives in the brief, the commit and the code. The report LINKS; it does
  not inline.

## Artifacts - the block you do not get to skip

**If the turn produced anything the owner can OPEN, the Artifacts table is
mandatory, and you do not write it from memory. You run:**

```bash
node tools/factory.mjs artifacts --feature <slug>
```

It finds the mockups, the lesson directories the feature touched, and the brief
and design doc; it works out which local port is actually serving THEM; and it
fetches every URL and prints what came back. Paste the rows. If it prints
`no artifacts`, omit the block.

Two rules, both of which cost the owner an hour before they were written down:

1. **Never hand over a link you have not proved.** A mockup was once reported as
   built and the owner could not find it; when he was finally given a URL it
   404'd. Every row carries a status for that reason. A row that is not `200`
   is not a link - fix it, or say plainly that it does not work yet.
2. **Never say "the mockup is ready" without the URL in the same message.** An
   artifact the owner cannot reach in one click has not been delivered, and
   "it is on the local server" is not a location.

The tool answers only for what it can see. It does not know whether the page is
CORRECT - that is the owner's job, and it is exactly why he needs the link.

## The plan does not change

The Plan in `docs/plans/<slug>.md` is fixed end to end, and the owner is
entitled to see the same plan in the same order every single turn.

If reality contradicts a step - it is already built, it is impossible, it is in
the wrong order - **stop and say so**. Name the step, say what you found, and
let the owner rule. Never silently re-order, merge, split, renumber or drop a
step. A plan that quietly reshapes itself is a plan the owner cannot track, and
he will find out only when the thing he expected is missing.

Struck steps stay visible, struck: `13. [~] STRUCK - already built, see X`.

## Asking the owner

A question costs the owner more than the work it saves, and a question asked
from inside your context gets answered from outside it.

1. **Answer it from the code first.** "I checked `memory-viz.ts`; it renders a
   `Step[]` and does not care where they came from" ends the question.
2. **Never ask what the plan already answers.**
3. **State the facts before the question.** If the answer depends on something
   the owner cannot see from where he sits, you have built a trap - and the
   wrong answer is yours, not his.
4. **One question.** Not a menu of four options, three of which you already
   know are wrong.
5. **Do not ask permission to continue.** The plan is the permission. Ask only
   when genuinely blocked or when the plan itself is contradicted.
