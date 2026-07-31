window.LESSON_META = {
  id: "ai-19",
  key: "ai_19_awarded",
  total: 1,
  docTitle: "Workflow or agent?",
  eyebrow: "Theory · Part eight · Making agents reliable",
  title: "Workflow or agent?",
  intro: [
    "Not everything that uses a model needs to be an agent. Often the simplest thing that works is a workflow - a fixed path you write yourself, the same steps every time. An agent is different: you hand it a goal and let the model decide the steps as it goes. Agents are more flexible, but they cost more and can wander. The skill is knowing which one a job needs - and reaching for the simpler one first. You'll compare the two on the same kind of task and see where each one fits."
  ],
  blurb: "\"Agent\" is not always the answer. If you can write the steps down ahead of time, build a workflow - simpler and cheaper. Save agency for when the path has to be discovered as it goes.",
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
        "id": "ai-workflow"
      }
    ],
    "revisits": [
      {
        "id": "ai-agent"
      },
      {
        "id": "ai-planning"
      }
    ],
    "uses": []
  },
};
