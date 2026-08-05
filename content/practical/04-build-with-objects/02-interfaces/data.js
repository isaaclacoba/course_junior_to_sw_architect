// Part four - "Why abstract?" (interfaces). Write-from-scratch builds: the
// learner writes the classes and the interface; only the usage in Main (and any
// collaborator that is not the focus) is given. The arc: two look-alike classes,
// a method stuck on one type, naming the promise, programming to it, and a new
// type that just fits. Verify probes re-run the learner's types differently.
// Data only: the build plugin reads window.LESSON_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Cow\n{\n    public string Speak()\n    {\n        return \"Moo\";\n    }\n}",
      expected: [
        "Meow",
        "Woof"
      ],
      requireSource: [
        {
          pattern: /class\s+Cat/,
          message: "Write a `Cat` class."
        },
        {
          pattern: /class\s+Dog/,
          message: "Write a `Dog` class."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Dog().Speak());\n        Console.WriteLine(new Cat().Speak());\n    }\n}\n",
        expected: [
          "Woof",
          "Meow"
        ],
        message: "Each animal must return its own sound, whichever order they are called in."
      },
      starter: "using System;\n\n// TODO: write two classes:\n//   - Cat, with a Speak() that returns \"Meow\"\n//   - Dog, with a Speak() that returns \"Woof\"\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Cat().Speak());\n        Console.WriteLine(new Dog().Speak());\n    }\n}\n",
      goals: [
        { code: ["class Cat", "string Speak()"], gate: { type: "Cat", member: "Speak" } },
        { code: ["class Dog", "string Speak()"], gate: { type: "Dog", member: "Speak" } },
      ],
      solution: "using System;\n\npublic class Cat\n{\n    public string Speak()\n    {\n        return \"Meow\";\n    }\n}\n\npublic class Dog\n{\n    public string Speak()\n    {\n        return \"Woof\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Cat().Speak());\n        Console.WriteLine(new Dog().Speak());\n    }\n}\n"
    },
    {
      example: "public class Host\n{\n    public string Introduce(Guest guest)\n    {\n        return \"meet \" + guest.Name();\n    }\n}",
      expected: "heard: Meow",
      requireSource: [
        {
          pattern: /class\s+Keeper/,
          message: "Write a `Keeper` class."
        },
        {
          pattern: /cat\s*\.\s*Speak\s*\(/,
          message: "Build the line from the animal: `cat.Speak()`."
        }
      ],
      starter: "using System;\n\npublic class Cat\n{\n    public string Speak() { return \"Meow\"; }\n}\n\n// TODO: write a Keeper class with a method  string Greet(Cat cat)\n//       that returns \"heard: \" followed by what the cat says.\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Cat()));\n    }\n}\n",
      goals: [
        {
          code: [
            "class Keeper",
            "string Greet(Cat cat)"
          ],
          gate: { type: "Keeper", member: "Greet" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Cat\n{\n    public string Speak() { return \"Meow\"; }\n}\n\npublic class Keeper\n{\n    public string Greet(Cat cat)\n    {\n        return \"heard: \" + cat.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Cat()));\n    }\n}\n"
    },
    {
      example: "public interface IShape\n{\n    int Area();\n}\n\npublic class Box : IShape\n{\n    public int Area() { return 4; }\n}",
      expected: "Woof",
      requireSource: [
        {
          pattern: /interface\s+IAnimal/,
          message: "Define `interface IAnimal`."
        },
        {
          pattern: /class\s+Cat\s*:\s*IAnimal/,
          message: "Make `Cat` keep the promise: `: IAnimal`."
        },
        {
          pattern: /class\s+Dog\s*:\s*IAnimal/,
          message: "Make `Dog` keep the promise: `: IAnimal`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        IAnimal animal = new Cat();\n        Console.WriteLine(animal.Speak());\n    }\n}\n",
        expected: "Meow",
        message: "Woof is right for the dog only. Each animal must keep the promise in its own way."
      },
      starter: "using System;\n\n// TODO:\n//   1) write an interface IAnimal with one method: string Speak();\n//   2) write Cat : IAnimal (Speak returns \"Meow\")\n//   3) write Dog : IAnimal (Speak returns \"Woof\")\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal animal = new Dog();\n        Console.WriteLine(animal.Speak());\n    }\n}\n",
      goals: [
        { code: ["interface IAnimal", "string Speak()"], gate: { kind: "interface", type: "IAnimal", member: "Speak" } },
        { code: ["Cat : IAnimal", "string Speak()"], gate: { type: "Cat", base: "IAnimal", member: "Speak" } },
        { gate: null },
      ],
      solution: "using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() { return \"Meow\"; }\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() { return \"Woof\"; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal animal = new Dog();\n        Console.WriteLine(animal.Speak());\n    }\n}\n"
    },
    {
      example: "public class Stage\n{\n    public string Announce(IShape shape)\n    {\n        return \"area \" + shape.Area();\n    }\n}",
      expected: "heard: Woof",
      requireSource: [
        {
          pattern: /class\s+Keeper/,
          message: "Write a `Keeper` class."
        },
        {
          pattern: /Greet\s*\(\s*IAnimal/,
          message: "Make `Greet` take an `IAnimal`, not a concrete animal."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Cat()));\n    }\n}\n",
        expected: "heard: Meow",
        message: "A cat must fit the same method. Depend on IAnimal so both animals pass through."
      },
      starter: "using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() { return \"Meow\"; }\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() { return \"Woof\"; }\n}\n\n// TODO: write a Keeper with a method  string Greet(IAnimal animal)\n//       that returns \"heard: \" followed by what the animal says.\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Dog()));\n    }\n}\n",
      goals: [
        {
          code: [
            "class Keeper",
            "string Greet(IAnimal animal)"
          ],
          gate: { type: "Keeper", member: "Greet" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() { return \"Meow\"; }\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() { return \"Woof\"; }\n}\n\npublic class Keeper\n{\n    public string Greet(IAnimal animal)\n    {\n        return \"heard: \" + animal.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Dog()));\n    }\n}\n"
    },
    {
      example: "public class Frog : IAnimal\n{\n    public string Speak()\n    {\n        return \"Ribbit\";\n    }\n}",
      expected: "heard: Hoot",
      requireSource: [
        {
          pattern: /class\s+Owl\s*:\s*IAnimal/,
          message: "Make `Owl` keep the promise: `: IAnimal`."
        }
      ],
      starter: "using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Keeper\n{\n    // Finished - do not change this.\n    public string Greet(IAnimal animal) { return \"heard: \" + animal.Speak(); }\n}\n\n// TODO: write a new Owl class that keeps the IAnimal promise\n//       and whose Speak() returns \"Hoot\".\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Owl()));\n    }\n}\n",
      goals: [
        { code: ["Owl : IAnimal", "string Speak()"], gate: { type: "Owl", base: "IAnimal", member: "Speak" } },
        { gate: null },
      ],
      solution: "using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Keeper\n{\n    public string Greet(IAnimal animal) { return \"heard: \" + animal.Speak(); }\n}\n\npublic class Owl : IAnimal\n{\n    public string Speak()\n    {\n        return \"Hoot\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Owl()));\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "iface",
    metaLabel: "Build with objects · Why abstract",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "interfaces_awarded",
    awardAmount: 25,
  };
})();
