---
name: ui-audit
description: >-
  Find and fix defects that only exist once a browser has laid the page out.
  USE FOR: content that renders but nobody can see; a control stuck in a loading
  state or disabled with no reason; console errors, 404s and failed requests on a
  lesson page; placeholder text ("undefined", "[object Object]", an unsubstituted
  {{token}}) reaching the UI; overlapping, clipped or off-screen elements; WCAG
  contrast, unnamed controls, tab-order and focus traps; adding a new rule to the
  auditor; investigating "it looks wrong in the browser but every check passes".
  DO NOT USE FOR: content, wording or pedagogy (use course-audit); C# example
  quality (use exemplary-lesson-code); translation round-tripping (use
  tools/i18n-roundtrip.mjs and the i18n-roundtrip skill); authoring a lesson (use
  lesson-authoring); theming (use theme-authoring).
---

# Auditing what the browser actually draws

Every other check in this repo reads source. This one reads a laid-out page. That
is the whole point: the defects it catches are invisible to a linter and obvious
to a human, and they are the ones that reach a learner.

Two shipped before this existed:

- An `example` box authored on **135 cards across 28 lessons**. The data was
  right, the engine rendered it, and the wrapper was never un-hidden. Nobody saw
  a single one of them. `validate.mjs` had been warning about the C# inside those
  examples for months, and the warnings were ignored precisely because the
  content was invisible.
- A Run button that showed one frozen "Preparing compiler..." for a 5-60 second
  WebAssembly boot and then, when the boot failed, **enabled itself and said
  "Run"** - a button that could not work, with no explanation.

Both are one command away from being caught now.

## Run it

```bash
node tools/ui-audit.mjs --all                       # every lesson + the landing page
node tools/ui-audit.mjs <lesson-dir>                # one page
node tools/ui-audit.mjs --all --only a11y           # one family
node tools/ui-audit.mjs --all --lang es             # audit the Spanish render
node tools/ui-audit.mjs --all --width 390           # a phone pass
node tools/ui-audit.mjs --all --json --report r.json
node tools/ui-audit.mjs --self-test                 # prove the auditor still works
```

Zero npm deps: it drives the system `google-chrome` over CDP through
`tools/lib/browser.mjs`, the same driver `tools/i18n-roundtrip.mjs` uses. It
serves the repo itself on an ephemeral port, so it never collides with the `8091`
you preview on. It exits non-zero on any finding, so it is usable as a gate.

Findings are grouped **by rule, not by page**. One systemic defect across ninety
pages is one thing to fix; printing it ninety times buries the other nine.

## The rules, and what each one is really about

| Family | Rule | The defect |
|---|---|---|
| runtime | `stuck-control` | a control that *claims to be working* - `aria-busy`, or a label reading `...`/`N%`/loading/preparing - and still claims it when the settle window ends |
| runtime | `placeholder-text` | `undefined`, `NaN`, `[object Object]`, an unsubstituted `{{token}}` painted as text |
| runtime | `console-error` | anything logged as an error, plus uncaught exceptions |
| runtime | `request-failed` | a failed request, or any response >= 400 |
| layout | `invisible-content` | non-empty text in a zero-size box - the example-box bug |
| layout | `offscreen` | an element hanging past the edge of the document |
| layout | `clipped` | content taller than its box with `overflow: hidden` and no way to scroll |
| layout | `overlap` | two in-flow block siblings drawn on top of each other |
| a11y | `contrast` | text under the WCAG AA floor (4.5:1, or 3:1 when large) |
| a11y | `unnamed-control` | focusable, but a screen reader can only announce its role |
| a11y | `positive-tabindex` | `tabindex > 0`, which decouples tab order from reading order |
| a11y | `focusable-hidden` | focusable inside `aria-hidden` - tabbable, but AT was told it is not there |
| a11y | `focusable-invisible` | focusable but not drawn - focus lands on nothing |

## Adding a rule (the part that matters most)

**A rule without a defect to prove it against does not count as a rule.** This
repo has been bitten more than a dozen times by a check that silently stopped
firing, and a quiet checker is indistinguishable from a clean codebase. So:

1. Add the check to `probeFn` in `tools/ui-audit.mjs`.
2. Add **one deliberate instance of that defect** to
   `tools/fixtures/ui-audit-fixture.html`, commented with the rule it trips.
3. Add the rule id to the `RULES` array in `tools/ui-audit.mjs`.
4. Run `node tools/ui-audit.mjs --self-test`. It fails unless **every** rule in
   `RULES` fires on the fixture.

The self-test earned its place immediately: it caught `focusable-hidden` never
firing, because the check required the element to be invisible and `aria-hidden`
elements are drawn - they are hidden only from assistive technology. That rule
would have shipped reporting a clean result forever.

