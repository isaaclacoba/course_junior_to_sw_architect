// Theory track - Part 1, Lesson 2: "How a program runs".
//
// Builds on Lesson 1 (a program is an ordered list of instructions over data,
// run by the CPU and produced by compilation). This lesson answers "so how does
// it actually run?": the program is loaded into memory, the CPU repeats the
// fetch-and-execute loop, it keeps its place and goes in order by default, some
// instructions change that order (jumps), and the working data lives in memory
// too. Same audience as Lesson 1 - computer users with no programming background.
// Reuses the shared drill-engine in theory mode (prose fill-in-the-blank + quiz).
(function () {
  "use strict";

  const drills = [
    {
      title: "Loaded into memory first",
      concept: "Loading",
      context:
        "Before a program can run, it is copied from storage - the drive it was saved on - into memory, the computer's fast working space. The CPU then works from memory, because reading from it is far quicker than reading from the drive.",
      quiz: {
        question: "Where does a program run from?",
        options: [
          { text: "Memory, after being copied there from storage", correct: true },
          { text: "Straight from the drive it was saved on", correct: false },
          { text: "Inside the screen", correct: false },
        ],
        answerWhy: "A program is loaded into memory first; the CPU works from memory because it is much faster than the drive.",
      },
      snippet: "To run, a program is first copied from storage into {{1}} - the fast working space the CPU reads from.",
      points: [
        "Storage keeps the program while the power is off; memory is where it runs.",
        "The CPU works from memory because it is far faster than the drive.",
      ],
      blanks: [
        {
          id: 1,
          label: "The fast working space a program runs in",
          answer: "memory",
          accept: ["ram", "the memory"],
          hints: ["Also called RAM - much faster than the drive."],
          explain: [
            { text: "A program is copied from storage into memory, the fast space the CPU reads instructions and data from." },
          ],
        },
      ],
    },
    {
      title: "The run loop",
      concept: "Fetch and execute",
      context:
        "Once loaded, the CPU runs the program with one simple cycle, repeated over and over: fetch the next instruction, then carry it out. Carrying an instruction out is called executing it, so this is the fetch-and-execute loop - and it repeats billions of times a second.",
      quiz: {
        question: "How does the CPU work through a program?",
        options: [
          { text: "It repeats: fetch the next instruction, carry it out, repeat", correct: true },
          { text: "It does every instruction at the exact same moment", correct: false },
          { text: "It picks instructions at random", correct: false },
        ],
        answerWhy: "The CPU repeats a simple cycle - fetch the next instruction, execute it, repeat - very fast.",
      },
      snippet: "The CPU repeats one cycle: fetch the next instruction, then {{1}} it - carry it out. This repeats billions of times a second.",
      points: [
        "The CPU does one instruction, then the next - not all at once.",
        "The cycle repeats billions of times a second, so it feels instant.",
      ],
      blanks: [
        {
          id: 1,
          label: "Carry the instruction out (the word used above)",
          answer: "execute",
          accept: ["run", "do", "carry out"],
          hints: ["Carrying an instruction out is called this."],
          explain: [
            { text: "The CPU fetches the next instruction and executes it - carries it out - then repeats." },
          ],
        },
      ],
    },
    {
      title: "It keeps its place",
      concept: "Order at runtime",
      context:
        "The CPU keeps track of which instruction comes next. After it finishes one, it moves to the one after it - working through the list top to bottom, the same order the program is written in.",
      quiz: {
        question: "After the CPU finishes an instruction, which one does it do next by default?",
        options: [
          { text: "The one right after it", correct: true },
          { text: "The very first instruction again", correct: false },
          { text: "A random one", correct: false },
        ],
        answerWhy: "By default the CPU moves to the next instruction in order, working top to bottom.",
      },
      snippet: "The CPU remembers which instruction is next. After finishing one, it moves to the {{1}} one, working through the list top to bottom.",
      points: [
        "The CPU always knows which instruction comes next.",
        "By default it goes in order, one after another.",
      ],
      blanks: [
        {
          id: 1,
          label: "Which instruction the CPU does after this one",
          answer: "next",
          accept: ["following"],
          hints: ["It moves straight to the one after the current step."],
          explain: [
            { text: "The CPU tracks its place and moves to the next instruction after each one, in order." },
          ],
        },
      ],
    },
    {
      title: "Some instructions change the order",
      concept: "Jumps",
      context:
        "Not every step goes straight to the next. Some instructions tell the CPU to jump to a different place in the program instead. That is how a program can skip steps, make a decision, or repeat a section - the basis of every decision and every loop.",
      quiz: {
        question: "What lets a program make decisions or repeat steps?",
        options: [
          { text: "Instructions that jump the CPU to a different place", correct: true },
          { text: "The CPU getting tired of going in order", correct: false },
          { text: "Running two instructions at once", correct: false },
        ],
        answerWhy: "Special instructions change which instruction is next - jumping elsewhere - which is how decisions and loops work.",
      },
      snippet: "Some instructions tell the CPU to {{1}} to a different place instead of the next step. That is how a program makes decisions and repeats sections.",
      points: [
        "A jump changes which instruction comes next.",
        "Decisions and repeats are built from jumps.",
      ],
      blanks: [
        {
          id: 1,
          label: "What a special instruction makes the CPU do (one word)",
          answer: "jump",
          accept: ["go", "branch"],
          hints: ["It moves the CPU to a different spot, not the next step."],
          explain: [
            { text: "A jump instruction changes the CPU's place, sending it elsewhere - the basis of decisions and loops." },
          ],
        },
      ],
    },
    {
      title: "Data lives in memory too",
      concept: "Data in memory",
      context:
        "Memory does not just hold the instructions - it also holds the data the program is working on. As it runs, the program reads values from memory and writes new ones back. That is how a number you typed is remembered, changed, and used a moment later.",
      quiz: {
        question: "Where does a program keep the data it is working on while it runs?",
        options: [
          { text: "In memory, alongside the instructions", correct: true },
          { text: "Only on the screen", correct: false },
          { text: "Inside the CPU forever", correct: false },
        ],
        answerWhy: "Both the instructions and the working data live in memory while the program runs; the CPU reads and writes them there.",
      },
      snippet: "Memory holds the instructions and the {{1}} the program works on. As it runs, the program reads and writes values there.",
      points: [
        "Instructions and working data both live in memory while running.",
        "Reading and writing memory is how values are remembered and changed.",
      ],
      blanks: [
        {
          id: 1,
          label: "What memory holds besides the instructions",
          answer: "data",
          accept: ["values"],
          hints: ["The values the program reads and changes - the word from Lesson 1."],
          explain: [
            { text: "Memory holds the working data too; the program reads and writes values there as it runs." },
          ],
        },
      ],
    },
    {
      title: "How a program runs - recap",
      concept: "Recap",
      summary: true,
      context: "You now know what happens between pressing run and the program doing its work.",
      summaryIntro:
        "A program does not run from the drive. It is loaded into memory, and the CPU works through it by repeating a simple loop, keeping its place and sometimes jumping elsewhere.",
      summaryItems: [
        { title: "Loaded into memory - ", text: "the program is copied from storage into memory before it runs; the CPU works from there." },
        { title: "Fetch and execute - ", text: "the CPU repeats: fetch the next instruction, carry it out, repeat - billions of times a second." },
        { title: "Keeps its place - ", text: "the CPU tracks which instruction is next and goes in order by default." },
        { title: "Jumps - ", text: "some instructions change the order, which is how decisions and loops work." },
        { title: "Data in memory - ", text: "the values a program works on live in memory too, read and written as it runs." },
      ],
      summaryClose: "Next lesson: what actually starts a program - the loader that brings it into memory, and the entry point where running begins.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th2",
    mode: "theory",
    metaLabel: "Foundations \u00b7 How a program runs",
    progressNoun: "Topic",
    awardedKey: "theory_2_awarded",
    awardAmount: 20,
    drills,
  };
})();
