// Visual for ai-1 "What is an LLM?" - a DATA-ONLY file, decoupled from the
// lesson hero in ai-1.html. It drives CodeLab.MemoryViz using the AI-track
// `agent` panel: the text so far as a strip of tokens, the model core that reads
// it, and the probability of the next token. page-shell.js mounts it once, right
// under the hero.
(function () {
  "use strict";

  // The running text, as tokens. `mat` and the period are produced by the model.
  const GIVEN = ["The", "cat", "sat", "on", "the"];
  const given = (extra) =>
    GIVEN.map((t) => ({ t })).concat(extra || []);

  // Two next-token distributions - one for the slot after "the", one after "mat".
  const FAN_AFTER_THE = [
    { t: "mat", p: 0.61 },
    { t: "floor", p: 0.14 },
    { t: "rug", p: 0.1 },
    { t: "sofa", p: 0.08 },
    { t: "roof", p: 0.04 },
  ];
  const FAN_AFTER_MAT = [
    { t: '"."', p: 0.52 },
    { t: "and", p: 0.18 },
    { t: '","', p: 0.11 },
    { t: "purring", p: 0.08 },
    { t: "then", p: 0.05 },
  ];

  const core = (live) => ({ label: "LLM", sub: "next-token model", live: live });

  window.LESSON_VIZ = {
    code: [],
    legend: [
      { sw: "#16232a", label: "token the model reads" },
      { sw: "#ffd479", label: "token it just produced" },
      { sw: "#1f6f5f", label: "probability of a next token" },
      { sw: "#37d3a6", label: "the model, scoring", round: true },
    ],
    layout: {
      visual: [{ type: "agent" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "An LLM does just **one thing**: it reads the text so far and predicts what token comes next.",
        agent: { tokens: given(), caret: true, core: core(false), fan: null },
      },
      {
        narr: "A **token** is a chunk of text - roughly a word or a piece of one. For the next slot the model scores **every possible token** at once.",
        agent: { tokens: given(), caret: true, core: core(true), fan: { list: FAN_AFTER_THE } },
      },
      {
        narr: "It picks one - usually the most likely - and **appends** it to the text.",
        agent: { tokens: given(), caret: true, core: core(true), fan: { list: FAN_AFTER_THE, chosen: 0 } },
      },
      {
        narr: "Now `mat` is part of the text. The model reads the whole thing again, from the start.",
        agent: {
          tokens: given([{ t: "mat", kind: "gen" }]),
          caret: true,
          core: core(false),
          fan: null,
        },
      },
      {
        narr: "Pick, append, repeat - **one token at a time**. Each new token is chosen from a fresh set of probabilities.",
        agent: {
          tokens: given([{ t: "mat" }, { t: '"."', kind: "gen" }]),
          caret: true,
          core: core(true),
          fan: { list: FAN_AFTER_MAT, chosen: 0 },
        },
      },
      {
        narr: "That loop is the **whole model**. Everything later - prompts, chat, memory, tools, agents - is built around this one move: read the text, predict the next token.",
        agent: {
          tokens: given([{ t: "mat" }, { t: '"."' }]),
          caret: false,
          core: core(false),
          fan: null,
        },
      },
    ],
  };
})();
