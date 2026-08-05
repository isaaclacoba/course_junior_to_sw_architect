// Part three - "Data shapes". Write-from-scratch practice, same style as First
// Builds and Wiring It Up: each card asks for a small working program, you run
// it, and the output must match. It teaches the everyday ways C# packages data:
// properties, computed properties, enums, structs (value copy) and records
// (value equality). The grader is chosen so the concept is unavoidable - a
// `class` where a `struct` or `record` is wanted prints the wrong answer.
//
// Data only: the build plugin reads
// window.LESSON_CONFIG. Light, animal-themed examples throughout.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Dog\n{\n    public string Breed { get; set; }\n}\n\nvar dog = new Dog();\ndog.Breed = \"corgi\";\nConsole.WriteLine(dog.Breed);",
      expected: "Mittens",
      requireSource: [
        {
          pattern: /\{\s*get;\s*set;\s*\}/,
          message: "Use an auto-property: `{ get; set; }`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var cat = new Cat();\n        cat.Name = \"Tom\";\n        Console.WriteLine(cat.Name);\n    }\n}\n",
        expected: "Tom",
        message: "Mittens is right for this example only. The property must store and return whatever Name is set to."
      },
      starter: "using System;\n\npublic class Cat\n{\n    // TODO: add a Name property with get and set\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat();\n        cat.Name = \"Mittens\";\n        Console.WriteLine(cat.Name);\n    }\n}\n",
      goals: [
        {
          code: [
            "class Cat",
            "string Name { get; set; }"
          ],
          gate: { type: "Cat", member: "Name" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Cat\n{\n    public string Name { get; set; } = \"\";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat();\n        cat.Name = \"Mittens\";\n        Console.WriteLine(cat.Name);\n    }\n}\n"
    },
    {
      example: "public class Square\n{\n    public int Side { get; set; }\n    public int Area => Side * Side;\n}",
      expected: "21",
      requireSource: [
        {
          pattern: /HumanYears/,
          message: "Name the computed property `HumanYears`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var dog = new Dog();\n        dog.Age = 5;\n        Console.WriteLine(dog.HumanYears);\n    }\n}\n",
        expected: "35",
        message: "21 is right for Age 3 only. Compute HumanYears from Age, do not hardcode it."
      },
      starter: "using System;\n\npublic class Dog\n{\n    // TODO: an Age property (get/set), and a read-only HumanYears => Age * 7\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var dog = new Dog();\n        dog.Age = 3;\n        Console.WriteLine(dog.HumanYears);\n    }\n}\n",
      goals: [
        {
          code: ["class Dog", "public int Age { get; set; }", "public int HumanYears => Age * 7"],
          gate: { type: "Dog", member: "HumanYears" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Dog\n{\n    public int Age { get; set; }\n    public int HumanYears => Age * 7;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var dog = new Dog();\n        dog.Age = 3;\n        Console.WriteLine(dog.HumanYears);\n    }\n}\n"
    },
    {
      example: "enum Light { Red, Green }\n\nstring Go(Light light)\n{\n    switch (light)\n    {\n        case Light.Green: return \"go\";\n        default: return \"stop\";\n    }\n}",
      expected: "feed me",
      requireSource: [
        {
          pattern: /enum\s+Mood/,
          message: "Define the options as `enum Mood { ... }`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Pet().Say(Mood.Sleepy));\n    }\n}\n",
        expected: "zzz",
        message: "feed me is right for Hungry only. Decide from the mood you are handed."
      },
      starter: "using System;\n\n// TODO: define enum Mood { Sleepy, Hungry, Playful }\n\npublic class Pet\n{\n    public string Say(Mood mood)\n    {\n        // TODO: \"zzz\" for Sleepy, \"feed me\" for Hungry, \"woof\" for Playful\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Pet().Say(Mood.Hungry));\n    }\n}\n",
      goals: [
        {
          code: ["enum Mood", "Sleepy", "Hungry", "Playful"],
          gate: { type: "Mood", member: "Hungry" }
        },
        {
          code: ["class Pet", { row: "switch (mood)", writes: "switch (mood)" }, { row: "case Mood.Sleepy: return \"zzz\";", writes: ["case Mood.Sleepy", "\"zzz\""] }, { row: "case Mood.Hungry: return \"feed me\";", writes: ["case Mood.Hungry", "\"feed me\""] }, { row: "default: return \"woof\";", writes: ["default", "\"woof\""] }],
          gate: { type: "Pet", member: "Say" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic enum Mood { Sleepy, Hungry, Playful }\n\npublic class Pet\n{\n    public string Say(Mood mood)\n    {\n        switch (mood)\n        {\n            case Mood.Sleepy: return \"zzz\";\n            case Mood.Hungry: return \"feed me\";\n            default: return \"woof\";\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Pet().Say(Mood.Hungry));\n    }\n}\n"
    },
    {
      example: "struct Point { public int X; }\n\nvar original = new Point();\noriginal.X = 1;\nvar copy = original;   // copy\ncopy.X = 9;\nConsole.WriteLine(original.X);  // still 1",
      expected: "3",
      requireSource: [
        {
          pattern: /struct\s+Treats/,
          message: "Make `Treats` a `struct`, not a class."
        }
      ],
      starter: "using System;\n\n// TODO: define Treats as a struct with a public int Count field\n\nclass Program\n{\n    static void Main()\n    {\n        var bowl = new Treats();\n        bowl.Count = 3;\n\n        var copy = bowl;   // a struct copies here\n        copy.Count = 99;   // change only the copy\n\n        Console.WriteLine(bowl.Count);\n    }\n}\n",
      goals: [
        {
          code: [
            "struct Treats",
            "int Count"
          ],
          gate: { type: "Treats", member: "Count", kind: "struct" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic struct Treats\n{\n    public int Count;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var bowl = new Treats();\n        bowl.Count = 3;\n\n        var copy = bowl;   // a struct copies here\n        copy.Count = 99;   // change only the copy\n\n        Console.WriteLine(bowl.Count);\n    }\n}\n"
    },
    {
      example: "record Color(string Name);\n\nvar first = new Color(\"red\");\nvar second = new Color(\"red\");\nConsole.WriteLine(first == second);  // True",
      expected: "True",
      requireSource: [
        {
          pattern: /record\s+Animal/,
          message: "Define `Animal` as a `record`, not a class."
        }
      ],
      starter: "using System;\n\n// TODO: define record Animal(string Name, int Legs);\n\nclass Program\n{\n    static void Main()\n    {\n        var first = new Animal(\"puppy\", 4);\n        var second = new Animal(\"puppy\", 4);\n        Console.WriteLine(first == second);\n    }\n}\n",
      goals: [
        {
          code: ["record Animal", "string Name", "int Legs"],
          gate: { type: "Animal", member: "Name" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic record Animal(string Name, int Legs);\n\nclass Program\n{\n    static void Main()\n    {\n        var first = new Animal(\"puppy\", 4);\n        var second = new Animal(\"puppy\", 4);\n        Console.WriteLine(first == second);\n    }\n}\n"
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "ds",
    metaLabel: "Know the language · Data shapes",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "data_shapes_awarded",
    awardAmount: 25,
  };
})();
