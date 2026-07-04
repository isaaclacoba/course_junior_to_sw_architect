// Part four - "Why objects?" (encapsulation). Write-from-scratch builds: the
// learner writes the class themselves; only the usage in Main is given. The five
// tasks build the case for objects - hold related data together, put behaviour
// with it, hide the inside, guard a rule, then change that rule in one place.
// A verify probe re-runs the learner's own type with different values, so a
// hardcoded answer fails. Data only: build-engine.js reads window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Write a class to hold state",
      concept: "Group state",
      context:
        "Loose variables drift apart - it is easy to print one cat's name next to another cat's mischief. A `class` ties related data into one thing. Write a `Cat` class that holds a `Name` and whether it `KnockedSomethingOver`, so they always travel together.",
      example:
        'public class Dog\n{\n    public string Name = "";\n    public int Legs;\n}',
      goal: [
        "Write a `Cat` class with a `Name` (string) and a `KnockedSomethingOver` (bool).",
        "Main builds Mittens (guilty) and prints the result, so the output is Mittens: True.",
      ],
      expected: "Mittens: True",
      requireSource: [
        { pattern: /class\s+Cat/, message: "Write a `Cat` class of your own." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Smudge", KnockedSomethingOver = false };\n        Console.WriteLine(c.Name + ": " + c.KnockedSomethingOver);\n    }\n}\n',
        expected: "Smudge: False",
        message: "Mittens: True is right for that one cat only. Your Cat must hold whatever Name and flag it is given.",
      },
      starter:
        'using System;\n\n// TODO: write a Cat class that holds two pieces of data:\n//   - a Name (string)\n//   - a KnockedSomethingOver (bool)\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Mittens", KnockedSomethingOver = true };\n        Console.WriteLine(c.Name + ": " + c.KnockedSomethingOver);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Name = "";\n    public bool KnockedSomethingOver;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Mittens", KnockedSomethingOver = true };\n        Console.WriteLine(c.Name + ": " + c.KnockedSomethingOver);\n    }\n}\n',
    },
    {
      title: "Put the behaviour with the data",
      concept: "Behaviour with state",
      context:
        "An object keeps the behaviour beside the state it needs. The `Cat` already holds its data; now give it a `Verdict()` method that turns that data into a sentence. Write the method so the cat that knows what it did also knows how to own up to it.",
      example:
        'public class Dog\n{\n    public string Name = "";\n    public string Greet()\n    {\n        return Name + " says woof";\n    }\n}',
      goal: [
        "Add a `Verdict()` method to `Cat`. It returns the `Name`, then `\": guilty\"` if it knocked something over, otherwise `\": innocent\"`.",
        "Main judges Mittens (guilty), so the output is Mittens: guilty.",
      ],
      expected: "Mittens: guilty",
      requireSource: [
        { pattern: /string\s+Verdict\s*\(/, message: "Write a `Verdict()` method that returns a string." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Smudge", KnockedSomethingOver = false };\n        Console.WriteLine(c.Verdict());\n    }\n}\n',
        expected: "Smudge: innocent",
        message: "Mittens: guilty is right for a guilty cat only. Decide the verdict from the flag, do not hardcode it.",
      },
      starter:
        'using System;\n\npublic class Cat\n{\n    public string Name = "";\n    public bool KnockedSomethingOver;\n\n    // TODO: write a Verdict() method.\n    // It returns Name, then ": guilty" if KnockedSomethingOver is true,\n    // otherwise ": innocent".\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Mittens", KnockedSomethingOver = true };\n        Console.WriteLine(c.Verdict());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Name = "";\n    public bool KnockedSomethingOver;\n\n    public string Verdict()\n    {\n        if (KnockedSomethingOver)\n        {\n            return Name + ": guilty";\n        }\n        return Name + ": innocent";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Mittens", KnockedSomethingOver = true };\n        Console.WriteLine(c.Verdict());\n    }\n}\n',
    },
    {
      title: "Hide the inside",
      concept: "private state",
      context:
        "If a count is a public field, any line anywhere can set it to nonsense. Write a `ScoreBoard` class that keeps its count `private`, so only the class itself can change it. The outside adds to it through a method and reads it through another - it can never reach in and corrupt it.",
      example:
        'public class Clicks\n{\n    private int _n;\n    public void Click() { _n++; }\n    public int Total() { return _n; }\n}',
      goal: [
        "Write a `ScoreBoard` with a `private` count, a `Give(bool goodBoy)` that adds one only when `goodBoy` is true, and a `Total()` that returns the count.",
        "Main gives to true, true, false, so the output is 2.",
      ],
      expected: "2",
      requireSource: [
        { pattern: /class\s+ScoreBoard/, message: "Write a `ScoreBoard` class." },
        { pattern: /private/, message: "Keep the count `private` so only ScoreBoard can change it." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var board = new ScoreBoard();\n        board.Give(true);\n        board.Give(false);\n        board.Give(true);\n        board.Give(true);\n        Console.WriteLine(board.Total());\n    }\n}\n',
        expected: "3",
        message: "2 is right for the first example only. Count the good boys you are actually given.",
      },
      starter:
        'using System;\n\n// TODO: write a ScoreBoard class.\n//   - keep a private count of treats\n//   - Give(bool goodBoy): add one only when goodBoy is true\n//   - Total(): return how many treats so far\n// Keeping the count private means only ScoreBoard can change it.\n\nclass Program\n{\n    static void Main()\n    {\n        var board = new ScoreBoard();\n        board.Give(true);\n        board.Give(true);\n        board.Give(false);\n        Console.WriteLine(board.Total());\n    }\n}\n',
      solution:
        'using System;\n\npublic class ScoreBoard\n{\n    private int _treats;\n\n    public void Give(bool goodBoy)\n    {\n        if (goodBoy) _treats++;\n    }\n\n    public int Total()\n    {\n        return _treats;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var board = new ScoreBoard();\n        board.Give(true);\n        board.Give(true);\n        board.Give(false);\n        Console.WriteLine(board.Total());\n    }\n}\n',
    },
    {
      title: "Guard the rule",
      concept: "Protect an invariant",
      context:
        "Hiding the field lets the class defend it. Write a `Bowl` whose food can never drop because of a silly amount: `Fill` adds scoops only when the number is positive, so a negative or zero is quietly ignored. The bowl keeps itself sensible no matter who calls it.",
      example:
        'public class Jar\n{\n    private int _treats;\n    public void Add(int n) { if (n > 0) _treats += n; }\n    public int Treats() { return _treats; }\n}',
      goal: [
        "Write a `Bowl` with a `private` food count, a `Fill(int scoops)` that ignores amounts of 0 or less, and an `Amount()` that returns the food.",
        "Main fills 10, then -5 (ignored), then 3, so the output is 13.",
      ],
      expected: "13",
      requireSource: [
        { pattern: /class\s+Bowl/, message: "Write a `Bowl` class." },
        { pattern: /private/, message: "Keep the food count `private`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var bowl = new Bowl();\n        bowl.Fill(100);\n        bowl.Fill(-1);\n        bowl.Fill(0);\n        bowl.Fill(50);\n        Console.WriteLine(bowl.Amount());\n    }\n}\n',
        expected: "150",
        message: "13 is right for the first example only. Add every positive amount and ignore the rest.",
      },
      starter:
        'using System;\n\n// TODO: write a Bowl class.\n//   - keep a private amount of food\n//   - Fill(int scoops): add scoops, but ignore 0 or less\n//   - Amount(): return the food in the bowl\n\nclass Program\n{\n    static void Main()\n    {\n        var bowl = new Bowl();\n        bowl.Fill(10);\n        bowl.Fill(-5);   // nonsense - must be ignored\n        bowl.Fill(3);\n        Console.WriteLine(bowl.Amount());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Bowl\n{\n    private int _food;\n\n    public void Fill(int scoops)\n    {\n        if (scoops > 0) _food += scoops;\n    }\n\n    public int Amount()\n    {\n        return _food;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var bowl = new Bowl();\n        bowl.Fill(10);\n        bowl.Fill(-5);   // nonsense - must be ignored\n        bowl.Fill(3);\n        Console.WriteLine(bowl.Amount());\n    }\n}\n',
    },
    {
      title: "Change it in one place",
      concept: "One reason to change",
      context:
        "By now you hide state and reach it through methods. A cat has nine lives. Write a `Cat` that is told how many lives are `used` in its constructor, keeps that count in a `private` field, and offers a `LivesLeft()` that returns `9 - used`. Main makes a couple of cats and asks each how many lives are left - the nine-lives rule lives in one private place.",
      example:
        'public class Square\n{\n    private int _side;\n    public Square(int side) { _side = side; }\n    public int Area()\n    {\n        return _side * _side;\n    }\n}',
      goal: [
        "Write a `Cat` whose constructor takes how many lives are `used`, stored in a `private` field, with a `LivesLeft()` returning `9 - used`.",
        "Main makes cats with 1 and 3 lives used, so the output is two lines: 8 then 6.",
      ],
      expected: ["8", "6"],
      requireSource: [
        { pattern: /class\s+Cat/, message: "Write the `Cat` class." },
        { pattern: /private/, message: "Keep the used-lives count `private` - the outside should not touch it." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var a = new Cat(0);\n        var b = new Cat(9);\n        var c = new Cat(4);\n        Console.WriteLine(a.LivesLeft());\n        Console.WriteLine(b.LivesLeft());\n        Console.WriteLine(c.LivesLeft());\n    }\n}\n',
        expected: ["9", "0", "5"],
        message: "Right for the first example only. Compute 9 - used for whatever each cat is given.",
      },
      starter:
        'using System;\n\n// TODO: a cat has nine lives. Write a Cat class that:\n//   - is told how many lives are used in its constructor\n//   - keeps that count in a private field (the outside cannot touch it)\n//   - has a LivesLeft() that returns 9 - used\n// Main builds cats and asks each how many lives are left.\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Cat(1);\n        var b = new Cat(3);\n        Console.WriteLine(a.LivesLeft());\n        Console.WriteLine(b.LivesLeft());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    private int _used;\n\n    public Cat(int used)\n    {\n        _used = used;\n    }\n\n    public int LivesLeft()\n    {\n        return 9 - _used;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Cat(1);\n        var b = new Cat(3);\n        Console.WriteLine(a.LivesLeft());\n        Console.WriteLine(b.LivesLeft());\n    }\n}\n',
    },
    {
      summary: true,
      title: "Why objects? - recap",
      concept: "Recap",
      context: "That is why we bother with classes and methods instead of one long Main.",
      summaryIntro:
        "Objects exist so related data and the rules that guard it live together, instead of being scattered through one giant Main.",
      summaryItems: [
        { title: "Group state - ", text: "a `class` keeps related data together as one thing." },
        { title: "Behaviour with state - ", text: "put a method next to the data it works on." },
        { title: "private - ", text: "hide a field so only the class can change it." },
        { title: "Guard the rule - ", text: "the one method that writes can reject nonsense." },
        { title: "One reason to change - ", text: "fix a rule once inside the object and every caller follows." },
      ],
      summaryClose: "Next: Why abstract? - pulling logic behind an interface.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "enc",
    metaLabel: "Build with objects \u00b7 Why objects",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "encapsulation_awarded",
    awardAmount: 25,
  };
})();
