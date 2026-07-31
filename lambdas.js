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
// only: build-engine.js reads window.BUILD_CONFIG; Run compiles through the
// shared code-lab Roslyn/WASM host. Animal flavour throughout. The Main body is
// left empty on purpose: the learner assembles a few simple lines - declare a
// lambda, then actually use it over a small array with a loop. The worked example
// shows that shape on a DIFFERENT subject (numbers/prices), so copying it will not
// produce the answer; the learner adapts the data, the operator, and the output.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Store it once, call it twice",
      concept: "Reuse a stored function",
      context:
        "A lambda is a tiny function with no name. You keep it in a variable and call it as often as you like - that is the point of storing it. `(int legs) => legs + 1` reads: take `legs`, give back `legs + 1`. A stool has three legs, a chair has four; store the 'add a leg' function once and use it on both.",
      example:
        'var square = (int n) => n * n;\nConsole.WriteLine(square(2)); // 4\nConsole.WriteLine(square(3)); // 9',
      goal: [
        "Store a lambda `addLeg` that gives back `legs + 1`.",
        "Call it on `3` and on `4`, printing each result - two lines: `4` then `5`.",
      ],
      expected: ["4", "5"],
      requireSource: [
        { pattern: /var\s+\w+\s*=/, message: "Store your lambda in a variable with `var`." },
        { pattern: /=>/, message: "Write the function as a lambda using `=>`." },
        { pattern: /\+\s*1/, message: "`addLeg` should give back `legs + 1`." },
        { pattern: /addLeg\s*\(/, message: "Call `addLeg(...)` to get each result - don't print the numbers directly." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: store a lambda `addLeg` that gives back legs + 1,\n        //       then print it for 3 and for 4 on their own lines.\n\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        var addLeg = (int legs) => legs + 1;\n        Console.WriteLine(addLeg(3));\n        Console.WriteLine(addLeg(4));\n    }\n}\n',
    },
    {
      title: "Run a rule over a list",
      concept: "Apply a yes/no rule",
      context:
        "A lambda can give back `true` or `false` - a small yes/no test. The useful part is running that one test over many items. Store `isFourLegged` (does a leg count equal four?), then walk the array with a `foreach` and count how many animals pass. This by-hand loop is exactly what LINQ will do for you next lesson.",
      example:
        'int[] nums = { 3, 12, 7, 20 };\nvar isBig = (int n) => n > 10;\nint big = 0;\nforeach (int n in nums)\n{\n    if (isBig(n)) big++;\n}\nConsole.WriteLine(big); // 2',
      goal: [
        "Store a lambda `isFourLegged` that returns whether a count equals `4`.",
        "Loop over `legs` and count how many pass, then print the count - the output is `2`.",
      ],
      expected: "2",
      requireSource: [
        { pattern: /var\s+\w+\s*=/, message: "Store your lambda in a variable with `var`." },
        { pattern: /==\s*4/, message: "Your rule should test `== 4`." },
        { pattern: /\bfor(each)?\s*\(/, message: "Walk the array with a `foreach` loop." },
        { pattern: /isFourLegged\s*\(/, message: "Actually call `isFourLegged(...)` on each item - don't print the count directly." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int[] legs = { 2, 4, 8, 4 };\n        // TODO: store a lambda isFourLegged that tests a count == 4,\n        //       then loop over legs and print how many animals pass.\n\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int[] legs = { 2, 4, 8, 4 };\n        var isFourLegged = (int count) => count == 4;\n        int total = 0;\n        foreach (int count in legs)\n        {\n            if (isFourLegged(count)) total++;\n        }\n        Console.WriteLine(total);\n    }\n}\n',
    },
    {
      title: "A rule that reads a local",
      concept: "Capture",
      context:
        "Here is where a lambda earns its keep. Say the threshold sits in a variable, `minLegs`, set a line earlier. A lambda written right there can read `minLegs` on its own - a separate named method could not, it only sees what you pass it. Store `enough` (does a count reach `minLegs`?), then count how many animals clear the bar.",
      example:
        'int limit = 100;\nint[] prices = { 40, 250, 90, 30 };\nvar underLimit = (int p) => p <= limit;\nint cheap = 0;\nforeach (int p in prices)\n{\n    if (underLimit(p)) cheap++;\n}\nConsole.WriteLine(cheap); // 3',
      goal: [
        "Store a lambda `enough` that returns whether a count is `>= minLegs` (it reads the local `minLegs`).",
        "Loop over `legs` and count how many reach `minLegs`, then print it - the output is `3`.",
      ],
      expected: "3",
      requireSource: [
        { pattern: /var\s+\w+\s*=/, message: "Store your lambda in a variable with `var`." },
        { pattern: /=>[^;\n]*minLegs/, message: "Your lambda must read the local `minLegs` - that is the whole point." },
        { pattern: /\bfor(each)?\s*\(/, message: "Walk the array with a `foreach` loop." },
        { pattern: /enough\s*\(/, message: "Actually call `enough(...)` on each item - don't print the count directly." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int minLegs = 4;\n        int[] legs = { 2, 4, 8, 4 };\n        // TODO: store a lambda enough that checks a count >= minLegs (reading minLegs),\n        //       then loop over legs and print how many reach minLegs.\n\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int minLegs = 4;\n        int[] legs = { 2, 4, 8, 4 };\n        var enough = (int count) => count >= minLegs;\n        int total = 0;\n        foreach (int count in legs)\n        {\n            if (enough(count)) total++;\n        }\n        Console.WriteLine(total);\n    }\n}\n',
    },
    {
      title: "Configure a step, then run it",
      concept: "Capture to configure",
      context:
        "Because a lambda can read the values around it, you can bake one in. `bonus` is a plain number; store `reward` so it adds `bonus` to any score. The same lambda now carries `bonus` with it - loop over the scores and print each rewarded total. Change `bonus` once and every result follows.",
      example:
        'int tax = 5;\nint[] prices = { 20, 100 };\nvar withTax = (int p) => p + tax;\nforeach (int p in prices)\n{\n    Console.WriteLine(withTax(p)); // 25, 105\n}',
      goal: [
        "Store a lambda `reward` that gives back `score + bonus` (it reads the local `bonus`).",
        "Loop over `scores` and print each rewarded total - two lines: `15` then `30`.",
      ],
      expected: ["15", "30"],
      requireSource: [
        { pattern: /var\s+\w+\s*=/, message: "Store your lambda in a variable with `var`." },
        { pattern: /=>[^;\n]*bonus/, message: "Your step must add the captured `bonus`." },
        { pattern: /\bfor(each)?\s*\(/, message: "Walk the array with a `foreach` loop." },
        { pattern: /reward\s*\(/, message: "Call `reward(...)` on each score - don't print the totals directly." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int bonus = 10;\n        int[] scores = { 5, 20 };\n        // TODO: store a lambda reward that adds bonus to a score (reading bonus),\n        //       then loop over scores and print each rewarded total.\n\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int bonus = 10;\n        int[] scores = { 5, 20 };\n        var reward = (int score) => score + bonus;\n        foreach (int score in scores)\n        {\n            Console.WriteLine(reward(score));\n        }\n    }\n}\n',
    },
    {
      summary: true,
      title: "Why care about lambdas? - recap",
      concept: "Recap",
      context: "So what is a lambda, and why keep one around?",
      summaryIntro:
        "A lambda is a tiny function with no name that you keep in a variable. It is worth caring about because you can package a small rule or step, run it over many items, and - unlike a plain named method - it can read the variables sitting around it.",
      summaryItems: [
        { title: "A function in a variable - ", text: "no name, stored once, called as often as you like." },
        { title: "The arrow - ", text: "`(input) => result`: input on the left, the answer on the right." },
        { title: "A rule over a list - ", text: "one small `foreach` runs your test on every item." },
        { title: "Capture - ", text: "a lambda can read the locals beside it; a named method only sees what you pass it." },
        { title: "Configure it - ", text: "bake in a value you have now, and the same lambda does a new job." },
      ],
      summaryClose: "Next: LINQ - `legs.Count(...)` and `scores.Select(...)` do that same foreach for you, in one line, with a lambda exactly like these. (When a step deserves a real name, a normal method still works - a lambda just wins when it is small, inline, or needs the values around it.)",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "lam",
    metaLabel: "Know the language \u00b7 Lambdas",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "lambdas_awarded",
    awardAmount: 20,
  };
})();
