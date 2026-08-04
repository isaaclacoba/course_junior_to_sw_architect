// Visual for ai-4 "Context" - a DATA-ONLY file. It reuses the `agent` panel to
// show that context is everything the model can see right now, and that adding
// context turns a spread-out guess into a confident answer.
(function () {
  "use strict";

  const ctx = (list) => list.map((t) => ({ t, kind: "context" }));
  const user = (list) => list.map((t) => ({ t, kind: "user" }));

  const core = (live) => ({ label: "LLM", sub: "next-token model", live: live });

  // No context: near-flat guesses. The model has never heard of Luna.
  const FAN_COLD = [
    { t: "food", p: 0.15 },
    { t: "fish", p: 0.13 },
    { t: "meat", p: 0.12 },
    { t: "tuna", p: 0.1 },
    { t: "plants", p: 0.09 },
  ];

  // With context: one answer dominates.
  const FAN_WARM = [
    { t: "tuna", p: 0.86 },
    { t: "fish", p: 0.06 },
    { t: "food", p: 0.03 },
    { t: "meat", p: 0.03 },
    { t: "milk", p: 0.02 },
  ];

  const QUESTION = user(["What", "does", "Luna", "eat", "?"]);
  const FACTS = ctx(["Luna", "is", "a", "cat", ".", "Luna", "loves", "tuna", "."]);

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#37d3a6", label: "your question" },
      { sw: "#8fb7ab", label: "context you added" },
      { sw: "#1f6f5f", label: "how sure the model is" },
    ],
    layout: {
      visual: [{ type: "agent" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "Ask this cold and the model can only guess. It has never heard of Luna, so every answer looks about as likely as the next.",
        agent: {
          stripCaption: "A question with no context",
          tokens: QUESTION,
          caret: true,
          core: core(true),
          fan: { list: FAN_COLD, chosen: 0 },
        },
      },
      {
        narr: "Now add a couple of facts before the question. Everything the model can see right now - this whole text - is its **context**.",
        agent: {
          stripCaption: "Context: everything the model can see",
          tokens: [...FACTS, ...QUESTION],
          caret: true,
          core: core(false),
          fan: null,
        },
      },
      {
        narr: "With those facts in front of it, the answer is clear. It is the same model as before, now with more to read.",
        agent: {
          stripCaption: "The same question, now with context",
          tokens: [...FACTS, ...QUESTION],
          caret: true,
          core: core(true),
          fan: { list: FAN_WARM, chosen: 0 },
        },
      },
      {
        narr: "Take the context away and it is back to guessing. The model has no other memory - it cannot recall Luna once she is off the strip.",
        agent: {
          stripCaption: "Remove the context, and the knowledge is gone",
          tokens: QUESTION,
          caret: true,
          core: core(true),
          fan: { list: FAN_COLD, chosen: 0 },
        },
      },
      {
        narr: "Context is more than your latest question - it is the whole conversation so far, plus anything you add, like a document or a rule to follow. Get that right and the model has what it needs.",
        agent: {
          stripCaption: "Context, filled in",
          tokens: [...FACTS, ...QUESTION],
          caret: true,
          core: core(true),
          fan: { list: FAN_WARM, chosen: 0 },
        },
      },
      {
        narr: "So **context** is the text the model can read at this moment - nothing more. The model keeps no memory beyond it, and that space is not unlimited.",
        agent: {
          stripCaption: "Context: the model's whole field of view",
          tokens: [...FACTS, ...QUESTION],
          caret: false,
          core: core(false),
          fan: null,
        },
      },
    ],
  };
})();
