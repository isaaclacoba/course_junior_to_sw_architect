// Theory track - Part 1, Lesson 4: "Running many programs at once".
//
// Builds on Lessons 1-3 (a program is instructions, the CPU runs them one at a
// time, the OS starts them). This lesson resolves the everyday puzzle: a core
// runs one instruction at a time, yet many programs seem to run together. A
// running program is a process; the OS time-shares the CPU by switching between
// processes very fast; the scheduler picks who runs next; multiple cores add some
// real parallelism; and each process has its own separate memory (isolation).
// Same gentle audience and theory-mode format as the earlier lessons.
(function () {
  "use strict";

  const drills = [
    {
      title: "A running program is a process",
      concept: "Process",
      context:
        "There is a difference between a program sitting in storage and a program that is running. The running copy - loaded into memory, with the CPU working through it - is called a process. Open the same program twice and you get two separate processes.",
      quiz: {
        question: "What is a process?",
        options: [
          { text: "A program that is currently running", correct: true },
          { text: "A program file saved on the drive", correct: false },
          { text: "A part of the screen", correct: false },
        ],
        answerWhy: "A process is a running program - loaded into memory with the CPU working through it. The file on disk is just the program.",
      },
      snippet: "A program saved on the drive is just a file. A running copy of it, loaded into memory, is called a {{1}}.",
      points: [
        "Program = the file on disk. Process = that program while it is running.",
        "Open the same program twice and you get two separate processes.",
      ],
      blanks: [
        {
          id: 1,
          label: "The name for a running program",
          answer: "process",
          accept: ["a process"],
          hints: ["You can see a list of these in Task Manager or Activity Monitor."],
          explain: [
            { text: "A process is a running program: loaded into memory, with the CPU working through its instructions." },
          ],
        },
      ],
    },
    {
      title: "One core does one thing at a time",
      concept: "The puzzle",
      context:
        "From Lesson 2, a CPU core works through instructions one at a time. Yet you can have a browser, music, and a chat app all running together. If a core only does one instruction at a time, how can several programs run at once?",
      quiz: {
        question: "How many instructions can a single CPU core carry out at the same instant?",
        options: [
          { text: "One", correct: true },
          { text: "As many as there are programs", correct: false },
          { text: "Unlimited", correct: false },
        ],
        answerWhy: "A single core does exactly one instruction at a time - which is why running many programs at once needs a trick.",
      },
      snippet: "A single CPU core carries out {{1}} instruction at a time - so several programs running together must be sharing it somehow.",
      points: [
        "A core does one instruction at a time, no matter how many programs are open.",
        "So 'running at once' has to be an illusion of some kind.",
      ],
      blanks: [
        {
          id: 1,
          label: "How many instructions a core does at the same instant",
          answer: "one",
          accept: ["1", "a single"],
          hints: ["The smallest whole number."],
          explain: [
            { text: "A single core runs one instruction at a time, so many programs cannot truly run on it at the same instant." },
          ],
        },
      ],
    },
    {
      title: "The OS switches between them, fast",
      concept: "Time-sharing",
      context:
        "The trick is speed. The operating system lets one process run for a tiny slice of time, then pauses it and lets the next one run, then the next - switching thousands of times a second. It happens so fast that every program looks like it is running smoothly at the same time.",
      quiz: {
        question: "How does one core appear to run many programs at once?",
        options: [
          { text: "The OS switches between them very fast, giving each a tiny time slice", correct: true },
          { text: "It splits the screen into pieces", correct: false },
          { text: "It runs them more slowly so they fit", correct: false },
        ],
        answerWhy: "The OS gives each process a tiny slice of CPU time and switches between them so fast it looks simultaneous - time-sharing.",
      },
      snippet: "The OS runs each process for a tiny {{1}} of time, then switches to the next - so fast that they all appear to run at once.",
      points: [
        "Each process gets a tiny slice of CPU time in turn.",
        "Switching thousands of times a second makes it look simultaneous.",
      ],
      blanks: [
        {
          id: 1,
          label: "The small amount of CPU time each process gets in turn",
          answer: "slice",
          accept: ["slice", "share", "amount"],
          hints: ["A small portion - the lesson calls it a tiny ___ of time."],
          explain: [
            { text: "Each process runs for a tiny slice of time before the OS switches to the next - this is time-sharing." },
          ],
        },
      ],
    },
    {
      title: "The scheduler decides who runs next",
      concept: "Scheduler",
      context:
        "Something has to choose which process gets the next slice of time. That part of the operating system is the scheduler. It keeps every program moving and gives more attention to the ones that need it, like the app you are actively using.",
      quiz: {
        question: "Which part of the operating system decides which process runs next?",
        options: [
          { text: "The scheduler", correct: true },
          { text: "The loader", correct: false },
          { text: "The screen", correct: false },
        ],
        answerWhy: "The scheduler picks which process gets the next slice of CPU time, keeping everything moving.",
      },
      snippet: "The part of the operating system that chooses which process runs next is the {{1}}.",
      points: [
        "The scheduler hands out the CPU's time slices among processes.",
        "It keeps every program moving and favours the ones you are using.",
      ],
      blanks: [
        {
          id: 1,
          label: "The part of the OS that picks the next process",
          answer: "scheduler",
          accept: ["the scheduler"],
          hints: ["It schedules who gets the CPU next - the name says it."],
          explain: [
            { text: "The scheduler is the part of the OS that decides which process runs in each slice of time." },
          ],
        },
      ],
    },
    {
      title: "More cores, some real at-once",
      concept: "Cores",
      context:
        "Modern CPUs are not just one core - they have several. Each core runs its own instruction at the same instant, so a few processes really do run together, not just by switching. But there are always far more processes than cores, so the switching never stops; the cores just give it a head start.",
      quiz: {
        question: "What does having more CPU cores let a computer do?",
        options: [
          { text: "Truly run several processes at the same instant", correct: true },
          { text: "Store more files", correct: false },
          { text: "Make the screen bigger", correct: false },
        ],
        answerWhy: "Each core runs one instruction at a time, so several cores genuinely run several processes at once - though switching still fills the gap.",
      },
      snippet: "A CPU with several {{1}} can truly run that many processes at the same instant - but there are always more processes than them, so switching still happens.",
      points: [
        "Each core runs one instruction at a time, so N cores run N at once.",
        "There are still more processes than cores, so time-sharing continues.",
      ],
      blanks: [
        {
          id: 1,
          label: "The parts of a CPU that each run one instruction at a time",
          answer: "cores",
          accept: ["core"],
          hints: ["A 'quad-core' CPU has four of these."],
          explain: [
            { text: "Cores are the parts of a CPU that each carry out instructions; more cores means more real at-once work." },
          ],
        },
      ],
    },
    {
      title: "Each process keeps its own memory",
      concept: "Isolation",
      context:
        "The operating system gives each process its own separate area of memory and stops it from touching another process's area. So one program cannot read or corrupt another's data - and if one process crashes, the others keep running. This separation is called isolation.",
      quiz: {
        question: "Why can one app crash without taking the others down with it?",
        options: [
          { text: "Each process has its own separate memory, kept apart by the OS", correct: true },
          { text: "Apps politely agree not to interfere", correct: false },
          { text: "The screen protects them", correct: false },
        ],
        answerWhy: "The OS isolates each process in its own memory, so a crash or bug in one cannot reach into another.",
      },
      snippet: "The OS gives each process its own separate {{1}} and keeps processes apart, so one cannot read or corrupt another. This separation is called isolation.",
      points: [
        "Each process is walled off in its own memory by the OS.",
        "That isolation is why one crash does not bring down the rest.",
      ],
      blanks: [
        {
          id: 1,
          label: "What each process gets its own separate area of",
          answer: "memory",
          accept: ["ram", "the memory"],
          hints: ["The fast working space from Lesson 2."],
          explain: [
            { text: "Each process gets its own separate memory; the OS stops one process from reaching another's - that is isolation." },
          ],
        },
      ],
    },
    {
      title: "Running many programs - recap",
      concept: "Recap",
      summary: true,
      context: "You can now explain how a computer juggles everything you have open.",
      summaryIntro:
        "A core only does one instruction at a time, so running many programs at once is mostly a fast illusion - with a bit of real help from extra cores - all managed by the operating system.",
      summaryItems: [
        { title: "Process - ", text: "a running program, loaded into memory; the file on disk is just the program." },
        { title: "One at a time - ", text: "a single core carries out one instruction at a time." },
        { title: "Time-sharing - ", text: "the OS gives each process a tiny slice of CPU time and switches very fast." },
        { title: "Scheduler - ", text: "the part of the OS that picks which process runs next." },
        { title: "Cores - ", text: "several cores run several processes truly at once, but switching still continues." },
        { title: "Isolation - ", text: "each process has its own memory, so one cannot corrupt or crash another." },
      ],
      summaryClose: "Next lesson: the one big foundation still missing - how computers store everything, from numbers to text to images, as nothing but numbers.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th4",
    mode: "theory",
    metaLabel: "Foundations \u00b7 Running many programs at once",
    progressNoun: "Topic",
    awardedKey: "theory_4_awarded",
    awardAmount: 20,
    drills,
  };
})();
