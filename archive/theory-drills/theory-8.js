// Theory track - Part 2 "From idea to running code", Lesson 1: "What a
// programming language is". Opens Part 2: the bridge from how computers work
// (Part 1) to how we write programs. Conceptual, not hands-on - the practical
// track is where code gets typed and run. Same gentle audience and theory-mode
// format (quiz + prose fill-in-the-blank).
(function () {
  "use strict";

  const drills = [
    {
      title: "Why not write CPU instructions directly",
      concept: "Why a language",
      context:
        "From Part one, the CPU only runs tiny instructions, and they are painful for people to write by hand. So we write in a friendlier form and let a tool translate it. That friendlier form is a programming language.",
      quiz: {
        question: "Why don't people write programs directly as CPU instructions?",
        options: [
          { text: "They are tiny and hard to work with, so we use a friendlier language", correct: true },
          { text: "The CPU refuses to run them", correct: false },
          { text: "It is against the rules", correct: false },
        ],
        answerWhy: "CPU instructions are tiny and tedious; a programming language lets us express ideas, then a tool translates them down.",
      },
      snippet: "CPU instructions are tiny and hard to write by hand, so we write in a friendlier form called a programming {{1}}.",
      points: [
        "Raw CPU instructions are too low-level for people to write comfortably.",
        "A programming language is the friendlier form we write instead.",
      ],
      blanks: [
        {
          id: 1,
          label: "The friendlier form we write instead of CPU instructions",
          answer: "language",
          hints: ["A programming ___."],
          explain: [
            { text: "A programming language is the human-friendly form we write; a tool translates it to CPU instructions." },
          ],
        },
      ],
    },
    {
      title: "A language is rules for writing instructions",
      concept: "Language",
      context:
        "A programming language is an agreed set of words and rules for writing instructions. You express what you want using those words, and a tool turns it into instructions the CPU can run.",
      quiz: {
        question: "What is a programming language?",
        options: [
          { text: "An agreed set of words and rules for writing instructions", correct: true },
          { text: "A physical part of the computer", correct: false },
          { text: "A kind of file", correct: false },
        ],
        answerWhy: "A language is the agreed vocabulary and rules you use to write instructions a computer can carry out.",
      },
      snippet: "A programming language is an agreed set of words and {{1}} for writing instructions a computer can run.",
      points: [
        "A language gives you words to express what you want.",
        "It also has rules for how those words fit together.",
      ],
      blanks: [
        {
          id: 1,
          label: "What a language has besides words",
          answer: "rules",
          hints: ["Words and ___ for fitting them together."],
          explain: [
            { text: "A language is words plus rules for combining them into valid instructions." },
          ],
        },
      ],
    },
    {
      title: "High-level vs the machine",
      concept: "High-level",
      context:
        "Languages like C# are called high-level: they read closer to human ideas - 'add these numbers, save that name' - than to raw machine steps. The compiler bridges the gap down to the CPU's instructions.",
      quiz: {
        question: "What does 'high-level language' mean?",
        options: [
          { text: "It reads closer to human ideas than to raw machine steps", correct: true },
          { text: "It only runs on powerful computers", correct: false },
          { text: "It is the hardest kind to use", correct: false },
        ],
        answerWhy: "High-level means closer to human thinking; the compiler does the work of getting down to machine instructions.",
      },
      snippet: "A {{1}}-level language like C# reads closer to human ideas than to raw machine steps; the compiler bridges the gap.",
      points: [
        "High-level languages express ideas, not machine steps.",
        "The compiler translates the gap down to the CPU.",
      ],
      blanks: [
        {
          id: 1,
          label: "The kind of language that reads closer to human ideas",
          answer: "high",
          hints: ["The opposite of low-level."],
          explain: [
            { text: "A high-level language reads closer to human ideas; the compiler handles the machine detail." },
          ],
        },
      ],
    },
    {
      title: "Many languages, one machine",
      concept: "Many languages",
      context:
        "There are many programming languages - C#, Python, JavaScript and more - each with its own style and strengths. Whichever you use, the code ends up as instructions the same CPU runs.",
      quiz: {
        question: "What do C#, Python and JavaScript have in common?",
        options: [
          { text: "They all end up as instructions the CPU runs", correct: true },
          { text: "They are the same language with different names", correct: false },
          { text: "They each need their own kind of computer", correct: false },
        ],
        answerWhy: "Different languages, different styles - but all are translated down to instructions the CPU runs.",
      },
      snippet: "There are many languages - C#, Python, JavaScript - but they all end up as {{1}} the CPU runs.",
      points: [
        "Each language has its own style and strengths.",
        "All of them become instructions for the same CPU.",
      ],
      blanks: [
        {
          id: 1,
          label: "What every language ends up as",
          answer: "instructions",
          accept: ["instruction"],
          hints: ["The tiny steps from Part one."],
          explain: [
            { text: "Whatever the language, the code becomes instructions the CPU runs." },
          ],
        },
      ],
    },
    {
      title: "Syntax: the exact rules",
      concept: "Syntax",
      context:
        "A language's exact rules - where commas and brackets go, how words are spelled - are its syntax. Because the machine is literal, breaking a rule means the compiler refuses to translate your code. That is a syntax error.",
      quiz: {
        question: "What is a syntax error?",
        options: [
          { text: "Code that breaks the language's rules, so the compiler refuses it", correct: true },
          { text: "A fault in the computer's hardware", correct: false },
          { text: "A program that runs too slowly", correct: false },
        ],
        answerWhy: "Syntax is the language's exact rules; breaking them is a syntax error the compiler catches before running.",
      },
      snippet: "A language's exact rules are its {{1}}. Break them and the compiler refuses to translate your code - a syntax error.",
      points: [
        "Syntax is the precise rules of the language.",
        "Breaking syntax stops the compiler before the program runs.",
      ],
      blanks: [
        {
          id: 1,
          label: "The name for a language's exact rules",
          answer: "syntax",
          hints: ["A syntax error breaks these."],
          explain: [
            { text: "Syntax is the language's exact rules; breaking them gives a syntax error." },
          ],
        },
      ],
    },
    {
      title: "What a language is - recap",
      concept: "Recap",
      summary: true,
      context: "You now know what we mean by a programming language.",
      summaryIntro:
        "A programming language is the human-friendly way to write instructions, translated down to what the CPU runs.",
      summaryItems: [
        { title: "Why a language - ", text: "CPU instructions are too tiny to write by hand." },
        { title: "Language - ", text: "an agreed set of words and rules for writing instructions." },
        { title: "High-level - ", text: "reads closer to human ideas; the compiler bridges to the machine." },
        { title: "Many languages - ", text: "C#, Python, JavaScript - all become instructions the CPU runs." },
        { title: "Syntax - ", text: "the exact rules; break them and the compiler refuses (a syntax error)." },
      ],
      summaryClose: "Next lesson: the first thing every program uses - a variable, a named box for a value.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th8",
    mode: "theory",
    metaLabel: "From idea to code \u00b7 Languages",
    progressNoun: "Topic",
    awardedKey: "theory_8_awarded",
    awardAmount: 20,
    drills,
  };
})();
