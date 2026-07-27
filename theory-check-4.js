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
    nextHref: "index.html",
    nextLabel: "Back to the course",
    questions: [
      {
        concept: "Libraries",
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
    ],
  };
})();
