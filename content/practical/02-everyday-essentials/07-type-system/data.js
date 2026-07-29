// Unit 2 - "Everyday essentials": Abstract types and overriding. Write-from-scratch builds.
// Data only: build-engine.js reads window.BUILD_CONFIG (loaded after this file).
// Culture-safe: every task prints strings, ints or booleans - never a raw
// double/decimal, whose separator the browser locale would decide.
(function () {
  "use strict";

  const tasks = [
    {
      title: "A type you cannot make",
      concept: "Abstract base type",
      context:
        "Some types describe a **shape** without being a thing you can make. `Animal` says every animal can `Speak`, but there is no such thing as a plain animal - only a cat, a dog, a cow. A type like that is **abstract**: it defines what its subtypes must provide, and cannot itself be created with `new`.\n\nAn abstract method has no body - each subtype writes its own. Give `Cat` a `Speak` that returns its sound.",
      example:
        "public abstract class Shape\n{\n    public abstract string Name();\n}\n\npublic class Circle : Shape\n{\n    public override string Name()\n    {\n        return \"circle\";\n    }\n}",
      goal: [
        "Give `Cat` an `override string Speak()` that returns `\"Meow\"`.",
        "`Main` holds the cat in an `Animal` variable and prints `Speak()`, so the output is `Meow`.",
      ],
      expected: "Meow",
      requireSource: [
        { pattern: /abstract\s+class\s+Animal/, message: "`Animal` must be an `abstract class` - a shape, not a thing you can `new`." },
        { pattern: /abstract\s+string\s+Speak/, message: "Give `Animal` an `abstract string Speak();` with no body - each subtype supplies its own." },
        { pattern: /override\s+string\s+Speak/, message: "`Cat` must `override` `Speak` to give the cat's own sound." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Animal a = new Dog();\n        System.Console.WriteLine(a.Speak());\n    }\n}\n\nclass Dog : Animal\n{\n    public override string Speak()\n    {\n        return "Woof";\n    }\n}\n',
        expected: "Woof",
        message: "`Animal` must be a real abstract base another type can extend - a `Dog : Animal` that overrides `Speak` should print `Woof`.",
      },
      starter:
        'using System;\n\npublic abstract class Animal\n{\n    public abstract string Speak();\n}\n\npublic class Cat : Animal\n{\n    public override string Speak()\n    {\n        // TODO: return the cat\'s sound\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Animal a = new Cat();\n        Console.WriteLine(a.Speak());\n    }\n}\n',
      solution:
        'using System;\n\npublic abstract class Animal\n{\n    public abstract string Speak();\n}\n\npublic class Cat : Animal\n{\n    public override string Speak()\n    {\n        return "Meow";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Animal a = new Cat();\n        Console.WriteLine(a.Speak());\n    }\n}\n',
    },
    {
      title: "Replace a default",
      concept: "Override a default",
      context:
        "Sometimes a base type has a sensible **default** behaviour, and a subtype wants to **replace** it. Mark the base method `virtual` to say \"this can be replaced\"; mark the subtype's version `override` to replace it. Code holding the base type still calls through to whichever version the real object carries.\n\nHere: `Pet` has a default `Sound`. Make `Parrot` override it with the parrot's own.",
      example:
        "public class Greeter\n{\n    public virtual string Hello()\n    {\n        return \"hello\";\n    }\n}\n\npublic class Robot : Greeter\n{\n    public override string Hello()\n    {\n        return \"beep\";\n    }\n}",
      goal: [
        "`Pet.Sound()` is `virtual` and returns the default `\"quiet\"`.",
        "Give `Parrot` an `override string Sound()` that returns `\"Squawk\"`.",
        "`Main` holds the parrot in a `Pet` variable and prints `Sound()`, so the output is `Squawk`.",
      ],
      expected: "Squawk",
      requireSource: [
        { pattern: /virtual\s+string\s+Sound/, message: "Mark `Pet.Sound()` as `virtual` so a subtype is allowed to replace it." },
        { pattern: /override\s+string\s+Sound/, message: "`Parrot` must `override` `Sound` to replace the default." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Pet p = new Pet();\n        System.Console.WriteLine(p.Sound());\n    }\n}\n',
        expected: "quiet",
        message: "The base `Pet` must keep a working default - a plain `Pet` (not a `Parrot`) should still say `quiet`.",
      },
      starter:
        'using System;\n\npublic class Pet\n{\n    public virtual string Sound()\n    {\n        return "quiet";\n    }\n}\n\npublic class Parrot : Pet\n{\n    public override string Sound()\n    {\n        // TODO: return the parrot\'s own sound\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Pet p = new Parrot();\n        Console.WriteLine(p.Sound());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Pet\n{\n    public virtual string Sound()\n    {\n        return "quiet";\n    }\n}\n\npublic class Parrot : Pet\n{\n    public override string Sound()\n    {\n        return "Squawk";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Pet p = new Parrot();\n        Console.WriteLine(p.Sound());\n    }\n}\n',
    },
    {
      title: "One name, different inputs",
      concept: "Overloading",
      context:
        "One operation can make sense with different inputs. **Overloading** lets you give two methods the same name but different parameters; the compiler picks the right one from the arguments you pass. It keeps a single clear name instead of `AddOne` and `AddTwo`.\n\nHere: give `Counter` two `Add` methods - one takes a single number, one takes two - and return their total.",
      example:
        "public class Printer\n{\n    public string Show(string a)\n    {\n        return a;\n    }\n\n    public string Show(string a, string b)\n    {\n        return a + b;\n    }\n}",
      goal: [
        "Give `Counter` an `int Add(int a)` that returns `a`.",
        "Give `Counter` a second `int Add(int a, int b)` that returns `a + b`.",
        "`Main` calls `Add(2, 3)`, so the output is `5`.",
      ],
      expected: "5",
      requireSource: [
        { pattern: /int\s+Add\s*\(\s*int\s+\w+\s*\)/, message: "Give `Counter` an `int Add(int a)` - the one-number version." },
        { pattern: /int\s+Add\s*\(\s*int\s+\w+\s*,\s*int\s+\w+\s*\)/, message: "Give `Counter` a second `int Add(int a, int b)` - the two-number version, same name." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var c = new Counter();\n        System.Console.WriteLine(c.Add(4));\n    }\n}\n',
        expected: "4",
        message: "The single-number `Add(int a)` must return `a` - `Add(4)` should read `4`.",
      },
      starter:
        'using System;\n\npublic class Counter\n{\n    public int Add(int a)\n    {\n        // TODO: return a\n        return 0;\n    }\n\n    public int Add(int a, int b)\n    {\n        // TODO: return a + b\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Counter();\n        Console.WriteLine(c.Add(2, 3));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Counter\n{\n    public int Add(int a)\n    {\n        return a;\n    }\n\n    public int Add(int a, int b)\n    {\n        return a + b;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Counter();\n        Console.WriteLine(c.Add(2, 3));\n    }\n}\n',
    },
    {
      title: "A type's own text form",
      concept: "Custom text form",
      context:
        "By default, printing an object shows its type name - not useful. **Overriding `ToString`** lets a type decide its own text form, so `Console.WriteLine(obj)` shows something meaningful. Anywhere the object is turned into text, your version is used.\n\nHere: give `Cat` a `ToString` that returns `\"Cat: \"` followed by its name.",
      example:
        "public class Point\n{\n    private int x;\n\n    public Point(int x)\n    {\n        this.x = x;\n    }\n\n    public override string ToString()\n    {\n        return \"Point(\" + x + \")\";\n    }\n}",
      goal: [
        "Give `Cat` an `override string ToString()` that returns `\"Cat: \"` joined with its `name`.",
        "`Main` prints the cat with `Console.WriteLine(c)`, so a cat named `Whiskers` reads `Cat: Whiskers`.",
      ],
      expected: "Cat: Whiskers",
      requireSource: [
        { pattern: /override\s+string\s+ToString/, message: "Give `Cat` an `override string ToString()` so printing it shows your text." },
        { pattern: /"Cat: "/, message: "Return `\"Cat: \"` followed by the name, so the label reads `Cat: Whiskers`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Cat c = new Cat("Tom");\n        System.Console.WriteLine(c);\n    }\n}\n',
        expected: "Cat: Tom",
        message: "`ToString` must use the cat's own `name`, not a fixed one - a cat named `Tom` should read `Cat: Tom`.",
      },
      starter:
        'using System;\n\npublic class Cat\n{\n    private string name;\n\n    public Cat(string name)\n    {\n        this.name = name;\n    }\n\n    public override string ToString()\n    {\n        // TODO: return "Cat: " followed by the name\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat c = new Cat("Whiskers");\n        Console.WriteLine(c);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    private string name;\n\n    public Cat(string name)\n    {\n        this.name = name;\n    }\n\n    public override string ToString()\n    {\n        return "Cat: " + name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cat c = new Cat("Whiskers");\n        Console.WriteLine(c);\n    }\n}\n',
    },
    {
      title: "Clean up at a known point",
      concept: "Deterministic cleanup",
      context:
        "Some things must be **cleaned up** when you are done - a file closed, a connection dropped - and you want that to happen at a known point, not whenever. A type that implements **`IDisposable`** has a `Dispose` method for exactly that. A `using` block calls `Dispose` for you the moment the block ends, even if something inside it fails.\n\nHere: `Cage` prints `\"open\"` when built. Make its `Dispose` print `\"closed\"` so the `using` block cleans up deterministically.",
      example:
        "public class Door : IDisposable\n{\n    public Door()\n    {\n        Console.WriteLine(\"unlocked\");\n    }\n\n    public void Dispose()\n    {\n        Console.WriteLine(\"locked\");\n    }\n}",
      goal: [
        "In `Cage.Dispose()`, print `\"closed\"`.",
        "`Main` wraps the cage in a `using` block, so the output is `open` then `closed`.",
      ],
      expected: ["open", "closed"],
      requireSource: [
        { pattern: /:\s*IDisposable/, message: "`Cage` must implement `IDisposable` so it has a `Dispose` to clean up." },
        { pattern: /using\s*\(/, message: "`Main` must wrap the cage in a `using (...)` block so `Dispose` runs at the end." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        using (var a = new Cage())\n        {\n        }\n        using (var b = new Cage())\n        {\n        }\n    }\n}\n',
        expected: ["open", "closed", "open", "closed"],
        message: "`Dispose` must run at the end of every `using` block - two cages should print `open`/`closed` twice.",
      },
      starter:
        'using System;\n\npublic class Cage : IDisposable\n{\n    public Cage()\n    {\n        Console.WriteLine("open");\n    }\n\n    public void Dispose()\n    {\n        // TODO: print "closed" so the cleanup is visible\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        using (var cage = new Cage())\n        {\n        }\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cage : IDisposable\n{\n    public Cage()\n    {\n        Console.WriteLine("open");\n    }\n\n    public void Dispose()\n    {\n        Console.WriteLine("closed");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        using (var cage = new Cage())\n        {\n        }\n    }\n}\n',
    },
    {
      summary: true,
      title: "What you learned",
      concept: "Shaping your own types",
      context: "Five ways to make a type carry its own behaviour - the everyday tools of a type system, portable to most object languages.",
      summaryIntro:
        "You gave types their own shape and behaviour, one piece at a time:",
      summaryItems: [
        { title: "A type you cannot make - ", text: "an `abstract` base defines what subtypes must provide and cannot be created on its own, so `Cat` and `Dog` fill in the `Speak` it only declares." },
        { title: "Replace a default - ", text: "a `virtual` method offers a default and an `override` replaces it, while code holding the base type still calls the real object's version." },
        { title: "One name, different inputs - ", text: "**overloading** gives two methods the same name with different parameters, so `Add(2)` and `Add(2, 3)` read naturally." },
        { title: "A type's own text form - ", text: "overriding `ToString` decides how the object prints, so `Console.WriteLine(obj)` shows something you chose." },
        { title: "Clean up at a known point - ", text: "`IDisposable` plus a `using` block runs `Dispose` deterministically the moment the block ends." },
      ],
      summaryClose:
        "These are type-system essentials, not C# trivia - most object languages have an abstract type, an overridable method, a custom text form, and a cleanup hook. Next, you meet the collections and queries that store and shape many of these objects at once.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "ts",
    metaLabel: "Everyday essentials \u00b7 Abstract types and overriding",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "type_system_awarded",
    awardAmount: 25,
  };
})();
