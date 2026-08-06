# Inside git - design of record

Brief: [git-inside-track.md](../plans/git-inside-track.md). Mockup:
[poc-git-theory.html](../../poc-git-theory.html). Decisions: journal
`git-theory-track`. Supersedes the theory half of
[git-track-depth.md](../plans/git-track-depth.md).

## What it is

A second git track, `git-inside`, shown by a segmented control inside the Git tab
next to the practical one, under the name **Inside git**. It explains what a
repository is MADE OF. It is standalone - a learner may open it having never used
git - and it contains **no commands anywhere**, which is what keeps it from being
the practical track with a cutaway view.

## Contract: the scene - one, with three lenses

A step declares `lens: "folder" | "chain" | "both"` over one `StoreState`.

| Lens | Answers | Used when the lesson is about |
|---|---|---|
| `folder` | Where does this live, what is in it? | a new kind of FILE in `.git` |
| `chain` | Who names whom? | a RELATIONSHIP between objects |
| `both` | Are these two pictures the same? | the first complete save, and each part recap |

Author-chosen per step; no learner toggle - the caption and the picture must
always agree. One data shape and one resolver, so the lenses cannot drift.

## Contract: the object store

- Real SHA-1 over the real object format (`blob 12\0hello world\n`), via
  `crypto.subtle`. The id on screen is what `git hash-object` prints on the
  learner's machine. **This is a hard requirement, not a nicety** - the whole
  track rests on "the name comes from the content", and a fake hash makes that an
  article of faith.
- Objects are `blob | tree | commit`. Names are `refs/*` files holding one id,
  plus `HEAD` holding a ref name. The index is a path-to-id list.
- Nothing is ever mutated. Reachability is a walk from the refs.
- This is a NEW model, beside `git-model.ts`, not an extension of it. The
  practical model is a commit DAG with display-only hashes and cannot carry this.

## Contract: the playground

One widget, three levels, no commands: type content and see its real id; assemble
a tree from blobs and a commit from a tree; point a ref at a different object and
read what the repository now means.

## Concept ownership

The practical track owns the command vocabulary (`gt-branch`, `gt-head`,
`gt-merge`, `gt-reset`, ...) - moved there when the old theory lessons were
deleted. Inside git owns only internals ids, and where the two meet they use
DIFFERENT ids: practice owns `gt-staging-area` (the pile), theory owns the index
file. `gt-parent` was dropped with the old lessons and returns here.

## Syllabus - 15 lessons, and the question each owns

| # | Title | Owns | Lens |
|---|---|---|---|
| 1 | What is in that hidden folder? | what `.git` holds before you save anything | folder |
| 2 | Why does git name things by their contents? | content addressing | folder + hash |
| 3 | Where did your file's name go? | a blob holds content and nothing else | folder |
| 4 | What remembers that it was called `notes.md`? | trees carry names | chain |
| 5 | What is a save actually made of? | commit = tree + parent + message | both + build |
| 6 | Why is making a branch instant? | a ref is a file holding one id | folder + ref |
| 7 | How does git know where you are? | `HEAD` names a ref | folder |
| 8 | What is the staging area, as a file? | the index | folder |
| 9 | Does editing a line change anything git kept? | objects are immutable | chain |
| 10 | What makes something still there? | reachability | chain |
| 11 | Why does a rewritten save get a new name? | rewriting copies; originals orphan | chain |
| 12 | Is every version really its own file? | packfiles | folder |
| 13 | What does copying a repository copy? | clone = objects + refs | both |
| 14 | How can git know you are ahead of them? | `refs/remotes/*` is your record | folder |
| 15 | What is a repository, then? | recap; carries the success question | both |

## Tests

`code-lab` unit tests: hashing, blob/tree/commit serialisation and reachability,
each asserted against output real git produces. Plus view tests for the three
lenses. No lesson is authored before these pass.

## Success signal

One end-of-track question answerable only if the object model landed - a colleague
force-pushed over your commit; is it gone, and how would you know?

## Out of scope

Zlib framing beyond the one line the hash needs, delta encoding inside packfiles,
submodules, worktree plumbing, `rebase --onto`, the reflog file format.
