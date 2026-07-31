window.LESSON_META = {
  id: "theory-16",
  key: "theory_16_awarded",
  total: 1,
  docTitle: "References vs values",
  eyebrow: "Theory · Part three · How software runs and connects",
  title: "References vs values",
  intro: [
    "Why some variables hold a value directly while others only point to it. Step through memory to see values sitting in their slots, references pointing to the heap, and what really happens when you copy one - the idea behind how objects behave."
  ],
  blurb: "Why some variables hold a value and others only point to one - and what really happens when you copy each. The idea behind how objects behave.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "20 min",
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
        "id": "th-value-type"
      },
      {
        "id": "th-reference-type"
      },
      {
        "id": "th-reference"
      }
    ],
    "revisits": [
      {
        "id": "th-type"
      },
      {
        "id": "th-heap"
      }
    ],
    "uses": [
      {
        "id": "th-variable"
      },
      {
        "id": "th-stack"
      },
      {
        "id": "th-address"
      }
    ]
  },
};
