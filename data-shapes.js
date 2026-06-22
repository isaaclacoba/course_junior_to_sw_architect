// Part three - "Data shapes". Write-from-scratch practice, same style as First
// Builds and Wiring It Up: each card asks for a small working program, you run
// it, and the output must match. It teaches the everyday ways C# packages data:
// properties, computed properties, enums, structs (value copy) and records
// (value equality). The grader is chosen so the concept is unavoidable - a
// `class` where a `struct` or `record` is wanted prints the wrong answer.
//
// Data only: the controller lives in build-engine.js, which reads
// window.BUILD_CONFIG. Light, animal-themed examples throughout.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Give it a property",
      concept: "Property",
      context:
        "A property is data on an object you can read and write, with `{ get; set; }` doing the work behind the scenes. Give the `Cat` a `Name` property so the code below can set it and print it.",
      example:
        'public class Dog\n{\n    public string Breed { get; set; }\n}\n\nvar d = new Dog();\nd.Breed = "corgi";\nConsole.WriteLine(d.Breed);',
      goal: [
        "Add a `Name` property (with `get` and `set`) to `Cat` so it holds a string.",
        "Main sets Name to Mittens and prints it, so the output is Mittens.",
      ],
      expected: "Mittens",
      requireSource: [
        { pattern: /\{\s*get;\s*set;\s*\}/, message: "Use an auto-property: `{ get; set; }`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var cat = new Cat();\n        cat.Name = "Tom";\n        Console.WriteLine(cat.Name);\n    }\n}\n',
        expected: "Tom",
        message: "Mittens is right for this example only. The property must store and return whatever Name is set to.",
      },
      starter:
        'using System;\n\npublic class Cat\n{\n    // TODO: add a Name property with get and set\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat();\n        cat.Name = "Mittens";\n        Console.WriteLine(cat.Name);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Name { get; set; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat();\n        cat.Name = "Mittens";\n        Console.WriteLine(cat.Name);\n    }\n}\n',
    },
    {
      title: "A property that computes",
      concept: "Computed property",
      context:
        "A property can compute its value from other data and skip the setter. Give `Dog` an `Age`, plus a read-only `HumanYears` that returns `Age * 7`.",
      example:
        'public class Square\n{\n    public int Side { get; set; }\n    public int Area => Side * Side;\n}',
      goal: [
        "Add an `Age` property (`get`/`set`), and a read-only `HumanYears` property that returns `Age * 7`.",
        "Main sets Age to 3, so HumanYears prints 21.",
      ],
      expected: "21",
      requireSource: [
        { pattern: /HumanYears/, message: "Name the computed property `HumanYears`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var dog = new Dog();\n        dog.Age = 5;\n        Console.WriteLine(dog.HumanYears);\n    }\n}\n',
        expected: "35",
        message: "21 is right for Age 3 only. Compute HumanYears from Age, do not hardcode it.",
      },
      starter:
        'using System;\n\npublic class Dog\n{\n    // TODO: an Age property (get/set), and a read-only HumanYears => Age * 7\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var dog = new Dog();\n        dog.Age = 3;\n        Console.WriteLine(dog.HumanYears);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Dog\n{\n    public int Age { get; set; }\n    public int HumanYears => Age * 7;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var dog = new Dog();\n        dog.Age = 3;\n        Console.WriteLine(dog.HumanYears);\n    }\n}\n',
    },
    {
      title: "A fixed set of options",
      concept: "enum",
      context:
        "An `enum` is a type with a fixed set of named options - no stray strings to mistype. Define a `Mood` enum, then turn each mood into something the pet says.",
      example:
        'enum Light { Red, Green }\n\nstring Go(Light l)\n{\n    switch (l)\n    {\n        case Light.Green: return "go";\n        default: return "stop";\n    }\n}',
      goal: [
        "Define an `enum Mood` with `Sleepy`, `Hungry` and `Playful`.",
        "In `Say`, return `\"zzz\"` for Sleepy, `\"feed me\"` for Hungry, `\"woof\"` for Playful.",
        "Main calls Say(Mood.Hungry), so the output is feed me.",
      ],
      expected: "feed me",
      requireSource: [
        { pattern: /enum\s+Mood/, message: "Define the options as `enum Mood { ... }`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Pet().Say(Mood.Sleepy));\n    }\n}\n',
        expected: "zzz",
        message: "feed me is right for Hungry only. Decide from the mood you are handed.",
      },
      starter:
        'using System;\n\n// TODO: define enum Mood { Sleepy, Hungry, Playful }\n\npublic class Pet\n{\n    public string Say(Mood mood)\n    {\n        // TODO: "zzz" for Sleepy, "feed me" for Hungry, "woof" for Playful\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Pet().Say(Mood.Hungry));\n    }\n}\n',
      solution:
        'using System;\n\npublic enum Mood { Sleepy, Hungry, Playful }\n\npublic class Pet\n{\n    public string Say(Mood mood)\n    {\n        switch (mood)\n        {\n            case Mood.Sleepy: return "zzz";\n            case Mood.Hungry: return "feed me";\n            default: return "woof";\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Pet().Say(Mood.Hungry));\n    }\n}\n',
    },
    {
      title: "A value that copies",
      concept: "struct",
      context:
        "A `struct` is a value type: assigning it makes a fresh copy, so changing the copy never touches the original. (A `class` would share one object, and the original would change too.) Define `Treats` as a struct and watch the copy stay separate.",
      example:
        'struct Point { public int X; }\n\nvar a = new Point();\na.X = 1;\nvar b = a;   // copy\nb.X = 9;\nConsole.WriteLine(a.X);  // still 1',
      goal: [
        "Define `Treats` as a `struct` with a public `int Count` field.",
        "Main copies the treats, changes the copy to 99, and prints the original's Count - which should still be 3.",
      ],
      expected: "3",
      requireSource: [
        { pattern: /struct\s+Treats/, message: "Make `Treats` a `struct`, not a class." },
      ],
      starter:
        'using System;\n\n// TODO: define Treats as a struct with a public int Count field\n\nclass Program\n{\n    static void Main()\n    {\n        var bowl = new Treats();\n        bowl.Count = 3;\n\n        var copy = bowl;   // a struct copies here\n        copy.Count = 99;   // change only the copy\n\n        Console.WriteLine(bowl.Count);\n    }\n}\n',
      solution:
        'using System;\n\npublic struct Treats\n{\n    public int Count;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var bowl = new Treats();\n        bowl.Count = 3;\n\n        var copy = bowl;   // a struct copies here\n        copy.Count = 99;   // change only the copy\n\n        Console.WriteLine(bowl.Count);\n    }\n}\n',
    },
    {
      title: "Two that are equal by value",
      concept: "record",
      context:
        "A `record` is a data type that compares by value: two records with the same contents are equal. (A `class` compares by reference, so two separate objects are never equal even with identical data.) Define an `Animal` record and check two equal ones.",
      example:
        'record Color(string Name);\n\nvar a = new Color("red");\nvar b = new Color("red");\nConsole.WriteLine(a == b);  // True',
      goal: [
        "Define `record Animal(string Name, int Legs);`.",
        "Main makes two animals with the same Name and Legs and prints whether they are equal - which should be True.",
      ],
      expected: "True",
      requireSource: [
        { pattern: /record\s+Animal/, message: "Define `Animal` as a `record`, not a class." },
      ],
      starter:
        'using System;\n\n// TODO: define record Animal(string Name, int Legs);\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Animal("puppy", 4);\n        var b = new Animal("puppy", 4);\n        Console.WriteLine(a == b);\n    }\n}\n',
      solution:
        'using System;\n\npublic record Animal(string Name, int Legs);\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Animal("puppy", 4);\n        var b = new Animal("puppy", 4);\n        Console.WriteLine(a == b);\n    }\n}\n',
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "ds",
    metaLabel: "Know the language \u00b7 Data shapes",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "data_shapes_awarded",
    awardAmount: 25,
  };
})();
