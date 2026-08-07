# The factory report - every FSM state, every turn, same shape

Not a template to adapt. The shape is fixed so the owner can read six different
states the same way and never hunt for where he is.

## Why this exists

An agent reported a phase as a wall of detail about what it had built, with no
plan and no position. The owner could not tell finished work from scaffolding,
was asked a question whose context he did not have, answered it the only way the
question allowed, and an hour went into re-designing something the repo already
had. The report was the defect. Long is not thorough - it is unreadable.

## The four blocks

In this order. Every turn. Nothing outside them.

```
**Plan** - <slug>
Phase 1 <name>  [x] done
Phase 2 <name>  [>] step 14 of 17   <- you are here
Phase 3 <name>  [ ]
Phase 4 <name>  [ ]

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
- **Exactly one `<- you are here`.**
- **Done-this-turn is capped at 5 bullets.** More than five means it belongs in
  the commit message, not the report.
- **Say what a thing IS before what it does.** "VizLab - the editor+compiler
  wrapper around MemoryViz" costs six words and prevents the wrong answer.
- Verdicts bolded (**Yes** / **No** / **Zero**). No emojis, no filler.
- Detail lives in the brief, the commit and the code. The report LINKS; it does
  not inline.

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
