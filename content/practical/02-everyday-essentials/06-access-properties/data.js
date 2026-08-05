// Unit 2 - "C# up close": Access and properties. Write-from-scratch builds.
// Data only: the build plugin reads window.LESSON_CONFIG (loaded after this file).
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
      example: "public class Book\n{\n    private int _pages;\n\n    public Book(int pages)\n    {\n        _pages = pages;\n    }\n\n    public int Pages\n    {\n        get { return _pages; }\n    }\n}",
      expected: "9",
      requireSource: [
        {
          pattern: /private\s+int\s+_lives/,
          message: "Keep the lives in a `private int _lives` field so the outside cannot touch it directly."
        },
        {
          pattern: /public\s+int\s+Lives/,
          message: "Expose the value through a `public int Lives` property."
        },
        {
          pattern: /\bget\b/,
          message: "The property needs a `get` that returns `_lives`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var cat = new Cat(7);\n        System.Console.WriteLine(cat.Lives);\n    }\n}\n",
        expected: "7",
        message: "`Lives` must return the field the cat was built with - a cat made with 7 lives should read 7, not a fixed 9."
      },
      goals: [
        { gate: null },
        {
          code: [
            "class Cat",
            { row: "return `_lives` from the `get`", writes: "return _lives", gone: "return 0" }
          ],
          gate: { type: "Cat", member: "Lives" }
        },
        { gate: null }
      ],
      starter: "using System;\n\npublic class Cat\n{\n    private int _lives;\n\n    public Cat(int lives)\n    {\n        _lives = lives;\n    }\n\n    // TODO: return _lives instead of 0 so the hidden field can be read\n    public int Lives\n    {\n        get { return 0; }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat(9);\n        Console.WriteLine(cat.Lives);\n    }\n}\n",
      solution: "using System;\n\npublic class Cat\n{\n    private int _lives;\n\n    public Cat(int lives)\n    {\n        _lives = lives;\n    }\n\n    public int Lives\n    {\n        get { return _lives; }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cat = new Cat(9);\n        Console.WriteLine(cat.Lives);\n    }\n}\n"
    },
    {
      example: "public class Room\n{\n    public int Number { get; set; }\n}",
      expected: "Rex",
      requireSource: [
        {
          pattern: /public\s+string\s+Name\s*\{\s*get\s*;\s*set\s*;/,
          message: "Make `Name` an auto-property: `public string Name { get; set; }`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var pet = new Pet();\n        pet.Name = \"Bella\";\n        System.Console.WriteLine(pet.Name);\n    }\n}\n",
        expected: "Bella",
        message: "`Name` must hold whatever is set on it - after setting it to \"Bella\" it should read `Bella`, not a fixed value."
      },
      goals: [
        {
          code: [
            "class Pet",
            { row: "public string Name { get; set; } = \"\";", writes: ["get; set;", "= \"\""], gone: "public string Name =" }
          ],
          gate: { type: "Pet", member: "Name" }
        },
        { gate: null }
      ],
      starter: "using System;\n\npublic class Pet\n{\n    // TODO: make Name an auto-property with get and set, defaulted to \"\"\n    public string Name = \"\";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pet = new Pet();\n        pet.Name = \"Rex\";\n        Console.WriteLine(pet.Name);\n    }\n}\n",
      solution: "using System;\n\npublic class Pet\n{\n    public string Name { get; set; } = \"\";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pet = new Pet();\n        pet.Name = \"Rex\";\n        Console.WriteLine(pet.Name);\n    }\n}\n"
    },
    {
      example: "public class Coin\n{\n    public string Side { get; set; } = \"\";\n    public string Face => \"side:\" + Side;\n}",
      expected: "cat:Milo",
      requireSource: [
        {
          pattern: /public\s+string\s+Label\s*=>/,
          message: "Write `Label` as an expression-bodied property: `public string Label => ...`."
        },
        {
          pattern: /Label\s*=>[^\n;]*Name/,
          message: "`Label` should be worked out from `Name`, e.g. `\"cat:\" + Name`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        tag.Name = \"Zoe\";\n        System.Console.WriteLine(tag.Label);\n    }\n}\n",
        expected: "cat:Zoe",
        message: "`Label` must be built from the current `Name` - after setting `Name` to \"Zoe\" it should read `cat:Zoe`."
      },
      goals: [
        { gate: null },
        {
          code: [
            "class Tag",
            { row: "public string Label => \"cat:\" + Name;", writes: "\"cat:\" + Name", gone: "Label => \"\"" }
          ],
          gate: { type: "Tag", member: "Label" }
        },
        { gate: null }
      ],
      starter: "using System;\n\npublic class Tag\n{\n    public string Name { get; set; } = \"\";\n\n    // TODO: make Label an expression-bodied property that returns \"cat:\" + Name\n    public string Label => \"\";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        tag.Name = \"Milo\";\n        Console.WriteLine(tag.Label);\n    }\n}\n",
      solution: "using System;\n\npublic class Tag\n{\n    public string Name { get; set; } = \"\";\n\n    public string Label => \"cat:\" + Name;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        tag.Name = \"Milo\";\n        Console.WriteLine(tag.Label);\n    }\n}\n"
    },
    {
      example: "public class Seat\n{\n    public int Row { get; init; }\n\n    public Seat(int row)\n    {\n        Row = row;\n    }\n}",
      expected: "Rex",
      requireSource: [
        {
          pattern: /public\s+string\s+Name\s*\{\s*get\s*;\s*init\s*;/,
          message: "Make `Name` set-once: `public string Name { get; init; }`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var badge = new Badge(\"Sky\");\n        System.Console.WriteLine(badge.Name);\n    }\n}\n",
        expected: "Sky",
        message: "`Name` must keep whatever the constructor was given - a badge built with \"Sky\" should read `Sky`."
      },
      goals: [
        { gate: null },
        {
          code: [
            "class Badge",
            { row: "Name = name;", writes: "= name" }
          ],
          gate: { type: "Badge", member: "Badge" }
        },
        { gate: null }
      ],
      starter: "using System;\n\npublic class Badge\n{\n    public string Name { get; init; } = \"\";\n\n    public Badge(string name)\n    {\n        // TODO: store name in Name (init can be set here, inside the constructor)\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var badge = new Badge(\"Rex\");\n        Console.WriteLine(badge.Name);\n    }\n}\n",
      solution: "using System;\n\npublic class Badge\n{\n    public string Name { get; init; } = \"\";\n\n    public Badge(string name)\n    {\n        Name = name;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var badge = new Badge(\"Rex\");\n        Console.WriteLine(badge.Name);\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "ap",
    metaLabel: "Everyday essentials · Access and properties",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "access_properties_awarded",
    awardAmount: 20,
  };
})();
