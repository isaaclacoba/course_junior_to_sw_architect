# git-inside-names-that-move

Status: not started - Design: [git-inside-names-that-move.md](../architecture/git-inside-names-that-move.md)

## Goal

Ship lessons 6-9 of the `git-inside` theory track - the second part, covering refs, `HEAD`, the index, and immutability. Part one (5 lessons, 27 steps, EN+ES) shipped the object store; part two shows what moves and what does not.

## Approach

Four new acts (`switch`, `amend`, `reset`, `detach`) go into `code-lab/src/core/objects-scene.ts`, implemented against the existing `ObjectStore`. Lessons author against them. The visuals - refs as files, `HEAD` in both modes, the index, and orphaned objects - already render; the lesson prose describes what the learner sees.

Governing steer (D-7): elementary breadth-over-depth. The bar is part one - show the thing exists and one thing it does, then stop.

## Owns

- `docs/plans/git-inside-names-that-move.md`
- `docs/architecture/git-inside-names-that-move.md`
- `content/git-inside/02-names-that-move/**`
- `code-lab/src/core/objects-scene.ts` (the four new acts + tests)
- `code-lab/src/core/git-objects.ts` (if act implementation demands it)
- `code-lab/test/objects-scene.test.ts`

## Plan

1. [x] Add `switch` act to objects-scene - verify: unit test + a step using it renders (519 tests pass, +1 from 518)
2. [x] Add `detach` act to objects-scene - verify: unit test + a step using it renders (523 tests pass, +2 tests for detach with target and default)
3. [x] Add `amend` act to objects-scene - verify: unit test + orphan visual shows (523 tests pass, orphan assertion passes)
4. [x] Add `reset` act to objects-scene - verify: unit test + orphan visual shows (523 tests pass, orphan assertion passes)
5. [x] Scaffold L6 ref file, author prose - verify: lesson renders EN, compiles clean
6. [x] Scaffold L7 HEAD, author prose - verify: lesson renders EN, compiles clean (7 cards, 0 imperatives, PASS)
7. [x] Scaffold L8 index, author prose - verify: lesson renders EN, compiles clean (6 cards, 0 imperatives, PASS)
8. [x] Scaffold L9 immutability, author prose - verify: lesson renders EN, compiles clean (7 cards, 0 imperatives, PASS)
9. [ ] Add reflog intro card to L7 (D-10) - verify: one card, no detail, compiles clean
10. [ ] Add config intro card to L7 or L8 (D-10) - verify: one card, compiles clean
11. [ ] Add annotated tag intro card to L6 (D-10) - verify: one card, compiles clean
12. [ ] Voice L6-L9 ES - verify: `check-i18n --track git-inside` passes
13. [ ] Fix part one L5 "three kinds and no more" claim (D-13) - verify: EN+ES corrected
14. [ ] Run full gate on part two - verify: `verify-lesson --all` on L6-L9, `i18n-roundtrip` clean
15. [ ] Register lessons in course-registry, regenerate - verify: cards appear on index.html
16. [ ] Commit part two - verify: pushed to master, deploys green

## Progress

- 2026-08-07 Design round closed, 16 decisions recorded

## Open

Annotated tags are not in the act contract (`ObjectType` is `blob | tree | commit`). Adding `tag` is ~40 lines across 2 files (`git-objects.ts`, `src/index.ts`). Decision needed: add now or defer to part three?
