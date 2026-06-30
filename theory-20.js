// Theory track - Part 3, Lesson 6 (final): "How code is shared". Absolute-beginner,
// no code. Version control tracks every change; a commit is a saved snapshot with
// a message; the history is the timeline you can look back through; and it lets a
// team combine everyone's work. Closes Part three and the theory track.
// Drill-engine theory mode (MC + fill-blank).
(function () {
  "use strict";

  const drills = [
    {
      title: "Code changes - track every change",
      concept: "Version control",
      context:
        "Code is never really finished; you change it constantly. A version control tool keeps track of every change you make, so you never lose work and can always see what changed, and when.",
      quiz: {
        question: "What keeps track of every change to your code?",
        options: [
          { text: "A version control tool", correct: true },
          { text: "The compiler", correct: false },
          { text: "The screen", correct: false },
        ],
        answerWhy: "A version control tool records every change, so nothing is lost and history is visible.",
      },
      snippet: "A {{1}} control tool tracks every change to your code, so nothing is lost.",
      points: [
        "Code changes all the time.",
        "Version control records every change for you.",
      ],
      blanks: [
        {
          id: 1,
          label: "___ control: the tool that tracks code changes",
          answer: "version",
          hints: ["Each saved change is a new version."],
          explain: [
            { text: "Version control tracks every change to your code." },
          ],
        },
      ],
    },
    {
      title: "A commit is a saved snapshot",
      concept: "Commit",
      context:
        "When you reach a point worth keeping, you make a commit - a saved snapshot of your code at that moment, with a short message saying what changed. It is like a checkpoint you can always come back to.",
      quiz: {
        question: "What is a commit?",
        options: [
          { text: "A saved snapshot of your code, with a message", correct: true },
          { text: "A kind of error", correct: false },
          { text: "A type of variable", correct: false },
        ],
        answerWhy: "A commit is a snapshot of your code at a moment, saved with a message describing the change.",
      },
      snippet: "A {{1}} is a saved snapshot of your code at a moment, with a message.",
      points: [
        "A commit captures the code as it is right now.",
        "Its message says what changed.",
      ],
      blanks: [
        {
          id: 1,
          label: "A saved snapshot of your code with a message",
          answer: "commit",
          hints: ["You 'commit' your changes."],
          explain: [
            { text: "A commit is a saved snapshot of your code, with a message." },
          ],
        },
      ],
    },
    {
      title: "The history lets you look back",
      concept: "History",
      context:
        "All your commits together form a history - a timeline of how the code grew, snapshot by snapshot. You can look back at any point, see what changed, and even undo a change that turned out to be wrong.",
      quiz: {
        question: "What is the list of all your commits called?",
        options: [
          { text: "The history", correct: true },
          { text: "The network", correct: false },
          { text: "The runtime", correct: false },
        ],
        answerWhy: "The commits together form the history - a timeline you can look back through and undo from.",
      },
      snippet: "Your commits form a {{1}} - a timeline you can look back through.",
      points: [
        "Each commit is a point on the timeline.",
        "You can look back, and undo a bad change.",
      ],
      blanks: [
        {
          id: 1,
          label: "The timeline made of all your commits",
          answer: "history",
          hints: ["The past record of changes."],
          explain: [
            { text: "The commits together form the history - the timeline of the code." },
          ],
        },
      ],
    },
    {
      title: "Many people, one project",
      concept: "Sharing",
      context:
        "Version control also lets people work together. Everyone keeps their own copy, makes commits, and shares them, so a whole team's changes come together into one project - without anyone overwriting someone else's work.",
      quiz: {
        question: "How does version control help a team?",
        options: [
          { text: "Everyone's commits come together into one project", correct: true },
          { text: "It stops anyone from editing", correct: false },
          { text: "It deletes the old code", correct: false },
        ],
        answerWhy: "Version control merges everyone's commits into one shared project, without overwriting each other.",
      },
      snippet: "Version control lets a team combine everyone's {{1}} into one project.",
      points: [
        "Everyone has their own copy and makes commits.",
        "Those commits come together into one shared project.",
      ],
      blanks: [
        {
          id: 1,
          label: "What each person makes and shares",
          answer: "commits",
          accept: ["commit", "changes"],
          hints: ["The snapshots from earlier in this lesson."],
          explain: [
            { text: "A team combines everyone's commits into one project." },
          ],
        },
      ],
    },
    {
      title: "How code is shared - recap",
      concept: "Recap",
      summary: true,
      context: "That completes Part three - and the theory track.",
      summaryIntro:
        "Version control keeps the history of your code and lets a team work on it together, one saved snapshot at a time.",
      summaryItems: [
        { title: "Version control - ", text: "tracks every change so nothing is lost." },
        { title: "Commit - ", text: "a saved snapshot of the code, with a message." },
        { title: "History - ", text: "the timeline of commits you can look back through." },
        { title: "Sharing - ", text: "a team's commits come together into one project." },
      ],
      summaryClose: "That completes Part three. Across the three theory parts you now see what a computer is, the vocabulary of code, and how software really runs, remembers, connects and is shared. With these foundations, the practical track is where you build it for real.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th20",
    mode: "theory",
    metaLabel: "How software runs \u00b7 How code is shared",
    progressNoun: "Topic",
    awardedKey: "theory_20_awarded",
    awardAmount: 20,
    drills,
  };
})();
