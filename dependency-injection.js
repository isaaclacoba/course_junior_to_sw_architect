// Part four - "Why inject?" (dependency injection). Write-from-scratch builds.
// It answers the junior's question: why hand dependencies in - why not just `new`
// them wherever we need them? The arc shows a keeper that news its own animal
// (works), the moment that bites (to change it you must edit the keeper), receiving
// the animal through the constructor, injecting behind IAnimal so any animal fits,
// and the payoff: handing in a toy stand-in so you can rehearse the keeper with no
// real animal at all. Verify probes block hardcoded answers; structural tasks are
// gated by requireSource. Builds on IAnimal from earlier lessons.
// Data only: build-engine.js reads window.BUILD_CONFIG. Animal flavour throughout.
(function () {
  "use strict";

  const tasks = [
    {
      title: "new it inside (the tight knot)",
      concept: "Self-made dependency",
      context:
        "The quickest thing is to build what you need right where you need it. `Keeper` makes its own `Cat` inside `Greet` and asks it to speak. It works fine - which is exactly why the trouble it causes is easy to miss. Finish it as it stands.",
      example:
        "// var pet = new Cat();  // built on the spot, inside the method",
      goal: [
        "In `Greet`, make a `new Cat()` and return its `Speak()`.",
        "Main greets, so the output is Meow.",
      ],
      expected: "Meow",
      requireSource: [
        { pattern: /new\s+Cat\s*\(/, message: "Build a `new Cat()` inside Greet." },
        { pattern: /\.\s*Speak\s*\(/, message: "Return the cat's `Speak()`." },
      ],
      starter:
        'using System;\n\npublic class Cat\n{\n    public string Speak() => "Meow";\n}\n\npublic class Keeper\n{\n    public string Greet()\n    {\n        // TODO: make a Cat right here and have it speak\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Speak() => "Meow";\n}\n\npublic class Keeper\n{\n    public string Greet()\n    {\n        var pet = new Cat();\n        return pet.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n',
    },
    {
      title: "To change it, you must edit the keeper",
      concept: "Hardwired dependency",
      context:
        "Now the keeper needs a dog instead. Because the animal is built inside `Keeper`, the only way to change it is to open `Keeper` and edit that `new` line. A tiny change forces you into a class that was working fine - and every caller is stuck with whatever it picks. Swap the `new` to a `Dog`.",
      example:
        "// The animal is buried inside - editing the keeper is the only lever.",
      goal: [
        "Change `Greet` so it builds a `new Dog()` and returns its `Speak()`.",
        "Main greets, so the output is Woof.",
      ],
      expected: "Woof",
      requireSource: [
        { pattern: /new\s+Dog\s*\(/, message: "Build a `Dog` inside Greet for now." },
        { pattern: /\.\s*Speak\s*\(/, message: "Return the dog's `Speak()`." },
      ],
      starter:
        'using System;\n\npublic class Dog\n{\n    public string Speak() => "Woof";\n}\n\npublic class Keeper\n{\n    public string Greet()\n    {\n        // TODO: the keeper now needs a Dog instead - build one here and have it speak\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Dog\n{\n    public string Speak() => "Woof";\n}\n\npublic class Keeper\n{\n    public string Greet()\n    {\n        var pet = new Dog();\n        return pet.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n',
    },
    {
      title: "Hand it in through the constructor",
      concept: "Constructor injection",
      context:
        "Stop building the animal inside. Let `Keeper` receive one through its constructor and keep it. Now the caller decides which animal to use, and `Keeper` never has to change to get a different one. This handing-in is dependency injection.",
      example:
        "public class Walker\n{\n    private readonly Dog _dog;\n    public Walker(Dog dog) { _dog = dog; }\n}",
      goal: [
        "Store the `Dog` passed into the constructor, and have `Greet` return `_dog.Speak()`.",
        "Main builds the dog, hands it in, and greets, so the output is Woof.",
      ],
      expected: "Woof",
      requireSource: [
        { pattern: /_dog\s*\.\s*Speak/, message: "Use the dog you were handed: `_dog.Speak()`." },
      ],
      starter:
        'using System;\n\npublic class Dog\n{\n    public string Speak() => "Woof";\n}\n\npublic class Keeper\n{\n    private readonly Dog _dog;\n\n    public Keeper(Dog dog)\n    {\n        // TODO: store the dog passed in, so Greet can use it later\n    }\n\n    public string Greet()\n    {\n        // TODO: have the kept dog speak\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Dog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Dog\n{\n    public string Speak() => "Woof";\n}\n\npublic class Keeper\n{\n    private readonly Dog _dog;\n\n    public Keeper(Dog dog)\n    {\n        _dog = dog;\n    }\n\n    public string Greet()\n    {\n        return _dog.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Dog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
    },
    {
      title: "Inject the promise, not the animal",
      concept: "Depend on an interface",
      context:
        "Now have `Keeper` accept an `IAnimal` rather than a specific animal. Any animal that keeps the promise can be handed in - cat, dog, or one you write later - and `Keeper` is closed for editing for good. Depend on the interface in the field and the constructor.",
      example:
        "// public Keeper(IAnimal animal) { _animal = animal; }",
      goal: [
        "Make `Keeper` hold and accept an `IAnimal`, and have `Greet` return `_animal.Speak()`.",
        "Main hands in a `Cat` and greets, so the output is Meow.",
      ],
      expected: "Meow",
      requireSource: [
        { pattern: /Keeper\s*\(\s*IAnimal/, message: "Take an `IAnimal` in the constructor, not a concrete animal." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Dog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
        expected: "Woof",
        message: "A dog must fit the same keeper. Depend on IAnimal so any animal can be injected.",
      },
      starter:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\npublic class Keeper\n{\n    // TODO: let the keeper be handed any IAnimal, and have Greet use it\n\n    public string Greet()\n    {\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Cat());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() => "Meow";\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() => "Woof";\n}\n\npublic class Keeper\n{\n    private readonly IAnimal _animal;\n    public Keeper(IAnimal animal) { _animal = animal; }\n\n    public string Greet()\n    {\n        return _animal.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Cat());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
    },
    {
      title: "Hand in a stand-in",
      concept: "Swap in a double",
      context:
        "Because `Keeper` is handed its animal, you can pass a `ToyDog` - a stand-in that makes a known sound - and rehearse the keeper with no real animal involved. A keeper that `new`s its own pet could never be tried out like this. Write the toy; Main does the rest.",
      example:
        "// A stand-in is just another IAnimal you control:\n// public class ToyDog : IAnimal { ... }",
      goal: [
        "Make `ToyDog.Speak()` always return `\"squeak\"`.",
        "Main hands the keeper the toy and checks the sound, so the output is rehearsal ok.",
      ],
      expected: "rehearsal ok",
      requireSource: [
        { pattern: /class\s+ToyDog\s*:\s*IAnimal/, message: "Make `ToyDog` keep the promise: `: IAnimal`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new ToyDog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
        expected: "squeak",
        message: "The keeper must use the stand-in it is handed, so a ToyDog makes Greet say squeak.",
      },
      starter:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Keeper\n{\n    private readonly IAnimal _animal;\n    public Keeper(IAnimal animal) { _animal = animal; }\n    public string Greet() => _animal.Speak();\n}\n\npublic class ToyDog : IAnimal\n{\n    // TODO: the toy always makes the same pretend sound\n    public string Speak() => "";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new ToyDog());\n        string sound = keeper.Greet();\n        Console.WriteLine(sound == "squeak" ? "rehearsal ok" : "rehearsal off");\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Keeper\n{\n    private readonly IAnimal _animal;\n    public Keeper(IAnimal animal) { _animal = animal; }\n    public string Greet() => _animal.Speak();\n}\n\npublic class ToyDog : IAnimal\n{\n    public string Speak() => "squeak";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new ToyDog());\n        string sound = keeper.Greet();\n        Console.WriteLine(sound == "squeak" ? "rehearsal ok" : "rehearsal off");\n    }\n}\n',
    },
    {
      summary: true,
      title: "Why inject? - recap",
      concept: "Recap",
      context: "Handing dependencies in - not newing them inside - is what keeps a class open and testable.",
      summaryIntro:
        "A class that builds its own tools is welded to them. Receiving them instead keeps the class open to change and easy to rehearse.",
      summaryItems: [
        { title: "Self-made dependency - ", text: "newing a tool inside ties the class to that one choice." },
        { title: "Hardwired - ", text: "changing it means opening and editing the class." },
        { title: "Constructor injection - ", text: "receive the dependency through the constructor and keep it." },
        { title: "Depend on an interface - ", text: "inject `IAnimal`, so any animal that keeps the promise fits." },
        { title: "Swap in a stand-in - ", text: "hand in a toy double to rehearse the class with no real dependency." },
      ],
      summaryClose: "Next: Part five - Design for change (the SOLID principles).",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "di",
    metaLabel: "Build with objects \u00b7 Why inject",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "dependency_injection_awarded",
    awardAmount: 25,
  };
})();
