window.LESSON_META = {
  id: "ai-8",
  key: "ai_8_awarded",
  total: 1,
  docTitle: "From LLM to agent",
  eyebrow: "Theory · Part six · From model to agent",
  title: "From LLM to agent",
  intro: [
    "You have met the pieces one at a time: the model, its context, the window, memory, and tools. On their own, a model just predicts the next token. Give it a goal, let it call tools and recall memory, and run the whole thing in a loop - and you get an agent that can work towards something. This last lesson puts the pieces together, and points at where the course goes next."
  ],
  blurb: "Put the pieces together - model, context, memory, tools - and run them in a loop with a goal, and you get an agent. The capstone, and the bridge to the harder material ahead.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "15 min",
  archetype: "viz",
  engine: null,
  runtime: "kernel",
  resources: {
    base: "res/strings",
    lang: "en",
    langs: ["en", "es"],
    voices: ["default"],
  },
  concepts: {
    "introduces": [
      {
        "id": "ai-agent",
        "term": "Agent",
        "def": "A model wrapped with its context, memory, and tools and run in a loop toward a goal, so it can decide and take its own next steps."
      },
      {
        "id": "ai-agent-loop",
        "term": "Agent loop",
        "def": "The perceive-reason-act-observe cycle an agent runs: read the task in, reason about the next move, call a tool, observe the result, and go again."
      }
    ],
    "revisits": [
      {
        "id": "ai-context"
      },
      {
        "id": "ai-memory"
      },
      {
        "id": "ai-tool"
      }
    ],
    "uses": [
      {
        "id": "ai-llm"
      },
      {
        "id": "ai-episodic-memory"
      }
    ]
  },
};
