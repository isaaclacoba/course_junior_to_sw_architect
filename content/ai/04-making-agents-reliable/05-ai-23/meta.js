window.LESSON_META = {
  id: "ai-23",
  key: "ai_23_awarded",
  total: 1,
  docTitle: "Did it work? Reading the trace",
  eyebrow: "Theory · Part eight · Making agents reliable",
  title: "Did it work? Reading the trace",
  intro: [
    "When an agent gets something wrong, \"the AI messed up\" is not a diagnosis. Because a run is just that list of messages you met earlier, you can read it back like a flight recorder and see exactly which step went off. That is observability. Pair it with evaluation - a check that decides pass or fail - and you can tell whether an agent works, and fix it when it doesn't. You'll read a failed run's trace, find the bad step, and see how a simple check catches it automatically."
  ],
  blurb: "Every run leaves a trace of its messages and tool calls. Read a failed one to find where it broke (observability), then turn that into a check you run every time (evaluation).",
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
        "id": "ai-trace"
      },
      {
        "id": "ai-observability"
      },
      {
        "id": "ai-evaluation"
      }
    ],
    "revisits": [
      {
        "id": "ai-transcript"
      }
    ],
    "uses": [
      {
        "id": "ai-tool-call"
      }
    ]
  },
};
