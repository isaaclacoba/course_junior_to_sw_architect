---
applyTo: '**'
---
# Project rules - C# OO course

## Code editor: Monaco only (NON-NEGOTIABLE)

Every interactive code-editing surface in this project MUST use the Monaco
editor through `CodeLab.MonacoEditor`. This is the same editor used by
`level3-app`. It was built deliberately and it is the only approved editor.

- DO use `new CodeLab.MonacoEditor()` and `editor.mount(host, { value, language: "csharp", readOnly })`.
- DO load Monaco first with `await CodeLab.loadMonaco()` before mounting. That
  helper (shipped by code-lab) injects the AMD loader, wires the worker, and
  resolves `window.monaco`. Do not add a Monaco `<script>` tag or a per-page
  loader.
- The editor host must be a sized `<div>` (give it an explicit `height`).
  Monaco does not render in a zero-height container.

- DO NOT use `CodeLab.TextareaEditor`, a raw `<textarea>`, `contenteditable`,
  Prism-as-editor, or any other hand-rolled editor.
- DO NOT load Monaco directly per page or reinvent the loader. Use
  `CodeLab.loadMonaco()`.
- DO NOT write a new editor controller. The shared write-and-run body is the
  `build` plugin (`kernel/engine/plugins/build-plugin.js`) on the generic engine
  (`kernel/engine/lesson-engine.js`), driven by `window.LESSON_CONFIG`. A build
  lesson is a data-only `data.js` that sets `LESSON_CONFIG`; the generated page's
  kernel controller injects the core + the build plugin.

## Reuse existing components

Reuse an existing component (`code-lab`, `kernel/engine/lesson-engine.js` + its
plugins, `level3-app`) before building anything; a parallel pattern is not
acceptable (see `copilot-instructions.md` golden rule 1).

## Runner

Code runs through the shared Roslyn host:
`new CodeLab.RoslynIframeRunner({ url: "level3-app/index.html?runner=1" })`.
Do not build another runner.
