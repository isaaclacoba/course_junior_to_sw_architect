// Theory track - Part 2, Lesson 5: "Decisions and repetition".
// Conceptual. Ties true/false (L3) and Part 1's jumps to the idea of branching
// and looping; points forward to the practical Control Flow lesson.
(function () {
  "use strict";

  const drills = [
    {
      title: "Programs choose",
      concept: "Decision",
      context:
        "A program does not always do the same thing. Based on a condition, it can take one path or another - that is a decision.",
      quiz: {
        question: "What is a decision in a program?",
        options: [
          { text: "Choosing a path based on a condition", correct: true },
          { text: "Turning the computer off", correct: false },
          { text: "Naming a variable", correct: false },
        ],
        answerWhy: "A decision is the program choosing between paths depending on a condition.",
      },
      snippet: "Based on a condition, a program can take one path or another - that is a {{1}}.",
      points: [
        "Programs branch instead of always doing the same thing.",
        "The branch depends on a condition.",
      ],
      blanks: [
        {
          id: 1,
          label: "Choosing a path based on a condition",
          answer: "decision",
          hints: ["What you make at a fork in the road."],
          explain: [
            { text: "A decision is the program choosing a path based on a condition." },
          ],
        },
      ],
    },
    {
      title: "A condition is a yes/no question",
      concept: "Condition",
      context:
        "A condition is something that is either true or false - a yes/no question, like \"is the score above 50?\". Remember from the types lesson that true/false is its own kind of value.",
      quiz: {
        question: "A condition is...?",
        options: [
          { text: "Something that is either true or false", correct: true },
          { text: "Always a number", correct: false },
          { text: "A kind of variable name", correct: false },
        ],
        answerWhy: "A condition evaluates to true or false - the yes/no value type from Lesson 3.",
      },
      snippet: "A condition is a yes/no question that is either true or {{1}}.",
      points: [
        "A condition is true or false.",
        "It is the true/false type in action.",
      ],
      blanks: [
        {
          id: 1,
          label: "The other answer besides true",
          answer: "false",
          hints: ["The opposite of true."],
          explain: [
            { text: "A condition is either true or false." },
          ],
        },
      ],
    },
    {
      title: "if and else",
      concept: "if / else",
      context:
        "The simplest decision is if / else: do one thing when the condition is true, and otherwise do another. In plain words: \"if the score is high, say pass; otherwise say fail\".",
      quiz: {
        question: "What does 'else' cover?",
        options: [
          { text: "What to do when the condition is false", correct: true },
          { text: "What to do when it is true", correct: false },
          { text: "Nothing at all", correct: false },
        ],
        answerWhy: "The if part runs when true; the else part covers every other case (when false).",
      },
      snippet: "An if runs when the condition is true; the {{1}} part covers when it is false.",
      points: [
        "if handles the true case.",
        "else handles the false case.",
      ],
      blanks: [
        {
          id: 1,
          label: "The part that runs when the condition is false",
          answer: "else",
          hints: ["The fallback word, paired with if."],
          explain: [
            { text: "else covers what to do when the if condition is false." },
          ],
        },
      ],
    },
    {
      title: "Repetition",
      concept: "Loop",
      context:
        "Sometimes you need to do something many times. A loop repeats a set of steps while a condition stays true - so you write the steps once, not a hundred times.",
      quiz: {
        question: "What is a loop for?",
        options: [
          { text: "Repeating steps many times", correct: true },
          { text: "Storing a value", correct: false },
          { text: "Naming a function", correct: false },
        ],
        answerWhy: "A loop repeats a block of steps, so you write them once and run them as often as needed.",
      },
      snippet: "A {{1}} repeats a set of steps while a condition stays true, so you write them once.",
      points: [
        "A loop avoids writing the same steps over and over.",
        "It repeats while its condition holds.",
      ],
      blanks: [
        {
          id: 1,
          label: "The thing that repeats steps",
          answer: "loop",
          hints: ["It goes round and round."],
          explain: [
            { text: "A loop repeats steps while its condition stays true." },
          ],
        },
      ],
    },
    {
      title: "Just controlled jumping",
      concept: "Jumps again",
      context:
        "Underneath, decisions and loops are the \"jumps\" from Part one: they change which instruction the CPU does next instead of simply going to the following one. The practical Control Flow lesson is where you write them.",
      quiz: {
        question: "How do decisions and loops work underneath?",
        options: [
          { text: "They change which instruction runs next - jumps", correct: true },
          { text: "They add more CPUs", correct: false },
          { text: "They slow the clock down", correct: false },
        ],
        answerWhy: "Branching and looping are built from jumps - changing which instruction the CPU does next.",
      },
      snippet: "Decisions and loops are really {{1}} - they change which instruction the CPU does next.",
      points: [
        "Both are built on the jumps from Part one.",
        "They redirect which instruction runs next.",
      ],
      blanks: [
        {
          id: 1,
          label: "What decisions and loops are built from (Part 1 word)",
          answer: "jumps",
          accept: ["jump"],
          hints: ["Changing which instruction is next."],
          explain: [
            { text: "Decisions and loops are jumps: they change which instruction runs next." },
          ],
        },
      ],
    },
    {
      title: "Decisions and repetition - recap",
      concept: "Recap",
      summary: true,
      context: "You now know how a program does more than march straight down a list.",
      summaryIntro:
        "Programs choose and repeat: a condition is a yes/no value, if/else picks a path, and a loop repeats steps - all built from jumps.",
      summaryItems: [
        { title: "Decision - ", text: "choosing a path based on a condition." },
        { title: "Condition - ", text: "a yes/no value: true or false." },
        { title: "if / else - ", text: "do one thing when true, another when false." },
        { title: "Loop - ", text: "repeat steps while a condition stays true." },
        { title: "Jumps - ", text: "underneath, both change which instruction runs next." },
      ],
      summaryClose: "Next lesson: bundling steps under a name you can reuse - functions.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th12",
    mode: "theory",
    metaLabel: "From idea to code \u00b7 Decisions",
    progressNoun: "Topic",
    awardedKey: "theory_12_awarded",
    awardAmount: 20,
    drills,
  };
})();
