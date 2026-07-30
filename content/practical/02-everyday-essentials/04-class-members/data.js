// Unit 2 - "C# up close": static, const, and readonly. Write-from-scratch builds.
// Data only: build-engine.js reads window.BUILD_CONFIG (loaded after this file).
// Portable idea, not a keyword tour: some behaviour and data belong to the TYPE
// itself rather than to each instance, and some values are fixed once and never
// change. C# spells these `static`, `const`, and `readonly`; most languages have
// the same three ideas under other names.
// Culture-safe: every task prints ints, strings or booleans - never a raw
// double/decimal (the browser locale would pick the separator).
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class MathBits\n{\n    public static int Square(int n)\n    {\n        return n * n;\n    }\n}\n\n// called as: MathBits.Square(4)",
      expected: "6",
      requireSource: [
        {
          pattern: /\bstatic\b/,
          message: "Mark the method `static` so it belongs to the type, not an instance."
        },
        {
          pattern: /static\s+int\s+Double\s*\(\s*int/,
          message: "Give `Zoo` a `static int Double(int n)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        System.Console.WriteLine(Zoo.Double(5));\n    }\n}\n",
        expected: "10",
        message: "`Double` must work off the number it is given - `5` should come back as `10`, not a fixed `6`."
      },
      starter: "using System;\n\npublic class Zoo\n{\n    // TODO: make Double a static method (so it can be called as Zoo.Double(n)),\n    // and return n added to itself\n    public int Double(int n)\n    {\n        return n;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Double(3));\n    }\n}\n",
      solution: "using System;\n\npublic class Zoo\n{\n    public static int Double(int n)\n    {\n        return n + n;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(Zoo.Double(3));\n    }\n}\n"
    },
    {
      example: "public class Week\n{\n    public const int Days = 7;\n\n    public int Total(int weeks)\n    {\n        return weeks * Days;\n    }\n}",
      expected: "12",
      requireSource: [
        {
          pattern: /\bconst\b/,
          message: "Declare the leg count as a `const` so it cannot be changed."
        },
        {
          pattern: /const\s+int\s+LegsPerCow\s*=\s*4/,
          message: "Add `public const int LegsPerCow = 4;` to `Herd`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var herd = new Herd();\n        System.Console.WriteLine(herd.Legs(5));\n    }\n}\n",
        expected: "20",
        message: "`Legs` must use the count it is given - `5` cows have `20` legs, not a fixed `12`."
      },
      starter: "using System;\n\npublic class Herd\n{\n    // TODO: declare a const int LegsPerCow = 4\n\n    public int Legs(int cows)\n    {\n        // TODO: return cows multiplied by LegsPerCow\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var herd = new Herd();\n        Console.WriteLine(herd.Legs(3));\n    }\n}\n",
      solution: "using System;\n\npublic class Herd\n{\n    public const int LegsPerCow = 4;\n\n    public int Legs(int cows)\n    {\n        return cows * LegsPerCow;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var herd = new Herd();\n        Console.WriteLine(herd.Legs(3));\n    }\n}\n"
    },
    {
      example: "public class Badge\n{\n    private readonly string _id;\n\n    public Badge(string id)\n    {\n        _id = id;\n    }\n\n    public string Id()\n    {\n        return _id;\n    }\n}",
      expected: "Milo",
      requireSource: [
        {
          pattern: /\breadonly\b/,
          message: "Make the name field `readonly` so it can only be set in the constructor."
        },
        {
          pattern: /readonly\s+string\s+_name/,
          message: "Add a `private readonly string _name;` field to `Cat`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var cat = new Cat(\"Whiskers\");\n        System.Console.WriteLine(cat.Name());\n    }\n}\n",
        expected: "Whiskers",
        message: "`Name` must return the name the cat was built with - a cat made as \"Whiskers\" should read `Whiskers`, not a fixed `Milo`."
      },
      starter: "using System;\n\npublic class Cat\n{\n    // TODO: add a private readonly string _name field\n    private string _name = \"\";\n\n    public Cat(string name)\n    {\n        // TODO: store name in the readonly field\n    }\n\n    public string Name()\n    {\n        return _name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat(\"Milo\");\n        Console.WriteLine(cat.Name());\n    }\n}\n",
      solution: "using System;\n\npublic class Cat\n{\n    private readonly string _name;\n\n    public Cat(string name)\n    {\n        _name = name;\n    }\n\n    public string Name()\n    {\n        return _name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat(\"Milo\");\n        Console.WriteLine(cat.Name());\n    }\n}\n"
    },
    {
      example: "public class Robot\n{\n    private static int _built = 0;\n\n    public Robot()\n    {\n        _built = _built + 1;\n    }\n\n    public static int Built()\n    {\n        return _built;\n    }\n}",
      expected: "2",
      requireSource: [
        {
          pattern: /\bstatic\b/,
          message: "The shared counter and the reader must be `static` - one copy for the whole type."
        },
        {
          pattern: /static\s+int\s+Count\s*\(\s*\)/,
          message: "Give `Sheep` a `static int Count()` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        new Sheep();\n        new Sheep();\n        new Sheep();\n        System.Console.WriteLine(Sheep.Count());\n    }\n}\n",
        expected: "3",
        message: "The counter must rise with each sheep built - three sheep should read `3`, not a fixed `2`."
      },
      starter: "using System;\n\npublic class Sheep\n{\n    private static int _count = 0;\n\n    public Sheep()\n    {\n        // TODO: add one to the shared _count\n    }\n\n    public static int Count()\n    {\n        // TODO: return the shared _count\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        new Sheep();\n        new Sheep();\n        Console.WriteLine(Sheep.Count());\n    }\n}\n",
      solution: "using System;\n\npublic class Sheep\n{\n    private static int _count = 0;\n\n    public Sheep()\n    {\n        _count = _count + 1;\n    }\n\n    public static int Count()\n    {\n        return _count;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        new Sheep();\n        new Sheep();\n        Console.WriteLine(Sheep.Count());\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.BUILD_CONFIG = {
    prefix: "cm",
    metaLabel: "Everyday essentials · Type-level and constant values",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "class_members_awarded",
    awardAmount: 20,
  };
})();
