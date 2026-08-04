// Control Flow - write-and-run practice with the control-flow tools: if/else,
// boolean logic, while, for, foreach with break/continue, and switch. Each card
// asks for a small working method. Part 1, after Practice the Basics. Data only:
// the controller lives in build-engine.js, which reads window.LESSON_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "int temperature = 30;\nif (temperature >= 40)\n{\n    Console.WriteLine(\"hot\");\n}\nelse if (temperature >= 20)\n{\n    Console.WriteLine(\"warm\");\n}\nelse\n{\n    Console.WriteLine(\"cold\");\n}",
      expected: "warn",
      requireSource: [
        {
          pattern: /\bif\b/,
          message: "Use an `if` / `else` chain to choose the level."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var triage = new Triage();\n        Console.WriteLine(triage.Level(0));\n    }\n}\n",
        expected: "clean",
        message: "warn is right for this example only. Decide from the real error count, not a fixed word."
      },
      starter: "using System;\n\npublic class Triage\n{\n    public string Level(int errors)\n    {\n        // TODO: \"critical\" when errors >= 10, \"warn\" when errors >= 1, otherwise \"clean\"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var triage = new Triage();\n        Console.WriteLine(triage.Level(3));\n    }\n}\n",
      solution: "using System;\n\npublic class Triage\n{\n    public string Level(int errors)\n    {\n        if (errors >= 10)\n        {\n            return \"critical\";\n        }\n        else if (errors >= 1)\n        {\n            return \"warn\";\n        }\n        else\n        {\n            return \"clean\";\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var triage = new Triage();\n        Console.WriteLine(triage.Level(3));\n    }\n}\n"
    },
    {
      example: "bool paid = false;\nbool trial = true;\nbool locked = false;\nif ((paid || trial) && !locked)\n{\n    Console.WriteLine(\"access\");\n}\nelse\n{\n    Console.WriteLine(\"blocked\");\n}",
      expected: "allow",
      requireSource: [
        {
          pattern: /&&/,
          message: "Join the checks with `&&`."
        },
        {
          pattern: /\|\|/,
          message: "Accept either path with `||`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var gate = new AccessControl();\n        Console.WriteLine(gate.Decide(true, 15, true));\n    }\n}\n",
        expected: "deny",
        message: "allow is right for this example only. A banned user must be denied - combine the real flags."
      },
      starter: "using System;\n\npublic class AccessControl\n{\n    public string Decide(bool member, int age, bool banned)\n    {\n        // TODO: \"allow\" when (member or age >= 18) and not banned, otherwise \"deny\"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new AccessControl();\n        Console.WriteLine(gate.Decide(false, 20, false));\n    }\n}\n",
      solution: "using System;\n\npublic class AccessControl\n{\n    public string Decide(bool member, int age, bool banned)\n    {\n        if ((member || age >= 18) && !banned)\n        {\n            return \"allow\";\n        }\n        return \"deny\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new AccessControl();\n        Console.WriteLine(gate.Decide(false, 20, false));\n    }\n}\n"
    },
    {
      example: "int count = 3;\nwhile (count > 0)\n{\n    Console.WriteLine(count);\n    count--;\n}",
      expected: [
        "3",
        "2",
        "1",
        "liftoff"
      ],
      requireSource: [
        {
          pattern: /\bwhile\b/,
          message: "Count down with a `while` loop."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        new Countdown().From(2);\n    }\n}\n",
        expected: [
          "2",
          "1",
          "liftoff"
        ],
        message: "Those lines are right for this example only. Loop from whatever number you are given."
      },
      starter: "using System;\n\npublic class Countdown\n{\n    public void From(int count)\n    {\n        // TODO: print count, then count - 1, ... down to 1, then \"liftoff\"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        new Countdown().From(3);\n    }\n}\n",
      solution: "using System;\n\npublic class Countdown\n{\n    public void From(int count)\n    {\n        while (count >= 1)\n        {\n            Console.WriteLine(count);\n            count--;\n        }\n        Console.WriteLine(\"liftoff\");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        new Countdown().From(3);\n    }\n}\n"
    },
    {
      example: "string[] colors = { \"red\", \"green\" };\nfor (int i = 0; i < colors.Length; i++)\n{\n    Console.WriteLine((i + 1) + \": \" + colors[i]);\n}",
      expected: [
        "1. login",
        "2. logout"
      ],
      requireSource: [
        {
          pattern: /\bfor\s*\(/,
          message: "Use a `for` loop with an index counter."
        },
        {
          pattern: /\.\s*Length/,
          message: "Use `items.Length` to know when to stop."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        string[] items = { \"a\", \"b\", \"c\" };\n        new Numbering().List(items);\n    }\n}\n",
        expected: [
          "1. a",
          "2. b",
          "3. c"
        ],
        message: "Right for this example only. Number whatever items you are given with the index."
      },
      starter: "using System;\n\npublic class Numbering\n{\n    public void List(string[] items)\n    {\n        // TODO: print each item with its 1-based position, like \"1. login\"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        string[] items = { \"login\", \"logout\" };\n        new Numbering().List(items);\n    }\n}\n",
      solution: "using System;\n\npublic class Numbering\n{\n    public void List(string[] items)\n    {\n        for (int i = 0; i < items.Length; i++)\n        {\n            Console.WriteLine((i + 1) + \". \" + items[i]);\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        string[] items = { \"login\", \"logout\" };\n        new Numbering().List(items);\n    }\n}\n"
    },
    {
      example: "foreach (var line in lines)\n{\n    if (line == \"\") continue;\n    if (line == \"END\") break;\n    Console.WriteLine(line);\n}",
      expected: [
        "a",
        "b"
      ],
      requireSource: [
        {
          pattern: /foreach/,
          message: "Walk the steps with a `foreach` loop."
        },
        {
          pattern: /\bcontinue\b/,
          message: "Skip a step with `continue`."
        },
        {
          pattern: /\bbreak\b/,
          message: "Stop early with `break`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        string[] steps = { \"skip\", \"x\", \"stop\", \"y\" };\n        new Scanner().Run(steps);\n    }\n}\n",
        expected: "x",
        message: "Right for this example only. Skip and stop based on the real step values."
      },
      starter: "using System;\n\npublic class Scanner\n{\n    public void Run(string[] steps)\n    {\n        // TODO: continue past \"skip\", break at \"stop\", otherwise print the step\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        string[] steps = { \"a\", \"skip\", \"b\", \"stop\", \"c\" };\n        new Scanner().Run(steps);\n    }\n}\n",
      solution: "using System;\n\npublic class Scanner\n{\n    public void Run(string[] steps)\n    {\n        foreach (string step in steps)\n        {\n            if (step == \"skip\")\n            {\n                continue;\n            }\n            if (step == \"stop\")\n            {\n                break;\n            }\n            Console.WriteLine(step);\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        string[] steps = { \"a\", \"skip\", \"b\", \"stop\", \"c\" };\n        new Scanner().Run(steps);\n    }\n}\n"
    },
    {
      example: "switch (grade)\n{\n    case \"A\":\n        Console.WriteLine(\"great\");\n        break;\n    default:\n        Console.WriteLine(\"retry\");\n        break;\n}",
      expected: [
        "low",
        "high",
        "?"
      ],
      requireSource: [
        {
          pattern: /\bswitch\b/,
          message: "Map each code with a `switch`."
        },
        {
          pattern: /foreach/,
          message: "Apply it to every code with a `foreach`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        int[] codes = { 2, 2 };\n        new Labeler().Describe(codes);\n    }\n}\n",
        expected: [
          "mid",
          "mid"
        ],
        message: "Right for this example only. Switch on the real code values."
      },
      starter: "using System;\n\npublic class Labeler\n{\n    public void Describe(int[] codes)\n    {\n        // TODO: for each code, switch to a word: 1->\"low\", 2->\"mid\", 3->\"high\", else \"?\"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        int[] codes = { 1, 3, 9 };\n        new Labeler().Describe(codes);\n    }\n}\n",
      solution: "using System;\n\npublic class Labeler\n{\n    public void Describe(int[] codes)\n    {\n        foreach (int code in codes)\n        {\n            switch (code)\n            {\n                case 1:\n                    Console.WriteLine(\"low\");\n                    break;\n                case 2:\n                    Console.WriteLine(\"mid\");\n                    break;\n                case 3:\n                    Console.WriteLine(\"high\");\n                    break;\n                default:\n                    Console.WriteLine(\"?\");\n                    break;\n            }\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        int[] codes = { 1, 3, 9 };\n        new Labeler().Describe(codes);\n    }\n}\n"
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "cf",
    metaLabel: "Understand the ideas · Control Flow",
    progressNoun: "Step",
    awardedKey: "control_flow_awarded",
    awardAmount: 20,
    tasks,
  };
})();
