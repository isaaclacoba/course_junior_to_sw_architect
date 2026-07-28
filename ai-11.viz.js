// Visual for ai-11 "Memory, deeper: the four kinds" - a DATA-ONLY file. It uses
// the `memoryshelf` panel: a working-memory strip (the context read right now)
// over three long-term stores - episodic, semantic and procedural. The intro
// memory lesson (ai-6) treated memory as one box; this one shows that a real
// agent keeps several, each answering a different question, and pulls the right
// ones back into working memory when a task arrives.
(function () {
  "use strict";

  const WORKING_CAP = "Working memory \u2014 the context read right now";

  window.LESSON_VIZ = {
    code: [],
    legend: [
      { sw: "#cfe8df", label: "a remembered item" },
      { sw: "#ffd479", label: "the store in focus right now" },
      { sw: "#37d3a6", label: "just saved or recalled", round: true },
    ],
    layout: {
      visual: [{ type: "memoryshelf" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "In the intro, **memory** was one box: save a fact, recall it later. Real agents split it into kinds - because *how happened before*, *what stays true*, and *how to do a thing* are different questions, kept in different places.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [{ text: "hi, plan my trip" }],
          workingActive: true,
        },
      },
      {
        narr: "**Working memory** is what sits in the context right now - the scratchpad for the task in hand. It is the fastest to reach and the first to vanish when the window fills. Everything below feeds into it.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [{ text: "hi, plan my trip", hot: true }],
          workingActive: true,
        },
      },
      {
        narr: "**Episodic** memory holds what happened before: past turns and events, each tied to a time. \"On 3 May you booked a window seat to Oslo.\" It is the agent's diary.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [{ text: "hi, plan my trip" }],
          active: "episodic",
          stores: {
            episodic: [{ text: "3 May: booked Oslo, window seat", hot: true }],
          },
        },
      },
      {
        narr: "**Semantic** memory holds facts that stay true, with no date attached: what the world is like, or what you prefer. \"You like an aisle seat.\" It does not matter *when* you said it - it is just true.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [{ text: "hi, plan my trip" }],
          active: "semantic",
          stores: {
            episodic: [{ text: "3 May: booked Oslo, window seat" }],
            semantic: [{ text: "prefers an aisle seat", hot: true }],
          },
        },
      },
      {
        narr: "**Procedural** memory holds how to do things: the routines and skills the agent follows, like the steps of booking a trip. It is less \"a fact\" and more \"a habit\" - the way it knows to act.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [{ text: "hi, plan my trip" }],
          active: "procedural",
          stores: {
            episodic: [{ text: "3 May: booked Oslo, window seat" }],
            semantic: [{ text: "prefers an aisle seat" }],
            procedural: [{ text: "to book: search \u2192 pick \u2192 confirm", hot: true }],
          },
        },
      },
      {
        narr: "Now the task needs answering: **book my usual flight**. The agent recalls the *right* kinds - the semantic preference and the last episodic trip - and pulls them up into working memory, where the model can read them.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [
            { text: "book my usual flight" },
            { text: "prefers an aisle seat", hot: true },
            { text: "last trip: Oslo", hot: true },
          ],
          workingActive: true,
          active: ["episodic", "semantic"],
          stores: {
            episodic: [{ text: "3 May: booked Oslo, window seat" }],
            semantic: [{ text: "prefers an aisle seat" }],
            procedural: [{ text: "to book: search \u2192 pick \u2192 confirm" }],
          },
        },
      },
      {
        narr: "That is the shape of real memory: four kinds of knowing - what is happening now, what happened before, what stays true, and how to act - all feeding the one working context the model reads. Save to the right store; recall the right store when it counts.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [
            { text: "book my usual flight" },
            { text: "prefers an aisle seat" },
            { text: "last trip: Oslo" },
          ],
          stores: {
            episodic: [{ text: "3 May: booked Oslo, window seat" }],
            semantic: [{ text: "prefers an aisle seat" }],
            procedural: [{ text: "to book: search \u2192 pick \u2192 confirm" }],
          },
        },
      },
    ],
  };
})();
