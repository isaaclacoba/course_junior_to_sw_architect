window.LESSON_META = {
  id: "theory-21",
  key: "theory_21_awarded",
  total: 1,
  docTitle: "Standing on other code",
  eyebrow: "Theory · Part four · The development world",
  title: "Standing on other code",
  intro: [
    "You will almost never write a whole program from scratch. Nearly everything you build sits on top of code other people already wrote - the language's own toolbox, and packages you pull in. Once you know that, you work differently: you look for what already exists before you build it. Here is what that shared code is, and how you reach it."
  ],
  blurb: "You never build alone: libraries, the standard library, packages, a package manager, and the dependencies your program relies on.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "15 min",
  archetype: "viz",
  engine: null,
  concepts: {
    "introduces": [
      {
        "id": "th-library",
        "term": "Library",
        "def": "Ready-made code someone else wrote and shared, which you call instead of writing it yourself."
      },
      {
        "id": "th-standard-library",
        "term": "Standard library",
        "def": "The big set of built-in tools every language ships with, ready the moment you start."
      },
      {
        "id": "th-package",
        "term": "Package",
        "def": "A bundle of code someone published for others to reuse, fetched and added to your project."
      },
      {
        "id": "th-package-manager",
        "term": "Package manager",
        "def": "A tool that fetches the packages you ask for, installs the right versions, and pulls in their dependencies."
      },
      {
        "id": "th-dependency",
        "term": "Dependency",
        "def": "A package your program relies on, which may rely on further packages of its own."
      }
    ],
    "revisits": [],
    "uses": [
      {
        "id": "th-program"
      }
    ]
  },
};
