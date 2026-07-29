// Practice the Basics - the bridge between Foundations and Control Flow.
// A code-lab write-and-run build lesson (build-engine.js reads
// window.BUILD_CONFIG). Foundations gave you values, variables and objects.
// Here you compute with them, join text, and - the bridge - ask yes/no
// questions with comparisons that produce a bool. Control Flow then acts on
// those answers. No if/else or loops yet.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Do math with variables",
      concept: "Arithmetic",
      context:
        "You can compute with values using the arithmetic operators:\n\n- `+` - add\n- `-` - subtract\n- `*` - multiply\n- `/` - divide\n\nCombine variables and you get a new value back.",
      example:
        "int a = 6;\nint b = 4;\nConsole.WriteLine(a + b);   // 10\nConsole.WriteLine(a * b);   // 24",
      goal: [
        "Make `int apples = 3` and `int baskets = 4`.",
        "Print `apples * baskets`. The output should be 12.",
      ],
      expected: "12",
      requireSource: [
        { pattern: /int\s+apples\s*=\s*3\s*;/, message: "Declare `int apples = 3;`." },
        { pattern: /int\s+baskets\s*=\s*4\s*;/, message: "Declare `int baskets = 4;`." },
        { pattern: /apples\s*\*\s*baskets|baskets\s*\*\s*apples/, message: "Multiply the two variables: `apples * baskets`." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: int apples = 3, int baskets = 4, then print apples * baskets\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int apples = 3;\n        int baskets = 4;\n        Console.WriteLine(apples * baskets);\n    }\n}\n',
    },
    {
      title: "Join text",
      concept: "Concatenation",
      context:
        "`+` also joins strings end to end - this is called concatenation. `\"Hi, \" + name` builds one string from two pieces. You can join a number onto a string too; it becomes text.",
      example:
        'string first = "Ada";\nConsole.WriteLine("Hello, " + first);   // Hello, Ada',
      goal: [
        "Make `string name = \"Rex\"`.",
        "Print `\"Good dog, \" + name`. The output should be Good dog, Rex.",
      ],
      expected: "Good dog, Rex",
      requireSource: [
        { pattern: /string\s+name\s*=\s*"Rex"\s*;/, message: "Declare `string name = \"Rex\";`." },
        { pattern: /"Good dog, "\s*\+\s*name/, message: "Join the pieces: `\"Good dog, \" + name`." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: string name = "Rex", then print "Good dog, " + name\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        string name = "Rex";\n        Console.WriteLine("Good dog, " + name);\n    }\n}\n',
    },
    {
      title: "Ask a yes/no question",
      concept: "Comparisons",
      context:
        "A **comparison** asks a yes/no question and gives back a `bool`:\n\n- `==` - equal\n- `!=` - not equal\n- `>` `<` `>=` `<=` - greater / less than (or equal to)\n\nSo `age >= 18` is `true` when age is 18 or more. Watch the difference: `==` compares, a single `=` stores.",
      example:
        "int score = 70;\nbool passed = score >= 50;\nConsole.WriteLine(passed);   // True",
      goal: [
        "Make `int age = 20`.",
        "Make `bool isAdult = age >= 18`, then print `isAdult`. The output should be True.",
      ],
      expected: "True",
      requireSource: [
        { pattern: /int\s+age\s*=\s*20\s*;/, message: "Declare `int age = 20;`." },
        { pattern: /bool\s+isAdult\s*=\s*age\s*>=\s*18/, message: "Compare and store: `bool isAdult = age >= 18;`." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: int age = 20, then bool isAdult = age >= 18, then print isAdult\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int age = 20;\n        bool isAdult = age >= 18;\n        Console.WriteLine(isAdult);\n    }\n}\n',
    },
    {
      title: "An object that answers about itself",
      concept: "State + a question",
      context:
        "Put state and a comparison together. A `Thermostat` knows its `Temp` (state) and can answer `IsHot()` (behaviour) by comparing that state. The method returns the `bool` a comparison produces - an object reporting something about itself.",
      example:
        'class Bottle\n{\n    public int Fill = 0;            // state\n    public bool IsEmpty()          // behaviour\n    {\n        return Fill == 0;\n    }\n}\n// var b = new Bottle();  b.IsEmpty() is True',
      goal: [
        "Give `Thermostat` its state: set `Temp` to `30`.",
        "Make `IsHot()` return whether `Temp` is greater than `25`.",
        "`Main` builds one and prints `IsHot()`. The output should be True.",
      ],
      expected: "True",
      requireSource: [
        { pattern: /class\s+Thermostat/, message: "Keep the `Thermostat` class." },
        { pattern: /Temp\s*=\s*30\s*;/, message: "Set the state: `Temp = 30;`." },
        { pattern: /return\s+Temp\s*>\s*25\s*;/, message: "Answer with a comparison: `return Temp > 25;`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Thermostat cold = new Thermostat();\n        cold.Temp = 10;\n        Console.WriteLine(cold.IsHot());\n    }\n}\n',
        expected: "False",
        message: "IsHot must decide from Temp. A Thermostat at 10 is not hot.",
      },
      starter:
        'using System;\n\nclass Thermostat\n{\n    public int Temp = 0;   // TODO: set Temp to 30\n\n    public bool IsHot()\n    {\n        // TODO: return whether Temp is greater than 25\n        return false;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Thermostat t = new Thermostat();\n        Console.WriteLine(t.IsHot());\n    }\n}\n',
      solution:
        'using System;\n\nclass Thermostat\n{\n    public int Temp = 30;\n\n    public bool IsHot()\n    {\n        return Temp > 25;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Thermostat t = new Thermostat();\n        Console.WriteLine(t.IsHot());\n    }\n}\n',
    },
    {
      title: "Practice the Basics recap",
      concept: "Recap",
      summary: true,
      summaryIntro:
        "You put the Foundations pieces to work and reached the doorway to Control Flow.",
      summaryItems: [
        { title: "Arithmetic - ", text: "`+ - * /` compute a new value from existing ones." },
        { title: "Concatenation - ", text: "`+` joins strings (and numbers) into one string." },
        { title: "Comparison - ", text: "`==` `!=` `>` `<` `>=` `<=` ask a yes/no question and return a `bool`." },
        { title: "An object that answers - ", text: "state plus a method that returns a `bool` about that state." },
      ],
      summaryClose:
        "Next: Control Flow - use these yes/no answers to decide what your program does.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "l1c",
    metaLabel: "Understand the ideas \u00b7 Practice the Basics",
    progressNoun: "Step",
    awardedKey: "level1_coding_awarded",
    awardAmount: 20,
    tasks,
  };
})();
