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
      title: "A helper that needs no instance",
      concept: "A static method",
      context:
        "Some behaviour does not belong to any one object - it belongs to the **type**. Doubling a number needs no particular zoo; any caller can just ask the type to do it. A `static` method lives on the class, so you call it as `Zoo.Double(3)` - no `new`, no instance.\n\nGive `Zoo` a `static int Double(int n)` that returns `n` twice.",
      example:
        "public class MathBits\n{\n    public static int Square(int n)\n    {\n        return n * n;\n    }\n}\n\n// called as: MathBits.Square(4)",
      goal: [
        "Give `Zoo` a `static int Double(int n)` that returns `n + n`.",
        "`Main` calls `Zoo.Double(3)` on the type - no `new` - so the output is `6`.",
      ],
      expected: "6",
      requireSource: [
        { pattern: /\bstatic\b/, message: "Mark the method `static` so it belongs to the type, not an instance." },
        { pattern: /static\s+int\s+Double\s*\(\s*int/, message: "Give `Zoo` a `static int Double(int n)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        System.Console.WriteLine(Zoo.Double(5));\n    }\n}\n',
        expected: "10",
        message: "`Double` must work off the number it is given - `5` should come back as `10`, not a fixed `6`.",
      },
      starter:
        'using System;\n\npublic class Zoo\n{\n    // TODO: make Double a static method (so it can be called as Zoo.Double(n)),\n    // and return n added to itself\n    public int Double(int n)\n    {\n        return n;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Double(3));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Zoo\n{\n    public static int Double(int n)\n    {\n        return n + n;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(Zoo.Double(3));\n    }\n}\n',
    },
    {
      title: "A value that never changes",
      concept: "A const",
      context:
        "A dog has four legs - that number is fixed, and nothing in the program should ever change it. A `const` is a named value set once, at the point you write it, and never again. You give it a clear name instead of scattering the bare number `4` through your code.\n\nGive `Herd` a `const int LegsPerCow = 4` and a `int Legs(int cows)` that returns the total number of legs.",
      example:
        "public class Week\n{\n    public const int Days = 7;\n\n    public int Total(int weeks)\n    {\n        return weeks * Days;\n    }\n}",
      goal: [
        "Give `Herd` a `const int LegsPerCow = 4`.",
        "Give `Herd` a `int Legs(int cows)` that returns `cows * LegsPerCow`.",
        "`Main` calls `Legs(3)`, so the output is `12`.",
      ],
      expected: "12",
      requireSource: [
        { pattern: /\bconst\b/, message: "Declare the leg count as a `const` so it cannot be changed." },
        { pattern: /const\s+int\s+LegsPerCow\s*=\s*4/, message: "Add `public const int LegsPerCow = 4;` to `Herd`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var herd = new Herd();\n        System.Console.WriteLine(herd.Legs(5));\n    }\n}\n',
        expected: "20",
        message: "`Legs` must use the count it is given - `5` cows have `20` legs, not a fixed `12`.",
      },
      starter:
        'using System;\n\npublic class Herd\n{\n    // TODO: declare a const int LegsPerCow = 4\n\n    public int Legs(int cows)\n    {\n        // TODO: return cows multiplied by LegsPerCow\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var herd = new Herd();\n        Console.WriteLine(herd.Legs(3));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Herd\n{\n    public const int LegsPerCow = 4;\n\n    public int Legs(int cows)\n    {\n        return cows * LegsPerCow;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var herd = new Herd();\n        Console.WriteLine(herd.Legs(3));\n    }\n}\n',
    },
    {
      title: "Set once, then fixed",
      concept: "A readonly field",
      context:
        "Sometimes a value is not known until you build the object, but once set it should never change. A cat gets its name when it is created, and it keeps that name for life. A `readonly` field can be assigned in the constructor and nowhere else - the compiler stops any later reassignment.\n\nGive `Cat` a `readonly` name field, set in the constructor, and a `Name()` that returns it.",
      example:
        "public class Badge\n{\n    private readonly string _id;\n\n    public Badge(string id)\n    {\n        _id = id;\n    }\n\n    public string Id()\n    {\n        return _id;\n    }\n}",
      goal: [
        "Give `Cat` a `private readonly string _name;` field.",
        "Set `_name` in the constructor `Cat(string name)`.",
        "Give `Cat` a `string Name()` that returns `_name`.",
        "`Main` builds `new Cat(\"Milo\")` and prints `Name()`, so the output is `Milo`.",
      ],
      expected: "Milo",
      requireSource: [
        { pattern: /\breadonly\b/, message: "Make the name field `readonly` so it can only be set in the constructor." },
        { pattern: /readonly\s+string\s+_name/, message: "Add a `private readonly string _name;` field to `Cat`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var cat = new Cat("Whiskers");\n        System.Console.WriteLine(cat.Name());\n    }\n}\n',
        expected: "Whiskers",
        message: "`Name` must return the name the cat was built with - a cat made as \"Whiskers\" should read `Whiskers`, not a fixed `Milo`.",
      },
      starter:
        'using System;\n\npublic class Cat\n{\n    // TODO: add a private readonly string _name field\n    private string _name = "";\n\n    public Cat(string name)\n    {\n        // TODO: store name in the readonly field\n    }\n\n    public string Name()\n    {\n        return _name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat("Milo");\n        Console.WriteLine(cat.Name());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    private readonly string _name;\n\n    public Cat(string name)\n    {\n        _name = name;\n    }\n\n    public string Name()\n    {\n        return _name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat("Milo");\n        Console.WriteLine(cat.Name());\n    }\n}\n',
    },
    {
      title: "One value the whole type shares",
      concept: "A static field",
      context:
        "Each `new` object gets its own fields. But sometimes you want one value shared across every instance - a tally that all objects add to. A `static` field belongs to the type, not to any one object, so there is a single copy. Count each sheep as it is built, and every sheep sees the same total.\n\nGive `Sheep` a `static` counter that goes up by one in the constructor, read through a `static int Count()`.",
      example:
        "public class Robot\n{\n    private static int _built = 0;\n\n    public Robot()\n    {\n        _built = _built + 1;\n    }\n\n    public static int Built()\n    {\n        return _built;\n    }\n}",
      goal: [
        "Give `Sheep` a `private static int _count = 0;` field.",
        "In the constructor, add one to `_count`.",
        "Give `Sheep` a `static int Count()` that returns `_count`.",
        "`Main` builds two sheep, then prints `Sheep.Count()`, so the output is `2`.",
      ],
      expected: "2",
      requireSource: [
        { pattern: /\bstatic\b/, message: "The shared counter and the reader must be `static` - one copy for the whole type." },
        { pattern: /static\s+int\s+Count\s*\(\s*\)/, message: "Give `Sheep` a `static int Count()` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        new Sheep();\n        new Sheep();\n        new Sheep();\n        System.Console.WriteLine(Sheep.Count());\n    }\n}\n',
        expected: "3",
        message: "The counter must rise with each sheep built - three sheep should read `3`, not a fixed `2`.",
      },
      starter:
        'using System;\n\npublic class Sheep\n{\n    private static int _count = 0;\n\n    public Sheep()\n    {\n        // TODO: add one to the shared _count\n    }\n\n    public static int Count()\n    {\n        // TODO: return the shared _count\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        new Sheep();\n        new Sheep();\n        Console.WriteLine(Sheep.Count());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Sheep\n{\n    private static int _count = 0;\n\n    public Sheep()\n    {\n        _count = _count + 1;\n    }\n\n    public static int Count()\n    {\n        return _count;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        new Sheep();\n        new Sheep();\n        Console.WriteLine(Sheep.Count());\n    }\n}\n',
    },
    {
      summary: true,
      title: "What you learned",
      concept: "Type-level and constant values",
      context: "Four ways a value or a method can belong to the type itself, or be fixed for good.",
      summaryIntro:
        "Not everything belongs to a single object. Some behaviour and data sit on the type, and some values never change. You wrote each one by hand:",
      summaryItems: [
        { title: "A static method - ", text: "behaviour that needs no instance; you call `Zoo.Double(3)` on the type, with no `new`." },
        { title: "A const - ", text: "a named value fixed where you write it - `const int LegsPerCow = 4` - so the number has a name and can never change." },
        { title: "A readonly field - ", text: "set once in the constructor and never again; a `Cat` keeps the name it was built with for life." },
        { title: "A static field - ", text: "one copy shared by every instance; a `static` counter lets each new sheep add to the same total." },
      ],
      summaryClose:
        "The idea is portable: `const` and `readonly` say a value will not change, and `static` says something belongs to the type rather than to one object. Other languages spell these differently, but the three ideas are the same everywhere.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "cm",
    metaLabel: "Everyday essentials \u00b7 Type-level and constant values",
    progressNoun: "Step",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "class_members_awarded",
    awardAmount: 20,
  };
})();
