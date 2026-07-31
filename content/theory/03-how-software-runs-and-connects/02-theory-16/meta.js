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
        "id": "th-value-type",
        "term": "Value type",
        "def": "A type whose variable holds the data itself, so copying it duplicates the value."
      },
      {
        "id": "th-reference-type",
        "term": "Reference type",
        "def": "A type whose variable holds the address of an object on the heap, so copying it duplicates only the address."
      },
      {
        "id": "th-reference",
        "term": "Reference",
        "def": "A value that is a memory address - follow it to reach the real object."
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
