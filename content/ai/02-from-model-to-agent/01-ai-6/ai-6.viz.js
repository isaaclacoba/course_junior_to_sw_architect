// Visual for ai-6 "Memory" - a DATA-ONLY file. It uses the `memoryshelf` panel:
// a working-memory strip (the context read right now) over three long-term
// stores - episodic, semantic and procedural. It opens with the plain idea - a
// model forgets between calls, so the assistant saves what matters and recalls
// it - then shows that real memory is not one box but several kinds, each
// answering a different question, all feeding the one working context.
(function () {
  "use strict";

  const WORKING_CAP = "Working memory \u2014 the context read right now";

  window.LESSON_CONFIG = {
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
        narr: "Ask a model something and it answers well - then start a new chat and it remembers nothing. Each call begins fresh. All it ever reads is its **working memory**: the context in front of it right now.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [{ text: "hi, plan my trip", hot: true }],
          workingActive: true,
        },
      },
      {
        narr: "Working memory is the scratchpad for the task in hand. Now you mention something worth keeping - *you like an aisle seat*. But the scratchpad is the first thing to vanish when the chat rolls on or the window fills.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [{ text: "hi, plan my trip" }, { text: "I like an aisle seat", hot: true }],
          workingActive: true,
        },
      },
      {
        narr: "So the assistant **saves** it - copies the fact out of working memory into a store that lives on past this turn. That is the whole trick behind remembering you: keep what matters somewhere the next call can reach.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [{ text: "hi, plan my trip" }],
          active: "semantic",
          stores: {
            semantic: [{ text: "prefers an aisle seat", hot: true }],
          },
        },
      },
      {
        narr: "That store is one of several. Real memory splits by the kind of question it answers. **Episodic** memory holds what happened before: past turns and events, each tied to a time. \"On 3 May you booked a window seat to Oslo.\" It is the assistant's diary.",
        memoryShelf: {
          workingCaption: WORKING_CAP,
          working: [{ text: "hi, plan my trip" }],
          active: "episodic",
          stores: {
            episodic: [{ text: "3 May: booked Oslo, window seat", hot: true }],
            semantic: [{ text: "prefers an aisle seat" }],
          },
        },
      },
      {
        narr: "**Semantic** memory holds what stays true, with no date attached: facts about the world, or about you. \"You prefer an aisle seat.\" It does not matter *when* you said it - it is just true. This is where the fact you saved a moment ago belongs.",
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
        narr: "**Procedural** memory holds how to do things: the routines the assistant follows, like the steps of booking a trip. It is less \"a fact\" and more \"a habit\" - the way it knows to act.",
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
        narr: "Now a task arrives: **book my usual flight**. The assistant **recalls** the right kinds - the semantic preference and the last episodic trip - and pulls them back up into working memory, where the model can read them.",
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
        narr: "That is memory: **save** what matters, **recall** it when it counts - across four kinds of knowing. What is happening now, what happened before, what stays true, and how to act, all feeding the one working context the model reads. Save to the right store; recall the right store when it matters.",
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
