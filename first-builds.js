// First Builds - write-from-scratch lesson. Data only: the controller lives in
// build-engine.js, which reads window.BUILD_CONFIG (loaded after this file).
(function () {
  "use strict";

  const tasks = [
    {
      title: "A class with one method",
      concept: "Objects",
      context:
        "An object groups data and behaviour. Here a method returns a value and Main prints it.",
      goal: [
        "Make Greeting.Say() return the text \"hello\".",
        "Run it and confirm the output is hello.",
      ],
      expected: "hello",
      starter:
        'using System;\n\npublic class Greeting\n{\n    public string Say()\n    {\n        // TODO: return "hello"\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var greeting = new Greeting();\n        Console.WriteLine(greeting.Say());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Greeting\n{\n    public string Say()\n    {\n        return "hello";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var greeting = new Greeting();\n        Console.WriteLine(greeting.Say());\n    }\n}\n',
    },
    {
      title: "One method, one job",
      concept: "Single job",
      context:
        "A method should do one clear thing. Format turns a pass/fail flag into a word.",
      goal: [
        "Return \"PASS\" when passed is true, otherwise \"FAIL\".",
        "Main calls Format(true), so the output should be PASS.",
      ],
      expected: "PASS",
      starter:
        'using System;\n\npublic class ReportFormatter\n{\n    public string Format(bool passed)\n    {\n        // TODO: "PASS" when passed is true, otherwise "FAIL"\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var formatter = new ReportFormatter();\n        Console.WriteLine(formatter.Format(true));\n    }\n}\n',
      solution:
        'using System;\n\npublic class ReportFormatter\n{\n    public string Format(bool passed)\n    {\n        return passed ? "PASS" : "FAIL";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var formatter = new ReportFormatter();\n        Console.WriteLine(formatter.Format(true));\n    }\n}\n',
    },
    {
      title: "Hand the work in",
      concept: "Inject",
      context:
        "Instead of building its tools, a class can receive them through its constructor. That is dependency injection - the same move the capstone asks for.",
      goal: [
        "Store the formatter passed into the constructor.",
        "Run() should print PASS.",
      ],
      expected: "PASS",
      starter:
        'using System;\n\npublic class ReportFormatter\n{\n    public string Format(bool passed) => passed ? "PASS" : "FAIL";\n}\n\npublic class TestRunner\n{\n    private readonly ReportFormatter _formatter;\n\n    public TestRunner(ReportFormatter formatter)\n    {\n        // TODO: keep the formatter that was handed in\n    }\n\n    public string Run() => _formatter.Format(true);\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var runner = new TestRunner(new ReportFormatter());\n        Console.WriteLine(runner.Run());\n    }\n}\n',
      solution:
        'using System;\n\npublic class ReportFormatter\n{\n    public string Format(bool passed) => passed ? "PASS" : "FAIL";\n}\n\npublic class TestRunner\n{\n    private readonly ReportFormatter _formatter;\n\n    public TestRunner(ReportFormatter formatter)\n    {\n        _formatter = formatter;\n    }\n\n    public string Run() => _formatter.Format(true);\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var runner = new TestRunner(new ReportFormatter());\n        Console.WriteLine(runner.Run());\n    }\n}\n',
    },
    {
      title: "Depend on an interface",
      concept: "Abstraction",
      context:
        "An interface is a promise about what a type can do, not how. Code that depends on the interface does not care which class fills it.",
      goal: [
        "Declare the method on IReporter so the call compiles.",
        "The output should be PASS.",
      ],
      expected: "PASS",
      starter:
        'using System;\n\npublic interface IReporter\n{\n    // TODO: declare string Report(bool passed);\n}\n\npublic class PassFailReporter : IReporter\n{\n    public string Report(bool passed) => passed ? "PASS" : "FAIL";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IReporter reporter = new PassFailReporter();\n        Console.WriteLine(reporter.Report(true));\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IReporter\n{\n    string Report(bool passed);\n}\n\npublic class PassFailReporter : IReporter\n{\n    public string Report(bool passed) => passed ? "PASS" : "FAIL";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IReporter reporter = new PassFailReporter();\n        Console.WriteLine(reporter.Report(true));\n    }\n}\n',
    },
    {
      title: "Swap in a new reporter",
      concept: "Open to extend",
      context:
        "Because callers depend on IReporter, you can add a new reporter without touching the old one. New behaviour by adding a class, not editing existing code.",
      goal: [
        "Implement EmojiReporter.Report to return \"OK\" when passed, otherwise \"X\".",
        "Main now uses EmojiReporter, so the output should be OK.",
      ],
      expected: "OK",
      starter:
        'using System;\n\npublic interface IReporter\n{\n    string Report(bool passed);\n}\n\npublic class PassFailReporter : IReporter\n{\n    public string Report(bool passed) => passed ? "PASS" : "FAIL";\n}\n\npublic class EmojiReporter : IReporter\n{\n    // TODO: return "OK" when passed, otherwise "X"\n    public string Report(bool passed) => "";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IReporter reporter = new EmojiReporter();\n        Console.WriteLine(reporter.Report(true));\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IReporter\n{\n    string Report(bool passed);\n}\n\npublic class PassFailReporter : IReporter\n{\n    public string Report(bool passed) => passed ? "PASS" : "FAIL";\n}\n\npublic class EmojiReporter : IReporter\n{\n    public string Report(bool passed) => passed ? "OK" : "X";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IReporter reporter = new EmojiReporter();\n        Console.WriteLine(reporter.Report(true));\n    }\n}\n',
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "fb",
    metaLabel: "Bridge: First Builds",
    progressNoun: "Build",
    awardedKey: "first_builds_awarded",
    awardAmount: 25,
    tasks,
  };
})();
