// Part four - "Inherit or compose?" Write-from-scratch builds. It answers the
// junior's question: can't we just inherit everything - even from three classes
// at once? The arc shows inheritance used well (a real is-a), then the is-a lie
// (inheriting only to borrow code), then C#'s hard limit of one base class, then
// composition as the way to combine many capabilities, and finally swapping one
// part out without disturbing the rest. Sets up the dependency-injection lesson
// (the legs are handed in through the constructor). Verify probes block hardcoded
// answers; structural tasks are gated by requireSource.
// Data only: build-engine.js reads window.BUILD_CONFIG. Animal flavour throughout.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Inherit when it is truly is-a",
      concept: "is-a reuse",
      context:
        "Inheritance is the right tool when the child genuinely is a kind of the parent. A `Dog` is an `Animal`, so it can borrow `Breathe` for free and add its own trick. The colon `: Animal` is the is-a claim. Make `Dog` inherit `Animal` and give it a `Fetch`.",
      example:
        'public class Bird : Animal\n{\n    public string Fly() => "flying";\n}',
      goal: [
        "Make `Dog` inherit `Animal`, and add a `Fetch()` that returns `\"fetching\"`.",
        "Main breathes then fetches, so the output is two lines: breathing then fetching.",
      ],
      expected: ["breathing", "fetching"],
      requireSource: [
        { pattern: /class\s+Dog\s*:\s*Animal/, message: "Make the is-a claim: `class Dog : Animal`." },
      ],
      starter:
        'using System;\n\npublic class Animal\n{\n    public string Breathe() => "breathing";\n}\n\n// TODO: make Dog inherit Animal and add Fetch() returning "fetching"\npublic class Dog\n{\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var d = new Dog();\n        Console.WriteLine(d.Breathe());\n        Console.WriteLine(d.Fetch());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Animal\n{\n    public string Breathe() => "breathing";\n}\n\npublic class Dog : Animal\n{\n    public string Fetch() => "fetching";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var d = new Dog();\n        Console.WriteLine(d.Breathe());\n        Console.WriteLine(d.Fetch());\n    }\n}\n',
    },
    {
      title: "The is-a lie",
      concept: "has-a over is-a",
      context:
        "It is tempting to inherit just to borrow a handy method. Making `Parrot` inherit `Megaphone` would reuse `Boost` - but a parrot is not a kind of megaphone, so the is-a claim is a lie that will mislead every reader. The honest move: the parrot HAS-A megaphone. Hold one as a part and ask it to do the boosting.",
      example:
        'public class Singer\n{\n    private Mic _mic = new Mic();\n    public string Sing(string s) => _mic.Amp(s);\n}',
      goal: [
        "Give `Parrot` a `Megaphone` part, and make `Talk()` return `_mega.Boost(Word)`.",
        "Main has a parrot whose Word is hello, so the output is HELLO.",
      ],
      expected: "HELLO",
      requireSource: [
        { pattern: /Megaphone\s+\w+/, message: "Hold a `Megaphone` as a part - has-a, not is-a." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var p = new Parrot { Word = "bye" };\n        Console.WriteLine(p.Talk());\n    }\n}\n',
        expected: "BYE",
        message: "HELLO is right for that one word only. Talk must pass the real Word to the megaphone.",
      },
      starter:
        'using System;\n\npublic class Megaphone\n{\n    public string Boost(string s) => s.ToUpper();\n}\n\npublic class Parrot\n{\n    public string Word = "";\n\n    // TODO: hold a Megaphone, and return _mega.Boost(Word) from Talk()\n    public string Talk()\n    {\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var p = new Parrot { Word = "hello" };\n        Console.WriteLine(p.Talk());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Megaphone\n{\n    public string Boost(string s) => s.ToUpper();\n}\n\npublic class Parrot\n{\n    public string Word = "";\n    private Megaphone _mega = new Megaphone();\n\n    public string Talk()\n    {\n        return _mega.Boost(Word);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var p = new Parrot { Word = "hello" };\n        Console.WriteLine(p.Talk());\n    }\n}\n',
    },
    {
      title: "You cannot inherit three",
      concept: "One base class only",
      context:
        "A chimera needs wings from a bird, fins from a fish and paws from a dog. The instinct is to inherit all three - but C# allows only one base class. `class Chimera : Wings, Fins, Paws` does not compile. The answer is to hold one of each as a part. Give `Chimera` the three parts and take off.",
      example:
        "// Not allowed: class Chimera : Wings, Fins, Paws\n// Allowed: hold one of each as a part.",
      goal: [
        "Give `Chimera` a `Wings`, a `Fins` and a `Paws` part, and make `Go()` return `_wings.Fly()`.",
        "Main sends it off, so the output is flying.",
      ],
      expected: "flying",
      requireSource: [
        { pattern: /Wings\s+\w+/, message: "Hold a `Wings` part." },
        { pattern: /Fins\s+\w+/, message: "Hold a `Fins` part." },
        { pattern: /Paws\s+\w+/, message: "Hold a `Paws` part." },
      ],
      starter:
        'using System;\n\npublic class Wings { public string Fly() => "flying"; }\npublic class Fins  { public string Swim() => "swimming"; }\npublic class Paws  { public string Run() => "running"; }\n\npublic class Chimera\n{\n    // TODO: hold a Wings, a Fins and a Paws as parts\n\n    public string Go()\n    {\n        // TODO: return the wings\' Fly()\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Chimera().Go());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Wings { public string Fly() => "flying"; }\npublic class Fins  { public string Swim() => "swimming"; }\npublic class Paws  { public string Run() => "running"; }\n\npublic class Chimera\n{\n    private Wings _wings = new Wings();\n    private Fins _fins = new Fins();\n    private Paws _paws = new Paws();\n\n    public string Go()\n    {\n        return _wings.Fly();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Chimera().Go());\n    }\n}\n',
    },
    {
      title: "Combine the parts",
      concept: "Delegate to each part",
      context:
        "Holding the parts is what lets one creature do many things - by asking each part to do its bit. It is what inheriting three classes was reaching for and could not get. Make `Act()` gather a move from all three parts.",
      example:
        '// Ask each part in turn and join the answers.\n// return _wings.Fly() + ", " + _fins.Swim();',
      goal: [
        "Make `Show()` return the wings, fins and paws moves joined as `\"flying, swimming, running\"`.",
      ],
      expected: "flying, swimming, running",
      requireSource: [
        { pattern: /_wings\s*\.\s*Fly/, message: "Ask the wings part with `_wings.Fly()`." },
        { pattern: /_fins\s*\.\s*Swim/, message: "Ask the fins part with `_fins.Swim()`." },
        { pattern: /_paws\s*\.\s*Run/, message: "Ask the paws part with `_paws.Run()`." },
      ],
      starter:
        'using System;\n\npublic class Wings { public string Fly() => "flying"; }\npublic class Fins  { public string Swim() => "swimming"; }\npublic class Paws  { public string Run() => "running"; }\n\npublic class Chimera\n{\n    private Wings _wings = new Wings();\n    private Fins _fins = new Fins();\n    private Paws _paws = new Paws();\n\n    public string Show()\n    {\n        // TODO: return _wings.Fly() + ", " + _fins.Swim() + ", " + _paws.Run()\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Chimera().Show());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Wings { public string Fly() => "flying"; }\npublic class Fins  { public string Swim() => "swimming"; }\npublic class Paws  { public string Run() => "running"; }\n\npublic class Chimera\n{\n    private Wings _wings = new Wings();\n    private Fins _fins = new Fins();\n    private Paws _paws = new Paws();\n\n    public string Show()\n    {\n        return _wings.Fly() + ", " + _fins.Swim() + ", " + _paws.Run();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Chimera().Show());\n    }\n}\n',
    },
    {
      title: "Swap a part, leave the rest",
      concept: "Composition is flexible",
      context:
        "A deep inheritance tree is rigid - changing a parent ripples through every child. Parts are loose. Put the legs behind an `ILegs` promise, hand a pair to the creature, and you can swap dog legs for cheetah legs without touching `Chimera` at all. Implement the cheetah legs.",
      example:
        "// public class CheetahLegs : ILegs\n// { public string Run() => ...; }",
      goal: [
        "Make `CheetahLegs.Run()` return `\"sprinting\"`.",
        "Main hands the creature `CheetahLegs`, so the output is sprinting.",
      ],
      expected: "sprinting",
      requireSource: [
        { pattern: /class\s+CheetahLegs\s*:\s*ILegs/, message: "Make `CheetahLegs` keep the promise: `: ILegs`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var c = new Chimera(new DogLegs());\n        Console.WriteLine(c.Move());\n    }\n}\n',
        expected: "running",
        message: "The creature must use whatever legs it is handed. With DogLegs, Move should say running.",
      },
      starter:
        'using System;\n\npublic interface ILegs\n{\n    string Run();\n}\n\npublic class DogLegs : ILegs\n{\n    public string Run() => "running";\n}\n\npublic class CheetahLegs : ILegs\n{\n    // TODO: return "sprinting"\n    public string Run() => "";\n}\n\npublic class Chimera\n{\n    private readonly ILegs _legs;\n    public Chimera(ILegs legs) { _legs = legs; }\n    public string Move() => _legs.Run();\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Chimera(new CheetahLegs());\n        Console.WriteLine(c.Move());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface ILegs\n{\n    string Run();\n}\n\npublic class DogLegs : ILegs\n{\n    public string Run() => "running";\n}\n\npublic class CheetahLegs : ILegs\n{\n    public string Run() => "sprinting";\n}\n\npublic class Chimera\n{\n    private readonly ILegs _legs;\n    public Chimera(ILegs legs) { _legs = legs; }\n    public string Move() => _legs.Run();\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Chimera(new CheetahLegs());\n        Console.WriteLine(c.Move());\n    }\n}\n',
    },
    {
      summary: true,
      title: "Inherit or compose? - recap",
      concept: "Recap",
      context: "Inheritance has one honest use; for everything else, hold parts.",
      summaryIntro:
        "Inheritance is for a true is-a relationship. To combine capabilities, hold parts - it stays flexible where a deep tree turns rigid.",
      summaryItems: [
        { title: "is-a - ", text: "inherit only when the child really is a kind of the parent." },
        { title: "The is-a lie - ", text: "inheriting just to borrow a method misleads every reader." },
        { title: "has-a - ", text: "hold a part as a field and ask it to do the work." },
        { title: "One base class - ", text: "C# forbids inheriting three; compose the three parts instead." },
        { title: "Swap a part - ", text: "behind an interface, replace one part without touching the rest." },
      ],
      summaryClose: "Next: Why inject?",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "comp",
    metaLabel: "Build with objects \u00b7 Inherit or compose",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "composition_awarded",
    awardAmount: 25,
  };
})();
