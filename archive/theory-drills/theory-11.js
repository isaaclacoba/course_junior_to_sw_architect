// Theory track - Part 2, Lesson 4: "Statements and expressions".
// Conceptual building blocks of code. Builds on variables (L2) and types (L3),
// and ties assignment + ordering back to Part 1's instruction stream.
(function () {
  "use strict";

  const drills = [
    {
      title: "A statement is one step",
      concept: "Statement",
      context:
        "Code is made of statements. A statement is one complete instruction - a single step the program carries out, like \"print this\" or \"save that\".",
      quiz: {
        question: "What is a statement?",
        options: [
          { text: "One complete instruction - a single step", correct: true },
          { text: "A whole program", correct: false },
          { text: "A type of value", correct: false },
        ],
        answerWhy: "A statement is a single complete step the program carries out.",
      },
      snippet: "A {{1}} is one complete instruction - a single step the program carries out.",
      points: [
        "A statement is one step of the program.",
        "Programs are sequences of statements.",
      ],
      blanks: [
        {
          id: 1,
          label: "One complete instruction in code",
          answer: "statement",
          hints: ["The single-step building block."],
          explain: [
            { text: "A statement is one complete instruction - a single step." },
          ],
        },
      ],
    },
    {
      title: "An expression computes a value",
      concept: "Expression",
      context:
        "An expression is a piece of code that produces a value. \"2 + 3\" is an expression that produces 5; a variable's name is an expression that produces its current value.",
      quiz: {
        question: "What does an expression do?",
        options: [
          { text: "Produces a value", correct: true },
          { text: "Turns off the computer", correct: false },
          { text: "Names a file", correct: false },
        ],
        answerWhy: "An expression is any piece of code that produces a value, like 2 + 3 giving 5.",
      },
      snippet: "An {{1}} is a piece of code that produces a value, like 2 + 3 producing 5.",
      points: [
        "An expression results in a value.",
        "Even a variable's name is an expression.",
      ],
      blanks: [
        {
          id: 1,
          label: "A piece of code that produces a value",
          answer: "expression",
          hints: ["2 + 3 is one."],
          explain: [
            { text: "An expression produces a value - 2 + 3 produces 5." },
          ],
        },
      ],
    },
    {
      title: "Statements use expressions",
      concept: "How they fit",
      context:
        "Statements are built from expressions. \"Save 2 + 3 into total\" is a statement that uses the expression 2 + 3 to get a value, then stores it.",
      quiz: {
        question: "How do statements and expressions relate?",
        options: [
          { text: "Statements use expressions to get values", correct: true },
          { text: "They are completely unrelated", correct: false },
          { text: "Expressions contain whole programs", correct: false },
        ],
        answerWhy: "A statement often uses one or more expressions to compute the values it works with.",
      },
      snippet: "Statements use {{1}} to get values - \"save 2 + 3 into total\" uses the expression 2 + 3.",
      points: [
        "Expressions compute values; statements act on them.",
        "Most statements contain expressions.",
      ],
      blanks: [
        {
          id: 1,
          label: "What statements use to get values",
          answer: "expressions",
          accept: ["expression"],
          hints: ["The value-producing pieces from the last card."],
          explain: [
            { text: "A statement uses expressions to get the values it needs." },
          ],
        },
      ],
    },
    {
      title: "Assignment: store a value",
      concept: "Assignment",
      context:
        "A very common statement is assignment: take the value an expression produces and store it in a variable. \"total = 2 + 3\" computes 5, then puts it in total.",
      quiz: {
        question: "What does an assignment do?",
        options: [
          { text: "Stores a computed value in a variable", correct: true },
          { text: "Compares two numbers", correct: false },
          { text: "Deletes a variable", correct: false },
        ],
        answerWhy: "An assignment evaluates the expression on the right and stores the result in the variable on the left.",
      },
      snippet: "An {{1}} stores a value in a variable: total = 2 + 3 puts 5 into total.",
      points: [
        "Assignment connects expressions and variables.",
        "Right side computes a value; left side stores it.",
      ],
      blanks: [
        {
          id: 1,
          label: "The statement that stores a value in a variable",
          answer: "assignment",
          hints: ["Uses = to put a value in a variable."],
          explain: [
            { text: "An assignment stores the value of an expression into a variable." },
          ],
        },
      ],
    },
    {
      title: "Top to bottom",
      concept: "Order",
      context:
        "Statements run in order, top to bottom - the same order you saw the CPU work through instructions in Part one. Some statements (decisions and loops) can jump elsewhere, which is the next lesson.",
      quiz: {
        question: "In what order do statements normally run?",
        options: [
          { text: "Top to bottom, in order", correct: true },
          { text: "Bottom to top", correct: false },
          { text: "All at once", correct: false },
        ],
        answerWhy: "By default statements run top to bottom, just like the CPU works through its instructions in order.",
      },
      snippet: "Statements normally run in order, {{1}} to bottom - just like the CPU working through instructions.",
      points: [
        "Default order is top to bottom.",
        "Decisions and loops can change that (next lesson).",
      ],
      blanks: [
        {
          id: 1,
          label: "Where statements start running from",
          answer: "top",
          hints: ["The opposite end from bottom."],
          explain: [
            { text: "Statements run top to bottom by default." },
          ],
        },
      ],
    },
    {
      title: "Statements and expressions - recap",
      concept: "Recap",
      summary: true,
      context: "You now know the two pieces every line of code is built from.",
      summaryIntro:
        "Code is statements (steps) built from expressions (values), run in order from top to bottom.",
      summaryItems: [
        { title: "Statement - ", text: "one complete instruction; a single step." },
        { title: "Expression - ", text: "a piece of code that produces a value." },
        { title: "They fit together - ", text: "statements use expressions to get values." },
        { title: "Assignment - ", text: "store a computed value into a variable." },
        { title: "Order - ", text: "top to bottom by default." },
      ],
      summaryClose: "Next lesson: how a program chooses and repeats - decisions and loops.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th11",
    mode: "theory",
    metaLabel: "From idea to code \u00b7 Statements",
    progressNoun: "Topic",
    awardedKey: "theory_11_awarded",
    awardAmount: 20,
    drills,
  };
})();
