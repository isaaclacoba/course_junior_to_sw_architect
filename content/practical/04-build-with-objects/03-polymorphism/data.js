// Part four - "Why many versions?" (polymorphism). Write-from-scratch builds: the
// learner writes the classes, the method, and the loop themselves. The arc: an
// if-per-animal method, then each animal carrying its own sound, one loop over a
// mixed list, choosing the animal at runtime, and adding one without touching the
// loop. Builds on IAnimal. Verify probes re-run the learner's types differently;
// loop-in-Main tasks are gated by requireSource. Data only: window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public string Make(string kind)\n{\n    if (kind == \"cow\") return \"Moo\";\n    if (kind == \"duck\") return \"Quack\";\n    return \"?\";\n}",
      expected: "Meow",
      requireSource: [
        {
          pattern: /class\s+Zoo/,
          message: "Write a `Zoo` class."
        },
        {
          pattern: /\bif\b/,
          message: "Decide the sound with `if` checks on the kind."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Sound(\"dog\"));\n    }\n}\n",
        expected: "Woof",
        message: "Meow is right for the cat only. Each branch must answer for the kind it is asked about."
      },
      starter: "using System;\n\n// TODO: write a Zoo class with a method  string Sound(string kind)\n//       - \"cat\"  -> \"Meow\"\n//       - \"dog\"  -> \"Woof\"\n//       - anything else -> \"?\"\n\nclass Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Sound(\"cat\"));\n    }\n}\n",
      solution: "using System;\n\npublic class Zoo\n{\n    public string Sound(string kind)\n    {\n        if (kind == \"cat\") return \"Meow\";\n        if (kind == \"dog\") return \"Woof\";\n        return \"?\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Sound(\"cat\"));\n    }\n}\n"
    },
    {
      example: "public interface IShape\n{\n    string Name();\n}\n\npublic class Box : IShape\n{\n    public string Name() { return \"box\"; }\n}\n\npublic class Ball : IShape\n{\n    public string Name() { return \"ball\"; }\n}",
      expected: [
        "Meow",
        "Woof"
      ],
      requireSource: [
        {
          pattern: /class\s+Cat\s*:\s*IAnimal/,
          message: "Make `Cat` implement `IAnimal`."
        },
        {
          pattern: /class\s+Dog\s*:\s*IAnimal/,
          message: "Make `Dog` implement `IAnimal`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        IAnimal cat = new Cat();\n        IAnimal dog = new Dog();\n        Console.WriteLine(dog.Speak());\n        Console.WriteLine(cat.Speak());\n    }\n}\n",
        expected: [
          "Woof",
          "Meow"
        ],
        message: "Each animal must return its own sound, whichever order they speak in."
      },
      starter: "using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\n// TODO: write Cat : IAnimal (Speak returns \"Meow\")\n//       and Dog : IAnimal (Speak returns \"Woof\").\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal cat = new Cat();\n        IAnimal dog = new Dog();\n        Console.WriteLine(cat.Speak());\n        Console.WriteLine(dog.Speak());\n    }\n}\n",
      solution: "using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() { return \"Meow\"; }\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() { return \"Woof\"; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal cat = new Cat();\n        IAnimal dog = new Dog();\n        Console.WriteLine(cat.Speak());\n        Console.WriteLine(dog.Speak());\n    }\n}\n"
    },
    {
      example: "var nums = new List<int> { 1, 2 };\nforeach (var number in nums)\n{\n    Console.WriteLine(number);\n}",
      expected: [
        "Meow",
        "Woof"
      ],
      requireSource: [
        {
          pattern: /List\s*<\s*IAnimal\s*>/,
          message: "Hold the animals in a `List<IAnimal>`."
        },
        {
          pattern: /foreach/,
          message: "Walk them with a single `foreach` loop."
        }
      ],
      starter: "using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return \"Meow\"; } }\npublic class Dog : IAnimal { public string Speak() { return \"Woof\"; } }\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: put a Cat and a Dog into one List<IAnimal>,\n        //       then loop the list and print what each one says.\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return \"Meow\"; } }\npublic class Dog : IAnimal { public string Speak() { return \"Woof\"; } }\n\nclass Program\n{\n    static void Main()\n    {\n        var pen = new List<IAnimal> { new Cat(), new Dog() };\n        foreach (var animal in pen)\n        {\n            Console.WriteLine(animal.Speak());\n        }\n    }\n}\n"
    },
    {
      example: "public IShape Pick(string kind)\n{\n    if (kind == \"box\") return new Box();\n    return new Circle();\n}",
      expected: "Woof",
      requireSource: [
        {
          pattern: /class\s+Shelter/,
          message: "Write a `Shelter` class."
        },
        {
          pattern: /IAnimal\s+Adopt\s*\(/,
          message: "Have `Adopt` return an `IAnimal`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        IAnimal animal = shelter.Adopt(\"cat\");\n        Console.WriteLine(animal.Speak());\n    }\n}\n",
        expected: "Meow",
        message: "Woof is right for adopting a dog only. Return the animal that matches the kind asked for."
      },
      starter: "using System;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return \"Meow\"; } }\npublic class Dog : IAnimal { public string Speak() { return \"Woof\"; } }\n\n// TODO: write a Shelter class with a method  IAnimal Adopt(string kind)\n//       that returns a new Dog for \"dog\", otherwise a new Cat.\n\nclass Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        IAnimal animal = shelter.Adopt(\"dog\");\n        Console.WriteLine(animal.Speak());\n    }\n}\n",
      solution: "using System;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return \"Meow\"; } }\npublic class Dog : IAnimal { public string Speak() { return \"Woof\"; } }\n\npublic class Shelter\n{\n    public IAnimal Adopt(string kind)\n    {\n        if (kind == \"dog\") return new Dog();\n        return new Cat();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        IAnimal animal = shelter.Adopt(\"dog\");\n        Console.WriteLine(animal.Speak());\n    }\n}\n"
    },
    {
      example: "public class Frog : IAnimal\n{\n    public string Speak()\n    {\n        return \"Ribbit\";\n    }\n}",
      expected: [
        "Meow",
        "Woof",
        "Hoot"
      ],
      requireSource: [
        {
          pattern: /class\s+Owl\s*:\s*IAnimal/,
          message: "Make `Owl` keep the promise: `: IAnimal`."
        }
      ],
      starter: "using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return \"Meow\"; } }\npublic class Dog : IAnimal { public string Speak() { return \"Woof\"; } }\n\n// TODO: write an Owl class that implements IAnimal and says \"Hoot\".\n//       The list and loop below already include an Owl - leave them as they are.\n\nclass Program\n{\n    static void Main()\n    {\n        var pen = new List<IAnimal> { new Cat(), new Dog(), new Owl() };\n        foreach (var animal in pen)\n        {\n            Console.WriteLine(animal.Speak());\n        }\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return \"Meow\"; } }\npublic class Dog : IAnimal { public string Speak() { return \"Woof\"; } }\n\npublic class Owl : IAnimal\n{\n    public string Speak()\n    {\n        return \"Hoot\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pen = new List<IAnimal> { new Cat(), new Dog(), new Owl() };\n        foreach (var animal in pen)\n        {\n            Console.WriteLine(animal.Speak());\n        }\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.BUILD_CONFIG = {
    prefix: "poly",
    metaLabel: "Build with objects · Why many versions",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "polymorphism_awarded",
    awardAmount: 25,
  };
})();
