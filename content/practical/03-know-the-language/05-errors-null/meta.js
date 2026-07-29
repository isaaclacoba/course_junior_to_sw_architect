window.LESSON_META = {
  id: "errors-null",
  key: "errors_null_awarded",
  total: 6,
  docTitle: "Exception handling",
  eyebrow: "Part three · Know the language",
  title: "Exception handling",
  intro: [
    "When something goes wrong, a program can stop dead - unless you handle it. Write and run each piece: catch failures with try/catch, read what failed from the message, clean up with finally, raise your own with throw, and reach for values safely with the null-safety operators ?? and ?. (you met null in Foundations)."
  ],
  blurb: "Keep a program standing when something goes wrong: catch failures with try/catch, clean up with finally, raise your own with throw - plus the null-safety operators ?? and ?.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "steady",
  time: "25 min",
  archetype: "build",
  engine: "build",
  concepts: {
    "introduces": [
      {
        "id": "pr-exception-handling",
        "term": "try / catch",
        "def": "Keeping a program standing when something fails by catching the error instead of letting it stop everything."
      },
      {
        "id": "pr-finally",
        "term": "finally",
        "def": "A block that always runs after a try, whether it succeeded or failed, to clean up."
      },
      {
        "id": "pr-throw",
        "term": "throw",
        "def": "Raising your own error to signal that something is wrong and stop the current path."
      }
    ],
    "revisits": [
      {
        "id": "pr-null-coalescing"
      },
      {
        "id": "pr-null-conditional"
      }
    ],
    "uses": [
      {
        "id": "pr-method"
      },
      {
        "id": "pr-conditional"
      }
    ]
  },
};
