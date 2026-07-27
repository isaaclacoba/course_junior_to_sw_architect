// Theory track - Part 1 "What a computer really is", Lesson 1: "What a program is".
//
// Audience: people who use computers daily but have no OS/architecture or
// programming background. They already know hardware vs software, so this lesson
// skips that and teaches the layer they are missing: what an instruction is, how
// a program is an ordered list of instructions over data, the CPU that runs them,
// and that the code we write is compiled into the CPU's tiny instructions. It
// reuses the shared drill-engine in theory mode (DRILL_CONFIG.mode = "theory"):
// each card is a multiple-choice knowledge check then a fill-in-the-blank in prose.
(function () {
  "use strict";

  const drills = [
    {
      title: "A computer just follows instructions",
      concept: "Following instructions",
      context:
        "A computer never thinks, decides, or guesses. It only follows instructions - the steps a program gives it - exactly, and in order. When an app misbehaves, it is still following its instructions to the letter; they just did not say what was intended.",
      quiz: {
        question: "What does a computer do with a program?",
        options: [
          { text: "Follows its instructions exactly, in order", correct: true },
          { text: "Reads it and does what seems best", correct: false },
          { text: "Guesses what the user wants", correct: false },
        ],
        answerWhy: "A computer is literal: it carries out the instructions it is given, step by step, and nothing else.",
      },
      snippet: "A computer does not think or guess. It follows its {{1}} exactly, one after another.",
      points: [
        "A computer does exactly what its instructions say - no more, no less.",
        "Most bugs are the computer following instructions that were wrong.",
      ],
      blanks: [
        {
          id: 1,
          label: "What a computer follows",
          answer: "instructions",
          accept: ["instruction"],
          hints: ["The steps a program gives the computer."],
          explain: [
            { text: "A computer follows instructions - the exact steps a program hands it - in order." },
          ],
        },
      ],
    },
    {
      title: "What a single instruction is",
      concept: "Instruction",
      context:
        "An instruction is one tiny, exact step the computer can carry out - add two numbers, compare two values, or move a value from one place to another. Each one is far smaller than the actions you notice: opening a photo or sending a message is millions of these steps.",
      quiz: {
        question: "Which of these is closest to a single instruction?",
        options: [
          { text: "Add these two numbers", correct: true },
          { text: "Edit this photo", correct: false },
          { text: "Book me a flight", correct: false },
        ],
        answerWhy: "A real instruction is tiny and exact, like adding two numbers. Big actions are built from millions of them.",
      },
      snippet: "A single instruction is one tiny, exact step - like add two numbers. Everything an app does is built from a huge number of these {{1}}.",
      points: [
        "One instruction is small and precise - add, compare, move a value.",
        "The big actions you see are millions of instructions run very fast.",
      ],
      blanks: [
        {
          id: 1,
          label: "The tiny steps apps are built from",
          answer: "instructions",
          accept: ["instruction", "steps", "step"],
          hints: ["The same word as the last card - the tiny exact steps."],
          explain: [
            { text: "Apps are built from huge numbers of tiny instructions - single, exact steps." },
          ],
        },
      ],
    },
    {
      title: "A program is an ordered list",
      concept: "Program",
      context:
        "Many instructions arranged in order make a program - the full list of steps for a task. The computer runs them one after another, so the order matters: swap two steps and the result can change, just as it would in a recipe.",
      quiz: {
        question: "What is a program?",
        options: [
          { text: "An ordered list of instructions to follow", correct: true },
          { text: "A single instruction", correct: false },
          { text: "A picture of the finished result", correct: false },
        ],
        answerWhy: "A program is the ordered list of instructions; the computer works through them in sequence.",
      },
      snippet: "A program is an ordered {{1}} of instructions. The computer runs them one after another, so the {{2}} they are written in matters.",
      points: [
        "A program is many instructions arranged in a deliberate order.",
        "Reorder the steps and the result can change - like a recipe.",
      ],
      blanks: [
        {
          id: 1,
          label: "What a program arranges its instructions into",
          answer: "list",
          accept: ["set", "sequence"],
          hints: ["A program is an ordered ___ of instructions."],
          explain: [
            { text: "A program is an ordered list of instructions - the steps for a task." },
          ],
        },
        {
          id: 2,
          label: "What matters because steps run one after another",
          answer: "order",
          accept: ["sequence"],
          hints: ["Swap two steps and the result can change."],
          explain: [
            { text: "The order matters: the computer runs the steps in sequence, top to bottom." },
          ],
        },
      ],
    },
    {
      title: "Instructions work on data",
      concept: "Data",
      context:
        "Instructions need something to act on. That something is data - the values a program reads and changes: numbers, text, images, the file you just opened. The same instructions running on different data give different results, which is why one photo app can edit any photo.",
      quiz: {
        question: "A photo you open in an app is...",
        options: [
          { text: "Data the instructions work on", correct: true },
          { text: "An instruction", correct: false },
          { text: "The program itself", correct: false },
        ],
        answerWhy: "The photo is data - a value the program reads and changes. The steps that change it are the instructions.",
      },
      snippet: "Instructions need something to act on: the {{1}} - values like numbers, text and images that the program reads and changes.",
      points: [
        "Instructions are the steps; data is what the steps act on.",
        "Same instructions + different data = a different result.",
      ],
      blanks: [
        {
          id: 1,
          label: "The values instructions read and change",
          answer: "data",
          hints: ["Numbers, text, images, the file you opened."],
          explain: [
            { text: "Data is everything the instructions read and change - numbers, text, images, files." },
          ],
        },
      ],
    },
    {
      title: "The CPU runs the instructions",
      concept: "CPU",
      context:
        "One part of the machine carries out the instructions: the CPU, also called the processor. It takes one instruction, does exactly what it says, then moves to the next - billions of times a second. That speed is why millions of tiny steps feel instant.",
      quiz: {
        question: "Which part of the computer carries out a program's instructions?",
        options: [
          { text: "The CPU (the processor)", correct: true },
          { text: "The screen", correct: false },
          { text: "The internet connection", correct: false },
        ],
        answerWhy: "The CPU executes the instructions. The screen only shows results; the network only moves data around.",
      },
      snippet: "One part, the {{1}} (also called the processor), carries out the instructions - one at a time, billions of times a second.",
      points: [
        "The CPU is the worker that executes instructions, one after another.",
        "Its speed is why millions of tiny steps feel instant.",
      ],
      blanks: [
        {
          id: 1,
          label: "The part that runs instructions (3 letters)",
          answer: "CPU",
          accept: ["processor", "the cpu", "the processor", "cpu"],
          hints: ["Short for Central Processing Unit; also called the processor."],
          explain: [
            { text: "The CPU (Central Processing Unit), or processor, executes the program's instructions." },
          ],
        },
      ],
    },
    {
      title: "Your code gets translated",
      concept: "Compilation",
      context:
        "Those tiny CPU instructions are hard for people to write directly. Instead we write programs in a friendlier language made for humans - like C# - and a tool turns that into the instructions the CPU understands. That translation step is called compilation, and the tool that does it is a compiler.",
      quiz: {
        question: "Why don't programmers write directly in raw CPU instructions?",
        options: [
          { text: "They are tiny and hard for people; we write a friendlier language that gets translated", correct: true },
          { text: "The CPU cannot run them", correct: false },
          { text: "It is against the rules", correct: false },
        ],
        answerWhy: "We write in a human-friendly language and let a compiler translate it down to the CPU's instructions.",
      },
      snippet: "We write code in a language made for people. A tool then {{1}} it into the tiny instructions the CPU understands - that step is called {{2}}.",
      points: [
        "You write in a human-friendly language; the CPU never sees it directly.",
        "A compiler translates your code into the CPU's tiny instructions.",
      ],
      blanks: [
        {
          id: 1,
          label: "What the tool does to your code",
          answer: "translates",
          accept: ["compiles", "converts"],
          hints: ["It turns your code into the CPU's instructions."],
          explain: [
            { text: "The tool translates your human-friendly code into the CPU's tiny instructions." },
          ],
        },
        {
          id: 2,
          label: "The name of that translation step",
          answer: "compilation",
          accept: ["compiling"],
          hints: ["Done by a 'compiler'."],
          explain: [
            { text: "That translation step is called compilation; the tool is a compiler." },
          ],
        },
      ],
    },
    {
      title: "What a program is - recap",
      concept: "Recap",
      summary: true,
      context: "You now have the mental model underneath every program you have ever used.",
      summaryIntro:
        "A computer is a literal machine: it runs instructions. A program is an ordered list of those instructions working on data, and the code you write is translated down to the instructions the CPU runs.",
      summaryItems: [
        { title: "Follows instructions - ", text: "a computer does exactly what it is told, in order; it never guesses." },
        { title: "Instruction - ", text: "one tiny, exact step, like add two numbers." },
        { title: "Program - ", text: "an ordered list of instructions for a task; the order matters." },
        { title: "Data - ", text: "the values the instructions read and change." },
        { title: "CPU - ", text: "the processor that runs the instructions, one at a time, very fast." },
        { title: "Compilation - ", text: "translating human-friendly code into the CPU's tiny instructions." },
      ],
      summaryClose: "Next lesson: how the CPU runs a single instruction - the fetch-and-execute loop it repeats.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th1",
    mode: "theory",
    metaLabel: "Foundations \u00b7 Programs and instructions",
    progressNoun: "Topic",
    awardedKey: "theory_1_awarded",
    awardAmount: 20,
    drills,
  };
})();
