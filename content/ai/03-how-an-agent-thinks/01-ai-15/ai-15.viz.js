// Visual for ai-15 "Reasoning" - a DATA-ONLY file. It uses the `transcript` panel
// to show chain-of-thought: the same question answered as a snap guess (wrong)
// and then reasoned out loud step by step (right). The point it makes visible:
// each token the model writes lands back in the context it reads next, so the
// working is not decoration - it is the computation.
(function () {
  "use strict";

  const legend = [
    { sw: "#ffd479", label: "the model wrote this", round: true },
    { sw: "#37d3a6", label: "you wrote this", round: true },
    { sw: "#7baaff", label: "your app wrote this", round: true },
  ];

  const SYS = { role: "system", text: "You are a careful assistant." };
  const Q = {
    role: "user",
    text: "A shelf holds 3 boxes. Each box has 4 jars. Each jar has 6 marbles. How many marbles in total?",
  };

  window.LESSON_VIZ = {
    code: [],
    legend: legend,
    layout: {
      visual: [{ type: "transcript" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "A question that needs a few steps of arithmetic. Watch what happens when the model answers straight away.",
        transcript: { caption: "The question", messages: [SYS, Q] },
      },
      {
        narr: "With no room to work, it pattern-matches to a plausible number and blurts it. But 3 times 4 times 6 is **72**, not 60. The model has no scratchpad - unless we give it one.",
        transcript: {
          caption: "A snap answer",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "60.", hot: true, note: "answered in one leap - and it's wrong" },
          ],
        },
      },
      {
        narr: "So we ask for one. One line changes everything: tell it to **think step by step**. Now the model is allowed - expected - to write its working before the answer.",
        transcript: {
          caption: "Ask it to think first",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "60." },
            { role: "user", text: "Wait - think it through step by step.", hot: true },
          ],
        },
      },
      {
        narr: "It lays out the steps. And here is the key: every token it writes lands back in the context it reads next - so each line of working props up the one after it. The reasoning is not decoration; it **is** the computation.",
        transcript: {
          caption: "The model reasons out loud",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "60." },
            { role: "user", text: "Wait - think it through step by step." },
            {
              role: "assistant",
              text: "3 boxes x 4 jars = 12 jars.\n12 jars x 6 marbles = 72 marbles.",
              hot: true,
              note: "each line feeds the next",
            },
          ],
        },
      },
      {
        narr: "With the steps in front of it, the last line is easy: **72**. Same model, same question - the only difference is that it wrote its thinking down first.",
        transcript: {
          caption: "The worked answer",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "60." },
            { role: "user", text: "Wait - think it through step by step." },
            { role: "assistant", text: "3 boxes x 4 jars = 12 jars.\n12 jars x 6 marbles = 72 marbles." },
            { role: "assistant", text: "So there are 72 marbles in total.", hot: true },
          ],
        },
      },
      {
        narr: "That is **chain-of-thought**: give the model room to reason before it answers. It costs a few more tokens and a little time, but on anything with steps it is the difference between a guess and a worked answer. Every agent leans on this - reasoning is the \"reason\" step in the loop you saw.",
        transcript: {
          caption: "Reasoning, made visible",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "60." },
            { role: "user", text: "Wait - think it through step by step." },
            { role: "assistant", text: "3 boxes x 4 jars = 12 jars.\n12 jars x 6 marbles = 72 marbles." },
            { role: "assistant", text: "So there are 72 marbles in total." },
          ],
        },
      },
    ],
  };
})();
