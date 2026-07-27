// Visual for ai-6 "Memory" - a DATA-ONLY file. It reuses the `agent` panel to
// show how an assistant beats the context window: save an important fact to a
// store outside the window, then recall it back into the context when it is
// needed. Builds directly on the context (ai-4) and window (ai-5) lessons.
(function () {
  "use strict";

  const ctx = (list) => list.map((t) => ({ t, kind: "context" }));
  const ctxHot = (list) => list.map((t) => ({ t, kind: "context", hot: true }));
  const dropped = (list) => list.map((t) => ({ t, kind: "dropped" }));
  const user = (list) => list.map((t) => ({ t, kind: "user" }));

  const core = (live) => ({ label: "LLM", sub: "sees only the context", live: live });

  const FACT = ["Luna", "loves", "tuna", "."];
  const FILLER = ["We", "chatted", "for", "a", "while", "."];
  const QUESTION = ["What", "does", "Luna", "eat", "?"];

  const FAN_COLD = [
    { t: "food", p: 0.15 },
    { t: "fish", p: 0.13 },
    { t: "meat", p: 0.12 },
    { t: "tuna", p: 0.1 },
    { t: "plants", p: 0.09 },
  ];
  const FAN_WARM = [
    { t: "tuna", p: 0.86 },
    { t: "fish", p: 0.06 },
    { t: "food", p: 0.03 },
    { t: "meat", p: 0.03 },
    { t: "milk", p: 0.02 },
  ];

  window.LESSON_VIZ = {
    code: [],
    legend: [
      { sw: "#8fb7ab", label: "in the context (readable now)" },
      { sw: "#5f7b74", label: "dropped from the window" },
      { sw: "#37d3a6", label: "saved / recalled from memory", round: true },
    ],
    layout: {
      visual: [{ type: "agent" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "Early in a chat you tell the assistant something worth keeping: Luna loves tuna.",
        agent: {
          stripCaption: "A fact worth remembering",
          tokens: ctxHot(FACT),
          caret: true,
          core: core(false),
          fan: null,
        },
      },
      {
        narr: "The assistant copies that fact into **memory** - a store that lives outside the context window, so it survives no matter how long the chat runs.",
        agent: {
          stripCaption: "Saved to memory",
          tokens: ctxHot(FACT),
          caret: true,
          core: core(false),
          fan: null,
        },
      },
      {
        narr: "The chat rolls on. The window fills up and that early fact drops off the start - exactly what you saw in the last lesson.",
        agent: {
          stripCaption: "The window forgets it",
          tokens: [...dropped(FACT), ...ctx(FILLER)],
          windowLabel: "context window",
          caret: true,
          core: core(false),
          fan: null,
        },
      },
      {
        narr: "Now you ask: what does Luna eat? The fact is out of the window, so the model on its own is back to guessing.",
        agent: {
          stripCaption: "The fact is out of view",
          tokens: [...dropped(FACT), ...ctx(FILLER), ...user(QUESTION)],
          windowLabel: "context window",
          caret: true,
          core: core(true),
          fan: { list: FAN_COLD, chosen: 0 },
        },
      },
      {
        narr: "But it is still in memory. The assistant looks it up and drops it back into the context, right where the model can read it.",
        agent: {
          stripCaption: "Recalled from memory",
          tokens: [...ctx(FILLER), ...ctxHot(FACT), ...user(QUESTION)],
          caret: true,
          core: core(true),
          fan: { list: FAN_WARM, chosen: 0 },
        },
      },
      {
        narr: "That is all memory is: **save** what matters, and **recall** it into the context when it is relevant. It is how an assistant seems to remember you across a long chat - well past what the window alone can hold.",
        agent: {
          stripCaption: "Memory: save, then recall when needed",
          tokens: [...ctx(FILLER), ...ctxHot(FACT), ...user(QUESTION)],
          caret: false,
          core: core(false),
          fan: null,
        },
      },
    ],
  };
})();
