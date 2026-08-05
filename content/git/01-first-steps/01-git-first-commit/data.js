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
        "`git init` tells git to watch this folder. After that nothing is saved by accident - you choose what to keep.\n\nSaving takes two steps. `git add` puts a file on the list for the next save, under Staging. `git commit -m` saves that list as one snapshot, and it moves to Repository.\n\n`git status` lists what git is not tracking yet - read it before you choose.",
      goal: [
        "Start the repository with `git init`.",
        "Run `git status` - it names every file this folder is holding.",
        "Stage the cat's file, and only that one. `git status` spells its name for you.",
        "Save it with `git commit -m \"add cat\"` - the message is checked, so type it exactly."
      ],
      files: [
        { path: "cat-notes.txt", text: "Mia, tabby, 4 years old.\nSleeps on the warm laptop." },
        { path: "dog-notes.txt", text: "Rex, collie, 2 years old.\nBarks at the postman." },
        { path: "feeder.md", text: "# Feeder\n\nTODO: work out the schedule." }
      ],
      goals: [
        { code: ["git init"], gate: { ran: "git init" } },
        { code: ["git status"], gate: { ran: "git status" } },
        { code: ["git add cat-notes.txt", { row: "staged: cat-notes.txt", staged: ["cat-notes.txt"] }],
          gate: { staged: ["cat-notes.txt"] } },
        { code: ['git commit -m "add cat"', { row: "holds: cat-notes.txt", commit: "add cat", paths: ["cat-notes.txt"] }],
          gate: { commit: "add cat" } }
      ],
      start: [],
      target: [
        "git add cat-notes.txt",
        "git commit -m \"add cat\""
      ],
      solution: [
        "git init",
        "git status",
        "git add cat-notes.txt",
        "git commit -m \"add cat\""
      ]
    },
    {
      title: "Pick what goes in",
      concept: "Staging is a choice",
      context:
        "The folder holds `cat.txt`, `dog.txt` and `notes.md` - and `notes.md` is half finished.\n\nStaging is where you choose. `git add` names the files that belong in this save; anything you leave out stays out. You can name several at once: `git add cat.txt dog.txt`.",
      goal: [
        "Run `git status` - it shows all three files waiting.",
        "Stage `cat.txt` and `dog.txt`, and leave `notes.md` out.",
        "Save them as one commit with `git commit -m \"add the pets\"`."
      ],
      files: [
        { path: "cat.txt", text: "Mia, tabby, 4 years old." },
        { path: "dog.txt", text: "Rex, collie, 2 years old." },
        { path: "notes.md", text: "# Pets\n\nTODO: half of this is missing" }
      ],
      goals: [
        { code: ["git status"], gate: { ran: "git status" } },
        { code: ["git add cat.txt dog.txt", { row: "staged: cat.txt, dog.txt", staged: ["cat.txt", "dog.txt"] }],
          gate: { staged: ["cat.txt", "dog.txt"] } },
        { code: ['git commit -m "add the pets"', { row: "holds: cat.txt, dog.txt", commit: "add the pets", paths: ["cat.txt", "dog.txt"] }],
          gate: { commit: "add the pets" } }
      ],
      start: [],
      target: [
        "git add cat.txt",
        "git add dog.txt",
        "git commit -m \"add the pets\""
      ],
      solution: [
        "git status",
        "git add cat.txt dog.txt",
        "git commit -m \"add the pets\""
      ]
    },
    {
      title: "Save a second version on top",
      concept: "History is a chain",
      context:
        "This repository already holds one commit - `add cat`. The next one goes on top, pointing back at it, and the graph draws the link.\n\nOne commit, one job. The dog has arrived, so every file that is the dog's goes in this save; anything else waits for its own commit. `git status` shows what is waiting.",
      goal: [
        "Run `git status` - three files are waiting.",
        "Stage the dog's files, all of them in one go, and leave the rest out.",
        "Save them with `git commit -m \"add dog\"`.",
        "Leave the `add cat` commit alone - the new one goes on top of it."
      ],
      files: [
        { path: "cat.txt", text: "Mia, tabby, 4 years old." },
        { path: "dog.txt", text: "Rex, collie, 2 years old." },
        { path: "dog-bowl.txt", text: "Steel bowl, chipped.\nBelongs to Rex." },
        { path: "bird.txt", text: "Pip, budgie, loud at 6am." }
      ],
      goals: [
        { code: ["git status"], gate: { ran: "git status" } },
        { code: ["git add dog.txt dog-bowl.txt", { row: "staged: dog.txt, dog-bowl.txt", staged: ["dog.txt", "dog-bowl.txt"] }],
          gate: { staged: ["dog.txt", "dog-bowl.txt"] } },
        { code: ['git commit -m "add dog"', { row: "holds: dog.txt, dog-bowl.txt", commit: "add dog", paths: ["dog.txt", "dog-bowl.txt"] }],
          gate: { commit: "add dog" } },
        { code: ["add cat <- add dog", { row: "parents: 1", commit: "add dog", parents: 1 }],
          gate: { commit: "add cat" } }
      ],
      start: [
        "git add cat.txt",
        "git commit -m \"add cat\""
      ],
      target: [
        "git add cat.txt",
        "git commit -m \"add cat\"",
        "git add dog.txt",
        "git add dog-bowl.txt",
        "git commit -m \"add dog\""
      ],
      solution: [
        "git status",
        "git add dog.txt dog-bowl.txt",
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
