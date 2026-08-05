# Your first commit (`content/git/01-first-steps/01-git-first-commit/`)

- **Track / Part:** Git - Part 1 First steps
- **Engine / format:** git (practice - terminal + live graph)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 3
- **Runnable:** yes (graded by DAG state-match)  **Theme:** animals (cat.txt, dog.txt, bird.txt)

## Concept(s) taught
The foundation of git: a repository is where snapshots live, staging is where you choose what to save, and a commit is one saved version. Three commands to make the first history appear.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Start a repository and save something in it | Repository | Type `git init`, `git add cat.txt`, `git commit -m "add cat"` - 3 commands, straight sequence. |
| 2 | Pick what goes in | Staging is a choice | Stage `cat.txt` and `dog.txt` (leave `notes.md` out), commit as `"add the pets"` - 2 commands, requires choosing. |
| 3 | Save a second version on top | History is a chain | Stage `dog.txt` and commit `"add dog"` on top of existing `"add cat"` - 2 commands, straight sequence. |

## Prerequisites
None - this is the first git lesson. Assumes familiarity with files and folders, and that a command line exists.

## Complexity rung
The very first git lesson. Three cards introduce the core cycle (stage, commit, repeat) in isolation before any branching or reading commands.

## Covered well
- Card 2 is the only one with a real decision: read the file list, choose the two that belong, leave `notes.md` out.
- The `context` prose names the three areas (Working tree, Staging, Repository) and says files move between them.
- Grading checks the commit message exactly, teaching that the message matters.
- Summary recap (`summaryItems`) defines all four concepts cleanly.

## Gaps / issues

**The three areas are NAMED but not EXPLAINED.** Card 1 `context` says:
> "`git add` puts a file on the list for the next save, under Staging. `git commit -m` saves that list as one snapshot, and it moves to Repository."

This tells WHERE files go but not WHAT the areas are. The concept `def`s in `res/strings/default/en.json` are one sentence each:
- `gt-working-tree.def`: "Your files as they are right now, before you have told git about them."
- `gt-staging-area.def`: "The short list of files you have picked for the next commit, so you choose what goes in instead of saving everything."
- `gt-repository.def`: "The folder git is watching, together with every snapshot you have saved in it."

These are glossary entries, not teaching prose. The owner's complaint "I cannot see anywhere explained what the staging area is" is confirmed: the lesson introduces the terms but never shows how the three areas work together or why staging exists as a separate step.

**Card 1 and 3 have no decision.** Card 1's solution is a 3-command straight sequence typed in order. Card 3 is 2 commands with one file already present - the learner cannot make a mistake. Per the owner's bar (3-6 commands with a DECISION), these are too thin.

**Actionable fixes:**
1. **Card 1**: Start with `cat.txt`, `dog.txt`, and `notes.md` already present (as card 2 does). Require the learner to run `git status` FIRST to see all three untracked, then decide to stage only `cat.txt` for the first commit. Solution becomes: `git init`, `git status`, `git add cat.txt`, `git commit -m "add cat"` (4 commands, includes reading and choosing). Target remains the same DAG state, so grading is unchanged.
2. **Card 3**: Start with 4 commits already in the history. Require the learner to run `git log --oneline` first to see what exists, then identify that the `"fix the feeder"` commit is missing and add it on top. Solution becomes: `git log --oneline`, `git add feeder.txt`, `git commit -m "fix the feeder"` (3 commands, includes reading). This previews the `log` command that lesson 3 teaches, and makes card 3 a decision rather than typing from memory.
3. **Three-areas explanation**: This is the missing theory lesson flagged in `git-track-depth.md` - not fixable within this lesson alone. Note it as a dependency.

## Verification status
Read-only content audit. No compile check (git lessons are data-only; the git runtime is in `code-lab/src/core/git-model.ts` and tested there).
