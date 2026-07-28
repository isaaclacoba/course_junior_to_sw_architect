// Unit 2 - "C# up close": Arrays. Write-from-scratch builds.
// Data only: build-engine.js reads window.BUILD_CONFIG (loaded after this file).
// Teaches the portable idea - a fixed-size, ordered sequence you index into,
// measure and walk over - with C# arrays as the surface.
// Culture-safe: never prints a raw double/decimal; every task prints ints,
// strings or booleans. Arithmetic stays in int arrays so a sum is a plain int.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Read by position",
      concept: "Index into an array",
      context:
        "An **array** is a fixed-size, ordered row of values - like numbered lockers, each holding one item. You reach an item by its **position**, counting from `0`: the first item is `names[0]`, the second is `names[1]`.\n\nWrite a `Kennel` whose `First(string[] names)` hands back the name in the first locker.",
      example:
        "public class Shelf\n{\n    public string Top(string[] titles)\n    {\n        return titles[0];\n    }\n}",
      goal: [
        "Give `Kennel` a `string First(string[] names)` that returns the item at position `0`.",
        "`Main` calls `First` with `\"Rex\"`, `\"Milo\"`, `\"Bella\"`, so the output is `Rex`.",
      ],
      expected: "Rex",
      requireSource: [
        { pattern: /string\s*\[\s*\]/, message: "Take a `string[] names` - an array of names." },
        { pattern: /names\s*\[/, message: "Index into the array: `names[0]` is the first item." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        System.Console.WriteLine(kennel.First(new[] { "Ada", "Bo" }));\n    }\n}\n',
        expected: "Ada",
        message: "`First` must read the array it is given - a kennel starting with \"Ada\" should return `Ada`, not a fixed name.",
      },
      starter:
        'using System;\n\npublic class Kennel\n{\n    public string First(string[] names)\n    {\n        // TODO: return the name in the first position\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        Console.WriteLine(kennel.First(new[] { "Rex", "Milo", "Bella" }));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Kennel\n{\n    public string First(string[] names)\n    {\n        return names[0];\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        Console.WriteLine(kennel.First(new[] { "Rex", "Milo", "Bella" }));\n    }\n}\n',
    },
    {
      title: "How many items",
      concept: "Measure an array's length",
      context:
        "Every array knows its own size - how many lockers it has. The idea is the same in any language: ask the sequence how many items it holds. In C# you read it with `.Length`.\n\nWrite a `Tally` whose `Count(int[] xs)` returns how many numbers are in the array.",
      example:
        "public class Box\n{\n    public int Size(int[] items)\n    {\n        return items.Length;\n    }\n}",
      goal: [
        "Give `Tally` an `int Count(int[] xs)` that returns `xs.Length`.",
        "`Main` calls `Count` with five numbers, so the output is `5`.",
      ],
      expected: "5",
      requireSource: [
        { pattern: /int\s*\[\s*\]/, message: "Take an `int[] xs` - an array of numbers." },
        { pattern: /\.Length/, message: "Ask the array how many items it holds with `xs.Length`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var tally = new Tally();\n        System.Console.WriteLine(tally.Count(new[] { 1, 2 }));\n    }\n}\n',
        expected: "2",
        message: "`Count` must measure the array it is given - two items should return `2`, not a fixed count.",
      },
      starter:
        'using System;\n\npublic class Tally\n{\n    public int Count(int[] xs)\n    {\n        // TODO: return how many items the array holds\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tally = new Tally();\n        Console.WriteLine(tally.Count(new[] { 4, 8, 15, 16, 23 }));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Tally\n{\n    public int Count(int[] xs)\n    {\n        return xs.Length;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tally = new Tally();\n        Console.WriteLine(tally.Count(new[] { 4, 8, 15, 16, 23 }));\n    }\n}\n',
    },
    {
      title: "Add them up",
      concept: "Walk an array with foreach",
      context:
        "To use every item, you **walk** the array from start to end. A `foreach` loop hands you each item in turn, so you can add them up as you go - a running total that grows one item at a time.\n\nWrite a `Meter` whose `Sum(int[] xs)` walks the array and returns the total.",
      example:
        "public class Wallet\n{\n    public int Total(int[] coins)\n    {\n        int total = 0;\n        foreach (int c in coins)\n        {\n            total = total + c;\n        }\n        return total;\n    }\n}",
      goal: [
        "Give `Meter` an `int Sum(int[] xs)` that walks `xs` with a `foreach` loop and adds each item.",
        "`Main` calls `Sum` with `2`, `3`, `5`, so the output is `10`.",
      ],
      expected: "10",
      requireSource: [
        { pattern: /foreach/, message: "Walk the array with a `foreach` loop." },
        { pattern: /int\s+Sum\s*\(\s*int\s*\[\s*\]/, message: "Give `Meter` an `int Sum(int[] xs)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var meter = new Meter();\n        System.Console.WriteLine(meter.Sum(new[] { 10, 20 }));\n    }\n}\n',
        expected: "30",
        message: "`Sum` must add up the array it is given - `10` and `20` should total `30`, not a fixed value.",
      },
      starter:
        'using System;\n\npublic class Meter\n{\n    public int Sum(int[] xs)\n    {\n        // TODO: walk xs with foreach and add each item into a running total\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var meter = new Meter();\n        Console.WriteLine(meter.Sum(new[] { 2, 3, 5 }));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Meter\n{\n    public int Sum(int[] xs)\n    {\n        int total = 0;\n        foreach (int x in xs)\n        {\n            total = total + x;\n        }\n        return total;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var meter = new Meter();\n        Console.WriteLine(meter.Sum(new[] { 2, 3, 5 }));\n    }\n}\n',
    },
    {
      title: "Count the big ones",
      concept: "Walk an array and decide",
      context:
        "Walking an array is not only for adding - you can **decide** something about each item as you pass it. Test each one, and count the ones that pass.\n\nWrite a `Sieve` whose `HowManyBig(int[] xs)` walks the array and returns how many items are greater than `10`.",
      example:
        "public class Filter\n{\n    public int HowManySmall(int[] xs)\n    {\n        int n = 0;\n        foreach (int x in xs)\n        {\n            if (x < 5)\n            {\n                n = n + 1;\n            }\n        }\n        return n;\n    }\n}",
      goal: [
        "Give `Sieve` an `int HowManyBig(int[] xs)` that walks `xs` and counts the items greater than `10`.",
        "`Main` calls `HowManyBig` with `3`, `20`, `7`, `50`, so the output is `2`.",
      ],
      expected: "2",
      requireSource: [
        { pattern: /foreach|for\s*\(/, message: "Walk the array with a loop." },
        { pattern: />/, message: "Test each item against `10` with a `>` comparison." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var sieve = new Sieve();\n        System.Console.WriteLine(sieve.HowManyBig(new[] { 100, 1, 2, 3 }));\n    }\n}\n',
        expected: "1",
        message: "`HowManyBig` must test the array it is given - only `100` is over `10` here, so the answer is `1`.",
      },
      starter:
        'using System;\n\npublic class Sieve\n{\n    public int HowManyBig(int[] xs)\n    {\n        // TODO: walk xs and count the items greater than 10\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var sieve = new Sieve();\n        Console.WriteLine(sieve.HowManyBig(new[] { 3, 20, 7, 50 }));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Sieve\n{\n    public int HowManyBig(int[] xs)\n    {\n        int count = 0;\n        foreach (int x in xs)\n        {\n            if (x > 10)\n            {\n                count = count + 1;\n            }\n        }\n        return count;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var sieve = new Sieve();\n        Console.WriteLine(sieve.HowManyBig(new[] { 3, 20, 7, 50 }));\n    }\n}\n',
    },
    {
      title: "Split text into pieces",
      concept: "Text into an array with Split",
      context:
        "Text often hides a sequence inside it - `\"cat,dog,fish\"` is really three items joined by commas. `Split` cuts the text at each separator and hands back a `string[]` you can measure and walk, just like any array you build by hand.\n\nWrite a `Line` whose `Pieces(string csv)` returns how many comma-separated items the text holds.",
      example:
        "public class Sentence\n{\n    public int Words(string text)\n    {\n        return text.Split(' ').Length;\n    }\n}",
      goal: [
        "Give `Line` an `int Pieces(string csv)` that splits `csv` on `','` and returns the count of pieces.",
        "`Main` calls `Pieces(\"cat,dog,fish\")`, so the output is `3`.",
      ],
      expected: "3",
      requireSource: [
        { pattern: /\.Split\s*\(/, message: "Cut the text into pieces with `csv.Split(',')`." },
        { pattern: /\.Length/, message: "Count the pieces with `.Length`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var line = new Line();\n        System.Console.WriteLine(line.Pieces("a,b"));\n    }\n}\n',
        expected: "2",
        message: "`Pieces` must split the text it is given - `\"a,b\"` holds two items, so the answer is `2`.",
      },
      starter:
        'using System;\n\npublic class Line\n{\n    public int Pieces(string csv)\n    {\n        // TODO: split csv on \',\' and return how many pieces it holds\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var line = new Line();\n        Console.WriteLine(line.Pieces("cat,dog,fish"));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Line\n{\n    public int Pieces(string csv)\n    {\n        return csv.Split(\',\').Length;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var line = new Line();\n        Console.WriteLine(line.Pieces("cat,dog,fish"));\n    }\n}\n',
    },
    {
      summary: true,
      title: "What you learned",
      concept: "Working with a fixed-size sequence",
      context: "Five everyday moves on an array - the ordered row of values you reach for whenever you have more than one of something.",
      summaryIntro:
        "An array holds many values in a fixed, ordered row. You reached into it, measured it, walked it and built one from text:",
      summaryItems: [
        { title: "Read by position - ", text: "`names[0]` reaches the item in the first locker; positions count from `0`." },
        { title: "How many items - ", text: "`xs.Length` asks the array how many values it holds." },
        { title: "Add them up - ", text: "a `foreach` loop hands you each item in turn, so you can total them as you walk." },
        { title: "Walk and decide - ", text: "test each item as you pass it and count the ones that pass." },
        { title: "Split text into pieces - ", text: "`csv.Split(',')` turns text into a `string[]` you can measure and walk like any other array." },
      ],
      summaryClose:
        "An array's size is fixed once you make it. When you need a row that grows or shrinks, you will reach for a list next - but every move you just learned carries straight over.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "arr",
    metaLabel: "Everyday essentials \u00b7 Arrays",
    progressNoun: "Step",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "arrays_awarded",
    awardAmount: 20,
  };
})();
