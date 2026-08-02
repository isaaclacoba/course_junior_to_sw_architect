// Theory track - Part 4 checkpoint. Closes Part four ("The development world")
// and awards XP once on a pass. Data only: sets window.QUIZ_CONFIG for the
// code-lab Quiz component (CodeLab.Quiz), which owns the draw / shuffle / grading.
(function () {
  "use strict";

  window.QUIZ_CONFIG = {
    prefix: "chk4",
    metaLabel: "The development world \u00b7 Part four checkpoint",
    title: "Part four checkpoint",
    intro:
      "Seven questions drawn from Part four - the world you build in. Pick the best answer for each, then submit. Score five or more to pass and earn XP; a fresh set is drawn each time you retry.",
    xpKey: "course_global_xp",
    awardedKey: "theory_check_4_awarded",
    awardAmount: 40,
    askCount: 7,
    passRatio: 0.7,
    questions: [
      {
        concept: "Libraries",
        conceptId: "th-library",
        stem: "Why pull in a library instead of writing everything yourself?",
        options: [
          "To reuse tested code others wrote, so you build faster and safer",
          "Libraries make the CPU run faster",
          "You must - code will not run without one",
          "To hide your own code from others",
        ],
        correct: 0,
        why: "A library is ready-made, tested code you can build on, so you do not reinvent common work.",
      },
      {
        concept: "Standard library",
        conceptId: "th-standard-library",
        stem: "What is the standard library?",
        options: [
          "The useful code that ships with the language itself",
          "A website full of tutorials",
          "The first file you write in a project",
          "The operating system",
        ],
        correct: 0,
        why: "The standard library comes with the language - common tools available without installing anything.",
      },
      {
        concept: "Packages",
        conceptId: "th-package",
        stem: "What is a package?",
        options: [
          "A bundle of code you can pull into your project",
          "A single compiled CPU instruction",
          "A saved text document",
          "A type of variable",
        ],
        correct: 0,
        why: "A package is shareable code you add to your project to get features you did not write.",
      },
      {
        concept: "Package manager",
        conceptId: "th-package-manager",
        stem: "What fetches packages - and the packages they depend on - for you?",
        options: [
          "A package manager",
          "The compiler",
          "The monitor",
          "A loop in your code",
        ],
        correct: 0,
        why: "A package manager downloads the packages you ask for plus their own dependencies.",
      },
      {
        concept: "Dependencies",
        conceptId: "th-dependency",
        stem: "Your project needs library X in order to build. X is called a...?",
        options: [
          "Dependency",
          "Syntax error",
          "Commit",
          "Variable",
        ],
        correct: 0,
        why: "Code your project relies on is a dependency; the package manager makes sure it is present.",
      },
      {
        concept: "Version control",
        conceptId: "th-version-control",
        stem: "What does version control give you?",
        options: [
          "A tracked history of every change, so you can look back or undo",
          "Faster-running code",
          "More memory for the program",
          "A database for user data",
        ],
        correct: 0,
        why: "Version control records changes over time so you can review history and recover earlier versions.",
      },
      {
        concept: "Commits",
        conceptId: "th-commit",
        stem: "What is a commit?",
        options: [
          "A saved snapshot of the project at a point in time",
          "A program that is currently running",
          "A package you installed",
          "A syntax error",
        ],
        correct: 0,
        why: "A commit records the state of the project, with a message, as one step in its history.",
      },
      {
        concept: "History",
        conceptId: "th-history",
        stem: "Why is a project's history useful?",
        options: [
          "You can see what changed and return to an earlier version",
          "It makes the app run faster",
          "It stores the users' data",
          "It compiles the code for you",
        ],
        correct: 0,
        why: "The history is a record of every commit, so you can trace changes and roll back if needed.",
      },
      {
        concept: "Collaboration",
        conceptId: "th-collaboration",
        stem: "How do several people work on one project without overwriting each other?",
        options: [
          "Version control tracks and merges everyone's commits",
          "They email files back and forth",
          "Only one person may write code at a time",
          "The compiler decides who wins",
        ],
        correct: 0,
        why: "Version control lets each person commit their work and merges the changes together.",
      },
      {
        concept: "Branches",
        conceptId: "th-vcs-branch",
        stem: "Why open a branch before trying a risky change?",
        options: [
          "It gives you a separate line of commits, so the working version stays safe",
          "It makes the code compile faster",
          "It deletes the old history",
          "It emails the change to your team",
        ],
        correct: 0,
        why: "A branch is your own line of commits that splits off from the main one, so you can experiment without touching the version that works.",
      },
      {
        concept: "Merging",
        conceptId: "th-merge",
        stem: "What does merging a branch do?",
        options: [
          "Brings its commits back into the main line, joining the two histories",
          "Throws the branch's work away",
          "Renames every file in the project",
          "Stops anyone else from committing",
        ],
        correct: 0,
        why: "Merging joins a branch's commits back into the main line, so the finished work becomes part of the shared history.",
      },
      {
        concept: "Remote",
        conceptId: "th-remote",
        stem: "What is a remote in version control?",
        options: [
          "A shared copy of the history on a server that the whole team pushes to and pulls from",
          "A faster CPU for building code",
          "A backup that only you can see",
          "A tool that writes commits for you",
        ],
        correct: 0,
        why: "A remote is a shared copy of the history, often hosted on a platform like GitHub, so a team works through one agreed place.",
      },
    ],
  };
})();
