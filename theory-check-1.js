// Theory track - Part 1 checkpoint. A graded assessment that closes Part one
// ("Foundations - the machine") and awards XP once on a pass. Data only: it sets
// window.QUIZ_CONFIG for the code-lab Quiz component (CodeLab.Quiz), which owns
// the bank draw / option shuffle / grading. Questions are scenario-based where
// possible, with distractors that are plausible rather than obviously wrong.
(function () {
  "use strict";

  window.QUIZ_CONFIG = {
    prefix: "chk1",
    metaLabel: "Foundations \u00b7 Part one checkpoint",
    title: "Part one checkpoint",
    intro:
      "Five questions drawn from Part one - the machine. Pick the best answer for each, then submit. Score four or more to pass and earn XP; a fresh set is drawn each time you retry.",
    xpKey: "course_global_xp",
    awardedKey: "theory_check_1_awarded",
    awardAmount: 40,
    askCount: 5,
    passRatio: 0.7, // ceil(5 * 0.7) = 4 needed
    nextHref: "theory-8.html",
    nextLabel: "Continue to Part two",
    questions: [
      {
        concept: "Program",
        stem: "You double-click an app and it starts. In computing terms, what did you just ask the CPU to begin running?",
        options: [
          "An ordered list of instructions",
          "A single number held in memory",
          "The window that gets drawn on screen",
          "A folder of saved files",
        ],
        correct: 0,
        why: "A program is an ordered list of instructions; starting it hands that list to the CPU to run one step at a time.",
      },
      {
        concept: "CPU",
        stem: "A single CPU core is described as doing 'one thing at a time'. What does that actually mean?",
        options: [
          "It runs one instruction, then the next, extremely fast",
          "It can run only one program for the whole session",
          "It runs one instruction and then waits for the screen",
          "It does one calculation per second",
        ],
        correct: 0,
        why: "A core executes instructions one after another, just very quickly - that speed is what makes it feel like everything happens together.",
      },
      {
        concept: "Time-sharing",
        stem: "On a single-core laptop, a browser and a music player seem to run at the same moment. How is that possible?",
        options: [
          "The operating system switches between them thousands of times a second",
          "Each program is given its own core",
          "The core runs both programs' instructions simultaneously",
          "The screen is split so each gets half",
        ],
        correct: 0,
        why: "With one core they take turns; the OS time-shares it between processes fast enough to feel simultaneous.",
      },
      {
        concept: "Cores",
        stem: "Your machine has four cores instead of one. What does that let it do that a single core cannot?",
        options: [
          "Run several programs at the very same instant",
          "Store more files at once",
          "Keep a program running after you close it",
          "Work without an operating system",
        ],
        correct: 0,
        why: "Extra cores allow real parallelism - different programs (or parts of one) run at the same instant, not just fast turn-taking.",
      },
      {
        concept: "Bits",
        stem: "Everything a computer stores is built from bits. What is a single bit?",
        options: [
          "A value that is either 0 or 1",
          "A single letter of text",
          "A whole number from 0 to 255",
          "One small file on disk",
        ],
        correct: 0,
        why: "A bit is the smallest piece of data - one on/off value, 0 or 1. Larger things are just groups of bits.",
      },
      {
        concept: "Byte",
        stem: "One byte is a group of eight bits. How many different values can a single byte represent?",
        options: ["256", "8", "16", "1000"],
        correct: 0,
        why: "Eight bits give 2 to the power 8 = 256 combinations - enough for one letter, which is why sizes are measured in bytes.",
      },
      {
        concept: "Encoding",
        stem: "A photo has no numbers you can see, yet the computer stores it as numbers. How does that work?",
        options: [
          "Each pixel's colour is recorded as numbers, such as red, green and blue amounts",
          "The photo is stored as a sentence describing it",
          "The screen makes the numbers up as it draws",
          "Only text can become numbers, not images",
        ],
        correct: 0,
        why: "An image is a grid of pixels, and each pixel's colour is written as numbers - so the whole picture is just numbers.",
      },
      {
        concept: "Files",
        stem: "When you save your work, it becomes a file. Underneath, what is a file?",
        options: [
          "A named bundle of bytes kept on storage",
          "A program that is currently running",
          "A single instruction for the CPU",
          "A core inside the processor",
        ],
        correct: 0,
        why: "A file is just a named collection of bytes stored on disk; the name lets you and the OS find it again later.",
      },
      {
        concept: "Operating system",
        stem: "You save a document and it lands neatly in a folder rather than as raw disk sectors. What arranges that for you?",
        options: [
          "The operating system",
          "The compiler",
          "The monitor",
          "A single variable in the program",
        ],
        correct: 0,
        why: "The operating system turns raw storage into named files and folders and stands between programs and the hardware.",
      },
    ],
  };
})();
