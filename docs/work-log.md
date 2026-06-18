# Work Log

- Start: 2026-06-18 09:50:55 CEST | Task: Build Level 4 'Reuse without regret' - a reading-to-understand module (no code writing) hammering inheritance vs composition vs polymorphism, decision spine is-a/has-a + favor composition, diamond problem as the core 'why', animal-themed and gently absurd, tying back to the SOLID capstone. New level4.html + level4.js cloning the Level 1 quiz engine plus a Prism code panel.
- End: 2026-06-18 09:59:17 CEST | Done: Added level4.html (Prism C# code panel + Level 1 quiz shell, l4-prefixed ids), level4.js (12 read-and-predict cards across 3 sections A/B/C; diamond problem centerpiece; capstone IReporter tie-back; shared course_global_xp, level4_awarded once-only 10 XP, mermaid neutral diagrams), and a Level 4 card on index.html. Verified: node --check passes, all l4 ids wired, CSS hooks present, assets serve HTTP 200.

- Start: 2026-06-17 15:43:30 CEST | Task: Redesign Level 3 capstone milestone ladder to enforce dependency injection in small junior-friendly steps - inject the formatter (no interface, pure function), abstract+inject+swap the reporter (interface, side effect), with concept notes teaching when an interface earns its place.
- End: 2026-06-17 15:57:41 CEST | Result: Grew ladder from 5 to 7 milestones (added 'inject the formatter, don't build it' and 'prove substitutability'); tightened reporter step to require interface-typed injection and no Console. in TestRunner; added Roslyn checks for formatter injection, console-welding, and two-reporter substitution; added per-milestone 'Learn why' concept notes mapping each step to SRP/DI/DIP/OCP/LSP and the interface-vs-over-engineering rule; updated StarterCode/ReferenceSolution to inject the formatter and run both reporters. Build clean.

- Start: 2026-06-17 16:09:07 CEST | Task: Add Level-2-style 'point with the finger' interactivity to the Level 3 capstone - glow the student's own offending line in Monaco, a 'Show me where' button, and a per-milestone dependency mini-diagram.
- End: 2026-06-17 16:15:32 CEST | Result: StructuralChecks now returns CodeAnchor spans (problem/target) located via Roslyn for the student's own code (e.g. inline new TestFormatter()); added Monaco highlightSpans/clearHighlights using deltaDecorations with red/green glow + glyph-margin dots; 'Learn why' and a new 'Show me where' button now scroll to and glow the exact line; added a Mermaid mini-diagram per milestone (rendered via mermaid 10.9.1 renderMermaid interop) showing the welded->injected arrow flip; highlights cleared on Run/Check/Reset/GiveUp. Build clean.

- Start: 2026-06-17 16:16:00 CEST | Task: SOLID audit of the capstone code and atomic commits of the session's work.
- End: 2026-06-17 16:26:43 CEST | Result: Flagged StructuralChecks.Run as the flagship violation - one method parsed the code, held all 7 milestone rules, and built every anchor (SRP), with results assembled from three positionally-coupled arrays so extending it meant editing three spots in lockstep (OCP). Fixed by introducing IMilestoneRule strategies (one rule per milestone, matched by Id) and a shared CapstoneSyntax parsed once (DRY); Run() now just maps rules over Capstone.Milestones. Noted but deferred as over-engineering/higher-risk: CompilerService hint switches (idiomatic lookup), Home.razor multi-concern @code block. Committed atomically: feature baseline, then the refactor, then docs. Build clean.


- Task: Build frontend-only interactive C# OO automation learning quiz (gap-filling + hints + scoring).
- End: 2026-06-14 13:30:09 CEST
- Result: Delivered frontend-only training app with 5 C# OO automation-themed gap-fill challenges, hints, and feedback.

- Start: 2026-06-14 19:29:02 CEST | Task: Implement global Course XP across Level 1 theory, Level 1 coding, Level 2, and Level 3 with one-time awards and shared localStorage key.
- End: 2026-06-14 19:29:21 CEST | Result: Added shared course_global_xp display and progression updates on all level pages; XP is awarded once per completed item per track.

- Start: 2026-06-14 19:31:55 CEST | Task: Improve Level 1 microcoding polymorphism example to be explicit and behavior-focused for beginners.
- End: 2026-06-14 19:32:39 CEST | Result: Updated polymorphism drill to use Dog/Cat list and foreach call showing same method with different runtime outputs (Woof/Meow).

- Start: 2026-06-14 19:33:08 CEST | Task: Make Level 1 microcoding drill 9 self-contained.
- End: 2026-06-14 19:33:08 CEST | Result: Added missing ILogger, ConsoleLogger, and ReportService declarations directly in drill 9 snippet.

- Start: 2026-06-14 19:34:20 CEST | Task: Replace Level 1 final microcoding drill with a full self-contained program covering all Level 1 concepts.
- End: 2026-06-14 19:34:20 CEST | Result: Added comprehensive closing program demonstrating variables/functions, classes/objects, memory refs, encapsulation, inheritance, polymorphism, composition, and DI.

- Start: 2026-06-14 19:35:03 CEST | Task: Improve Level 1 microcoding drill 7 (Inheritance).
- End: 2026-06-14 19:35:03 CEST | Result: Reworked drill into a self-contained base/derived override example with concrete output and two guided blanks.

- Start: 2026-06-14 19:36:58 CEST | Task: Expand Level 1 drill 10 into multi-question final exam.
- End: 2026-06-14 19:36:58 CEST | Result: Increased closing drill to 7 blanks across core concepts while reusing the full integrated program.

- Start: 2026-06-14 19:40:13 CEST | Task: Add per-question "Explain this part" helper across coding levels.
- End: 2026-06-14 19:40:13 CEST | Result: Added simple-language explain toggle for each blank in Level 1 coding, Level 2, and Level 3, plus row highlight styling.

- Start: 2026-06-14 19:43:25 CEST | Task: Keep explain UX work scoped to Level 1 with dimmed-page overlay and floating code explainer card.
- End: 2026-06-14 19:43:25 CEST | Result: Level 1 explain flow now dims the page and shows a top explanation card above the code spotlight.

- Start: 2026-06-14 19:44:17 CEST | Task: Adjust Level 1 explain overlay placement to avoid covering source code.
- End: 2026-06-14 19:44:17 CEST | Result: Explanation card now opens above the code block when possible, otherwise below it.

- Start: 2026-06-14 19:45:16 CEST | Task: Remove "Simple explain" wording from Level 1 explain overlay text.
- End: 2026-06-14 19:45:16 CEST | Result: Replaced learner-facing prefix with plain "Explanation" wording.

- Start: 2026-06-14 19:46:13 CEST | Task: Make Level 1 explain overlay text code-focused (not question-focused).
- End: 2026-06-14 19:46:13 CEST | Result: Explanations now describe the code line plus nearby flow (before/after lines) without question-label guidance.

- Start: 2026-06-14 19:50:00 CEST | Task: Replace auto-generated explain text with hand-written code explanations per blank.
- End: 2026-06-14 19:50:00 CEST | Result: Every blank now has an explain field with a plain description of what that code does. Auto-generation removed.

- Start: 2026-06-14 19:55:00 CEST | Task: Numbered overlay steps with code line highlighting per step.
- End: 2026-06-14 19:55:00 CEST | Result: Each blank has a hand-written step array; hovering a step highlights the matching code line with a yellow strip.

- Start: 2026-06-15 18:42:44 CEST | Task: Redesign Level 2 as baby-step SOLID curriculum (test-automation running codebase, three-beat hook/zoom-out/micro-action rhythm). Prototype topic 1 (Single Responsibility) first.
- End: 2026-06-15 18:47:04 CEST | Result: Prototype topic 1 (S - Single Responsibility) live. Added pain/map boxes (HTML+CSS), three-beat rhythm, single test-automation running codebase. Old 5 recap drills removed.

- Start: 2026-06-15 18:55:53 CEST | Task: Level 2 fixes - add Show Answers button, fix Next (build remaining 6 SOLID drills), add SOLID intro paragraph.
- End: 2026-06-15 18:55:53 CEST | Result: Added Show answers button (fills correct answers). Built O, L-trap, L-fix, I, D-trap, D-fix drills (7 total, Next now works). Added 2-line SOLID intro on hero.

- Start: 2026-06-15 19:13:38 CEST | Task: Make every SOLID principle trap-then-fix (show the broken version before the fix), like L already did.
- End: 2026-06-15 19:13:38 CEST | Result: Added broken S, O, I drills before their fixes; retitled fixes; reframed maps as "now done right". Level 2 now 10 drills (broken+fix per S,O,L,I,D).

- Start: 2026-06-15 19:42:30 CEST | Task: Add final recap page summarizing the SOLID lesson after drill 10.
- End: 2026-06-15 19:42:30 CEST | Result: Added summary entry (11th page) with per-letter recap + closing thread to testing; render hides practice sections and shows recap; progress reads "Recap" and drills now count out of 10.

- Start: 2026-06-15 19:57:04 CEST | Task: Level 3 as Blazor WebAssembly app that compiles and runs student C# in-browser (Roslyn in WASM), SOLID capstone (test-automation theme), embedded in existing site via iframe.
- End: 2026-06-15 20:42:35 CEST | Result: Built guided gamified Level 3 capstone. 5 structural milestones (S formatter extract, S TestRunner stops formatting, D reporter interface, D inject reporter, O second reporter) detected via Roslyn syntax analysis in StructuralChecks.cs. Home.razor: progress bar, per-milestone opt-in "I'm stuck" 3-rung hint ladders (concept -> direction -> skeleton), friendly compiler-error translation (CS-code map), gated "I give up" reveal of reference solution. Builds clean; running on :5099.

- Start: 2026-06-17 14:15:34 CEST | Task: Fix compiler errors showing no line numbers + suppress cascade; link Blazor capstone from index; make it runnable on Windows.
- End: 2026-06-17 14:15:34 CEST | Result: CompilerService now attaches Line/Column to each diagnostic, shows only syntax errors when parse fails (kills the misleading namespace/boot/duplicate-Program cascade), dedupes/sorts/caps at 6. Home.razor renders a red "Line N, col M" badge + root-cause-first note. Published Blazor to level3-app/ with base href="./"; added Capstone card to index.html and back-to-selector link. Added serve.cmd/serve.sh and README HTTP-serving instructions (Blazor WASM cannot run from file://). Verified all resources serve 200 over HTTP.

- Start: 2026-06-17 14:41:48 CEST | Task: Host the site on GitHub Pages (Blazor capstone + static levels), no PAT.
- End: 2026-06-17 14:41:48 CEST | Result: Added .github/workflows/deploy.yml (CI builds Blazor with .NET 8, assembles static site + published level3-app via rsync, rewrites base href to ./, adds .nojekyll, deploys with actions/deploy-pages using built-in GITHUB_TOKEN). Added .gitignore for bin/obj/publish/level3-app. No binaries committed; every push to master republishes.
