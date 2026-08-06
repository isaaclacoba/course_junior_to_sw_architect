// Concept ownership note: `gt-branch` and `gt-head` are introduced here because
// this is the first lesson that makes a learner meet them. The theory track owns
// what a branch is made OF (a name file holding one object id); this track owns
// the word as it is used at the keyboard.
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
      },
      {
        "id": "gt-branch"
      },
      {
        "id": "gt-head"
      }
    ],
    "revisits": [
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
