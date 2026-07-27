# Programs that talk (`theory-19.viz.js`)

- **Track / Part:** Theory - Part 3 How software runs and connects
- **Engine / format:** viz widget (`window.LESSON_VIZ`, mounted by `page-shell.js`; board scene with heap region, GPIO pin as the wire out)
- **Difficulty pill:** Gentle  **XP cards (data-total):** 1
- **Runnable:** no (step-through visual, no Run button)  **Theme:** neutral

## Concept(s) taught
How programs talk over a `network`. One program asks (the `client`) and another
answers (the `server`); the client sends a `request` and gets back a `response`
that lands in its memory as data. A server only offers a fixed set of things you
may ask for and how to ask - that list is its `API`.

## Card-by-card
One `LESSON_VIZ` run of five steps; no code, a `Response` object appears on the
heap when the answer arrives.

| # | Step | Concept | What the learner does |
|---|---|---|---|
| 1 | Programs are networked | network | See the wire out to other computers. |
| 2 | Client and server | who asks, who answers | Read the customer/waiter analogy. |
| 3 | Request goes out | request | Watch a `GET /prices` leave over the wire. |
| 4 | Response comes back | response | See a `Response` object land in RAM. |
| 5 | The menu | API | Read that a server offers a set list of requests. |

## Prerequisites
Builds on [theory-15.md](theory-15.md) (data lands in RAM as an object) and the
Part 1 idea of separate machines. No syntax; introduces network, client,
server, request, response, API.

## Complexity rung
Light and well-scoped: five short steps, one client/server round trip. The
smallest lesson in Part 3, a gentle close before the checkpoint.

## Covered well
- One clean round trip: request out, response back into memory as usable data.
- The waiter/menu analogies fit the audience without hiding the real terms.
- Ties the response back to the memory model - it arrives as a heap object.

## Gaps / issues
- **Dead sibling file.** `theory-19.js` exists but `theory-19.html` loads only
  `theory-19.viz.js`. Manifest lists both; only the viz is live.
- No in-lesson check; retention rests on the Part 3 checkpoint.
- The HTML pulls in Mermaid, but this viz renders no diagram - an unused
  dependency on the page.

## Verification status
Read-only content audit (no compile). The `Response` fields are display-only.
Confirmed from the HTML that the viz widget is the live lesson.
