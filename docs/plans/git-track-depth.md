# Git track: depth, and theory that teaches the model

Status: ratified (owner decisions D-git-track-depth-1..5) - Feature: `git-track-depth`
Supersedes the composition-B recommendation in [git-track.md](../architecture/git-track.md).

## Why

The 14-lesson track shipped and the owner reviewed it. Three complaints, all fair,
and all traceable to design choices rather than sloppy authoring:

1. **Exercises are trivial.** Measured: `mark-a-version` and `merge-a-branch` need
   ONE command; the track median is two.
2. **Theory adds nothing.** Lessons 9 and 10 read as the same lesson twice.
3. **The conflict lesson never shows a conflict.** No file text, no markers, no
   resolution - the learner is told a conflict happened and never sees one.

The causes:

- **The model has no file contents.** `Commit` is `{ id, parents, message, paths }`
  - 31 references, and the source says so outright: "no rendering and no file
  contents". A conflict therefore cannot be shown, only asserted. This is a hard
  limit, not an authoring miss.
- **Theory mirrors practice by design.** The ratified design round chose
  composition B - "the practical board, on rails" - because it made transfer free.
  It did. It also left theory with nothing practice does not already show.
- **State-based grading rewards the smallest change.** A card must end in a state
  change, so every card was built as the minimum state change that proves a point.

## Decisions (owner)

| # | Question | Chosen |
|---|---|---|
| 1 | Should the model carry file contents? | **Yes** - `Map<path, string>` |
| 2 | What is theory for? | **Theory explains the MODEL, practice drives the TOOL** |
| 3 | What should a practical card demand? | **3-6 commands with a DECISION in the middle** |
| 4 | Teach the three areas properly? | **New theory lesson in Part 1** |
| 5 | How to fix the conflict pair? | Theory shows what a conflict **is** and how it is solved; practice does a **simple, controlled** one |
| 6 | First step | **This document**, then build in phases |

## What "theory explains the model" means concretely

A theory lesson stops being a read-only copy of the practical board. It shows what
git is actually doing:

- **File text, changing.** The same three lines of `cat.txt` in the working tree,
  in the index, and inside a commit - so "the staging area" stops being a word.
- **The index as a real list**, filling and emptying, rather than a chip that says
  a filename.
- **A conflict as two versions of one file**, side by side, with the markers git
  writes - and then the resolution.

The graph stays, but as a supporting panel rather than the whole screen. The
practical lesson keeps the board it has, because that is the surface the learner
must operate.

## The model change

`RepoState` gains file text. Shape (to be confirmed in build):

- `worktree: Map<path, { status, text }>` - the text as it is on disk now.
- `index: Map<path, { text }>` - the text staged for the next commit.
- `Commit.blobs: Map<path, string>` - the text this commit saved.

Consequences to design for, not discover late:

- **Merge becomes line-level.** A 3-way merge over 3-6 line files; a conflict is
  produced when both sides changed the same LINE, and it writes real markers.
- **`git diff` becomes possible** - and is worth teaching, because it is how a
  learner checks themselves before committing.
- **`rebase -i` becomes possible** using the Monaco editor the course already
  ships (`CodeLab.MonacoEditor`, already exported) as the todo-list surface.
- **Every existing lesson keeps working**: `paths` stays derivable from `blobs`,
  so `dag-match` and `state-match` do not change shape.
- **Files stay tiny** - 3-6 lines. The point is to make the idea visible, not to
  build an editor.

## Lesson impact

| Lesson | Change |
|---|---|
| NEW, Part 1 | **The three areas** (theory). What the working tree, the index and the repository actually are, with one file's text moving between them. The single biggest gap: staging is currently explained in ONE sentence in the whole track. |
| 1 first-commit | Cards gain a decision - which of several files belongs in this commit, read before acting. |
| 3 where-am-i | Already the strongest card in the track (read `status`, commit only the right file). Use as the pattern. |
| 6 mark-a-version | 1 command today. Needs a decision: which commit deserves the tag, found by reading `log`. |
| 8 merge-a-branch | 1 command today. Give it a state to read first. |
| 9 when-changes-collide (theory) | **Rewritten.** Shows the two versions of the file, why git cannot choose, and what the markers mean. |
| 10 settle-a-conflict (practice) | **Rewritten.** A simple conflict in a controlled environment: the learner edits the file in Monaco and finishes the merge. |
| 13/14 reset | `--soft`/`--mixed`/`--hard` become visible as text moving, not chips appearing. |

## Phases

1. **Model**: contents in `RepoState` + `Commit`, `paths` derived. Line-level 3-way
   merge and real conflict markers. Unit tests first - this is where correctness
   lives.
2. **Surfaces**: a file-text panel for the theory scene; Monaco wired as the
   conflict-resolution editor in the practical.
3. **`git diff`**: the command, and the reading habit it supports.
4. **The three-areas lesson** - the biggest content gap, and it needs phase 1+2.
5. **Rework the thin cards** to the 3-6 command + decision standard.
6. **Rewrite the conflict pair** to the new theory/practice split.
7. **`rebase -i`** on Monaco, last - it depends on everything above.

## Open questions

1. **Do we keep `reset --hard` without `reflog`?** The expansion audit called this
   a real defect: the track teaches destroying work with no recovery. Recommend
   pairing them.
2. **How much of a real merge algorithm?** Recommend the simplest honest one:
   line-level, conflict when both sides touched the same line. Not git's actual
   diff3.
3. **Does `diff` get its own lesson or ride along in `where-am-i`?** Recommend
   riding along first, promoting later if it earns it.

## What this does NOT change

Remotes stay out - that seam is unchanged and still belongs to a second track (see
[git-track-expansion.md](./git-track-expansion.md)). Adding contents does not make
`push` cheap; it makes the LOCAL story teachable.
