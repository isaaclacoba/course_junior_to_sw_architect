// Visual for ai-14 "Retrieval" - a DATA-ONLY file. It uses the `retrieval` panel:
// a store of document chunks the model was never trained on, a question turned
// into a vector, similarity scores against every chunk, the closest few pulled
// into the context, and the answer grounded in them. This is retrieval-augmented
// generation (RAG) - how an agent works with knowledge bigger and fresher than
// its window.
(function () {
  "use strict";

  const DOCS = [
    "Unopened items may be returned within 30 days for a full refund.",
    "Opened or used items cannot be returned unless they are faulty.",
    "Warranty covers manufacturing defects for one year.",
    "Gift cards are non-refundable.",
    "Standard delivery takes 3 to 5 business days.",
  ];
  const QUERY = "can I return a used blender after 40 days?";

  // Similarity scores once the query is embedded (0..1). The two policy chunks
  // about returns sit closest; delivery and gift cards are far off.
  const SCORED = [0.88, 0.83, 0.36, 0.19, 0.12];

  const store = (opts) =>
    DOCS.map((text, i) => ({
      text,
      score: opts && opts.scored ? SCORED[i] : undefined,
      state: opts && opts.match ? (opts.match.includes(i) ? "match" : "dim") : "idle",
    }));

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#ffd479", label: "the closest chunks - retrieved" },
      { sw: "#37d3a6", label: "the grounded answer", round: true },
    ],
    layout: {
      visual: [{ type: "retrieval" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "The model was never trained on this - your returns policy, split into small **chunks**. It cannot fit the whole library into its context, and it has not memorised any of it. So we keep the text in a **store** the agent can search.",
        retrieval: { caption: "The knowledge store", docs: store() },
      },
      {
        narr: "A question comes in. Before searching, we turn it into an **embedding** - a list of numbers, a **vector**, that captures its meaning. Every chunk in the store was turned into a vector the same way, once, ahead of time.",
        retrieval: {
          caption: "Turn the question into a vector",
          query: QUERY,
          docs: store(),
        },
      },
      {
        narr: "Now compare vectors. Chunks whose meaning sits **close** to the question score high; unrelated ones score low. This is **similarity search** - matching on meaning, not exact words, so \"used blender after 40 days\" finds the passages about \"used items\" and the \"30-day\" window even with almost no words in common.",
        retrieval: {
          caption: "Score every chunk by similarity",
          query: QUERY,
          docs: store({ scored: true }),
        },
      },
      {
        narr: "Keep the **top few** - the closest chunks - and drop the rest. These are what gets pulled into the context. This is the **retrieval** in retrieval-augmented generation: fetch the handful of passages that matter, not the whole document.",
        retrieval: {
          caption: "Retrieve the closest chunks",
          query: QUERY,
          docs: store({ scored: true, match: [0, 1] }),
        },
      },
      {
        narr: "The model reads the question **with those chunks in front of it** and answers from the text, not from memory: used items can't be returned, and even unopened ones only within 30 days - so 40 days is past the window. Grounded in a real source it could even quote.",
        retrieval: {
          caption: "Answer grounded in the retrieved text",
          query: QUERY,
          docs: store({ scored: true, match: [0, 1] }),
          answer: "No - used items can't be returned, and unopened ones only within 30 days. 40 days is past the window.",
        },
      },
      {
        narr: "That is retrieval: turn the question into a vector, find the closest chunks, put them in the context, and answer from them. It is how an agent works with knowledge far bigger than its window - and far fresher than its training. The **semantic memory** from the memory lesson is usually a retrieval store just like this.",
        retrieval: {
          caption: "Retrieval-augmented generation",
          query: QUERY,
          docs: store({ scored: true, match: [0, 1] }),
          answer: "No - used items can't be returned, and unopened ones only within 30 days. 40 days is past the window.",
        },
      },
    ],
  };
})();
