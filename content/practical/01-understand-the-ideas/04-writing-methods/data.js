// Act 1, Lesson 5 - Methods. Data only; the controller is build-engine.js,
// which reads window.BUILD_CONFIG (loaded after this file).
// Pacing rule: keep the syntax trivial, put the effort into seeing what a
// method is FOR. Each task rises one small step: return, parameter, decision,
// reuse across inputs, then one method calling another.
(function () {
  "use strict";

  const tasks = [
    {
      expected: "OK",
      starter: "using System;\n\nclass Program\n{\n    static string Status()\n    {\n        // TODO: hand back \"OK\"\n        return \"\";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Status());\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static string Status()\n    {\n        return \"OK\";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Status());\n    }\n}\n"
    },
    {
      expected: "Age: 18",
      starter: "using System;\n\nclass Program\n{\n    static string Label(int age)\n    {\n        // TODO: return \"Age: \" plus the age\n        return \"\";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Label(18));\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static string Label(int age)\n    {\n        return \"Age: \" + age;\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Label(18));\n    }\n}\n"
    },
    {
      expected: "adult",
      starter: "using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        // TODO: \"adult\" when age >= 18, otherwise \"minor\"\n        return \"\";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Category(20));\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        if (age >= 18)\n        {\n            return \"adult\";\n        }\n        return \"minor\";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Category(20));\n    }\n}\n"
    },
    {
      expected: [
        "minor",
        "adult",
        "adult"
      ],
      starter: "using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        if (age >= 18)\n        {\n            return \"adult\";\n        }\n        return \"minor\";\n    }\n\n    static void Main()\n    {\n        // TODO: print Category for 16, then 18, then 40\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        if (age >= 18)\n        {\n            return \"adult\";\n        }\n        return \"minor\";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Category(16));\n        Console.WriteLine(Category(18));\n        Console.WriteLine(Category(40));\n    }\n}\n"
    },
    {
      expected: "Status: adult",
      starter: "using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        if (age >= 18)\n        {\n            return \"adult\";\n        }\n        return \"minor\";\n    }\n\n    static string Summary(int age)\n    {\n        // TODO: return \"Status: \" plus the result of Category(age)\n        return \"\";\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Summary(20));\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static string Category(int age)\n    {\n        if (age >= 18)\n        {\n            return \"adult\";\n        }\n        return \"minor\";\n    }\n\n    static string Summary(int age)\n    {\n        return \"Status: \" + Category(age);\n    }\n\n    static void Main()\n    {\n        Console.WriteLine(Summary(20));\n    }\n}\n"
    }
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
