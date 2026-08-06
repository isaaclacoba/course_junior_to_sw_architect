window.LESSON_META = {
  id: "git-inside-blob",
  key: "git_inside_blob_awarded",
  total: 1,
  docTitle: "What a blob is actually made of",
  eyebrow: "Inside git · Part one · Things with names made of content",
  title: "What a blob is actually made of",
  intro: [
    "Last lesson said git names a thing by hashing its contents. Hash your file yourself and you get a different number than git did. Something goes into that hash that you never see - and once you know what it is, you can also explain why editing one character duplicates a whole file, and why changing a file's permissions costs nothing at all."
  ],
  blurb: "Open a blob and read the hidden header git puts in front of your bytes. It explains where the id really comes from, why one edited character stores a second whole copy, and why three identical files share one object.",
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
