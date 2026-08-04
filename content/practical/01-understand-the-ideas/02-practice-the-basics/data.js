// Practice the Basics - the bridge between Foundations and Control Flow.
// A code-lab write-and-run build lesson (build-engine.js reads
// window.LESSON_CONFIG). Foundations gave you values, variables and objects.
// Here you compute with them, join text, and - the bridge - ask yes/no
// questions with comparisons that produce a bool. Control Flow then acts on
// those answers. No if/else or loops yet.
(function () {
  "use strict";

  const tasks = [
    {
      example: "int a = 6;\nint b = 4;\nConsole.WriteLine(a + b);   // 10\nConsole.WriteLine(a * b);   // 24",
      expected: "12",
      requireSource: [
        {
          pattern: /int\s+apples\s*=\s*3\s*;/,
          message: "Declare `int apples = 3;`."
        },
        {
          pattern: /int\s+baskets\s*=\s*4\s*;/,
          message: "Declare `int baskets = 4;`."
        },
        {
          pattern: /apples\s*\*\s*baskets|baskets\s*\*\s*apples/,
          message: "Multiply the two variables: `apples * baskets`."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: int apples = 3, int baskets = 4, then print apples * baskets\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int apples = 3;\n        int baskets = 4;\n        Console.WriteLine(apples * baskets);\n    }\n}\n"
    },
    {
      example: "string first = \"Ada\";\nConsole.WriteLine(\"Hello, \" + first);   // Hello, Ada",
      expected: "Good dog, Rex",
      requireSource: [
        {
          pattern: /string\s+name\s*=\s*"Rex"\s*;/,
          message: "Declare `string name = \"Rex\";`."
        },
        {
          pattern: /"Good dog, "\s*\+\s*name/,
          message: "Join the pieces: `\"Good dog, \" + name`."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: string name = \"Rex\", then print \"Good dog, \" + name\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        string name = \"Rex\";\n        Console.WriteLine(\"Good dog, \" + name);\n    }\n}\n"
    },
    {
      example: "int score = 70;\nbool passed = score >= 50;\nConsole.WriteLine(passed);   // True",
      expected: "True",
      requireSource: [
        {
          pattern: /int\s+age\s*=\s*20\s*;/,
          message: "Declare `int age = 20;`."
        },
        {
          pattern: /bool\s+isAdult\s*=\s*age\s*>=\s*18/,
          message: "Compare and store: `bool isAdult = age >= 18;`."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: int age = 20, then bool isAdult = age >= 18, then print isAdult\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int age = 20;\n        bool isAdult = age >= 18;\n        Console.WriteLine(isAdult);\n    }\n}\n"
    },
    {
      example: "class Bottle\n{\n    public int Fill = 0;            // state\n    public bool IsEmpty()          // behaviour\n    {\n        return Fill == 0;\n    }\n}\n// var b = new Bottle();  b.IsEmpty() is True",
      expected: "True",
      requireSource: [
        {
          pattern: /class\s+Thermostat/,
          message: "Keep the `Thermostat` class."
        },
        {
          pattern: /Temp\s*=\s*30\s*;/,
          message: "Set the state: `Temp = 30;`."
        },
        {
          pattern: /return\s+Temp\s*>\s*25\s*;/,
          message: "Answer with a comparison: `return Temp > 25;`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Thermostat cold = new Thermostat();\n        cold.Temp = 10;\n        Console.WriteLine(cold.IsHot());\n    }\n}\n",
        expected: "False",
        message: "IsHot must decide from Temp. A Thermostat at 10 is not hot."
      },
      starter: "using System;\n\nclass Thermostat\n{\n    public int Temp = 0;   // TODO: set Temp to 30\n\n    public bool IsHot()\n    {\n        // TODO: return whether Temp is greater than 25\n        return false;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Thermostat t = new Thermostat();\n        Console.WriteLine(t.IsHot());\n    }\n}\n",
      solution: "using System;\n\nclass Thermostat\n{\n    public int Temp = 30;\n\n    public bool IsHot()\n    {\n        return Temp > 25;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Thermostat t = new Thermostat();\n        Console.WriteLine(t.IsHot());\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "l1c",
    metaLabel: "Understand the ideas · Practice the Basics",
    progressNoun: "Step",
    awardedKey: "level1_coding_awarded",
    awardAmount: 20,
    tasks,
  };
})();
