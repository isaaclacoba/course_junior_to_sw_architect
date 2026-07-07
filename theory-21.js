// Theory track - Part 4 "The development world", Lesson 1: "Standing on other
// code". Absolute-beginner, no code. You rarely write a whole program from
// scratch: you build on the language's own toolbox (standard library), on
// packages other people published, fetched by a package manager - and each one
// your program relies on is a dependency. Drill-engine theory mode.
(function () {
  "use strict";

  const drills = [
    {
      title: "You do not write everything",
      concept: "Library",
      context:
        "Most of what you build reuses code that already exists. A library is ready-made code someone else has already written and shared, so you can use it instead of writing it yourself. Reading a file, drawing a chart, talking to the network - someone has solved it, and packaged it up.",
      quiz: {
        question: "What is a library?",
        options: [
          { text: "Ready-made code you use instead of writing your own", correct: true },
          { text: "A folder where the OS keeps your files", correct: false },
          { text: "A single line of your own code", correct: false },
        ],
        answerWhy: "A library is code someone else wrote and shared, so you can reuse it rather than build it again.",
      },
      snippet: "Ready-made code you use instead of writing it yourself is called a {{1}}.",
      points: [
        "You build on code others already wrote.",
        "A library packages a solved problem so you can reuse it.",
      ],
      blanks: [
        {
          id: 1,
          label: "Ready-made, reusable code",
          answer: "library",
          hints: ["A collection you borrow code from."],
          explain: [
            { text: "A library is ready-made code you reuse instead of writing your own." },
          ],
        },
      ],
    },
    {
      title: "The toolbox that comes with the language",
      concept: "Standard library",
      context:
        "You do not have to hunt for every tool. Every language ships with a big set of built-in tools - its standard library. In .NET, that is the Base Class Library: text, dates, lists, files and much more, ready the moment you start.",
      quiz: {
        question: "What is the standard library?",
        options: [
          { text: "The built-in tools that ship with the language", correct: true },
          { text: "A book about programming", correct: false },
          { text: "Your own first program", correct: false },
        ],
        answerWhy: "The standard library is the set of tools built into the language, available without installing anything.",
      },
      snippet: "The set of tools built into the language, ready from the start, is the {{1}} library.",
      points: [
        "The language comes with a built-in toolbox.",
        "In .NET this is the Base Class Library.",
      ],
      blanks: [
        {
          id: 1,
          label: "The built-in library that ships with the language",
          answer: "standard",
          hints: ["It is the default one, not one you add."],
          explain: [
            { text: "The standard library is the toolbox built into the language itself." },
          ],
        },
      ],
    },
    {
      title: "Pulling in extra code",
      concept: "Package",
      context:
        "When the standard library does not have what you need, you reach for a package: a bundle of code someone published for others to reuse. Instead of copying their files by hand, you add the package to your project and its code becomes yours to call.",
      quiz: {
        question: "What do you add to your project to reuse code beyond the standard library?",
        options: [
          { text: "A package", correct: true },
          { text: "A new computer", correct: false },
          { text: "Another screen", correct: false },
        ],
        answerWhy: "A package is a published bundle of code you add to your project to reuse it.",
      },
      snippet: "A published bundle of code you add to your project to reuse is a {{1}}.",
      points: [
        "The standard library does not cover everything.",
        "A package is shared code you add to your project.",
      ],
      blanks: [
        {
          id: 1,
          label: "A published, reusable bundle of code",
          answer: "package",
          accept: ["nuget package"],
          hints: ["You add it to your project rather than copying files."],
          explain: [
            { text: "A package is a bundle of code, published so others can add it to their projects." },
          ],
        },
      ],
    },
    {
      title: "Who fetches the packages",
      concept: "Package manager",
      context:
        "You do not hunt down packages by hand. A package manager fetches the ones you ask for, installs the right version, and keeps a list of them for your project. In .NET that tool is NuGet.",
      quiz: {
        question: "What fetches and keeps track of your packages?",
        options: [
          { text: "A package manager", correct: true },
          { text: "The keyboard", correct: false },
          { text: "The compiler alone", correct: false },
        ],
        answerWhy: "A package manager downloads packages, installs the right versions, and records them for your project.",
      },
      snippet: "The tool that fetches packages and tracks them for your project is a package {{1}}.",
      points: [
        "You ask; the tool fetches and installs.",
        "In .NET the package manager is NuGet.",
      ],
      blanks: [
        {
          id: 1,
          label: "Package ___: fetches and tracks packages",
          answer: "manager",
          hints: ["It manages your packages for you."],
          explain: [
            { text: "A package manager (NuGet in .NET) fetches and tracks the packages a project uses." },
          ],
        },
      ],
    },
    {
      title: "The code you rely on",
      concept: "Dependency",
      context:
        "Every library and package your program leans on is a dependency - code your program needs in order to work. Depending on shared code saves enormous effort, but it is a trade: you take on its behaviour, its updates, and its bugs. Choosing dependencies well is part of the job.",
      quiz: {
        question: "What is a dependency?",
        options: [
          { text: "Code your program needs in order to work", correct: true },
          { text: "A bug you wrote", correct: false },
          { text: "A folder on the disk", correct: false },
        ],
        answerWhy: "A dependency is outside code your program relies on to run - so its behaviour becomes part of yours.",
      },
      snippet: "Code your program relies on to work is a {{1}}.",
      points: [
        "What you lean on is a dependency.",
        "It saves effort, but you take on its behaviour and its bugs.",
      ],
      blanks: [
        {
          id: 1,
          label: "Outside code your program relies on",
          answer: "dependency",
          accept: ["dependancy"],
          hints: ["Your program depends on it."],
          explain: [
            { text: "A dependency is code your program relies on - a trade of effort saved for behaviour inherited." },
          ],
        },
      ],
    },
    {
      title: "Standing on other code - recap",
      concept: "Recap",
      summary: true,
      context: "You now see that a program is built on far more code than you write.",
      summaryIntro:
        "Most of what your program does is code other people wrote: the language's own toolbox, plus packages you pull in and rely on.",
      summaryItems: [
        { title: "Library - ", text: "ready-made code you reuse instead of writing your own." },
        { title: "Standard library - ", text: "the toolbox built into the language (the Base Class Library in .NET)." },
        { title: "Package - ", text: "a published bundle of code you add to your project." },
        { title: "Package manager - ", text: "the tool that fetches and tracks packages (NuGet in .NET)." },
        { title: "Dependency - ", text: "any outside code your program relies on to work." },
      ],
      summaryClose: "Knowing this changes how you work: before building something, you look for what already exists. Next lesson: how the code you write is tracked and shared with other people - version control.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th21",
    mode: "theory",
    metaLabel: "The development world \u00b7 Standing on other code",
    progressNoun: "Topic",
    awardedKey: "theory_21_awarded",
    awardAmount: 20,
    drills,
  };
})();
