// Part three - "Lambdas". Write-from-scratch coding exercises (build-engine),
// placed right before LINQ because every LINQ operator takes a lambda. This is a
// junior's FIRST contact with lambdas, so it stays self-contained: only `var`,
// simple arithmetic/comparison, and Console.WriteLine - no Array.Find, no LINQ,
// no Func<>/Action<> jargon (var infers the type). One new idea per drill, each
// answering "why do I care about lambdas?": (1) a tiny function you keep in a
// variable, (2) it can answer a yes/no question - the shape LINQ will filter
// with, (3) it can read the variables around it (capture) - the thing a plain
// named method cannot, (4) so you can bake in a value you have now. The recap
// bridges to LINQ and notes a normal method still works when a step deserves a
// name. The learner completes each lambda body; only the usage is given. Data
// only: the build plugin reads window.LESSON_CONFIG; Run compiles through the
// shared code-lab Roslyn/WASM host. Animal flavour throughout. The Main body is
// left empty on purpose: the learner assembles a few simple lines - declare a
// lambda, then actually use it over a small array with a loop. The worked example
// shows that shape on a DIFFERENT subject (numbers/prices), so copying it will not
// produce the answer; the learner adapts the data, the operator, and the output.
(function () {
  "use strict";

  const tasks = [
    {
      example: "var square = (int number) => number * number;\nConsole.WriteLine(square(2)); // 4\nConsole.WriteLine(square(3)); // 9",
      expected: [
        "4",
        "5"
      ],
      requireSource: [
        {
          pattern: /var\s+\w+\s*=/,
          message: "Store your lambda in a variable with `var`."
        },
        {
          pattern: /=>/,
          message: "Write the function as a lambda using `=>`."
        },
        {
          pattern: /\+\s*1/,
          message: "`addLeg` should give back `legs + 1`."
        },
        {
          pattern: /addLeg\s*\(/,
          message: "Call `addLeg(...)` to get each result - don't print the numbers directly."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: store a lambda `addLeg` that gives back legs + 1,\n        //       then print it for 3 and for 4 on their own lines.\n\n    }\n}\n",
      goals: [
        {
          code: ["class Program", { row: "var addLeg = (int legs) => legs + 1;", writes: "=>legs+1" }],
          gate: { type: "Program", member: "Main" }
        },
        { gate: null }
      ],
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        var addLeg = (int legs) => legs + 1;\n        Console.WriteLine(addLeg(3));\n        Console.WriteLine(addLeg(4));\n    }\n}\n"
    },
    {
      example: "int[] numbers = { 3, 12, 7, 20 };\nvar isBig = (int number) => number > 10;\nint bigCount = 0;\nforeach (int number in numbers)\n{\n    if (isBig(number)) bigCount++;\n}\nConsole.WriteLine(bigCount); // 2",
      expected: "2",
      requireSource: [
        {
          pattern: /var\s+\w+\s*=/,
          message: "Store your lambda in a variable with `var`."
        },
        {
          pattern: /==\s*4/,
          message: "Your rule should test `== 4`."
        },
        {
          pattern: /isFourLegged\s*\(/,
          message: "Actually call `isFourLegged(...)` on each item - don't print the count directly."
        },
        {
          pattern: /\bfor(each)?\s*\(/,
          message: "Walk the array with a `foreach` loop."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int[] legs = { 2, 4, 8, 4 };\n        // TODO: store a lambda isFourLegged that tests a count == 4,\n        //       then loop over legs and print how many animals pass.\n\n    }\n}\n",
      goals: [
        {
          code: ["class Program", { row: "var isFourLegged = (int count) => count == 4;", writes: "=>count==4" }],
          gate: { type: "Program", member: "Main" }
        },
        { gate: null }
      ],
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int[] legs = { 2, 4, 8, 4 };\n        var isFourLegged = (int count) => count == 4;\n        int total = 0;\n        foreach (int count in legs)\n        {\n            if (isFourLegged(count)) total++;\n        }\n        Console.WriteLine(total);\n    }\n}\n"
    },
    {
      example: "int limit = 100;\nint[] prices = { 40, 250, 90, 30 };\nvar underLimit = (int price) => price <= limit;\nint cheapCount = 0;\nforeach (int price in prices)\n{\n    if (underLimit(price)) cheapCount++;\n}\nConsole.WriteLine(cheapCount); // 3",
      expected: "3",
      requireSource: [
        {
          pattern: /var\s+\w+\s*=/,
          message: "Store your lambda in a variable with `var`."
        },
        {
          pattern: /=>[^;\n]*minLegs/,
          message: "Your lambda must read the local `minLegs` - that is the whole point."
        },
        {
          pattern: /enough\s*\(/,
          message: "Actually call `enough(...)` on each item - don't print the count directly."
        },
        {
          pattern: /\bfor(each)?\s*\(/,
          message: "Walk the array with a `foreach` loop."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int minLegs = 4;\n        int[] legs = { 2, 4, 8, 4 };\n        // TODO: store a lambda enough that checks a count >= minLegs (reading minLegs),\n        //       then loop over legs and print how many reach minLegs.\n\n    }\n}\n",
      goals: [
        {
          code: ["class Program", { row: "var enough = (int count) => count >= minLegs;", writes: ">=minLegs" }],
          gate: { type: "Program", member: "Main" }
        },
        { gate: null }
      ],
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int minLegs = 4;\n        int[] legs = { 2, 4, 8, 4 };\n        var enough = (int count) => count >= minLegs;\n        int total = 0;\n        foreach (int count in legs)\n        {\n            if (enough(count)) total++;\n        }\n        Console.WriteLine(total);\n    }\n}\n"
    },
    {
      example: "int tax = 5;\nint[] prices = { 20, 100 };\nvar withTax = (int price) => price + tax;\nforeach (int price in prices)\n{\n    Console.WriteLine(withTax(price)); // 25, 105\n}",
      expected: [
        "15",
        "30"
      ],
      requireSource: [
        {
          pattern: /var\s+\w+\s*=/,
          message: "Store your lambda in a variable with `var`."
        },
        {
          pattern: /=>[^;\n]*bonus/,
          message: "Your step must add the captured `bonus`."
        },
        {
          pattern: /reward\s*\(/,
          message: "Call `reward(...)` on each score - don't print the totals directly."
        },
        {
          pattern: /\bfor(each)?\s*\(/,
          message: "Walk the array with a `foreach` loop."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int bonus = 10;\n        int[] scores = { 5, 20 };\n        // TODO: store a lambda reward that adds bonus to a score (reading bonus),\n        //       then loop over scores and print each rewarded total.\n\n    }\n}\n",
      goals: [
        {
          code: ["class Program", { row: "var reward = (int score) => score + bonus;", writes: "=>score+bonus" }],
          gate: { type: "Program", member: "Main" }
        },
        { gate: null }
      ],
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int bonus = 10;\n        int[] scores = { 5, 20 };\n        var reward = (int score) => score + bonus;\n        foreach (int score in scores)\n        {\n            Console.WriteLine(reward(score));\n        }\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "lam",
    metaLabel: "Know the language · Lambdas",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "lambdas_awarded",
    awardAmount: 20,
  };
})();
