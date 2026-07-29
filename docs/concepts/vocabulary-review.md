<!-- audit: fp=617584744ca3 lessons=76 concepts=208 date=2026-07-29 -->
<!-- status: RESOLVED 2026-07-29 - all P1/P2/P3 findings applied to the drafts (plan CG2); the sections below are the historical record. -->
# Concept-graph vocabulary review

Read-only review of the three drafted concept graphs against `course-manifest.js`
(order/titles/blurbs) and a content sample (`reading-objects.js`,
`reuse-without-regret.js`, `ai-6.viz.js`, `ai-14.viz.js`, `theory-7.viz.js`,
`theory-18.viz.js`, plus the migrated practical set). I changed nothing else.

## Overall assessment

This is a **good first draft - build on it, do not restart.** All three graphs are
technically accurate at the level each track teaches, the introduce/revisit/uses
edges mostly track lesson order, and the voice is consistent with `AGENTS.md`
(plain, second person, spaced hyphen, terms in prose). No systemic problem.

The real work is a short list of fixes, not a rebuild:

- **practical** is missing a couple of concepts a mentor expects (**Constructor**
  above all), and a few defs lean on undefined terms (`class`, `field`).
- **theory** is the strongest of the three: comprehensive, well-ordered, clean
  defs. Two nits (a forward reference to "function", the `Run time`/`Runtime`
  term clash) and one scope question (inode/hard-link/soft-link depth).
- **ai** has the most vivid defs but also the most drift from "one plain
  sentence" - a few editorialise, and two pairs overlap (retrieval/RAG,
  transcript/trace).

Counts: **P1 = 2, P2 = 7, P3 = 6.** None are blocking.

Top issues to fix first:
1. Add a **Constructor** concept to practical (P2) - three defs and the
   `reading-objects` content already depend on it.
2. Sharpen **ai-embedding** - its def implies embedding is only a precompute,
   but the question is embedded at run time too (P1).
3. Trim the **editorial tails** on a few ai defs (ai-llm, ai-transcript,
   ai-workflow) back to one descriptive sentence (P3).
4. Resolve **ai-retrieval vs ai-rag** overlap - retrieval's def currently *is*
   the RAG def (P2).
5. Rename the display term of **th-runtime-platform** so `Run time` and
   `Runtime` stop colliding on screen (P3).

## P1 - Correctness

