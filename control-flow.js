// Control Flow - theory lesson between Practice the Basics and Methods.
// It teaches if/else, boolean logic, while, for, foreach, break/continue and
// switch. Each card combines the two ways of working: a multiple-choice
// knowledge check first, then a fill-in-the-blank for the same idea. Pure
// theory - no compiler Run. Data only: drill-engine.js reads window.DRILL_CONFIG.
(function () {
  "use strict";

  const drills = [
    {
      title: "Branch with if / else",
      concept: "if / else",
      context:
        "An if runs its block only when its condition is true. An else covers every other case.",
      quiz: {
        question: "When does the else block run?",
        options: [
          { text: "Only when the if condition is false", correct: true },
          { text: "Always, right after the if block", correct: false },
          { text: "Only when the if condition is true", correct: false },
        ],
        answerWhy: "else is the fallback - it runs exactly when the if condition was false.",
      },
      snippet: `int score = 40;
if (score {{1}} 50)
{
    Console.WriteLine("Pass");
}
{{2}}
{
    Console.WriteLine("Fail");
}`,
      points: [
        "if runs its block when the condition is true.",
        "else handles every remaining case.",
      ],
      blanks: [
        {
          id: 1,
          label: "Is the score at least 50?",
          answer: ">=",
          hints: ["Greater-than-or-equal is two characters."],
          explain: [
            { text: "The condition compares score against 50.", highlight: "if (score {{1}} 50)" },
            { text: ">= is true when score is 50 or more.", highlight: "if (score {{1}} 50)" },
          ],
        },
        {
          id: 2,
          label: "Keyword for the fallback block",
          answer: "else",
          hints: ["One word, runs when the if was false."],
          explain: [
            { text: "This block runs only when the if condition was false.", highlight: "{{2}}" },
          ],
        },
      ],
    },
    {
      title: "Combine conditions",
      concept: "Boolean logic",
      context:
        "Comparisons produce a bool. Join them with && (and), || (or), and flip one with ! (not).",
      quiz: {
        question: "Which operator is true only when BOTH sides are true?",
        options: [
          { text: "&&", correct: true },
          { text: "||", correct: false },
          { text: "!", correct: false },
        ],
        answerWhy: "&& needs both sides true; || needs just one; ! flips a single bool.",
      },
      snippet: `int age = 25;
bool working = true;
bool adult = age >= 18 {{1}} age < 65;
bool resting = {{2}}working;
Console.WriteLine(adult);`,
      points: [
        "&& is true only when both sides are true.",
        "! turns true into false and false into true.",
      ],
      blanks: [
        {
          id: 1,
          label: "Both must be true",
          answer: "&&",
          hints: ["Two ampersands."],
          explain: [
            { text: "adult should be true only when age is 18 or more AND under 65.", highlight: "bool adult = age >= 18 {{1}} age < 65" },
          ],
        },
        {
          id: 2,
          label: "Flip the value of working",
          answer: "!",
          hints: ["A single character that means 'not'."],
          explain: [
            { text: "! reads working and returns the opposite bool.", highlight: "bool resting = {{2}}working" },
          ],
        },
      ],
    },
    {
      title: "Repeat with while",
      concept: "while loop",
      context:
        "A while loop checks its condition before each pass and keeps going until that condition is false.",
      quiz: {
        question: "What makes a while loop stop?",
        options: [
          { text: "Its condition becomes false", correct: true },
          { text: "It always runs exactly ten times", correct: false },
          { text: "A break keyword is always required", correct: false },
        ],
        answerWhy: "The condition is re-checked before every pass; the loop ends once it is false.",
      },
      snippet: `int n = 3;
while (n {{1}} 0)
{
    Console.WriteLine(n);
    n{{2}};
}`,
      points: [
        "The condition is checked before each pass.",
        "Change the variable inside, or the loop never ends.",
      ],
      blanks: [
        {
          id: 1,
          label: "Keep going while n is above zero",
          answer: ">",
          hints: ["A single greater-than sign."],
          explain: [
            { text: "The loop runs while n is still greater than 0.", highlight: "while (n {{1}} 0)" },
          ],
        },
        {
          id: 2,
          label: "Move n one step toward zero",
          answer: "--",
          accept: ["-=1", "-= 1"],
          hints: ["Decrement: two minus signs."],
          explain: [
            { text: "n-- lowers n by one each pass so the loop eventually stops.", highlight: "n{{2}}" },
          ],
        },
      ],
    },
    {
      title: "Count with for",
      concept: "for loop",
      context:
        "A for loop packs the counter setup, the condition, and the step into one header.",
      quiz: {
        question: "What is the order of the three parts in a for header?",
        options: [
          { text: "start; condition; step", correct: true },
          { text: "condition; start; step", correct: false },
          { text: "step; condition; start", correct: false },
        ],
        answerWhy: "for (start; condition; step) - initialise once, test before each pass, step after each pass.",
      },
      snippet: `for (int i = {{1}}; i < 3; i{{2}})
{
    Console.WriteLine(i);
}`,
      points: [
        "The start runs once, before the first pass.",
        "The step runs after each pass.",
      ],
      blanks: [
        {
          id: 1,
          label: "Start the counter at...",
          answer: "0",
          hints: ["Counting usually starts here."],
          explain: [
            { text: "i begins at 0, so the first printed value is 0.", highlight: "for (int i = {{1}}; i < 3; i{{2}})" },
          ],
        },
        {
          id: 2,
          label: "Advance i by one each pass",
          answer: "++",
          accept: ["+=1", "+= 1"],
          hints: ["Increment: two plus signs."],
          explain: [
            { text: "i++ raises i by one after each pass until i < 3 is false.", highlight: "for (int i = {{1}}; i < 3; i{{2}})" },
          ],
        },
      ],
    },
    {
      title: "Walk a collection with foreach",
      concept: "foreach",
      context:
        "A foreach loop hands you each item in a collection in turn - no counter to manage.",
      quiz: {
        question: "What does foreach give you on each pass?",
        options: [
          { text: "The next item in the collection", correct: true },
          { text: "The current index number", correct: false },
          { text: "The collection's total length", correct: false },
        ],
        answerWhy: "foreach binds a variable to each item in order; you never touch an index.",
      },
      snippet: `string[] names = { "Ann", "Bo" };
foreach ({{1}} name in names)
{
    Console.WriteLine({{2}});
}`,
      points: [
        "foreach visits every item once, in order.",
        "There is no index to track.",
      ],
      blanks: [
        {
          id: 1,
          label: "Declare the loop variable (let the compiler infer the type)",
          answer: "var",
          accept: ["string"],
          hints: ["A keyword that infers the type, or write string."],
          explain: [
            { text: "var name takes the type of each item - here, string.", highlight: "foreach ({{1}} name in names)" },
          ],
        },
        {
          id: 2,
          label: "Print the current item",
          answer: "name",
          hints: ["Use the loop variable you just named."],
          explain: [
            { text: "name holds the current item on this pass.", highlight: "Console.WriteLine({{2}})" },
          ],
        },
      ],
    },
    {
      title: "Skip and stop: continue / break",
      concept: "break / continue",
      context:
        "Inside a loop, continue jumps to the next pass and break leaves the loop entirely.",
      quiz: {
        question: "What does continue do inside a loop?",
        options: [
          { text: "Skips the rest of this pass and starts the next one", correct: true },
          { text: "Stops the loop entirely", correct: false },
          { text: "Restarts the whole program", correct: false },
        ],
        answerWhy: "continue skips to the next pass; break is the one that stops the loop.",
      },
      snippet: `for (int i = 0; i < 5; i++)
{
    if (i == 2) {{1}};
    if (i == 4) {{2}};
    Console.WriteLine(i);
}`,
      points: [
        "continue skips the rest of the current pass.",
        "break ends the loop right away.",
      ],
      blanks: [
        {
          id: 1,
          label: "Skip printing when i is 2",
          answer: "continue",
          hints: ["Jumps to the next pass."],
          explain: [
            { text: "continue skips the WriteLine for this pass only.", highlight: "if (i == 2) {{1}}" },
          ],
        },
        {
          id: 2,
          label: "Stop the loop when i is 4",
          answer: "break",
          hints: ["Leaves the loop now."],
          explain: [
            { text: "break ends the loop, so 4 is never printed.", highlight: "if (i == 4) {{2}}" },
          ],
        },
      ],
    },
    {
      title: "Pick a case with switch",
      concept: "switch",
      context:
        "A switch matches one value against several cases. Each case ends with break so it does not fall into the next.",
      quiz: {
        question: "Why does each case usually end with break?",
        options: [
          { text: "To stop execution falling into the next case", correct: true },
          { text: "To repeat the same case again", correct: false },
          { text: "It is decorative and does nothing", correct: false },
        ],
        answerWhy: "Without break, control falls through into the following case's code.",
      },
      snippet: `int day = 2;
switch ({{1}})
{
    case 1:
        Console.WriteLine("Mon");
        break;
    case 2:
        Console.WriteLine("Tue");
        {{2}};
    default:
        Console.WriteLine("Other");
        break;
}`,
      points: [
        "switch compares one value against each case.",
        "break ends a case so it does not fall through.",
      ],
      blanks: [
        {
          id: 1,
          label: "Value to match against the cases",
          answer: "day",
          hints: ["The variable declared just above."],
          explain: [
            { text: "switch tests day against each case label.", highlight: "switch ({{1}})" },
          ],
        },
        {
          id: 2,
          label: "End the case 2 block",
          answer: "break",
          hints: ["Same keyword every case ends with."],
          explain: [
            { text: "break stops case 2 from falling into default.", highlight: "{{2}}" },
          ],
        },
      ],
    },
    {
      title: "Control flow recap",
      concept: "Recap",
      summary: true,
      context: "You now have the building blocks every method and object will use.",
      summaryIntro:
        "Control flow decides which lines run and how often. These are the same tools you will use inside methods and across objects next.",
      summaryItems: [
        { title: "if / else - ", text: "run a block only when a condition holds, with a fallback." },
        { title: "Boolean logic - ", text: "combine comparisons with &&, ||, and ! to form conditions." },
        { title: "while - ", text: "repeat as long as a condition stays true." },
        { title: "for - ", text: "count with a start, condition, and step in one header." },
        { title: "foreach - ", text: "visit each item in a collection without an index." },
        { title: "break / continue - ", text: "leave a loop early or skip to the next pass." },
        { title: "switch - ", text: "branch on one value across several cases, each ended by break." },
      ],
      summaryClose: "Next up: Methods - package these steps into a rule you can name and reuse.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "cf",
    metaLabel: "Foundations \u00b7 Control Flow",
    progressNoun: "Topic",
    awardedKey: "control_flow_awarded",
    awardAmount: 20,
    drills,
  };
})();
