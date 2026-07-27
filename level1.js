// Foundations - the first practical lesson. Rewritten as a code-lab
// write-and-run build lesson (build-engine.js reads window.BUILD_CONFIG). It
// teaches the actual language basics a beginner needs before anything else:
// printing, variables, datatypes, assignment, null, and finally what an object
// is (state + behaviour, class vs instance). No if/else or loops yet - those
// come in Control Flow. Design principles (encapsulation, polymorphism, DI) are
// taught later in Part 4, not here.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Your first line",
      concept: "Printing",
      context:
        "A program shows you something by printing it. `Console.WriteLine(...)` prints one line. Whatever you put in the quotes is text - a `string`.",
      example:
        'Console.WriteLine("Good morning");  // prints: Good morning',
      goal: [
        "Print the word `Hello`.",
        "The output should be Hello.",
      ],
      expected: "Hello",
      requireSource: [
        { pattern: /Console\.WriteLine/, message: "Use `Console.WriteLine(...)` to print." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: print the word Hello\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello");\n    }\n}\n',
    },
    {
      title: "A variable holds a value",
      concept: "Variables",
      context:
        "A **variable** is a named box that holds a value. You give it a type, a name, and a value: `int legs = 4;` makes a whole number (`int`) called `legs` holding 4. Print the variable and you see what it holds.",
      example:
        'int age = 7;\nConsole.WriteLine(age);  // prints: 7',
      goal: [
        "Make an `int` variable called `count` holding `5`.",
        "Print `count` (the variable, not the number). The output should be 5.",
      ],
      expected: "5",
      requireSource: [
        { pattern: /int\s+count\s*=\s*5\s*;/, message: "Declare `int count = 5;`." },
        { pattern: /Console\.WriteLine\s*\(\s*count\s*\)/, message: "Print the variable `count`, not the literal 5." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: make an int called count holding 5, then print count\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int count = 5;\n        Console.WriteLine(count);\n    }\n}\n',
    },
    {
      title: "Values have types",
      concept: "Datatypes",
      context:
        "Every value has a **type** - a kind - and the type sets both what the value can do and how many bits it uses. The everyday types:\n\n- `int` - a 32-bit signed **integer**: whole numbers from -2,147,483,648 to 2,147,483,647\n- `long` - a 64-bit signed integer: the same idea with far more room, about -9.2 to +9.2 quintillion (-2^63 to 2^63-1)\n- `double` - a 64-bit **floating-point** number (IEEE 754): approximates a **real number** to ~15-16 significant digits, like `3.5`\n- `decimal` - a 128-bit exact **decimal**: 28-29 digits with no binary rounding, so it is used for money; written `9.99m`\n- `bool` - a **boolean**: `true` or `false`\n- `char` - a single 16-bit Unicode **character**, in single quotes, like `'A'`\n- `string` - **text**: a sequence of `char` values, in double quotes, like `\"Rex\"`",
      example:
        "long stars = 100000000000;   // 64-bit signed integer\ndouble weight = 3.5;         // 64-bit floating-point (real number)\ndecimal price = 9.99m;       // 128-bit exact decimal, for money\nchar grade = 'A';            // 16-bit Unicode character",
      goal: [
        "Make four variables: `int legs = 4`, `string name = \"Rex\"`, `char initial = 'R'`, `bool goodBoy = true`.",
        "Print each one on its own line. The output should be 4, then Rex, then R, then True.",
      ],
      expected: ["4", "Rex", "R", "True"],
      requireSource: [
        { pattern: /int\s+legs\s*=\s*4\s*;/, message: "Declare `int legs = 4;`." },
        { pattern: /string\s+name\s*=\s*"Rex"\s*;/, message: "Declare `string name = \"Rex\";`." },
        { pattern: /char\s+initial\s*=\s*'R'\s*;/, message: "Declare `char initial = 'R';` (single quotes for a char)." },
        { pattern: /bool\s+goodBoy\s*=\s*true\s*;/, message: "Declare `bool goodBoy = true;`." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: make int legs = 4, string name = "Rex", char initial = \'R\', bool goodBoy = true\n        // then print each one on its own line\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int legs = 4;\n        string name = "Rex";\n        char initial = \'R\';\n        bool goodBoy = true;\n        Console.WriteLine(legs);\n        Console.WriteLine(name);\n        Console.WriteLine(initial);\n        Console.WriteLine(goodBoy);\n    }\n}\n',
    },
    {
      title: "Change a value",
      concept: "Assignment",
      context:
        "`=` is **assignment**: it stores a value in a variable. Read it as \"store\", not \"equals\". You can store a new value later - the box keeps whatever you put in last.",
      example:
        'int score = 1;\nscore = 10;   // now score holds 10\nConsole.WriteLine(score);  // prints: 10',
      goal: [
        "Make `int lives = 9`, then change `lives` to `8`, then print it.",
        "The output should be 8.",
      ],
      expected: "8",
      requireSource: [
        { pattern: /int\s+lives\s*=\s*9\s*;/, message: "Start with `int lives = 9;`." },
        { pattern: /lives\s*=\s*8\s*;/, message: "Then store a new value: `lives = 8;`." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int lives = 9;\n        // TODO: change lives to 8, then print lives\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int lives = 9;\n        lives = 8;\n        Console.WriteLine(lives);\n    }\n}\n',
    },
    {
      title: "Nothing yet: null",
      concept: "null",
      context:
        "Sometimes a variable has **no value yet**. `null` is a special value meaning \"nothing here\". A type that is allowed to be nothing is written with a `?`, like `string?`. You can store a real value later.",
      example:
        'string? nickname = null;   // nothing yet\nnickname = "Sparky";\nConsole.WriteLine(nickname);  // prints: Sparky',
      goal: [
        "Make `string? pet = null` (nothing yet).",
        "Then store `\"Rex\"` in `pet` and print it. The output should be Rex.",
      ],
      expected: "Rex",
      requireSource: [
        { pattern: /string\?\s+pet\s*=\s*null\s*;/, message: "Start with `string? pet = null;`." },
        { pattern: /pet\s*=\s*"Rex"\s*;/, message: "Then store the real value: `pet = \"Rex\";`." },
      ],
      starter:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: string? pet = null, then store "Rex" in pet, then print pet\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        string? pet = null;\n        pet = "Rex";\n        Console.WriteLine(pet);\n    }\n}\n',
    },
    {
      title: "What is an object",
      concept: "Objects",
      context:
        "An **object** bundles **state** (what it knows) with **behaviour** (what it does). A `class` is the blueprint; an object is one thing built from it with `new`. Below, a `Dog` knows its `Name` (state) and can `Speak` (behaviour).",
      example:
        'class Robot\n{\n    public string Name = "Beep";       // state\n    public string Greet() { return "Hi"; }  // behaviour\n}\n// var r = new Robot();  r.Name is "Beep";  r.Greet() is "Hi"',
      goal: [
        "Give the `Dog` its state: set `Name` to `Rex`.",
        "Give it behaviour: make `Speak()` return `Woof`.",
        "`Main` builds a Dog and prints its Name then what it says. The output should be Rex, then Woof.",
      ],
      expected: ["Rex", "Woof"],
      requireSource: [
        { pattern: /class\s+Dog/, message: "Keep the `Dog` class." },
        { pattern: /public\s+string\s+Name\s*=\s*"Rex"\s*;/, message: "Set the dog's state: `public string Name = \"Rex\";`." },
        { pattern: /return\s+"Woof"\s*;/, message: "Make `Speak()` return `\"Woof\"`." },
      ],
      starter:
        'using System;\n\nclass Dog\n{\n    // TODO: give the dog state - set Name to "Rex"\n    public string Name = "";\n\n    // TODO: give the dog behaviour - return "Woof"\n    public string Speak()\n    {\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog dog = new Dog();\n        Console.WriteLine(dog.Name);\n        Console.WriteLine(dog.Speak());\n    }\n}\n',
      solution:
        'using System;\n\nclass Dog\n{\n    public string Name = "Rex";\n\n    public string Speak()\n    {\n        return "Woof";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog dog = new Dog();\n        Console.WriteLine(dog.Name);\n        Console.WriteLine(dog.Speak());\n    }\n}\n',
    },
    {
      title: "Foundations recap",
      concept: "Recap",
      summary: true,
      summaryIntro:
        "These are the building blocks every later lesson stands on. You wrote and ran real C# for each one.",
      summaryItems: [
        { title: "Printing - ", text: "`Console.WriteLine(...)` shows one line of output." },
        { title: "Variable - ", text: "a named box holding a value: `int legs = 4;`." },
        { title: "Type - ", text: "every value has a kind: `int`, `long`, `double`, `decimal`, `bool`, `char`, `string`." },
        { title: "Assignment - ", text: "`=` stores a value; store a new one any time." },
        { title: "null - ", text: "\"nothing here\" yet; a `?` type is allowed to be null." },
        { title: "Object - ", text: "state + behaviour built from a `class` with `new`." },
      ],
      summaryClose:
        "Next: Practice the Basics - put these together and start deciding and repeating with control flow.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "fnd",
    metaLabel: "Understand the ideas \u00b7 Foundations",
    progressNoun: "Step",
    awardedKey: "foundations_awarded",
    awardAmount: 20,
    tasks,
  };
})();
