---
applyTo: '**'
---
# Project rules - C# OO course

## Code editor: Monaco only (NON-NEGOTIABLE)

Every interactive code-editing surface in this project MUST use the Monaco
editor through `CodeLab.MonacoEditor`. This is the same editor used by
`level3-app`. It was built deliberately and it is the only approved editor.

- DO use `new CodeLab.MonacoEditor()` and `editor.mount(host, { value, language: "csharp", readOnly })`.
- DO load Monaco first: include the CDN loader and `monaco-boot.js`, then
  `await window.ensureMonaco()` before mounting. `monaco-boot.js` exposes
  `window.monaco`, which `CodeLab.MonacoEditor` resolves automatically.
- The editor host must be a sized `<div>` (give it an explicit `height`).
  Monaco does not render in a zero-height container.

- DO NOT use `CodeLab.TextareaEditor`, a raw `<textarea>`, `contenteditable`,
  Prism-as-editor, or any other hand-rolled editor.
- DO NOT load Monaco directly per page or reinvent the loader. Reuse
  `monaco-boot.js`.
- DO NOT write a new editor controller. The shared write-and-run engine is
  `build-engine.js`, driven by `window.BUILD_CONFIG`. Add a lesson by writing a
  data-only `*.js` that sets `BUILD_CONFIG` plus an HTML page that loads, in
  order: Monaco loader, `monaco-boot.js`, `vendor/code-lab/code-lab.global.js`,
  the lesson data file, then `build-engine.js`.

## Reuse existing components

Before building anything, look for an existing component (`code-lab`,
`build-engine.js`, `drill-engine.js`, `level3-app`) and reuse it. Introducing a
parallel pattern instead of reusing what exists is not acceptable.

## Runner

Code runs through the shared Roslyn host:
`new CodeLab.RoslynIframeRunner({ url: "level3-app/index.html?runner=1" })`.
Do not build another runner.

## Workflow

- Log task start and end in `docs/work-log.md` with the `date` command.
- No emojis, no buzzwords, minimal docs (no new markdown unless asked).
- Delete any temporary `_*.html` test harness files before finishing.
