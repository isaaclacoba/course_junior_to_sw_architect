// Unit 2 - "C# up close": Arrays. Write-from-scratch builds.
// Data only: the build plugin reads window.LESSON_CONFIG (loaded after this file).
// Teaches the portable idea - a fixed-size, ordered sequence you index into,
// measure and walk over - with C# arrays as the surface.
// Culture-safe: never prints a raw double/decimal; every task prints ints,
// strings or booleans. Arithmetic stays in int arrays so a sum is a plain int.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Shelf\n{\n    public string Top(string[] titles)\n    {\n        return titles[0];\n    }\n}",
      expected: "Rex",
      requireSource: [
        {
          pattern: /string\s*\[\s*\]/,
          message: "Take a `string[] names` - an array of names."
        },
        {
          pattern: /names\s*\[/,
          message: "Index into the array: `names[0]` is the first item."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        System.Console.WriteLine(kennel.First(new[] { \"Ada\", \"Bo\" }));\n    }\n}\n",
        expected: "Ada",
        message: "`First` must read the array it is given - a kennel starting with \"Ada\" should return `Ada`, not a fixed name."
      },
      starter: "using System;\n\npublic class Kennel\n{\n    public string First(string[] names)\n    {\n        // TODO: return the name in the first position\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        Console.WriteLine(kennel.First(new[] { \"Rex\", \"Milo\", \"Bella\" }));\n    }\n}\n",
      solution: "using System;\n\npublic class Kennel\n{\n    public string First(string[] names)\n    {\n        return names[0];\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        Console.WriteLine(kennel.First(new[] { \"Rex\", \"Milo\", \"Bella\" }));\n    }\n}\n"
    },
    {
      example: "public class Box\n{\n    public int Size(int[] items)\n    {\n        return items.Length;\n    }\n}",
      expected: "5",
      requireSource: [
        {
          pattern: /int\s*\[\s*\]/,
          message: "Take an `int[] xs` - an array of numbers."
        },
        {
          pattern: /\.Length/,
          message: "Ask the array how many items it holds with `xs.Length`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var tally = new Tally();\n        System.Console.WriteLine(tally.Count(new[] { 1, 2 }));\n    }\n}\n",
        expected: "2",
        message: "`Count` must measure the array it is given - two items should return `2`, not a fixed count."
      },
      starter: "using System;\n\npublic class Tally\n{\n    public int Count(int[] xs)\n    {\n        // TODO: return how many items the array holds\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tally = new Tally();\n        Console.WriteLine(tally.Count(new[] { 4, 8, 15, 16, 23 }));\n    }\n}\n",
      solution: "using System;\n\npublic class Tally\n{\n    public int Count(int[] xs)\n    {\n        return xs.Length;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tally = new Tally();\n        Console.WriteLine(tally.Count(new[] { 4, 8, 15, 16, 23 }));\n    }\n}\n"
    },
    {
      example: "public class Wallet\n{\n    public int Total(int[] coins)\n    {\n        int total = 0;\n        foreach (int c in coins)\n        {\n            total = total + c;\n        }\n        return total;\n    }\n}",
      expected: "10",
      requireSource: [
        {
          pattern: /foreach/,
          message: "Walk the array with a `foreach` loop."
        },
        {
          pattern: /int\s+Sum\s*\(\s*int\s*\[\s*\]/,
          message: "Give `Meter` an `int Sum(int[] xs)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var meter = new Meter();\n        System.Console.WriteLine(meter.Sum(new[] { 10, 20 }));\n    }\n}\n",
        expected: "30",
        message: "`Sum` must add up the array it is given - `10` and `20` should total `30`, not a fixed value."
      },
      starter: "using System;\n\npublic class Meter\n{\n    public int Sum(int[] xs)\n    {\n        // TODO: walk xs with foreach and add each item into a running total\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var meter = new Meter();\n        Console.WriteLine(meter.Sum(new[] { 2, 3, 5 }));\n    }\n}\n",
      solution: "using System;\n\npublic class Meter\n{\n    public int Sum(int[] xs)\n    {\n        int total = 0;\n        foreach (int x in xs)\n        {\n            total = total + x;\n        }\n        return total;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var meter = new Meter();\n        Console.WriteLine(meter.Sum(new[] { 2, 3, 5 }));\n    }\n}\n"
    },
    {
      example: "public class Filter\n{\n    public int HowManySmall(int[] xs)\n    {\n        int n = 0;\n        foreach (int x in xs)\n        {\n            if (x < 5)\n            {\n                n = n + 1;\n            }\n        }\n        return n;\n    }\n}",
      expected: "2",
      requireSource: [
        {
          pattern: /foreach|for\s*\(/,
          message: "Walk the array with a loop."
        },
        {
          pattern: />/,
          message: "Test each item against `10` with a `>` comparison."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var sieve = new Sieve();\n        System.Console.WriteLine(sieve.HowManyBig(new[] { 100, 1, 2, 3 }));\n    }\n}\n",
        expected: "1",
        message: "`HowManyBig` must test the array it is given - only `100` is over `10` here, so the answer is `1`."
      },
      starter: "using System;\n\npublic class Sieve\n{\n    public int HowManyBig(int[] xs)\n    {\n        // TODO: walk xs and count the items greater than 10\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var sieve = new Sieve();\n        Console.WriteLine(sieve.HowManyBig(new[] { 3, 20, 7, 50 }));\n    }\n}\n",
      solution: "using System;\n\npublic class Sieve\n{\n    public int HowManyBig(int[] xs)\n    {\n        int count = 0;\n        foreach (int x in xs)\n        {\n            if (x > 10)\n            {\n                count = count + 1;\n            }\n        }\n        return count;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var sieve = new Sieve();\n        Console.WriteLine(sieve.HowManyBig(new[] { 3, 20, 7, 50 }));\n    }\n}\n"
    },
    {
      example: "public class Sentence\n{\n    public int Words(string text)\n    {\n        return text.Split(' ').Length;\n    }\n}",
      expected: "3",
      requireSource: [
        {
          pattern: /\.Split\s*\(/,
          message: "Cut the text into pieces with `csv.Split(',')`."
        },
        {
          pattern: /\.Length/,
          message: "Count the pieces with `.Length`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var line = new Line();\n        System.Console.WriteLine(line.Pieces(\"a,b\"));\n    }\n}\n",
        expected: "2",
        message: "`Pieces` must split the text it is given - `\"a,b\"` holds two items, so the answer is `2`."
      },
      starter: "using System;\n\npublic class Line\n{\n    public int Pieces(string csv)\n    {\n        // TODO: split csv on ',' and return how many pieces it holds\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var line = new Line();\n        Console.WriteLine(line.Pieces(\"cat,dog,fish\"));\n    }\n}\n",
      solution: "using System;\n\npublic class Line\n{\n    public int Pieces(string csv)\n    {\n        return csv.Split(',').Length;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var line = new Line();\n        Console.WriteLine(line.Pieces(\"cat,dog,fish\"));\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "arr",
    metaLabel: "Everyday essentials · Arrays",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "arrays_awarded",
    awardAmount: 20,
  };
})();
