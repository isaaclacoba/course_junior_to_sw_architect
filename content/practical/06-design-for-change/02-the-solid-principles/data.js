// Part six - "Design for change": The SOLID principles. Write-from-scratch
// builds. One small test-automation codebase, one principle per task, each in
// order S, O, L, I, D. Every task describes the trap in plain prose (the bad
// shape and its concrete cost), then asks the learner to write the fix. The
// output is fixed, the requireSource gate enforces the SOLID technique, and a
// hidden verify probe re-runs the learner's classes against different inputs so
// a faked answer cannot pass. Data only: window.LESSON_CONFIG (the build plugin
// reads it, loaded after this file).
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Door\n{\n    private bool _open;\n\n    public Door(bool open)\n    {\n        _open = open;\n    }\n\n    public bool IsOpen()\n    {\n        return _open;\n    }\n}\n\npublic class DoorSign\n{\n    public string Show(Door door)\n    {\n        return door.IsOpen() ? \"OPEN\" : \"SHUT\";\n    }\n}",
      expected: "FEED",
      requireSource: [
        {
          pattern: /class\s+FeedingSign/,
          message: "Move the sign text into its own `FeedingSign` class."
        },
        {
          pattern: /string\s+Format\s*\(\s*bool/,
          message: "Give `FeedingSign` a `Format(bool hungry)` method that returns the text."
        },
        {
          pattern: /public\s+Cat\s*\(\s*bool/,
          message: "Give `Cat` a constructor that takes whether it is hungry and stores it in a field."
        },
        {
          pattern: /bool\s+IsHungry\s*\(\s*\)/,
          message: "Keep a `bool IsHungry()` on `Cat` that answers from its stored state."
        },
        {
          pattern: /^(?![\s\S]*CheckAndSign)[\s\S]*$/,
          message: "Split the two jobs - `Cat` should no longer both check hunger and build the sign."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var cat = new Cat(false);\n        var sign = new FeedingSign();\n        System.Console.WriteLine(sign.Format(cat.IsHungry()));\n    }\n}\n",
        expected: "FULL",
        message: "`IsHungry()` must answer from the cat's own state, not a fixed `true`. Build a cat that is not hungry and the sign should read FULL."
      },
      starter: "using System;\n\npublic class Cat\n{\n    // one method: checks hunger AND builds the sign text\n    public string CheckAndSign()\n    {\n        bool hungry = true;                        // the check\n        return hungry ? \"FEED\" : \"FULL\";           // the formatting\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat();\n        Console.WriteLine(cat.CheckAndSign());\n    }\n}\n",
      solution: "using System;\n\npublic class Cat\n{\n    private bool _hungry;\n\n    public Cat(bool hungry)\n    {\n        _hungry = hungry;\n    }\n\n    public bool IsHungry()\n    {\n        return _hungry;\n    }\n}\n\npublic class FeedingSign\n{\n    public string Format(bool hungry)\n    {\n        return hungry ? \"FEED\" : \"FULL\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat(true);\n        bool hungry = cat.IsHungry();\n\n        var sign = new FeedingSign();\n        Console.WriteLine(sign.Format(hungry));\n    }\n}\n"
    },
    {
      example: "public interface IGreeting\n{\n    string Say();\n}\n\npublic class Hello : IGreeting\n{\n    public string Say()\n    {\n        return \"hi\";\n    }\n}\n\npublic class Bye : IGreeting\n{\n    public string Say()\n    {\n        return \"later\";\n    }\n}",
      expected: "Meow",
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
    {
      example: "public interface IReadable\n{\n    string Read();\n}\n\npublic class Book : IReadable\n{\n    public string Read()\n    {\n        return \"Words\";\n    }\n}\n\npublic class BlankPage : IReadable\n{\n    public string Read()\n    {\n        return \"Empty\";\n    }\n}",
      expected: "Swim",
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
    {
      example: "public interface IWasher\n{\n    string Wash();\n}\n\npublic interface IDryer\n{\n    string Dry();\n}\n\npublic class HandTowel : IDryer\n{\n    public string Dry()\n    {\n        return \"dry\";\n    }\n}",
      expected: "swim",
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
    {
      example: "public interface IClock\n{\n    int Hour();\n}\n\npublic class Alarm\n{\n    private readonly IClock _clock;\n\n    public Alarm(IClock clock)\n    {\n        _clock = clock;\n    }\n}",
      expected: "cat fed",
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
    awardedKey: "level2_awarded",
    awardAmount: 25,
  };
})();
