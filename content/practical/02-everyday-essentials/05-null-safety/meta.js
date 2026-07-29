window.LESSON_META = {
  id: "null-safety",
  key: "null_safety_awarded",
  total: 4,
  docTitle: "Null-safety",
  eyebrow: "Part two · Everyday essentials",
  title: "Null-safety",
  intro: [
    "Sooner or later a value is not there - a name nobody filled in, an object that was never built. Ask an absent value to do something and the program crashes. The fix is to plan for the empty case: hand back a default, skip safely, or say plainly that you do not know. You write each move and run it."
  ],
  blurb: "Sooner or later a value is not there - hand back a default, reach through safely, and say \"unknown\" instead of crashing.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "20 min",
  archetype: "build",
  engine: "build",
  concepts: {
    "introduces": [
      {
        "id": "pr-null-coalescing",
        "term": "Null-coalescing",
        "def": "Supplying a fallback for an absent value with ?? (and filling a slot only when empty with ??=)."
      },
      {
        "id": "pr-null-conditional",
        "term": "Null-conditional",
        "def": "Reaching through an object that might be missing with ?., which stops at null instead of crashing."
      },
      {
        "id": "pr-nullable-value-type",
        "term": "Nullable value type",
        "def": "A plain value like int or bool that opts in to being absent by adding ?, like int?, so it is either the value or null."
      }
    ],
    "revisits": [
      {
        "id": "pr-null"
      }
    ],
    "uses": [
      {
        "id": "pr-method"
      },
      {
        "id": "pr-object"
      },
      {
        "id": "pr-conditional"
      }
    ]
  },
};
