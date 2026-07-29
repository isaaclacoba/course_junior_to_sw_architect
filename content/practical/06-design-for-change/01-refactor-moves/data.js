// Part six - "Design for change", bridge lesson: Refactor moves. Write-from-
// scratch builds. The point: refactoring means changing the shape of code while
// its behaviour stays the same. Each drill hands a small tangled-but-working
// program and asks for one clean move - the same moves the SOLID principles will
// name next. The expected output never changes (behaviour preserved); the
// requireSource gate enforces the new shape; a hidden verify probe proves the
// refactor is real, not faked.
// Data only: window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Move the behaviour onto the data",
      concept: "Encapsulation",
      context:
        "When any code can change a value directly, no one owns the rules about it - a bad value can creep in from anywhere.\n\n**Encapsulation** keeps data and its rules in one class: private fields, methods that guard them. One place to trust, one place to fix.\n\nHere: a loose method in `Program` reaches into `Cage`'s public fields to decide if it is full.",
      example:
        "public class Jar\n{\n    private readonly int _cookies;\n    public Jar(int cookies) { _cookies = cookies; }\n    public bool IsEmpty() { return _cookies == 0; }\n}",
      goal: [
        "Give `Cage` a constructor `Cage(int animals, int capacity)` and make its fields private.",
        "Move the rule onto `Cage` as an instance method `IsFull()` returning `animals >= capacity`.",
        "Have `Main` build `new Cage(3, 3)` and call `cage.IsFull()`. The output stays `FULL`.",
      ],
      expected: "FULL",
      requireSource: [
        { pattern: /bool\s+IsFull\s*\(\s*\)/, message: "Give `Cage` an instance method `bool IsFull()` with no arguments - it already has the data." },
        { pattern: /Cage\s*\(\s*int/, message: "Give `Cage` a constructor `Cage(int animals, int capacity)`." },
        { pattern: /^(?![\s\S]*static\s+bool\s+IsFull)[\s\S]*$/, message: "Move the rule onto `Cage`; drop the loose `static IsFull` in `Program`." },
        { pattern: /^(?![\s\S]*public\s+int\s+(?:Animals|Capacity)\s*;)[\s\S]*$/, message: "Close the fields off - a `Cage` should own its state, not expose it as public fields." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var cage = new Cage(2, 5);\n        System.Console.WriteLine(cage.IsFull() ? "FULL" : "ROOM");\n    }\n}\n',
        expected: "ROOM",
        message:
          "`IsFull` should answer from the cage's own data. With room to spare (2 of 5) it should read ROOM.",
      },
      starter:
        'using System;\n\npublic class Cage\n{\n    public int Animals;\n    public int Capacity;\n}\n\nclass Program\n{\n    // the rule sits outside the data it works on\n    static bool IsFull(Cage cage)\n    {\n        return cage.Animals >= cage.Capacity;\n    }\n\n    static void Main()\n    {\n        var cage = new Cage { Animals = 3, Capacity = 3 };\n        Console.WriteLine(IsFull(cage) ? "FULL" : "ROOM");\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cage\n{\n    private readonly int _animals;\n    private readonly int _capacity;\n\n    public Cage(int animals, int capacity)\n    {\n        _animals = animals;\n        _capacity = capacity;\n    }\n\n    public bool IsFull()\n    {\n        return _animals >= _capacity;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cage = new Cage(3, 3);\n        Console.WriteLine(cage.IsFull() ? "FULL" : "ROOM");\n    }\n}\n',
    },
    {
      title: "Depend on the shape, not the thing",
      concept: "Program to an interface",
      context:
        "When a class works directly with one exact type, it is stuck with that choice - swapping or testing it means editing the class.\n\n**Program to an interface** makes a class depend on what something does, not which class it is. Anything that fits the interface drops in - including a test fake.\n\nHere: `Vet` only accepts a `Dog`, so it cannot treat a cat - or a fake patient in a test.",
      example:
        "public interface IShape { double Area(); }\npublic class Box : IShape { public double Area() { return 4; } }\n\npublic class Canvas\n{\n    private readonly IShape _shape;\n    public Canvas(IShape shape) { _shape = shape; }\n}",
      goal: [
        "Declare an interface `IPet` with `string Checkup()`.",
        "Make `Dog` implement `IPet`, with `Checkup()` returning `\"HEALTHY\"`.",
        "Change `Vet` to hold an `IPet`, not a `Dog`. The output stays `HEALTHY`.",
      ],
      expected: "HEALTHY",
      requireSource: [
        { pattern: /interface\s+IPet/, message: "Declare an `IPet` interface with `string Checkup()`." },
        { pattern: /class\s+Dog\s*:\s*IPet/, message: "Make `Dog` implement `IPet`." },
        { pattern: /Vet\s*\(\s*IPet/, message: "Have `Vet` take an `IPet` in its constructor, not a `Dog`." },
      ],
      verify: {
        main:
          'class Program\n{\n    class Parrot : IPet\n    {\n        public string Checkup() { return "COUGH"; }\n    }\n    static void Main()\n    {\n        var vet = new Vet(new Parrot());\n        System.Console.WriteLine(vet.Visit());\n    }\n}\n',
        expected: "COUGH",
        message:
          "Your `Vet` is still tied to `Dog`. Depend on `IPet` so any patient - even a parrot - can be handed in.",
      },
      starter:
        'using System;\n\npublic class Dog\n{\n    public string Checkup() { return "HEALTHY"; }\n}\n\npublic class Vet\n{\n    // works directly with Dog - no other patient fits\n    private readonly Dog _patient;\n\n    public Vet(Dog patient)\n    {\n        _patient = patient;\n    }\n\n    public string Visit()\n    {\n        return _patient.Checkup();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var vet = new Vet(new Dog());\n        Console.WriteLine(vet.Visit());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IPet\n{\n    string Checkup();\n}\n\npublic class Dog : IPet\n{\n    public string Checkup() { return "HEALTHY"; }\n}\n\npublic class Vet\n{\n    private readonly IPet _patient;\n\n    public Vet(IPet patient)\n    {\n        _patient = patient;\n    }\n\n    public string Visit()\n    {\n        return _patient.Checkup();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var vet = new Vet(new Dog());\n        Console.WriteLine(vet.Visit());\n    }\n}\n',
    },
    {
      title: "Hand it in, don't build it in",
      concept: "Inject the dependency",
      context:
        "A class that builds its own tools is stuck with them - you cannot hand it a different one for a test or another case.\n\n**Inject the dependency** means passing in what a class needs instead of letting it build its own. The caller chooses what to give it.\n\nHere: the `Coop` builds its own clock, so it always opens at the real hour - a test cannot pretend it is night.",
      example:
        "public class Order\n{\n    private readonly IClock _clock;\n    public Order(IClock clock) { _clock = clock; }\n}",
      goal: [
        "Change `Coop` to take an `IClock` in its constructor and store it, instead of newing `SunClock` inside.",
        "Update `Main` to hand the clock in: `new Coop(new SunClock())`. The output stays `open`.",
      ],
      expected: "open",
      requireSource: [
        { pattern: /Coop\s*\(\s*IClock/, message: "Have `Coop` take an `IClock` in its constructor." },
      ],
      verify: {
        main:
          'class Program\n{\n    class NightClock : IClock\n    {\n        public int Hour() { return 20; }\n    }\n    static void Main()\n    {\n        var coop = new Coop(new NightClock());\n        System.Console.WriteLine(coop.Door());\n    }\n}\n',
        expected: "shut",
        message:
          "Your `Coop` still builds its own clock, so it ignores the one handed in. Store the injected `IClock` and use it in `Door`.",
      },
      starter:
        'using System;\n\npublic interface IClock { int Hour(); }\n\npublic class SunClock : IClock\n{\n    public int Hour() { return 9; }\n}\n\npublic class Coop\n{\n    // builds its own clock, so a test cannot swap it\n    private readonly IClock _clock = new SunClock();\n\n    public string Door()\n    {\n        return _clock.Hour() < 18 ? "open" : "shut";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var coop = new Coop();\n        Console.WriteLine(coop.Door());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IClock { int Hour(); }\n\npublic class SunClock : IClock\n{\n    public int Hour() { return 9; }\n}\n\npublic class Coop\n{\n    private readonly IClock _clock;\n\n    public Coop(IClock clock)\n    {\n        _clock = clock;\n    }\n\n    public string Door()\n    {\n        return _clock.Hour() < 18 ? "open" : "shut";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var coop = new Coop(new SunClock());\n        Console.WriteLine(coop.Door());\n    }\n}\n',
    },
    {
      title: "Let each object answer for itself",
      concept: "Polymorphism",
      context:
        "One method that branches on a type has to know every case, and you edit it each time a new one appears.\n\n**Polymorphism** lets each type carry its own version of a method. You call it and the right one runs - no branching.\n\nHere: `Zoo` checks each animal's kind with `if`/`else`, so every new animal means editing `Zoo`.",
      example:
        'public interface IShape { string Name(); }\npublic class Box : IShape { public string Name() { return "box"; } }\npublic class Ball : IShape { public string Name() { return "ball"; } }\n\nforeach (IShape shape in shapes)\n    Console.WriteLine(shape.Name());',
      goal: [
        "Declare `interface IAnimal { string Speak(); }`, and write a `Cat` (`\"Meow\"`) and `Dog` (`\"Woof\"`) that implement it.",
        "Refactor `Zoo` to hold a `List<IAnimal>`: an `Add(IAnimal animal)` and a `SpeakAll()` that loops and prints each `Speak()` - no `kind` checks.",
        "`Main` adds a `Cat` and a `Dog` to the `Zoo`, then calls `SpeakAll()`. Output stays `Meow` then `Woof`.",
      ],
      expected: ["Meow", "Woof"],
      requireSource: [
        { pattern: /interface\s+IAnimal/, message: "Declare an `IAnimal` interface with `string Speak()`." },
        { pattern: /class\s+Cat\s*:\s*IAnimal/, message: "Write a `Cat` that implements `IAnimal`." },
        { pattern: /class\s+Dog\s*:\s*IAnimal/, message: "Write a `Dog` that implements `IAnimal`." },
        { pattern: /List<IAnimal>/, message: "Have `Zoo` hold a `List<IAnimal>`, so it works with any animal." },
        { pattern: /Add\s*\(\s*IAnimal/, message: "Make `Zoo.Add` take an `IAnimal`, not a `string`." },
        { pattern: /^(?![\s\S]*kind\s*==)[\s\S]*$/, message: "Drop the `kind ==` checks - each animal answers `Speak()` itself." },
        { pattern: /^(?![\s\S]*\bswitch\b)[\s\S]*$/, message: "No `switch` on the kind - each class already knows its own sound." },
        { pattern: /\.Speak\(\)/, message: "Loop over the animals and call each one's `Speak()`." },
      ],
      verify: {
        main:
          'class Program\n{\n    class Bird : IAnimal\n    {\n        public string Speak() { return "Tweet"; }\n    }\n    static void Main()\n    {\n        var zoo = new Zoo();\n        zoo.Add(new Bird());\n        zoo.SpeakAll();\n    }\n}\n',
        expected: "Tweet",
        message:
          "A `Zoo` that holds `IAnimal` should take an animal it has never seen. Add a new kind and it should speak too, with no change to `Zoo`.",
      },
      starter:
        'using System;\nusing System.Collections.Generic;\n\npublic class Zoo\n{\n    private readonly List<string> _kinds = new List<string>();\n\n    public void Add(string kind) { _kinds.Add(kind); }\n\n    // one loop that must know every animal\n    public void SpeakAll()\n    {\n        foreach (var kind in _kinds)\n        {\n            if (kind == "cat") Console.WriteLine("Meow");\n            else if (kind == "dog") Console.WriteLine("Woof");\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        zoo.Add("cat");\n        zoo.Add("dog");\n        zoo.SpeakAll();\n    }\n}\n',
      solution:
        'using System;\nusing System.Collections.Generic;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak() { return "Meow"; }\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak() { return "Woof"; }\n}\n\npublic class Zoo\n{\n    private readonly List<IAnimal> _animals = new List<IAnimal>();\n\n    public void Add(IAnimal animal) { _animals.Add(animal); }\n\n    public void SpeakAll()\n    {\n        foreach (var animal in _animals)\n        {\n            Console.WriteLine(animal.Speak());\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var zoo = new Zoo();\n        zoo.Add(new Cat());\n        zoo.Add(new Dog());\n        zoo.SpeakAll();\n    }\n}\n',
    },
    {
      title: "One class, one job",
      concept: "Single responsibility",
      context:
        "When one class does two jobs, they tangle - a change to one can break the other, and you cannot test them apart.\n\n**Single responsibility** means one job per class, so it has one reason to change.\n\nHere: `PetShow` both scores the tricks and announces the result, so pull each into its own class and hand them to `PetShow`.\n\nKeep `Judge` and `Announcer` as plain classes - an interface earns its place when you need to swap a part out, and here you do not yet.",
      example:
        "public class Parser { public int Parse(string text) { return int.Parse(text); } }\npublic class Formatter { public string Show(int value) { return \"= \" + value; } }\n\npublic class Calc\n{\n    private readonly Parser _parser;\n    private readonly Formatter _formatter;\n    public Calc(Parser parser, Formatter formatter) { _parser = parser; _formatter = formatter; }\n    public string Run(string text) { return _formatter.Show(_parser.Parse(text)); }\n}",
      goal: [
        "Write a `Judge` whose `Score(int tricks, int faults)` returns `tricks > faults`.",
        "Write an `Announcer` whose `Announce(bool won)` returns `\"GOOD DOG\"` or `\"BAD DOG\"`.",
        "Give `PetShow` a constructor that receives a `Judge` and an `Announcer`, and have `Run` delegate to them. `Main` builds both and hands them in - the output stays `GOOD DOG`.",
      ],
      expected: "GOOD DOG",
      requireSource: [
        { pattern: /class\s+Judge/, message: "Write a `Judge` class." },
        { pattern: /Score\s*\(\s*int/, message: "Give `Judge` a `Score(int tricks, int faults)` method." },
        { pattern: /class\s+Announcer/, message: "Write an `Announcer` class." },
        { pattern: /Announce\s*\(\s*bool/, message: "Give `Announcer` an `Announce(bool won)` method." },
        { pattern: /class\s+PetShow/, message: "Keep `PetShow` as the coordinator, do not delete it." },
        { pattern: /PetShow\s*\(\s*Judge[^)]*Announcer/, message: "Give `PetShow` a constructor that receives a `Judge` and an `Announcer`, rather than newing them inside." },
        { pattern: /\.Score\s*\(/, message: "Have `PetShow` ask the `Judge` to score." },
        { pattern: /\.Announce\s*\(/, message: "Have `PetShow` ask the `Announcer` to announce." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var show = new PetShow(new Judge(), new Announcer());\n        System.Console.WriteLine(show.Run(1, 9));\n    }\n}\n',
        expected: "BAD DOG",
        message:
          "Route `PetShow` through the `Judge` and `Announcer` so any counts give the right call - more faults than tricks should read BAD DOG.",
      },
      starter:
        'using System;\n\npublic class PetShow\n{\n    // does two jobs: scores the tricks AND announces the result\n    public string Run(int tricks, int faults)\n    {\n        bool won = tricks > faults;                // the scoring\n        return won ? "GOOD DOG" : "BAD DOG";       // the announcing\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var show = new PetShow();\n        Console.WriteLine(show.Run(5, 2));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Judge\n{\n    public bool Score(int tricks, int faults)\n    {\n        return tricks > faults;\n    }\n}\n\npublic class Announcer\n{\n    public string Announce(bool won)\n    {\n        return won ? "GOOD DOG" : "BAD DOG";\n    }\n}\n\npublic class PetShow\n{\n    private readonly Judge _judge;\n    private readonly Announcer _announcer;\n\n    public PetShow(Judge judge, Announcer announcer)\n    {\n        _judge = judge;\n        _announcer = announcer;\n    }\n\n    public string Run(int tricks, int faults)\n    {\n        bool won = _judge.Score(tricks, faults);\n        return _announcer.Announce(won);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var show = new PetShow(new Judge(), new Announcer());\n        Console.WriteLine(show.Run(5, 2));\n    }\n}\n',
    },
    {
      summary: true,
      title: "Refactor moves - recap",
      concept: "Recap",
      context: "Every drill kept the output the same and changed only the shape. That is what refactoring is.",
      summaryIntro:
        "You added no features - you reshaped code that already worked. Each move has a name, and each one turns up again in the next part as one of the SOLID principles.",
      summaryItems: [
        { title: "Put behaviour with its data - ", text: "a class that owns its state owns the rules about it." },
        { title: "Program to an interface - ", text: "depend on what a thing can do, not on which thing it is." },
        { title: "Inject the dependency - ", text: "receive collaborators instead of newing them inside." },
        { title: "Replace a branch with polymorphism - ", text: "let each object answer for itself, so a new case is a new class." },
        { title: "Split a fat class - ", text: "one job per class means one reason to change." },
      ],
      summaryClose: "That is the toolkit. Next, the SOLID principles name these moves and help you judge when each one is worth making.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "rm",
    metaLabel: "Design for change \u00b7 Refactor moves",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "refactor_moves_awarded",
    awardAmount: 25,
  };
})();
