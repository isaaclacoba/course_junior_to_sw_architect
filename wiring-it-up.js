// Wiring It Up - write-from-scratch lesson that sits between First Builds and
// the Capstone. First Builds made single objects; here we work over collections
// with a foreach loop, one small step at a time. Each card shows the loop
// pattern and you fill in the body. Data only: the controller lives in
// build-engine.js, which reads window.BUILD_CONFIG (loaded after this file).
(function () {
  "use strict";

  // Technique gate: the answer must actually loop, so a hardcoded value that
  // prints the expected output for the visible case is rejected.
  const ITERATES = /foreach|\bfor\b|\bwhile\b/;

  const tasks = [
    {
      title: "Visit each item",
      concept: "foreach",
      context:
        "A `foreach` loop runs its body once for every item in a collection. Read the pattern below, then do the same to print each name on its own line.",
      example:
        'string[] colors = { "red", "green" };\nforeach (var color in colors)\n{\n    Console.WriteLine(color);\n}\n// prints:\n// red\n// green',
      goal: [
        "Loop over names and print each one with Console.WriteLine.",
        "The two names should print on two lines: login then logout.",
      ],
      expected: ["login", "logout"],
      requireSource: [
        { pattern: ITERATES, message: "Use a foreach loop to visit each name." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var list = new Checklist();\n        string[] names = { "alpha", "beta", "gamma" };\n        list.Print(names);\n    }\n}\n',
        expected: ["alpha", "beta", "gamma"],
        message: "It works for this example only. Loop over whatever names you are given instead of printing fixed lines.",
      },
      starter:
        'using System;\n\npublic class Checklist\n{\n    public void Print(string[] names)\n    {\n        // TODO: print each name on its own line\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var list = new Checklist();\n        string[] names = { "login", "logout" };\n        list.Print(names);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Checklist\n{\n    public void Print(string[] names)\n    {\n        foreach (var name in names)\n        {\n            Console.WriteLine(name);\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var list = new Checklist();\n        string[] names = { "login", "logout" };\n        list.Print(names);\n    }\n}\n',
    },
    {
      title: "Count the passes",
      concept: "Counting",
      context:
        "To count, keep a number outside the loop and add to it inside. The pattern below counts the even numbers; do the same to count how many results are `true`.",
      example:
        'int evens = 0;\nforeach (var n in numbers)\n{\n    if (n % 2 == 0)\n    {\n        evens++;\n    }\n}\n// evens now holds how many were even',
      goal: [
        "Loop over results and count how many are true.",
        "Two of the three are true, so the output should be 2.",
      ],
      expected: "2",
      requireSource: [
        { pattern: ITERATES, message: "Count by looping over results - a fixed number does not count." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var counter = new PassCounter();\n        bool[] results = { true, true, true };\n        Console.WriteLine(counter.Count(results));\n    }\n}\n',
        expected: "3",
        message: "It prints 2 here, but the count is wrong for other inputs. Add up the true values instead of returning a fixed number.",
      },
      starter:
        'using System;\n\npublic class PassCounter\n{\n    public int Count(bool[] results)\n    {\n        // TODO: count how many results are true, then return the count\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var counter = new PassCounter();\n        bool[] results = { true, false, true };\n        Console.WriteLine(counter.Count(results));\n    }\n}\n',
      solution:
        'using System;\n\npublic class PassCounter\n{\n    public int Count(bool[] results)\n    {\n        int passed = 0;\n        foreach (var r in results)\n        {\n            if (r) passed++;\n        }\n        return passed;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var counter = new PassCounter();\n        bool[] results = { true, false, true };\n        Console.WriteLine(counter.Count(results));\n    }\n}\n',
    },
    {
      title: "Add up the total",
      concept: "Summing",
      context:
        "Summing is the same idea as counting, but you add each value instead of adding 1. The pattern below totals a list of prices; do the same with the durations using `total += value`.",
      example:
        'int total = 0;\nforeach (var price in prices)\n{\n    total += price;\n}\n// total now holds the sum of every price',
      goal: [
        "Loop over the durations and add them into total.",
        "3 + 5 + 2 is 10, so the output should be 10.",
      ],
      expected: "10",
      requireSource: [
        { pattern: ITERATES, message: "Add the values with a loop instead of returning a fixed number." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var totals = new Totals();\n        int[] durations = { 10, 20 };\n        Console.WriteLine(totals.Sum(durations));\n    }\n}\n',
        expected: "30",
        message: "Right for this example only. Add up whatever numbers you are given, not a fixed total.",
      },
      starter:
        'using System;\n\npublic class Totals\n{\n    public int Sum(int[] durations)\n    {\n        int total = 0;\n        // TODO: add every duration into total\n        return total;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var totals = new Totals();\n        int[] durations = { 3, 5, 2 };\n        Console.WriteLine(totals.Sum(durations));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Totals\n{\n    public int Sum(int[] durations)\n    {\n        int total = 0;\n        foreach (var d in durations)\n        {\n            total += d;\n        }\n        return total;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var totals = new Totals();\n        int[] durations = { 3, 5, 2 };\n        Console.WriteLine(totals.Sum(durations));\n    }\n}\n',
    },
    {
      title: "Keep the largest",
      concept: "Compare",
      context:
        "Some loops remember the best value so far. The pattern below keeps the biggest number it has seen; do the same to return the largest time.",
      example:
        'int max = 0;\nforeach (var n in numbers)\n{\n    if (n > max)\n    {\n        max = n;\n    }\n}\n// max now holds the biggest value',
      goal: [
        "Loop over the times and return the largest one.",
        "The biggest of 4, 9, 2 is 9, so the output should be 9.",
      ],
      expected: "9",
      requireSource: [
        { pattern: ITERATES, message: "Find the largest with a loop, not a fixed number." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var times = new Durations();\n        int[] values = { 1, 7, 5, 3 };\n        Console.WriteLine(times.Slowest(values));\n    }\n}\n',
        expected: "7",
        message: "9 is right for this example only. Compare the values you are given and keep the biggest.",
      },
      starter:
        'using System;\n\npublic class Durations\n{\n    public int Slowest(int[] times)\n    {\n        int slowest = 0;\n        // TODO: return the largest time\n        return slowest;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var times = new Durations();\n        int[] values = { 4, 9, 2 };\n        Console.WriteLine(times.Slowest(values));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Durations\n{\n    public int Slowest(int[] times)\n    {\n        int slowest = 0;\n        foreach (var t in times)\n        {\n            if (t > slowest) slowest = t;\n        }\n        return slowest;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var times = new Durations();\n        int[] values = { 4, 9, 2 };\n        Console.WriteLine(times.Slowest(values));\n    }\n}\n',
    },
    {
      title: "Turn a count into a rate",
      concept: "Pass rate",
      context:
        "Now combine a count with the size of the collection. The pattern below turns a count of hits into a percentage using `flags.Length`; do the same with the passes and `results.Length`.",
      example:
        'int hits = 0;\nforeach (var b in flags)\n{\n    if (b) hits++;\n}\nint percent = hits * 100 / flags.Length;\n// percent is the share that were true',
      goal: [
        "Count the passes, then return their share as a percent like \"50%\".",
        "Two of four pass, so the output should be 50%.",
      ],
      expected: "50%",
      requireSource: [
        { pattern: ITERATES, message: "Count the passes with a loop, don't hardcode the rate." },
        { pattern: /results\s*\.\s*Length/, message: "Use results.Length to work out the percentage." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var rate = new PassRate();\n        bool[] results = { true, true, true, true };\n        Console.WriteLine(rate.Percent(results));\n    }\n}\n',
        expected: "100%",
        message: "50% is right for this example only. Work the percentage out from the real pass count and results.Length.",
      },
      starter:
        'using System;\n\npublic class PassRate\n{\n    public string Percent(bool[] results)\n    {\n        int passed = 0;\n        // TODO: return the share that passed, e.g. "50%"\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var rate = new PassRate();\n        bool[] results = { true, true, false, false };\n        Console.WriteLine(rate.Percent(results));\n    }\n}\n',
      solution:
        'using System;\n\npublic class PassRate\n{\n    public string Percent(bool[] results)\n    {\n        int passed = 0;\n        foreach (var r in results)\n        {\n            if (r) passed++;\n        }\n        int percent = passed * 100 / results.Length;\n        return $"{percent}%";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var rate = new PassRate();\n        bool[] results = { true, true, false, false };\n        Console.WriteLine(rate.Percent(results));\n    }\n}\n',
    },
    {
      title: "One line per check",
      concept: "Put it together",
      context:
        "Each check carries a `Name` and whether it `Passed`. The pattern below prints one line per item using its fields; do the same to print each check - the exact shape the Capstone scales up.",
      example:
        'foreach (var item in items)\n{\n    string label = item.Active ? "ON" : "OFF";\n    Console.WriteLine($"{item.Name}: {label}");\n}',
      goal: [
        "For each check, print \"{Name}: PASS\" when Passed, otherwise \"{Name}: FAIL\".",
        "Print one line per check, in order: login: PASS then logout: FAIL.",
      ],
      expected: ["login: PASS", "logout: FAIL"],
      requireSource: [
        { pattern: ITERATES, message: "Loop over the checks instead of printing fixed lines." },
        { pattern: /\.\s*Name\b/, message: "Print each check's Name." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var checks = new Check[]\n        {\n            new Check { Name = "alpha", Passed = false },\n            new Check { Name = "beta", Passed = true },\n        };\n        new Report().Print(checks);\n    }\n}\n',
        expected: ["alpha: FAIL", "beta: PASS"],
        message: "Those lines are right for this example only. Print each check's real Name and result.",
      },
      starter:
        'using System;\n\npublic class Check\n{\n    public string Name = "";\n    public bool Passed;\n}\npublic class Report\n{\n    public void Print(Check[] checks)\n    {\n        // TODO: print "{Name}: PASS" when Passed, otherwise "{Name}: FAIL"\n    }\n}\nclass Program\n{\n    static void Main()\n    {\n        var checks = new Check[]\n        {\n            new Check { Name = "login", Passed = true },\n            new Check { Name = "logout", Passed = false },\n        };\n        new Report().Print(checks);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Check\n{\n    public string Name = "";\n    public bool Passed;\n}\npublic class Report\n{\n    public void Print(Check[] checks)\n    {\n        foreach (var c in checks)\n        {\n            string status = c.Passed ? "PASS" : "FAIL";\n            Console.WriteLine($"{c.Name}: {status}");\n        }\n    }\n}\nclass Program\n{\n    static void Main()\n    {\n        var checks = new Check[]\n        {\n            new Check { Name = "login", Passed = true },\n            new Check { Name = "logout", Passed = false },\n        };\n        new Report().Print(checks);\n    }\n}\n',
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "wu",
    metaLabel: "Bridge: Wiring It Up",
    progressNoun: "Build",
    awardedKey: "wiring_it_up_awarded",
    awardAmount: 25,
    tasks,
  };
})();
