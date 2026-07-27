// Visual for ai-7 "Tools" - a DATA-ONLY file. It reuses the `agent` panel and its
// new tool card: the model, on its own, can only produce text; when it needs a
// fact it cannot know, it emits a call to a tool, the tool runs outside the model,
// and the result drops back into the context. First step from talker to doer.
(function () {
  "use strict";

  const user = (list) => list.map((t) => ({ t, kind: "user" }));
  const ctx = (list) => list.map((t) => ({ t, kind: "context" }));
  const ctxHot = (list) => list.map((t) => ({ t, kind: "context", hot: true }));
  const gen = (list) => list.map((t) => ({ t, kind: "gen" }));

  const core = (sub, live) => ({ label: "LLM", sub: sub, live: live });

  const ASK = ["What", "is", "the", "weather", "in", "Paris", "?"];
  const FACT = ["rain", ",", "12\u00b0C"];
  const ANSWER = ["It", "is", "raining", "in", "Paris", "."];

  const TOOL = "getWeather";
  const CALL = 'getWeather("Paris")';
  const RESULT = "12\u00b0C, rain";

  window.LESSON_VIZ = {
    code: [],
    legend: [
      { sw: "#8fb7ab", label: "in the context (readable now)" },
      { sw: "#ffd479", label: "the call the model asks to run", round: true },
      { sw: "#37d3a6", label: "the tool's result, back in context", round: true },
    ],
    layout: {
      visual: [{ type: "agent", fan: false }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "You ask something the model cannot know on its own: the weather in Paris right now. Its training ended long ago, so it has no live information about today.",
        agent: {
          stripCaption: "A question about right now",
          tokens: user(ASK),
          caret: true,
          core: core("reads its context", false),
          tool: null,
        },
      },
      {
        narr: "By itself the model can only produce text. It cannot look out of a window or open a website - it has no way to reach the world outside its own context.",
        agent: {
          stripCaption: "The model has no way to check",
          tokens: user(ASK),
          caret: true,
          core: core("text in, text out", true),
          tool: null,
        },
      },
      {
        narr: "So instead of guessing, it emits a **tool call** - a request to run a function it is allowed to use. Here it asks for `getWeather` with the city Paris.",
        agent: {
          stripCaption: "It asks for a tool to be run",
          tokens: user(ASK),
          caret: true,
          core: core("asks for a tool", true),
          tool: { name: TOOL, call: CALL, state: "calling" },
        },
      },
      {
        narr: "The tool runs **outside** the model. It checks a real weather service and hands back an answer: `12\u00b0C, rain`. The model did not compute this - it asked, and something else did the work.",
        agent: {
          stripCaption: "The tool does the real work",
          tokens: user(ASK),
          caret: true,
          core: core("waiting for the result", false),
          tool: { name: TOOL, call: CALL, result: RESULT, state: "returned" },
        },
      },
      {
        narr: "That result drops into the **context**, right where the model can read it - the same as any other text it has been given.",
        agent: {
          stripCaption: "The result lands in the context",
          tokens: [...user(ASK), ...ctxHot(FACT)],
          caret: true,
          core: core("reads the new fact", true),
          tool: { name: TOOL, call: CALL, result: RESULT, state: "returned" },
        },
      },
      {
        narr: "Now it can answer for real. That round trip - **ask for a tool, read the result back** - is the first step from a model that only talks to one that can act on the world.",
        agent: {
          stripCaption: "Now it can answer",
          tokens: [...user(ASK), ...ctx(FACT), ...gen(ANSWER)],
          caret: false,
          core: core("text in, text out", false),
          tool: null,
        },
      },
    ],
  };
})();
