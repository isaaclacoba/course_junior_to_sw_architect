# Inside git - content plan (syllabus, pace, concept graph)

Design: [git-inside-track.md](../architecture/git-inside-track.md). Brief:
[git-inside-track.md](./git-inside-track.md). Decisions: journal
`git-theory-track`. Mirrors the practical track's [git-content.md](./git-content.md).

## The four rules every lesson obeys

1. **Do not go around the commands.** The track is never ORGANISED by commands -
   no lesson is titled after one, no learner types one. But where a principle IS
   a command's doing, the command is named.
2. **Close by naming what you deferred**, and which lesson pays it back.
3. **One new concept per lesson**, ~15 for the track.
4. **5-7 steps.** A lesson that cannot fill five merges into its neighbour, and
   every step must change the picture or change what the picture MEANS.

## Track shape

`objects` scene throughout. Lens: f=folder, c=chain, b=both. Every fact in the
last column was checked against real git 2.34, not assumed.

| # | Lesson | Concept | Names | What it puts on screen |
|---|---|---|---|---|
| **Part 1 - things with names made of content** |||||
| 1 | What is in that hidden folder? | `gt-git-folder` | `init`, `add` | The whole real skeleton; `HEAD` holding `ref: refs/heads/main`; two files of yours that do not cross |
| 2 | Why does git name things by their contents? | `gt-content-address` | `hash-object` | `blob 12\0hello world\n` -> `3b18e51...`; same bytes give the same name; change one letter and all forty change |
| 3 | Where did your file's name go? | `gt-blob` | - | A blob holds content and NOTHING else - no name, no date, no author. Two files with identical text are ONE object |
| 4 | What remembers it was called `notes.md`? | `gt-tree` | - | A tree entry: `100644 notes.md` plus the blob id. A folder is a tree naming a tree |
| 5 | What is a save actually made of? | `gt-commit-object` | `commit` | The commit's five lines - tree, parent, author, committer, message. Follow them down to your bytes |
| **Part 2 - names that move** |||||
| 6 | Why is making a branch instant? | `gt-ref-file` | `branch` | `refs/heads/main` is **41 bytes**: forty hex characters and a newline |
| 7 | How does git know where you are? | `gt-head-file` | `switch` | `HEAD` rewritten from one ref name to another. Detached HEAD is the id itself, with no name in between |
| 8 | What is the staging area, as a file? | `gt-index-file` | `add` | `.git/index` is **binary** - it starts with `DIRC`. `git ls-files --stage` reads it out: `100644 <blob> 0 notes.md` |
| 9 | Edit one line - what does git change? | `gt-immutable` | - | Two blobs, two trees, two commits. The FIRST blob is untouched and still there |
| **Part 3 - the store over time** |||||
| 10 | What makes something still there? | `gt-reachable` | - | The walk from every name. Point `main` one save back and three objects go unreachable while staying on disk |
| 11 | Why does a rewritten save get a new name? | `gt-rewrite` | `amend`, `rebase` | Amend: old id `7c0da92`, new id `34ed54e`. The old commit is still readable and no longer reachable |
| 12 | Is every version really its own file? | `gt-packfile` | `gc` | Three loose objects become one `.pack` and one `.idx`, and the loose files are gone |
| **Part 4 - more than one copy** |||||
| 13 | What does copying a repository copy? | `gt-clone` | `clone` | A second store beside yours holding the same ids - because the ids come from the content |
| 14 | How can git know you are ahead of them? | `gt-remote-ref` | `fetch` | `refs/remotes/origin/main` - your written note of where they were when you last looked |
| 15 | What is a repository, then? | - | - | Objects and names, whole, in one picture. Carries the end-of-track question |

## Progression rationale

- **Part 1's order is forced and nothing else's is.** A commit (5) needs a tree
  (4) needs a blob (3) needs content addressing (2). The later parts could be
  reordered and deliberately are not - each closes a question part 1 opened.
- **Difficulty steps up twice.** At 9, holding "nothing is ever changed" against
  the everyday experience of editing a file. At 11, the first lesson whose
  subject is something that did NOT happen.
- **Parts 3 and 4 are existence-and-shape**: a learner should know packfiles, gc,
  remotes and rewriting exist and what they do to the store. No delta encoding
  and no wire protocol.

## Concept graph

Fourteen new `gt-` ids, one per lesson but the recap, none colliding with the
twenty the practical track owns. Where the tracks meet they stay separate on
purpose: practice owns `gt-staging-area` (the pile you are about to save), this
track owns `gt-index-file` (the binary file that holds it); practice owns
`gt-branch` (a line of work), this track owns `gt-ref-file` (41 bytes on disk).
