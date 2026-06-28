// Theory track - Part 2, Lesson 2: "Variables: a named box for a value".
// Conceptual (the idea of a variable), not hands-on. Builds on Part 1 (data
// lives in memory) and Lesson 1 (a language lets us write instructions).
(function () {
  "use strict";

  const drills = [
    {
      title: "A named box for a value",
      concept: "Variable",
      context:
        "From Part one, a running program keeps its data in memory. Rather than track raw memory locations, you give each value a name. A named place that holds a value is a variable.",
      quiz: {
        question: "What is a variable?",
        options: [
          { text: "A named place that holds a value", correct: true },
          { text: "A part of the CPU", correct: false },
          { text: "A kind of error", correct: false },
        ],
        answerWhy: "A variable is a name for a place in memory that holds a value you can use later.",
      },
      snippet: "A {{1}} is a named place in memory that holds a value.",
      points: [
        "A variable pairs a name with a value held in memory.",
        "You work with the name instead of a raw memory location.",
      ],
      blanks: [
        {
          id: 1,
          label: "A named place that holds a value",
          answer: "variable",
          hints: ["The word this whole lesson is about."],
          explain: [
            { text: "A variable is a named place in memory holding a value." },
          ],
        },
      ],
    },
    {
      title: "Why names",
      concept: "Readability",
      context:
        "Names are for people. The computer is happy with raw memory locations, but a clear name tells you what the value is for, so the code makes sense to read.",
      quiz: {
        question: "Why do we give values names instead of using raw memory locations?",
        options: [
          { text: "Names make the code readable for people", correct: true },
          { text: "The computer cannot use locations", correct: false },
          { text: "Names make the program run faster", correct: false },
        ],
        answerWhy: "The machine is fine with locations; names are there so people can read and understand the code.",
      },
      snippet: "A clear {{1}} like total tells you what a value is for, so the code is easy to read.",
      points: [
        "The computer works fine with raw locations.",
        "Names exist so people can understand the code.",
      ],
      blanks: [
        {
          id: 1,
          label: "What we give a value so the code reads clearly",
          answer: "name",
          hints: ["A clear ___ like total or userName."],
          explain: [
            { text: "A clear name tells a reader what the value is for." },
          ],
        },
      ],
    },
    {
      title: "It can change",
      concept: "Changing value",
      context:
        "The value in a variable can be replaced with a new one as the program runs. That is exactly why it is called a variable - the value can vary.",
      quiz: {
        question: "Why is it called a 'variable'?",
        options: [
          { text: "The value it holds can change", correct: true },
          { text: "It is always a number", correct: false },
          { text: "It can never change", correct: false },
        ],
        answerWhy: "The name comes from 'vary' - the value a variable holds can change as the program runs.",
      },
      snippet: "It is called a variable because the value it holds can {{1}} as the program runs.",
      points: [
        "A variable's value is not fixed.",
        "You can put a new value in at any time.",
      ],
      blanks: [
        {
          id: 1,
          label: "What the value in a variable can do",
          answer: "change",
          accept: ["vary"],
          hints: ["The root of the word 'variable'."],
          explain: [
            { text: "The value can change - that is why it is called a variable." },
          ],
        },
      ],
    },
    {
      title: "Read and write",
      concept: "Read / write",
      context:
        "You use a variable in two ways: read it to get its current value, or write to it to store a new one. Both are done through its name.",
      quiz: {
        question: "What does it mean to 'read' a variable?",
        options: [
          { text: "Get its current value", correct: true },
          { text: "Delete it", correct: false },
          { text: "Rename it", correct: false },
        ],
        answerWhy: "Reading gets the current value; writing stores a new one. Both use the variable's name.",
      },
      snippet: "Use a variable's name to {{1}} its current value, or to write a new value into it.",
      points: [
        "Read = get the current value.",
        "Write = store a new value.",
      ],
      blanks: [
        {
          id: 1,
          label: "Getting a variable's current value",
          answer: "read",
          hints: ["The opposite of write."],
          explain: [
            { text: "Reading a variable gets its current value; writing stores a new one." },
          ],
        },
      ],
    },
    {
      title: "One thing at a time",
      concept: "Replacement",
      context:
        "A variable holds one value at a time. Writing a new value replaces the old one - the previous value is gone unless you saved it somewhere else first.",
      quiz: {
        question: "What happens to the old value when you write a new one into a variable?",
        options: [
          { text: "It is replaced and gone", correct: true },
          { text: "Both values are kept", correct: false },
          { text: "The variable splits in two", correct: false },
        ],
        answerWhy: "A variable holds one value at a time; a new write overwrites the old value.",
      },
      snippet: "A variable holds one value at a time, so writing a new value {{1}} the old one.",
      points: [
        "Only one value lives in a variable at once.",
        "Writing overwrites whatever was there before.",
      ],
      blanks: [
        {
          id: 1,
          label: "What a new value does to the old one",
          answer: "replaces",
          accept: ["overwrites", "replace"],
          hints: ["The old value does not survive."],
          explain: [
            { text: "Writing a new value replaces the old one, which is then gone." },
          ],
        },
      ],
    },
    {
      title: "Variables - recap",
      concept: "Recap",
      summary: true,
      context: "You now have the single most-used idea in all of programming.",
      summaryIntro:
        "A variable is a named box for a value: you read it, write to it, and its contents can change over time.",
      summaryItems: [
        { title: "Variable - ", text: "a named place in memory that holds a value." },
        { title: "Names - ", text: "for people, so the code is readable." },
        { title: "Changes - ", text: "the value can vary as the program runs." },
        { title: "Read / write - ", text: "get the current value, or store a new one." },
        { title: "One at a time - ", text: "writing a new value replaces the old." },
      ],
      summaryClose: "Next lesson: every value has a type - whether it is a number, some text, or true/false.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th9",
    mode: "theory",
    metaLabel: "From idea to code \u00b7 Variables",
    progressNoun: "Topic",
    awardedKey: "theory_9_awarded",
    awardAmount: 20,
    drills,
  };
})();
