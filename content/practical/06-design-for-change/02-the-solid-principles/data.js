// Part six - "Design for change": The SOLID principles. Write-from-scratch
// builds over one small animal-shelter codebase.
//
// S is taught as THREE cards, not one, because the cost SOLID avoids is
// counterfactual: it only shows up at the SECOND change. A single "write these
// classes" card makes a learner pay for an abstraction and collect none of the
// benefit, which is exactly why the lesson used to read as overengineering.
// So: card 1 writes the naive thing that works, card 2 makes a change to it and
// feels the rule living in two places, card 3 makes the SAME change in a shape
// where it lives in one. O, L, I and D then each get a single card, because by
// then the argument has been won and only the move is new.
//
// Every task carries the data behind the LIVE GOAL TRACKER:
//   blueprint - the target types and member SIGNATURES the card's panel shows,
//               ghosted until the learner's own code declares them;
//   goalCheck - one gate per goal line, index-aligned with the localized goal
//               prose, or null for a goal that has no structural test.
// Both are guides. Grading is still output + requireSource + the hidden verify
// probe, and tools/validate.mjs asserts that every gate lights up on the
// authored solution, so a box can never sit dashed forever.
//
// Data only: window.LESSON_CONFIG (the build plugin reads it, loaded after).
(function () {
  "use strict";

  const tasks = [
    // ---- S, card 1 of 3: the naive thing, and it works ---------------------
    {
      example: "public class Door\n{\n    public string CheckAndLabel(bool locked)\n    {\n        return locked ? \"SHUT\" : \"OPEN\";\n    }\n}",
      expected: "FEED",
      blueprint: [
        { name: "Cat", kind: "class", members: ["string CheckAndSign(int hoursSinceMeal)"] }
      ],
      goalCheck: [
        { type: "Cat", member: "CheckAndSign" },
        null,
        null
      ],
      requireSource: [
        {
          pattern: /string\s+CheckAndSign\s*\(\s*int/,
          message: "Give `Cat` a `string CheckAndSign(int hoursSinceMeal)` method."
        },
        {
          pattern: /hoursSinceMeal\s*>=\s*6|6\s*<=\s*hoursSinceMeal/,
          message: "Decide from the hours you were given: six or more means the cat needs feeding."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var cat = new Cat();\n        System.Console.WriteLine(cat.CheckAndSign(2));\n    }\n}\n",
        expected: "FULL",
        message: "The card has to be decided from the hours passed in, not fixed. A cat that ate two hours ago should read FULL."
      },
      starter: "using System;\n\npublic class Cat\n{\n    // TODO: six or more hours since the last meal means the card reads FEED.\n    // Anything less reads FULL.\n    public string CheckAndSign(int hoursSinceMeal)\n    {\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var whiskers = new Cat();\n        Console.WriteLine(whiskers.CheckAndSign(7));\n    }\n}\n",
      solution: "using System;\n\npublic class Cat\n{\n    public string CheckAndSign(int hoursSinceMeal)\n    {\n        return hoursSinceMeal >= 6 ? \"FEED\" : \"FULL\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var whiskers = new Cat();\n        Console.WriteLine(whiskers.CheckAndSign(7));\n    }\n}\n"
    },

    // ---- S, card 2 of 3: the change arrives, and the rule is in two places --
    {
      expected: [
        "FEED",
        "FEED",
        "FULL",
        "2 need feeding"
      ],
      blueprint: [
        { name: "Cat", kind: "class", members: ["string CheckAndSign(int hoursSinceMeal)"] },
        { name: "FrontDesk", kind: "class", members: ["int HungryCount(List<int> hours)"] }
      ],
      goalCheck: [
        null,
        null,
        null
      ],
      requireSource: [
        {
          pattern: /^(?![\s\S]*>=\s*6)[\s\S]*$/,
          message: "There is still a `>= 6` in the file. The vet said four hours - and the rule is written in more than one place."
        },
        {
          pattern: /class\s+FrontDesk/,
          message: "Keep the `FrontDesk` - the point of this card is that both places have to agree."
        }
      ],
      starter: "using System;\nusing System.Collections.Generic;\n\npublic class Cat\n{\n    public string CheckAndSign(int hoursSinceMeal)\n    {\n        return hoursSinceMeal >= 6 ? \"FEED\" : \"FULL\";\n    }\n}\n\npublic class FrontDesk\n{\n    // The desk needs a NUMBER, and CheckAndSign only hands out words,\n    // so the rule got written out a second time.\n    public int HungryCount(List<int> hours)\n    {\n        int n = 0;\n        foreach (int h in hours)\n        {\n            if (h >= 6) n++;\n        }\n        return n;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat();\n        var desk = new FrontDesk();\n        var hours = new List<int> { 7, 5, 2 };\n\n        foreach (int h in hours)\n        {\n            Console.WriteLine(cat.CheckAndSign(h));\n        }\n        Console.WriteLine(desk.HungryCount(hours) + \" need feeding\");\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\npublic class Cat\n{\n    public string CheckAndSign(int hoursSinceMeal)\n    {\n        return hoursSinceMeal >= 4 ? \"FEED\" : \"FULL\";\n    }\n}\n\npublic class FrontDesk\n{\n    public int HungryCount(List<int> hours)\n    {\n        int n = 0;\n        foreach (int h in hours)\n        {\n            if (h >= 4) n++;\n        }\n        return n;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat();\n        var desk = new FrontDesk();\n        var hours = new List<int> { 7, 5, 2 };\n\n        foreach (int h in hours)\n        {\n            Console.WriteLine(cat.CheckAndSign(h));\n        }\n        Console.WriteLine(desk.HungryCount(hours) + \" need feeding\");\n    }\n}\n"
    },

    // ---- S, card 3 of 3: the same change, in a shape that only says it once -
    {
      example: "public class Door\n{\n    private bool _locked;\n\n    public Door(bool locked)\n    {\n        _locked = locked;\n    }\n\n    public bool IsLocked()\n    {\n        return _locked;\n    }\n}\n\npublic class DoorSign\n{\n    public string Format(bool locked)\n    {\n        return locked ? \"SHUT\" : \"OPEN\";\n    }\n}",
      expected: [
        "FEED",
        "FEED",
        "FULL",
        "2 need feeding"
      ],
      blueprint: [
        { name: "Cat", kind: "class", members: ["bool IsHungry()"] },
        { name: "FeedingSign", kind: "class", members: ["string Format(bool hungry)"] },
        { name: "FrontDesk", kind: "class", members: ["int HungryCount(List<Cat> cats)"] }
      ],
      goalCheck: [
        { type: "Cat", member: "IsHungry" },
        { type: "FeedingSign", member: "Format" },
        { type: "FrontDesk", member: "HungryCount" },
        { absent: "CheckAndSign" },
        null
      ],
      requireSource: [
        {
          pattern: /bool\s+IsHungry\s*\(\s*\)/,
          message: "Give `Cat` a `bool IsHungry()` that answers from its own stored hours."
        },
        {
          pattern: /class\s+FeedingSign/,
          message: "Move the card's wording into its own `FeedingSign` class."
        },
        {
          pattern: /string\s+Format\s*\(\s*bool/,
          message: "Give `FeedingSign` a `string Format(bool hungry)` that returns the word."
        },
        {
          pattern: /int\s+HungryCount\s*\(/,
          message: "Keep a `FrontDesk` with an `int HungryCount(...)` - the desk still needs its number."
        },
        {
          pattern: /^(?![\s\S]*CheckAndSign)[\s\S]*$/,
          message: "`CheckAndSign` did two jobs at once. Nothing should be left that both decides and writes."
        },
        {
          pattern: /^(?![\s\S]*>=\s*6)[\s\S]*$/,
          message: "Four hours, not six - and this time there should be only one line to change."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var cats = new System.Collections.Generic.List<Cat> { new Cat(9), new Cat(1) };\n        var sign = new FeedingSign();\n        var desk = new FrontDesk();\n        System.Console.WriteLine(sign.Format(cats[0].IsHungry()));\n        System.Console.WriteLine(sign.Format(cats[1].IsHungry()));\n        System.Console.WriteLine(desk.HungryCount(cats) + \" need feeding\");\n    }\n}\n",
        expected: [
          "FEED",
          "FULL",
          "1 need feeding"
        ],
        message: "Every cat has to answer from its own hours. Given a cat at nine hours and one at one hour, the cards should read FEED then FULL, and the desk should count one."
      },
      starter: "using System;\nusing System.Collections.Generic;\n\npublic class Cat\n{\n    // TODO: remember the hours since this cat's last meal, and answer\n    // IsHungry() from them. Four or more hours means hungry.\n}\n\npublic class FeedingSign\n{\n    // TODO: turn a yes-or-no into the card's word: \"FEED\" or \"FULL\".\n}\n\npublic class FrontDesk\n{\n    // TODO: count how many of these cats say they are hungry.\n    // Ask each cat - do not repeat the rule here.\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cats = new List<Cat> { new Cat(7), new Cat(5), new Cat(2) };\n        var sign = new FeedingSign();\n        var desk = new FrontDesk();\n\n        foreach (Cat c in cats)\n        {\n            Console.WriteLine(sign.Format(c.IsHungry()));\n        }\n        Console.WriteLine(desk.HungryCount(cats) + \" need feeding\");\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\npublic class Cat\n{\n    private int _hoursSinceMeal;\n\n    public Cat(int hoursSinceMeal)\n    {\n        _hoursSinceMeal = hoursSinceMeal;\n    }\n\n    public bool IsHungry()\n    {\n        return _hoursSinceMeal >= 4;\n    }\n}\n\npublic class FeedingSign\n{\n    public string Format(bool hungry)\n    {\n        return hungry ? \"FEED\" : \"FULL\";\n    }\n}\n\npublic class FrontDesk\n{\n    public int HungryCount(List<Cat> cats)\n    {\n        int n = 0;\n        foreach (Cat c in cats)\n        {\n            if (c.IsHungry()) n++;\n        }\n        return n;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cats = new List<Cat> { new Cat(7), new Cat(5), new Cat(2) };\n        var sign = new FeedingSign();\n        var desk = new FrontDesk();\n\n        foreach (Cat c in cats)\n        {\n            Console.WriteLine(sign.Format(c.IsHungry()));\n        }\n        Console.WriteLine(desk.HungryCount(cats) + \" need feeding\");\n    }\n}\n"
    },

    // ---- O: add an animal without reopening what works ---------------------
    {
      example: "public interface IGreeting\n{\n    string Say();\n}\n\npublic class Hello : IGreeting\n{\n    public string Say()\n    {\n        return \"hi\";\n    }\n}\n\npublic class Bye : IGreeting\n{\n    public string Say()\n    {\n        return \"later\";\n    }\n}",
      expected: "Meow",
      blueprint: [
        { name: "IAnimal", kind: "interface", members: ["string Speak()"] },
        { name: "Cat", kind: "class", bases: ["IAnimal"], members: ["string Speak()"] },
        { name: "Dog", kind: "class", bases: ["IAnimal"], members: ["string Speak()"] }
      ],
      goalCheck: [
        { type: "IAnimal", kind: "interface", member: "Speak" },
        { type: "Cat", base: "IAnimal", member: "Speak" },
        { type: "Dog", base: "IAnimal", member: "Speak" },
        { absent: "AnimalVoice" },
        null
      ],
      requireSource: [
        {
          pattern: /interface\s+IAnimal/,
          message: "Declare an `IAnimal` interface with `string Speak()`."
        },
        {
          pattern: /class\s+Cat\s*:\s*IAnimal/,
          message: "Write a `Cat` that implements `IAnimal`."
        },
        {
          pattern: /class\s+Dog\s*:\s*IAnimal/,
          message: "Write a `Dog` that implements `IAnimal`."
        },
        {
          pattern: /^(?![\s\S]*kind\s*==)[\s\S]*$/,
          message: "Drop the `kind ==` checks - each animal is now its own class, chosen by type."
        },
        {
          pattern: /^(?![\s\S]*\bswitch\b)[\s\S]*$/,
          message: "No `switch` on the kind either - the type picks the behaviour now."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        IAnimal animal = new Dog();\n        System.Console.WriteLine(animal.Speak());\n    }\n}\n",
        expected: "Woof",
        message: "Adding an animal must not touch the others. A `Dog` should speak its own sound - Woof - through the same `IAnimal`."
      },
      starter: "using System;\n\npublic class AnimalVoice\n{\n    // every new animal forces another edit to this method\n    public string Speak(string kind)\n    {\n        if (kind == \"cat\")\n            return \"Meow\";\n        if (kind == \"dog\")\n            return \"Woof\";\n        return \"unknown\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var voice = new AnimalVoice();\n        Console.WriteLine(voice.Speak(\"cat\"));\n    }\n}\n",
      solution: "using System;\n\npublic interface IAnimal\n{\n    string Speak();\n}\n\npublic class Cat : IAnimal\n{\n    public string Speak()\n    {\n        return \"Meow\";\n    }\n}\n\npublic class Dog : IAnimal\n{\n    public string Speak()\n    {\n        return \"Woof\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimal animal = new Cat();\n        Console.WriteLine(animal.Speak());\n    }\n}\n"
    },

    // ---- L: a subtype that cannot keep the promise --------------------------
    {
      example: "public interface IReadable\n{\n    string Read();\n}\n\npublic class Book : IReadable\n{\n    public string Read()\n    {\n        return \"Words\";\n    }\n}\n\npublic class BlankPage : IReadable\n{\n    public string Read()\n    {\n        return \"Empty\";\n    }\n}",
      expected: "Swim",
      blueprint: [
        { name: "IMover", kind: "interface", members: ["string Move()"] },
        { name: "Sparrow", kind: "class", bases: ["IMover"], members: ["string Move()"] },
        { name: "Penguin", kind: "class", bases: ["IMover"], members: ["string Move()"] }
      ],
      goalCheck: [
        { type: "IMover", kind: "interface", member: "Move" },
        { type: "Sparrow", base: "IMover", member: "Move" },
        { type: "Penguin", base: "IMover", member: "Move" },
        { absent: "Bird" },
        null
      ],
      requireSource: [
        {
          pattern: /interface\s+IMover/,
          message: "Declare an `IMover` interface with `string Move()` that every animal can honour."
        },
        {
          pattern: /class\s+Sparrow\s*:\s*IMover/,
          message: "Make `Sparrow` implement `IMover`."
        },
        {
          pattern: /class\s+Penguin\s*:\s*IMover/,
          message: "Make `Penguin` implement `IMover` instead of inheriting `Bird`."
        },
        {
          pattern: /^(?![\s\S]*throw\s+new)[\s\S]*$/,
          message: "No `throw` - every `Move()` must return a real move, even for a penguin."
        },
        {
          pattern: /^(?![\s\S]*:\s*Bird\b)[\s\S]*$/,
          message: "Drop the inheritance from `Bird` - a penguin is not a flying bird."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        IMover a = new Sparrow();\n        IMover b = new Penguin();\n        System.Console.WriteLine(a.Move());\n        System.Console.WriteLine(b.Move());\n    }\n}\n",
        expected: [
          "Fly",
          "Swim"
        ],
        message: "Any `IMover` must be safe to move. A `Sparrow` should read Fly and a `Penguin` should read Swim - neither may throw."
      },
      starter: "using System;\n\npublic class Bird\n{\n    public virtual string Fly()\n    {\n        return \"Flap flap\";\n    }\n}\n\npublic class Penguin : Bird\n{\n    // a penguin cannot fly, so it breaks the promise\n    public override string Fly()\n    {\n        throw new InvalidOperationException(\"penguins do not fly\");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Bird bird = new Penguin();\n        Console.WriteLine(bird.Fly());\n    }\n}\n",
      solution: "using System;\n\npublic interface IMover\n{\n    string Move();\n}\n\npublic class Sparrow : IMover\n{\n    public string Move()\n    {\n        return \"Fly\";\n    }\n}\n\npublic class Penguin : IMover\n{\n    public string Move()\n    {\n        return \"Swim\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IMover bird = new Penguin();\n        Console.WriteLine(bird.Move());\n    }\n}\n"
    },

    // ---- I: don't make a class carry moves it never makes -------------------
    {
      example: "public interface IWasher\n{\n    string Wash();\n}\n\npublic interface IDryer\n{\n    string Dry();\n}\n\npublic class HandTowel : IDryer\n{\n    public string Dry()\n    {\n        return \"dry\";\n    }\n}",
      expected: "swim",
      blueprint: [
        { name: "IWalker", kind: "interface", members: ["string Walk()"] },
        { name: "ISwimmer", kind: "interface", members: ["string Swim()"] },
        { name: "IFlyer", kind: "interface", members: ["string Fly()"] },
        { name: "Fish", kind: "class", bases: ["ISwimmer"], members: ["string Swim()"] }
      ],
      goalCheck: [
        { type: "IWalker", kind: "interface", member: "Walk" },
        { type: "ISwimmer", kind: "interface", member: "Swim" },
        { type: "IFlyer", kind: "interface", member: "Fly" },
        { type: "Fish", base: "ISwimmer", member: "Swim" },
        { absent: "IAnimalActions" },
        null
      ],
      requireSource: [
        {
          pattern: /interface\s+ISwimmer/,
          message: "Split the fat interface: declare an `ISwimmer` with `string Swim()`."
        },
        {
          pattern: /interface\s+IWalker/,
          message: "Declare an `IWalker` with `string Walk()` as its own interface."
        },
        {
          pattern: /interface\s+IFlyer/,
          message: "Declare an `IFlyer` with `string Fly()` as its own interface."
        },
        {
          pattern: /class\s+Fish\s*:\s*ISwimmer/,
          message: "`Fish` should implement only `ISwimmer` - the interface it actually needs."
        },
        {
          pattern: /^(?![\s\S]*interface\s+IAnimalActions)[\s\S]*$/,
          message: "Drop the fat `IAnimalActions` - an animal should not depend on moves it never makes."
        },
        {
          pattern: /^(?![\s\S]*NotImplementedException)[\s\S]*$/,
          message: "No fake `Walk`/`Fly` bodies - if `Fish` only swims, it should not have them at all."
        }
      ],
      verify: {
        main: "class Program\n{\n    class Dolphin : ISwimmer\n    {\n        public string Swim()\n        {\n            return \"glide\";\n        }\n    }\n    static void Main()\n    {\n        ISwimmer swimmer = new Dolphin();\n        System.Console.WriteLine(swimmer.Swim());\n    }\n}\n",
        expected: "glide",
        message: "`ISwimmer` should stand on its own, so any swimmer can implement just it without a `Walk` or `Fly` in sight."
      },
      starter: "using System;\n\npublic interface IAnimalActions\n{\n    string Walk();\n    string Swim();\n    string Fly();\n}\n\n// a fish only swims, but the fat interface forces all three\npublic class Fish : IAnimalActions\n{\n    public string Walk()\n    {\n        throw new NotImplementedException();\n    }\n\n    public string Swim()\n    {\n        return \"swim\";\n    }\n\n    public string Fly()\n    {\n        throw new NotImplementedException();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IAnimalActions fish = new Fish();\n        Console.WriteLine(fish.Swim());\n    }\n}\n",
      solution: "using System;\n\npublic interface IWalker\n{\n    string Walk();\n}\n\npublic interface ISwimmer\n{\n    string Swim();\n}\n\npublic interface IFlyer\n{\n    string Fly();\n}\n\n// the fish implements only the interface it needs\npublic class Fish : ISwimmer\n{\n    public string Swim()\n    {\n        return \"swim\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        ISwimmer fish = new Fish();\n        Console.WriteLine(fish.Swim());\n    }\n}\n"
    },

    // ---- D: ask for what you need, take it from outside ---------------------
    {
      example: "public interface IClock\n{\n    int Hour();\n}\n\npublic class Alarm\n{\n    private readonly IClock _clock;\n\n    public Alarm(IClock clock)\n    {\n        _clock = clock;\n    }\n}",
      expected: "cat fed",
      blueprint: [
        { name: "ILog", kind: "interface", members: ["void Write(string message)"] },
        { name: "ConsoleLog", kind: "class", bases: ["ILog"], members: ["void Write(string message)"] },
        { name: "Keeper", kind: "class", members: ["void Feed()"] }
      ],
      goalCheck: [
        { type: "ILog", kind: "interface", member: "Write" },
        { type: "ConsoleLog", base: "ILog", member: "Write" },
        null,
        null,
        null
      ],
      requireSource: [
        {
          pattern: /interface\s+ILog/,
          message: "Declare an `ILog` interface with `void Write(string message)`."
        },
        {
          pattern: /class\s+ConsoleLog\s*:\s*ILog/,
          message: "Make `ConsoleLog` implement `ILog`."
        },
        {
          pattern: /Keeper\s*\(\s*ILog/,
          message: "Have `Keeper` receive an `ILog` through its constructor."
        },
        {
          pattern: /^(?![\s\S]*=\s*new\s+ConsoleLog\s*\(\s*\)\s*;)[\s\S]*$/,
          message: "Don't build the log inside `Keeper` - the field must be assigned from the constructor parameter, not `new`ed."
        }
      ],
      verify: {
        main: "class Program\n{\n    class FakeLog : ILog\n    {\n        public string Last = \"\";\n        public void Write(string message)\n        {\n            Last = message;\n        }\n    }\n    static void Main()\n    {\n        var fake = new FakeLog();\n        var keeper = new Keeper(fake);\n        keeper.Feed();\n        System.Console.WriteLine(fake.Last);\n    }\n}\n",
        expected: "cat fed",
        message: "The point of injecting is that a test can pass a fake. Store the injected `ILog` and call it, so a `FakeLog` records the message instead of printing."
      },
      starter: "using System;\n\npublic class ConsoleLog\n{\n    public void Write(string message)\n    {\n        Console.WriteLine(message);\n    }\n}\n\npublic class Keeper\n{\n    // the keeper builds its own log - welded to the console\n    private readonly ConsoleLog _log = new ConsoleLog();\n\n    public void Feed()\n    {\n        _log.Write(\"cat fed\");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper();\n        keeper.Feed();\n    }\n}\n",
      solution: "using System;\n\npublic interface ILog\n{\n    void Write(string message);\n}\n\npublic class ConsoleLog : ILog\n{\n    public void Write(string message)\n    {\n        Console.WriteLine(message);\n    }\n}\n\npublic class Keeper\n{\n    private readonly ILog _log;\n\n    public Keeper(ILog log)\n    {\n        _log = log;\n    }\n\n    public void Feed()\n    {\n        _log.Write(\"cat fed\");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var keeper = new Keeper(new ConsoleLog());\n        keeper.Feed();\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "l2",
    metaLabel: "Design for change · The SOLID principles",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    // A new award key: the card list changed shape, and awards are stored by
    // card INDEX. Reusing the old key would mark the new cards done from the
    // old lesson's progress and report XP for work nobody did.
    awardedKey: "solid_awarded",
    awardAmount: 25,
  };
})();
