# AGENTS.md - Writing text for this course

Scope: how to write and edit **user-facing prose** in the course - lesson intros
(HTML hero `intro`), and the `context`, `goal`, `points`, `example` prose,
`quiz`, `summary*`, and card `title`s in the lesson data files (`*.js`), plus the
card blurbs in `index.html`. (For architecture, engines, and build/deploy, see
`.github/copilot-instructions.md`; for the editor rule, see
`.github/instructions/code-editor.instructions.md`.)

For lessons on the generated, per-directory layout (`content/<track>/<part>/
<lesson>/`), the same prose lives in that lesson's `data.js` (card prose) and
`meta.js` (hero `intro`, `title`, `blurb`); the card `blurb`/`title` come from
`meta.js`, not from a hand-edited `index.html`. The voice rules below are
identical for both layouts.

The audience is juniors, often non-native English speakers. Write like a calm
colleague explaining an idea at a whiteboard.

## Voice

- Plain, warm, direct. Short sentences. Second person ("you write...").
- Programming terms in `backticks`.
- Use a spaced hyphen ` - ` for asides, not an em-dash. Use it sparingly.
- No emojis. No marketing or buzzwords. No hype.
- Keep the light animal / test-automation flavour in the *examples*; keep the
  explanatory prose plain.

## AI text -> human text (rewrite rules)

The single most important thing: make prose sound written by a person, not a
model. Watch for these tells and fix them.

1. **Cut vague adverbs on abstract verbs.** "quietly backfires", "seamlessly
   handles", "simply works" -> say the concrete thing.
   - quietly backfires -> forcing it tends to make code harder to change later.
2. **Don't stack evaluative adjectives as fact** ("messy, fragile, clean,
   elegant, robust, powerful") -> name the measurable consequence.
   - messy, fragile code -> harder to change later.
3. **Hedge absolutes; be humble.** always / never / "the best way" -> tends to /
   often / usually / can / not always.
4. **No jargon before it is taught.** An intro uses plain words, not the lesson's
   own terms (avoid "the is-a lie", "one-base-class limit" in an intro). Teach
   the term inside the drill.
5. **Complete sentences, not blurb fragments.** A comma-and-dash list of topics
   with no verb is a table of contents, not an intro. An intro should HOOK and
   MOTIVATE; the drills do the teaching.
6. **Cut meta-commentary** about structure or the learner's journey:
   "here's the pattern:", "the payoff is", "the win:", "you built the case by
   feel", "watch the next step" -> just say the thing.
7. **Break the tricolon-plus-dash rhythm** ("A, then B, then C - the flourish").
   Vary sentence length and structure.
8. **Prefer concrete nouns/verbs and everyday analogies** over abstract
   nominalizations. "a cat has nine lives" beats "encapsulate the state".
9. **Read-aloud test.** If no colleague would say it out loud in a code review,
   rewrite it.

## The four tells that keep coming back

Rules 7-9 were written down and still got broken - one lesson shipped with four
tricolons, three `So ...` openers and two antithesis flourishes. They are hard to
see in your own prose, so they are named here and `node tools/check-voice.mjs`
counts them. Every hit is a QUESTION, not a verdict: read it aloud, and if a
colleague would say it, keep it.

1. **Tricolon** - "Git compared the two sides, found `cat.txt` on both, and
   stopped right there." Three clauses in a rising list. One is fine; two in a
   paragraph is a rhythm, and the rhythm is the tell. Split it, or drop a clause.
2. **Antithesis flourish** - "That stop is a conflict - git refusing to guess,
   not git failing." Defining a thing by what it is not, as a closing beat. Say
   what it IS and stop.
3. **`So ...` as an opener** - fine once. Three steps in a row starting "So" is a
   model summarising itself. Start with the subject instead.
4. **Naming an abstraction instead of the thing** - "That reading is the
   expensive one." Which reading? Expensive how? Name the mistake and its cost.

A fifth, rarer: a vague adverb doing the work of a fact - "quietly backfires",
"seamlessly handles". Say what actually happens.

## Writing an intro

A good lesson intro follows this shape (it worked for "Inherit or compose?"):

1. Name the learner's likely wrong instinct, often as a question.
2. Say why they should care - the concrete cost, humbly.
3. Preview the alternative in plain words (no jargon).
4. State the goal.

Do NOT open with a jargon topic-list.

Example (composition):
> Can't we just inherit everything - even from three classes at once? It feels
> like the natural way to reuse code, and often it is. But it does not fit every
> case, and forcing it tends to make code harder to change later. Here you'll
> see when inheritance is the right tool, and the other way to build one thing
> out of smaller pieces - so you can pick the right one each time.

## The "Here's the pattern" example box (build lessons)

- Show the real technique, but on a **different subject** than the exercise, so
  the learner sees the shape and still has to think.
- Never put the literal answer in the example, and never a vague comment.
- Example for a "write two implementations" drill: show a small interface with
  two implementations of a *different* type (e.g. `IShape` / `Box` / `Ball`),
  not the `IAnimal` / `Cat` / `Dog` the learner must write.

## Exercises (build lessons) - so there is real work

- The learner writes the class / interface / method / loop themselves. Give only
  the usage (`Main`) and a short spec comment; do not pre-implement the body.
- The `// TODO` comment states the intent, never the literal code to type.
- Do not model an anti-pattern in a lesson that teaches the opposite (e.g. no
  public mutable field poked from `Main` in an encapsulation lesson - unless it
  is the explicit "before" that a later drill fixes).
