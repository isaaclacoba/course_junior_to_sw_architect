// Visual for ai-10 "Sampling and temperature" - a DATA-ONLY file. It sits in Part
// five (after "System and user messages") and reuses the next-token probability
// fan from lesson 1. The model does not always take the top candidate; it samples
// from the spread, and temperature reshapes that spread: low sharpens it (steady
// picks), high flattens it (varied picks). Same prompt, different answers. No
// engine change.
(function () {
  "use strict";

  const user = (list) => list.map((t) => ({ t, kind: "user" }));
  const gen = (list) => list.map((t) => ({ t, kind: "gen" }));

  const core = (sub, live) => ({ label: "LLM", sub: sub, live: live });
  const PROMPT = ["The", "sky", "at", "sunset", "turned"];

  // The raw spread the model produces for the next word.
  const SPREAD = [
    { t: "orange", p: 0.42 },
    { t: "pink", p: 0.24 },
    { t: "red", p: 0.16 },
    { t: "gold", p: 0.10 },
    { t: "grey", p: 0.08 },
  ];
  // Low temperature sharpens the spread: the top word gets almost all the weight.
  const PEAKED = [
    { t: "orange", p: 0.88 },
    { t: "pink", p: 0.05 },
    { t: "red", p: 0.04 },
    { t: "gold", p: 0.02 },
    { t: "grey", p: 0.01 },
  ];
  // High temperature flattens it: lower-ranked words get a real chance.
  const FLAT = [
    { t: "orange", p: 0.30 },
    { t: "pink", p: 0.26 },
    { t: "red", p: 0.22 },
    { t: "gold", p: 0.13 },
    { t: "grey", p: 0.09 },
  ];

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#8fb7ab", label: "the prompt so far" },
      { sw: "#1f6f5f", label: "each candidate's probability" },
      { sw: "#ffd479", label: "the word it sampled this time", round: true },
    ],
    layout: {
      visual: [{ type: "agent" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "Back to the model's guess from lesson one: given the text so far, it produces a **spread** of next words, each with a probability.",
        agent: {
          stripCaption: "The prompt so far",
          tokens: user(PROMPT),
          caret: true,
          core: core("scores the next word", true),
          fan: { list: SPREAD, caption: "Probability of the next word" },
        },
      },
      {
        narr: "It does not always take the top one. It **samples** - picks a word according to those probabilities. A dial called **temperature** decides how boldly it strays from the favourite.",
        agent: {
          stripCaption: "It samples from the spread",
          tokens: user(PROMPT),
          caret: true,
          core: core("about to sample", true),
          fan: { list: SPREAD, caption: "Probability of the next word" },
        },
      },
      {
        narr: "Turn the temperature **down** and the spread sharpens: the top word gets almost all the weight, so the model nearly always picks it. Steady, predictable answers.",
        agent: {
          stripCaption: "Low temperature - the spread sharpens",
          tokens: [...user(PROMPT), ...gen(["orange"])],
          caret: false,
          core: core("plays it safe", false),
          fan: { list: PEAKED, chosen: 0, caption: "Low temperature" },
        },
      },
      {
        narr: "Turn it **up** and the spread flattens: lower-ranked words get a real chance. Here it lands on `pink` instead - more variety, but less safe.",
        agent: {
          stripCaption: "High temperature - the spread flattens",
          tokens: [...user(PROMPT), ...gen(["pink"])],
          caret: false,
          core: core("takes a chance", false),
          fan: { list: FLAT, chosen: 1, caption: "High temperature" },
        },
      },
      {
        narr: "Run it again at high temperature and you can get a different word entirely - `red` this time. This is why the same prompt gives different answers on different tries.",
        agent: {
          stripCaption: "Same prompt, a different roll",
          tokens: [...user(PROMPT), ...gen(["red"])],
          caret: false,
          core: core("takes a chance", false),
          fan: { list: FLAT, chosen: 2, caption: "High temperature" },
        },
      },
      {
        narr: "So temperature trades reliability for variety. Keep it **low** for factual, repeatable work; raise it for brainstorming and creative writing. Same probabilities underneath - just how boldly the model picks from them.",
        agent: {
          stripCaption: "Low for steady, high for creative",
          tokens: user(PROMPT),
          caret: true,
          core: core("scores the next word", false),
          fan: { list: SPREAD, caption: "Probability of the next word" },
        },
      },
    ],
  };
})();
