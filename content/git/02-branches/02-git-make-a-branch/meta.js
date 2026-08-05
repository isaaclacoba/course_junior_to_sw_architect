// Concept ownership note: `gt-branch` and `gt-head` are introduced here because
// the viz lesson that owns them in the plan (`git-what-a-branch-is`, the 01- slot
// of this part) is not built yet. When that lesson lands, move both ids - and
// their `concept.*.term` / `.def` keys in res/strings - over to it, and demote
// them here to `revisits`.
window.LESSON_META = {
  id: "git-make-a-branch",
  key: "git_make_a_branch_awarded",
  total: 2,
  docTitle: "Make a branch and work on it",
  eyebrow: "Git · Part two · Branches",
  title: "Make a branch and work on it",
  intro: [
    "You want to try something without risking the work that already runs. So you split off a second line with its own name. Nothing is copied - a branch is only a name pointing at a commit. Here you make one, step onto it, and commit there while `main` stays where you left it."
  ],
  blurb: "Split off a line of work and commit on it without touching `main`. Make a branch, step onto it, and watch the graph fork while the old line stays put.",
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
        "id": "gt-revision"
      }
    ],
    "revisits": [
      {
        "id": "gt-branch"
      },
      {
        "id": "gt-head"
      },
      {
        "id": "gt-commit"
      }
    ],
    "uses": [
      {
        "id": "gt-repository"
      },
      {
        "id": "gt-staging-area"
      },
      {
        "id": "gt-working-tree"
      }
    ]
  },
};
