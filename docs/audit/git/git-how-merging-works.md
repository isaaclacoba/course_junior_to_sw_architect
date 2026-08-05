# How merging works (`content/git/03-bringing-work-back/01-git-how-merging-works/`)

- **Track / Part:** Git - Part 3 Bringing work back
- **Engine / format:** viz (MemoryViz with `repo` scene, narrated)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (theory - watch only)  **Theme:** animals (cat.txt, dog.txt, feeder.txt)

## Concept(s) taught
Merging is not always the same move. When the receiving branch added nothing since the split, git slides its name forward (fast-forward). When both sides moved, git saves one new commit with two parents (merge commit).

## Card-by-card
| # | Step | Concept | What the learner sees |
|---|---|---|---|
| 1-6 | How merging works | Merge, Fast-forward, Merge commit | Watch the SAME `git merge fix` command on two graphs: one slides a name, the other saves a commit with two parents. 6 narrated steps. |

## Prerequisites
Lessons 1-5 (commits, branches, `HEAD`, making branches and committing on them). The learner has seen two lines of work grow; this lesson shows how to bring them back together.

## Complexity rung
A moderate conceptual step: from "two lines exist" to "bring them together, and the result depends on the shape." The key teaching is that the SAME command does two different things, and the learner can tell which by reading the graph.

## Covered well
- **The lesson shows the decision VISUALLY.** Steps 1-3 show a fast-forward (name slides, no new commit). Steps 4-6 show a merge commit (new commit, two parents). The comparison is the whole argument.
- Step 2's narration explicitly states the condition: "Nothing to combine - `main` is simply behind."
- Step 6's narration gives the learner the reading skill: "You can read which one you got straight off the graph, without being told."
- The `intro` names the teaching point up front: "Which one you get is not a setting you chose; it depends only on where the two names are sitting."

## Gaps / issues

**Theory mirrors practice (again).** Let me check what lesson 8 (`git-merge-a-branch`, the practical that follows) will show. From `git-content.md`:
- Lesson 8, card 1: "`main` added nothing, so no new commit appears" (fast-forward).
- Lesson 8, card 2: "`main` has its own commit; merge takes a merge commit" (two parents).

This theory lesson shows those EXACT two scenarios on the graph, with narration. Lesson 8 will show the same two scenarios on the same graph when the learner types `git merge`. The visual is identical; only the trigger differs (narration vs command).

**What this lesson DOES add over lesson 8:**
- It shows the two cases BEFORE the learner types them, so they know what to expect.
- It explains the CONDITION: "nothing to combine" vs "both sides moved."
- It names the two outcomes: "fast-forward" and "merge commit."

**But:** lesson 8's `context` prose could state the same conditions in text before the learner types the command, making the viz redundant.

**What is missing (per the new theory bar "explain the MODEL"):** This lesson shows WHAT happens (a name moves, or a commit appears) but not HOW git decides. The narration says "both sides moved" (step 4) but does not explain git's actual test: "Can I reach `fix`'s tip by following parents from `main`'s tip? No → merge commit. Yes → fast-forward."

Also missing: what the merge commit CONTAINS. The lesson shows a dot with two parents but never says "this commit holds the files from BOTH sides." Without file contents, "merge" stays abstract.

**The lesson introduces 3 concepts in 6 steps.** `gt-merge`, `gt-fast-forward`, and `gt-merge-commit` are all introduced here (per `meta.js`). That is a lot of vocabulary for a lesson whose only action is watching `git merge` run twice. The learner might remember "merging does two things" without retaining which name goes with which case.

**Actionable fixes (per `git-track-depth.md` phase 1-2: file contents + surfaces):**

1. **Add a file-diff panel showing what the merge combines.** 
   - Step 3 (after fast-forward): Show "`main` now points at a commit holding `[cat.txt, dog.txt]`. It slid forward - no new snapshot was saved."
   - Step 5 (after merge commit): Show "The new commit holds `[cat.txt, dog.txt, feeder.txt]` - the files from BOTH sides combined." This makes "merge" concrete: it is not just pointer movement, it is combining work.

2. **Explain git's test for fast-forward.**
   - Step 2 (before fast-forward): Add "Git checks: can I reach `fix` by following `main`'s parents forward? Yes - `fix` is directly ahead. So there is nothing to combine; `main` just slides to where `fix` already is."
   - Step 4 (before merge commit): Add "Git checks again: can I reach `fix` by following `main`'s parents? No - `main` added `feed the cat`, which `fix` has never seen. Git must combine the two, so it saves a new commit."

3. **Show the merge commit's two-parent structure explicitly.** Step 5's graph already draws two arrows back from the merge commit, but the narration could say: "Follow the parents back from this commit: one path leads to `feed the cat` (main's line), the other to `add dog` (fix's line). That is how this commit remembers BOTH histories."

**OR: Defer this lesson until lesson 8's cards exist, then decide if the viz adds value.** The viz-before-practice pattern works when the viz shows INTERNAL MODEL details the practice surface hides. Here, both show the same graph. The ratified decision says "theory explains the model, practice drives the tool" - this lesson currently does neither; it previews the tool's output.

## Verification status
Read-only content audit. Viz states are generated by replaying git commands through `code-lab/src/core/git-model.ts`.
