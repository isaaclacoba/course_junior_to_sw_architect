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
      title: "A branch for every animal",
      concept: "The type switch",
      context:
        "Without polymorphism, one method carries every animal as a branch. Write a `Zoo` with a method `Sound(string kind)` that returns `\"Meow\"` for `\"cat\"`, `\"Woof\"` for `\"dog\"`, and `\"?\"` for anything else. It works - but every new animal means another `if` in here.",
      example:
        'public string Make(string kind)\n{\n    if (kind == "cow") return "Moo";\n    if (kind == "duck") return "Quack";\n    return "?";\n}',
      goal: [
        "Write a `Zoo` class with `string Sound(string kind)` covering \"cat\", \"dog\", and anything else.",
        "Main asks for the cat, so the output is Meow.",
      ],
      expected: "Meow",
      requireSource: [
        { pattern: /class\s+Zoo/, message: "Write a `Zoo` class." },
        { pattern: /\bif\b/, message: "Decide the sound with `if` checks on the kind." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Sound("dog"));\n    }\n}\n',
        expected: "Woof",
        message: "Meow is right for the cat only. Each branch must answer for the kind it is asked about.",
      },
      starter:
        'using System;\n\n// TODO: write a Zoo class with a method  string Sound(string kind)\n//       - "cat"  -> "Meow"\n//       - "dog"  -> "Woof"\n//       - anything else -> "?"\n\nclass Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Sound("cat"));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Zoo\n{\n    public string Sound(string kind)\n    {\n        if (kind == "cat") return "Meow";\n        if (kind == "dog") return "Woof";\n        return "?";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        Console.WriteLine(zoo.Sound("cat"));\n    }\n}\n',
    },
    {
      title: "Let each animal carry its own sound",
      concept: "One call, many behaviours",
      context:
        "Instead of one method with branches, give each animal its own class behind `IAnimal`. Write `Cat` and `Dog` that implement it. Now the call `a.Speak()` is written once, yet makes a different sound depending on which animal `a` holds - no `kind` argument, no branch.",
      example:
        'public interface IShape\n{\n    string Name();\n}\n\npublic class Box : IShape\n{\n    public string Name() { return "box"; }\n}\n\npublic class Ball : IShape\n{\n    public string Name() { return "ball"; }\n}',
      goal: [
        "Write `Cat : IAnimal` (says Meow) and `Dog : IAnimal` (says Woof).",
        "Main calls the identical `.Speak()` on each, so the output is two lines: Meow then Woof.",
      ],
      expected: ["Meow", "Woof"],
      requireSource: [
        { pattern: /class\s+Cat\s*:\s*IAnimal/, message: "Make `Cat` implement `IAnimal`." },
        { pattern: /class\s+Dog\s*:\s*IAnimal/, message: "Make `Dog` implement `IAnimal`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        IAnimal a = new Cat();\n        IAnimal b = new Dog();\n        Console.WriteLine(b.Speak());\n        Console.WriteLine(a.Speak());\n    }\n}\n',
        expected: ["Woof", "Meow"],
        message: "Each animal must return its own sound, whichever order they speak in.",
      },
      starter:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\n// TODO: write Cat : IAnimal (Speak returns "Meow")\n//       and Dog : IAnimal (Speak returns "Woof").\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal a = new Cat();\n        IAnimal b = new Dog();\n        Console.WriteLine(a.Speak());\n        Console.WriteLine(b.Speak());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() { return "Meow"; }\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() { return "Woof"; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal a = new Cat();\n        IAnimal b = new Dog();\n        Console.WriteLine(a.Speak());\n        Console.WriteLine(b.Speak());\n    }\n}\n',
    },
    {
      title: "One loop, the whole pen",
      concept: "Polymorphism over a list",
      context:
        "Because every animal keeps the same promise, you can put different ones in a single `List<IAnimal>` and walk them with one loop. Write the `Main`: build a list with a `Cat` and a `Dog`, then loop it and print what each one says. The loop never asks which animal it is holding.",
      example:
        'var nums = new List<int> { 1, 2 };\nforeach (var n in nums)\n{\n    Console.WriteLine(n);\n}',
      goal: [
        "In Main, build a `List<IAnimal>` holding a `Cat` then a `Dog`, and loop it printing each `Speak()`.",
        "So the output is two lines: Meow then Woof.",
      ],
      expected: ["Meow", "Woof"],
      requireSource: [
        { pattern: /List\s*<\s*IAnimal\s*>/, message: "Hold the animals in a `List<IAnimal>`." },
        { pattern: /foreach/, message: "Walk them with a single `foreach` loop." },
      ],
      starter:
        'using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return "Meow"; } }\npublic class Dog : IAnimal { public string Speak() { return "Woof"; } }\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: put a Cat and a Dog into one List<IAnimal>,\n        //       then loop the list and print what each one says.\n    }\n}\n',
      solution:
        'using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return "Meow"; } }\npublic class Dog : IAnimal { public string Speak() { return "Woof"; } }\n\nclass Program\n{\n    static void Main()\n    {\n        var pen = new List<IAnimal> { new Cat(), new Dog() };\n        foreach (var a in pen)\n        {\n            Console.WriteLine(a.Speak());\n        }\n    }\n}\n',
    },
    {
      title: "Pick the animal at runtime",
      concept: "Runtime selection",
      context:
        "Which animal you get can be decided while the program runs. Write a `Shelter` with a method `Adopt(string kind)` that returns a new `Dog` when `kind` is `\"dog\"`, otherwise a new `Cat`. The caller then makes one plain `Speak` call and never needs to know which it got.",
      example:
        'public IShape Pick(string k)\n{\n    if (k == "box") return new Box();\n    return new Circle();\n}',
      goal: [
        "Write a `Shelter` with `IAnimal Adopt(string kind)` - a Dog for \"dog\", otherwise a Cat.",
        "Main adopts a dog and it speaks, so the output is Woof.",
      ],
      expected: "Woof",
      requireSource: [
        { pattern: /class\s+Shelter/, message: "Write a `Shelter` class." },
        { pattern: /IAnimal\s+Adopt\s*\(/, message: "Have `Adopt` return an `IAnimal`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        IAnimal a = shelter.Adopt("cat");\n        Console.WriteLine(a.Speak());\n    }\n}\n',
        expected: "Meow",
        message: "Woof is right for adopting a dog only. Return the animal that matches the kind asked for.",
      },
      starter:
        'using System;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return "Meow"; } }\npublic class Dog : IAnimal { public string Speak() { return "Woof"; } }\n\n// TODO: write a Shelter class with a method  IAnimal Adopt(string kind)\n//       that returns a new Dog for "dog", otherwise a new Cat.\n\nclass Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        IAnimal a = shelter.Adopt("dog");\n        Console.WriteLine(a.Speak());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return "Meow"; } }\npublic class Dog : IAnimal { public string Speak() { return "Woof"; } }\n\npublic class Shelter\n{\n    public IAnimal Adopt(string kind)\n    {\n        if (kind == "dog") return new Dog();\n        return new Cat();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        IAnimal a = shelter.Adopt("dog");\n        Console.WriteLine(a.Speak());\n    }\n}\n',
    },
    {
      title: "Add an animal, leave the loop alone",
      concept: "Open to new behaviour",
      context:
        "In the first task, a new animal meant editing the one method. Here the list and loop in `Main` are finished. Write a new `Owl` class that keeps the `IAnimal` promise and says `\"Hoot\"`; it joins the pen and the loop never changes.",
      example:
        'public class Frog : IAnimal\n{\n    public string Speak()\n    {\n        return "Ribbit";\n    }\n}',
      goal: [
        "Write an `Owl : IAnimal` whose `Speak()` returns `\"Hoot\"`.",
        "It is already in the pen, so the three-line output is Meow, Woof, Hoot.",
      ],
      expected: ["Meow", "Woof", "Hoot"],
      requireSource: [
        { pattern: /class\s+Owl\s*:\s*IAnimal/, message: "Make `Owl` keep the promise: `: IAnimal`." },
      ],
      starter:
        'using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return "Meow"; } }\npublic class Dog : IAnimal { public string Speak() { return "Woof"; } }\n\n// TODO: write an Owl class that implements IAnimal and says "Hoot".\n//       The list and loop below already include an Owl - leave them as they are.\n\nclass Program\n{\n    static void Main()\n    {\n        var pen = new List<IAnimal> { new Cat(), new Dog(), new Owl() };\n        foreach (var a in pen)\n        {\n            Console.WriteLine(a.Speak());\n        }\n    }\n}\n',
      solution:
        'using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return "Meow"; } }\npublic class Dog : IAnimal { public string Speak() { return "Woof"; } }\n\npublic class Owl : IAnimal\n{\n    public string Speak()\n    {\n        return "Hoot";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pen = new List<IAnimal> { new Cat(), new Dog(), new Owl() };\n        foreach (var a in pen)\n        {\n            Console.WriteLine(a.Speak());\n        }\n    }\n}\n',
    },
    {
      summary: true,
      title: "Why many versions? - recap",
      concept: "Recap",
      context: "A handful of small classes beats one method full of branches.",
      summaryIntro:
        "Polymorphism lets each type carry its own behaviour, so one call site does the right thing for whatever it is given.",
      summaryItems: [
        { title: "The type switch - ", text: "one method full of `if`s grows and gets risky with every kind." },
        { title: "One call, many behaviours - ", text: "`a.Speak()` is written once but resolves to the real object's version." },
        { title: "Over a list - ", text: "a single loop walks a `List<IAnimal>` of mixed kinds." },
        { title: "Runtime selection - ", text: "choose the implementation while the program runs." },
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
