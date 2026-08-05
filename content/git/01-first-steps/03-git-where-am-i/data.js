// Lesson content for git-where-am-i - DATA ONLY. The git plugin reads
// window.LESSON_CONFIG; meta.js carries the hero and the concept graph.
//
// Both cards teach the same habit: ASK first, then act. Grading is state-based,
// so `status` and `log` cannot be graded on their own - each card therefore ends
// in a commit, and the reading command is what tells the learner WHICH commit to
// make. A card that could be solved without looking would not teach looking.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Ask before you save",
      concept: "git status",
      context:
        "`git status` answers one question: what is going on in this folder right now. It lists what git is not tracking yet, and what you have staged for the next commit.\n\nThe folder holds `dog.txt` and `notes.md`. Only one of them belongs in this save - run `git status` and you will see both waiting.",
      goal: [
        "Run `git status` to see what is waiting.",
        "Stage only `dog.txt`, and leave `notes.md` where it is.",
        "Run `git diff --staged` - it prints the lines you are about to save.",
        "Commit them with `git commit -m \"add dog\"`."
      ],
      files: [
        { path: "dog.txt", text: "Rex, collie, 2 years old.\nWalks at seven, rain or shine." },
        { path: "notes.md", text: "# Notes\n\nTODO: the vet's number goes here" },
        { path: "cat.txt", text: "Mia, tabby, 4 years old." }
      ],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\""
      ],
      solution: [
        "git status",
        "git add dog.txt",
        "git diff --staged",
        "git commit -m \"add dog\""
      ]
    },
    {
      title: "Read the history you already have",
      concept: "git log",
      context:
        "`git status` looks at now. `git log` looks back - every commit, newest first, each with its message and its **hash**: the short code git uses as that commit's name.\n\n`git log --oneline` is the same list, one commit per line. It is the fastest way to see where you are before you add to it.",
      goal: [
        "Run `git log --oneline` to read the three commits already here.",
        "Then add the next one: stage `feeder.txt` and commit it as `git commit -m \"fix the feeder\"`."
      ],
      files: [
        { path: "feeder.txt", text: "Feeder: 8am and 6pm.\nThe timer ran an hour late - corrected." },
        { path: "cat.txt", text: "Mia, tabby, 4 years old." },
        { path: "dog.txt", text: "Rex, collie, 2 years old." },
        { path: "bird.txt", text: "Pip, budgie, loud at 6am." }
      ],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\"",
        "git add bird.txt",
        "git commit -m \"add bird\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git commit -m \"add dog\"",
        "git add bird.txt",
        "git commit -m \"add bird\"",
        "git add feeder.txt",
        "git commit -m \"fix the feeder\""
      ],
      solution: [
        "git log --oneline",
        "git add feeder.txt",
        "git commit -m \"fix the feeder\""
      ]
    },
    {
      summary: true,
      title: "Where am I? - recap",
      concept: "Recap",
      context: "Two questions, asked before you touch anything.",
      summaryIntro:
        "Git never guesses on your behalf, and it never hides what it did. Ask, read the answer, then act - that is the whole habit.",
      summaryItems: [
        {
          title: "`git status` - ",
          text: "what is going on right now: what git is not tracking yet, and what you have staged."
        },
        {
          title: "`git log` - ",
          text: "what happened before: every commit, newest first, with its message."
        },
        {
          title: "`git log --oneline` - ",
          text: "the same history, one line each, for when you only need the shape of it."
        },
        {
          title: "Hash - ",
          text: "the short code naming one commit, so you can point at that exact snapshot later."
        }
      ],
      summaryClose: "Next: branches - how two lines of work grow side by side without touching each other."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "gwa",
    metaLabel: "First steps · Where am I?",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_where_am_i_awarded",
    awardAmount: 20,
  };
})();
