// Part three - "Lambdas". Runnable fill-in-the-blank drills (same engine and
// style as Collections), placed right before LINQ because every LINQ operator
// takes a lambda. Teaches the idea slowly: a lambda is a small function with no
// name; the `=>` arrow; a true/false lambda (the shape LINQ needs); more than one
// input; and handing a lambda to a method. .NET 8 lets `var` infer a lambda's
// type, so no `Func<>` jargon is needed. Data only: drill-engine.js reads
// window.DRILL_CONFIG; the Run button compiles runnablePrograms through the
// shared code-lab Roslyn/WASM host. Animal flavour throughout.

const drills = [
  {
    title: "A function with no name",
    concept: "Lambda",
    context:
      "A lambda is a small function you write right where you need it, with no name. `(int legs) => legs + 1` reads: take `legs`, give back `legs + 1`. The `=>` is the arrow - 'goes to'. Store it in a variable, then call it like any method. Add one leg to a four-legged friend.",
    snippet: `var addLeg = (int legs) => legs + {{1}};
Console.WriteLine(addLeg(4));`,
    points: [
      "A lambda is a function with no name.",
      "`(input) => result` - the arrow means 'goes to'.",
      "Store it in a variable, then call it like a method.",
    ],
    blanks: [
      {
        id: 1,
        label: "How many legs to add",
        answer: "1",
        hints: ["Just one leg."],
        explain: [
          { text: "The lambda gives back `legs + 1`.", highlight: "var addLeg = (int legs) => legs + {{1}}" },
          { text: "`addLeg(4)` works out `4 + 1`, so it prints `5`.", highlight: "Console.WriteLine(addLeg(4))" },
        ],
      },
    ],
  },
  {
    title: "The arrow does the work",
    concept: "The => arrow",
    context:
      "Whatever comes after the `=>` is what the lambda gives back. Here `n => n * 2` doubles whatever you pass in. Fill in the operator that doubles a number.",
    snippet: `var doubleIt = (int n) => n {{1}} 2;
Console.WriteLine(doubleIt(3));`,
    points: [
      "The left of `=>` is the input; the right is the result.",
      "`doubleIt(3)` runs `3 * 2`.",
    ],
    blanks: [
      {
        id: 1,
        label: "The operator that doubles n",
        answer: "*",
        hints: ["The multiply sign."],
        explain: [
          { text: "`n * 2` doubles the input.", highlight: "var doubleIt = (int n) => n {{1}} 2" },
          { text: "So `doubleIt(3)` prints `6`.", highlight: "Console.WriteLine(doubleIt(3))" },
        ],
      },
    ],
  },
  {
    title: "A lambda that answers yes or no",
    concept: "A true/false lambda",
    context:
      "A lambda can give back `true` or `false`. `legs => legs == 4` asks 'does it have four legs?'. This yes/no kind is exactly what the next lesson, LINQ, hands to `Where` and `Count`. Ask whether a paw count means a dog.",
    snippet: `var isDog = (int legs) => legs {{1}} 4;
Console.WriteLine(isDog(4));`,
    points: [
      "A lambda can return a `bool` - true or false.",
      "`==` checks whether two values are equal.",
    ],
    blanks: [
      {
        id: 1,
        label: "Check that legs equals four",
        answer: "==",
        hints: ["Equality: two equals signs."],
        explain: [
          { text: "`legs == 4` is true only when there are exactly four legs.", highlight: "var isDog = (int legs) => legs {{1}} 4" },
          { text: "`isDog(4)` is true, so it prints `True`.", highlight: "Console.WriteLine(isDog(4))" },
        ],
      },
    ],
  },
  {
    title: "More than one input",
    concept: "Two inputs",
    context:
      "A lambda can take several inputs, separated by commas. `(a, b) => a + b` adds two numbers. Give it the second number so the paws add up to five.",
    snippet: `var add = (int a, int b) => a + b;
Console.WriteLine(add(2, {{1}}));`,
    points: [
      "List inputs in the brackets, separated by commas.",
      "`add(2, 3)` gives `2 + 3`.",
    ],
    blanks: [
      {
        id: 1,
        label: "The second number, so the total is 5",
        answer: "3",
        hints: ["2 + ? = 5."],
        explain: [
          { text: "The lambda adds its two inputs.", highlight: "var add = (int a, int b) => a + b" },
          { text: "`add(2, 3)` is `5`.", highlight: "Console.WriteLine(add(2, {{1}}))" },
        ],
      },
    ],
  },
  {
    title: "Hand a lambda to a method",
    concept: "Passing a lambda",
    context:
      "Here is the real power: you can hand a lambda to a method, and it runs your lambda for you. `Array.Find` walks an array and returns the first item your lambda says `true` for. Find the first four-legged animal by its paw count.",
    snippet: `int[] paws = { 2, 4, 2 };
int firstFour = Array.Find(paws, p => p {{1}} 4);
Console.WriteLine(firstFour);`,
    points: [
      "A method can take a lambda as an argument.",
      "`Array.Find` runs your lambda on each item and returns the first match.",
      "LINQ works the same way - it just gives you more of these methods.",
    ],
    blanks: [
      {
        id: 1,
        label: "Match a paw count of exactly four",
        answer: "==",
        hints: ["The same equality check as before."],
        explain: [
          { text: "`Array.Find` keeps the first paw count your lambda says true for.", highlight: "int firstFour = Array.Find(paws, p => p {{1}} 4)" },
          { text: "The first `4` in the array matches, so it prints `4`.", highlight: "Console.WriteLine(firstFour)" },
        ],
      },
    ],
  },
  {
    title: "Lambdas - recap",
    concept: "Recap",
    summary: true,
    context: "You now have the small piece of syntax every LINQ query is built on.",
    summaryIntro:
      "A lambda is a short, nameless function you write inline. You store it, call it, and - most usefully - hand it to a method that runs it for you.",
    summaryItems: [
      { title: "Lambda - ", text: "a small function with no name, written where you need it." },
      { title: "The => arrow - ", text: "input on the left, the result on the right." },
      { title: "A yes/no lambda - ", text: "`x => x == 4` gives back true or false." },
      { title: "Many inputs - ", text: "`(a, b) => a + b`, separated by commas." },
      { title: "Pass it to a method - ", text: "a method can take your lambda and run it on each item." },
    ],
    summaryClose: "Next in this track: LINQ - every operator you meet takes a lambda exactly like these.",
    blanks: [],
  },
];

