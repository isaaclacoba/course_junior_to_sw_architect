# The build-and-run cycle (`theory-17.viz.js`)

- **Track / Part:** Theory - Part 3 How software runs and connects
- **Engine / format:** viz widget (`window.LESSON_VIZ`, mounted by `page-shell.js`; board scene with code region)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
How text becomes a running program, split into two phases: `compile time` (a
`compiler` reads the source, checks the rules, and stops on a `build error`) and
`run time` (the built program executes). Adds the landscape: some languages
compile straight to `machine code` for one `target` (a CPU + OS), others compile
to a portable form a `runtime` finishes on each machine; building for a
different target than your own is `cross-compiling`.

## Card-by-card
One `LESSON_VIZ` run of eight steps; the `code` snippet toggles between a good
and a deliberately broken (missing `;`) version.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | Source is text | code is just text on disk | See the file; note the CPU cannot run text. |
| 2 | Compiling | compile time, the compiler | Watch the source read top to bottom. |
| 3 | Missing `;` | build error | See the compiler stop on the broken line. |
| 4 | Fix and build | build succeeds | See the built program loaded into memory. |
| 5 | Run | run time, output `12` | Watch `a + b` execute and print. |
| 6 | Targets | machine code vs portable form | Read the two compile destinations. |
| 7 | Cross-compile | building for another target | See building for a different machine. |
| 8 | Recap | two phases | Read the compile-time vs run-time summary. |

## Prerequisites
Builds on [theory-15.md](theory-15.md) (RAM, loading a program) and Part 2's
idea of source code and bugs (see [theory-14.md](theory-14.md)). The `;` and
`print` are display-only. No prior compiler knowledge assumed; introduces
compiler, build error, runtime, target, cross-compile.

## Complexity rung
Conceptually central and a step up in breadth: two phases plus the machine-code
vs portable-runtime distinction plus cross-compilation in one lesson. The core
(compile time vs run time) is small; the targets/cross-compile material at the
end is extra reach for absolute beginners.

## Covered well
- Shows a real build error and its fix, making "caught before it runs" concrete.
- Cleanly separates the two phases and returns to them in the recap.
- Explains why a build error is valuable (many mistakes never reach users).

## Gaps / issues
- **Dead sibling file.** `theory-17.js` exists but `theory-17.html` loads only
  `theory-17.viz.js`. Manifest lists both; only the viz is live.
- **Two ideas past the core.** Steps 6-7 (targets, cross-compile) add real new
  vocabulary beyond the compile/run split; for this audience they sit at the
  edge of one-idea-per-lesson. No in-lesson check.
- The HTML pulls in Mermaid, but this viz does not render a diagram - an unused
  dependency on the page.

## Verification status
Read-only content audit (no compile). Snippet output is display-only. Confirmed
from the HTML that the viz widget is the live lesson.
