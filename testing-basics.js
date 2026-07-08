// Part five - "Prove it works" (testing), lesson 1: what a test is. Write-from-
// scratch builds. The arc: Arrange-Act-Assert, checking the exact result, a
// reusable assertion, and expecting a failure on purpose. This closes the loop
// opened by dependency injection (the ToyDog stand-in) and sets up SOLID.
// Data only: window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Arrange, Act, Assert",
      concept: "What a test is",
      context:
        "A test is just code that runs your code and checks the result. It has three beats: Arrange (set things up), Act (call the thing), Assert (check what came back). The `Dog` is given. Write a test in `Main`: arrange a `Dog`, act by calling `Speak()`, then print `PASS` when the result is `\"Woof\"` and `FAIL` when it is not.",
      example:
        'var box = new Box();          // Arrange\nint count = box.Count();      // Act\nConsole.WriteLine(count == 0 ? "PASS" : "FAIL");   // Assert',
      goal: [
        "Arrange a `Dog`, call `Speak()`, and print `PASS` when it equals `\"Woof\"`, else `FAIL`.",
        "The dog does say Woof, so the output is PASS.",
      ],
      expected: "PASS",
      requireSource: [
        { pattern: /\.Speak\s*\(/, message: "Call the dog's `Speak()` - that is the Act." },
        { pattern: /PASS/, message: "Print `PASS` when the result matches." },
      ],
      starter:
        'using System;\n\npublic class Dog\n{\n    public string Speak() { return "Woof"; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: Arrange a Dog, Act by calling Speak(), Assert it equals "Woof".\n        //       Print PASS if it matches, otherwise FAIL.\n    }\n}\n',
      solution:
        'using System;\n\npublic class Dog\n{\n    public string Speak() { return "Woof"; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var dog = new Dog();                 // Arrange\n        string sound = dog.Speak();          // Act\n        Console.WriteLine(sound == "Woof" ? "PASS" : "FAIL");   // Assert\n    }\n}\n',
    },
    {
      title: "Check the exact result",
      concept: "A real assertion",
      context:
        "A test that only checks the code *ran* proves little - it would pass even with a wrong answer. A good assertion checks the *exact* result. The `Adder` is given. Write a test that acts by calling `Add(2, 3)` and asserts the result is exactly `5`.",
      example:
        'int total = cart.Total();\nConsole.WriteLine(total == 42 ? "PASS" : "FAIL");',
      goal: [
        "Call `Add(2, 3)` and print `PASS` only when it equals `5`, else `FAIL`.",
        "2 + 3 is 5, so the output is PASS.",
      ],
      expected: "PASS",
      requireSource: [
        { pattern: /Add\s*\(\s*2\s*,\s*3\s*\)/, message: "Act by calling `Add(2, 3)`." },
        { pattern: /==\s*5/, message: "Assert the result equals exactly `5`." },
      ],
      starter:
        'using System;\n\npublic class Adder\n{\n    public int Add(int left, int right) { return left + right; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: Act by calling Add(2, 3); assert it equals exactly 5.\n        //       Print PASS or FAIL.\n    }\n}\n',
      solution:
        'using System;\n\npublic class Adder\n{\n    public int Add(int left, int right) { return left + right; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var adder = new Adder();\n        int result = adder.Add(2, 3);\n        Console.WriteLine(result == 5 ? "PASS" : "FAIL");\n    }\n}\n',
    },
    {
      title: "A reusable assert",
      concept: "Assertion helper",
      context:
        "Real suites run the same check again and again, so it lives in one place. Write an `AssertEqual(int actual, int expected)` method that prints `PASS` when they match and `FAIL` when they do not, then use it to check `Add(2, 3)` is `5`.",
      example:
        'static void AssertTrue(bool condition)\n{\n    Console.WriteLine(condition ? "PASS" : "FAIL");\n}',
      goal: [
        "Write `AssertEqual(int actual, int expected)` that prints PASS on a match, FAIL otherwise.",
        "Call it with `Add(2, 3)` and `5`, so the output is PASS.",
      ],
      expected: "PASS",
      requireSource: [
        { pattern: /AssertEqual\s*\(/, message: "Write an `AssertEqual` method and call it." },
      ],
      starter:
        'using System;\n\npublic class Adder\n{\n    public int Add(int left, int right) { return left + right; }\n}\n\nclass Program\n{\n    // TODO: write an assert helper named AssertEqual taking (int actual, int expected)\n    //       that prints PASS on a match and FAIL otherwise.\n\n    static void Main()\n    {\n        var adder = new Adder();\n        // TODO: then call it with Add(2, 3) and 5.\n    }\n}\n',
      solution:
        'using System;\n\npublic class Adder\n{\n    public int Add(int left, int right) { return left + right; }\n}\n\nclass Program\n{\n    static void AssertEqual(int actual, int expected)\n    {\n        Console.WriteLine(actual == expected ? "PASS" : "FAIL");\n    }\n\n    static void Main()\n    {\n        var adder = new Adder();\n        AssertEqual(adder.Add(2, 3), 5);\n    }\n}\n',
    },
    {
      title: "Expect it to fail",
      concept: "Testing errors",
      context:
        "Some behaviour is a *failure on purpose* - and you test that too. The `Gate` throws when you pass a negative count. Write a test that calls `Enter(-1)` inside a `try`; print `PASS` from the `catch` because the throw was expected, or `FAIL` if no throw happened.",
      example:
        'try\n{\n    account.Withdraw(-5);\n    Console.WriteLine("FAIL");\n}\ncatch (Exception)\n{\n    Console.WriteLine("PASS");\n}',
      goal: [
        "Call `Enter(-1)` in a `try`; print `PASS` when it throws, `FAIL` if it does not.",
        "A negative count throws, so the output is PASS.",
      ],
      expected: "PASS",
      requireSource: [
        { pattern: /try/, message: "Wrap the call in a `try`." },
        { pattern: /catch/, message: "Catch the expected exception and pass." },
      ],
      starter:
        'using System;\n\npublic class Gate\n{\n    public void Enter(int count)\n    {\n        if (count < 0) throw new ArgumentException("count cannot be negative");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new Gate();\n        // TODO: call Enter(-1) in a try; PASS if it throws, FAIL if it does not.\n    }\n}\n',
      solution:
        'using System;\n\npublic class Gate\n{\n    public void Enter(int count)\n    {\n        if (count < 0) throw new ArgumentException("count cannot be negative");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new Gate();\n        try\n        {\n            gate.Enter(-1);\n            Console.WriteLine("FAIL");\n        }\n        catch (Exception)\n        {\n            Console.WriteLine("PASS");\n        }\n    }\n}\n',
    },
    {
      summary: true,
      title: "What a test is - recap",
      concept: "Recap",
      context: "A test runs your code and checks the result - Arrange, Act, Assert.",
      summaryIntro:
        "A test is ordinary code that runs your code and checks what comes back. Nothing magic - the same C# you already write.",
      summaryItems: [
        { title: "Arrange, Act, Assert - ", text: "set up, call the thing, then check the result." },
        { title: "Check the exact result - ", text: "assert the value, not just that it ran." },
        { title: "An assertion helper - ", text: "keep the check in one place and reuse it." },
        { title: "Expect it to fail - ", text: "a thrown error can be the passing result." },
      ],
      summaryClose: "Next: test doubles - stand-ins you control, so a test is fast and repeatable.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "tb",
    metaLabel: "Prove it works \u00b7 What a test is",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "testing_basics_awarded",
    awardAmount: 25,
  };
})();