- **ai-14 / `ai-embedding`** - "The step of turning a piece of text into a list
  of numbers that captures its meaning, **done once ahead of time for every
  stored chunk**." Misleading: the *question* is embedded live at query time, not
  ahead of time. The lesson viz shows exactly this ("we turn it into an
  embedding"). Fix: "...that captures its meaning - done ahead of time for every
  stored chunk, and again for each incoming question."

- **class-members / `pr-readonly`** - "A field that can be set **once in the
  constructor** and never reassigned afterwards." Incomplete: a `readonly` field
  can also be initialised at its declaration. Minor but technically wrong as
  stated. Fix: "...set once - at its declaration or in the constructor - and
  never reassigned."

Otherwise the defs are technically clean, which is worth stating plainly: the
`th-value-type`/`th-reference-type`/`th-reference` trio, the LINQ/lambda/closure
set, `pr-cast` truncation, `pr-try-parse`, `th-byte`, and the ai sampling /
temperature / hallucination defs are all correct for their level.

## P2 - Introduction placement & coverage

- **Missing: Constructor (practical).** No concept anywhere, yet `pr-readonly`
  ("set once in the constructor"), `pr-dependency-injection` ("through its
  constructor"), and `reading-objects` content ("take its collaborator through
  the constructor") all rely on it. Introduce it in `reading-objects` or
  `access-properties`; have `class-members` and `dependency-injection` revisit.

- **Missing: Class (practical), weaker.** `pr-object` is the only handle, but
  "a class" appears undefined in `pr-object`, `pr-static`, `pr-generics`,
  `pr-abstract-type`, `pr-interface`. Consider a `pr-class` introduced in
  `foundations` (paired with `pr-object`) or accept object as the stand-in - but
  then keep the word "class" out of earlier defs.

- **Missing: Field (practical), minor.** Used in `pr-property` ("a raw field"),
  `pr-composition` ("as a field"), `pr-readonly` ("A field that..."). Never
  introduced. `class-members` is the natural home.

- **theory-3 forward reference.** `th-entry-point` and `th-main` define
  themselves with "**function**" ("The function that is a program's entry
  point"), but `th-function` is introduced ten lessons later (theory-13). Reword
  theory-3 to "the place / routine where a program starts" or accept the plain-
  English use - but flag it, because it is the one spot where the theory track
  names a not-yet-taught concept in a def.

- **Over-fragmentation: `ai-retrieval` vs `ai-rag` (both ai-14).** The
  `ai-retrieval` def ("Turning a question into a vector, finding the closest
  chunks... putting just those into the context so the model can answer from
  knowledge bigger and fresher than its window") *is* the RAG description, so the
  two defs are near-duplicates. Either narrow retrieval to the lookup step (turn
  query to vector, find closest chunks) and let RAG own the whole
  fetch-and-answer pattern, or merge.

- **Scope question: `theory-18` inode / hard-link / soft-link.** Content genuinely
  teaches all three, so this is not an error - but three Unix-filesystem
  internals (link counts, unlinking, symlinks) sit deep for a track whose stated
  aim is "no background needed... what software is." Consider folding to a single
  "a file on disk = an inode plus a name" concept and dropping hard/soft-link as
  named concepts. (Note: the manifest **blurb** for theory-18 says "databases",
  which the lesson does not teach - the concept graph correctly omits databases,
  so the drift is in the blurb, not here.)

- **Possible redundancy: `pr-runtime-dispatch` (polymorphism) vs `pr-polymorphism`
  (reuse-without-regret).** "Runtime selection" restates polymorphism's
  mechanism. Defensible only because the Part-4 lesson adds the "add a type, not
  another branch" angle - keep it, but it is the weakest of the practical
  introductions and a merge candidate if trimming.

## P3 - Voice, id hygiene, edges

- **Editorial tails on ai defs.** Several append an opinion/summary after a ` - `,
  which reads like narration, not a definition:
  - `ai-llm`: "...over and over - **everything else in AI is built around that one
    move.**"
  - `ai-transcript`: "...your code adds tool lines, and **re-sending this list is
    all that memory really is.**"
  - `ai-workflow`: "...easier to test than an agent, **so reach for it first.**"
  Trim to the descriptive clause; the motivation belongs in the lesson prose.

- **Semicolon two-clause defs border on multi-sentence** (AGENTS: one sentence):
  `pr-null`, `pr-cast`, `th-stack`. Readable, but the strict rule flags them;
  either accept or split the second clause into the owning lesson's context.

- **Term collision: `th-run-time` ("Run time") vs `th-runtime-platform`
  ("Runtime").** Ids are fine; the *display terms* differ only by a space, in the
  same lesson (theory-17). Rename `th-runtime-platform`'s term to "Runtime
  platform" or ".NET runtime".

- **Near-duplicate ids within ai: `ai-transcript` (ai-13) vs `ai-trace` (ai-23).**
  Both currently read as "the whole record of a run". Keep distinct but sharpen:
  transcript = the message list a run literally *is* (the input you re-send);
  trace = the after-the-fact record you *read to debug*.

- **Cross-track term reuse, different meaning: `pr-collaboration` ("Object
  collaboration") vs `th-collaboration` ("several people working on one
  project").** Track-scoping makes this legal, but the identical base term with
  opposite meaning is worth noting for the unify decision below.

- **Minor edge: `pr-idisposable` (type-system, Part 2)** describes implementing an
  interface before `pr-interface` exists (Part 4). The def avoids the word
  "interface", so it is acceptable - noted only for completeness.

Solid, do-not-touch areas: the theory Part-1/2/3 ordering and its revisit chains
into the checkpoints; the practical Part-1 -> Part-4 revisit spine
(delegation -> composition, polymorphism -> runtime dispatch, SRP -> SOLID); and
the ai `uses`/`revisits` edges (e.g. `ai-8` pulling context/memory/tool forward,
`ai-17` revisiting agent-loop + chain-of-thought). These are well modelled.

## Cross-track overlap (for the unify-or-keep-scoped decision)

Concepts that appear in more than one track under different ids:

| Idea | practical | theory | ai |
| --- | --- | --- | --- |
| variable | `pr-variable` | `th-variable` | - |
| type | `pr-datatype` | `th-type` | - |
| assignment | `pr-assignment` | `th-assignment` | - |
| method / function | `pr-method` | `th-function` | - |
| parameter | `pr-parameter` | `th-parameter` | - |
| loop | `pr-loop` | `th-loop` | - |
| conditional / branch | `pr-conditional`, `pr-boolean-logic` | `th-condition`, `th-branch` | - |
| value vs reference | `pr-struct` (value type) | `th-value-type`, `th-reference-type`, `th-reference` | - |
| arithmetic / operator | `pr-arithmetic` | `th-operator` | - |
| **collaboration (DIFFERENT meaning)** | `pr-collaboration` (objects) | `th-collaboration` (people) | - |
| memory (DIFFERENT sense) | - | `th-ram`/`th-stack`/`th-heap` (hardware) | `ai-memory` family (assistant recall) |

The first nine are true synonyms across practical/theory and are the natural
unify candidates if you ever merge the tracks. The last two share a *word* but
not a *concept* - keep them scoped whatever you decide.

## Judgment-call verdicts

1. **SRP owned by `reading-objects`, not `the-solid-principles`** - **Agree.**
   Content teaches "one job per method / separate the jobs"; SOLID rightly
   revisits it and owns O/L/I/D. Correct placement.

2. **Inheritance/composition/polymorphism owned by `reuse-without-regret`
   (Part 1), Part-4 lessons revisit** - **Agree.** It is a full 12-card teaching
   lesson (is-a / has-a / diamond), not a passing mention, so ownership is
   earned; the Part-4 revisits are right.

3. **`pr-dependency-injection` (constructor injection) kept separate from
   `pr-dependency-inversion` (depend on abstractions)** - **Agree.** One is the
   wiring mechanic, the other the design principle; genuinely different, correctly
   split.

4. **`ai-6` introducing the 5-part memory taxonomy** - **Agree.** The viz teaches
   the umbrella plus working/episodic/semantic/procedural, each as its own step,
   so all five are earned - though it is the densest lesson in the track; fine.

5. **`ai-grounding` owned by `ai-22`, not `ai-14`** - **Agree.** Retrieval (ai-14)
   is the lookup mechanics; grounding belongs with hallucination (ai-22) as the
   truth-and-citation framing. Right call.

6. **Theory near-collisions kept distinct on purpose:**
   - `th-run-time` vs `th-runtime-platform` - **Agree they are distinct
     concepts**, but fix the display terms (`Run time` vs `Runtime` collide - see
     P3).
   - `th-transcript` vs `th-trace` (these are actually **`ai-transcript` vs
     `ai-trace`**, both in the ai track) - **Weak agree.** Distinct roles (the
     message list a run *is* vs the record you *debug*), but the current defs
     overlap; sharpen them (see P3).
   - `th-device` vs `th-driver` - **N/A.** `th-driver` is not in the graph, and
     theory-7 never says "driver" (it teaches `th-device` only). Nothing to keep
     distinct; the manifest blurb over-promises "drivers". Leaving driver out is
     the right call.
