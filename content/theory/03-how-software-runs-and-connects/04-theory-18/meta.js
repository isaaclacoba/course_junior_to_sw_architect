window.LESSON_META = {
  id: "theory-18",
  key: "theory_18_awarded",
  total: 1,
  docTitle: "Saving data",
  eyebrow: "Theory · Part three · How software runs and connects",
  title: "Saving data",
  intro: [
    "Memory forgets everything when a program stops - so how does data stick around? Step through the visual to watch data leave RAM for storage, saved as a file on disk that outlives the program."
  ],
  blurb: "Memory forgets when a program stops. How data is kept: storage, files, databases, and saving versus loading.",
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
        "id": "th-storage",
        "term": "Storage",
        "def": "Non-volatile hardware that keeps data after a program stops and after the power is off."
      },
      {
        "id": "th-persistence",
        "term": "Persistence",
        "def": "Keeping data past the end of a program by saving it to storage, and loading it back later."
      },
      {
        "id": "th-inode",
        "term": "Inode",
        "def": "A file on disk is an inode - its bytes plus facts about them like size, time, and who can read it - reached through a name in a folder."
      }
    ],
    "revisits": [
      {
        "id": "th-ram"
      },
      {
        "id": "th-volatile"
      },
      {
        "id": "th-file"
      },
      {
        "id": "th-folder"
      }
    ],
    "uses": [
      {
        "id": "th-byte"
      }
    ]
  },
};
