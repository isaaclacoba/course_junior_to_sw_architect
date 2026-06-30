// Part four - "Why abstract?" (interfaces). Write-from-scratch builds. It answers
// the junior's question: why pull logic behind an interface at all? The arc makes
// the need felt: two animals make a sound each, but nothing links them, a keeper's
// method gets stuck on one animal type, then an interface frees it - one method
// greets any animal, and a brand-new animal walks in without touching the keeper.
// Verify probes block hardcoded answers where the graded work lives in a type;
// wiring tasks are gated by requireSource instead.
// Data only: build-engine.js reads window.BUILD_CONFIG. Animal flavour throughout.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Two animals, same shape",
      concept: "A shared shape",
      context:
        "A cat and a dog both make a sound, each in its own way. They clearly do the same kind of thing - but nothing in the code says so yet. Fill in both `Speak` methods.",
      example:
        'public class Cow\n{\n    public string Speak() => "Moo";\n}',
      goal: [
        "`Cat.Speak` returns `\"Meow\"`, and `Dog.Speak` returns `\"Woof\"`.",
        "Main has the cat speak then the dog, so the output is two lines: Meow then Woof.",
      ],
      expected: ["Meow", "Woof"],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Dog().Speak());\n        Console.WriteLine(new Cat().Speak());\n    }\n}\n',
        expected: ["Woof", "Meow"],
        message: "Each animal must return its own sound, whichever order they are called in.",
      },
      starter:
        'using System;\n\npublic class Cat\n{\n    // TODO: make the cat speak - give it its sound\n    public string Speak() => "";\n}\n\npublic class Dog\n{\n    // TODO: make the dog speak - give it its sound\n    public string Speak() => "";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Cat().Speak());\n        Console.WriteLine(new Dog().Speak());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog\n{\n    public string Speak() => "Woof";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Cat().Speak());\n        Console.WriteLine(new Dog().Speak());\n    }\n}\n',
    },
    {
      title: "A keeper stuck on one animal",
      concept: "Concrete dependency",
      context:
        "`Greet` is written to take a `Cat`, so a cat is the only animal it will ever accept - a dog will not fit, even though it has the very same `Speak` method. The method is welded to one animal. Finish it as it stands; the next build fixes that.",
      example:
        "// Tied to one animal - only a Cat is allowed through here.\n// public string Greet(Cat c) => ...",
      goal: [
        "Make `Greet` return `\"heard: \"` followed by `c.Speak()`.",
        "Main greets a cat, so the output is heard: Meow.",
      ],
      expected: "heard: Meow",
      requireSource: [
        { pattern: /c\s*\.\s*Speak\s*\(/, message: "Build the line from the animal: `c.Speak()`." },
      ],
      starter:
        'using System;\n\npublic class Cat\n{\n    public string Speak() => "Meow";\n}\n\npublic class Keeper\n{\n    // Only a Cat is allowed in - nothing else can be passed.\n    public string Greet(Cat c)\n    {\n        // TODO: report what was heard - ask the cat to speak, with "heard: " in front\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Cat()));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Speak() => "Meow";\n}\n\npublic class Keeper\n{\n    public string Greet(Cat c)\n    {\n        return "heard: " + c.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Cat()));\n    }\n}\n',
    },
    {
      title: "Name the promise",
      concept: "Define an interface",
      context:
        "An interface is the shared shape written down: a promise that says `Speak()` exists, without saying what the sound is. Declare it once, and both animals can announce they keep it with `: IAnimal`. Now the code states what was only implied before.",
      example:
        "public interface IShape\n{\n    int Area();\n}\n\npublic class Box : IShape\n{\n    public int Area() => 4;\n}",
      goal: [
        "Declare `string Speak();` inside `IAnimal`.",
        "Main holds a `Dog` in an `IAnimal` variable and has it speak, so the output is Woof.",
      ],
      expected: "Woof",
      requireSource: [
        { pattern: /interface\s+IAnimal/, message: "Define the promise as `interface IAnimal`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        IAnimal a = new Cat();\n        Console.WriteLine(a.Speak());\n    }\n}\n',
        expected: "Meow",
        message: "Woof is right for the dog only. The interface must work for any animal behind it.",
      },
      starter:
        'using System;\n\npublic interface IAnimal\n{\n    // TODO: every IAnimal must promise to speak - declare that method here (no body)\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal a = new Dog();\n        Console.WriteLine(a.Speak());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal a = new Dog();\n        Console.WriteLine(a.Speak());\n    }\n}\n',
    },
    {
      title: "Depend on the promise, not the animal",
      concept: "Program to an interface",
      context:
        "Now retype `Greet` to take an `IAnimal` instead of a `Cat`. That single change is all it takes: the very same method now greets a cat, a dog, or anything else that keeps the promise. One method, every animal.",
      example:
        "// One method, any animal that keeps the promise:\n// public string Greet(IAnimal a) => ...",
      goal: [
        "Make `Greet` take an `IAnimal` and return `\"heard: \"` followed by `a.Speak()`.",
        "Main greets a `Dog` through it, so the output is heard: Woof.",
      ],
      expected: "heard: Woof",
      requireSource: [
        { pattern: /Greet\s*\(\s*IAnimal/, message: "Make `Greet` take an `IAnimal`, not a concrete animal." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Cat()));\n    }\n}\n',
        expected: "heard: Meow",
        message: "A cat must fit the same method now. Depend on IAnimal so both pass through.",
      },
      starter:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\npublic class Keeper\n{\n    // TODO: accept any IAnimal, and report what it says with "heard: " in front\n    public string Greet(IAnimal a)\n    {\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Dog()));\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\npublic class Keeper\n{\n    public string Greet(IAnimal a)\n    {\n        return "heard: " + a.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Dog()));\n    }\n}\n',
    },
    {
      title: "A new animal walks in for free",
      concept: "Open to new types",
      context:
        "`Keeper.Greet` is finished and must not change. Add a third animal that keeps the `IAnimal` promise, and it walks straight through the unchanged method. New behaviour by adding a class, not by editing the keeper.",
      example:
        "// A new class that keeps the promise just fits in:\n// public class Owl : IAnimal { ... }",
      goal: [
        "Make `Owl.Speak` return `\"Hoot\"`.",
        "Main runs the unchanged `Greet` with an `Owl`, so the output is heard: Hoot.",
      ],
      expected: "heard: Hoot",
      requireSource: [
        { pattern: /class\s+Owl\s*:\s*IAnimal/, message: "Make `Owl` keep the promise: `: IAnimal`." },
      ],
      starter:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Keeper\n{\n    // Finished - do not change this.\n    public string Greet(IAnimal a) => "heard: " + a.Speak();\n}\n\npublic class Owl : IAnimal\n{\n    // TODO: make the owl speak - give it its own sound\n    public string Speak() => "";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Owl()));\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Keeper\n{\n    public string Greet(IAnimal a) => "heard: " + a.Speak();\n}\n\npublic class Owl : IAnimal\n{\n    public string Speak() => "Hoot";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Owl()));\n    }\n}\n',
    },
    {
      summary: true,
      title: "Why abstract? - recap",
      concept: "Recap",
      context: "An interface is a promise written down. Keep the promise, and your code fits anywhere.",
      summaryIntro:
        "Pulling logic behind an interface lets one piece of code work with many different types, now and later.",
      summaryItems: [
        { title: "A shared shape - ", text: "two classes can do the same kind of job in their own way." },
        { title: "interface - ", text: "writes that shared promise down - the method exists, without saying how." },
        { title: "`: IAnimal` - ", text: "a class declares it keeps the promise, so it fits anywhere the promise is expected." },
        { title: "Program to the interface - ", text: "depend on the promise, not a concrete class, and any keeper of it fits one method." },
        { title: "Open to new types - ", text: "a brand-new class drops in without touching the caller." },
      ],
      summaryClose: "Next: Why many versions? - polymorphism.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "iface",
    metaLabel: "Build with objects \u00b7 Why abstract",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "interfaces_awarded",
    awardAmount: 25,
  };
})();
