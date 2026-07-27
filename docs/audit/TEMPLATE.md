# Per-lesson report template

Copy this shape for every lesson report. Keep it factual and short - it is a
map of what the lesson teaches, not a rewrite of it. Use the course voice rules
(plain, backticks for code terms, spaced hyphen, no hype, no emojis).

```markdown
# <Lesson title> (`<source-file>`)

- **Track / Part:** <Practical|Theory> - Part <n> <part name>
- **Engine / format:** <drill-engine theory | drill-engine runnable | build-engine | viz widget | checkpoint>
- **Difficulty pill:** <Gentle|Steady|Challenging|Checkpoint>  **XP cards (data-total):** <n>
- **Runnable:** <yes / no>  **Theme:** <animals | test-automation | mixed | neutral>

## Concept(s) taught
One or two sentences naming the single idea (or small set) this lesson owns.

## Card-by-card
| # | Card title | Concept | What the learner does |
|---|---|---|---|
| 1 | ... | ... | ... |
(For build lessons note the requireSource gate / hidden verify probe if present.)

## Prerequisites
Concepts/syntax the lesson assumes the learner already has, and where those were
taught (link the earlier report). Flag anything assumed-but-never-taught.

## Complexity rung
Where this sits on the ladder and the size of the step from the previous lesson
(one new idea? or several at once?).

## Covered well
What this lesson does right (pedagogy, verify probes, voice, one-idea-per-card).

## Gaps / issues
Concrete problems: untaught syntax used, ordering tension, theme inconsistency,
missing recap, missing Run button, difficulty jump, voice slips. Be specific.

## Verification status
Read-only content audit only (no compile). Note if a prior work-log entry
records a dotnet verification.
```
