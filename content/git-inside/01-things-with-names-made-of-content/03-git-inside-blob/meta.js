window.LESSON_META = {
  id: "git-inside-blob",
  key: "git_inside_blob_awarded",
  total: 1,
  docTitle: "Where did your file's name go?",
  eyebrow: "Inside git · Part one · Things with names made of content",
  title: "Where did your file's name go?",
  intro: [
    "You saved `notes.md` and git wrote one object. Open that object and something is missing: the name `notes.md` is not in it. Neither is the date, the folder it sat in, or who saved it. Git kept the bytes and nothing else - and once you see how little is in there, a lot of git's odd behaviour stops being odd."
  ],
  blurb: "Open the object git wrote and find out what it does NOT contain. No file name, no date, no author - just your bytes, which is why two identical files are the same object and why renaming is free.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "15 min",
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
        "id": "gt-blob"
      }
    ],
    "revisits": [
      {
        "id": "gt-content-address"
      }
    ],
    "uses": []
  },
};
