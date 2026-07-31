// Part four - "Why inject?" (dependency injection). Write-from-scratch builds: the
// learner writes the Keeper class themselves. The arc: newing a tool inside,
// the moment that bites, receiving it through the constructor, depending on an
// interface, and handing in a toy stand-in. Verify probes re-run the learner's
// type differently. Data only: window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      title: "new it inside (the tight knot)",
      concept: "Self-made dependency",
      context:
        "The quickest thing is to build what you need right where you need it. The `Cat` is given. Write a `Keeper` whose `Greet()` makes a `new Cat()` inside and returns what it says. It works - so the problem it creates is easy to miss.",
      example:
        'public string Use()\n{\n    var tool = new Hammer();\n    return tool.Hit();\n}',
      goal: [
        "Write a `Keeper` with a `Greet()` that builds a `new Cat()` and returns its `Speak()`.",
        "Main greets, so the output is Meow.",
      ],
      expected: "Meow",
      requireSource: [
        { pattern: /class\s+Keeper/, message: "Write a `Keeper` class." },
        { pattern: /new\s+Cat\s*\(/, message: "Build a `new Cat()` inside Greet." },
      ],
      starter:
        'using System;\n\npublic class Cat\n{\n    public string Speak() { return "Meow"; }\n}\n\n// TODO: write a Keeper with a Greet() that builds a new Cat inside\n//       and returns what it says.\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Speak() { return "Meow"; }\n}\n\npublic class Keeper\n{\n    public string Greet()\n    {\n        var pet = new Cat();\n        return pet.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n',
    },
    {
      title: "To change it, you must edit the keeper",
      concept: "Hardwired dependency",
      context:
        "Now the keeper needs a dog instead. Because the animal is built inside, the only way to change it is to open the `Keeper` and rewrite that line. Write a `Keeper` whose `Greet()` builds a `new Dog()` and returns what it says.",
      example:
        'public string Use()\n{\n    var tool = new Drill();\n    return tool.Spin();\n}',
      goal: [
        "Write a `Keeper` with a `Greet()` that builds a `new Dog()` and returns its `Speak()`.",
        "Main greets, so the output is Woof.",
      ],
      expected: "Woof",
      requireSource: [
        { pattern: /class\s+Keeper/, message: "Write a `Keeper` class." },
        { pattern: /new\s+Dog\s*\(/, message: "Build a `new Dog()` inside Greet for now." },
      ],
      starter:
        'using System;\n\npublic class Dog\n{\n    public string Speak() { return "Woof"; }\n}\n\n// TODO: write a Keeper with a Greet() that builds a new Dog inside\n//       and returns what it says.\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Dog\n{\n    public string Speak() { return "Woof"; }\n}\n\npublic class Keeper\n{\n    public string Greet()\n    {\n        var pet = new Dog();\n        return pet.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Keeper().Greet());\n    }\n}\n',
    },
    {
      title: "Hand it in through the constructor",
      concept: "Constructor injection",
      context:
        "Stop building the animal inside. Write a `Keeper` that receives a `Dog` through its constructor, keeps it in a field, and uses it in `Greet()`. Now the caller decides which dog, and the keeper never changes to get a different one. This handing-in is dependency injection.",
      example:
        "public class Walker\n{\n    private readonly Dog _dog;\n    public Walker(Dog dog) { _dog = dog; }\n}",
      goal: [
        "Write a `Keeper` that takes a `Dog` in its constructor and has `Greet()` return that dog's `Speak()`.",
        "Main builds the dog, hands it in, and greets, so the output is Woof.",
      ],
      expected: "Woof",
      requireSource: [
        { pattern: /class\s+Keeper/, message: "Write a `Keeper` class." },
        { pattern: /Keeper\s*\(\s*Dog/, message: "Take a `Dog` in the constructor." },
      ],
      starter:
        'using System;\n\npublic class Dog\n{\n    public string Speak() { return "Woof"; }\n}\n\n// TODO: write a Keeper that:\n//   - takes a Dog in its constructor and stores it in a field\n//   - Greet(): returns the kept dog\'s Speak()\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Dog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Dog\n{\n    public string Speak() { return "Woof"; }\n}\n\npublic class Keeper\n{\n    private readonly Dog _dog;\n\n    public Keeper(Dog dog)\n    {\n        _dog = dog;\n    }\n\n    public string Greet()\n    {\n        return _dog.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Dog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
    },
    {
      title: "Inject the promise, not the animal",
      concept: "Depend on an interface",
      context:
        "Finish the job: write a `Keeper` that takes an `IAnimal` rather than a specific animal. Now any animal that keeps the promise can be handed in, and the keeper is closed for editing for good. `Cat` and `Dog` are given.",
      example:
        'public class Player\n{\n    private readonly IInstrument _i;\n    public Player(IInstrument instrument)\n    {\n        _i = instrument;\n    }\n}',
      goal: [
        "Write a `Keeper` that takes an `IAnimal` in its constructor and has `Greet()` return its `Speak()`.",
        "Main hands in a `Cat` and greets, so the output is Meow.",
      ],
      expected: "Meow",
      requireSource: [
        { pattern: /class\s+Keeper/, message: "Write a `Keeper` class." },
        { pattern: /Keeper\s*\(\s*IAnimal/, message: "Take an `IAnimal` in the constructor, not a concrete animal." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Dog());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
        expected: "Woof",
        message: "A dog must fit the same keeper. Depend on IAnimal so any animal can be injected.",
      },
      starter:
        'using System;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return "Meow"; } }\npublic class Dog : IAnimal { public string Speak() { return "Woof"; } }\n\n// TODO: write a Keeper that:\n//   - takes an IAnimal in its constructor and stores it\n//   - Greet(): returns the animal\'s Speak()\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Cat());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal { string Speak(); }\npublic class Cat : IAnimal { public string Speak() { return "Meow"; } }\npublic class Dog : IAnimal { public string Speak() { return "Woof"; } }\n\npublic class Keeper\n{\n    private readonly IAnimal _animal;\n\n    public Keeper(IAnimal animal)\n    {\n        _animal = animal;\n    }\n\n    public string Greet()\n    {\n        return _animal.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new Cat());\n        Console.WriteLine(keeper.Greet());\n    }\n}\n',
    },
    {
      title: "Hand in a stand-in",
      concept: "Swap in a double",
      context:
        "Because the keeper is handed its animal, you can pass a stand-in and rehearse it with no real animal. The `Keeper` is finished. Write a `ToyDog` that keeps the `IAnimal` promise and always says `\"squeak\"`; Main hands it in and checks the keeper used it.",
      example:
        'public class FakeClock : IClock\n{\n    public int Hour()\n    {\n        return 9;\n    }\n}',
      goal: [
        "Write a `ToyDog : IAnimal` whose `Speak()` always returns `\"squeak\"`.",
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
        'using System;\n\npublic interface IAnimal { string Speak(); }\n\npublic class Keeper\n{\n    private readonly IAnimal _animal;\n    public Keeper(IAnimal animal) { _animal = animal; }\n    public string Greet() { return _animal.Speak(); }\n}\n\n// TODO: write a ToyDog that keeps the IAnimal promise\n//       and whose Speak() always returns "squeak".\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new ToyDog());\n        string sound = keeper.Greet();\n        Console.WriteLine(sound == "squeak" ? "rehearsal ok" : "rehearsal off");\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IAnimal { string Speak(); }\n\npublic class Keeper\n{\n    private readonly IAnimal _animal;\n    public Keeper(IAnimal animal) { _animal = animal; }\n    public string Greet() { return _animal.Speak(); }\n}\n\npublic class ToyDog : IAnimal\n{\n    public string Speak()\n    {\n        return "squeak";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new ToyDog());\n        string sound = keeper.Greet();\n        Console.WriteLine(sound == "squeak" ? "rehearsal ok" : "rehearsal off");\n    }\n}\n',
    },
    {
      summary: true,
      title: "Why inject? - recap",
      concept: "Recap",
      context: "Handing dependencies in - not newing them inside - is what keeps a class open and easy to rehearse.",
      summaryIntro:
        "A class that builds its own tools is welded to them. Receiving them instead keeps the class open to change and easy to test.",
      summaryItems: [
        { title: "Self-made dependency - ", text: "newing a tool inside ties the class to that one choice." },
        { title: "Hardwired - ", text: "changing it means opening and editing the class." },
        { title: "Constructor injection - ", text: "receive the dependency through the constructor and keep it." },
        { title: "Depend on an interface - ", text: "inject `IAnimal`, so any animal that keeps the promise fits." },
        { title: "Swap in a stand-in - ", text: "hand in a toy double to rehearse with no real dependency." },
        { title: "In SOLID - ", text: "receiving an abstraction instead of building it is the **D**, Dependency Inversion - the last of the five you will name in The SOLID Principles." },
      ],
      summaryClose: "Next: Part five - Prove it works. You made a stand-in; now use it to actually test.",
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
