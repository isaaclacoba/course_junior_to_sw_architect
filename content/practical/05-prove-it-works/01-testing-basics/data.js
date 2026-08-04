// Part five - "Prove it works" (testing), lesson 1: what a test is. Write-from-
// scratch builds. The arc: Arrange-Act-Assert, checking the exact result, a
// reusable assertion, and expecting a failure on purpose. This closes the loop
// opened by dependency injection (the ToyDog stand-in) and sets up SOLID.
// Data only: window.LESSON_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "var box = new Box();          // Arrange\nint count = box.Count();      // Act\nConsole.WriteLine(count == 0 ? \"PASS\" : \"FAIL\");   // Assert",
      expected: "PASS",
      requireSource: [
        {
          pattern: /\.Speak\s*\(/,
          message: "Call the dog's `Speak()` - that is the Act."
        },
        {
          pattern: /==\s*"Woof"|"Woof"\s*==/,
          message: "Assert with a real comparison to `\"Woof\"`, don't just print `PASS`."
        },
        {
          pattern: /\?|\bif\s*\(/,
          message: "Choose PASS or FAIL with an `if` or `?:`, so both outcomes exist."
        },
        {
          pattern: /PASS/,
          message: "Print `PASS` when the result matches."
        }
      ],
      starter: "using System;\n\npublic class Dog\n{\n    public string Speak() { return \"Woof\"; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: Arrange a Dog, Act by calling Speak(), Assert it equals \"Woof\".\n        //       Print PASS if it matches, otherwise FAIL.\n    }\n}\n",
      solution: "using System;\n\npublic class Dog\n{\n    public string Speak() { return \"Woof\"; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var dog = new Dog();                 // Arrange\n        string sound = dog.Speak();          // Act\n        Console.WriteLine(sound == \"Woof\" ? \"PASS\" : \"FAIL\");   // Assert\n    }\n}\n"
    },
    {
      example: "int total = cart.Total();\nConsole.WriteLine(total == 42 ? \"PASS\" : \"FAIL\");",
      expected: "PASS",
      requireSource: [
        {
          pattern: /Add\s*\(\s*2\s*,\s*3\s*\)/,
          message: "Act by calling `Add(2, 3)`."
        },
        {
          pattern: /==\s*5/,
          message: "Assert the result equals exactly `5`."
        },
        {
          pattern: /\?|\bif\s*\(/,
          message: "Choose PASS or FAIL with an `if` or `?:`, so both outcomes exist."
        }
      ],
      starter: "using System;\n\npublic class Adder\n{\n    public int Add(int left, int right) { return left + right; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: Act by calling Add(2, 3); assert it equals exactly 5.\n        //       Print PASS or FAIL.\n    }\n}\n",
      solution: "using System;\n\npublic class Adder\n{\n    public int Add(int left, int right) { return left + right; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var adder = new Adder();\n        int result = adder.Add(2, 3);\n        Console.WriteLine(result == 5 ? \"PASS\" : \"FAIL\");\n    }\n}\n"
    },
    {
      example: "static void AssertTrue(bool condition)\n{\n    Console.WriteLine(condition ? \"PASS\" : \"FAIL\");\n}",
      expected: "PASS",
      requireSource: [
        {
          pattern: /AssertEqual\s*\(/,
          message: "Write an `AssertEqual` method and call it."
        },
        {
          pattern: /actual\s*==\s*expected|expected\s*==\s*actual/,
          message: "`AssertEqual` must compare `actual` to `expected`, not always print `PASS`."
        }
      ],
      starter: "using System;\n\npublic class Adder\n{\n    public int Add(int left, int right) { return left + right; }\n}\n\nclass Program\n{\n    // TODO: write an assert helper named AssertEqual taking (int actual, int expected)\n    //       that prints PASS on a match and FAIL otherwise.\n\n    static void Main()\n    {\n        var adder = new Adder();\n        // TODO: then call it with Add(2, 3) and 5.\n    }\n}\n",
      solution: "using System;\n\npublic class Adder\n{\n    public int Add(int left, int right) { return left + right; }\n}\n\nclass Program\n{\n    static void AssertEqual(int actual, int expected)\n    {\n        Console.WriteLine(actual == expected ? \"PASS\" : \"FAIL\");\n    }\n\n    static void Main()\n    {\n        var adder = new Adder();\n        AssertEqual(adder.Add(2, 3), 5);\n    }\n}\n"
    },
    {
      example: "try\n{\n    account.Withdraw(-5);\n    Console.WriteLine(\"FAIL\");\n}\ncatch (Exception)\n{\n    Console.WriteLine(\"PASS\");\n}",
      expected: "PASS",
      requireSource: [
        {
          pattern: /try/,
          message: "Wrap the call in a `try`."
        },
        {
          pattern: /catch/,
          message: "Catch the expected exception and pass."
        }
      ],
      starter: "using System;\n\npublic class Gate\n{\n    public void Enter(int count)\n    {\n        if (count < 0) throw new ArgumentException(\"count cannot be negative\");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new Gate();\n        // TODO: call Enter(-1) in a try; PASS if it throws, FAIL if it does not.\n    }\n}\n",
      solution: "using System;\n\npublic class Gate\n{\n    public void Enter(int count)\n    {\n        if (count < 0) throw new ArgumentException(\"count cannot be negative\");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new Gate();\n        try\n        {\n            gate.Enter(-1);\n            Console.WriteLine(\"FAIL\");\n        }\n        catch (Exception)\n        {\n            Console.WriteLine(\"PASS\");\n        }\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "tb",
    metaLabel: "Prove it works · What a test is",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "testing_basics_awarded",
    awardAmount: 25,
  };
})();