### Every rule needs a control as well as a defect

Firing is only half of correct. A rule also has to stay **quiet** on markup that
is fine, and nothing in the self-test used to ask that. Every false positive this
tool has shipped passed the self-test without a murmur:

| False positive | What it flagged | Count |
|---|---|---|
| `focusable-invisible` | `visibility: hidden`, which leaves the tab order anyway | 803 |
| `contrast` | pale text on a dark gradient, judged against the white body | 123 |
| `contrast` | a `color-mix()` background Chrome serialises as `color(srgb ...)` | 11 |
| `placeholder-text` | the word `null` - a thing this course *teaches* | 5 |

So the fixture carries **controls** as well as defects: correct markup, each one
`id="ok-..."`, each one a false positive that actually shipped. The self-test
fails if any finding's `where` contains `#ok-`. When you add a rule, add both:
the defect it must catch and the near-miss it must not. Then break your own fix
once and watch the control fail - an assertion you have never seen fail is
decoration.

Fixing a false positive by loosening the fixture is backwards. Fix the rule.

### Write in-page code as a function, never as a template literal

The probe is a real `async function probeFn(...)` that is stringified at the call
site:

```js
const PROBE = `(${probeFn.toString()})(${JSON.stringify(families)}, ${settleMs})`;
```

It used to be a template literal, and that cost hours. A template literal
processes escapes **before the browser ever sees the code**: `\.` becomes `.`,
`\d` becomes `d`, `\s` becomes `s`. A regex written as `/\.\.\.|\d+\s*%/`
arrived in the page as `/...|d+s*%/`, where `...` matches *any three characters* -
so `stuck-control` matched a button labelled "Previous". The check looked
carefully written and was nonsense. Stringifying a real function removes the
escaping layer entirely. Do not reintroduce it.

## Reading a finding

Fix the **rule**, not the page. Almost everything here is systemic, because the
pages are generated from a handful of shared engines:

- One `contrast` hit on one card is a theme token used in one place. The same
  hit on every page is one value in `styles.css` or a `[data-theme]` block - fix
  it there and use the `theme-authoring` skill to check the other themes.
- An `invisible-content` or `clipped` hit almost always traces to
  `kernel/engine/**` or `styles.css`, not to lesson data.
- A `placeholder-text` hit is usually a binder or a `tr()` key that does not
  exist. Check `res/chrome/{en,es}.json` and the lesson's `res/strings/**`.
- A `stuck-control` hit on a build page is the compiler warming up only if it
  clears. The Run button legitimately says "Downloading compiler... 42%" ->
  "Starting compiler..." -> "Warming up..." for a few seconds; the rule polls
  until it clears. One still stuck at the end of the settle is a genuine hang.
- A wave of `offscreen`/`clipped` hits inside one component is usually a
  virtualised third-party DOM, not a defect. Monaco deliberately overflows and
  recycles rows; the probe skips `.monaco-editor, .cl-editor,
  .monaco-scrollable-element` for the layout family and still audits their outer
  box.

## Tuning, honestly

The auditor is deliberately noisier than a linter, because a false negative here
costs more than a false positive - the whole reason it exists is that months of
silence hid 135 broken cards.

If a finding is genuinely fine, **narrow the rule so it states why**, in the
probe, with a comment. Do not add a page to an ignore list: the next page with
the same defect will then be missed too. `overlap` already skips flex and grid
parents for exactly this reason - they place children side by side on purpose.

## Two traps in the harness itself

**Sample after the animations, not during them.** The hero fades in over 520ms.
Sampling before it lands reported the whole hero as `invisible-content` - fourteen
findings, all wrong. The probe awaits `document.getAnimations()` with a 3s cap, so
an infinite spinner cannot hang it.

**Serve with `Content-Length`.** `startServer` in `tools/lib/browser.mjs` writes
it explicitly. Without it node falls back to chunked encoding, and the Blazor
loader cancels its own `blazor.boot.json` request - the compiler never starts and
every build page reports a stuck Run button and a `TypeError: Failed to fetch`.
That looked exactly like a course defect for a while. When a finding appears under
this harness but not under `python3 -m http.server 8091`, suspect the harness.

## What this does not cover

Screenshot diffing against a baseline is not here. It catches unintended visual
change, which is a different job from catching a defect, and it needs a blessed
baseline per theme, per language and per viewport to be worth anything. Take a
`Page.captureScreenshot` by hand when reviewing a visual change - remember `clip`
is in **document** coordinates, so add `scrollX`/`scrollY` to a
`getBoundingClientRect()`, and use `captureBeyondViewport: true`.
