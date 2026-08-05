// Part four - "Why objects?" (encapsulation). Write-from-scratch builds: the
// learner writes the class themselves; only the usage in Main is given. The five
// tasks build the case for objects - hold related data together, put behaviour
// with it, hide the inside, guard a rule, then change that rule in one place.
// A verify probe re-runs the learner's own type with different values, so a
// hardcoded answer fails. Data only: the build plugin reads window.LESSON_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Dog\n{\n    public string Name = \"\";\n    public int Legs;\n}",
      expected: "Mittens: True",
      requireSource: [
        {
          pattern: /class\s+Cat/,
          message: "Write a `Cat` class of your own."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var cat = new Cat { Name = \"Smudge\", KnockedSomethingOver = false };\n        Console.WriteLine(cat.Name + \": \" + cat.KnockedSomethingOver);\n    }\n}\n",
        expected: "Smudge: False",
        message: "Mittens: True is right for that one cat only. Your Cat must hold whatever Name and flag it is given."
      },
      starter: "using System;\n\n// TODO: write a Cat class that holds two pieces of data:\n//   - a Name (string)\n//   - a KnockedSomethingOver (bool)\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat { Name = \"Mittens\", KnockedSomethingOver = true };\n        Console.WriteLine(cat.Name + \": \" + cat.KnockedSomethingOver);\n    }\n}\n",
      goals: [
        {
          code: [
            "class Cat",
            "string Name",
            "bool KnockedSomethingOver"
          ],
          gate: { type: "Cat", member: "Name" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Cat\n{\n    public string Name = \"\";\n    public bool KnockedSomethingOver;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat { Name = \"Mittens\", KnockedSomethingOver = true };\n        Console.WriteLine(cat.Name + \": \" + cat.KnockedSomethingOver);\n    }\n}\n"
    },
    {
      example: "public class Dog\n{\n    public string Name = \"\";\n    public string Greet()\n    {\n        return Name + \" says woof\";\n    }\n}",
      expected: "Mittens: guilty",
      requireSource: [
        {
          pattern: /string\s+Verdict\s*\(/,
          message: "Write a `Verdict()` method that returns a string."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var cat = new Cat { Name = \"Smudge\", KnockedSomethingOver = false };\n        Console.WriteLine(cat.Verdict());\n    }\n}\n",
        expected: "Smudge: innocent",
        message: "Mittens: guilty is right for a guilty cat only. Decide the verdict from the flag, do not hardcode it."
      },
      starter: "using System;\n\npublic class Cat\n{\n    public string Name = \"\";\n    public bool KnockedSomethingOver;\n\n    // TODO: write a Verdict() method.\n    // It returns Name, then \": guilty\" if KnockedSomethingOver is true,\n    // otherwise \": innocent\".\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat { Name = \"Mittens\", KnockedSomethingOver = true };\n        Console.WriteLine(cat.Verdict());\n    }\n}\n",
      goals: [
        {
          code: [
            "class Cat",
            "string Verdict()"
          ],
          gate: { type: "Cat", member: "Verdict" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Cat\n{\n    public string Name = \"\";\n    public bool KnockedSomethingOver;\n\n    public string Verdict()\n    {\n        if (KnockedSomethingOver)\n        {\n            return Name + \": guilty\";\n        }\n        return Name + \": innocent\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat { Name = \"Mittens\", KnockedSomethingOver = true };\n        Console.WriteLine(cat.Verdict());\n    }\n}\n"
    },
    {
      example: "public class Clicks\n{\n    private int _n;\n    public void Click() { _n++; }\n    public int Total() { return _n; }\n}",
      expected: "2",
      requireSource: [
        {
          pattern: /class\s+ScoreBoard/,
          message: "Write a `ScoreBoard` class."
        },
        {
          pattern: /private/,
          message: "Keep the count `private` so only ScoreBoard can change it."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var board = new ScoreBoard();\n        board.Give(true);\n        board.Give(false);\n        board.Give(true);\n        board.Give(true);\n        Console.WriteLine(board.Total());\n    }\n}\n",
        expected: "3",
        message: "2 is right for the first example only. Count the good boys you are actually given."
      },
      starter: "using System;\n\n// TODO: write a ScoreBoard class.\n//   - keep a private count of treats\n//   - Give(bool goodBoy): add one only when goodBoy is true\n//   - Total(): return how many treats so far\n// Keeping the count private means only ScoreBoard can change it.\n\nclass Program\n{\n    static void Main()\n    {\n        var board = new ScoreBoard();\n        board.Give(true);\n        board.Give(true);\n        board.Give(false);\n        Console.WriteLine(board.Total());\n    }\n}\n",
      goals: [
        {
          code: [
            "class ScoreBoard",
            "int _treats",
            "void Give(bool goodBoy)",
            "int Total()"
          ],
          gate: { type: "ScoreBoard", member: "_treats" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class ScoreBoard\n{\n    private int _treats;\n\n    public void Give(bool goodBoy)\n    {\n        if (goodBoy) _treats++;\n    }\n\n    public int Total()\n    {\n        return _treats;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var board = new ScoreBoard();\n        board.Give(true);\n        board.Give(true);\n        board.Give(false);\n        Console.WriteLine(board.Total());\n    }\n}\n"
    },
    {
      example: "public class Jar\n{\n    private int _treats;\n    public void Add(int amount) { if (amount > 0) _treats += amount; }\n    public int Treats() { return _treats; }\n}",
      expected: "13",
      requireSource: [
        {
          pattern: /class\s+Bowl/,
          message: "Write a `Bowl` class."
        },
        {
          pattern: /private/,
          message: "Keep the food count `private`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var bowl = new Bowl();\n        bowl.Fill(100);\n        bowl.Fill(-1);\n        bowl.Fill(0);\n        bowl.Fill(50);\n        Console.WriteLine(bowl.Amount());\n    }\n}\n",
        expected: "150",
        message: "13 is right for the first example only. Add every positive amount and ignore the rest."
      },
      starter: "using System;\n\n// TODO: write a Bowl class.\n//   - keep a private amount of food\n//   - Fill(int scoops): add scoops, but ignore 0 or less\n//   - Amount(): return the food in the bowl\n\nclass Program\n{\n    static void Main()\n    {\n        var bowl = new Bowl();\n        bowl.Fill(10);\n        bowl.Fill(-5);   // nonsense - must be ignored\n        bowl.Fill(3);\n        Console.WriteLine(bowl.Amount());\n    }\n}\n",
      goals: [
        {
          code: [
            "class Bowl",
            "int _food",
            "void Fill(int scoops)",
            "int Amount()"
          ],
          gate: { type: "Bowl", member: "_food" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Bowl\n{\n    private int _food;\n\n    public void Fill(int scoops)\n    {\n        if (scoops > 0) _food += scoops;\n    }\n\n    public int Amount()\n    {\n        return _food;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var bowl = new Bowl();\n        bowl.Fill(10);\n        bowl.Fill(-5);   // nonsense - must be ignored\n        bowl.Fill(3);\n        Console.WriteLine(bowl.Amount());\n    }\n}\n"
    },
    {
      example: "public class Square\n{\n    private int _side;\n    public Square(int side) { _side = side; }\n    public int Area()\n    {\n        return _side * _side;\n    }\n}",
      expected: [
        "8",
        "6"
      ],
      requireSource: [
        {
          pattern: /class\s+Cat/,
          message: "Write the `Cat` class."
        },
        {
          pattern: /private/,
          message: "Keep the used-lives count `private` - the outside should not touch it."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var firstCat = new Cat(0);\n        var secondCat = new Cat(9);\n        var thirdCat = new Cat(4);\n        Console.WriteLine(firstCat.LivesLeft());\n        Console.WriteLine(secondCat.LivesLeft());\n        Console.WriteLine(thirdCat.LivesLeft());\n    }\n}\n",
        expected: [
          "9",
          "0",
          "5"
        ],
        message: "Right for the first example only. Compute 9 - used for whatever each cat is given."
      },
      starter: "using System;\n\n// TODO: a cat has nine lives. Write a Cat class that:\n//   - is told how many lives are used in its constructor\n//   - keeps that count in a private field (the outside cannot touch it)\n//   - has a LivesLeft() that returns 9 - used\n// Main builds cats and asks each how many lives are left.\n\nclass Program\n{\n    static void Main()\n    {\n        var firstCat = new Cat(1);\n        var secondCat = new Cat(3);\n        Console.WriteLine(firstCat.LivesLeft());\n        Console.WriteLine(secondCat.LivesLeft());\n    }\n}\n",
      goals: [
        {
          code: [
            "class Cat",
            "int _used",
            "Cat(int used)",
            "int LivesLeft()"
          ],
          gate: { type: "Cat", member: "_used" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Cat\n{\n    private int _used;\n\n    public Cat(int used)\n    {\n        _used = used;\n    }\n\n    public int LivesLeft()\n    {\n        return 9 - _used;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var firstCat = new Cat(1);\n        var secondCat = new Cat(3);\n        Console.WriteLine(firstCat.LivesLeft());\n        Console.WriteLine(secondCat.LivesLeft());\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "enc",
    metaLabel: "Build with objects · Why objects",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "encapsulation_awarded",
    awardAmount: 25,
  };
})();
