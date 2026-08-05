# Git track depth - design of record

Brief: [git-track-rebuild.md](./git-track-rebuild.md). Evidence:
[audit](../audit/git/README.md). Decisions: journal `git-track-depth` D-1..11.
Supersedes the composition-B recommendation in
[git-track.md](../architecture/git-track.md).

## Decisions

| # | Question | Chosen |
|---|---|---|
| 1 | Model carries file contents? | **Yes** - `Map<path, string>` |
| 2 | What is theory for? | Theory explains the **MODEL**, practice drives the **TOOL** |
| 3 | What must a card demand? | **3-6 commands with a DECISION** in the middle |
| 4 | Teach the three areas? | **New theory lesson**, Part 1 |
| 5 | Conflict pair? | Theory shows what a conflict **is**; practice does a simple controlled one |
| 7 | `reflog`? | **Mandatory** wherever work can be lost; sits **before** the reset pair |
| 8 | How real is the merge? | **LCS alignment + 3-way merge + `diff3` markers** |
| 9 | `git diff` a lesson? | **No** - a habit inside cards. Track 14 -> 16, not 21 |
| 11 | The `--hard` falsehood? | **Fix the sentence**, do not pull the command |

## Contract: the model (P2)

- `Commit.blobs: Map<path, string>`; `index` and `worktree` entries carry text.
- **`Commit.paths` stays derivable from `blobs`.** Only `state-match.js` and
  `git-progress.js` read it (3 sites) and their shape must not change. Hard exit
  criterion for P2.
- **Merge is three layers.** Naive line-index comparison is WRONG: one insertion
  shifts every line below and the file falsely conflicts end to end.
  1. LCS line alignment - match lines by content, not index.
  2. 3-way merge against the ancestor; a conflict is only an **overlap**.
  3. `diff3`-style markers, which show the ancestor. Not an algorithm choice - a
     display one, and seeing what the line WAS is what explains why git cannot
     decide.
- Files stay 3-6 lines. The point is to make the idea visible, not to build an
  editor.

## Contract: what each theory lesson owns (P4)

Each answers ONE question its practical cannot. Anything that only replays the
practical's board is the defect being fixed.

| Lesson | The question it owns |
|---|---|
| history-of-snapshots | Does a commit store a CHANGE or a whole SNAPSHOT? |
| what-a-branch-is | If a branch is only a name, what happens to my files when I switch? |
| how-merging-works | Why do two different things happen on merge, and what decides which? |
| when-changes-collide | What exactly is git looking at when it says it cannot decide? |
| what-reset-moves | Where do my files GO in each of the three modes? |

## Contract: card depth (P1)

A card is done when it is 3-6 commands AND at least one is a read whose result
changes what the learner types next.

| Lesson / card | Today | Becomes |
|---|---|---|
| mark-a-version 1+2 | 1 command | 4 commits; read `log`, tag the release, then tag an earlier one by revision |
| merge-a-branch 1 | 1 command | Two candidate branches; read `log` to find which is behind |
| first-commit 1+3 | no decision | Read `status` first; card 3 picks which files belong together |
| make-a-branch 1 | no decision | Branch at an OLDER commit, found in the log |
| point-at-a-commit 1+2 | goal states `HEAD~1` | State the goal in words; learner derives the revision |
| undo-with-reset 1-3 | names the mode | State the OUTCOME; learner picks the mode |
| fix-the-last-commit 1 | names the typo | Two typos; read the log to find the last |

## Concept ownership move

Lesson 1 currently introduces `gt-working-tree` and `gt-staging-area` and explains
them in ONE sentence. The three-areas lesson takes both; lesson 1 drops to
`revisits`. Missing this fails `validate.mjs`, exactly as the
`gt-branch`/`gt-head` handoff did.

## Out of scope

Remotes, `rebase --onto`, `cherry-pick`, `stash` - see
[git-track-expansion.md](./git-track-expansion.md). File contents make the LOCAL
story teachable; they do not make `push` cheap.
