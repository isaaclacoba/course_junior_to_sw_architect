# Work Log

- Start: 2026-06-14 13:26:47 CEST
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
