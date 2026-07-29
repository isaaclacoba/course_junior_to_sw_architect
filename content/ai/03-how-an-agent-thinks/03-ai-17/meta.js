window.LESSON_META = {
  id: "ai-17",
  key: "ai_17_awarded",
  total: 1,
  docTitle: "Reason and act (ReAct)",
  eyebrow: "Theory · Part seven · How an agent thinks",
  title: "Reason and act (ReAct)",
  intro: [
    "You have seen the two halves on their own: the model reasoning in words, and the agent calling a tool. The pattern that ties them together has a name - ReAct, for reason plus act. The agent writes a thought, takes one action, reads what comes back, then thinks again - over and over. It is the loop you already met, now with the thinking made visible. You'll watch a question get answered by weaving short thoughts together with real tool calls."
  ],
  blurb: "Thought, action, observation, repeat. The named pattern behind a tool-using agent: reason about the next move, call a tool, read the real result, and loop until the answer is grounded.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "16 min",
  archetype: "viz",
  engine: null,
  concepts: {
    "introduces": [
      {
        "id": "ai-react",
        "term": "Reason and act (ReAct)",
        "def": "The named loop behind a tool-using agent: a thought about the next move, an action that calls a tool, an observation of the real result, repeated until the answer is grounded."
      }
    ],
    "revisits": [
      {
        "id": "ai-agent-loop"
      },
      {
        "id": "ai-chain-of-thought"
      }
    ],
    "uses": [
      {
        "id": "ai-tool-call"
      },
      {
        "id": "ai-tool"
      }
    ]
  },
};
