// Act 1, Lesson 5 - Methods. Data only; the controller is build-engine.js,
// which reads window.BUILD_CONFIG (loaded after this file).
// Pacing rule: keep the syntax trivial, put the effort into seeing what a
// method is FOR. Each task rises one small step: return, parameter, decision,
// reuse across inputs, then one method calling another.
(function () {
  "use strict";

  const tasks = [
    {
      title: "A method hands back a result",
      concept: "Return a value",
      context:
        "A method is a named piece of behaviour that gives back an answer. You ran checks like this by hand as a tester - now the code holds the check.",
      goal: [
        "Make `Status()` return the text `\"OK\"`.",
        "Run it. The output should be `OK`.",
      ],
      expected: "OK",
      starter:
        'using System;\n\nclass Program\n{\n    static string Status()\n    {\n        // TODO: hand back "OK"\n        return "";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Status());\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static string Status()\n    {\n        return "OK";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Status());\n    }\n}\n',
    },
    {
      title: "Give the method some input",
      concept: "Parameter",
      context:
        "Real checks depend on data. A `parameter` is the value you hand in when you call the method.",
      goal: [
        "Make `Label(int age)` return `\"Age: \"` followed by the `age`.",
        "`Main` calls `Label(18)`, so the output should be `Age: 18`.",
      ],
      expected: "Age: 18",
      starter:
        'using System;\n\nclass Program\n{\n    static string Label(int age)\n    {\n        // TODO: return "Age: " plus the age\n        return "";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Label(18));\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static string Label(int age)\n    {\n        return "Age: " + age;\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Label(18));\n    }\n}\n',
    },
    {
      title: "Let the method decide",
      concept: "A rule inside",
      context:
        "A method can hold a rule, the way a test holds a pass/fail condition. Same input always gives the same answer.",
      goal: [
        "Return `\"adult\"` when `age` is 18 or more, otherwise `\"minor\"`.",
        "`Main` calls `Category(20)`, so the output should be `adult`.",
      ],
      expected: "adult",
      starter:
        'using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        // TODO: "adult" when age >= 18, otherwise "minor"\n        return "";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Category(20));\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        if (age >= 18)\n        {\n            return "adult";\n        }\n        return "minor";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Category(20));\n    }\n}\n',
    },
    {
      title: "One method, many cases",
      concept: "Write once, reuse",
      context:
        "This is the payoff. You wrote the rule once; now run it against several inputs without repeating yourself.",
      goal: [
        "Keep the same `Category` method.",
        "Call it for ages 16, 18 and 40 and print each result.",
        "The output must be exactly three lines: `minor`, `adult`, `adult`.",
      ],
      expected: ["minor", "adult", "adult"],
      starter:
        'using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        if (age >= 18)\n        {\n            return "adult";\n        }\n        return "minor";\n    }\n\n    static void Main()\n    {\n        // TODO: print Category for 16, then 18, then 40\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        if (age >= 18)\n        {\n            return "adult";\n        }\n        return "minor";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Category(16));\n        Console.WriteLine(Category(18));\n        Console.WriteLine(Category(40));\n    }\n}\n',
    },
    {
      title: "A method that uses another method",
      concept: "Build from small parts",
      context:
        "Methods can call each other, so a bigger answer is just small checks combined. This is the habit every later lesson builds on.",
      goal: [
        "`Summary(int age)` should return `\"Status: \"` followed by `Category(age)`.",
        "`Main` calls `Summary(20)`, so the output should be `Status: adult`.",
      ],
      expected: "Status: adult",
      starter:
        'using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        if (age >= 18)\n        {\n            return "adult";\n        }\n        return "minor";\n    }\n\n    static string Summary(int age)\n    {\n        // TODO: return "Status: " plus the result of Category(age)\n        return "";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Summary(20));\n    }\n}\n',
      solution:
        'using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        if (age >= 18)\n        {\n            return "adult";\n        }\n        return "minor";\n    }\n\n    static string Summary(int age)\n    {\n        return "Status: " + Category(age);\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Summary(20));\n    }\n}\n',
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "wm",
    metaLabel: "Part one - Lesson 5",
    progressNoun: "Step",
    awardedKey: "writing_methods_awarded",
    awardAmount: 20,
    tasks,
  };
})();
