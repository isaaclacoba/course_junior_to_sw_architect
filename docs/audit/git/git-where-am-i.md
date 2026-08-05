# Where am I? (`content/git/01-first-steps/03-git-where-am-i/`)

- **Track / Part:** Git - Part 1 First steps
- **Engine / format:** git (practice - terminal + live graph)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 2
- **Runnable:** yes (graded by DAG state-match)  **Theme:** animals (cat.txt, dog.txt, bird.txt, feeder.txt, notes.md)

## Concept(s) taught
The habit of asking before acting: `git status` shows what is staged or untracked right now, `git log` shows what was committed before. Both cards end in a commit that can only be solved correctly by reading first.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | Ask before you save | `git status` | Run `git status`, read that `dog.txt` and `notes.md` are waiting, stage only `dog.txt`, commit as `"add dog"` - 3 commands, requires reading and choosing. |
| 2 | Read the history you already have | `git log` | Run `git log --oneline`, read the 3 existing commits, then stage `feeder.txt` and commit `"fix the feeder"` on top - 3 commands, requires reading. |

## Prerequisites
Lesson 1 (`git-first-commit`) and lesson 2 (`git-a-history-of-snapshots`). The learner knows `git add`, `git commit`, and that commits chain. This lesson adds the reading commands that precede those actions.

## Complexity rung
A small step: from "type commands" to "ask, read the answer, then type commands." Both cards require the learner to parse command output and make a choice.

## Covered well
- **Both cards have decisions.** Card 1 forces reading: `dog.txt` and `notes.md` are both present, and only `dog.txt` belongs in the commit. Card 2 forces reading: 3 commits already exist, and the learner must see them before adding the 4th.
- **This is the pattern the owner wants.** The `git-track-depth.md` note says "Use as the pattern" - a card that cannot be solved without looking is exactly what the trivial cards lack.
- Each `solution` array includes the reading command (`git status`, `git log --oneline`) before the action commands, teaching the habit explicitly.
- The `context` prose explains what each command shows: `status` = "what is going on right now", `log` = "what happened before."

## Gaps / issues

**Card 2's decision is weak.** The learner runs `git log --oneline` to see 3 commits, then commits a 4th. There is no CHOICE - the goal says "add the next one," so reading the log confirms the state but does not inform a decision. The card would pass if the learner skipped `git log` entirely and went straight to `git add feeder.txt; git commit -m "fix the feeder"`.

Compare to card 1: reading `git status` is NECESSARY because two files are waiting and the learner must choose one. Card 2's reading is confirmatory, not decisive.

**Hash is introduced but not used.** Card 2 introduces `gt-hash` (per `meta.js`), and the `context` says:
> "each with its message and its **hash**: the short code git uses as that commit's name."

But the learner never types a hash, never points at a commit by hash, and never needs the concept in this lesson or the next 3 lessons. It is taught abstractly, then idle until lesson 12 (`git-point-at-a-commit`). This is a forward reference with no immediate payoff.

**Actionable fixes:**
1. **Card 2: Make reading decisive.** Start with 5 commits in the history, where the most recent is `"oops - broke the feeder"`. The goal is to FIND the commit before the breakage (by reading `git log --oneline`) and tag it `last-good` (previewing `git tag` from lesson 6). Solution: `git log --oneline`, `git tag last-good HEAD~1`. This requires reading, counting, and deciding WHICH commit gets the tag. It moves `gt-tag` introduction earlier (currently lesson 6), but makes the decision real.
2. **Defer `gt-hash` introduction to lesson 6 or 12**, where it is first used functionally (lesson 6 shows tags as an alternative to hashes; lesson 12 teaches `HEAD~n` as a hash reference). Introducing it here with no application teaches vocabulary, not a skill.

## Verification status
Read-only content audit. Git lessons are data-only; the runtime is in `code-lab/src/core/git-model.ts`.
