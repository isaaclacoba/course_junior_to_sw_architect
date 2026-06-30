// Part four - "Why many versions?" (polymorphism). Write-from-scratch builds.
// It answers the junior's question: why have several implementations of the same
// logic instead of one method with branches? The arc shows the pain of an if-per-
// animal method, then the relief: one call line each animal resolves itself, one
// loop over a whole pen at once, choosing the animal at runtime, and adding a new
// animal without ever touching the loop. Builds on IAnimal from the interfaces
// lesson. Verify probes block hardcoded answers where the work lives in a type;
// loop-in-Main tasks are gated by requireSource instead.
// Data only: build-engine.js reads window.BUILD_CONFIG. Animal flavour throughout.
(function () {
  "use strict";

  const tasks = [
    {
      title: "A branch for every animal",
      concept: "The type switch",
      context:
        "Without polymorphism, one method carries every animal as a branch. It works, but each new animal means opening this method and adding another `if` - and the branches pile up. Finish the two it already knows.",
      example:
        'if (kind == "cow") return "Moo";\nif (kind == "duck") return "Quack";\nreturn "?";',
      goal: [
        "In `Sound`, return `\"Meow\"` for `\"cat\"` and `\"Woof\"` for `\"dog\"`.",
        "Main asks for the cat, so the output is Meow.",
      ],
      expected: "Meow",
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Sound("dog"));\n    }\n}\n',
        expected: "Woof",
        message: "Meow is right for the cat only. Each branch must answer for the animal it is asked about.",
      },
      starter:
        'using System;\n\npublic class Zoo\n{\n    public string Sound(string kind)\n    {\n        // TODO: answer with the right sound for "cat" and for "dog"\n        return "?";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Sound("cat"));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Zoo\n{\n    public string Sound(string kind)\n    {\n        if (kind == "cat") return "Meow";\n        if (kind == "dog") return "Woof";\n        return "?";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Sound("cat"));\n    }\n}\n',
    },
    {
      title: "The same call, a different sound",
      concept: "One call, many behaviours",
      context:
        "Now give each animal its own class behind `IAnimal`. The call `a.Speak()` is written once, yet makes a different sound depending on which animal `a` holds. No `kind` argument, no branch - the animal carries its own voice. Fill in the dog.",
      example:
        "// Same line, different animal, different sound:\n// IAnimal a = new Dog();\n// a.Speak();",
      goal: [
        "Make `Dog.Speak` return `\"Woof\"`.",
        "Main calls the identical `.Speak()` on a cat then a dog, so the output is two lines: Meow then Woof.",
      ],
      expected: ["Meow", "Woof"],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        IAnimal a = new Cat();\n        IAnimal b = new Dog();\n        Console.WriteLine(b.Speak());\n        Console.WriteLine(a.Speak());\n    }\n}\n',
        expected: ["Woof", "Meow"],
        message: "The dog must return its own sound, whichever order the animals speak in.",
      },
      starter:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    // TODO: give the dog its own sound\n    public string Speak() => "";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal a = new Cat();\n        IAnimal b = new Dog();\n        Console.WriteLine(a.Speak());\n        Console.WriteLine(b.Speak());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal a = new Cat();\n        IAnimal b = new Dog();\n        Console.WriteLine(a.Speak());\n        Console.WriteLine(b.Speak());\n    }\n}\n',
    },
    {
      title: "One loop, the whole pen",
      concept: "Polymorphism over a list",
      context:
        "Because each animal keeps the same promise, you can put different ones in a single `List<IAnimal>` and walk them with one loop. The loop does not know or care which animal each is - it just calls `Speak`. Build the pen and the loop.",
      example:
        'foreach (var a in pen)\n    Console.WriteLine(a.Speak());',
      goal: [
        "Make a `List<IAnimal>` holding a `Cat` then a `Dog`.",
        "Loop it, printing `Speak()` for each, so the output is two lines: Meow then Woof.",
      ],
      expected: ["Meow", "Woof"],
      requireSource: [
        { pattern: /List\s*<\s*IAnimal\s*>/, message: "Hold the animals in a `List<IAnimal>`." },
        { pattern: /foreach/, message: "Walk them with a single `foreach` loop." },
      ],
      starter:
        'using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: collect a Cat and a Dog together in one list,\n        //       then go through them and print what each one says\n    }\n}\n',
      solution:
        'using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pen = new List<IAnimal> { new Cat(), new Dog() };\n        foreach (var a in pen)\n            Console.WriteLine(a.Speak());\n    }\n}\n',
    },
    {
      title: "Pick the animal at runtime",
      concept: "Runtime selection",
      context:
        "Which animal you get can be decided while the program runs - from a setting, a button, whoever shows up at the shelter. `Adopt` takes a name and hands back the matching `IAnimal`. The caller then makes one plain `Speak` call and never needs to know which it got.",
      example:
        "// public IAnimal Adopt(string kind) =>\n//     kind == \"dog\" ? new Dog() : new Cat();",
      goal: [
        "Make `Adopt(kind)` return a new `Dog` when `kind` is `\"dog\"`, otherwise a new `Cat`.",
        "Main adopts a dog and it speaks, so the output is Woof.",
      ],
      expected: "Woof",
      requireSource: [
        { pattern: /IAnimal\s+Adopt\s*\(/, message: "Have `Adopt` return an `IAnimal`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        IAnimal a = shelter.Adopt("cat");\n        Console.WriteLine(a.Speak());\n    }\n}\n',
        expected: "Meow",
        message: "Woof is right for adopting a dog only. Return the animal that matches the name passed in.",
      },
      starter:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\npublic class Shelter\n{\n    // TODO: hand back the matching animal for the kind asked for\n    public IAnimal Adopt(string kind)\n    {\n        return null;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        IAnimal a = shelter.Adopt("dog");\n        Console.WriteLine(a.Speak());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\npublic class Shelter\n{\n    public IAnimal Adopt(string kind)\n    {\n        return kind == "dog" ? new Dog() : new Cat();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        IAnimal a = shelter.Adopt("dog");\n        Console.WriteLine(a.Speak());\n    }\n}\n',
    },
    {
      title: "Add an animal, leave the loop alone",
      concept: "Open to new behaviour",
      context:
        "In the first build, a new animal meant editing the one method. Here the loop in `Main` is finished and stays exactly as it is - add a new animal by writing a class that keeps the promise and dropping it into the pen. The loop never changes.",
      example:
        "// Add the class, add it to the pen. The loop is untouched.",
      goal: [
        "Make `Owl.Speak` return `\"Hoot\"`.",
        "It is already in the pen with the others, so the three-line output is Meow, Woof, Hoot.",
      ],
      expected: ["Meow", "Woof", "Hoot"],
      requireSource: [
        { pattern: /class\s+Owl\s*:\s*IAnimal/, message: "Make `Owl` keep the promise: `: IAnimal`." },
      ],
      starter:
        'using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\npublic class Owl : IAnimal\n{\n    // TODO: give the owl its own sound\n    public string Speak() => "";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pen = new List<IAnimal>\n        {\n            new Cat(),\n            new Dog(),\n            new Owl(),\n        };\n        foreach (var a in pen)\n            Console.WriteLine(a.Speak());\n    }\n}\n',
      solution:
        'using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\npublic class Owl : IAnimal\n{\n    public string Speak() => "Hoot";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pen = new List<IAnimal>\n        {\n            new Cat(),\n            new Dog(),\n            new Owl(),\n        };\n        foreach (var a in pen)\n            Console.WriteLine(a.Speak());\n    }\n}\n',
    },
    {
      summary: true,
      title: "Why many versions? - recap",
      concept: "Recap",
      context: "Why a handful of small classes beats one method full of branches.",
      summaryIntro:
        "Polymorphism lets each type carry its own behaviour, so one call site quietly does the right thing for whatever it is given.",
      summaryItems: [
        { title: "The type switch - ", text: "one method full of `if`s grows and gets risky with every new kind." },
        { title: "One call, many behaviours - ", text: "`a.Speak()` is written once but resolves to the real object's version." },
        { title: "Over a list - ", text: "a single loop walks a `List<IAnimal>` of mixed kinds, calling each." },
        { title: "Runtime selection - ", text: "choose the implementation while the program runs and return it behind the interface." },
        { title: "Open to new behaviour - ", text: "add a class; the loop never changes." },
      ],
      summaryClose: "Next: Inherit or compose?",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "poly",
    metaLabel: "Build with objects \u00b7 Why many versions",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "polymorphism_awarded",
    awardAmount: 25,
  };
})();
