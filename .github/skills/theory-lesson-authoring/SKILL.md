---
name: theory-lesson-authoring
description: >-
  Write or fix a THEORY-track lesson in this course - the tracks that EXPLAIN how
  something works rather than have the learner do it (`git-inside`, and any future
  "inside X" track). USE FOR: authoring a theory lesson's cards; fixing a lesson
  that "teaches nothing", repeats itself, or reads like a tutorial; deciding what a
  card is allowed to claim; grounding facts against the real tool before writing;
  reviewing a theory lesson against the owner's bar. DO NOT USE FOR: lesson
  mechanics - meta.js/data.js shape, archetypes, XP, the generated flow (use
  lesson-authoring); practical/build lessons where the learner writes code (use
  lesson-authoring + exemplary-lesson-code); engine or scene work (see
  copilot-instructions); prose voice in general (that is AGENTS.md).
---

# Authoring a theory lesson

A theory lesson EXPLAINS a system. The learner is not performing anything - they
are being shown how the thing works. That single fact decides the voice, and it
is the rule that was broken most often before it was written down.

Read `AGENTS.md` first for the course's general prose voice. Everything here is
in addition to it, and specific to theory tracks.

## The five rules, in the order they get broken

### 1. Describe, do not instruct

The practical track tells the learner to do something. A theory track never does.

| Practical voice (WRONG here) | Theory voice |
| --- | --- |
| "Now put a file in a folder. A second tree appears." | "A row can lead to another tree, and that is what a folder is." |
| "Edit that buried file and watch how far it travels." | "Because names come from contents, a change never stays where it happened." |
| "Try it on a 100KB file: append one character and..." | "One extra character on a 100KB file stores a second complete copy." |

It is measurable, so measure it rather than judging by feel:

```bash
python3 - <<'PY'
import re, glob
IMP = re.compile(r'(?:^|[."] )(Now |Watch |Try |Read |Edit |Change |Run |Open |Make |Put |Call |Add |Look |Save )', re.M)
for f in sorted(glob.glob("content/<track>/**/*.viz.js", recursive=True)):
    narrs = re.findall(r'narr: "((?:[^"\\]|\\.)*)"', open(f, encoding="utf-8").read())
    hits = [m.group(1).strip() for n in narrs for m in IMP.finditer(n)]
    print(f"{f.split('/')[-2]:38s} {len(narrs)} cards  imperatives: {len(hits):2d} {sorted(set(hits))}")
PY
```

Target is **0**. A learner-directed imperative in a theory card is a defect, not a
style preference.

### 2. Every card must teach something the card before it did not

The worst lesson this track has shipped had two good cards and four that restated
"the file name is not inside the blob" and then deferred to the next lesson.

Before writing, list the cards as one line each saying what is NEW. If two lines
say the same thing, the lesson has one card, not two. A card whose only content is
"the next lesson explains this" is not a card.

### 3. Every card must change what is on screen, and never describe what is not

A `viz` lesson whose picture is identical for six cards teaches nothing, however
good the prose is. Two failures to watch for, both of which shipped:

- **Static visual.** Six cards, one unchanging row.
- **Narrating what is not drawn.** "Read a row in full: `100644`, the name, the
  id" - while the mode appeared nowhere in the visual. The owner's response was
  "are these the inode? the visualization never shows it anywhere."

If a card's prose names a thing, that thing is on screen in that card. If the
scene cannot show it, either extend the scene or cut the claim.

### 4. Simplify, never contradict

> "there is a difference between lying and simplifying"

"A tree is a list" is not a simplification - an entry can point at another tree,
which is the exact property the word names. The test: **would the learner have to
unlearn this later?** If yes it is a lie, and lies get caught by the reader who is
paying most attention.

Same trap for a word the course itself overloads. This track's thesis is "an
object's name IS its content hash", so a widget label reading `(unnamed)` next to
narration saying "its name is `3b18e51`" is a straight contradiction. It now reads
"nothing points here", which is what it meant.

### 5. Teach the subject, not its neighbours

A card decoding Unix permissions (`644` = readable by everyone, writable by you)
was teaching Unix in a git lesson. Say only the part the subject actually uses -
git keeps one bit, whether a file is executable.

Related: do not use a shorthand the audience may not have (`chmod +x` -> "file
permissions"). This track's reader is assumed to know nothing about the subject.

## Ground every fact before you write it

Every number, id and count in a theory lesson is checked against the real tool
first, and the verified values go in a comment at the top of the `.viz.js` so the
next session does not have to re-derive them. This is what makes the lessons worth
reading: the learner can reproduce any claim.

```bash
cd /tmp && rm -rf probe && mkdir probe && cd probe && git init -q .
# ... build the exact scenario the card describes, then read the real values
```

Grounding is also where the real content comes from. The blob lesson went from
"restates that the name is missing" to a real lesson only because a terminal
session turned up facts nobody would guess: hashing the file's own bytes gives the
wrong id, an edit stores a second complete copy, and identical files write nothing
at all.

If the widget cannot reproduce the tool's values exactly, that is an engine bug,
not a rounding difference. Add a test pinning our output to the real tool's.

## Checks to run, in order

`node tools/generate.mjs` is **mandatory and first** - the generated `index.html`
bakes the hero intro, so editing prose without regenerating leaves stale text on
screen and every other check passes.

```bash
node tools/generate.mjs
node tools/verify-lesson.mjs content/<track>/<part>/<lesson>
node tools/check-voice.mjs content/<track>
node tools/check-i18n.mjs --track <track>
VALIDATE_DRIFT=1 node tools/validate.mjs   # never pipe to `tail -1`; the drift
                                           # NOTE prints ABOVE the summary
node --test test/
```

## Two rendering traps

- **A concept `def` is painted with `textContent`** (`kernel/page-shell/concepts.js`),
  so `**bold**` ships as literal asterisks. Narration DOES render `**` and
  backticks - never raw `<strong>` in either.
- Card prose lives in `data.js`/`*.viz.js` for EN and in `res/strings/default/es.json`
  for ES. Both change together, or the Spanish keeps the old lesson.
