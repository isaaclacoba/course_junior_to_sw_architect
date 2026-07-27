// Theory track - Part 1, Lesson 3: "What starts a program".
//
// Builds on Lesson 1 (a program is instructions) and Lesson 2 (it is loaded into
// memory and the CPU works through it). This lesson answers "what actually starts
// it, and where does running begin?": the operating system launches it, its
// loader copies it into memory, execution begins at a fixed entry point, that
// entry point is usually a function called Main, and the program runs from there
// until it ends. The Main card quietly demystifies the practical track's
// `static void Main()`. Same audience and format as Lessons 1-2 (theory mode).
(function () {
  "use strict";

  const drills = [
    {
      title: "Something has to start it",
      concept: "Operating system",
      context:
        "A program does not start itself. When you open an app or press run, the operating system - Windows, macOS, Linux, Android - is what launches it. The operating system is the program in charge of running your other programs.",
      quiz: {
        question: "When you open an app, what actually launches it?",
        options: [
          { text: "The operating system", correct: true },
          { text: "The app decides to start on its own", correct: false },
          { text: "The screen", correct: false },
        ],
        answerWhy: "The operating system (Windows, macOS, Linux, Android) is in charge of starting and running your programs.",
      },
      snippet: "A program does not start itself. The {{1}} - Windows, macOS, Linux, Android - is what launches it.",
      points: [
        "The operating system is the program in charge of your other programs.",
        "Opening an app is really asking the operating system to start it.",
      ],
      blanks: [
        {
          id: 1,
          label: "The program in charge of starting other programs",
          answer: "operating system",
          accept: ["os", "operating-system"],
          hints: ["Windows, macOS, Linux and Android are all examples of it."],
          explain: [
            { text: "The operating system launches and manages your programs; you ask it to start an app when you open one." },
          ],
        },
      ],
    },
    {
      title: "The loader brings it into memory",
      concept: "Loader",
      context:
        "To start a program, the operating system uses a part called the loader. It copies the program from storage into memory - the step from Lesson 2 - so the instructions and data are ready for the CPU to work through.",
      quiz: {
        question: "What is the first thing that happens when a program starts?",
        options: [
          { text: "The loader copies it from storage into memory", correct: true },
          { text: "The CPU deletes the old program", correct: false },
          { text: "The screen turns off", correct: false },
        ],
        answerWhy: "The operating system's loader copies the program from storage into memory so the CPU can run it.",
      },
      snippet: "The operating system's {{1}} copies the program from storage into memory, ready for the CPU.",
      points: [
        "The loader is the part of the operating system that brings a program into memory.",
        "This is the 'loaded into memory' step from Lesson 2, done at start-up.",
      ],
      blanks: [
        {
          id: 1,
          label: "The part that copies a program into memory",
          answer: "loader",
          accept: ["the loader"],
          hints: ["It loads the program - the name says what it does."],
          explain: [
            { text: "The loader copies the program from storage into memory at start-up, ready for the CPU." },
          ],
        },
      ],
    },
    {
      title: "Execution begins at the entry point",
      concept: "Entry point",
      context:
        "Once a program is in memory, the CPU has to begin somewhere - it cannot guess which instruction is first. So every program has one agreed starting place where running begins. That place is called the entry point.",
      quiz: {
        question: "Why does a program need an entry point?",
        options: [
          { text: "The CPU has to know which instruction to run first", correct: true },
          { text: "To make the program file smaller", correct: false },
          { text: "So it looks tidy on screen", correct: false },
        ],
        answerWhy: "Running has to begin at one specific instruction; the entry point is that agreed starting place.",
      },
      snippet: "Running has to begin somewhere specific. The one agreed place where a program starts is called the {{1}}.",
      points: [
        "The CPU cannot guess the first instruction - it needs a fixed starting place.",
        "That starting place is the entry point.",
      ],
      blanks: [
        {
          id: 1,
          label: "The agreed place where a program starts running",
          answer: "entry point",
          accept: ["entry-point", "entrypoint"],
          hints: ["Two words - the point where the program is entered."],
          explain: [
            { text: "The entry point is the single agreed instruction where the CPU begins running the program." },
          ],
        },
      ],
    },
    {
      title: "The entry point is usually called Main",
      concept: "Main",
      context:
        "In most languages the entry point is a special function with an agreed name: `Main`. When the program starts, the very first of your own instructions to run are the ones inside `Main`. Later, when you write C#, `Main` is exactly where your program begins.",
      quiz: {
        question: "Where do a program's own instructions begin?",
        options: [
          { text: "Inside the entry point function, usually called Main", correct: true },
          { text: "At the last line of the file", correct: false },
          { text: "Wherever the CPU feels like", correct: false },
        ],
        answerWhy: "The entry point is usually a function named `Main`; the instructions inside it run first.",
      },
      snippet: "In most languages the entry point is a function with an agreed name: {{1}}. The instructions inside it are the first of yours to run.",
      points: [
        "`Main` is the conventional name for the entry point function.",
        "When you write C#, `Main` is where your program starts.",
      ],
      blanks: [
        {
          id: 1,
          label: "The usual name of the entry point function",
          answer: "Main",
          accept: ["main"],
          hints: ["A short word; in C# it is written with a capital M."],
          explain: [
            { text: "The entry point is usually a function called `Main`; its instructions run first when the program starts." },
          ],
        },
      ],
    },
    {
      title: "It runs, then it ends",
      concept: "Program lifecycle",
      context:
        "From the entry point, the program runs - the CPU works through the instructions, looping and jumping as needed - until it finishes its work or you close it. When it ends, the operating system frees the memory it was using, so other programs can reuse it.",
      quiz: {
        question: "What happens to a program's memory when it ends?",
        options: [
          { text: "The operating system frees it for other programs to use", correct: true },
          { text: "It stays locked forever", correct: false },
          { text: "It is printed to the screen", correct: false },
        ],
        answerWhy: "When a program ends, the operating system reclaims its memory so other programs can reuse it.",
      },
      snippet: "A program runs from the entry point until it finishes or you close it. Then the operating system {{1}} the memory it was using.",
      points: [
        "The full path: open it, load it, start at the entry point, run, then end.",
        "When it ends, its memory is freed for other programs.",
      ],
      blanks: [
        {
          id: 1,
          label: "What the operating system does with the memory at the end",
          answer: "frees",
          accept: ["releases", "reclaims", "free"],
          hints: ["It makes the memory available again for other programs."],
          explain: [
            { text: "When a program ends, the operating system frees its memory so other programs can reuse it." },
          ],
        },
      ],
    },
    {
      title: "What starts a program - recap",
      concept: "Recap",
      summary: true,
      context: "You can now trace a program from the moment you open it to the moment it ends.",
      summaryIntro:
        "Opening a program sets off a clear chain: the operating system loads it into memory, starts it at its entry point, runs it, then frees its memory when it ends.",
      summaryItems: [
        { title: "Operating system - ", text: "the program in charge of starting and running your other programs." },
        { title: "Loader - ", text: "the part that copies a program from storage into memory at start-up." },
        { title: "Entry point - ", text: "the one agreed place where running begins." },
        { title: "Main - ", text: "the usual name of the entry point function; your instructions start there." },
        { title: "Run, then end - ", text: "the program runs from the entry point until it finishes, then its memory is freed." },
      ],
      summaryClose: "Next lesson: how the computer runs more than one program at once - what a process is, and how the operating system shares the CPU.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th3",
    mode: "theory",
    metaLabel: "Foundations \u00b7 What starts a program",
    progressNoun: "Topic",
    awardedKey: "theory_3_awarded",
    awardAmount: 20,
    drills,
  };
})();
