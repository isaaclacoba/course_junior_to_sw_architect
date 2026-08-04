# Rebuilding the SOLID lesson

## Goal

`content/practical/06-design-for-change/02-the-solid-principles` under-teaches on two
axes reported from real use:

1. **The goal is unreadable before the answer is known.** "Write a `FeedingSign` with
   `string Format(bool hungry)`" names a class the learner is being asked to invent, so
   it reads as a magic word. Readers have to open the solution to find out what the task
   is asking for.
2. **Nobody believes the principles pay off.** Learners - and experienced developers -
   call SOLID overengineering, because the cost of a violation is counterfactual and
   deferred: it arrives at the *second* change, in code you did not write.

## Diagnosis

Four faults, in order of damage.

1. **The exercise teaches the opposite of its thesis.** Every task asks for the SOLID
   shape from the start, so the learner pays the whole cost of the abstraction (more
   classes, more names to invent) and receives none of the benefit, which only ever
   materialises at a second change. We built an experience of "SOLID = more work for
   nothing" and then argue in prose that it is not. The prose loses.
2. **The goal is written in solution vocabulary.** The context prose does introduce
   "the sign text the keeper reads", but three paragraphs earlier, buried mid-argument.
   By the goal bullets it is gone.
3. **No structural picture, in the one lesson entirely about structure.** SOLID is
   spatial - who owns what, who breaks when this changes. We deliver it as prose.
4. **The transfer analogy is unlabelled.** `Door`/`DoorSign` -> `Cat`/`FeedingSign` is a
   sound scaffold, but under a heading that only says "Here's the pattern" a struggling
   learner reads it as a second unrelated domain to decode.

## Approach

### A. Make the second change the exercise

Three beats per principle, replacing "write the good shape":

- **Beat 1 - it works.** Tiny working naive program. No moral judgement, and the learner
  is *not* told a second requirement is coming.
- **Beat 2 - the change arrives.** A funny, animal-shaped requirement that is a real
  maintenance scenario underneath. The learner makes it in the naive code and sees the
  **change radius**: how many already-working places they had to touch and re-test.
- **Beat 3 - the same change, better shape.** Learner writes the SOLID version; the same
  requirement returns and the radius reads 1, in a file with nothing to do with the rest.

The meter is the argument. This is Use-Modify-Create and productive failure; the metric
is Fowler's *shotgun surgery* made literal.

### B. Make the goal picturable before the answer is known

- **Responsibility cards (CRC).** Beck and Cunningham invented these in 1989 specifically
  to *teach* OO design: class name, what it knows, what it does, who it asks - plain
  English, no notation. This is the direct answer to "what is a `FeedingSign`".
- **A plain-English "what you are building" sentence** before any code vocabulary.
- **Subgoal labels** over the goal bullets ("Model the state", "Separate the wording").
  The single best-evidenced intervention found - replicated RCTs in CS education.
- **A live blueprint** beside the editor: the target types as dashed ghosts that fill in
  as the learner's code satisfies them.

Deliberately NOT full UML: arrow semantics and visibility markers must be learned before
the design can be read, which is pure extraneous load. Fowler's "sketch" mode only.

### C. Be honest, out loud

Voice the strongest form of the objection in the lesson and concede what is true: for a
sign that never changes, the split earns nothing. The rule is not "always split" but
**split along the seam that has already moved once**. Fowler labels the design-payoff
claim a *hypothesis* with no objective proof; Beck says design quality is only evaluable
post hoc. Teaching it as obviously correct reliably produces cynicism in the most
thoughtful learners - the ones who argue.

Also reframe S using Martin's own 2014 correction ("gather things that change for the
same reasons") rather than the indefensible "a class should do one thing".

## The change that proves each principle

The encoding rule: the animal story must carry the same *structural pressure* as the real
case - the same change arriving at the same seam - not merely the same class shapes.

| | The change that arrives | What the learner feels | Real-world twin |
|---|---|---|---|
| **S** | The shelter goes bilingual - the card must read `COMER`/`LLENO` | A translation forces you to reopen the feeding decision | i18n landing on a class that also holds business rules |
| **O** | A parrot arrives - and it repeats the last thing it heard | The if-chain cannot express it at all, and you must edit the method cats depend on | A new payment provider / file format / country |
| **L** | The keeper writes one loop over the whole aviary | The crash lands in the *keeper's* loop - code they never touched | `ReadOnlyCollection` throwing on `Add` |
| **I** | A monkey arrives, so `Climb()` joins the interface | Every existing animal stops compiling - the ripple is a compile-error count | A fat service interface breaking all implementers |
| **D** | Night shift: feeding must go to a file, and the vet wants a test | You cannot test without 500 lines of "cat fed" in the output | A test that sends a real email / hits the real database |

