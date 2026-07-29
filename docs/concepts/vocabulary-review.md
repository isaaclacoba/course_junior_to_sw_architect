<!-- audit: fp=617584744ca3 lessons=76 concepts=208 date=2026-07-29 -->
<!-- fixes applied 2026-07-29: the clear P3 (th-inode term, ai-react "grounded", ai-evaluation "can never") + the value-type P2 (pr-struct/pr-record/pr-nullable-value-type reworded) -> new fp f9f9b2b89215. The pr-single-inheritance / pr-runtime-dispatch merges were DECIDED 2026-07-29: KEEP BOTH SPLIT - pr-single-inheritance is a language fact, pr-favour-composition a design principle; pr-polymorphism is the what, pr-runtime-dispatch the how. No graph change. -->
# Concept-graph vocabulary review (CG3 - fresh-eyes re-audit)

## Status / fingerprint

Graph fingerprint **unchanged** since the CG2 audit: `fp=617584744ca3`, 76 lessons, 208 concepts (re-computed against the drafts and confirmed equal to the migrated `content/**/meta.js` - `data-shapes/meta.js` matches its draft byte-for-byte, and the whole-graph meta.js fingerprint matches the drafts). So every *introduced def* is identical to the CG2-RESOLVED state; the CG2 P1/P2/P3 fixes are all present in the drafts (verified below). This CG3 pass therefore spends its effort on what the fingerprint does not capture: **edges, placement, coverage, cross-track overlap, id hygiene, voice**, plus fresh verification of the CG2 fixes.

## Overall verdict

**Good enough to build Phases 1-3 on.** All three graphs are technically accurate at the level each track teaches; the introduce-once rule holds; the revisit/uses spines track reading order; the voice is consistent with `AGENTS.md`. The CG2 fixes landed cleanly and are sound against the lesson content. The remaining findings are refinements, not blockers - no systemic problem, no rebuild.

New counts (fresh findings only, CG2 fixes excluded): **P1 = 0, P2 = 4, P3 = 4.**

## P1 - Correctness

**None.** No introduced def is technically wrong or misleading against its lesson content or the domain. Spot-checks that confirm the CG2 fixes are accurate, not just applied:
- `ai-14 / ai-embedding` - reworded def ("done ahead of time for every stored chunk, and again for each incoming question") matches the viz exactly (chunks embedded "once, ahead of time"; the question "turn it into an embedding" at query time). Correct.
- `ai-14 / ai-retrieval` narrowed to the lookup step and `ai-rag` now owns the full fetch-and-answer pattern - matches the viz recap. Overlap resolved.
- `reading-objects / pr-constructor` - the lesson uses a constructor in every card (`public Clock(int hour) { _hour = hour; }`, "take its collaborator through the constructor"); the def is accurate and the placement is earned.
- `class-members / pr-readonly` ("set once - at its declaration or in the constructor - and never reassigned") - now technically complete.
- `theory-18 / th-inode` - def matches the viz (inode = bytes + facts, reached through a name in a directory).

## P2 - Introduction placement & coverage

