// Theory track - Part 2, Lesson 3: "Types: what kind of value".
// Conceptual. Builds on Lesson 2 (variables hold values) - now: every value has
// a kind, and the kind decides what you can do with it.
(function () {
  "use strict";

  const drills = [
    {
      title: "Every value has a type",
      concept: "Type",
      context:
        "Every value a program works with has a type - a kind. The number 7, the text \"hello\", and the answer true are three different kinds of value.",
      quiz: {
        question: "Which of these are different types of value?",
        options: [
          { text: "A number, some text, and true/false", correct: true },
          { text: "They are all the same kind", correct: false },
          { text: "Only numbers have a type", correct: false },
        ],
        answerWhy: "A number, text, and true/false are three distinct types - different kinds of value.",
      },
      snippet: "Every value has a {{1}} - a kind, like a number, some text, or true/false.",
      points: [
        "A value is always of some kind.",
        "Numbers, text, and true/false are different types.",
      ],
      blanks: [
        {
          id: 1,
          label: "The kind a value is",
          answer: "type",
          hints: ["The word this lesson is about."],
          explain: [
            { text: "Every value has a type - the kind of value it is." },
          ],
        },
      ],
    },
    {
      title: "The type decides what you can do",
      concept: "What you can do",
      context:
        "The type decides what makes sense to do with a value. You can add two numbers; you can join two pieces of text; but adding a number to a word makes no sense.",
      quiz: {
        question: "Why can't you always combine two values?",
        options: [
          { text: "Their types decide what operations make sense", correct: true },
          { text: "The computer is lazy", correct: false },
          { text: "Values can never be combined", correct: false },
        ],
        answerWhy: "The type sets the rules: add numbers, join text - but mixing incompatible types makes no sense.",
      },
      snippet: "A value's {{1}} decides what you can do with it: add numbers, join text, but not mix the two carelessly.",
      points: [
        "Operations depend on the type.",
        "Numbers add; text joins; mixing them is meaningless.",
      ],
      blanks: [
        {
          id: 1,
          label: "What decides which operations make sense",
          answer: "type",
          hints: ["The same word as the last card."],
          explain: [
            { text: "The type decides what you can sensibly do with a value." },
          ],
        },
      ],
    },
    {
      title: "Common types",
      concept: "Common kinds",
      context:
        "A few types come up constantly: whole numbers (like 7), decimal numbers (like 3.5), text (like \"cat\"), and true/false. Most values you meet are one of these.",
      quiz: {
        question: "Which is a common value type?",
        options: [
          { text: "Text, like \"cat\"", correct: true },
          { text: "A keyboard", correct: false },
          { text: "A folder", correct: false },
        ],
        answerWhy: "Whole numbers, decimals, text, and true/false are the everyday types most values fall into.",
      },
      snippet: "Common types include whole numbers, decimals, text, and {{1}}/false.",
      points: [
        "Whole numbers, decimals, text, true/false cover most values.",
        "You will meet these constantly.",
      ],
      blanks: [
        {
          id: 1,
          label: "The yes side of the true/false type",
          answer: "true",
          hints: ["The opposite of false."],
          explain: [
            { text: "true/false is a common type - the value is one or the other." },
          ],
        },
      ],
    },
    {
      title: "The type travels with the variable",
      concept: "One kind per box",
      context:
        "A variable is usually for one kind of value. A box meant for numbers holds numbers; you do not suddenly put text in it. The type comes along with the variable.",
      quiz: {
        question: "Can a variable meant for numbers usually hold text instead?",
        options: [
          { text: "No - a variable is usually for one kind of value", correct: true },
          { text: "Yes, any variable holds anything", correct: false },
          { text: "Only on weekends", correct: false },
        ],
        answerWhy: "A variable is typically tied to one type - a number box holds numbers, not text.",
      },
      snippet: "A variable is usually for {{1}} kind of value - a number box holds numbers, not text.",
      points: [
        "A variable is tied to a type.",
        "You do not freely mix kinds in one box.",
      ],
      blanks: [
        {
          id: 1,
          label: "How many kinds of value a variable usually holds",
          answer: "one",
          accept: ["1", "a single"],
          hints: ["The smallest whole number."],
          explain: [
            { text: "A variable usually holds one kind of value - its type travels with it." },
          ],
        },
      ],
    },
    {
      title: "Why types help",
      concept: "Catching mistakes",
      context:
        "Types catch mistakes early. If you try to use a value the wrong way - like doing maths on a word - the compiler complains before the program ever runs, instead of failing later.",
      quiz: {
        question: "How do types help you?",
        options: [
          { text: "They catch certain mistakes before the program runs", correct: true },
          { text: "They make the screen brighter", correct: false },
          { text: "They delete bad code", correct: false },
        ],
        answerWhy: "Because each value has a known type, the compiler can spot misuse before the program runs.",
      },
      snippet: "Types help by catching mistakes {{1}}: the compiler complains before the program runs if you misuse a value.",
      points: [
        "Types let the compiler spot misuse.",
        "Mistakes are caught before running, not after.",
      ],
      blanks: [
        {
          id: 1,
          label: "When types catch a mistake (relative to running)",
          answer: "early",
          accept: ["beforehand", "sooner"],
          hints: ["Before the program runs, not after."],
          explain: [
            { text: "Types catch misuse early - before the program runs." },
          ],
        },
      ],
    },
    {
      title: "Types - recap",
      concept: "Recap",
      summary: true,
      context: "You now know why a value is never just 'a value'.",
      summaryIntro:
        "Every value has a type - a kind - and the kind decides what you can do with it and helps catch mistakes early.",
      summaryItems: [
        { title: "Type - ", text: "the kind of a value: number, text, true/false." },
        { title: "What you can do - ", text: "the type decides which operations make sense." },
        { title: "Common types - ", text: "whole numbers, decimals, text, true/false." },
        { title: "One per box - ", text: "a variable is usually for one kind of value." },
        { title: "Catches mistakes - ", text: "the compiler spots misuse before the program runs." },
      ],
      summaryClose: "Next lesson: the building blocks code is made of - statements and expressions.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th10",
    mode: "theory",
    metaLabel: "From idea to code \u00b7 Types",
    progressNoun: "Topic",
    awardedKey: "theory_10_awarded",
    awardAmount: 20,
    drills,
  };
})();
