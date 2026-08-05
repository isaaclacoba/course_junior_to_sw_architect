// Foundations - the first practical lesson. Rewritten as a code-lab
// write-and-run build lesson (the build plugin reads window.LESSON_CONFIG). It
// teaches the actual language basics a beginner needs before anything else:
// printing, variables, datatypes, assignment, null, and finally what an object
// is (state + behaviour, class vs instance). No if/else or loops yet - those
// come in Control Flow. Design principles (encapsulation, polymorphism, DI) are
// taught later in Part 4, not here.
(function () {
  "use strict";

  const tasks = [
    {
      example: "Console.WriteLine(\"Good morning\");  // prints: Good morning",
      expected: "Hello",
      requireSource: [
        {
          pattern: /Console\.WriteLine/,
          message: "Use `Console.WriteLine(...)` to print."
        }
      ],
      goals: [
        {
          code: [
            "class Program",
            { row: "Console.WriteLine(\"Hello\")", writes: ["Console.WriteLine", "\"Hello\""] }
          ],
          gate: { type: "Program", member: "Main" }
        },
        { gate: null }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: print the word Hello\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(\"Hello\");\n    }\n}\n"
    },
    {
      example: "int age = 7;\nConsole.WriteLine(age);  // prints: 7",
      expected: "5",
      requireSource: [
        {
          pattern: /int\s+count\s*=\s*5\s*;/,
          message: "Declare `int count = 5;`."
        },
        {
          pattern: /Console\.WriteLine\s*\(\s*count\s*\)/,
          message: "Print the variable `count`, not the literal 5."
        }
      ],
      goals: [
        {
          code: [
            "class Program",
            { row: "int count = 5", writes: "int count = 5" }
          ],
          gate: { type: "Program", member: "Main" }
        },
        { gate: null }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: make an int called count holding 5, then print count\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int count = 5;\n        Console.WriteLine(count);\n    }\n}\n"
    },
    {
      example: "long stars = 100000000000;   // 64-bit signed integer\ndouble weight = 3.5;         // 64-bit floating-point (real number)\ndecimal price = 9.99m;       // 128-bit exact decimal, for money\nchar grade = 'A';            // 16-bit Unicode character",
      expected: [
        "4",
        "Rex",
        "R",
        "True"
      ],
      requireSource: [
        {
          pattern: /int\s+legs\s*=\s*4\s*;/,
          message: "Declare `int legs = 4;`."
        },
        {
          pattern: /string\s+name\s*=\s*"Rex"\s*;/,
          message: "Declare `string name = \"Rex\";`."
        },
        {
          pattern: /char\s+initial\s*=\s*'R'\s*;/,
          message: "Declare `char initial = 'R';` (single quotes for a char)."
        },
        {
          pattern: /bool\s+goodBoy\s*=\s*true\s*;/,
          message: "Declare `bool goodBoy = true;`."
        }
      ],
      goals: [
        {
          code: [
            "class Program",
            { row: "int legs = 4", writes: "int legs = 4" },
            { row: "string name = \"Rex\"", writes: "string name = \"Rex\"" },
            { row: "char initial = 'R'", writes: "char initial = 'R'" },
            { row: "bool goodBoy = true", writes: "bool goodBoy = true" }
          ],
          gate: { type: "Program", member: "Main" }
        },
        { gate: null }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: make int legs = 4, string name = \"Rex\", char initial = 'R', bool goodBoy = true\n        // then print each one on its own line\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int legs = 4;\n        string name = \"Rex\";\n        char initial = 'R';\n        bool goodBoy = true;\n        Console.WriteLine(legs);\n        Console.WriteLine(name);\n        Console.WriteLine(initial);\n        Console.WriteLine(goodBoy);\n    }\n}\n"
    },
    {
      example: "int score = 1;\nscore = 10;   // now score holds 10\nConsole.WriteLine(score);  // prints: 10",
      expected: "8",
      requireSource: [
        {
          pattern: /int\s+lives\s*=\s*9\s*;/,
          message: "Start with `int lives = 9;`."
        },
        {
          pattern: /lives\s*=\s*8\s*;/,
          message: "Then store a new value: `lives = 8;`."
        }
      ],
      goals: [
        {
          code: [
            "class Program",
            { row: "lives = 8", writes: "lives = 8" },
            { row: "Console.WriteLine(lives)", writes: "Console.WriteLine(lives)" }
          ],
          gate: { type: "Program", member: "Main" }
        },
        { gate: null }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int lives = 9;\n        // TODO: change lives to 8, then print lives\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int lives = 9;\n        lives = 8;\n        Console.WriteLine(lives);\n    }\n}\n"
    },
    {
      example: "string? nickname = null;   // nothing yet\nnickname = \"Sparky\";\nConsole.WriteLine(nickname);  // prints: Sparky",
      expected: "Rex",
      requireSource: [
        {
          pattern: /string\?\s+pet\s*=\s*null\s*;/,
          message: "Start with `string? pet = null;`."
        },
        {
          pattern: /pet\s*=\s*"Rex"\s*;/,
          message: "Then store the real value: `pet = \"Rex\";`."
        }
      ],
      goals: [
        {
          code: [
            "class Program",
            { row: "string? pet = null", writes: "string? pet = null" }
          ],
          gate: { type: "Program", member: "Main" }
        },
        {
          code: [
            "class Program",
            { row: "pet = \"Rex\"", writes: "pet = \"Rex\"" },
            { row: "Console.WriteLine(pet)", writes: "Console.WriteLine(pet)" }
          ],
          gate: { type: "Program", member: "Main" }
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: string? pet = null, then store \"Rex\" in pet, then print pet\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        string? pet = null;\n        pet = \"Rex\";\n        Console.WriteLine(pet);\n    }\n}\n"
    },
    {
      example: "class Robot\n{\n    public string Name = \"Beep\";       // state\n    public string Greet() { return \"Hi\"; }  // behaviour\n}\n// var robot = new Robot();  robot.Name is \"Beep\";  robot.Greet() is \"Hi\"",
      expected: [
        "Rex",
        "Woof"
      ],
      requireSource: [
        {
          pattern: /class\s+Dog/,
          message: "Keep the `Dog` class."
        },
        {
          pattern: /public\s+string\s+Name\s*=\s*"Rex"\s*;/,
          message: "Set the dog's state: `public string Name = \"Rex\";`."
        },
        {
          pattern: /return\s+"Woof"\s*;/,
          message: "Make `Speak()` return `\"Woof\"`."
        }
      ],
      goals: [
        {
          code: [
            "class Dog",
            { row: "Name = \"Rex\"", writes: "Name = \"Rex\"", gone: "Name = \"\"" }
          ],
          gate: { type: "Dog", member: "Name" }
        },
        {
          code: [
            "class Dog",
            { row: "return \"Woof\"", writes: "return \"Woof\"", gone: "return \"\"" }
          ],
          gate: { type: "Dog", member: "Speak" }
        },
        { gate: null }
      ],
      starter: "using System;\n\nclass Dog\n{\n    // TODO: give the dog state - set Name to \"Rex\"\n    public string Name = \"\";\n\n    // TODO: give the dog behaviour - return \"Woof\"\n    public string Speak()\n    {\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog dog = new Dog();\n        Console.WriteLine(dog.Name);\n        Console.WriteLine(dog.Speak());\n    }\n}\n",
      solution: "using System;\n\nclass Dog\n{\n    public string Name = \"Rex\";\n\n    public string Speak()\n    {\n        return \"Woof\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Dog dog = new Dog();\n        Console.WriteLine(dog.Name);\n        Console.WriteLine(dog.Speak());\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "fnd",
    metaLabel: "Understand the ideas · Foundations",
    progressNoun: "Step",
    awardedKey: "foundations_awarded",
    awardAmount: 20,
    tasks,
  };
})();
