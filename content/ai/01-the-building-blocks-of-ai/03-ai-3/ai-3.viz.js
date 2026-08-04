// Visual for ai-3 "The prompt" - a DATA-ONLY file. It reuses the `agent` panel to
// show that a prompt is just the starting tokens you give the model, which it
// then continues - and that changing the prompt changes what comes out.
(function () {
  "use strict";

  const user = (list) => list.map((t) => ({ t, kind: "user" }));
  const gen = (list) => list.map((t) => ({ t, kind: "gen" }));

  const core = (live) => ({ label: "LLM", sub: "next-token model", live: live });

  const FAN_AFTER_THE = [
    { t: "mat", p: 0.61 },
    { t: "floor", p: 0.14 },
    { t: "rug", p: 0.1 },
    { t: "sofa", p: 0.08 },
    { t: "roof", p: 0.04 },
  ];

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#37d3a6", label: "your prompt" },
      { sw: "#ffd479", label: "the model's continuation" },
      { sw: "#1f6f5f", label: "next-token probability" },
    ],
    layout: {
      visual: [{ type: "agent" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "On its own, the model has nothing to go on. You hand it a starting text - a **prompt** - and it continues from there.",
        agent: {
          stripCaption: "The prompt - the text you give the model",
          tokens: [],
          caret: true,
          core: core(false),
          fan: null,
        },
      },
      {
        narr: "Here is a prompt. These tokens are **yours** - you wrote them and handed them over.",
        agent: {
          stripCaption: "Your prompt",
          tokens: user(["The", "cat", "sat", "on", "the"]),
          caret: true,
          core: core(false),
          fan: null,
        },
      },
      {
        narr: "The model reads your prompt and predicts the next token - the exact move from the first lesson.",
        agent: {
          stripCaption: "The model reads it and predicts",
          tokens: user(["The", "cat", "sat", "on", "the"]),
          caret: true,
          core: core(true),
          fan: { list: FAN_AFTER_THE, chosen: 0 },
        },
      },
      {
        narr: "Then it keeps going, continuing your text one token at a time.",
        agent: {
          stripCaption: "It continues your text",
          tokens: [...user(["The", "cat", "sat", "on", "the"]), ...gen(["mat", "."])],
          caret: true,
          core: core(true),
          fan: null,
        },
      },
      {
        narr: "Change the prompt and you change what comes out. A different start leads somewhere completely different.",
        agent: {
          stripCaption: "A different prompt",
          tokens: [...user(["Once", "upon", "a", "time"]), ...gen(["a", "curious", "cat"])],
          caret: true,
          core: core(true),
          fan: null,
        },
      },
      {
        narr: "So the prompt is your starting text - and for a plain model, your only steering wheel. Everything it writes flows from the tokens you give it.",
        agent: {
          stripCaption: "Text so far",
          tokens: [...user(["Once", "upon", "a", "time"]), ...gen(["a", "curious", "cat", "set", "off"])],
          caret: false,
          core: core(false),
          fan: null,
        },
      },
    ],
  };
})();
