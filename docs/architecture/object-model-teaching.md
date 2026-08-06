# Teaching the object model - design of record

Status: design ACCEPTED (owner ratified this round, 2026-08-06; 8 decisions
recorded as `D-object-model-teaching-1..8`). BUILD NOT STARTED.
Brief: [docs/plans/object-model-teaching.md](../plans/object-model-teaching.md)

## What & why

Students finish Part 1 unable to tell a class from an instance, and cannot say
what a parameter is. The reported symptom was "they read the definition but
cannot visualize it". This document is the fix: give the practical track a
picture of an object, and give the learner exercises where the difference is
something they cause rather than something they are told.

## The problem, measured

Counted across all 141 build tasks in the practical track, in reading order.

| What the learner does themselves | First time it happens |
|---|---|
| Writes `new X(arg)` with an argument | lesson 6, then not again until 18 |
| Declares a parameter | lesson 5, then not again until 19 |
| Writes a constructor | **lesson 19 of 29** - and it is inside a generic `Box<T>` |
| Sees two objects of one class at once | lesson 10 |

Three specific faults fall out of that:

- **`01-foundations` task 6 is the entire class-vs-instance teaching, and it
  cannot teach it.** The `Dog` class is pre-written, `new Dog()` is pre-written,
  the name is hardcoded *inside* the class body, and exactly one instance is ever
  made. Nothing on screen distinguishes the class from the object. It also uses a
  public mutable field, which a later lesson teaches against.
- **The parameter definition is the definition of an argument.** The concept chip
  says a parameter is "the value you hand in when you call the method". The same
  wrong sentence is repeated in `04-writing-methods` task 2 prose. All five method
  signatures in that lesson are pre-written, so the learner never declares one.
- **Ledger inversion.** `docs/concept-ledger.md` introduces `pr-constructor` at
  row 5 but `pr-field` at row 10 - a constructor is taught five rows before the
  fields it exists to set.

And the practical track is **29 of 29 build lessons with no visual at all**,
while every other track uses one.

## The asset we already own

`code-lab` ships a finished execution tracer that no lesson uses:

- `compiler-host/Services/Tracer.cs` - 870 lines of real Roslyn source
  instrumentation, `DefaultBudget = 400` steps. It already pushes a `ctor` frame
  for `new Type` and keeps a per-type instance number.
- `RoslynIframeRunner.trace(code)` returns an `ExecTrace`; `traceToSteps()` turns
  it into the same `Step[]` that MemoryViz already renders.
- `CodeLab.VizLab` - a working "Visualize my code" widget built on both.

Proven against the real compiler with a two-cats program: it produces
`CONSTRUCTOR on Cat #1` and `CONSTRUCTOR on Cat #2` frames with the parameters
visible, two heap cards side by side, and reference arrows from the locals.

Robustness, measured:

| Case | Result |
|---|---|
| warm-up / first trace / every trace after | 6.4s / 11.2s (JIT) / **~2s** |
| loop of 500 | stops at the 400-step budget and says so |
| infinite `while (true)` | **stops in 4s; the page does not hang** |
| syntax error | 17ms, error panel, "Did not compile." |
| runtime crash | reported as "It threw: ..." |

## Ratified decisions (owner, 2026-08-06)

1. Layout **A** - a dedicated lab card at full card width, the task in the card
   header. Measured against three alternatives; see "Layout" below.
2. Scope - **rework lesson 1's object exercise AND add new lessons**.
3. Shape - **two new lessons after `04-writing-methods`**: a build lesson for
   constructors, then a lab lesson.
4. Parameter - **fix the definition and teach `argument` as its own concept**
   alongside it, so the pair is contrasted rather than conflated.
5. Ledger - **introduce `pr-field` in the reworked lesson 1**, where a field
   genuinely first appears on screen, and revisit it in the new constructor
   lesson. `class-members` drops it from `introduces` to `revisits`.
6. Grading - the lab lesson **grades from the trace itself**, not from source
   shape and not from output.
7. Tracker placement - **P2**, in the card header on the right.
8. (Earlier, standing) both lines of work proceed: wire the visualiser up with
   Spanish, and fix the exercises.

## Layout

Measured with the real VizLab widget at 1440px. VizLab is *already* a two-column
widget (editor | memory), which is what kills the obvious options: a third brief
column squeezes the learner's own code until it clips.

| Option | Editor | Clipped | Page height | Compilers |
|---|---|---|---|---|
| **A dedicated lab card** | **686px** | **no** | 1257 | **1** |
| B brief column on the left | 319px | by 166px | 1252 | 1 |
| C build card + Visualize tab | 271px | by 214px | 1311 | 1 (needs a code-lab change) |
| D lab card underneath the build card | 686px | no | 1784 | **2** |

