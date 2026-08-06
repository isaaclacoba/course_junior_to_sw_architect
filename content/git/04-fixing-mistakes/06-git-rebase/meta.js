window.LESSON_META = {
  id: "git-rebase",
  key: "git_rebase_awarded",
  total: 2,
  docTitle: "Replay your work on top",
  eyebrow: "Git · Part four · Fixing mistakes",
  title: "Replay your work on top",
  intro: [
    "You already know one way to bring two branches together. `git merge` joins them and adds a commit that records the meeting. `git rebase` answers the same question differently: it makes your commits again on top of the other branch, and the history comes out as a straight line. The catch is in the word again - the commits you end up with are new ones, with new ids. Here you run a rebase and then go looking for what it left behind."
  ],
  blurb: "`git merge` joins two lines of work and records that they met. `git rebase` makes your commits again on top of the other branch, so the history comes out as a straight line. Knowing the difference matters, because a replayed commit is not the commit you had.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "15 min",
  archetype: "git",
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
        "id": "gt-rebase"
      }
    ],
    "revisits": [
      {
        "id": "gt-reflog"
      },
      {
        "id": "gt-merge"
      }
    ],
    "uses": [
      {
        "id": "gt-branch"
      },
      {
        "id": "gt-hash"
      },
      {
        "id": "gt-head"
      },
      {
        "id": "gt-history"
      }
    ]
  },
};
