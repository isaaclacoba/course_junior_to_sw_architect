// Part four - "Inherit or compose?" Write-from-scratch builds: the learner writes
// the classes themselves. The arc: real is-a inheritance, the is-a lie (compose
// instead), C#'s one-base-class limit (hold parts), combining parts, and swapping
// a part behind an interface. Sets up dependency injection. Verify probes re-run
// the learner's types differently. Data only: window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Bird : Animal\n{\n    public string Fly() { return \"flying\"; }\n}",
      expected: [
        "breathing",
        "fetching"
      ],
      requireSource: [
        {
          pattern: /class\s+Dog\s*:\s*Animal/,
          message: "Make the is-a claim: `class Dog : Animal`."
        }
      ],
      starter: "using System;\n\npublic class Animal\n{\n    public string Breathe() { return \"breathing\"; }\n}\n\n// TODO: write a Dog that inherits Animal (: Animal)\n//       and adds its own Fetch() returning \"fetching\".\n\nclass Program\n{\n    static void Main()\n    {\n        var dog = new Dog();\n        Console.WriteLine(dog.Breathe());\n        Console.WriteLine(dog.Fetch());\n    }\n}\n",
      solution: "using System;\n\npublic class Animal\n{\n    public string Breathe() { return \"breathing\"; }\n}\n\npublic class Dog : Animal\n{\n    public string Fetch()\n    {\n        return \"fetching\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var dog = new Dog();\n        Console.WriteLine(dog.Breathe());\n        Console.WriteLine(dog.Fetch());\n    }\n}\n"
    },
    {
      example: "public class Singer\n{\n    private readonly string _song;\n    private Mic _mic = new Mic();\n    public Singer(string song) { _song = song; }\n    public string Sing() { return _mic.Amp(_song); }\n}",
      expected: "HELLO",
      requireSource: [
        {
          pattern: /class\s+Parrot/,
          message: "Write a `Parrot` class."
        },
        {
          pattern: /Megaphone\s+\w+/,
          message: "Hold a `Megaphone` as a part - has-a, not is-a."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var parrot = new Parrot(\"bye\");\n        Console.WriteLine(parrot.Talk());\n    }\n}\n",
        expected: "BYE",
        message: "HELLO is right for that one word only. Talk must pass the real word to the megaphone."
      },
      starter: "using System;\n\npublic class Megaphone\n{\n    public string Boost(string text) { return text.ToUpper(); }\n}\n\n// TODO: write a Parrot that:\n//   - is given a word in its constructor (keep it in a private field)\n//   - holds a Megaphone part of its own\n//   - Talk(): returns the megaphone boosting that word\n\nclass Program\n{\n    static void Main()\n    {\n        var parrot = new Parrot(\"hello\");\n        Console.WriteLine(parrot.Talk());\n    }\n}\n",
      solution: "using System;\n\npublic class Megaphone\n{\n    public string Boost(string text) { return text.ToUpper(); }\n}\n\npublic class Parrot\n{\n    private readonly string _word;\n    private Megaphone _mega = new Megaphone();\n\n    public Parrot(string word)\n    {\n        _word = word;\n    }\n\n    public string Talk()\n    {\n        return _mega.Boost(_word);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var parrot = new Parrot(\"hello\");\n        Console.WriteLine(parrot.Talk());\n    }\n}\n"
    },
    {
      example: "public class Car\n{\n    private Engine _engine = new Engine();\n    private Radio _radio = new Radio();\n}",
      expected: "flying",
      requireSource: [
        {
          pattern: /class\s+Chimera/,
          message: "Write a `Chimera` class."
        },
        {
          pattern: /Wings\s+\w+/,
          message: "Hold a `Wings` part."
        },
        {
          pattern: /Fins\s+\w+/,
          message: "Hold a `Fins` part."
        },
        {
          pattern: /Paws\s+\w+/,
          message: "Hold a `Paws` part."
        }
      ],
      starter: "using System;\n\npublic class Wings { public string Fly() { return \"flying\"; } }\npublic class Fins  { public string Swim() { return \"swimming\"; } }\npublic class Paws  { public string Run() { return \"running\"; } }\n\n// TODO: write a Chimera that holds a Wings, a Fins and a Paws as parts,\n//       with a Go() that returns the wings' Fly().\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Chimera().Go());\n    }\n}\n",
      solution: "using System;\n\npublic class Wings { public string Fly() { return \"flying\"; } }\npublic class Fins  { public string Swim() { return \"swimming\"; } }\npublic class Paws  { public string Run() { return \"running\"; } }\n\npublic class Chimera\n{\n    private Wings _wings = new Wings();\n    private Fins _fins = new Fins();\n    private Paws _paws = new Paws();\n\n    public string Go()\n    {\n        return _wings.Fly();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Chimera().Go());\n    }\n}\n"
    },
    {
      example: "public string All()\n{\n    return _a.One() + \", \" + _b.Two();\n}",
      expected: "flying, swimming, running",
      requireSource: [
        {
          pattern: /class\s+Chimera/,
          message: "Write a `Chimera` class."
        },
        {
          pattern: /\.\s*Fly/,
          message: "Ask the wings part with `.Fly()`."
        },
        {
          pattern: /\.\s*Swim/,
          message: "Ask the fins part with `.Swim()`."
        },
        {
          pattern: /\.\s*Run/,
          message: "Ask the paws part with `.Run()`."
        }
      ],
      starter: "using System;\n\npublic class Wings { public string Fly() { return \"flying\"; } }\npublic class Fins  { public string Swim() { return \"swimming\"; } }\npublic class Paws  { public string Run() { return \"running\"; } }\n\n// TODO: write a Chimera holding the three parts, with a Show() that returns\n//       all three moves joined as \"flying, swimming, running\".\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Chimera().Show());\n    }\n}\n",
      solution: "using System;\n\npublic class Wings { public string Fly() { return \"flying\"; } }\npublic class Fins  { public string Swim() { return \"swimming\"; } }\npublic class Paws  { public string Run() { return \"running\"; } }\n\npublic class Chimera\n{\n    private Wings _wings = new Wings();\n    private Fins _fins = new Fins();\n    private Paws _paws = new Paws();\n\n    public string Show()\n    {\n        return _wings.Fly() + \", \" + _fins.Swim() + \", \" + _paws.Run();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(new Chimera().Show());\n    }\n}\n"
    },
    {
      example: "public class RobotLegs : ILegs\n{\n    public string Run()\n    {\n        return \"whirring\";\n    }\n}",
      expected: "sprinting",
      requireSource: [
        {
          pattern: /class\s+CheetahLegs\s*:\s*ILegs/,
          message: "Make `CheetahLegs` keep the promise: `: ILegs`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var creature = new Chimera(new DogLegs());\n        Console.WriteLine(creature.Move());\n    }\n}\n",
        expected: "running",
        message: "The creature must use whatever legs it is handed. With DogLegs, Move should say running."
      },
      starter: "using System;\n\npublic interface ILegs\n{\n    string Run();\n}\n\npublic class DogLegs : ILegs\n{\n    public string Run() { return \"running\"; }\n}\n\npublic class Chimera\n{\n    private readonly ILegs _legs;\n    public Chimera(ILegs legs) { _legs = legs; }\n    public string Move() { return _legs.Run(); }\n}\n\n// TODO: write a CheetahLegs that keeps the ILegs promise\n//       and whose Run() returns \"sprinting\".\n\nclass Program\n{\n    static void Main()\n    {\n        var creature = new Chimera(new CheetahLegs());\n        Console.WriteLine(creature.Move());\n    }\n}\n",
      solution: "using System;\n\npublic interface ILegs\n{\n    string Run();\n}\n\npublic class DogLegs : ILegs\n{\n    public string Run() { return \"running\"; }\n}\n\npublic class Chimera\n{\n    private readonly ILegs _legs;\n    public Chimera(ILegs legs) { _legs = legs; }\n    public string Move() { return _legs.Run(); }\n}\n\npublic class CheetahLegs : ILegs\n{\n    public string Run()\n    {\n        return \"sprinting\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var creature = new Chimera(new CheetahLegs());\n        Console.WriteLine(creature.Move());\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.BUILD_CONFIG = {
    prefix: "comp",
    metaLabel: "Build with objects · Inherit or compose",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "composition_awarded",
    awardAmount: 25,
  };
})();
