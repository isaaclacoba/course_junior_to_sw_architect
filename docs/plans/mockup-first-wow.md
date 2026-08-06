# Mockup-first - make it the way of working, once per phase
Status: done (Phase 1) - brief written AFTER the work, see Progress  -  Design: none (small, no contracts)

## Goal
Make "build a small mockup, validate the concept, then agree the architecture" a
standing rule for EVERY phase of a line of work - not a one-off at design time.
The owner's reason: validating a concept is trivially cheap, fixing an
architecture built on an unvalidated concept is not, and an unclear design is
what lets an implementation drift from it.

## Approach
Audit first, because five files already said something adjacent. They all scoped
mocking to Phase 0 and to UI only, so the fix is NOT a sixth restatement: put the
procedure in one canonical skill, turn the five into pointers, and promote the
one-line rule to always-on so it loads every turn rather than on demand.

## Plan
1. [x] Audit every existing mention of mockups across `.github/` + `AGENTS.md` - verify: 5 hits, all Phase-0 + UI-only.
2. [x] New canonical skill `.github/skills/mockup-first/SKILL.md` - verify: frontmatter parses, name matches folder.
3. [x] Promote to always-on golden rule 6; design round becomes rule 7 - verify: reads standalone, no pointer needed.
4. [x] De-pin every "golden rule 6" cross-reference so renumbering cannot rot them - verify: grep finds none pinned.
5. [x] Turn work-brief / architect / design-round prompt / learnings into POINTERS - verify: old duplicated sentence gone everywhere.
6. [x] Add the per-phase mockup gate to the work-brief Plan shape - verify: worked example in the skill.
7. [x] `auditor` bar 1 asks for a mockup + measurement behind each shape decision - verify: text in the agent file.
8. [x] Git-ignore `_mockup-*.html` and `_*-probe.html` - verify: no TRACKED file is shadowed.
9. [x] Apply it to the live object-model brief - verify: mockup gates at its steps 13 and 18.
10. [x] Journal the decision - verify: `D-wow-enforcement-8`.
11. [x] Gate - verify: `npm run gate` PASS.
12. [ ] Confirm the runtime actually surfaces `mockup-first` by description match - verify: it loads unprompted on a future phase-opening task.

## Progress
- 2026-08-06 - Audit found 5 adjacent mentions, all Phase-0 + UI-only. Chose one
  canonical skill + pointers over a sixth copy.
- 2026-08-06 - Shipped as `bb8e6a4`. Gate PASS.
- 2026-08-06 - **WoW miss, caught by the owner: this brief did not exist until
  after the work shipped.** Root cause is a seam, not just carelessness -
  `update-skills` never mentions a brief, and `work-brief` triggers on
  "feature / module / tool / refactor", which an agent-customization change does
  not read as. Neither skill claimed it. Fixed by naming the case in
  `update-skills` step 0.

## Open
- `/fleet` is not a real command - the word appears only as prose in three
  skills. The owner typed it and it silently did nothing. Decide whether to build
  it as a prompt.
- Step 12 cannot be verified from inside this session; it needs a later task to
  open a phase and see whether the skill loads on its own.
