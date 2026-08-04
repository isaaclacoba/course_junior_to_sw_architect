// Visual for ai-8 "From LLM to agent" - a DATA-ONLY file. It uses the `agentloop`
// panel: the closing picture that assembles the pieces met one at a time - the
// model, its context, memory and tools - and wraps them in a perceive-reason-act-
// observe loop. This is the bridge into the architecture material that follows.
(function () {
  "use strict";

  const GOAL = "book a flight";

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#ffd479", label: "the piece working right now" },
      { sw: "#7baaff", label: "memory it draws on" },
      { sw: "#37d3a6", label: "what a tool put in the context", round: true },
    ],
    layout: {
      visual: [{ type: "agentloop" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "Here are the pieces you have met, one at a time: the **model**, its **context**, its **memory**, and the **tools** it can call. On their own each is limited. Wrap them in a loop and they become something new - an **agent** with a goal to reach.",
        agentLoop: { goal: GOAL, stage: null, ctx: [] },
      },
      {
        narr: "A task arrives from the outside world. The agent **perceives** it: it reads the task into its context - the working memory the model can see right now.",
        agentLoop: {
          goal: GOAL,
          active: ["env", "ctx"],
          stage: "perceive",
          ctx: ["goal: book a flight"],
          packets: [{ path: "trPercept" }],
        },
      },
      {
        narr: "The **model** reads the context and **reasons** about what to do next. This is the same next-token prediction you started with - now aimed at choosing an action.",
        agentLoop: {
          goal: GOAL,
          active: ["ctx", "llm"],
          stage: "reason",
          ctx: ["goal: book a flight"],
          think: "what do I do next?",
          packets: [{ path: "trReason" }],
        },
      },
      {
        narr: "To reason well it **recalls** from memory - a fact saved in an earlier chat, like your travel dates - and pulls it into the context, exactly as you saw in the memory lesson.",
        agentLoop: {
          goal: GOAL,
          active: ["llm", "mem"],
          stage: "reason",
          ctx: ["goal: book a flight", "dates: 3-7 May"],
          think: "recall the dates",
          mem: "episodic",
          packets: [{ path: "trRecall", reverse: true }],
        },
      },
      {
        narr: "Now it **acts**: it calls a **tool** - here a flight search - to do something in the world it cannot do with text alone.",
        agentLoop: {
          goal: GOAL,
          active: ["llm", "tools"],
          stage: "act",
          ctx: ["goal: book a flight", "dates: 3-7 May"],
          think: "search flights",
          chips: ["search"],
          packets: [{ path: "trAct" }],
        },
      },
      {
        narr: "The tool's result is **observed** back into the context. The agent has learned something new - and the loop starts again, reasoning from what it now knows.",
        agentLoop: {
          goal: GOAL,
          active: ["tools", "ctx"],
          stage: "observe",
          ctx: ["goal: book a flight", "dates: 3-7 May", "flights: 3 found"],
          chips: ["search"],
          packets: [{ path: "trObserve" }],
        },
      },
      {
        narr: "That is an agent: a **model** at the centre, a **context** it reads, **memory** and **tools** it draws on, all turning in a loop until the goal is met. You now have the vocabulary the harder material assumes - and that is where this course goes next.",
        agentLoop: {
          goal: GOAL,
          stage: null,
          ctx: ["goal: book a flight", "flights: 3 found"],
        },
      },
    ],
  };
})();
