window.LESSON_META = {
  id: "ai-21",
  key: "ai_21_awarded",
  total: 1,
  docTitle: "Knowing when to stop",
  eyebrow: "Theory · Part eight · Making agents reliable",
  title: "Knowing when to stop",
  intro: [
    "A loop that can keep going needs to know when to quit. Most of the time an agent stops because it reached the goal - but not always. It can get stuck repeating itself, chase a task that never resolves, or quietly rack up cost. So every agent runs on a leash: a budget of steps, a spend limit, a check for going in circles. You'll watch a healthy run stop at the goal, and a stuck one get cut off before it burns through the whole budget."
  ],
  blurb: "An agent decides its own next move, so nothing makes it stop on its own. A loop that can't stop is a runaway bill. See the stopping conditions - goal reached, budget spent, circling, hard error.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "15 min",
  archetype: "viz",
  engine: null,
  concepts: {
    "introduces": [
      {
        "id": "ai-stopping-condition",
        "term": "Stopping condition",
        "def": "A reason to end the loop - the goal is reached, the budget is spent, the agent is circling, or a hard error hit - since an agent decides its own next move and will otherwise run forever."
      },
      {
        "id": "ai-step-budget",
        "term": "Step budget",
        "def": "A cap on how many steps a task may take - the leash on a loop that costs a model call every turn."
      }
    ],
    "revisits": [
      {
        "id": "ai-agent-loop"
      }
    ],
    "uses": [
      {
        "id": "ai-agent"
      }
    ]
  },
};
