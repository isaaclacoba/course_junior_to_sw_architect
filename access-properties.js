// Unit 2 - "C# up close": Access and properties. Write-from-scratch builds.
// Data only: build-engine.js reads window.BUILD_CONFIG (loaded after this file).
// Portable idea, C# surface: a type controls what parts of it are visible from
// outside (public / private / protected), and it exposes state through a
// controlled property (a get/set) rather than a raw exposed field. Most OO
// languages have both. Mechanics only here - the "why hide state" argument is
// the later encapsulation lesson; richer property shapes are the data-shapes one.
// Culture-safe: every task prints strings, ints or booleans, never a raw double.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Hide a field, show a value",
      concept: "Private field, get-only property",
      context:
        "A type decides which of its parts the outside world can see. Mark a field `private` and only the type itself can touch it - callers can't reach in and change it. To let them **read** it, you add a property with a `get` that hands the value back.\n\nWrite a `Cat` that keeps its lives in a `private` field and exposes them through a read-only `Lives` property.",
      example:
        "public class Book\n{\n    private int _pages;\n\n    public Book(int pages)\n    {\n        _pages = pages;\n    }\n\n    public int Pages\n    {\n        get { return _pages; }\n    }\n}",
      goal: [
        "Keep the number of lives in a `private int _lives` field, set from the constructor.",
        "Add a `public int Lives` property with only a `get` that returns `_lives`.",
        "`Main` builds `new Cat(9)`, so reading `Lives` prints `9`.",
      ],
      expected: "9",
      requireSource: [
        { pattern: /private\s+int\s+_lives/, message: "Keep the lives in a `private int _lives` field so the outside cannot touch it directly." },
        { pattern: /public\s+int\s+Lives/, message: "Expose the value through a `public int Lives` property." },
        { pattern: /\bget\b/, message: "The property needs a `get` that returns `_lives`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var cat = new Cat(7);\n        System.Console.WriteLine(cat.Lives);\n    }\n}\n',
        expected: "7",
        message: "`Lives` must return the field the cat was built with - a cat made with 7 lives should read 7, not a fixed 9.",
      },
      starter:
        'using System;\n\npublic class Cat\n{\n    private int _lives;\n\n    public Cat(int lives)\n    {\n        _lives = lives;\n    }\n\n    // TODO: return _lives instead of 0 so the hidden field can be read\n    public int Lives\n    {\n        get { return 0; }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat(9);\n        Console.WriteLine(cat.Lives);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    private int _lives;\n\n    public Cat(int lives)\n    {\n        _lives = lives;\n    }\n\n    public int Lives\n    {\n        get { return _lives; }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat(9);\n        Console.WriteLine(cat.Lives);\n    }\n}\n',
    },
    {
      title: "Read and write through a property",
      concept: "Auto-property (get and set)",
      context:
        "When a value can be both read and changed from outside, you don't need a hand-written field. An **auto-property** - `public string Name { get; set; }` - gives you a `get` to read it and a `set` to change it, with the storage created for you.\n\nWrite a `Pet` with a `Name` anyone can set and read.",
      example:
        "public class Room\n{\n    public int Number { get; set; }\n}",
      goal: [
        "Give `Pet` a `public string Name { get; set; }` auto-property, defaulted to `\"\"`.",
        "`Main` sets `Name` to `\"Rex\"`, then prints it - the output is `Rex`.",
      ],
      expected: "Rex",
      requireSource: [
        { pattern: /public\s+string\s+Name\s*\{\s*get\s*;\s*set\s*;/, message: "Make `Name` an auto-property: `public string Name { get; set; }`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var pet = new Pet();\n        pet.Name = "Bella";\n        System.Console.WriteLine(pet.Name);\n    }\n}\n',
        expected: "Bella",
        message: "`Name` must hold whatever is set on it - after setting it to \"Bella\" it should read `Bella`, not a fixed value.",
      },
      starter:
        'using System;\n\npublic class Pet\n{\n    // TODO: make Name an auto-property with get and set, defaulted to ""\n    public string Name = "";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pet = new Pet();\n        pet.Name = "Rex";\n        Console.WriteLine(pet.Name);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Pet\n{\n    public string Name { get; set; } = "";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pet = new Pet();\n        pet.Name = "Rex";\n        Console.WriteLine(pet.Name);\n    }\n}\n',
    },
    {
      title: "A value worked out on the spot",
      concept: "Expression-bodied (computed) property",
      context:
        "A property does not have to store anything - it can **work its value out** each time it is read. Written with `=>`, an expression-bodied property runs the expression on the right and returns the result. It has a `get` only; there is nothing to set.\n\nWrite a `Tag` whose `Label` is built from its `Name`, so `Label` follows `Name` without a field of its own.",
      example:
        "public class Coin\n{\n    public string Side { get; set; } = \"\";\n    public string Face => \"side:\" + Side;\n}",
      goal: [
        "Give `Tag` a `public string Name { get; set; }` defaulted to `\"\"`.",
        "Add `public string Label => \"cat:\" + Name;` - a computed property, no field.",
        "`Main` sets `Name` to `\"Milo\"`, then prints `Label` - the output is `cat:Milo`.",
      ],
      expected: "cat:Milo",
      requireSource: [
        { pattern: /public\s+string\s+Label\s*=>/, message: "Write `Label` as an expression-bodied property: `public string Label => ...`." },
        { pattern: /Label\s*=>[^\n;]*Name/, message: "`Label` should be worked out from `Name`, e.g. `\"cat:\" + Name`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        tag.Name = "Zoe";\n        System.Console.WriteLine(tag.Label);\n    }\n}\n',
        expected: "cat:Zoe",
        message: "`Label` must be built from the current `Name` - after setting `Name` to \"Zoe\" it should read `cat:Zoe`.",
      },
      starter:
        'using System;\n\npublic class Tag\n{\n    public string Name { get; set; } = "";\n\n    // TODO: make Label an expression-bodied property that returns "cat:" + Name\n    public string Label => "";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        tag.Name = "Milo";\n        Console.WriteLine(tag.Label);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Tag\n{\n    public string Name { get; set; } = "";\n\n    public string Label => "cat:" + Name;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        tag.Name = "Milo";\n        Console.WriteLine(tag.Label);\n    }\n}\n',
    },
    {
      title: "Set it once, then leave it",
      concept: "init-only property",
      context:
        "Some values belong to an object for life - they are set when it is built and never again. Marking a property `{ get; init; }` lets the constructor set it, then locks it: any later assignment from outside would not even compile.\n\nWrite a `Badge` whose `Name` is set in the constructor and can only be read afterwards.",
      example:
        "public class Seat\n{\n    public int Row { get; init; }\n\n    public Seat(int row)\n    {\n        Row = row;\n    }\n}",
      goal: [
        "Give `Badge` a `public string Name { get; init; }` defaulted to `\"\"`.",
        "Set `Name` from a `Badge(string name)` constructor.",
        "`Main` builds `new Badge(\"Rex\")`, so reading `Name` prints `Rex`.",
      ],
      expected: "Rex",
      requireSource: [
        { pattern: /public\s+string\s+Name\s*\{\s*get\s*;\s*init\s*;/, message: "Make `Name` set-once: `public string Name { get; init; }`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var badge = new Badge("Sky");\n        System.Console.WriteLine(badge.Name);\n    }\n}\n',
        expected: "Sky",
        message: "`Name` must keep whatever the constructor was given - a badge built with \"Sky\" should read `Sky`.",
      },
      starter:
        'using System;\n\npublic class Badge\n{\n    public string Name { get; init; } = "";\n\n    public Badge(string name)\n    {\n        // TODO: store name in Name (init can be set here, inside the constructor)\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var badge = new Badge("Rex");\n        Console.WriteLine(badge.Name);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Badge\n{\n    public string Name { get; init; } = "";\n\n    public Badge(string name)\n    {\n        Name = name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var badge = new Badge("Rex");\n        Console.WriteLine(badge.Name);\n    }\n}\n',
    },
    {
      summary: true,
      title: "What you learned",
      concept: "Access and properties",
      context: "A type controls what the outside can see, and hands out its state through properties rather than raw fields.",
      summaryIntro:
        "You decided what each type shows and how its state is reached. Four ways to expose a value, from most closed to most open:",
      summaryItems: [
        { title: "Hidden field, read-only view - ", text: "a `private` field the outside cannot touch, exposed through a property with a `get` only." },
        { title: "Read and write - ", text: "an auto-property `public string Name { get; set; }` gives a `get` and a `set` with the storage made for you." },
        { title: "Worked out on read - ", text: "an expression-bodied property `public string Label => \"cat:\" + Name;` computes its value each time, storing nothing." },
        { title: "Set once at build time - ", text: "`{ get; init; }` lets the constructor set the value, then locks it against any later change." },
      ],
      summaryClose:
        "The portable idea carries to most OO languages: a type picks what is `public` or `private`, and reaches its state through a controlled property instead of a raw exposed field. Whether to hide a value at all - and why - is the encapsulation lesson ahead.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "ap",
    metaLabel: "Everyday essentials \u00b7 Access and properties",
    progressNoun: "Step",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "access_properties_awarded",
    awardAmount: 20,
  };
})();
