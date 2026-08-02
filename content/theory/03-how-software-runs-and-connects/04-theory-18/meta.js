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
        "id": "th-storage"
      },
      {
        "id": "th-persistence"
      },
      {
        "id": "th-inode"
      },
      {
        "id": "th-database"
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
