// Theory track - Part 3, Lesson 3: "The build-and-run cycle". Absolute-beginner,
// no code. How the text you write turns into a running program: source code ->
// compiler -> built program -> the .NET runtime that runs it, and the two kinds
// of error (caught while building vs only while running). Ends on the everyday
// write-build-run-fix loop the course's Run button performs. Drill-engine theory
// mode (MC + fill-blank).
(function () {
  "use strict";

  const drills = [
    {
      title: "Code starts as plain text",
      concept: "Source code",
      context:
        "The code you write is just text - letters and symbols in a file. From Part one, the computer only runs tiny CPU instructions, so it cannot run your text directly. The text has to be turned into something runnable first. This written text is called source code.",
      quiz: {
        question: "What is the code you write, before anything is done to it?",
        options: [
          { text: "Plain text the computer cannot run yet", correct: true },
          { text: "Ready-to-run CPU instructions", correct: false },
          { text: "A picture of the program", correct: false },
        ],
        answerWhy: "Your code is just text (source code); the computer cannot run it until it is turned into instructions.",
      },
      snippet: "The code you write is just {{1}} - the computer cannot run it directly.",
      points: [
        "Source code is text in a file.",
        "The computer needs it turned into runnable instructions first.",
      ],
      blanks: [
        {
          id: 1,
          label: "What your written code is, before it is turned into anything",
          answer: "text",
          accept: ["source", "source code"],
          hints: ["Just letters and symbols."],
          explain: [
            { text: "Code starts as plain text - source code - that the computer cannot run directly." },
          ],
        },
      ],
    },
    {
      title: "A compiler translates your code",
      concept: "Compiler",
      context:
        "A tool reads your source code and translates it into something the computer can run. That tool is a compiler, and the step is called compiling. You met this idea in Part one - this is the tool that does it.",
      quiz: {
        question: "What turns your written code into something runnable?",
        options: [
          { text: "A compiler", correct: true },
          { text: "A printer", correct: false },
          { text: "The mouse", correct: false },
        ],
        answerWhy: "A compiler translates your source code into a form the computer can actually run.",
      },
      snippet: "A {{1}} translates your written code into something the computer can run.",
      points: [
        "Compiling = translating source code into a runnable form.",
        "The tool that does it is the compiler.",
      ],
      blanks: [
        {
          id: 1,
          label: "The tool that translates source code into a runnable form",
          answer: "compiler",
          hints: ["From Part one - it 'compiles' your code."],
          explain: [
            { text: "A compiler translates your source code into something runnable." },
          ],
        },
      ],
    },
    {
      title: "Break a rule, it will not build",
      concept: "Compile-time error",
      context:
        "If your code breaks the language's rules - a missing bracket, a misspelt keyword - the compiler stops and refuses to build it. That is a compile-time error, caught before the program ever runs. You met syntax errors in Part two; this is the moment they are caught.",
      quiz: {
        question: "When is a compile-time error caught?",
        options: [
          { text: "While building, before the program runs", correct: true },
          { text: "Halfway through running", correct: false },
          { text: "It is never caught", correct: false },
        ],
        answerWhy: "A compile-time error is caught by the compiler while building - the program never even starts.",
      },
      snippet: "A {{1}}-time error is caught while building, before the program ever runs.",
      points: [
        "Break the rules and the compiler refuses to build.",
        "Caught early, before anything runs.",
      ],
      blanks: [
        {
          id: 1,
          label: "This kind of error is caught at ___ time (while building)",
          answer: "compile",
          hints: ["The same word as the tool that builds your code."],
          explain: [
            { text: "A compile-time error is caught while building, before the program runs." },
          ],
        },
      ],
    },
    {
      title: "The runtime runs the built program",
      concept: "Runtime",
      context:
        "Once built, the program still needs something to run it. For C#, that something is the .NET runtime - the software that actually carries your built program out, step by step. In this course, that runtime even runs inside your browser when you press Run.",
      quiz: {
        question: "What actually runs your built C# program?",
        options: [
          { text: "The .NET runtime", correct: true },
          { text: "The compiler, a second time", correct: false },
          { text: "The keyboard", correct: false },
        ],
        answerWhy: "After building, the .NET runtime is the software that actually runs your program.",
      },
      snippet: "Once built, the .NET {{1}} is what actually runs your program.",
      points: [
        "Building is not running - something has to run the result.",
        "For C#, the .NET runtime runs the built program.",
      ],
      blanks: [
        {
          id: 1,
          label: "The software that runs your built program",
          answer: "runtime",
          hints: ["It is there at the time your program runs."],
          explain: [
            { text: "The .NET runtime runs your built program." },
          ],
        },
      ],
    },
    {
      title: "Some errors only appear while running",
      concept: "Run-time error",
      context:
        "Some problems cannot be seen until the program runs - dividing by zero, or using something that turned out to be empty. Those are run-time errors: the code built fine, and only goes wrong once it runs. You handled these in the practical Errors and null lesson.",
      quiz: {
        question: "What is a run-time error?",
        options: [
          { text: "A problem that only shows up while the program runs", correct: true },
          { text: "A typo caught while building", correct: false },
          { text: "A kind of variable", correct: false },
        ],
        answerWhy: "A run-time error appears only while running; the build was fine, so the compiler did not catch it.",
      },
      snippet: "A {{1}}-time error appears only while the program runs, not when it is built.",
      points: [
        "The code built fine - the trouble is in what happens when it runs.",
        "Examples: divide by zero, using an empty value.",
      ],
      blanks: [
        {
          id: 1,
          label: "This kind of error appears at ___ time (while running)",
          answer: "run",
          hints: ["The opposite of compile-time."],
          explain: [
            { text: "A run-time error shows up only while the program is running." },
          ],
        },
      ],
    },
    {
      title: "Write, build, run, repeat",
      concept: "The cycle",
      context:
        "Day to day, programming is a loop: write some code, build it, run it, see what happens, fix what is wrong, and go round again. The Run button you use in this course does the build-and-run part for you, then shows you the result.",
      quiz: {
        question: "What does the everyday programming loop look like?",
        options: [
          { text: "Write → build → run → fix → repeat", correct: true },
          { text: "Write once and never change it", correct: false },
          { text: "Run first, then write the code", correct: false },
        ],
        answerWhy: "Programming goes round a loop: write, build, run, see the result, fix, and repeat.",
      },
      snippet: "Programming is a loop: write, build, run, fix, and {{1}} again.",
      points: [
        "You rarely get it right the first time - you go round the loop.",
        "The Run button builds and runs for you each time.",
      ],
      mermaid:
        "flowchart LR\n  W[Write] --> B[Build] --> R[Run] --> F[Fix] --> W",
      blanks: [
        {
          id: 1,
          label: "What you do after fixing - go round and do it ___",
          answer: "repeat",
          accept: ["again", "round"],
          hints: ["Round the loop once more."],
          explain: [
            { text: "You repeat the loop: write, build, run, fix, and round again." },
          ],
        },
      ],
    },
    {
      title: "The build-and-run cycle - recap",
      concept: "Recap",
      summary: true,
      context: "You now know how the text you write becomes a running program.",
      summaryIntro:
        "Your code is text; a compiler builds it, the runtime runs it, and errors show up either while building or while running.",
      summaryItems: [
        { title: "Source code - ", text: "the plain text you write; not runnable on its own." },
        { title: "Compiler - ", text: "translates source code into something runnable." },
        { title: "Compile-time error - ", text: "a broken rule, caught while building, before it runs." },
        { title: "Runtime (.NET) - ", text: "the software that actually runs the built program." },
        { title: "Run-time error - ", text: "a problem that only appears while running." },
        { title: "The cycle - ", text: "write, build, run, fix, repeat - what the Run button drives." },
      ],
      summaryClose: "Next lesson: memory forgets everything when a program stops - so how does data stick around? Saving data: files and databases.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th17",
    mode: "theory",
    metaLabel: "How software runs \u00b7 Build and run",
    progressNoun: "Topic",
    awardedKey: "theory_17_awarded",
    awardAmount: 20,
    drills,
  };
})();
