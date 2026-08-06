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
6. [ ] Refs, `HEAD`, index, and the point-a-ref playground - verify: moving a ref
   changes what the store means, and the folder shows it

**P2 - into the engine**
7. [ ] Port to `code-lab` as the object-store core - verify: unit tests for
   hashing, serialisation and reachability, all against real git's output
8. [ ] The scene and its three lenses - verify: view tests; re-vendor the bundle
9. [ ] Landing-page segmented control + `git-inside` track in the registry -
   verify: both sub-tracks reachable, one shared git total

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

## Open

- Six landing-page decisions raised by the plumbing audit: a fifth registry track
  becomes a fifth tab with no opt-out; the group header in the mockup has no
  markup or registry slot; segment labels need their own field; the Continue
  button and the `course_track` key both need a rule; XP is already global so
  "one shared git total" only affects done/tracked.
- The old audit reports in `docs/audit/git/` still describe the six deleted
  lessons. Leave as history, or delete those six reports? Recommend leaving them.
