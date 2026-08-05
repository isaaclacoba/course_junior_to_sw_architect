# Git grading - the three-area end-state grader

Status: **built and in use** by all 9 interactive git lessons.
Code: [kernel/grading/state-match.js](kernel/grading/state-match.js) - its header
carries the full rationale; this page records the decision, not the detail.

## Why it exists

The git widget shows a learner three zones - Working tree, Staging, Repository -
so "did you reach the target?" has to be answered for all three. The older DAG
grader answered only the Repository half, and only its shape: it signed a commit
as `[message, parentSigs]`, which ignores which files the commit touched.

Measured 2026-08-04: a learner who staged an extra file and committed it still
scored `{ok: true}`. A card teaching "staging is a choice" could not enforce the
thing it teaches. The owner's call was direct - the grader must check each area.

## The decision that shapes it

Identity and equality are kept apart, and that separation is the whole design.

- **Identity** - "which commit is this, in the other repo?" - stays
  `[message, parents]`. `git-progress` uses that signature to decide what to
  ghost and what counts as diverged. Folding file paths into it would redefine
  identity: a half-staged commit would stop matching its target twin, so the
  graph would flag false divergence mid-exercise and the ghost would jump.
- **Equality** - "is it the same in every respect?" - is this module's job, and
  it runs after identity is settled. For each target commit matched by
  signature, compare file lists; then compare staging, then the working tree.
  Nothing here feeds back into ghosting.

## Contract

```
stateMatch({ actual, target }, opts) -> { ok, area, reason }
  area   : "repository" | "staging" | "worktree" | null when ok
  reason : a short factual sentence naming what differs - never a command to type
  opts.expected : override, e.g. { index: [...], worktree: [...] }, for a card
                  whose goal is a staging state rather than a commit
  opts.areas    : which areas to check, default all three
```

Pure function over data - no DOM, no `CodeLab`. UMD, like its grader siblings.

## Two corrections found by using it

- **Only reachable commits are indexed.** `bySignature()` walks from the refs
  (`collectReachable`). Before that, an amended commit left dangling was still in
  `state.commits`, so a learner could be graded against the mistake they had just
  replaced.
- **`reason` never prescribes.** It names what differs and stops. Telling the
  learner the command to type would grade and solve in the same breath.

## Known limit

The model stores file *paths*, not file *contents*, so this grader cannot check
what is inside a file - only which files are where. That is why the conflict
lesson leans on the merge state rather than on edited text. Adding contents is
tracked as its own piece of work; the exit criterion there is that `paths` stays
derivable, so this grader keeps working unchanged.