- **`data-shapes` / `pr-struct`, `pr-record`, `null-safety` / `pr-nullable-value-type` lean on practical-untaught terms.** `pr-struct` = "A **value type** that is copied ... rather than shared **by reference**"; `pr-record` = "compared by its values rather than by **identity**"; `pr-nullable-value-type` = "A **value type** that opts in to being absent". The practical track never introduces a concept for *value type* / *reference type* / *identity* (those live only in theory: `th-value-type`, `th-reference-type`, `th-reference`). This is the same class of gap CG2 fixed for `class`/`field`, but for "value type/reference". Fix options: (a) add a light `pr-value-type` (or fold into `pr-struct`'s owning lesson as an explicit sentence) and have `data-shapes`/`null-safety` revisit it, or (b) keep the plain-English use but stop leaning on the bare term. Non-blocking.

- **`composition` / `pr-single-inheritance` overlaps `reuse-without-regret` / `pr-favour-composition`.** `pr-favour-composition`'s def already carries the reasoning ("multiple parents clash"), and `pr-single-inheritance` ("C# lets a class inherit from just one parent, so you combine several parts by holding them instead") restates that same fact as its own concept. Merge candidate, or sharpen `pr-single-inheritance` to the pure language rule (one base class) and let `pr-favour-composition` own the *why*. **DECIDED 2026-07-29: keep both** - a language fact (single inheritance) and a design principle (favour composition) are worth teaching as distinct concepts even though they point at the same conclusion.

- **`polymorphism` / `pr-runtime-dispatch` vs `reuse-without-regret` / `pr-polymorphism`** (carried from CG2, still open by design). "The real object deciding at run time which version runs" restates polymorphism's mechanism; it earns its keep only via the "add a type, not another branch" angle. Weakest practical introduction; keep if trimming Part 4 vocabulary is undesirable, else merge. **DECIDED 2026-07-29: keep both** - `pr-polymorphism` is the *what* (one call, many behaviours), `pr-runtime-dispatch` the *how* (the runtime picks the override); distinct enough to keep.

- **`ai-1` defines itself with "token" one lesson before `ai-2` introduces `ai-token`.** `ai-llm` ("predicts the next **token**") and `ai-next-token-prediction` ("scores every possible **token**") both use the word before it is taught. Analogous to CG2's theory-3 "function" note. Hard to avoid - "next-token prediction" is the whole of lesson 1 - so accept, but flag: it is the one spot the ai track names a not-yet-introduced concept in a def.

- **Coverage (minor, defensible): `theory-18` teaches "hard link" and "soft link" by name in prose but the graph names neither** (only `th-inode`). CG2 recommended exactly this fold and it was applied; noting only that a coverage reviewer will see two named-in-lesson terms with no concept id. Acceptable under the track's "keep it shallow" aim.

## P3 - Voice, id hygiene, edges

- **NEW term collision: `th-file` (theory-7, term "File") and `th-inode` (theory-18, term "File").** CG2's own inode-fold set `th-inode`'s display term to "File", which now collides with `th-file`'s "File" inside the same track. Two concepts rendering as the identical word "File" is confusing in a glossary. Fix: rename `th-inode`'s term to "File on disk" or "Inode" (the id already implies the latter).

- **`ai-17` / `ai-react` uses "grounded" before `ai-grounding` is taught.** "...repeated until the answer is **grounded**" (Part 3) forward-references `ai-grounding` (ai-22, Part 4). Reword to "until the answer rests on a real result" or accept the plain use, but it is jargon-before-taught by the strict rule.

- **Near-duplicate ids: `pr-to-string` (type-conversion) vs `pr-tostring-override` (type-system).** Distinct meaning (calling `ToString` vs overriding it), but the ids differ only by a suffix and both terms mention ToString. Acceptable; noted for id hygiene.

- **Mild absolute in `ai-23` / `ai-evaluation`:** "...so the same bug **can never** sneak back in." Slight overstatement per the "hedge absolutes" rule; trim to "so the same bug does not sneak back in".

Solid, do-not-touch areas (fresh confirmation): the practical Part 1 -> Part 4 revisit spine (`pr-single-responsibility` -> encapsulation/testable-design/refactor-moves/SOLID; `pr-polymorphism`/`pr-override`/`pr-inheritance` into interfaces/polymorphism/SOLID; `pr-constructor` -> class-members/dependency-injection); the theory checkpoint revisit/uses chains (checks 1-4 pull the right earlier ids); and the ai edges (`ai-8` pulling context/memory/tool; `ai-14` revisiting `ai-semantic-memory`; `ai-17` revisiting agent-loop + chain-of-thought; `ai-22` revisiting retrieval). Well modelled.

## Cross-track overlap (for the unify-or-keep-scoped decision)

Concepts appearing in more than one track under different ids (unchanged from CG2 - the CG2 additions `pr-class`/`pr-field`/`pr-constructor` add no new cross-track pairs, since theory/ai teach no OO):

| Idea | practical | theory | ai |
| --- | --- | --- | --- |
| variable | `pr-variable` | `th-variable` | - |
| type | `pr-datatype` | `th-type` | - |
| assignment | `pr-assignment` | `th-assignment` | - |
| method / function | `pr-method` | `th-function` | - |
| parameter | `pr-parameter` | `th-parameter` | - |
| loop | `pr-loop` | `th-loop` | - |
| conditional / branch | `pr-conditional`, `pr-boolean-logic` | `th-condition`, `th-branch` | - |
| arithmetic / operator | `pr-arithmetic` | `th-operator` | - |
| value vs reference | `pr-struct` (value type) | `th-value-type`, `th-reference-type`, `th-reference` | - |
| **collaboration (DIFFERENT meaning)** | `pr-collaboration` (objects) | `th-collaboration` (people) | - |
| **memory (DIFFERENT sense)** | - | `th-ram`/`th-stack`/`th-heap` (hardware) | `ai-memory` family (assistant recall) |

The first eight rows are true synonyms across practical/theory and the natural unify candidates *if the tracks ever merge*. Recommendation: **keep track-scoped for now** - each track pitches the term at a different depth (theory `th-variable` = "a named slot in memory"; practical `pr-variable` = "a named box you read back and change"). The last two rows share only a *word*, not a concept - keep scoped whatever you decide.

## Judgment-call verdicts

1. **SRP owned by `reading-objects`, not `the-solid-principles`** - **Agree.** Content teaches "one job per method / separate the jobs"; SOLID revisits it and owns O/L/I/D. Correct.
2. **Inheritance/composition/polymorphism owned by `reuse-without-regret` (Part 1), Part-4 lessons revisit** - **Agree.** Full 12-card teaching lesson; ownership earned; revisits right.
3. **`pr-dependency-injection` (wiring) kept separate from `pr-dependency-inversion` (principle)** - **Agree.** Genuinely different, correctly split.
4. **`ai-6` introducing the 5-part memory taxonomy** - **Agree.** Each of working/episodic/semantic/procedural is a distinct viz step under the `ai-memory` umbrella; all earned.
5. **`ai-grounding` owned by `ai-22`, not `ai-14`** - **Agree.** Retrieval = mechanics; grounding = truth/citation framing with hallucination. Right.
6. **`th-run-time` vs `th-runtime-platform`** - **Agree distinct; CG2's display-term fix (".NET runtime") is applied and resolves the on-screen clash.**
7. **`ai-transcript` vs `ai-trace`** - **Agree, now distinct.** CG2's sharpen landed: transcript = "the input the model is re-sent each step"; trace = "the after-the-fact record ... read to find where it went wrong". Good.
8. **Constructor placed in `reading-objects`, revisited by `class-members`/`dependency-injection`** (CG2's new call) - **Agree.** It is the earliest lesson where constructors carry weight (every card defines and uses one); def accurate.
9. **`pr-single-inheritance` as its own concept** - **Weak agree / merge candidate** (see P2); the `pr-favour-composition` def already leaks its content.

## Reconciliation with CG2

**CG2 findings confirmed still-resolved (all applied and accurate against content):**
- P1 `ai-embedding` reworded - confirmed vs viz. ✔
- P1 `pr-readonly` completed ("at its declaration or in the constructor") - ✔
- P2 Constructor concept added (`pr-constructor`, reading-objects) - ✔
- P2 Class / Field added (`pr-class` in foundations, `pr-field` in class-members) - ✔ (defs no longer lean on undefined "class"/"field")
- P2 `ai-retrieval` vs `ai-rag` overlap split - ✔
- P2 theory-3 "function" forward reference removed (`th-main` = "the routine...", `th-entry-point` = "the place...") - ✔
- P2 theory-18 inode folded to a single concept (hard/soft-link dropped as named ids) - ✔
- P3 editorial tails trimmed on `ai-llm`, `ai-transcript`, `ai-workflow` - ✔
- P3 `th-runtime-platform` term renamed to ".NET runtime" - ✔
- P3 `ai-transcript` vs `ai-trace` sharpened - ✔

**New findings CG2 missed (fresh eyes):**
- P2: practical `value type`/`reference`/`identity` dependency (`pr-struct`, `pr-record`, `pr-nullable-value-type`) - the same undefined-term class CG2 only caught for class/field.
- P2: `pr-single-inheritance` overlaps `pr-favour-composition`. **DECIDED: keep split (fact vs principle).**
- P2: `pr-runtime-dispatch` overlaps `pr-polymorphism`. **DECIDED: keep split (what vs how).**
- P2: `ai-1` uses "token" one lesson before `ai-2` introduces it.
- P3: **`th-file` and `th-inode` now share the display term "File"** - a collision *introduced by CG2's own inode-fold* and not caught at the time.
- P3: `ai-react` uses "grounded" before `ai-grounding`; `ai-evaluation` mild absolute; `pr-to-string`/`pr-tostring-override` near-duplicate ids.

## Bottom line

**P1 = 0, P2 = 4, P3 = 4** (new). No blocker; the highest-value single fix is the **`th-file` / `th-inode` "File" term collision** (rename `th-inode`'s term), followed by naming a practical *value type* concept so `pr-struct`/`pr-record`/`pr-nullable-value-type` stop leaning on an untaught term. **Phases 1-3 are cleared to start.** No fixes applied (read-only, per request).