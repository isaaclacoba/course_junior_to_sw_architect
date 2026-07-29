// Visual for ai-17 "Reason and act (ReAct)" - a DATA-ONLY file, transcript panel.
// It shows the ReAct pattern: the model interleaves Thought (reasoning), Action
// (a tool call) and Observation (the tool's result), looping until it can answer.
// This is the named pattern behind the perceive-reason-act-observe loop.
(function () {
  "use strict";

  const legend = [
    { sw: "#ffd479", label: "the model wrote this", round: true },
    { sw: "#37d3a6", label: "you wrote this", round: true },
    { sw: "#e0708a", label: "a tool wrote this", round: true },
  ];

  const SYS = {
    role: "system",
    text: "You can call getHostCity and getWeather. Think, then act, then read the result.",
  };
  const Q = { role: "user", text: "What's the weather where the next Olympics are held?" };

  window.LESSON_VIZ = {
    code: [],
    legend: legend,
    layout: {
      visual: [{ type: "transcript" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "A question the model cannot answer from memory. It needs two facts it does not have - which city, and its weather - and they have to be fetched in order.",
        transcript: { caption: "The question", messages: [SYS, Q] },
      },
      {
        narr: "First a **Thought**: the model reasons about what it needs before it does anything. Not the answer yet - a plan for the next move. Find the city, then look up the weather there.",
        transcript: {
          caption: "Thought",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "Thought: I need the host city first, then its weather.", hot: true },
          ],
        },
      },
      {
        narr: "Then an **Action**: the model turns that thought into a concrete tool call. It stops writing prose and asks the world a question.",
        transcript: {
          caption: "Action",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "Thought: I need the host city first, then its weather." },
            { role: "assistant", text: "Action: getHostCity(event: \"next Olympics\")", hot: true },
          ],
        },
      },
      {
        narr: "An **Observation** comes back from the tool - a real fact from the world, not something the model invented. This is the \"observe\" step: fresh input the next thought gets to use.",
        transcript: {
          caption: "Observation",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "Thought: I need the host city first, then its weather." },
            { role: "assistant", text: "Action: getHostCity(event: \"next Olympics\")" },
            { role: "tool", text: "Observation: Brisbane", hot: true },
          ],
        },
      },
      {
        narr: "Now the loop goes round again. New thought, informed by what it just learned: it has the city, so look up **Brisbane's** weather. Then the matching action.",
        transcript: {
          caption: "Round two - thought and action",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "Thought: I need the host city first, then its weather." },
            { role: "assistant", text: "Action: getHostCity(event: \"next Olympics\")" },
            { role: "tool", text: "Observation: Brisbane" },
            { role: "assistant", text: "Thought: now I need Brisbane's current weather." },
            { role: "assistant", text: "Action: getWeather(city: \"Brisbane\")", hot: true },
          ],
        },
      },
      {
        narr: "Second observation lands. The model now has both facts it was missing - each one fetched, none guessed.",
        transcript: {
          caption: "Second observation",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "Thought: I need the host city first, then its weather." },
            { role: "assistant", text: "Action: getHostCity(event: \"next Olympics\")" },
            { role: "tool", text: "Observation: Brisbane" },
            { role: "assistant", text: "Thought: now I need Brisbane's current weather." },
            { role: "assistant", text: "Action: getWeather(city: \"Brisbane\")" },
            { role: "tool", text: "Observation: 26 C, sunny", hot: true },
          ],
        },
      },
      {
        narr: "With nothing left to fetch, it answers. That interleaving - **Thought, Action, Observation**, repeat until done - is the **ReAct** pattern. It is the perceive-reason-act-observe loop with names on each turn, and it is how most tool-using agents actually run.",
        transcript: {
          caption: "The grounded answer",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "Thought: I need the host city first, then its weather." },
            { role: "assistant", text: "Action: getHostCity(event: \"next Olympics\")" },
            { role: "tool", text: "Observation: Brisbane" },
            { role: "assistant", text: "Thought: now I need Brisbane's current weather." },
            { role: "assistant", text: "Action: getWeather(city: \"Brisbane\")" },
            { role: "tool", text: "Observation: 26 C, sunny" },
            { role: "assistant", text: "The next Olympics are in Brisbane, where it's currently 26 C and sunny.", hot: true },
          ],
        },
      },
    ],
  };
})();
