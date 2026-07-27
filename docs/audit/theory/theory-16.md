# References vs values (`theory-16.viz.js`)

- **Track / Part:** Theory - Part 3 How software runs and connects
- **Engine / format:** viz widget (`window.LESSON_VIZ`, mounted by `page-shell.js`; board scene with stack + heap)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
Why some variables hold their data directly and others hold an address. Every
slot holds bits; for a `value type` (`int`) those bits are the data, for a
`reference type` (`Dog`) those bits are an address pointing to an object on the
heap. The `type` decides which, not the size. Copying then differs: copying a
value type duplicates the data (independent copies), copying a reference type
duplicates the address (both names reach the one object).

## Card-by-card
One `LESSON_VIZ` run of six steps over a fixed 5-line `code` snippet.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | `int count = 5` | value type | See the bits `5` sit directly in the slot. |
| 2 | `new Dog("Rex")` | reference type | See the object on the heap; `pet` holds its address. |
| 3 | Follow the arrow | reference = address by value | See the pointer reach the real `Dog`. |
| 4 | `int b = count` | copy a value | See the `5` duplicated into `b`'s own slot. |
| 5 | `b = 9` | independent copies | See `count` stay `5` while `b` becomes `9`. |
| 6 | `Dog friend = pet` | copy a reference | See both names point at the one `Dog`. |

## Prerequisites
Directly builds on [theory-15.md](theory-15.md) (stack, heap, addresses,
`new`). Reuses the same board+stack+heap layout, so the learner already knows
how to read the picture. Assumes `int` and an object with a field from Part 2
(see [theory-10.md](theory-10.md)); no new syntax.

## Complexity rung
A focused follow-on to lesson 15: one idea (bits-are-data vs bits-are-address)
carried through copy semantics. Smaller and tighter than 15 because it reuses
its scene and adds a single distinction.

## Covered well
- Honest model: states plainly that a reference is an address stored by value,
  avoiding the common "objects are magic" hand-wave.
- The copy contrast (steps 4-6) is the payoff and is shown side by side.
- Reuses lesson 15's layout, so no new visual vocabulary to learn.

## Gaps / issues
- **Dead sibling file.** `theory-16.js` exists but `theory-16.html` loads only
  `theory-16.viz.js`. Manifest lists both; only the viz is live.
- No in-lesson check; retention rests on the Part 3 checkpoint. The mutation
  claim in step 6 ("change it through either name and the other sees it") is
  told, not shown - the `Dog`'s field is not actually mutated in the run.

## Verification status
Read-only content audit (no compile). Snippet and slot values are display-only.
Confirmed from the HTML that the viz widget is the live lesson.
