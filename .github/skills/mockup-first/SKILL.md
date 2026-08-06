---
name: mockup-first
description: >-
  Validate a concept with a small, disposable mockup BEFORE paying the
  architectural cost - once per phase, not once per project. USE FOR: starting
  any phase of a line of work (design, engine/widget, content, tooling, a data
  contract); deciding a layout, an output format, a widget's behaviour or an API
  seam; any moment you are about to write a design-of-record, an interface, or a
  plugin and the owner has not yet SEEN the thing; a decision being argued in
  prose that could be settled by measuring. DO NOT USE FOR: a one-step edit; a
  phase whose concept is already proven by a shipped, working example; writing
  the lesson content itself (use lesson-authoring); the full owner design round
  procedure (that is work-brief Phase 0, which calls this skill).
---

# Mockup first - validate the concept before you buy the architecture

The owner cannot approve prose. Neither can you: a design that reads fine and was
never seen is ambiguous, and ambiguity is what lets an implementation drift from
its design. A mockup collapses that ambiguity for almost no cost.

The order is always the same, and it is the whole point:

**mockup -> validate the concept -> agree the architecture -> implement.**

Architecture is DERIVED from a validated concept. Never the reverse. If you are
writing contracts for something nobody has looked at yet, stop and mock it.

## Once per PHASE, not once per project

This is the rule that is easy to get wrong. A design round produces one mockup
and people treat the question as closed forever. It is not. **Every phase that
introduces something the owner has not seen gets its own small mockup**, and the
mockup is sized to that phase - not to the project.

Cheap now beats correct later: a 100-line throwaway that gets a "no" has saved
the phase. A phase that ships architecture first and shows it afterwards has
already spent the money.

| Phase kind | The mockup is... | It answers |
|---|---|---|
| Design (Phase 0) | an HTML page, real chrome, real widget, 2-4 labelled options | which shape do we build |
| Engine / widget | a probe page driving the REAL seam by hand | does this seam exist and behave |
| A new visual surface | the surface rendered with hardcoded data | does it read, at real width |
| Content / lesson | ONE card authored fully, before the other thirty | is this shape worth repeating |
| Tooling | a hand-written sample of the tool's OUTPUT | is this the report we want |
| Data shape / contract | a literal fed through the real renderer | does this shape carry what we need |

## What makes a mockup worth the name

- **Disposable and untracked.** It is thrown away when the phase closes. Name it
  `_mockup-*.html` at the repo root (git-ignored) or put it in `/tmp`. It never
  becomes the implementation, and it is never committed.
- **Real chrome, real assets, real data - wherever they already exist.** Load the
  actual `styles.css` and the actual vendored widget. A hand-drawn box lies, and
  an approval based on a lie is worse than no approval. This is the single
  highest-value rule here.
- **Non-functional is fine; dishonest is not.** Fake the parts that do not
  inform the decision. Never fake the part under decision.
- **Show the alternatives side by side**, switchable (`?lay=a|b|c`), each
  labelled with what it COSTS. The owner is choosing, so give them a real choice.
- **Small.** If the mockup needs the architecture in order to exist, it is not a
  mockup - shrink the question until it does not.

## Measure it; do not argue about it

A mockup you only look at is half a mockup. Drive it headlessly and measure the
thing under decision - widths, clipping, page height, whether an element is even
on screen. Numbers end debates that prose sustains, and they catch what the eye
misses.

Two real results from this repo, both of which reversed a plausible opinion:

- Three lesson-lab layouts "looked fine". Measuring showed two of them clipped
  the learner's own code by 166px and 214px, because the widget was already two
  columns. A third column was never viable.
- Three tracker placements "all seemed reasonable". One put the goals at y=985 -
  below the entire widget - so the learner had to scroll past the answer to find
  out whether they were done.

Measure the mockup's own content too, before trusting a reading. A Monaco
`.view-line` reports the CONTAINER width, not the text width; read that as
"everything clips" and you will redesign a layout that was never broken.

## Then, and only then

Once the owner has picked:

1. **Record the decision** with what the mockup measured, not just the choice:
   `node tools/journal.mjs decision --feature <slug> --question "..."
   --options "a|b|c" --chosen "..." --why "$(cat /tmp/why.txt)"`.
   Never put backticks in a shell-quoted argument - the shell executes them and
   silently truncates the rationale. Write the text to a file and `cat` it.
2. **Write the contracts** in the design-of-record - now derived from something
   that was seen and measured.
3. **Carry the measured constraints into the doc.** The numbers a mockup produces
   are authoring rules, not trivia: "the lab editor is 686px, about 75
   characters, so a starter line longer than that scrolls sideways" is worth more
   to the next author than any paragraph of intent.
4. **Delete the mockup** when the phase closes.

## Anti-patterns

- **"The design is done, this is just implementation."** A widget's look and
  behaviour is a design decision even inside a build phase. The design-of-record
  fixes DATA shapes; it does not fix the visual. Mock the visual, get the pick,
  then code the view.
- **Fleeting a subagent to build the view, then approving it yourself.** The
  owner decides. You are not a stand-in for them.
- **Describing the layout in prose and asking "does this sound right?"** It
  always sounds right. That is the failure.
- **One mockup at Phase 0, then five phases of unseen work.**
- **Committing the mockup** so it slowly rots into a second source of truth.

## Related

- `work-brief` (Phase 0) - the full owner design round; it calls this skill.
- `architect` / `auditor` agents - the design runner and the independent review.
- `ui-audit` - for defects that only appear once a browser lays the page out.
