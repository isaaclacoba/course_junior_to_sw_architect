# Inside git - content plan (syllabus, pace, concept graph)

Design: [git-inside-track.md](../architecture/git-inside-track.md). Brief:
[git-inside-track.md](./git-inside-track.md). Decisions: journal
`git-theory-track`. Mirrors the practical track's [git-content.md](./git-content.md).

## The four rules every lesson obeys

1. **Do not go around the commands.** The track is never ORGANISED by commands -
   no lesson is titled after one, and the learner never types one. But where a
   principle IS a command's doing, the command is named. Lesson 1 shows the
   repository `git init` just made, and says so.
2. **Close by naming what you deferred**, and which lesson pays it back. An empty
   picture with no promise reads as laziness.
3. **One new concept per lesson**, ~15 for the track. A lesson needing two is
   usually two lessons, or one of them belongs to a neighbour.
4. **5-7 steps.** A lesson that cannot fill five steps merges into its neighbour.
   Every step must change the picture or change what the picture MEANS.

## Track shape

`objects` scene throughout. `L` = lens. Concepts are `gt-` and introduced once.

| # | Lesson id | The question it owns | L | Concept | Names |
|---|---|---|---|---|---|
| **Part 1 - things with names made of content** ||||||
| 1 | `hidden-folder` | What did that one command just make? | f | `gt-git-folder` | `git init` |
| 2 | `names-from-content` | Why does git name things by their bytes? | f | `gt-content-address` | `git hash-object` |
| 3 | `blob` | Where did your file's name go? | f | `gt-blob` | - |
| 4 | `tree` | What remembers it was called `notes.md`? | c | `gt-tree` | - |
| 5 | `commit-object` | What is a save actually made of? | b | `gt-commit-object` | `git commit` |
| **Part 2 - names that move** ||||||
| 6 | `ref-file` | Why is making a branch instant? | f | `gt-ref-file` | `git branch` |
| 7 | `head-file` | How does git know where you are? | f | `gt-head-file` | `git switch` |
| 8 | `index-file` | What is the staging area, as a file? | f | `gt-index-file` | `git add` |
| 9 | `immutable` | Edit one line - what does git change? | c | `gt-immutable` | - |
| **Part 3 - the store over time** ||||||
| 10 | `reachable` | What makes something still there? | c | `gt-reachable` | - |
| 11 | `copies-not-moves` | Why does a rewritten save get a new name? | c | `gt-rewrite` | `git rebase`, `git commit --amend` |
| 12 | `packfile` | Is every version really its own file? | f | `gt-packfile` | `git gc` |
| **Part 4 - more than one copy** ||||||
| 13 | `clone` | What does copying a repository copy? | b | `gt-clone` | `git clone` |
| 14 | `remote-ref` | How can git know you are ahead of them? | f | `gt-remote-ref` | `git fetch` |
| 15 | `recap` | What is a repository, then? | b | - | - |

## Progression rationale

- **The store is built bottom-up, and nothing is used before it is built.** A
  commit (5) cannot be explained before a tree (4), which cannot be explained
  before a blob (3), which needs content addressing (2). Part 1 is the only part
  whose order is forced; the rest could be reordered and deliberately are not.
- **Difficulty steps up twice.** At 9, where the learner must hold "nothing is
  ever changed" against everyday experience of editing files. And at 11, the
  first lesson whose subject is something that did NOT happen - the original
  objects are still there, and nothing points at them.
- **Parts 3 and 4 are existence-and-shape.** Packfiles, gc, remotes and rebase
  are in scope so a learner knows they exist and roughly what they do to the
  store. No lesson goes into delta encoding or the wire protocol.
- **Every part closes on `both`** except part 2, whose ideas are all files.

## Concept graph

Fourteen new `gt-` ids, one per lesson but the recap. They do not collide with
the twenty the practical track owns, and where the two tracks meet they stay
deliberately separate: practice owns `gt-staging-area` (the pile you are about to
save), this track owns `gt-index-file` (the file that holds it). Same for
`gt-branch` (a line of work) against `gt-ref-file` (41 bytes on disk).

`gt-object-store` was introduced in the first draft of lesson 1 and is now folded
into `gt-git-folder` - one concept per lesson.