// Complete, runnable C# for each drill, index-aligned with `drills`.
const runnablePrograms = [
  // 0 - A function with no name
  `using System;

class Program
{
    static void Main()
    {
        var addLeg = (int legs) => legs + 1;
        Console.WriteLine(addLeg(4));
    }
}`,
  // 1 - The arrow does the work
  `using System;

class Program
{
    static void Main()
    {
        var doubleIt = (int n) => n * 2;
        Console.WriteLine(doubleIt(3));
    }
}`,
  // 2 - A lambda that answers yes or no
  `using System;

class Program
{
    static void Main()
    {
        var isDog = (int legs) => legs == 4;
        Console.WriteLine(isDog(4));
    }
}`,
  // 3 - More than one input
  `using System;

class Program
{
    static void Main()
    {
        var add = (int a, int b) => a + b;
        Console.WriteLine(add(2, 3));
    }
}`,
  // 4 - Hand a lambda to a method
  `using System;

class Program
{
    static void Main()
    {
        int[] paws = { 2, 4, 2 };
        int firstFour = Array.Find(paws, p => p == 4);
        Console.WriteLine(firstFour);
    }
}`,
];

window.DRILL_CONFIG = {
  prefix: "lam",
  metaLabel: "Know the language \u00b7 Lambdas",
  progressNoun: "Drill",
  drills,
  runnablePrograms,
  runnerUrl: "level3-app/index.html?runner=1",
  xpKey: "course_global_xp",
  awardedKey: "lambdas_awarded",
  awardAmount: 20,
};
