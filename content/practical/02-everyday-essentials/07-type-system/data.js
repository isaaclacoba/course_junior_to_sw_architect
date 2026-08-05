// Unit 2 - "Everyday essentials": Abstract types and overriding. Write-from-scratch builds.
// Data only: the build plugin reads window.LESSON_CONFIG (loaded after this file).
// Culture-safe: every task prints strings, ints or booleans - never a raw
// double/decimal, whose separator the browser locale would decide.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public abstract class Shape\n{\n    public abstract string Name();\n}\n\npublic class Circle : Shape\n{\n    public override string Name()\n    {\n        return \"circle\";\n    }\n}",
      expected: "Meow",
      requireSource: [
        {
          pattern: /abstract\s+class\s+Animal/,
          message: "`Animal` must be an `abstract class` - a shape, not a thing you can `new`."
        },
        {
          pattern: /abstract\s+string\s+Speak/,
          message: "Give `Animal` an `abstract string Speak();` with no body - each subtype supplies its own."
        },
        {
          pattern: /override\s+string\s+Speak/,
          message: "`Cat` must `override` `Speak` to give the cat's own sound."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Animal a = new Dog();\n        System.Console.WriteLine(a.Speak());\n    }\n}\n\nclass Dog : Animal\n{\n    public override string Speak()\n    {\n        return \"Woof\";\n    }\n}\n",
        expected: "Woof",
        message: "`Animal` must be a real abstract base another type can extend - a `Dog : Animal` that overrides `Speak` should print `Woof`."
      },
      goals: [
        {
          code: [
            "Cat : Animal",
            { row: "return \"Meow\"", writes: "\"Meow\"" }
          ],
          gate: { type: "Cat", base: "Animal", member: "Speak" }
        },
        { gate: null }
      ],
      starter: "using System;\n\npublic abstract class Animal\n{\n    public abstract string Speak();\n}\n\npublic class Cat : Animal\n{\n    public override string Speak()\n    {\n        // TODO: return the cat's sound\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Animal a = new Cat();\n        Console.WriteLine(a.Speak());\n    }\n}\n",
      solution: "using System;\n\npublic abstract class Animal\n{\n    public abstract string Speak();\n}\n\npublic class Cat : Animal\n{\n    public override string Speak()\n    {\n        return \"Meow\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Animal a = new Cat();\n        Console.WriteLine(a.Speak());\n    }\n}\n"
    },
    {
      example: "public class Greeter\n{\n    public virtual string Hello()\n    {\n        return \"hello\";\n    }\n}\n\npublic class Robot : Greeter\n{\n    public override string Hello()\n    {\n        return \"beep\";\n    }\n}",
      expected: "Squawk",
      requireSource: [
        {
          pattern: /virtual\s+string\s+Sound/,
          message: "Mark `Pet.Sound()` as `virtual` so a subtype is allowed to replace it."
        },
        {
          pattern: /override\s+string\s+Sound/,
          message: "`Parrot` must `override` `Sound` to replace the default."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Pet p = new Pet();\n        System.Console.WriteLine(p.Sound());\n    }\n}\n",
        expected: "quiet",
        message: "The base `Pet` must keep a working default - a plain `Pet` (not a `Parrot`) should still say `quiet`."
      },
      goals: [
        { gate: null },
        {
          code: [
            "Parrot : Pet",
            { row: "return \"Squawk\"", writes: "\"Squawk\"" }
          ],
          gate: { type: "Parrot", base: "Pet", member: "Sound" }
        },
        { gate: null }
      ],
      starter: "using System;\n\npublic class Pet\n{\n    public virtual string Sound()\n    {\n        return \"quiet\";\n    }\n}\n\npublic class Parrot : Pet\n{\n    public override string Sound()\n    {\n        // TODO: return the parrot's own sound\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Pet p = new Parrot();\n        Console.WriteLine(p.Sound());\n    }\n}\n",
      solution: "using System;\n\npublic class Pet\n{\n    public virtual string Sound()\n    {\n        return \"quiet\";\n    }\n}\n\npublic class Parrot : Pet\n{\n    public override string Sound()\n    {\n        return \"Squawk\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Pet p = new Parrot();\n        Console.WriteLine(p.Sound());\n    }\n}\n"
    },
    {
      example: "public class Printer\n{\n    public string Show(string text)\n    {\n        return text;\n    }\n\n    public string Show(string first, string second)\n    {\n        return first + second;\n    }\n}",
      expected: "5",
      requireSource: [
        {
          pattern: /int\s+Add\s*\(\s*int\s+\w+\s*\)/,
          message: "Give `Counter` an `int Add(int a)` - the one-number version."
        },
        {
          pattern: /int\s+Add\s*\(\s*int\s+\w+\s*,\s*int\s+\w+\s*\)/,
          message: "Give `Counter` a second `int Add(int a, int b)` - the two-number version, same name."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var c = new Counter();\n        System.Console.WriteLine(c.Add(4));\n    }\n}\n",
        expected: "4",
        message: "The single-number `Add(int a)` must return `a` - `Add(4)` should read `4`."
      },
      goals: [
        {
          code: [
            "class Counter",
            { row: "return a", writes: "return a" }
          ],
          gate: { type: "Counter", member: "Add" }
        },
        {
          code: [
            "class Counter",
            { row: "return a + b", writes: "+" }
          ],
          gate: { type: "Counter", member: "Add" }
        },
        { gate: null }
      ],
      starter: "using System;\n\npublic class Counter\n{\n    public int Add(int a)\n    {\n        // TODO: return a\n        return 0;\n    }\n\n    public int Add(int a, int b)\n    {\n        // TODO: return a + b\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Counter();\n        Console.WriteLine(c.Add(2, 3));\n    }\n}\n",
      solution: "using System;\n\npublic class Counter\n{\n    public int Add(int a)\n    {\n        return a;\n    }\n\n    public int Add(int a, int b)\n    {\n        return a + b;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Counter();\n        Console.WriteLine(c.Add(2, 3));\n    }\n}\n"
    },
    {
      example: "public class Score\n{\n    private int points;\n\n    public Score(int points)\n    {\n        this.points = points;\n    }\n\n    public override string ToString()\n    {\n        return \"Score: \" + points;\n    }\n}",
      expected: "Cat: Whiskers",
      requireSource: [
        {
          pattern: /override\s+string\s+ToString/,
          message: "Give `Cat` an `override string ToString()` so printing it shows your text."
        },
        {
          pattern: /"Cat: "/,
          message: "Return `\"Cat: \"` followed by the name, so the label reads `Cat: Whiskers`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        Cat c = new Cat(\"Tom\");\n        System.Console.WriteLine(c);\n    }\n}\n",
        expected: "Cat: Tom",
        message: "`ToString` must use the cat's own `name`, not a fixed one - a cat named `Tom` should read `Cat: Tom`."
      },
      goals: [
        {
          code: [
            "class Cat",
            { row: "return \"Cat: \" + name", writes: "\"Cat: \"" }
          ],
          gate: { type: "Cat", member: "ToString" }
        },
        { gate: null }
      ],
      starter: "using System;\n\npublic class Cat\n{\n    private string name;\n\n    public Cat(string name)\n    {\n        this.name = name;\n    }\n\n    public override string ToString()\n    {\n        // TODO: return \"Cat: \" followed by the name\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat c = new Cat(\"Whiskers\");\n        Console.WriteLine(c);\n    }\n}\n",
      solution: "using System;\n\npublic class Cat\n{\n    private string name;\n\n    public Cat(string name)\n    {\n        this.name = name;\n    }\n\n    public override string ToString()\n    {\n        return \"Cat: \" + name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat c = new Cat(\"Whiskers\");\n        Console.WriteLine(c);\n    }\n}\n"
    },
    {
      example: "public class Door : IDisposable\n{\n    public Door()\n    {\n        Console.WriteLine(\"unlocked\");\n    }\n\n    public void Dispose()\n    {\n        Console.WriteLine(\"locked\");\n    }\n}",
      expected: [
        "open",
        "closed"
      ],
      requireSource: [
        {
          pattern: /:\s*IDisposable/,
          message: "`Cage` must implement `IDisposable` so it has a `Dispose` to clean up."
        },
        {
          pattern: /using\s*\(/,
          message: "`Main` must wrap the cage in a `using (...)` block so `Dispose` runs at the end."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        using (var a = new Cage())\n        {\n        }\n        using (var b = new Cage())\n        {\n        }\n    }\n}\n",
        expected: [
          "open",
          "closed",
          "open",
          "closed"
        ],
        message: "`Dispose` must run at the end of every `using` block - two cages should print `open`/`closed` twice."
      },
      goals: [
        {
          code: [
            "Cage : IDisposable",
            { row: "print \"closed\"", writes: ["Console.WriteLine", "\"closed\""] }
          ],
          gate: { type: "Cage", base: "IDisposable", member: "Dispose" }
        },
        { gate: null }
      ],
      starter: "using System;\n\npublic class Cage : IDisposable\n{\n    public Cage()\n    {\n        Console.WriteLine(\"open\");\n    }\n\n    public void Dispose()\n    {\n        // TODO: print \"closed\" so the cleanup is visible\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        using (var cage = new Cage())\n        {\n        }\n    }\n}\n",
      solution: "using System;\n\npublic class Cage : IDisposable\n{\n    public Cage()\n    {\n        Console.WriteLine(\"open\");\n    }\n\n    public void Dispose()\n    {\n        Console.WriteLine(\"closed\");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        using (var cage = new Cage())\n        {\n        }\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "ts",
    metaLabel: "Everyday essentials · Abstract types and overriding",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "type_system_awarded",
    awardAmount: 25,
  };
})();
