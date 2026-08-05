// Part four - "Why inject?" (dependency injection). Write-from-scratch builds: the
// learner writes the Keeper class themselves. The arc: newing a tool inside,
// the moment that bites, receiving it through the constructor, depending on an
// interface, and handing in a toy stand-in. Verify probes re-run the learner's
// type differently. Data only: window.LESSON_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public string Use()\n{\n    var tool = new Hammer();\n    return tool.Hit();\n}",
      expected: "Meow",
      requireSource: [
        {
          pattern: /class\s+Keeper/,
          message: "Write a `Keeper` class."
        },
        {
          pattern: /new\s+Cat\s*\(/,
          message: "Build a `new Cat()` inside Greet."
        }
      ],
      starter: "using System;\n\npublic class Cat\n{\n    public string Speak() { return \"Meow\"; }\n}\n\n// TODO: write a Keeper with a Greet() that builds a new Cat inside\n//       and returns what it says.\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n",
      goals: [
        {
          code: [
            "class Keeper",
            "string Greet()"
          ],
          gate: { type: "Keeper", member: "Greet" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Cat\n{\n    public string Speak() { return \"Meow\"; }\n}\n\npublic class Keeper\n{\n    public string Greet()\n    {\n        var pet = new Cat();\n        return pet.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n"
    },
    {
      example: "public string Use()\n{\n    var tool = new Drill();\n    return tool.Spin();\n}",
      expected: "Woof",
      requireSource: [
        {
          pattern: /class\s+Keeper/,
          message: "Write a `Keeper` class."
        },
        {
          pattern: /new\s+Dog\s*\(/,
          message: "Build a `new Dog()` inside Greet for now."
        }
      ],
      starter: "using System;\n\npublic class Dog\n{\n    public string Speak() { return \"Woof\"; }\n}\n\n// TODO: write a Keeper with a Greet() that builds a new Dog inside\n//       and returns what it says.\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n",
      goals: [
        {
          code: [
            "class Keeper",
            "string Greet()"
          ],
          gate: { type: "Keeper", member: "Greet" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Dog\n{\n    public string Speak() { return \"Woof\"; }\n}\n\npublic class Keeper\n{\n    public string Greet()\n    {\n        var pet = new Dog();\n        return pet.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n"
    },
    {
      example: "public class Walker\n{\n    private readonly Dog _dog;\n    public Walker(Dog dog) { _dog = dog; }\n}",
      expected: "Woof",
      requireSource: [
        {
          pattern: /class\s+Keeper/,
          message: "Write a `Keeper` class."
        },
        {
          pattern: /Keeper\s*\(\s*Dog/,
          message: "Take a `Dog` in the constructor."
        }
      ],
      starter: "using System;\n\npublic class Dog\n{\n    public string Speak() { return \"Woof\"; }\n}\n\n// TODO: write a Keeper that:\n//   - takes a Dog in its constructor and stores it in a field\n//   - Greet(): returns the kept dog's Speak()\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Dog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n",
      goals: [
        {
          code: [
            "class Keeper",
            "Dog _dog",
            "Keeper(Dog dog)",
            "string Greet()"
          ],
          gate: { type: "Keeper", member: "_dog" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Dog\n{\n    public string Speak() { return \"Woof\"; }\n}\n\npublic class Keeper\n{\n    private readonly Dog _dog;\n\n    public Keeper(Dog dog)\n    {\n        _dog = dog;\n    }\n\n    public string Greet()\n    {\n        return _dog.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Dog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n"
    },
    {
      example: "public class Player\n{\n    private readonly IInstrument _i;\n    public Player(IInstrument instrument)\n    {\n        _i = instrument;\n    }\n}",
      expected: "Meow",
      requireSource: [
        {
          pattern: /class\s+Keeper/,
          message: "Write a `Keeper` class."
        },
        {
          pattern: /Keeper\s*\(\s*IAnimal/,
          message: "Take an `IAnimal` in the constructor, not a concrete animal."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Dog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n",
        expected: "Woof",
        message: "A dog must fit the same keeper. Depend on IAnimal so any animal can be injected."
      },
      starter: "using System;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return \"Meow\"; } }\npublic class Dog : IAnimal { public string Speak() { return \"Woof\"; } }\n\n// TODO: write a Keeper that:\n//   - takes an IAnimal in its constructor and stores it\n//   - Greet(): returns the animal's Speak()\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Cat());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n",
      goals: [
        {
          code: [
            "class Keeper",
            "IAnimal _animal",
            "Keeper(IAnimal animal)",
            "string Greet()"
          ],
          gate: { type: "Keeper", member: "_animal" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return \"Meow\"; } }\npublic class Dog : IAnimal { public string Speak() { return \"Woof\"; } }\n\npublic class Keeper\n{\n    private readonly IAnimal _animal;\n\n    public Keeper(IAnimal animal)\n    {\n        _animal = animal;\n    }\n\n    public string Greet()\n    {\n        return _animal.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Cat());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n"
    },
    {
      example: "public class FakeClock : IClock\n{\n    public int Hour()\n    {\n        return 9;\n    }\n}",
      expected: "rehearsal ok",
      requireSource: [
        {
          pattern: /class\s+ToyDog\s*:\s*IAnimal/,
          message: "Make `ToyDog` keep the promise: `: IAnimal`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new ToyDog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n",
        expected: "squeak",
        message: "The keeper must use the stand-in it is handed, so a ToyDog makes Greet say squeak."
      },
      starter: "using System;\n\npublic interface IAnimal { string Speak(); }\n\npublic class Keeper\n{\n    private readonly IAnimal _animal;\n    public Keeper(IAnimal animal) { _animal = animal; }\n    public string Greet() { return _animal.Speak(); }\n}\n\n// TODO: write a ToyDog that keeps the IAnimal promise\n//       and whose Speak() always returns \"squeak\".\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new ToyDog());\n        string sound = keeper.Greet();\n        Console.WriteLine(sound == \"squeak\" ? \"rehearsal ok\" : \"rehearsal off\");\n    }\n}\n",
      goals: [
        { code: ["ToyDog : IAnimal", "string Speak()"], gate: { type: "ToyDog", base: "IAnimal", member: "Speak" } },
        { gate: null },
      ],
      solution: "using System;\n\npublic interface IAnimal { string Speak(); }\n\npublic class Keeper\n{\n    private readonly IAnimal _animal;\n    public Keeper(IAnimal animal) { _animal = animal; }\n    public string Greet() { return _animal.Speak(); }\n}\n\npublic class ToyDog : IAnimal\n{\n    public string Speak()\n    {\n        return \"squeak\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new ToyDog());\n        string sound = keeper.Greet();\n        Console.WriteLine(sound == \"squeak\" ? \"rehearsal ok\" : \"rehearsal off\");\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "di",
    metaLabel: "Build with objects · Why inject",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "dependency_injection_awarded",
    awardAmount: 25,
  };
})();
