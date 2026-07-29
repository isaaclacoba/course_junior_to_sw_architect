// Reuse without regret - Part 1, after Reading Objects. Build the two ways to
// reuse code: a child that is-a parent (inheritance), and an object that has-a
// part (composition). Meet virtual/override polymorphism and the diamond problem,
// and see why we favour composition. Data only; build-engine.js reads BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      title: "A child that is-a parent",
      concept: "Inheritance = is-a",
      context:
        "Inheritance reuses code by kinship. Write `class Dog : Animal` and the colon reads 'is a': a `Dog` is a kind of `Animal`, so every `Animal` member comes along for free, and the child adds its own on top.\n\nThe pattern below gives a `Car` everything a `Vehicle` has, then adds one method. Do the same for the dog.",
      example:
        'public class Vehicle\n{\n    public void Start()\n    {\n        Console.WriteLine("engine on");\n    }\n}\n\npublic class Car : Vehicle\n{\n    public void Honk()\n    {\n        Console.WriteLine("beep");\n    }\n}',
      goal: [
        "Make `Dog` inherit `Animal` so it gets `Breathe()` for free, then add a `Fetch()` that prints `fetches the stick`.",
        "`rex` breathes then fetches, so the output is two lines: ...breathe... then fetches the stick.",
      ],
      expected: ["...breathe...", "fetches the stick"],
      requireSource: [
        { pattern: /class\s+Dog\s*:\s*Animal/, message: "Make Dog inherit Animal so it gets Breathe() for free: `class Dog : Animal`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Animal a = new Dog();\n        a.Breathe();\n    }\n}\n',
        expected: "...breathe...",
        message: "A Dog must be usable as an Animal - it is-a Animal, so it inherits Breathe() rather than redeclaring it.",
      },
      starter:
        'using System;\n\npublic class Animal\n{\n    public void Breathe()\n    {\n        Console.WriteLine("...breathe...");\n    }\n}\n\n// TODO: make Dog inherit Animal - write "class Dog : Animal" - so it gets\n// Breathe() for free, then add a Fetch() that prints "fetches the stick".\npublic class Dog\n{\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog rex = new Dog();\n        rex.Breathe();\n        rex.Fetch();\n    }\n}\n',
      solution:
        'using System;\n\npublic class Animal\n{\n    public void Breathe()\n    {\n        Console.WriteLine("...breathe...");\n    }\n}\n\npublic class Dog : Animal\n{\n    public void Fetch()\n    {\n        Console.WriteLine("fetches the stick");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog rex = new Dog();\n        rex.Breathe();\n        rex.Fetch();\n    }\n}\n',
    },
    {
      title: "An object that has-a part",
      concept: "Composition = has-a",
      context:
        "Composition reuses code the other way: instead of being a kind of something, a class holds one and asks it to do the work. No colon, no parent - just a field it owns. Forwarding the call to that held part is called delegation.\n\nThe pattern below gives a `Printer` an `Ink` it holds and delegates to. Do the same: give `Dog` a `Voice`.",
      example:
        'public class Ink\n{\n    public string Mark()\n    {\n        return "stamp";\n    }\n}\n\npublic class Printer\n{\n    private Ink _ink = new Ink();\n\n    public string Print()\n    {\n        return _ink.Mark();\n    }\n}',
      goal: [
        "Give `Dog` a `Voice` field it owns (a has-a), then make `Bark()` return what the voice says - do not inherit.",
        "The voice says Woof, so `Bark()` returns Woof.",
      ],
      expected: "Woof",
      requireSource: [
        { pattern: /class\s+Dog\s*\{/, message: "Dog should HOLD a Voice, not inherit one - write `class Dog {` with no `: parent`." },
        { pattern: /Voice\s+\w+\s*=\s*new\s+Voice/, message: "Give Dog a Voice field it holds: `Voice _voice = new Voice(...)`." },
        { pattern: /\.\s*Speak\s*\(/, message: "Make Bark() delegate - return the voice's `Speak()`." },
      ],
      starter:
        'using System;\n\npublic class Voice\n{\n    private string _sound;\n\n    public Voice(string sound)\n    {\n        _sound = sound;\n    }\n\n    public string Speak()\n    {\n        return _sound;\n    }\n}\n\n// TODO: give Dog a Voice field it holds (has-a), set to new Voice("Woof").\n// Make Bark() return what the voice says by calling the voice.Speak().\n// Do NOT inherit - Dog holds a Voice, it is not a kind of Voice.\npublic class Dog\n{\n    public string Bark()\n    {\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog rex = new Dog();\n        Console.WriteLine(rex.Bark());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Voice\n{\n    private string _sound;\n\n    public Voice(string sound)\n    {\n        _sound = sound;\n    }\n\n    public string Speak()\n    {\n        return _sound;\n    }\n}\n\npublic class Dog\n{\n    private Voice _voice = new Voice("Woof");\n\n    public string Bark()\n    {\n        return _voice.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog rex = new Dog();\n        Console.WriteLine(rex.Bark());\n    }\n}\n',
    },
    {
      title: "One call, many answers",
      concept: "Polymorphism = the payoff",
      context:
        "Inheritance and composition both build types; polymorphism is the payoff they unlock. A base type declares a `virtual` method with a default, and each child can `override` it. Hold children in a base-typed array and one call adapts to each real object - no `if` per type.\n\nThe base `Animal` and one child (`Dog`) are done. Add `Cat` and `Cow` the same way.",
      example:
        'public class Shape\n{\n    public virtual string Name()\n    {\n        return "shape";\n    }\n}\n\npublic class Circle : Shape\n{\n    public override string Name()\n    {\n        return "circle";\n    }\n}',
      goal: [
        "Add `Cat` and `Cow`, each inheriting `Animal` and overriding `Speak()` to return Meow and Moo.",
        "The loop prints each animal's word in array order: Woof, Meow, Moo.",
      ],
      expected: ["Woof", "Meow", "Moo"],
      requireSource: [
        { pattern: /class\s+Cat\s*:\s*Animal/, message: "`Cat` is-a Animal: `class Cat : Animal`." },
        { pattern: /class\s+Cow\s*:\s*Animal/, message: "`Cow` is-a Animal: `class Cow : Animal`." },
        { pattern: /override\s+string\s+Speak/, message: "Each child must `override string Speak()` with its own word." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Animal[] pen = new Animal[] { new Cow(), new Dog(), new Cat() };\n        foreach (Animal a in pen)\n        {\n            Console.WriteLine(a.Speak());\n        }\n    }\n}\n',
        expected: ["Moo", "Woof", "Meow"],
        message: "Each type must carry its own Speak() - the words should follow the array, not a fixed order.",
      },
      starter:
        'using System;\n\npublic class Animal\n{\n    public virtual string Speak()\n    {\n        return "...";\n    }\n}\n\npublic class Dog : Animal\n{\n    public override string Speak()\n    {\n        return "Woof";\n    }\n}\n\n// TODO: add Cat and Cow. Each is "class X : Animal" and overrides Speak()\n// to return "Meow" and "Moo".\n\nclass Program\n{\n    static void Main()\n    {\n        Animal[] pen = new Animal[] { new Dog(), new Cat(), new Cow() };\n        foreach (Animal a in pen)\n        {\n            Console.WriteLine(a.Speak());\n        }\n    }\n}\n',
      solution:
        'using System;\n\npublic class Animal\n{\n    public virtual string Speak()\n    {\n        return "...";\n    }\n}\n\npublic class Dog : Animal\n{\n    public override string Speak()\n    {\n        return "Woof";\n    }\n}\n\npublic class Cat : Animal\n{\n    public override string Speak()\n    {\n        return "Meow";\n    }\n}\n\npublic class Cow : Animal\n{\n    public override string Speak()\n    {\n        return "Moo";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Animal[] pen = new Animal[] { new Dog(), new Cat(), new Cow() };\n        foreach (Animal a in pen)\n        {\n            Console.WriteLine(a.Speak());\n        }\n    }\n}\n',
    },
    {
      title: "Two abilities, no diamond",
      concept: "Favour composition",
      context:
        "Why favour composition? Imagine a `Duck` that should both swim and fly. With inheritance you would want two parents - `class Duck : Swimmer, Flyer` - but C# forbids it: if both parents offered the same method, the call would be ambiguous. That clash is the diamond problem, and it is the strongest everyday reason to reach for composition.\n\nComposition dissolves it: hold each behaviour as its own part and name it when you delegate. The pattern below mixes two parts; give `Duck` its two.",
      example:
        'public class Sensor\n{\n    public string Read()\n    {\n        return "ok";\n    }\n}\n\npublic class Motor\n{\n    public string Run()\n    {\n        return "go";\n    }\n}\n\npublic class Robot\n{\n    private Sensor _sensor = new Sensor();\n    private Motor _motor = new Motor();\n\n    public string Check()\n    {\n        return _sensor.Read();\n    }\n\n    public string Move()\n    {\n        return _motor.Run();\n    }\n}',
      goal: [
        "Give `Duck` a `Swimming` field and a `Flying` field it holds, then delegate `Swim()` to one and `Fly()` to the other - no inheritance.",
        "`Swim()` returns swim and `Fly()` returns fly.",
      ],
      expected: ["swim", "fly"],
      requireSource: [
        { pattern: /class\s+Duck\s*\{/, message: "Duck should HOLD its behaviours, not inherit them - `class Duck {` with no parents." },
        { pattern: /Swimming\s+\w+\s*=\s*new\s+Swimming/, message: "Give Duck a Swimming field: `Swimming _swim = new Swimming()`." },
        { pattern: /Flying\s+\w+\s*=\s*new\s+Flying/, message: "Give Duck a Flying field: `Flying _fly = new Flying()`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Duck duck = new Duck();\n        Console.WriteLine(duck.Fly());\n        Console.WriteLine(duck.Swim());\n    }\n}\n',
        expected: ["fly", "swim"],
        message: "Each ability must come from its own held part, so calling them in any order still works.",
      },
      starter:
        'using System;\n\npublic class Swimming\n{\n    public string Go()\n    {\n        return "swim";\n    }\n}\n\npublic class Flying\n{\n    public string Go()\n    {\n        return "fly";\n    }\n}\n\n// TODO: give Duck a Swimming field and a Flying field it holds (has-a both).\n// Delegate Swim() to the swimming part and Fly() to the flying part.\n// Do NOT inherit - Duck holds its abilities as parts.\npublic class Duck\n{\n    public string Swim()\n    {\n        return "";\n    }\n\n    public string Fly()\n    {\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Duck duck = new Duck();\n        Console.WriteLine(duck.Swim());\n        Console.WriteLine(duck.Fly());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Swimming\n{\n    public string Go()\n    {\n        return "swim";\n    }\n}\n\npublic class Flying\n{\n    public string Go()\n    {\n        return "fly";\n    }\n}\n\npublic class Duck\n{\n    private Swimming _swim = new Swimming();\n    private Flying _fly = new Flying();\n\n    public string Swim()\n    {\n        return _swim.Go();\n    }\n\n    public string Fly()\n    {\n        return _fly.Go();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Duck duck = new Duck();\n        Console.WriteLine(duck.Swim());\n        Console.WriteLine(duck.Fly());\n    }\n}\n',
    },
    {
      title: "Reuse without regret recap",
      summary: true,
      summaryIntro:
        "Two ways to reuse code, and the payoff both unlock:",
      summaryItems: [
        { title: "is-a - inheritance", text: "a child borrows a parent's members and must be usable as that parent, everywhere." },
        { title: "has-a - composition", text: "a class holds smaller parts and delegates to them - mix as many as you like." },
        { title: "polymorphism", text: "one call over a base type adapts to each real object, so there is no if per type." },
        { title: "favour composition", text: "inheritance allows one parent and can force a bad fit; held parts never clash - that is why we lean on composition." },
      ],
      summaryClose:
        "The keeper rule: can you honestly say A is-a B, always and everywhere? If not - or if you need to mix behaviours - hold parts instead. You already shipped this: your SOLID `TestRunner` has-a `IReporter` handed in, and one `Send` call served every reporter.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "rwr",
    metaLabel: "Understand the ideas \u00b7 Reuse without regret",
    progressNoun: "Step",
    awardedKey: "reuse_without_regret_awarded",
    awardAmount: 20,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    tasks,
  };
})();
