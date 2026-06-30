// Theory track - Part 3 "How software really runs and connects", Lesson 1:
// "Where data lives". Absolute-beginner conceptual lesson (no code), same
// drill-engine theory mode as Part 1/2: each card is a multiple-choice check
// then a fill-in-the-blank in plain prose. It builds the mental model of memory
// very slowly - memory as numbered slots, a variable as a slot, then the two
// areas a program uses: the stack and the heap. Sets up the next lesson on
// references vs values (the foundation juniors need for objects).
(function () {
  "use strict";

  const drills = [
    {
      title: "Where a running program keeps its data",
      concept: "Memory",
      context:
        "From Part one, a program's data lives in memory while it runs - the computer's fast working space, also called RAM. Picture a huge wall of numbered lockers the program can use: it puts values in, and takes them out again, as it works.",
      quiz: {
        question: "Where does a running program keep the data it is working on?",
        options: [
          { text: "In memory (RAM)", correct: true },
          { text: "On the keyboard", correct: false },
          { text: "On the internet", correct: false },
        ],
        answerWhy: "While a program runs, the values it is working with sit in memory - the fast working space, RAM.",
      },
      snippet: "While a program runs, its data lives in {{1}} - the computer's fast working space.",
      points: [
        "Memory (RAM) is the program's working space while it runs.",
        "Think of a wall of lockers: values go in and come back out.",
      ],
      blanks: [
        {
          id: 1,
          label: "The fast working space a program uses while running",
          answer: "memory",
          accept: ["ram", "the memory"],
          hints: ["The word this lesson is about; also called RAM."],
          explain: [
            { text: "A running program keeps its data in memory - the fast working space, RAM." },
          ],
        },
      ],
    },
    {
      title: "Memory is a row of numbered slots",
      concept: "Address",
      context:
        "That wall of lockers is really one long row of tiny slots. Every slot has its own number so the program can find it again - exactly like locker numbers. A slot's number is called its address.",
      quiz: {
        question: "What is the number that identifies one slot in memory called?",
        options: [
          { text: "Its address", correct: true },
          { text: "Its colour", correct: false },
          { text: "Its password", correct: false },
        ],
        answerWhy: "Each slot has a number - its address - so the program can find that exact slot.",
      },
      snippet: "Each slot in memory has a number, called its {{1}}, so the program can find it again.",
      points: [
        "Memory is one long row of small slots.",
        "Each slot's number is its address - like a locker number.",
      ],
      blanks: [
        {
          id: 1,
          label: "A slot's number, used to find it",
          answer: "address",
          hints: ["Like a locker number, but for a memory slot."],
          explain: [
            { text: "A slot's number is its address; the program uses it to find that exact slot." },
          ],
        },
      ],
    },
    {
      title: "A variable is a labelled slot",
      concept: "Variable in memory",
      context:
        "In Part two you met a variable - a named box for a value. That box is really a slot in memory. The name is there for you; behind the scenes the program uses the slot's address. So a name like `score` is just a friendly label on a slot.",
      quiz: {
        question: "When you make a variable, where does its value actually go?",
        options: [
          { text: "Into a slot in memory", correct: true },
          { text: "Onto the screen", correct: false },
          { text: "Into the CPU forever", correct: false },
        ],
        answerWhy: "A variable's value is stored in a slot in memory; the name is just a label on that slot.",
      },
      snippet: "A variable is really a {{1}} in memory with a friendly name attached.",
      points: [
        "A variable's value lives in a memory slot.",
        "The name is for people; the program uses the address.",
      ],
      blanks: [
        {
          id: 1,
          label: "What a variable really is, in memory",
          answer: "slot",
          accept: ["box", "memory slot"],
          hints: ["The same little space from the last two cards."],
          explain: [
            { text: "A variable is a slot in memory with a name attached so people can read the code." },
          ],
        },
      ],
    },
    {
      title: "Two areas: the stack and the heap",
      concept: "Two regions",
      context:
        "A program does not treat all of memory the same. For the data it makes while running, it mainly uses two areas: the stack and the heap. They are both just memory, but each is good at a different job - you will meet each one next.",
      quiz: {
        question: "What are the two main areas of memory a running program uses for its data?",
        options: [
          { text: "The stack and the heap", correct: true },
          { text: "The screen and the disk", correct: false },
          { text: "The mouse and the keyboard", correct: false },
        ],
        answerWhy: "A running program keeps the data it makes in two main areas of memory: the stack and the heap.",
      },
      snippet: "A running program keeps its data in two main areas: the {{1}} and the heap.",
      points: [
        "Both are just memory, used in two different ways.",
        "The two areas are the stack and the heap.",
      ],
      mermaid:
        "flowchart TB\n  M[\"A program's memory\"] --> S[\"The stack<br/>small, fast, automatic\"]\n  M --> H[\"The heap<br/>big, flexible, long-lived\"]",
      blanks: [
        {
          id: 1,
          label: "One of the two areas (the quick, automatic one)",
          answer: "stack",
          hints: ["The other one is the heap."],
          explain: [
            { text: "The two areas are the stack and the heap; this card asks for the stack." },
          ],
        },
      ],
    },
    {
      title: "The stack: quick, automatic, tidy",
      concept: "The stack",
      context:
        "The stack holds the values a function is using right now. Each time a function is called, its values are placed on top; when the function finishes, they are taken straight back off. It is automatic and very fast - like a stack of plates where you only ever add to, or take from, the top.",
      quiz: {
        question: "What happens to a function's values on the stack when the function finishes?",
        options: [
          { text: "They are removed automatically", correct: true },
          { text: "They stay there forever", correct: false },
          { text: "They move onto the screen", correct: false },
        ],
        answerWhy: "Stack values are cleared automatically the moment the function that made them finishes.",
      },
      snippet: "The {{1}} holds a function's values and clears them automatically when the function finishes.",
      points: [
        "The stack holds what a function is using right now.",
        "Like a stack of plates: add to the top, take from the top.",
        "Cleared automatically when the function ends.",
      ],
      blanks: [
        {
          id: 1,
          label: "The quick, automatic area for a function's values",
          answer: "stack",
          hints: ["The stack-of-plates one."],
          explain: [
            { text: "The stack holds a function's current values and tidies them away by itself when it finishes." },
          ],
        },
      ],
    },
    {
      title: "The heap: roomy and long-lived",
      concept: "The heap",
      context:
        "The heap is a bigger, more flexible area. It holds things that are large, or that must stick around after the function that made them has finished. You ask the heap for space, and it stays yours until it is no longer needed - like renting a shelf in a warehouse, rather than holding a plate in your hand.",
      quiz: {
        question: "What is the heap good for?",
        options: [
          { text: "Big things, or things that must outlive a function", correct: true },
          { text: "Only tiny numbers", correct: false },
          { text: "Nothing - it is never used", correct: false },
        ],
        answerWhy: "The heap holds large or long-lived things that need to last beyond the function that created them.",
      },
      snippet: "The {{1}} stores big or long-lived things that must outlast the function that made them.",
      points: [
        "The heap is bigger and more flexible than the stack.",
        "Things there last until they are no longer needed.",
        "Like renting a warehouse shelf, not holding a plate.",
      ],
      mermaid:
        "flowchart LR\n  H[\"The heap\"] --> A[\"a big thing\"]\n  H --> B[\"a long-lived thing\"]",
      blanks: [
        {
          id: 1,
          label: "The roomy area for big, long-lived things",
          answer: "heap",
          hints: ["The warehouse one."],
          explain: [
            { text: "The heap stores large or long-lived things that must outlast the function that made them." },
          ],
        },
      ],
    },
    {
      title: "Where data lives - recap",
      concept: "Recap",
      summary: true,
      context: "You now have a picture of where a running program keeps its data.",
      summaryIntro:
        "Memory is the program's working space while it runs - a long row of numbered slots, used in two main areas.",
      summaryItems: [
        { title: "Memory (RAM) - ", text: "the fast working space a program uses while running." },
        { title: "Address - ", text: "the number that identifies one slot, so it can be found again." },
        { title: "Variable - ", text: "a memory slot with a friendly name attached." },
        { title: "The stack - ", text: "quick and automatic; holds a function's values and clears them when it ends." },
        { title: "The heap - ", text: "roomy and flexible; holds big or long-lived things." },
      ],
      summaryClose: "Next lesson: why some variables hold a value directly while others only point to it - references vs values.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th15",
    mode: "theory",
    metaLabel: "How software runs \u00b7 Where data lives",
    progressNoun: "Topic",
    awardedKey: "theory_15_awarded",
    awardAmount: 20,
    drills,
  };
})();
