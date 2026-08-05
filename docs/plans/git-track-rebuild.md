# Git track rebuild - the end-to-end plan

Follows [the audit](../audit/git/README.md) (14 reports, both auditors NO-GO) and
the ratified decisions in [git-track-depth.md](./git-track-depth.md).

## What the audit actually means

Three reframes I missed the first time, each of which changes the plan:

**1. The theory lessons are not structurally redundant - they are redundant in
execution.** Every one already OWNS concepts its practical does not:

| Theory lesson | Concepts it owns | What it currently does instead |
|---|---|---|
| history-of-snapshots | `gt-parent`, `gt-history` | narrates lesson 1's graph again |
| what-a-branch-is | `gt-branch`, `gt-head` | previews lesson 5's graph |
| how-merging-works | `gt-merge`, `gt-fast-forward`, `gt-merge-commit` | previews lesson 8's graph |
| when-changes-collide | `gt-conflict` | asserts a conflict happened |
| what-reset-moves | `gt-reset` | shows chips appearing/disappearing |

So the fix is not "add a file-contents panel" - that is a mechanism. Each lesson
must answer ONE question that its practical cannot, and the panel is how. Naming
those questions is the work:

| Lesson | The question it owns |
|---|---|
| history-of-snapshots | Does a commit store a CHANGE or a whole SNAPSHOT? (the common wrong answer is "a diff") |
| what-a-branch-is | If a branch is only a name, what happens to the files when I switch? |
| how-merging-works | Why do two different things happen when I merge, and what decides which? |
| when-changes-collide | What exactly is git looking at when it says it cannot decide? |
| what-reset-moves | Where do my files GO in each of the three modes? |

**2. Lesson 1 already owns `gt-working-tree` and `gt-staging-area`** and explains
them in one sentence. A new three-areas lesson must TAKE those concepts, and
lesson 1 must drop to `revisits` - the same handoff that `gt-branch`/`gt-head`
needed between lessons 4 and 5. Getting this wrong fails `validate.mjs`.

**3. Step count is not content.** The theory lessons run 5-6 steps each and the
auditors judged the extra steps padding - 1-2 real ideas stretched. Deepening
theory means more IDEAS, not more slides.

## Phases

Each phase is shippable on its own and leaves the track green.

### Phase 0 - stop saying something untrue (hours)

`git-undo-with-reset` `task.3.context` tells the learner `--hard` "can lose work
you cannot get back". `git reflog` gets it back.

- Rewrite that sentence in `data.js`, `en.json` and `es.json`.
- **Done when:** no lesson claims a destructive operation is unrecoverable.
- **Verify:** `verify-lesson`, and grep the track for "cannot get back".
- **Risk:** none. One string in three files.

### Phase 1 - make the cards demand a decision (data only)

No engine change. Per-card, concretely:

| Lesson / card | Today | Becomes |
|---|---|---|
| mark-a-version 1+2 | `git tag v1` - 1 command | Start from 4 commits. Read `git log --oneline`, tag the release commit, then tag an earlier one by revision. **3 commands, one choice.** |
| merge-a-branch 1 | `git merge fix` - 1 command | Two candidate branches. Read `git log` to find which one is behind, merge that one. |
| first-commit 1+3 | no decision | Read `git status` first; card 3 chooses which of three files belong together. |
| make-a-branch 1 | `git branch feature` | Branch at an OLDER commit, found by reading the log. |
| point-at-a-commit 1+2 | goal states `HEAD~1` | State the goal in words; the learner derives the revision. |
| undo-with-reset 1-3 | each card names the mode | State the OUTCOME wanted; the learner picks `--soft`/`--mixed`/`--hard`. |
| fix-the-last-commit 1 | names the typo | Two typos; read the log to find which is actually last. |

- **Done when:** every practical card is 3-6 commands AND at least one command is
  a read whose result changes what the learner types next.
- **Verify:** `verify-lesson` on all 14, plus a re-count of commands per card.
- **Risk:** low. Every change is `start`/`target`/`solution` + prose.

### Phase 2 - the model gains file text

- `worktree` and `index` entries carry text; `Commit` gains `blobs`.
- **`paths` stays derivable from `blobs`** - only 3 call sites read it
  (`state-match.js`, `git-progress.js`), and they must not change shape.
- LCS line alignment, then 3-way merge; a conflict is an OVERLAP, and it writes
  `diff3`-style markers showing the ancestor.
- **Done when:** all 380+ code-lab tests pass, all 14 lessons still verify
  unchanged, and a unit test proves a one-line insertion does NOT conflict.
- **Verify:** unit tests first, then the full lesson sweep.
- **Risk:** highest phase. Mitigation: `paths` compatibility is an exit criterion,
  not an afterthought.

### Phase 3 - surfaces

- A file-text panel for the theory scene (working tree / index / commit, side by
  side).
- Monaco wired as the conflict-resolution editor in the practical.
- `git diff` as a command - and it earns **no lesson**: it becomes the read step in
  the deepened cards and the spine of the three-areas lesson.
- **Done when:** a theory step can show the same file in three states, and a
  learner can edit a conflicted file and finish the merge.

### Phase 4 - rebuild the five theory lessons

Each to the question it owns (table above). Steps go up only where a real idea is
added.

- **Done when:** for each theory lesson, a one-sentence answer to "what does this
  show that the practical does not" that is not "the same board earlier".

### Phase 5 - the two missing lessons

- **The three areas** (Part 1, after first-commit). Takes `gt-working-tree` and
  `gt-staging-area` from lesson 1, which drops to `revisits`.
- **`reflog`** (Part 4, **before** `what-reset-moves`). Needs a ref-move log in
  the model - no file contents required, so it is NOT blocked on phase 2 and can
  move earlier if you want the `--hard` story honest sooner.
- **Done when:** the track is 16 lessons and no destructive command is taught
  before its recovery.

### Phase 6 - `rebase -i`

Monaco as the todo-list surface. Last, because it needs contents, the editor, and
a learner who already understands merge.

## Contradictions I had left open, now resolved

| Question | Answer |
|---|---|
| Where does `reflog` go? | **Before** the reset lessons, not last. The audit is right and my phase list was wrong. It does not need file contents, so it is not gated on phase 2. |
| Fix the `--hard` sentence now, or pull `--hard` until `reflog` ships? | **Fix the sentence now** (phase 0). Pulling a command the learner will meet on day one is worse than describing it honestly. |
| Does `git diff` get a lesson? | **No.** It is the read step in phase 1's cards and the spine of the three-areas lesson. |
| Does `history-of-snapshots` survive? | **Yes**, but only once it answers "snapshot or diff?". If phase 4 cannot give it a real question, merge it into lesson 1 and drop to 15 lessons. |

## What we are not doing

Remotes, `rebase --onto`, `cherry-pick`, `stash`. The seam is unchanged - see
[git-track-expansion.md](./git-track-expansion.md). Adding file contents makes the
LOCAL story teachable; it does not make `push` cheap.

## Order of work

0 -> 1 -> 2 -> 3 -> 4, with 5's `reflog` half movable to straight after phase 1,
and 6 last. Phases 0 and 1 need no engine work and fix the two things a learner
would notice today.
