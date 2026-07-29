# C# execution visualizer - canonical spec

Status: design spec, no code yet (2026-07-29). Distilled from three research
threads - a teardown of beginner visualizers, the learning-science evidence on how
people model running code, and the explorable-explanation tradition (Victor,
Ciechanowski, Red Blob). Presentation layer only; the tracer is a separate track (section 8).

## 1. The problem

The course wants a way to *see what the computer is doing* as C# runs. Today
`MemoryViz` approximates it, but every scene is hand-authored - a person types the
stack and heap state for each step - and it opens straight into a full hardware
memory board: too much for a first-day learner, and it cannot run their own code.

Goal: a level-0 learner understands it in seconds with no prior model of stack or
heap, and the *same* tool scales to mid-senior through staged detail. It must teach
the C# notional machine correctly (assignment copies, value vs reference, parameters,
scope and lifetime, loops reuse a box, recursion makes new frames) and read like a
calm textbook diagram, not a debugger - the anti-example is godbolt (no IL, no addresses).

## 2. The idea, and three pillars

Our edge over Python Tutor is not more information - it is less, shown better.
Three research threads converged on the same three pillars:

- **Less, revealed progressively.** Start with almost nothing on screen and let
  detail be earned (Thonny's staged levels; the expertise-reversal effect).
- **Time made tangible.** A scrubber, a change-signal, and a value-history -
  where Python Tutor teleports between frozen states and shows only "now".
- **Engagement over viewing.** The learner predicts, changes, and builds state,
  not just watches - the highest-confidence finding in the evidence (Naps
  engagement taxonomy; Hundhausen meta-study).

## 3. What it shows, by level (the spine)

Detail is staged. A lesson sets a level; an "advanced" toggle steps up one. Every
level is a *projection* over the same trace - it renders a subset, never a
different data model.

| Shown                                | L0 | L1 | L2  | L3 |
|--------------------------------------|----|----|-----|----|
| code + current line (amber)          | y  | y  | y   | y  |
| narration + incremental output       | y  | y  | y   | y  |
| flat variable table (name : value)   | y  | active | active | active |
| call stack as cards, args copied     | -  | y  | y   | y (collapsible) |
| heap object cards + reference arrows  | -  | -  | y   | y (collapsible) |
| null shown explicitly                | -  | -  | y   | y  |
| recursion as a call-tree             | -  | -  | -   | opt |
| method-level stepping, hide library  | -  | -  | opt | y  |
| addresses / `this` / static types    | -  | -  | -   | opt |

Level 0 is the whole point: code, a flat variable table, output, narration, and
navigation - nothing about stack vs heap, no arrows, no addresses.

## 4. Reading the picture (visual language)

A small, fixed colour grammar, never reused for another meaning and never the
*only* signal (each state also carries a shape or text cue):

- amber - current line / active frame
- green - changed or created this step
- blue  - a reference arrow
- red   - null, error, about to be destroyed
- gray  - returned frame / old value

Primitives read inline (`count : 3`); objects are rounded cards with a coloured
type header and a stable id; standard collections render logically
(`List<int> -> [10, 20, 30]`), not as internal fields. A declared-but-unassigned
slot is an empty box, and `static` fields sit in their own class area so their
longer lifetime reads differently from locals. The variable table sits beside the
code, so the executing line and the box it changes are adjacent.

## 5. Moving through time (interaction)

The primary control is a **scrubber**, not just step buttons - a slider across all
steps with a "Step N of M" label, play/pause, and speed, fully keyboard operable.
Under it sit two derived aids: notable-moment dots (call, return, new object,
exception, loop boundary) you can jump between, and a thin call-depth sparkline
that shows the run's shape at a glance (peaks = recursion, flat = iteration). Long
loops can be collapsed with a "jump to next iteration" hop, so a hundred-pass loop
stays navigable.

## 6. What makes it better than Python Tutor

- **Animate only what changed** - the changed row flashes, an object scales in at
  its `new`, an arrow re-points; everything else stays still, and a step that
  changes nothing still pulses so it is never invisible.
- **Flatten time** - a per-variable value-history strip ("was 0 -> 1 -> 2 -> 3"), a
  per-line execution heatmap, and, for a structure being assembled, an optional
  ghost of previous heap states so the whole growth is one picture.
- **Expression substitution** - at the low levels a sub-expression is replaced
  inline by its value over the source (`b * c -> 6`, then `a + 6 -> 10`), and any
  sub-expression can be hovered to read what it evaluated to. Uniquely strong for
  operator precedence; no web tool does it as well.
- **Engagement** - predict-then-reveal ("what will `x` be?"), change-and-rerun
  (edit an input, watch the trace change), and later a construct mode where the
  learner updates the box or pushes the frame with automatic feedback.
- **`ref`/`out` shown as an alias arrow, not a copy** - the one place parameters
  are not copied is made visible.

## 7. Accessibility (from day one)

WCAG AA contrast in every theme; colour never the sole signal; full keyboard
operation; and a `prefers-reduced-motion` path that swaps every animation for an
instant change plus a static "changed this step" highlight - losing motion but no
meaning. It respects the OS light/dark preference through the existing theme runtime.

## 8. How it is built

**Reuse, do not rebuild.** `MemoryViz` already gives us a bidirectional step machine
and a `Step` record (narration, current line, stack frames with locals, heap objects,
derived arrows). Almost every beginner feature above is *derived* from that trace on the
client (what-changed, value-history, heatmap, call-depth, notable moments) - no new engine
data. Only two additive fields are new: incremental `printed` output and expression overlays.

**Architecture:** evolve `MemoryViz` rather than build a parallel widget - add an
`exec` scene with a level, three new panel types (`vartable`, `callstack`,
`heapcards`) behind its existing panel facade, plus a pure trace post-processor.
Engine work lives in the `code-lab` submodule; rebuild and re-vendor the bundle
after changes.

**Tracer (separate track):** a Roslyn source-instrumentation pass in the
compiler-host emits, per step, the line, the frames with their locals, the heap
objects, and the incremental output. That maps one-to-one onto `Step`, so a
generated trace drives the *same* renderer the hand-authored scenes use.

**Phases:** (P1) level-0 renderer on a hand-written trace, proving the beginner
experience with zero tracer risk; (P2) the derived-features post-processor;
(P3) level 1 call-stack cards and motion; (P4) level 2 heap cards and arrows;
(P5) the tracer, a "Visualize my code" button, then engagement and expression
substitution as flagship polish.

## 9. Open decisions

- First deliverable = P1 (level-0 on a hand-written trace)? Recommend yes.
- Evolve `MemoryViz` vs a new widget? Recommend evolve.
- Prototype lesson = `theory-14` (it already steps a tiny routine filling one
  slot, so it converts cleanly to a flat variable table)? Recommend yes.
- Ship animation in P1 or defer? Recommend defer heavy motion to P3; P1 uses the
  static change-highlight, which is also the reduced-motion path.

## 10. Evidence in one line

Staged detail and level-0-first (Thonny; expertise-reversal). Flat table before
stack/heap (split-attention). Scrubber and flatten-time (Victor). Animate only
what changed (Tversky; Mayer signalling). Predict / change / construct (Naps
taxonomy; Hundhausen meta-study; Sorva). Reference-vs-value shown literally
(Sorva misconceptions; notional-machine tradition). Synchronised narration
(VisuAlgo e-lecture).
