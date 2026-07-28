// Visual for ai-21 "Knowing when to stop" - a DATA-ONLY file, agentloop panel.
// A loop that never stops is not an agent, it is a bill. This lesson shows the
// stopping conditions that end the loop: the goal is reached, a step budget runs
// out, the agent circles on the same action, or something errors out. The budget
// is a leash on a system that decides its own next move.
(function () {
  "use strict";

  const GOAL = "answer: who won the 2019 final?";

  window.LESSON_VIZ = {
    code: [],
    legend: [
      { sw: "#ffd479", label: "the piece working right now" },
      { sw: "#37d3a6", label: "goal reached - a clean stop", round: true },
      { sw: "#e0708a", label: "a stop forced from outside", round: true },
    ],
    layout: {
      visual: [{ type: "agentloop" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "An agent decides its own next move, so nothing makes it stop on its own. Left alone it will loop forever - and every turn costs a model call. Before the first step, we hand it a **budget**: at most six steps for this task.",
        agentLoop: {
          goal: GOAL,
          stage: null,
          ctx: ["step 0 / 6 max", "budget: the leash on the loop"],
        },
      },
      {
        narr: "When things go well, the budget barely matters. The agent searches, reads a result, closes in on the answer - real progress each turn, well inside its six steps.",
        agentLoop: {
          goal: GOAL,
          active: ["tools", "ctx"],
          stage: "observe",
          ctx: ["step 2 / 6 max", "found: 2019 final result"],
          think: "getting close",
          chips: ["search"],
        },
      },
      {
        narr: "At step three it has the answer. The cleanest stop of all: the **goal is reached**, so the loop ends because it is done - not because it ran out of room. Most runs should stop this way.",
        agentLoop: {
          goal: GOAL,
          active: ["llm", "ctx"],
          stage: null,
          ctx: ["step 3 / 6 max", "goal reached - stop", "answer ready"],
        },
      },
      {
        narr: "But not every run behaves. Here is a different one that gets stuck: the same search, the same empty result, over and over. It is busy, it is spending money, and it is getting **nowhere**.",
        agentLoop: {
          goal: GOAL,
          active: ["llm", "tools"],
          stage: "act",
          ctx: ["step 4 / 6 max", "same search, third time", "no new information"],
          think: "search again...",
          chips: ["search"],
        },
      },
      {
        narr: "Two guards catch this. A **loop check** notices the agent repeating an action that changes nothing, and the **budget** is nearly gone. Either one is enough to pull the plug - the loop is cut off from outside.",
        agentLoop: {
          goal: GOAL,
          active: ["env", "llm"],
          stage: null,
          ctx: ["step 6 / 6 - budget hit", "same action 3 times - loop", "stopped from outside"],
        },
      },
      {
        narr: "So an agent needs stopping conditions written down: **goal reached**, **step budget spent**, a **spend cap** in dollars, the **same move repeating**, or a **hard error**. Hit any one and the loop ends. A loop that can't stop itself is not autonomy - it is a runaway bill, and the budget is how you stay in control of it.",
        agentLoop: {
          goal: GOAL,
          stage: null,
          ctx: ["stop when: goal reached", "or: budget / spend cap hit", "or: looping / hard error"],
        },
      },
    ],
  };
})();