S is worth noting: this course is itself bilingual EN/ES, so "the shelter goes bilingual"
is a change the course has already lived through.

## The metric

**Count of already-working places you had to edit.** Observable by the learner,
counterfactual, honest at this size, and exactly what the principle claims to reduce.

Rejected: cyclomatic complexity (a 5-line method scores the same whether or not it
violates SRP, and it needs tooling) and lines-changed (a good refactor often adds lines
while reducing the number of separate concerns touched).

## Reuse audit - what already exists

- `scanCSharp()` in `code-lab/src/core/csharp-symbols.ts` already returns
  `types[] {name, kind, members[]}` and `vars[] {name, type}`. Verified against the real
  O-task solution: it correctly reports `interface IAnimal [Speak]`, `class Cat [Speak]`,
  `class Dog [Speak]`, and `animal:IAnimal`.
- Missing: the base list (`class Cat : IAnimal`) - the arrows, which for SOLID are the
  lesson. Verified as a one-line regex change, tested against multiple bases and
  positional records:
  `/\b(class|interface|record|struct|enum)\s+([A-Za-z_]\w*)\s*(?:\([^)]*\))?\s*(?::\s*([^{\n;]+))?/g`
- MemoryViz already has an ordered-step player and 16 composable panel types, so the
  blueprint is a new scene, not a new engine.
- The goal checklist should be **derived from the same `requireSource` gates that grade
  the task**, so the stated goal and the graded goal cannot drift.

No new engine, no new parser, no new editor.

## Plan

Checked against the engine: **the three-beat staging needs no engine change at all.**
`tasks` is just an array and `meta.total` is just a count, so each principle becomes two
cards - beat 1+2 (edit the working naive code; its `starter` is the working program) and
beat 3 (write the SOLID shape). Beat 2 grades exactly like any other build task. That
makes the content rewrite independent of, and shippable before, any new UI.

**Phase 0 - content only, no engine work.** Highest value, lowest risk.
1. Rewrite task 1 (S) as two cards with the bilingual-shelter change, EN + ES.
2. Add the plain-English "what you are building" sentence, subgoal labels over the goal
   bullets, and CRC responsibility cards. The cards can ship as an authored block in the
   task prose - no new component needed to answer "what is a `FeedingSign`".
3. Add the honesty card, and reframe S with Martin's own 2014 correction.
4. Validate with a real learner before touching O, L, I, D.

**Phase 1 - the panels**, once Phase 0 holds.
5. Change-radius panel (touched / added / untouched + verdict line). Authored per task
   first; computed from the learner's diff only if authoring proves too weak.
6. Extend `TypeSymbol` with `bases: string[]` in code-lab (+ unit tests), then the
   `blueprint` scene: target types as ghosts, filled from a live scan of the editor.
7. Derive the goal checklist from the `requireSource` gates so stated and graded goals
   cannot drift.

## Open

- Two cards per principle doubles the card count (5 -> 10 plus recap) on a lesson already
  marked 35 min and `challenging`. Beat-2 cards are deliberately tiny - one line to
  change - but the lesson may still want splitting in two, or the recap trimming.
- Whether the change radius is authored or computed (see step 5).
- **Collision risk:** adding a scene touches `code-lab/src/index.ts` and
  `core/memory-model.ts`; the parallel git-track session is editing `src/index.ts` and
  `src/dom/git-graph-view.ts`. Phase 0 avoids code-lab entirely, so it can start now.

## Research

Two full research reports back this document (raw notes kept in the session store):
subgoal labelling and CRC-card evidence on the goal side; Dan North's CUPID critique,
Metz's "wrong abstraction", Abramov, Muratori, Fowler's Design Stamina Hypothesis and
the Chidamber-Kemerer coupling-defect line on the honesty side. The evidence that these
principles reduce cost is real but indirect, correlational and contested - which is
precisely why the lesson should concede rather than assert.
