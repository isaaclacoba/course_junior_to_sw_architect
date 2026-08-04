// Git · Part one - "Your first commit". The first practical lesson of the git
// track: three tiny exercises typed into a real terminal against the teaching
// git model, graded by the shape of the repository the learner builds.
//
// Each card is its own exercise: `start` is replayed when the card renders,
// `target` is the shape to reach, and `solution` is printed (never run) when the
// learner asks for it. Those three are ARRAYS OF GIT COMMANDS and stay English -
// they are the mechanics, not prose. The prose fields below are mirrored in
// res/strings/default/en.json, which is what the resource layer binds back on.
// Data only: the git plugin reads window.LESSON_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Start a repository and save something in it",
      concept: "Repository",
      context:
        "`git init` tells git to start watching this folder. From then on nothing is saved by accident - you say which files to keep, and git keeps them.\n\nIt takes two steps. `git add` puts a file on the short list for the next save, so it shows up under Staging on the board. `git commit -m` saves everything on that list as one snapshot with a message, and it moves across to Repository. Type the three commands and watch `cat.txt` cross the board.",
      goal: [
        "Start the repository with `git init`.",
        "Put `cat.txt` on the list with `git add cat.txt`.",
        "Save it with `git commit -m \"add cat\"` - the message is checked, so type it exactly."
      ],
      start: [],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\""
      ],
      solution: [
        "git init",
        "git add cat.txt",
        "git commit -m \"add cat\""
      ]
    },
    {
      title: "Pick what goes in",
      concept: "Staging is a choice",
      context:
        "This folder holds three files: `cat.txt`, `dog.txt`, and `notes.md`, which is half finished and not ready for anyone else to read.\n\nStaging is where you choose. `git add` names the files that belong in this save, and anything you do not name stays out of it. You can name more than one at a time - `git add cat.txt dog.txt` puts both on the list, and the commit that follows holds the two of them together.",
      goal: [
        "Stage `cat.txt` and `dog.txt`, and leave `notes.md` out.",
        "Save them as one commit with `git commit -m \"add the pets\"`."
      ],
      start: [],
      target: [
        "git add cat.txt",
        "git add dog.txt",
        "git commit -m \"add the pets\""
      ],
      solution: [
        "git add cat.txt dog.txt",
        "git commit -m \"add the pets\""
      ]
    },
    {
      title: "Save a second version on top",
      concept: "History is a chain",
      context:
        "This repository already has one commit in it - `add cat`, the same one you made a moment ago.\n\nSaving `dog.txt` now does not replace it. The new commit points back at the old one, and the graph draws the link between them. That is all a history is: each snapshot remembering the one it came from, so you can follow the line back as far as you like.",
      goal: [
        "Stage `dog.txt` and save it with `git commit -m \"add dog\"`.",
        "Leave the `add cat` commit alone - the new one goes on top of it."
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
        "git add dog.txt",
        "git commit -m \"add dog\""
      ]
    },
    {
      summary: true,
      title: "Your first commit - recap",
      concept: "Recap",
      context: "Three commands, and the folder has a history.",
      summaryIntro:
        "Git saves what you pick, when you say so. That is the whole shape of it: start the repository once, choose the files, save them with a message.",
      summaryItems: [
        {
          title: "Repository - ",
          text: "the folder git watches, plus every snapshot you have saved in it."
        },
        {
          title: "Staging - ",
          text: "the short list you build with `git add`, so a commit holds what belongs together and nothing else."
        },
        {
          title: "Commit - ",
          text: "one saved snapshot with a message, pointing back at the commit before it."
        },
        {
          title: "The message matters - ",
          text: "these exercises check it, and on a real project it is what your future self reads."
        }
      ],
      summaryClose: "Next: a history of snapshots - a closer look at the chain those dots make."
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "gfc",
    metaLabel: "First steps · Your first commit",
    progressNoun: "Exercise",
    tasks,
    xpKey: "course_global_xp",
    awardedKey: "git_first_commit_awarded",
    awardAmount: 20,
  };
})();