Within option A, the goal tracker placement was measured three ways:

| Placement | Goals visible while typing | Page height |
|---|---|---|
| P1 full-width strip above the widget | yes | 1353 |
| **P2 card header, right** | **yes** | **1314** |
| P3 under the widget | no - goals land at y=985 | 1337 |

P2 wins because it costs no extra page height and, once the header grid mirrors
the widget's own columns, the goal box lands exactly over the memory panel that
proves it. The rule that makes the alignment exact:

```css
.lab-head-split {
  display: grid;
  /* mirror .cl-vl: 43rem editor / 33rem aside, 1.4rem gap */
  grid-template-columns: minmax(0, 43rem) minmax(33rem, 1fr);
  gap: 1.4rem;
  align-items: start;
  /* .challenge-head is a flex row, so the grid must be told to fill it */
  flex: 1 1 100%; width: 100%; min-width: 0;
}
@media (max-width: 1080px) { .lab-head-split { grid-template-columns: minmax(0, 1fr); } }
```

Verified: left and right edges align to the widget's columns to 0px. Collapses to
one column below 1080px, matching the build and git cards.

**Authoring constraint that falls out of this:** the lab editor is 686px, which
is about **75 characters**. A starter line longer than that puts a horizontal
scrollbar under the learner's own code. This was caught by an 87-character
`// TODO` line overflowing by 103px.

## Grading from the trace

Goals on a lab card are **plain ticking rows, not UML boxes** - they are claims
about the run, not class shapes, and the existing `coach-list` already renders
that form. The gate vocabulary reads straight off `ExecTrace`, which already
carries everything needed (`TraceFrame.kind`/`recv`, `TraceObject.no`/`fields`,
`TraceStep.stdout`):

| gate | ticks when | reads |
|---|---|---|
| `{ constructed: "Cat", times: 2 }` | the constructor ran that many times | distinct frames with `kind: "ctor"` |
| `{ liveObjects: "Cat", atLeast: 2 }` | that many exist at once | any step whose `heap` holds them |
| `{ distinctField: { type: "Cat", field: "_name" } }` | two objects of one type hold different values | `TraceObject.fields` |
| `{ calls: { type: "Cat", member: "Describe", times: 2 } }` | the method ran on each | frames with `kind: "method"` and `recv` |
| `{ prints: "..." }` | the program printed it | `TraceStep.stdout` |

Every goal must still start RED on the untouched starter - the same rule the
build tracker already enforces.

## What changes, in build order

### 1. code-lab (do first, it is upstream of everything)

- `VizLabConfig.onTrace?: (outcome) => void` - VizLab keeps `lastTrace` private
  today and exposes no hook, so the course cannot grade what it shows. This is
  the one new seam, and it is generic rather than course-specific.
- `VizLabConfig.labels` - the config has **no `labels` field at all** today, so
  the existing `VizLabels` mechanism is simply not wired to VizLab.
- Extend `VizLabels` past transport controls to cover the badges
  (`heapcards-view.ts` `kindLabel`, ~line 195), the MEMORY caption (~line 49),
  "Nothing printed yet" (`console-view.ts`), and VizLab's own five chrome strings.
- Make `traceToSteps` take translated narration templates. This is the awkward
  part: the narration is **generated in code** - about 14 sentence templates in
  `exec-tracer-model.ts` - so it cannot live in a lesson bundle as-is.

About 25 English strings in total. Then `npm run typecheck && npm test &&
npm run build` inside `code-lab/`, and re-vendor both bundle files.

### 2. The `lab` archetype

A new plugin under `kernel/engine/plugins/`, mounted at full card width with the
P2 header grid, plus a `resource/bind-*.js` binder so it localizes. It is data
fed to VizLab and the existing tracker - no new engine, no new runner, no new
editor.

Note VizLab **builds its own compiler iframe**, which is why it cannot share a
build card's runner and why option C was rejected.

### 3. Content

- Rework `01-foundations` task 6: the learner makes **two** instances with
  different values, and introduces `pr-field`.
- Two new lessons after `04-writing-methods` - a constructor build lesson, then
  the lab lesson. Registry **array order is the real order**, so this means
  renaming directories and moving registry lines, not just appending.
- Fix the parameter definition; add `pr-argument`.
- Update `docs/concept-ledger.md` in the same change.

## Risks

- **Two compilers on one page is the failure mode to avoid.** Warm-up is 6.4s
  each. The lab is its own lesson precisely so this never happens.
- **A lab card with no task invites "press Visualize, move on".** The trace goals
  are what prevent that; they are not optional decoration.
- **The narration templates are the real i18n cost.** Everything else is a string
  table; this one needs a code change before it can be translated at all.

## Not decided yet

- How the lab lesson awards XP and counts toward track progress.
