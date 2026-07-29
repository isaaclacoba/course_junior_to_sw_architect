// Visual for ai-2 "Tokens" - a DATA-ONLY file. It reuses the AI-track `agent`
// panel to show how the model breaks text into tokens: common words are one
// token, longer or rarer words split into pieces, and punctuation counts too.
(function () {
  "use strict";

  // A word split into two tokens is shown by spotlighting the pieces.
  const words = (list) => list.map((t) => ({ t }));
  const hot = (list) => list.map((t) => ({ t, hot: true }));

  const SENTENCE = ["The", "cat", "sat", "on", "the", "doormat", "."];
  const TOKENS = ["The", "cat", "sat", "on", "the", "door", "mat", "."];

  const core = (live) => ({ label: "LLM", sub: "reads tokens", live: live });

  window.LESSON_VIZ = {
    code: [],
    legend: [
      { sw: "#16232a", label: "one token" },
      { sw: "#37d3a6", label: "what this step is about", round: true },
    ],
    layout: {
      visual: [{ type: "agent", fan: false }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "To you, this is a sentence made of **words**. Six words and a full stop - easy to read.",
        agent: {
          stripCaption: "A sentence, as you read it",
          tokens: words(SENTENCE),
          core: core(false),
          fan: null,
        },
      },
      {
        narr: "The model does not read words or letters. It reads **tokens** - small chunks of text, each turned into a number it can work with.",
        agent: {
          stripCaption: "The same text, as the model sees it",
          tokens: words(TOKENS),
          core: core(true),
          fan: null,
        },
      },
      {
        narr: "A common word is usually a single token. A longer or rarer word is split into pieces - here `doormat` becomes two tokens, `door` and `mat`.",
        agent: {
          stripCaption: "One word can be more than one token",
          tokens: [
            ...words(["The", "cat", "sat", "on", "the"]),
            ...hot(["door", "mat"]),
            ...words(["."]),
          ],
          core: core(true),
          fan: null,
        },
      },
      {
        narr: "Punctuation and spaces are tokens too. Nothing is free - even a full stop is a token the model reads and counts.",
        agent: {
          stripCaption: "Punctuation counts",
          tokens: [
            ...words(["The", "cat", "sat", "on", "the", "door", "mat"]),
            ...hot(["."]),
          ],
          core: core(false),
          fan: null,
        },
      },
      {
        narr: "Why care? The model's memory limit and its price are both measured in **tokens**, not words. Six words here, but eight tokens.",
        agent: {
          stripCaption: "Eight tokens",
          tokens: words(TOKENS),
          core: core(false),
          fan: null,
        },
      },
      {
        narr: "So keep this picture: everything the model reads or writes is a stream of **tokens**. Every lesson after this builds on it.",
        agent: {
          stripCaption: "Text so far \u2014 a stream of tokens",
          tokens: words(TOKENS),
          core: core(false),
          fan: null,
        },
      },
    ],
  };
})();
