// Theory track - Part 5 checkpoint. Closes Part five ("Foundations of good
// code") and awards XP once on a pass. Data only: sets window.QUIZ_CONFIG for
// the code-lab Quiz component (CodeLab.Quiz), which owns the draw / shuffle /
// grading. Bank of 8, six drawn each attempt.
(function () {
  "use strict";

  window.QUIZ_CONFIG = {
    prefix: "chk5",
    metaLabel: "Foundations of good code \u00b7 Part five checkpoint",
    title: "Part five checkpoint",
    intro:
      "Six questions drawn from Part five - the habits of good code. Pick the best answer for each, then submit. Score four or more to pass and earn XP; a fresh set is drawn each time you retry.",
    xpKey: "course_global_xp",
    awardedKey: "good_code_check_awarded",
    awardAmount: 40,
    askCount: 6,
    passRatio: 0.6,
    questions: [
      {
        concept: "Good names",
        conceptId: "th-good-name",
        stem: "What makes a name like timeoutSeconds better than t?",
        options: [
          "It says what the value holds, so the code explains itself",
          "It makes the program run faster",
          "Shorter names are always better",
          "It uses less memory",
        ],
        correct: 0,
        why: "A good name says what a value holds or what a function does, so a reader does not have to guess.",
      },
      {
        concept: "Good names",
        conceptId: "th-good-name",
        stem: "A function named check() is awkward to work with mainly because...",
        options: [
          "Its name does not say what it checks, so you must open it to find out",
          "The CPU cannot run functions with short names",
          "It runs slower than checkLogin()",
          "A function may not be named with one word",
        ],
        correct: 0,
        why: "A name should say what a function does; check() forces the reader to open it to learn its job.",
      },
      {
        concept: "Duplication",
        conceptId: "th-duplication",
        stem: "Why is copy-pasting the same logic into two places risky?",
        options: [
          "A later fix must be made in every copy, and one is easy to miss",
          "Copied code always runs slower",
          "The compiler refuses to build duplicated code",
          "It uses twice as much memory while running",
        ],
        correct: 0,
        why: "Duplication spreads one piece of knowledge across many places, so a change has to be repeated and a copy can be forgotten.",
      },
      {
        concept: "Duplication",
        conceptId: "th-duplication",
        stem: "\"Don't repeat yourself\" suggests that a rule used in several places should be...",
        options: [
          "Put in one named function that each place calls",
          "Copied carefully so every copy matches",
          "Deleted from all but one place",
          "Marked with a comment above each copy",
        ],
        correct: 0,
        why: "DRY keeps each piece of knowledge in a single place, so you fix it once and every caller gets the fix.",
      },
      {
        concept: "Single purpose",
        conceptId: "th-single-purpose",
        stem: "What is the benefit of a function that does just one job?",
        options: [
          "It earns a clear name and can be reused on its own",
          "It always has fewer lines than any other function",
          "It never needs to be checked",
          "It runs on more operating systems",
        ],
        correct: 0,
        why: "A single-purpose function is easy to name, reuse and check in isolation - the everyday seed of the single-responsibility idea.",
      },
      {
        concept: "Readability",
        conceptId: "th-readability",
        stem: "Why prefer a plain multi-line version over a clever one-liner that does the same thing?",
        options: [
          "Code is read far more than written, so clarity saves every reader time",
          "One-liners produce wrong results",
          "The compiler rejects nested expressions",
          "Longer code always runs faster",
        ],
        correct: 0,
        why: "Readability is how quickly a reader understands code; since code is read more than written, clear usually beats clever.",
      },
      {
        concept: "Comments",
        conceptId: "th-comment",
        stem: "Which comment is worth keeping?",
        options: [
          "One that explains why - a reason the code cannot show",
          "One that repeats what the line already says",
          "One that just restates the variable name",
          "A comment is never worth keeping",
        ],
        correct: 0,
        why: "Good comments capture the reason (why); a comment that repeats the code adds nothing and goes stale.",
      },
      {
        concept: "Comments",
        conceptId: "th-comment",
        stem: "The comment  i = i + 1  // add one to i  is poor because...",
        options: [
          "It repeats the code and will go stale if the line changes",
          "Comments must be written in English",
          "The computer runs the comment too",
          "It should sit below the line, not beside it",
        ],
        correct: 0,
        why: "A comment that repeats the code adds nothing and rots when the code changes; a better name removes the need for it.",
      },
    ],
  };
})();
