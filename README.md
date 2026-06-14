# C# OO Automation Gap Trainer

Frontend-only interactive exercises for colleagues practicing C# fundamentals and object-oriented basics in Android/web automation-style examples.

## What It Does

- Presents short C# snippets with missing parts.
- Learner fills blanks and checks answers.
- Shows progressive hints and immediate feedback.
- Runs fully in browser, with no compilation or execution.

## Run Locally

Open `index.html` in any browser.

- `index.html`: level selector
- `level1.html`: Level 1 theory track (foundations)
- `level1-coding.html`: Level 1 microcoding track (1 short drill per theory topic)
- `level2.html`: core C# coding drills (short writing exercises)
- `level3.html`: applied OO automation gap-fill exercises

## Customization

Edit `app.js` and modify the `challenges` array:

- `type`: Android or Web
- `title`, `context`, `concept`
- `snippet`: include placeholders like `{{1}}`, `{{2}}`
- `blanks`: expected answer, label, and hint list

## Training Tip

Keep each challenge focused on one OO concept. Prefer 3-5 blanks each for fast review rounds.
