# Inside git - brief

Status: in progress  -  Design: [git-inside-track.md](../architecture/git-inside-track.md)

## Goal

A second git track, parallel to the practical one, that explains what a repository
is made of - to a learner who has never used git. It must not mimic the practical
track, so it contains no commands at all: it opens the `.git` folder and shows the
objects, with real SHA-1 ids the learner can check against their own machine.

## Approach

Engine first, but delivered as an **increasingly functional mockup** with the owner
reviewing at every stage - `poc-git-theory.html` gets wired up a layer at a time
until it is the real thing, and only then does it move into `code-lab`. This is a
direct response to the last git effort, where two days of work landed as a
surprise. No stage is longer than one review.

## Plan

**P0 - clear the ground**
1. [x] Delete the six `viz` theory lessons; re-home their concepts - verify:
   `validate.mjs` 0 errors, `check-i18n` PASS, `verify-lesson` on all 6 touched
   lessons, 527 tests pass, git track = 11 cards
2. [ ] Commit P0 on its own - verify: `npm run gate` PASS

**P1 - mockup, wired one layer at a time** (owner reviews each)
3. [x] Real hashing in the mockup - verify: 10 vectors taken from real git all
   reproduce, including the empty blob and a non-ASCII one
4. [x] Real object store - blob, tree, commit built from typed content - verify:
   `_verify-store.mjs` 22/22 against real git, tree sort order included
5. [x] All three lenses rendering from one `StoreState` - verify: a six-step
   scenario in `poc-git-theory.html`, each step declaring its lens
6. [x] Refs, `HEAD`, index, and the point-a-ref playground - verify: an 8-step
   scenario reaches two commits, a parent chain and the index; moving the ref
   makes the store itself report which saves nothing reaches. Level two of the
   playground (assemble a tree and a commit by hand) is deferred to P2.

**P2 - into the engine**
7. [ ] Port to `code-lab` as the object-store core - verify: unit tests for
   hashing, serialisation and reachability, all against real git's output
8. [ ] The scene and its three lenses - verify: view tests; re-vendor the bundle
9. [ ] `git-inside` in the registry + the landing group - verify: both
   sub-tracks reachable, selection remembered, Continue follows the selected one
10. [ ] Glossary gains its missing git section - verify: `gt-` concepts appear

**P3 - lessons, reviewed per part**
10. [ ] Part 1 (5 lessons) - verify: `verify-lesson` EN+ES on each, owner review
11. [ ] Part 2 (4 lessons) - verify: same
12. [ ] Part 3 (3 lessons) - verify: same
13. [ ] Part 4 (3 lessons) - verify: same, plus the end-of-track question

## Progress

- 2026-08-06 Design round with the owner: 23 decisions recorded to the journal
  under `git-theory-track`; mockup at `poc-git-theory.html`
- 2026-08-06 P0 done - six theory lessons deleted, 10 concepts re-homed to the
  practicals, `gt-parent` dropped; git track down to 11 pure-terminal lessons
- 2026-08-06 P1 steps 3-5 done - `poc-git-store.js` reproduces real git's ids
  (22/22), and the mockup steps a real store through all three lenses
- 2026-08-06 P1 done - the landing section runs on the real course data (tabs,
  segment, per-sub-track bar and Continue, selection remembered under one key);
  8-step scene with parent chain and index; ref-pointing playground

## Open

- The old audit reports in `docs/audit/git/` still describe the six deleted
  lessons. Leave as history, or delete those six reports? Recommend leaving them.
