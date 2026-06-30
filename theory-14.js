// Theory track - Part 2, Lesson 7: "Bugs: why programs go wrong".
// Closes Part 2 and hands off to the practical track. Conceptual: a bug is a
// mistake in the instructions (callback to Part 1: the computer is literal),
// syntax vs logic errors, debugging, and that bugs are a normal part of coding.
(function () {
  "use strict";

  const drills = [
    {
      title: "A bug is a mistake in the instructions",
      concept: "Bug",
      context:
        "When a program misbehaves, it is almost always a bug - a mistake in the instructions. Remember from Part one: the computer did exactly what you wrote, not what you meant.",
      quiz: {
        question: "What is a bug?",
        options: [
          { text: "A mistake in the instructions", correct: true },
          { text: "An insect in the computer", correct: false },
          { text: "A broken screen", correct: false },
        ],
        answerWhy: "A bug is a mistake in the instructions; the computer follows them literally, even when they are wrong.",
      },
      snippet: "A {{1}} is a mistake in the instructions - the computer did what you wrote, not what you meant.",
      points: [
        "A bug is a fault in the instructions, not the machine.",
        "The computer follows your instructions literally.",
      ],
      blanks: [
        {
          id: 1,
          label: "A mistake in the instructions",
          answer: "bug",
          accept: ["a bug"],
          hints: ["The everyday word for a coding mistake."],
          explain: [
            { text: "A bug is a mistake in the instructions a program follows." },
          ],
        },
      ],
    },
    {
      title: "Syntax errors",
      concept: "Syntax error",
      context:
        "One kind of mistake breaks the language's rules - a syntax error. The compiler catches these before the program runs and refuses to translate the code until you fix them.",
      quiz: {
        question: "When are syntax errors caught?",
        options: [
          { text: "Before the program runs, by the compiler", correct: true },
          { text: "Never", correct: false },
          { text: "Only after it ships to users", correct: false },
        ],
        answerWhy: "A syntax error breaks the language rules, so the compiler stops before the program ever runs.",
      },
      snippet: "A {{1}} error breaks the language's rules; the compiler catches it before the program runs.",
      points: [
        "Syntax errors break the language's rules.",
        "The compiler catches them up front.",
      ],
      blanks: [
        {
          id: 1,
          label: "The error that breaks the language's rules",
          answer: "syntax",
          hints: ["The 'rules' word from Lesson 1."],
          explain: [
            { text: "A syntax error breaks the language's rules and is caught by the compiler." },
          ],
        },
      ],
    },
    {
      title: "Logic errors",
      concept: "Logic error",
      context:
        "A trickier kind runs fine but does the wrong thing - a logic error. The code is valid, so nothing complains; it just gives a wrong answer, like adding when you meant to subtract.",
      quiz: {
        question: "What is a logic error?",
        options: [
          { text: "Valid code that does the wrong thing", correct: true },
          { text: "Code the compiler rejects", correct: false },
          { text: "A hardware fault", correct: false },
        ],
        answerWhy: "A logic error is valid code that runs but produces the wrong result - no warning, just wrong.",
      },
      snippet: "A {{1}} error is valid code that runs but does the wrong thing - no complaint, just a wrong result.",
      points: [
        "Logic errors pass the compiler but behave wrongly.",
        "Nothing complains - you only see a wrong result.",
      ],
      blanks: [
        {
          id: 1,
          label: "The error where valid code does the wrong thing",
          answer: "logic",
          hints: ["About the meaning, not the rules."],
          explain: [
            { text: "A logic error is valid code that does the wrong thing." },
          ],
        },
      ],
    },
    {
      title: "Debugging",
      concept: "Debugging",
      context:
        "Finding and fixing a bug is called debugging. It means checking what the program actually does, step by step, until you find where reality and intention part ways.",
      quiz: {
        question: "What is debugging?",
        options: [
          { text: "Finding and fixing the cause of a bug", correct: true },
          { text: "Writing more bugs on purpose", correct: false },
          { text: "Deleting the program", correct: false },
        ],
        answerWhy: "Debugging is tracing what the program really does to find and fix the cause of a bug.",
      },
      snippet: "Finding and fixing a bug is called {{1}} - checking what the program actually does, step by step.",
      points: [
        "Debugging is tracing the real behaviour.",
        "You look for where intention and reality differ.",
      ],
      blanks: [
        {
          id: 1,
          label: "Finding and fixing a bug",
          answer: "debugging",
          hints: ["Removing the 'bugs'."],
          explain: [
            { text: "Debugging is finding and fixing the cause of a bug." },
          ],
        },
      ],
    },
    {
      title: "Bugs are normal",
      concept: "Part of the job",
      context:
        "Every program has bugs; even experts write them. The skill is not avoiding them entirely but finding and fixing them - which is most of what programming actually feels like.",
      quiz: {
        question: "What is the realistic view of bugs?",
        options: [
          { text: "All software has them; the skill is finding and fixing", correct: true },
          { text: "Good programmers never write bugs", correct: false },
          { text: "Bugs mean you should give up", correct: false },
        ],
        answerWhy: "Bugs are unavoidable; the real skill is finding and fixing them efficiently.",
      },
      snippet: "All software has bugs; the skill is not avoiding them but {{1}} and fixing them.",
      points: [
        "Bugs are a normal part of writing software.",
        "The skill is in finding and fixing them.",
      ],
      blanks: [
        {
          id: 1,
          label: "What the skill is, besides fixing bugs",
          answer: "finding",
          hints: ["You have to locate a bug before you can fix it."],
          explain: [
            { text: "The skill is finding and fixing bugs, since all software has them." },
          ],
        },
      ],
    },
    {
      title: "Bugs - recap",
      concept: "Recap",
      summary: true,
      context: "That completes the vocabulary of writing code.",
      summaryIntro:
        "Bugs are mistakes in the instructions: syntax errors the compiler catches, and logic errors that run but do the wrong thing. Finding and fixing them - debugging - is most of the work.",
      summaryItems: [
        { title: "Bug - ", text: "a mistake in the instructions; the computer is literal." },
        { title: "Syntax error - ", text: "breaks the rules; caught by the compiler before running." },
        { title: "Logic error - ", text: "valid code that runs but does the wrong thing." },
        { title: "Debugging - ", text: "finding and fixing the cause, step by step." },
        { title: "Normal - ", text: "all software has bugs; finding and fixing is the skill." },
      ],
      summaryClose: "That completes Part two. You now have the vocabulary of code - languages, variables, types, statements, decisions, functions and bugs. Next, Part three: how software really runs, remembers and connects.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th14",
    mode: "theory",
    metaLabel: "From idea to code \u00b7 Bugs",
    progressNoun: "Topic",
    awardedKey: "theory_14_awarded",
    awardAmount: 20,
    drills,
  };
})();
