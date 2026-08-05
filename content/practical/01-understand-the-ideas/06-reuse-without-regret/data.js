// Reuse without regret - Part 1, after Reading Objects. Build the two ways to
// reuse code: a child that is-a parent (inheritance), and an object that has-a
// part (composition). Meet virtual/override polymorphism and the diamond problem,
// and see why we favour composition. Data only; the build plugin reads window.LESSON_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Vehicle\n{\n    public void Start()\n    {\n        Console.WriteLine(\"engine on\");\n    }\n}\n\npublic class Car : Vehicle\n{\n    public void Honk()\n    {\n        Console.WriteLine(\"beep\");\n    }\n}",
      expected: [
        "...breathe...",
        "fetches the stick"
      ],
      requireSource: [
        {
          pattern: /class\s+Dog\s*:\s*Animal/,
          message: "Make Dog inherit Animal so it gets Breathe() for free: `class Dog : Animal`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Animal a = new Dog();\n        a.Breathe();\n    }\n}\n",
        expected: "...breathe...",
        message: "A Dog must be usable as an Animal - it is-a Animal, so it inherits Breathe() rather than redeclaring it."
      },
      starter: "using System;\n\npublic class Animal\n{\n    public void Breathe()\n    {\n        Console.WriteLine(\"...breathe...\");\n    }\n}\n\n// TODO: make Dog reuse Animal by inheriting from it, then give Dog its own\n// Fetch() method (the goal says what it should print).\npublic class Dog\n{\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog rex = new Dog();\n        rex.Breathe();\n        rex.Fetch();\n    }\n}\n",
      goals: [
        {
          code: [
            "Dog : Animal",
            "void Fetch()"
          ],
          gate: { type: "Dog", member: "Fetch" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Animal\n{\n    public void Breathe()\n    {\n        Console.WriteLine(\"...breathe...\");\n    }\n}\n\npublic class Dog : Animal\n{\n    public void Fetch()\n    {\n        Console.WriteLine(\"fetches the stick\");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog rex = new Dog();\n        rex.Breathe();\n        rex.Fetch();\n    }\n}\n"
    },
    {
      example: "public class Ink\n{\n    public string Mark()\n    {\n        return \"stamp\";\n    }\n}\n\npublic class Printer\n{\n    private Ink _ink = new Ink();\n\n    public string Print()\n    {\n        return _ink.Mark();\n    }\n}",
      expected: "Woof",
      requireSource: [
        {
          pattern: /class\s+Dog\s*\{/,
          message: "Dog should HOLD a Voice, not inherit one - write `class Dog {` with no `: parent`."
        },
        {
          pattern: /Voice\s+\w+\s*=\s*new\s+Voice/,
          message: "Give Dog a Voice field it holds: `Voice _voice = new Voice(...)`."
        },
        {
          pattern: /\.\s*Speak\s*\(/,
          message: "Make Bark() delegate - return the voice's `Speak()`."
        }
      ],
      starter: "using System;\n\npublic class Voice\n{\n    private string _sound;\n\n    public Voice(string sound)\n    {\n        _sound = sound;\n    }\n\n    public string Speak()\n    {\n        return _sound;\n    }\n}\n\n// TODO: give Dog a Voice field it holds (has-a), set to new Voice(\"Woof\").\n// Make Bark() return what the voice says by calling the voice.Speak().\n// Do NOT inherit - Dog holds a Voice, it is not a kind of Voice.\npublic class Dog\n{\n    public string Bark()\n    {\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog rex = new Dog();\n        Console.WriteLine(rex.Bark());\n    }\n}\n",
      goals: [
        {
          code: [
            "class Dog",
            "Voice _voice"
          ],
          gate: { type: "Dog", member: "_voice" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Voice\n{\n    private string _sound;\n\n    public Voice(string sound)\n    {\n        _sound = sound;\n    }\n\n    public string Speak()\n    {\n        return _sound;\n    }\n}\n\npublic class Dog\n{\n    private Voice _voice = new Voice(\"Woof\");\n\n    public string Bark()\n    {\n        return _voice.Speak();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog rex = new Dog();\n        Console.WriteLine(rex.Bark());\n    }\n}\n"
    },
    {
      example: "public class Shape\n{\n    public virtual string Name()\n    {\n        return \"shape\";\n    }\n}\n\npublic class Circle : Shape\n{\n    public override string Name()\n    {\n        return \"circle\";\n    }\n}",
      expected: [
        "Woof",
        "Meow",
        "Moo"
      ],
      requireSource: [
        {
          pattern: /class\s+Cat\s*:\s*Animal/,
          message: "`Cat` is-a Animal: `class Cat : Animal`."
        },
        {
          pattern: /class\s+Cow\s*:\s*Animal/,
          message: "`Cow` is-a Animal: `class Cow : Animal`."
        },
        {
          pattern: /override\s+string\s+Speak/,
          message: "Each child must `override string Speak()` with its own word."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Animal[] pen = new Animal[] { new Cow(), new Dog(), new Cat() };\n        foreach (Animal a in pen)\n        {\n            Console.WriteLine(a.Speak());\n        }\n    }\n}\n",
        expected: [
          "Moo",
          "Woof",
          "Meow"
        ],
        message: "Each type must carry its own Speak() - the words should follow the array, not a fixed order."
      },
      starter: "using System;\n\npublic class Animal\n{\n    public virtual string Speak()\n    {\n        return \"...\";\n    }\n}\n\npublic class Dog : Animal\n{\n    public override string Speak()\n    {\n        return \"Woof\";\n    }\n}\n\n// TODO: add Cat and Cow the same way Dog is written above - each a kind of\n// Animal with its own Speak() (the goal says the words).\n\nclass Program\n{\n    static void Main()\n    {\n        Animal[] pen = new Animal[] { new Dog(), new Cat(), new Cow() };\n        foreach (Animal a in pen)\n        {\n            Console.WriteLine(a.Speak());\n        }\n    }\n}\n",
      goals: [
        {
          code: [
            "Cat : Animal",
            "string Speak()"
          ],
          gate: { type: "Cat", base: "Animal", member: "Speak" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Animal\n{\n    public virtual string Speak()\n    {\n        return \"...\";\n    }\n}\n\npublic class Dog : Animal\n{\n    public override string Speak()\n    {\n        return \"Woof\";\n    }\n}\n\npublic class Cat : Animal\n{\n    public override string Speak()\n    {\n        return \"Meow\";\n    }\n}\n\npublic class Cow : Animal\n{\n    public override string Speak()\n    {\n        return \"Moo\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Animal[] pen = new Animal[] { new Dog(), new Cat(), new Cow() };\n        foreach (Animal a in pen)\n        {\n            Console.WriteLine(a.Speak());\n        }\n    }\n}\n"
    },
    {
      example: "public class Sensor\n{\n    public string Read()\n    {\n        return \"ok\";\n    }\n}\n\npublic class Motor\n{\n    public string Run()\n    {\n        return \"go\";\n    }\n}\n\npublic class Robot\n{\n    private Sensor _sensor = new Sensor();\n    private Motor _motor = new Motor();\n\n    public string Check()\n    {\n        return _sensor.Read();\n    }\n\n    public string Move()\n    {\n        return _motor.Run();\n    }\n}",
      expected: [
        "swim",
        "fly"
      ],
      requireSource: [
        {
          pattern: /class\s+Duck\s*\{/,
          message: "Duck should HOLD its behaviours, not inherit them - `class Duck {` with no parents."
        },
        {
          pattern: /Swimming\s+\w+\s*=\s*new\s+Swimming/,
          message: "Give Duck a Swimming field: `Swimming _swim = new Swimming()`."
        },
        {
          pattern: /Flying\s+\w+\s*=\s*new\s+Flying/,
          message: "Give Duck a Flying field: `Flying _fly = new Flying()`."
        },
        {
          pattern: /Swim\s*\(\s*\)\s*\{[^}]*\.\s*Go\s*\(/,
          message: "Make Swim() delegate to the held swimming part - return its `Go()`, do not hardcode."
        },
        {
          pattern: /Fly\s*\(\s*\)\s*\{[^}]*\.\s*Go\s*\(/,
          message: "Make Fly() delegate to the held flying part - return its `Go()`, do not hardcode."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Duck duck = new Duck();\n        Console.WriteLine(duck.Fly());\n        Console.WriteLine(duck.Swim());\n    }\n}\n",
        expected: [
          "fly",
          "swim"
        ],
        message: "Each ability must come from its own held part, so calling them in any order still works."
      },
      starter: "using System;\n\npublic class Swimming\n{\n    public string Go()\n    {\n        return \"swim\";\n    }\n}\n\npublic class Flying\n{\n    public string Go()\n    {\n        return \"fly\";\n    }\n}\n\n// TODO: give Duck a Swimming field and a Flying field it holds (has-a both).\n// Delegate Swim() to the swimming part and Fly() to the flying part.\n// Do NOT inherit - Duck holds its abilities as parts.\npublic class Duck\n{\n    public string Swim()\n    {\n        return \"\";\n    }\n\n    public string Fly()\n    {\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Duck duck = new Duck();\n        Console.WriteLine(duck.Swim());\n        Console.WriteLine(duck.Fly());\n    }\n}\n",
      goals: [
        {
          code: [
            "class Duck",
            "Swimming _swim",
            "Flying _fly"
          ],
          gate: { type: "Duck", member: "_swim" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Swimming\n{\n    public string Go()\n    {\n        return \"swim\";\n    }\n}\n\npublic class Flying\n{\n    public string Go()\n    {\n        return \"fly\";\n    }\n}\n\npublic class Duck\n{\n    private Swimming _swim = new Swimming();\n    private Flying _fly = new Flying();\n\n    public string Swim()\n    {\n        return _swim.Go();\n    }\n\n    public string Fly()\n    {\n        return _fly.Go();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Duck duck = new Duck();\n        Console.WriteLine(duck.Swim());\n        Console.WriteLine(duck.Fly());\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "rwr",
    metaLabel: "Understand the ideas · Reuse without regret",
    progressNoun: "Step",
    awardedKey: "reuse_without_regret_awarded",
    awardAmount: 20,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    tasks,
  };
})();
