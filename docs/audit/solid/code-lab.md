# code-lab component (TypeScript) - SOLID audit

Read-only audit of the code-lab TypeScript source under `code-lab/src`. No code
was modified.

Scope - files read in full: `types.ts`, `index.ts`, `code-lab.ts`, `tour.ts`,
`highlighter.ts`, `editors/monaco.ts`, `editors/load-monaco.ts`,
`editors/readonly.ts`, `editors/textarea.ts`, `runners/roslyn-iframe.ts`,
`core/present.ts`, `core/memory-model.ts`, `core/quiz-model.ts`,
`core/viz-player.ts`, `core/progress-store.ts`, `dom/panel.ts`,
`dom/memory-viz.ts`, `dom/quiz-view.ts`. Sampled: `core/*` remainder,
`dom/*` remainder (by structure and line counts), and the `test/` listing.
The core/DOM separation claim was checked with `grep` for `localStorage`,
`window.`, `document.` across `core/`.

## Findings

**[S - medium]** `core/memory-model.ts` (`Step` interface) - `Step` is a single
data shape that carries memory-visualiser fields (`stack`, `heap`, `globals`,
`rodata`, `data`, `bss`, `mmap`, `refs`), hardware-board fields (`core`,
`cores`, `led`, `glow`, `packets`, `highlight`, `instr`, `ram`, `load`), and two
AI-track scenes (`agent`, `agentLoop`) - all optional. Every consumer of a step
sees fields for scenes it never renders, and adding a new scene type means piling
more optional fields onto the same object rather than introducing a distinct
shape. Why it matters: this is the one place in the core where the otherwise
clean separation breaks down into a "god step". A discriminated union per scene
type would keep each view honest about what it consumes and stop the shape
growing without bound.

**[O - medium]** `code-lab.ts` (`buildEditor` + `EditorKind`) - the editor is
chosen by a fixed string enum (`"readonly" | "textarea" | "monaco"`) and an
`if/else` factory. To add a new editor surface a caller must edit the
`EditorKind` union and `buildEditor` in this file; there is no way to pass a
custom `EditorAdapter` into `CodeLab` even though `EditorAdapter` is a clean
public interface. Why it matters: the runner (`runner?: CodeRunner`) and the
highlighter (`highlighter?: Highlighter`) are both injectable, so the asymmetry
stands out - the editor is the one seam a consumer cannot extend without editing
the facade. Contrast `dom/memory-viz.ts`, which does this well via a
`panelFactories` map keyed by `PanelType`.

**[D - low]** `dom/memory-viz.ts` (`MemoryViz.refreshXp`) - the facade reaches
out with `document.getElementById("courseXpLabel")` to update a hero element that
lives outside its own `root`, by a hard-coded id. Why it matters: the component
silently couples to the host page's DOM structure. Progress persistence is
already abstracted cleanly through `ProgressStore`; the XP label update should be
a callback or an injected sink, not a global id lookup.

**[D - low]** `editors/monaco.ts` (`MonacoEditor`) - the monaco namespace is
typed `any` and resolved from `window.monaco` (or a dynamic import) when not
passed to the constructor. Why it matters: the `any` gives up type safety across
the whole adapter, and the `window` fallback is a global dependency. It is
partially mitigated - the constructor accepts `{ monaco }` for injection, and the
`any` is a pragmatic response to monaco being an optional peer dependency - so
the impact is contained to this adapter and does not leak into core.

**[D - low]** `dom/quiz-view.ts` (`localStore` factory) - the default
`QuizStore` hard-codes `localStorage` reads/writes inline, whereas the sibling
`core/progress-store.ts` injects a `KeyValueStore` that defaults to
`globalThis.localStorage`. Why it matters: the `QuizStore` interface itself is a
good seam (injectable and testable), but the default factory does not reuse the
`ProgressStore`/`KeyValueStore` abstraction, so the two persistence paths diverge
and the quiz default is harder to unit-test than the viz default.

**[S - low]** `escapeHtml` duplication - a near-identical `escapeHtml` (and an
`inline`/`renderInline` backtick renderer) is defined independently in
`highlighter.ts`, `tour.ts`, `dom/quiz-view.ts`, `core/narration.ts`, and
`core/code-marks.ts`. Why it matters: not a SOLID principle on its own, but text
escaping is a single responsibility that has no single owner; five copies drift
independently (the quiz version also handles `**bold**`, the tour version handles
backticks). One shared escaping/inline-markup helper would remove the drift risk.

