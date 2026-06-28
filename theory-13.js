// Theory track - Part 2, Lesson 6: "Functions: naming a set of steps".
// Conceptual. Ties back to Part 1's Main (the entry point is a function) and
// points forward to the practical Methods lesson.
(function () {
  "use strict";

  const drills = [
    {
      title: "Bundling steps under a name",
      concept: "Function",
      context:
        "When a group of steps belong together, you can bundle them under a name. That named bundle is a function. You run all the steps at once by calling the name.",
      quiz: {
        question: "What is a function?",
        options: [
          { text: "A named bundle of steps you can run by name", correct: true },
          { text: "A kind of number", correct: false },
          { text: "A piece of hardware", correct: false },
        ],
        answerWhy: "A function groups steps under a name so you can run them all by calling that name.",
      },
      snippet: "A {{1}} is a named bundle of steps; you run them all by calling its name.",
      points: [
        "A function groups related steps under one name.",
        "Calling the name runs the whole bundle.",
      ],
      blanks: [
        {
          id: 1,
          label: "A named bundle of steps",
          answer: "function",
          hints: ["The word this lesson is about."],
          explain: [
            { text: "A function is a named bundle of steps you run by calling its name." },
          ],
        },
      ],
    },
    {
      title: "Reuse",
      concept: "Reuse",
      context:
        "The big win of a function is reuse: write the steps once, then call it as many times as you need instead of repeating them.",
      quiz: {
        question: "Why are functions useful?",
        options: [
          { text: "Write steps once, reuse them many times", correct: true },
          { text: "They make the screen bigger", correct: false },
          { text: "They use less electricity", correct: false },
        ],
        answerWhy: "A function lets you write a set of steps once and call it again and again.",
      },
      snippet: "A function lets you write steps once and {{1}} them many times by calling its name.",
      points: [
        "No need to repeat the same steps.",
        "Call the function wherever you need those steps.",
      ],
      blanks: [
        {
          id: 1,
          label: "What a function lets you do with steps written once",
          answer: "reuse",
          accept: ["re-use"],
          hints: ["Use again."],
          explain: [
            { text: "A function lets you reuse the same steps by calling it many times." },
          ],
        },
      ],
    },
    {
      title: "Inputs",
      concept: "Arguments",
      context:
        "A function can take inputs - values you hand it to work on, called arguments. The same function can give different results for different inputs.",
      quiz: {
        question: "What are arguments?",
        options: [
          { text: "Values you hand a function to work on", correct: true },
          { text: "Disagreements between programs", correct: false },
          { text: "Names of variables", correct: false },
        ],
        answerWhy: "Arguments are the input values you pass into a function for it to work on.",
      },
      snippet: "A function can take inputs called {{1}} - the values you hand it to work on.",
      points: [
        "Arguments are the function's inputs.",
        "Different inputs can give different results.",
      ],
      blanks: [
        {
          id: 1,
          label: "The inputs you hand a function",
          answer: "arguments",
          accept: ["argument", "inputs"],
          hints: ["The values passed in."],
          explain: [
            { text: "Arguments are the input values you hand a function." },
          ],
        },
      ],
    },
    {
      title: "Output",
      concept: "Return value",
      context:
        "A function can also hand back a result when it finishes - its return value. You call the function, it works, and gives you an answer to use.",
      quiz: {
        question: "What is a return value?",
        options: [
          { text: "The result a function hands back", correct: true },
          { text: "The function's name", correct: false },
          { text: "An error message", correct: false },
        ],
        answerWhy: "A return value is the result a function gives back to whoever called it.",
      },
      snippet: "A function can hand back a result when it finishes - its {{1}} value.",
      points: [
        "A function can produce an answer.",
        "That answer is its return value.",
      ],
      blanks: [
        {
          id: 1,
          label: "The kind of value a function hands back",
          answer: "return",
          hints: ["It 'returns' the result."],
          explain: [
            { text: "The return value is the result a function hands back." },
          ],
        },
      ],
    },
    {
      title: "Programs are many small functions",
      concept: "Building from functions",
      context:
        "Real programs are built from many small functions, each doing one job. Even the starting point you met in Part one - Main - is a function; running a program means calling it. The practical Methods lesson is where you write your own.",
      quiz: {
        question: "How are real programs structured?",
        options: [
          { text: "From many small functions, each doing one job", correct: true },
          { text: "As one giant list of steps with no names", correct: false },
          { text: "Without any functions at all", correct: false },
        ],
        answerWhy: "Programs are built from many small functions; even Main, the entry point, is one.",
      },
      snippet: "Programs are built from many small {{1}}, each doing one job - even Main is one.",
      points: [
        "Programs are composed of small named functions.",
        "Main from Part 1 is itself a function.",
      ],
      blanks: [
        {
          id: 1,
          label: "The small named pieces programs are built from",
          answer: "functions",
          accept: ["function"],
          hints: ["The word from the first card, plural."],
          explain: [
            { text: "Programs are built from many small functions, including Main." },
          ],
        },
      ],
    },
    {
      title: "Functions - recap",
      concept: "Recap",
      summary: true,
      context: "You now have the idea that lets programs stay organised as they grow.",
      summaryIntro:
        "A function is a named, reusable bundle of steps that can take inputs and hand back a result - and programs are built from many of them.",
      summaryItems: [
        { title: "Function - ", text: "a named bundle of steps you run by calling it." },
        { title: "Reuse - ", text: "write steps once, call them many times." },
        { title: "Arguments - ", text: "the input values you hand a function." },
        { title: "Return value - ", text: "the result a function hands back." },
        { title: "Many functions - ", text: "programs are built from small functions; even Main is one." },
      ],
      summaryClose: "Next lesson: why programs go wrong - bugs, and what debugging really is.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th13",
    mode: "theory",
    metaLabel: "From idea to code \u00b7 Functions",
    progressNoun: "Topic",
    awardedKey: "theory_13_awarded",
    awardAmount: 20,
    drills,
  };
})();
