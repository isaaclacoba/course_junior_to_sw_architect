window.LESSON_META = {
  id: "ai-16",
  key: "ai_16_awarded",
  total: 1,
  docTitle: "Planning",
  eyebrow: "Theory · Part seven · How an agent thinks",
  title: "Planning",
  intro: [
    "Some goals are too big to do in one move. \"Plan a weekend trip\" is not one action - it is a dozen, and some depend on others. A model that dives straight in tends to lose the thread halfway. So before acting, a good agent does what you would: break the goal into an ordered list of smaller steps, then work down it one at a time. You'll watch a goal become a plan, and the plan get carried out - including what happens when a step gets stuck."
  ],
  blurb: "A goal too big for one move gets broken into an ordered list of small steps, done one at a time. Watch an agent decompose a task - and re-plan when a step gets blocked.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "16 min",
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
        "id": "ai-planning",
        "term": "Planning",
        "def": "Breaking a goal too big for one move into an ordered list of small steps and working them one at a time."
      },
      {
        "id": "ai-task-decomposition",
        "term": "Task decomposition",
        "def": "Splitting a goal into smaller steps whose order captures what depends on what, so each step is small enough to actually do."
      },
      {
        "id": "ai-replanning",
        "term": "Re-planning",
        "def": "Changing the plan mid-run when a step gets blocked, rather than pushing on with a route that no longer works."
      }
    ],
    "revisits": [
      {
        "id": "ai-chain-of-thought"
      }
    ],
    "uses": [
      {
        "id": "ai-agent"
      },
      {
        "id": "ai-memory"
      }
    ]
  },
};
