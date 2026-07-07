// Theory track - Part 2 checkpoint. Closes Part two ("From idea to code") and
// awards XP once on a pass. Data only: sets window.QUIZ_CONFIG for the code-lab
// Quiz component (CodeLab.Quiz), which owns the bank draw / shuffle / grading.
(function () {
  "use strict";

  window.QUIZ_CONFIG = {
    prefix: "chk2",
    metaLabel: "From idea to code \u00b7 Part two checkpoint",
    title: "Part two checkpoint",
    intro:
      "Five questions drawn from Part two - how we write instructions. Pick the best answer for each, then submit. Score four or more to pass and earn XP; a fresh set is drawn each time you retry.",
    xpKey: "course_global_xp",
    awardedKey: "theory_check_2_awarded",
    awardAmount: 40,
    askCount: 5,
    passRatio: 0.7,
    nextHref: "theory-15.html",
    nextLabel: "Continue to Part three",
    questions: [
      {
        concept: "Languages",
        stem: "Why do we write in a language like C# instead of the CPU's raw instructions?",
        options: [
          "A language is human-friendly, and a tool translates it into the CPU's instructions",
          "The CPU cannot run any program without a language",
          "A language makes the program run faster than the CPU could",
          "The CPU understands English directly",
        ],
        correct: 0,
        why: "The CPU only runs tiny numeric instructions. A language lets you write readable code, which a compiler translates down to those instructions.",
      },
      {
        concept: "High vs low level",
        stem: "Roughly, one line of high-level code becomes how much machine code?",
        options: [
          "Many low-level CPU instructions",
          "Exactly one CPU instruction",
          "No instructions until you print something",
          "A single stored number",
        ],
        correct: 0,
        why: "High-level lines are convenient shorthand; each usually expands into several machine instructions.",
      },
      {
        concept: "Variables",
        stem: "What is a variable?",
        options: [
          "A named slot in memory that holds a value",
          "A fixed number that can never change",
          "The name of the whole program",
          "A message printed to the screen",
        ],
        correct: 0,
        why: "A variable is a named place in memory; the name is a label for people, and it holds a value that can change.",
      },
      {
        concept: "Assignment",
        stem: "You run `x = 5` and then `x = 9`. What is in `x`?",
        options: [
          "9 - the new value replaces the old one",
          "Both 5 and 9",
          "5 - assignment does not overwrite",
          "Nothing, the second line is an error",
        ],
        correct: 0,
        why: "A slot holds one value at a time; assigning a new value replaces what was there.",
      },
      {
        concept: "Types",
        stem: "What does a value's type mainly decide?",
        options: [
          "What you can do with it - which operations are allowed",
          "Where on the screen it appears",
          "How fast the whole program runs",
          "The name of the variable",
        ],
        correct: 0,
        why: "The type sets the rules: you can add two numbers, but adding a number to a true/false value makes no sense.",
      },
      {
        concept: "Type checking",
        stem: "Adding a number to a word makes no sense. What usually catches that mistake?",
        options: [
          "The compiler, before the program runs",
          "The monitor while it draws",
          "The hard drive when it saves",
          "Nothing - it always just works",
        ],
        correct: 0,
        why: "A type mismatch is caught by the compiler at build time, so it never gets a chance to misbehave while running.",
      },
      {
        concept: "Statements & expressions",
        stem: "A statement is one complete step. What is an expression?",
        options: [
          "A piece of code that produces a value",
          "A file saved to disk",
          "The name of a type",
          "A core inside the CPU",
        ],
        correct: 0,
        why: "An expression works out to a value (like `2 + 3`); statements often use expressions to get the values they act on.",
      },
      {
        concept: "Decisions",
        stem: "What does an `if`/`else` let a program do?",
        options: [
          "Choose between paths based on a yes/no condition",
          "Repeat a step forever",
          "Store a value in memory",
          "Define a new type",
        ],
        correct: 0,
        why: "A condition is a yes/no question; `if`/`else` picks which branch runs based on the answer.",
      },
      {
        concept: "Functions",
        stem: "When a function is called, what happens in memory?",
        options: [
          "A new frame is pushed on the stack holding its local variables",
          "The program's whole memory is wiped",
          "The data is written to the hard drive",
          "A new file is created",
        ],
        correct: 0,
        why: "Each call gets its own frame - a temporary slice of the stack - where its arguments and locals live until it returns.",
      },
      {
        concept: "Bugs",
        stem: "A program builds and runs, but gives the wrong answer. What kind of bug is that?",
        options: [
          "A logic error",
          "A syntax error",
          "A hardware fault",
          "Not a bug at all",
        ],
        correct: 0,
        why: "Syntax errors stop it building; a logic error builds fine but does the wrong thing - you find it by debugging.",
      },
    ],
  };
})();
