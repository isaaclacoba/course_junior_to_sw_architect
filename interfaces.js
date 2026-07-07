// Part four - "Why abstract?" (interfaces). Write-from-scratch builds: the
// learner writes the classes and the interface; only the usage in Main (and any
// collaborator that is not the focus) is given. The arc: two look-alike classes,
// a method stuck on one type, naming the promise, programming to it, and a new
// type that just fits. Verify probes re-run the learner's types differently.
// Data only: build-engine.js reads window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Two animals, same shape",
      concept: "A shared shape",
      context:
        "A cat and a dog both make a sound, each in its own way. Write both classes from scratch: a `Cat` whose `Speak()` returns `\"Meow\"`, and a `Dog` whose `Speak()` returns `\"Woof\"`. They do the same kind of job - but nothing in the code links them yet.",
      example:
        'public class Cow\n{\n    public string Speak()\n    {\n        return "Moo";\n    }\n}',
      goal: [
        "Write a `Cat` class and a `Dog` class, each with a `Speak()` method.",
        "Cat says Meow, Dog says Woof. Main prints both, so the output is two lines: Meow then Woof.",
      ],
      expected: ["Meow", "Woof"],
      requireSource: [
        { pattern: /class\s+Cat/, message: "Write a `Cat` class." },
        { pattern: /class\s+Dog/, message: "Write a `Dog` class." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Dog().Speak());\n        Console.WriteLine(new Cat().Speak());\n    }\n}\n',
        expected: ["Woof", "Meow"],
        message: "Each animal must return its own sound, whichever order they are called in.",
      },
      starter:
        'using System;\n\n// TODO: write two classes:\n//   - Cat, with a Speak() that returns "Meow"\n//   - Dog, with a Speak() that returns "Woof"\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Cat().Speak());\n        Console.WriteLine(new Dog().Speak());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Speak()\n    {\n        return "Meow";\n    }\n}\n\npublic class Dog\n{\n    public string Speak()\n    {\n        return "Woof";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Cat().Speak());\n        Console.WriteLine(new Dog().Speak());\n    }\n}\n',
    },
    {
      title: "A keeper stuck on one animal",
      concept: "Concrete dependency",
      context:
        "Write a `Keeper` with a method `Greet(Cat c)` that returns `\"heard: \"` followed by what the cat says. Because it is typed to `Cat`, a dog will never fit it - even though a dog can speak too. That is the cost of tying a method to one class; the next task removes it.",
      example:
        'public class Host\n{\n    public string Introduce(Guest g)\n    {\n        return "meet " + g.Name();\n    }\n}',
      goal: [
        "Write a `Keeper` class with a method `Greet(Cat c)` that returns `\"heard: \"` plus `c.Speak()`.",
        "Main greets a cat, so the output is heard: Meow.",
      ],
      expected: "heard: Meow",
      requireSource: [
        { pattern: /class\s+Keeper/, message: "Write a `Keeper` class." },
        { pattern: /c\s*\.\s*Speak\s*\(/, message: "Build the line from the animal: `c.Speak()`." },
      ],
      starter:
        'using System;\n\npublic class Cat\n{\n    public string Speak() { return "Meow"; }\n}\n\n// TODO: write a Keeper class with a method  string Greet(Cat c)\n//       that returns "heard: " followed by what the cat says.\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Cat()));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Speak() { return "Meow"; }\n}\n\npublic class Keeper\n{\n    public string Greet(Cat c)\n    {\n        return "heard: " + c.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Cat()));\n    }\n}\n',
    },
    {
      title: "Name the promise",
      concept: "Define an interface",
      context:
        "An interface is the shared shape written down: a promise that says `Speak()` exists, without saying what the sound is. Write an `IAnimal` interface with a `Speak()` method, then write `Cat` and `Dog` that keep that promise with `: IAnimal`.",
      example:
        "public interface IShape\n{\n    int Area();\n}\n\npublic class Box : IShape\n{\n    public int Area() { return 4; }\n}",
      goal: [
        "Write an `interface IAnimal` with `string Speak();`.",
        "Write `Cat : IAnimal` (says Meow) and `Dog : IAnimal` (says Woof).",
        "Main holds a Dog in an `IAnimal` and speaks, so the output is Woof.",
      ],
      expected: "Woof",
      requireSource: [
        { pattern: /interface\s+IAnimal/, message: "Define `interface IAnimal`." },
        { pattern: /class\s+Cat\s*:\s*IAnimal/, message: "Make `Cat` keep the promise: `: IAnimal`." },
        { pattern: /class\s+Dog\s*:\s*IAnimal/, message: "Make `Dog` keep the promise: `: IAnimal`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        IAnimal a = new Cat();\n        Console.WriteLine(a.Speak());\n    }\n}\n',
        expected: "Meow",
        message: "Woof is right for the dog only. Each animal must keep the promise in its own way.",
      },
      starter:
        'using System;\n\n// TODO:\n//   1) write an interface IAnimal with one method: string Speak();\n//   2) write Cat : IAnimal (Speak returns "Meow")\n//   3) write Dog : IAnimal (Speak returns "Woof")\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal a = new Dog();\n        Console.WriteLine(a.Speak());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() { return "Meow"; }\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() { return "Woof"; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal a = new Dog();\n        Console.WriteLine(a.Speak());\n    }\n}\n',
    },
    {
      title: "Depend on the promise, not the animal",
      concept: "Program to an interface",
      context:
        "Now write a `Keeper` whose `Greet` takes an `IAnimal` instead of a `Cat`. That one change is all it takes: the same method now greets a cat, a dog, or anything else that keeps the promise.",
      example:
        'public class Stage\n{\n    public string Announce(IShape s)\n    {\n        return "area " + s.Area();\n    }\n}',
      goal: [
        "Write a `Keeper` with `Greet(IAnimal a)` returning `\"heard: \"` plus `a.Speak()`.",
        "Main greets a Dog through it, so the output is heard: Woof.",
      ],
      expected: "heard: Woof",
      requireSource: [
        { pattern: /class\s+Keeper/, message: "Write a `Keeper` class." },
        { pattern: /Greet\s*\(\s*IAnimal/, message: "Make `Greet` take an `IAnimal`, not a concrete animal." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Cat()));\n    }\n}\n',
        expected: "heard: Meow",
        message: "A cat must fit the same method. Depend on IAnimal so both animals pass through.",
      },
      starter:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() { return "Meow"; }\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() { return "Woof"; }\n}\n\n// TODO: write a Keeper with a method  string Greet(IAnimal a)\n//       that returns "heard: " followed by what the animal says.\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Dog()));\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() { return "Meow"; }\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() { return "Woof"; }\n}\n\npublic class Keeper\n{\n    public string Greet(IAnimal a)\n    {\n        return "heard: " + a.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Dog()));\n    }\n}\n',
    },
    {
      title: "A new animal walks in for free",
      concept: "Open to new types",
      context:
        "Because `Greet` depends on `IAnimal`, you can add a brand-new animal without touching the keeper. The `Keeper` below is finished. Write a new `Owl` class that keeps the `IAnimal` promise and says `\"Hoot\"`, and it walks straight through the unchanged method.",
      example:
        'public class Frog : IAnimal\n{\n    public string Speak()\n    {\n        return "Ribbit";\n    }\n}',
      goal: [
        "Write an `Owl : IAnimal` whose `Speak()` returns `\"Hoot\"`.",
        "Main runs the unchanged `Greet` with an Owl, so the output is heard: Hoot.",
      ],
      expected: "heard: Hoot",
      requireSource: [
        { pattern: /class\s+Owl\s*:\s*IAnimal/, message: "Make `Owl` keep the promise: `: IAnimal`." },
      ],
      starter:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Keeper\n{\n    // Finished - do not change this.\n    public string Greet(IAnimal a) { return "heard: " + a.Speak(); }\n}\n\n// TODO: write a new Owl class that keeps the IAnimal promise\n//       and whose Speak() returns "Hoot".\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Owl()));\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Keeper\n{\n    public string Greet(IAnimal a) { return "heard: " + a.Speak(); }\n}\n\npublic class Owl : IAnimal\n{\n    public string Speak()\n    {\n        return "Hoot";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        Console.WriteLine(keeper.Greet(new Owl()));\n    }\n}\n',
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
        { title: "interface - ", text: "writes that shared promise down: the method exists, without the how." },
        { title: "`: IAnimal` - ", text: "a class declares it keeps the promise." },
        { title: "Program to the interface - ", text: "depend on the promise, so any keeper of it fits." },
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
