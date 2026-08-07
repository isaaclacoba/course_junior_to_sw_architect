// Part one, Constructors. Data only; the engine is the build plugin, which
// reads window.LESSON_CONFIG (loaded after this file).
//
// Pacing rule: one idea per card, and every card is the same two questions -
// what did the caller hand in, and where did it end up. Card 1 stores one value,
// card 2 shows the store is per-object, card 3 adds a second slot so position
// matters, card 4 separates what the object keeps from what a call is handed,
// and card 5 lets the constructor work something out instead of only copying.
(function () {
  "use strict";

  const tasks = [
    {
      expected: "Ana",
      requireSource: [
        {
          pattern: /public\s+Cat\s*\(/,
          message: "Write the constructor as `public Cat(string name)` - same name as the class, and no return type."
        },
        {
          pattern: /_name\s*=\s*name/,
          message: "Store the value that was handed in: `_name = name;`."
        }
      ],
      goals: [
        {
          code: [
            "class Cat",
            "Cat(string name)",
            { row: "store it with `_name = name`", writes: "_name = name" }
          ],
          gate: { type: "Cat", member: "Name" }
        },
        { gate: null }
      ],
      starter: "using System;\n\nclass Cat\n{\n    private string _name = \"\";\n\n    // TODO: add a constructor that takes a name and stores it in _name\n\n    public string Name()\n    {\n        return _name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat cat = new Cat(\"Ana\");\n        Console.WriteLine(cat.Name());\n    }\n}\n",
      solution: "using System;\n\nclass Cat\n{\n    private string _name = \"\";\n\n    public Cat(string name)\n    {\n        _name = name;\n    }\n\n    public string Name()\n    {\n        return _name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat cat = new Cat(\"Ana\");\n        Console.WriteLine(cat.Name());\n    }\n}\n"
    },
    {
      expected: ["Ana", "Katya"],
      requireSource: [
        {
          pattern: /new\s+Cat\s*\([^)]*\)[\s\S]*new\s+Cat\s*\(/,
          message: "Build a second cat with `new Cat(\"Katya\")` - one `new` makes one object."
        }
      ],
      goals: [
        {
          code: [
            "class Program",
            { row: "build a second cat", writes: 'new Cat("Katya")' },
            { row: "print both names", writes: "second.Name()" }
          ],
          gate: null
        }
      ],
      starter: "using System;\n\nclass Cat\n{\n    private string _name = \"\";\n\n    public Cat(string name)\n    {\n        _name = name;\n    }\n\n    public string Name()\n    {\n        return _name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat first = new Cat(\"Ana\");\n        // TODO: build a second cat called Katya, and print both names\n\n        Console.WriteLine(first.Name());\n    }\n}\n",
      solution: "using System;\n\nclass Cat\n{\n    private string _name = \"\";\n\n    public Cat(string name)\n    {\n        _name = name;\n    }\n\n    public string Name()\n    {\n        return _name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat first = new Cat(\"Ana\");\n        Cat second = new Cat(\"Katya\");\n\n        Console.WriteLine(first.Name());\n        Console.WriteLine(second.Name());\n    }\n}\n"
    },
    {
      expected: "Ana is 8",
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Cat cat = new Cat(\"Katya\", 3);\n        Console.WriteLine(cat.Describe());\n    }\n}\n",
        expected: "Katya is 3",
        message: "`Ana is 8` is right for that one cat. Your `Cat` has to describe whichever name and age it was built with."
      },
      requireSource: [
        {
          pattern: /_age\s*=\s*age/,
          message: "Store the age too: `_age = age;`."
        }
      ],
      goals: [
        {
          code: [
            "class Cat",
            { row: "store the name", writes: "_name = name" },
            { row: "store the age", writes: "_age = age" }
          ],
          gate: { type: "Cat", member: "Describe" }
        },
        { gate: null }
      ],
      starter: "using System;\n\nclass Cat\n{\n    private string _name = \"\";\n    private int _age;\n\n    public Cat(string name, int age)\n    {\n        // TODO: store both values, each in its own field\n    }\n\n    public string Describe()\n    {\n        return _name + \" is \" + _age;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat cat = new Cat(\"Ana\", 8);\n        Console.WriteLine(cat.Describe());\n    }\n}\n",
      solution: "using System;\n\nclass Cat\n{\n    private string _name = \"\";\n    private int _age;\n\n    public Cat(string name, int age)\n    {\n        _name = name;\n        _age = age;\n    }\n\n    public string Describe()\n    {\n        return _name + \" is \" + _age;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat cat = new Cat(\"Ana\", 8);\n        Console.WriteLine(cat.Describe());\n    }\n}\n"
    },
    {
      expected: "Ana hungry",
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Cat cat = new Cat(\"Katya\", 2);\n        Console.WriteLine(cat.Report(6));\n    }\n}\n",
        expected: "Katya fed",
        message: "A cat fed 2 hours ago is not hungry yet. Compare the two numbers rather than always answering `hungry`."
      },
      requireSource: [
        {
          pattern: /hoursUntilHungry/,
          message: "Decide with the `hoursUntilHungry` the call handed in, not with a number you typed."
        },
        {
          pattern: /_hoursSinceMeal/,
          message: "The other half of the comparison is what the cat kept: `_hoursSinceMeal`."
        }
      ],
      goals: [
        {
          code: [
            "class Cat",
            { row: "compare the two", writes: "_hoursSinceMeal >= hoursUntilHungry" },
            { row: "say `hungry` or `fed`", writes: '" hungry"' }
          ],
          gate: { type: "Cat", member: "Report" }
        },
        { gate: null }
      ],
      starter: "using System;\n\nclass Cat\n{\n    private string _name = \"\";\n    private int _hoursSinceMeal;\n\n    public Cat(string name, int hoursSinceMeal)\n    {\n        _name = name;\n        _hoursSinceMeal = hoursSinceMeal;\n    }\n\n    public string Report(int hoursUntilHungry)\n    {\n        // TODO: return the name, then \" hungry\" or \" fed\", deciding with\n        //       _hoursSinceMeal and the hoursUntilHungry handed in\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat cat = new Cat(\"Ana\", 7);\n        Console.WriteLine(cat.Report(6));\n    }\n}\n",
      solution: "using System;\n\nclass Cat\n{\n    private string _name = \"\";\n    private int _hoursSinceMeal;\n\n    public Cat(string name, int hoursSinceMeal)\n    {\n        _name = name;\n        _hoursSinceMeal = hoursSinceMeal;\n    }\n\n    public string Report(int hoursUntilHungry)\n    {\n        if (_hoursSinceMeal >= hoursUntilHungry)\n        {\n            return _name + \" hungry\";\n        }\n        return _name + \" fed\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat cat = new Cat(\"Ana\", 7);\n        Console.WriteLine(cat.Report(6));\n    }\n}\n"
    },
    {
      expected: "Vigo needs 8",
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Shelter shelter = new Shelter(\"Lugo\", 5);\n        Console.WriteLine(shelter.Report());\n    }\n}\n",
        expected: "Lugo needs 10",
        message: "8 is right for 4 cats only. Work the space out from the `cats` handed in."
      },
      requireSource: [
        {
          pattern: /SpacePerCat/,
          message: "Use the named constant `SpacePerCat` rather than typing 2 again."
        },
        {
          pattern: /_spaceNeeded\s*=/,
          message: "Work the answer out in the constructor and keep it in `_spaceNeeded`."
        }
      ],
      goals: [
        {
          code: [
            "class Shelter",
            { row: "work it out once, at build time", writes: "_spaceNeeded = cats * SpacePerCat" }
          ],
          gate: { type: "Shelter", member: "Report" }
        },
        { gate: null }
      ],
      starter: "using System;\n\nclass Shelter\n{\n    private const int SpacePerCat = 2;\n\n    private string _town = \"\";\n    private int _cats;\n    private int _spaceNeeded;\n\n    public Shelter(string town, int cats)\n    {\n        _town = town;\n        _cats = cats;\n        // TODO: work out the space this shelter needs, once, here\n    }\n\n    public string Report()\n    {\n        return _town + \" needs \" + _spaceNeeded;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Shelter shelter = new Shelter(\"Vigo\", 4);\n        Console.WriteLine(shelter.Report());\n    }\n}\n",
      solution: "using System;\n\nclass Shelter\n{\n    private const int SpacePerCat = 2;\n\n    private string _town = \"\";\n    private int _cats;\n    private int _spaceNeeded;\n\n    public Shelter(string town, int cats)\n    {\n        _town = town;\n        _cats = cats;\n        _spaceNeeded = cats * SpacePerCat;\n    }\n\n    public string Report()\n    {\n        return _town + \" needs \" + _spaceNeeded;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Shelter shelter = new Shelter(\"Vigo\", 4);\n        Console.WriteLine(shelter.Report());\n    }\n}\n"
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "ctor",
    metaLabel: "Part one - Constructors",
    progressNoun: "Step",
    awardedKey: "constructors_awarded",
    awardAmount: 20,
    tasks,
  };
})();
