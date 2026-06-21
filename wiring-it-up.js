// Wiring It Up - write-from-scratch practice that turns the Control Flow theory
// into hands-on code. Each card takes one control-flow tool (if/else, boolean
// logic, while, for, foreach with break/continue, switch) and asks for a small
// working method - a step up from filling a single blank. Data only: the
// controller lives in build-engine.js, which reads window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Branch with if / else",
      concept: "if / else",
      context:
        "An `if` / `else if` / `else` chain picks exactly one branch, top to bottom. The pattern below sorts a temperature into bands; do the same to turn an error count into a level.",
      example:
        'int temp = 30;\nif (temp >= 40)\n{\n    Console.WriteLine("hot");\n}\nelse if (temp >= 20)\n{\n    Console.WriteLine("warm");\n}\nelse\n{\n    Console.WriteLine("cold");\n}',
      goal: [
        "Return `\"critical\"` when errors is 10 or more, `\"warn\"` when it is 1 or more, otherwise `\"clean\"`.",
        "errors is 3 here, so the output should be warn.",
      ],
      expected: "warn",
      requireSource: [
        { pattern: /\bif\b/, message: "Use an `if` / `else` chain to choose the level." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var triage = new Triage();\n        Console.WriteLine(triage.Level(0));\n    }\n}\n',
        expected: "clean",
        message: "warn is right for this example only. Decide from the real error count, not a fixed word.",
      },
      starter:
        'using System;\n\npublic class Triage\n{\n    public string Level(int errors)\n    {\n        // TODO: "critical" when errors >= 10, "warn" when errors >= 1, otherwise "clean"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var triage = new Triage();\n        Console.WriteLine(triage.Level(3));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Triage\n{\n    public string Level(int errors)\n    {\n        if (errors >= 10)\n        {\n            return "critical";\n        }\n        else if (errors >= 1)\n        {\n            return "warn";\n        }\n        else\n        {\n            return "clean";\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var triage = new Triage();\n        Console.WriteLine(triage.Level(3));\n    }\n}\n',
    },
    {
      title: "Combine conditions",
      concept: "&& || !",
      context:
        "`&&` is true only when both sides are, `||` is true when either side is, and `!` flips a bool. The pattern below mixes all three; do the same to decide access.",
      example:
        'bool paid = false;\nbool trial = true;\nbool locked = false;\nif ((paid || trial) && !locked)\n{\n    Console.WriteLine("access");\n}\nelse\n{\n    Console.WriteLine("blocked");\n}',
      goal: [
        "Return `\"allow\"` when the user is a `member` or `age` is 18+, and is not `banned`; otherwise `\"deny\"`.",
        "Here age is 20 and not banned, so the output should be allow.",
      ],
      expected: "allow",
      requireSource: [
        { pattern: /&&/, message: "Join the checks with `&&`." },
        { pattern: /\|\|/, message: "Accept either path with `||`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var gate = new AccessControl();\n        Console.WriteLine(gate.Decide(true, 15, true));\n    }\n}\n',
        expected: "deny",
        message: "allow is right for this example only. A banned user must be denied - combine the real flags.",
      },
      starter:
        'using System;\n\npublic class AccessControl\n{\n    public string Decide(bool member, int age, bool banned)\n    {\n        // TODO: "allow" when (member or age >= 18) and not banned, otherwise "deny"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new AccessControl();\n        Console.WriteLine(gate.Decide(false, 20, false));\n    }\n}\n',
      solution:
        'using System;\n\npublic class AccessControl\n{\n    public string Decide(bool member, int age, bool banned)\n    {\n        if ((member || age >= 18) && !banned)\n        {\n            return "allow";\n        }\n        return "deny";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new AccessControl();\n        Console.WriteLine(gate.Decide(false, 20, false));\n    }\n}\n',
    },
    {
      title: "Repeat with while",
      concept: "while loop",
      context:
        "A `while` loop repeats while its condition holds. Step the counter with `n--` each pass or it never ends. The pattern below counts down; do the same, then print `liftoff`.",
      example:
        'int n = 3;\nwhile (n > 0)\n{\n    Console.WriteLine(n);\n    n--;\n}',
      goal: [
        "Print `n`, then `n - 1`, down to 1, then print `\"liftoff\"`.",
        "From 3 the output is four lines: 3, 2, 1, liftoff.",
      ],
      expected: ["3", "2", "1", "liftoff"],
      requireSource: [
        { pattern: /\bwhile\b/, message: "Count down with a `while` loop." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        new Countdown().From(2);\n    }\n}\n',
        expected: ["2", "1", "liftoff"],
        message: "Those lines are right for this example only. Loop from whatever number you are given.",
      },
      starter:
        'using System;\n\npublic class Countdown\n{\n    public void From(int n)\n    {\n        // TODO: print n, then n - 1, ... down to 1, then "liftoff"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        new Countdown().From(3);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Countdown\n{\n    public void From(int n)\n    {\n        while (n >= 1)\n        {\n            Console.WriteLine(n);\n            n--;\n        }\n        Console.WriteLine("liftoff");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        new Countdown().From(3);\n    }\n}\n',
    },
    {
      title: "Count with for",
      concept: "for loop",
      context:
        "A `for` loop gives you an index, so you can number items or reach positions. The header is `for (start; condition; step)` and `i++` advances the index. Do the same to number each item.",
      example:
        'string[] colors = { "red", "green" };\nfor (int i = 0; i < colors.Length; i++)\n{\n    Console.WriteLine($"{i + 1}: {colors[i]}");\n}',
      goal: [
        "Print each item with its 1-based position, like `\"1. login\"`.",
        "For login then logout the output is: 1. login then 2. logout.",
      ],
      expected: ["1. login", "2. logout"],
      requireSource: [
        { pattern: /\bfor\s*\(/, message: "Use a `for` loop with an index counter." },
        { pattern: /\.\s*Length/, message: "Use `items.Length` to know when to stop." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        string[] items = { "a", "b", "c" };\n        new Numbering().List(items);\n    }\n}\n',
        expected: ["1. a", "2. b", "3. c"],
        message: "Right for this example only. Number whatever items you are given with the index.",
      },
      starter:
        'using System;\n\npublic class Numbering\n{\n    public void List(string[] items)\n    {\n        // TODO: print each item with its 1-based position, like "1. login"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        string[] items = { "login", "logout" };\n        new Numbering().List(items);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Numbering\n{\n    public void List(string[] items)\n    {\n        for (int i = 0; i < items.Length; i++)\n        {\n            Console.WriteLine($"{i + 1}. {items[i]}");\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        string[] items = { "login", "logout" };\n        new Numbering().List(items);\n    }\n}\n',
    },
    {
      title: "Skip and stop with foreach",
      concept: "foreach + break / continue",
      context:
        "Inside a `foreach`, `continue` jumps to the next item and `break` ends the loop. The pattern below prints lines, skipping blanks and stopping at `END`; do the same with skip and stop.",
      example:
        'foreach (var line in lines)\n{\n    if (line == "") continue;\n    if (line == "END") break;\n    Console.WriteLine(line);\n}',
      goal: [
        "Walk the steps: `continue` past a `\"skip\"`, `break` at a `\"stop\"`, otherwise print the step.",
        "For a, skip, b, stop, c the output is just: a then b.",
      ],
      expected: ["a", "b"],
      requireSource: [
        { pattern: /foreach/, message: "Walk the steps with a `foreach` loop." },
        { pattern: /\bcontinue\b/, message: "Skip a step with `continue`." },
        { pattern: /\bbreak\b/, message: "Stop early with `break`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        string[] steps = { "skip", "x", "stop", "y" };\n        new Scanner().Run(steps);\n    }\n}\n',
        expected: "x",
        message: "Right for this example only. Skip and stop based on the real step values.",
      },
      starter:
        'using System;\n\npublic class Scanner\n{\n    public void Run(string[] steps)\n    {\n        // TODO: continue past "skip", break at "stop", otherwise print the step\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        string[] steps = { "a", "skip", "b", "stop", "c" };\n        new Scanner().Run(steps);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Scanner\n{\n    public void Run(string[] steps)\n    {\n        foreach (var step in steps)\n        {\n            if (step == "skip")\n            {\n                continue;\n            }\n            if (step == "stop")\n            {\n                break;\n            }\n            Console.WriteLine(step);\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        string[] steps = { "a", "skip", "b", "stop", "c" };\n        new Scanner().Run(steps);\n    }\n}\n',
    },
    {
      title: "Map values with switch",
      concept: "switch",
      context:
        "A `switch` maps one value to many cases; each `case` ends with `break` and `default` catches the rest. Here you run a switch for every item with a `foreach`. Do the same to label each code.",
      example:
        'switch (grade)\n{\n    case "A":\n        Console.WriteLine("great");\n        break;\n    default:\n        Console.WriteLine("retry");\n        break;\n}',
      goal: [
        "For each code print a word: 1 -> `\"low\"`, 2 -> `\"mid\"`, 3 -> `\"high\"`, anything else -> `\"?\"`.",
        "For 1, 3, 9 the output is: low, high, ?.",
      ],
      expected: ["low", "high", "?"],
      requireSource: [
        { pattern: /\bswitch\b/, message: "Map each code with a `switch`." },
        { pattern: /foreach/, message: "Apply it to every code with a `foreach`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        int[] codes = { 2, 2 };\n        new Labeler().Describe(codes);\n    }\n}\n',
        expected: ["mid", "mid"],
        message: "Right for this example only. Switch on the real code values.",
      },
      starter:
        'using System;\n\npublic class Labeler\n{\n    public void Describe(int[] codes)\n    {\n        // TODO: for each code, switch to a word: 1->"low", 2->"mid", 3->"high", else "?"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        int[] codes = { 1, 3, 9 };\n        new Labeler().Describe(codes);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Labeler\n{\n    public void Describe(int[] codes)\n    {\n        foreach (var code in codes)\n        {\n            switch (code)\n            {\n                case 1:\n                    Console.WriteLine("low");\n                    break;\n                case 2:\n                    Console.WriteLine("mid");\n                    break;\n                case 3:\n                    Console.WriteLine("high");\n                    break;\n                default:\n                    Console.WriteLine("?");\n                    break;\n            }\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        int[] codes = { 1, 3, 9 };\n        new Labeler().Describe(codes);\n    }\n}\n',
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
