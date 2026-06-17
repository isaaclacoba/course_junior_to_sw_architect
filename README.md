# C# OO Automation Gap Trainer

Frontend-only interactive exercises for colleagues practicing C# fundamentals and object-oriented basics in Android/web automation-style examples.

## What It Does

- Presents short C# snippets with missing parts.
- Learner fills blanks and checks answers.
- Shows progressive hints and immediate feedback.
- Runs fully in browser, with no compilation or execution.

## Run Locally

Most of the site is plain HTML and works by opening `index.html` directly in a
browser. The **Capstone** (live C# in the browser) is a Blazor WebAssembly app
that downloads its runtime with `fetch`, which browsers block on `file://`. So
to use the Capstone you must serve the folder over HTTP.

### Easiest way (any OS, needs Python)

- Windows: double-click `serve.cmd`
- macOS/Linux: run `./serve.sh`

Then open `http://localhost:8080` and click through the levels. Everything
(Levels 1-3 and the Capstone) works from there.

### If Python is not available

Use any static file server pointed at this folder, for example:

```
dotnet tool install --global dotnet-serve   # once
dotnet serve -p 8080                          # from this folder
```

Then open `http://localhost:8080`.

- `index.html`: level selector
- `level1.html`: Level 1 theory track (foundations)
- `level1-coding.html`: Level 1 microcoding track (1 short drill per theory topic)
- `level2.html`: core C# coding drills (short writing exercises)
- `level3.html`: applied OO automation gap-fill exercises
- `level3-app/`: Capstone (live C# compile + run, published Blazor app)

## Rebuilding the Capstone

The `level3-app/` folder is a published copy of `level3-blazor/`. After changing
the Blazor source, regenerate it with:

```
cd level3-blazor
dotnet publish -c Release -o publish
cd ..
rm -rf level3-app && cp -r level3-blazor/publish/wwwroot level3-app
sed -i 's|<base href="/" />|<base href="./" />|' level3-app/index.html
```

## Customization

Edit `app.js` and modify the `challenges` array:

- `type`: Android or Web
- `title`, `context`, `concept`
- `snippet`: include placeholders like `{{1}}`, `{{2}}`
- `blanks`: expected answer, label, and hint list

## Training Tip

Keep each challenge focused on one OO concept. Prefer 3-5 blanks each for fast review rounds.