**[L / I - acceptable, noted]** `types.ts` (`EditorAdapter`, `CodeRunner`) -
optional members are used correctly to keep contracts thin: `setMarkers?` is
implemented only by `MonacoEditor` (read-only and textarea surfaces cannot show
inline markers and do not stub it), and `preload?`/`warm?` on `CodeRunner` are
optional warm-up hooks. `ReadOnlyView.setReadOnly()` is a documented no-op
because the surface is read-only by definition. These are the right way to avoid
fat interfaces and do not constitute LSP/ISP violations - callers guard optional
methods with `?.`. Recorded here only to show the contracts were checked.

**[D - low, acceptable]** `runners/roslyn-iframe.ts` (`RoslynIframeRunner`) -
this adapter creates an iframe, appends it to `document.body`, and wires
`window` message listeners directly. That is inherent to its job: it is the DOM
boundary that fronts the WASM compiler host, and it implements the pure
`CodeRunner` interface so `CodeLab` never sees the iframe. Noted as an
intentional adapter, not a leak.

## What's well-designed

- Interface-first seams in `types.ts` - `CodeRunner`, `EditorAdapter`,
  `Highlighter` are small, documented contracts. `CodeLab` depends only on these
  abstractions; concrete Monaco, Roslyn iframe, and Prism plug in behind them.
  This is textbook DIP and the backbone of the component's reusability.
- Genuine core/DOM separation. `core/` is DOM-free in fact, not just by
  convention: the only `localStorage`/`window`/`document` matches in `core/` are
  in comments. `present.ts`, `quiz-model.ts`, `memory-model.ts`, and
  `viz-player.ts` are pure data + pure functions, and `test/` carries matching
  unit tests (`present.test.ts`, `quiz-model.test.ts`, `tour-state.test.ts`,
  `progress-store.test.ts`, `autoplay.test.ts`, etc.). The claim that core logic
  is separated and unit-tested holds.
- `dom/memory-viz.ts` panel composition is a clean OCP pattern: a `Panel`
  contract (`el` + `sync` + optional `animate`/`onResize`), a `panelFactories`
  map keyed by `PanelType`, and an injectable `VizLayout`. Adding a panel type is
  a new view plus one map entry; existing panels are untouched.
- `VizPlayer` (`core/viz-player.ts`) is a clean DOM-free state machine that owns
  position and resolved model; views observe the `PlayerState` it returns. Good
  SRP split between playback state and rendering.
- `ProgressStore` applies DIP well - a `KeyValueStore` interface injected with a
  `globalThis.localStorage` default, so tests pass an in-memory map. Failure is
  swallowed so storage being unavailable never throws.
- `RoslynIframeRunner` is the sanctioned abstraction over the WASM host it is
  meant to be: it implements `CodeRunner`, documents its postMessage wire
  contract, checks message origin, and takes the host `url` as config so any
  compiler honouring the contract can be swapped in. This matches the stated
  intent that code-lab own its compile/run boundary.
- Editor adapters (`ReadOnlyView`, `TextareaEditor`, `MonacoEditor`) all satisfy
  `EditorAdapter` and are substitutable behind it (LSP) - the facade drives them
  through the same methods.

## Verdict

Well-architected. The core-versus-adapter separation is real and test-backed,
and the primary seams (`CodeRunner`, `EditorAdapter`, `Highlighter`, the `Panel`
contract) are exactly where SOLID wants them. The findings are refinements, not
structural faults: the fixed `EditorKind`/`buildEditor` factory is the one seam a
consumer cannot extend without editing the facade (OCP asymmetry against the
injectable runner and highlighter); the `Step` interface has become a
scene-agnostic god-object in the core (SRP); and there are small DIP/DRY leaks -
the `getElementById("courseXpLabel")` reach-out, the untyped `window.monaco`
fallback, the quiz's hard-coded `localStorage` default, and five copies of
`escapeHtml`. None are high severity. Highest-value changes: let `CodeLab` accept
a custom `EditorAdapter`, and split `Step` into per-scene shapes.
