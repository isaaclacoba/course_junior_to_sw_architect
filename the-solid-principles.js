// Part six - "Design for change": The SOLID principles. Write-from-scratch
// builds. One small test-automation codebase, one principle per task, each in
// order S, O, L, I, D. Every task describes the trap in plain prose (the bad
// shape and its concrete cost), then asks the learner to write the fix. The
// output is fixed, the requireSource gate enforces the SOLID technique, and a
// hidden verify probe re-runs the learner's classes against different inputs so
// a faked answer cannot pass. Data only: window.BUILD_CONFIG (build-engine.js
// reads it, loaded after this file).
(function () {
  "use strict";

  const tasks = [
    {
      title: "S - Single Responsibility: split the jobs",
      concept: "Single Responsibility",
      context:
        "This is the **S** in SOLID: Single Responsibility. A class should have one job, so it has one reason to change.\n\nThe trap: `LoginTest` does two jobs in one method - it runs the check and it builds the report text. When someone reworded the report last month, the login check broke too, because both lived in the same place. Two unrelated things sharing a method means touching one bruises the other.\n\nThe fix: leave `LoginTest` with only the check, and move the report text into its own class.",
      example:
        "public class Door\n{\n    public bool IsOpen()\n    {\n        return true;\n    }\n}\n\npublic class DoorSign\n{\n    public string Show(bool open)\n    {\n        return open ? \"OPEN\" : \"SHUT\";\n    }\n}",
      goal: [
        "Leave `LoginTest` with only the check: a `bool Run()` that returns `true`.",
        "Write a `ReportFormatter` with `string Format(bool passed)` returning `\"PASS\"` or `\"FAIL\"`.",
        "`Main` runs the test, then formats the result. The output stays `PASS`.",
      ],
      expected: "PASS",
      requireSource: [
        { pattern: /class\s+ReportFormatter/, message: "Move the report text into its own `ReportFormatter` class." },
        { pattern: /string\s+Format\s*\(\s*bool/, message: "Give `ReportFormatter` a `Format(bool passed)` method that returns the text." },
        { pattern: /bool\s+Run\s*\(\s*\)/, message: "Leave `LoginTest` with only the check: a `bool Run()`." },
        { pattern: /^(?![\s\S]*RunAndReport)[\s\S]*$/, message: "Split the two jobs - `LoginTest` should no longer both run the check and build the report." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var formatter = new ReportFormatter();\n        System.Console.WriteLine(formatter.Format(false));\n    }\n}\n',
        expected: "FAIL",
        message:
          "`ReportFormatter` should turn any result into text on its own - a failing result should read FAIL, with no help from `LoginTest`.",
      },
      starter:
        'using System;\n\npublic class LoginTest\n{\n    // one method: runs the check AND builds the report text\n    public string RunAndReport()\n    {\n        bool passed = true;                        // the check\n        return passed ? "PASS" : "FAIL";           // the formatting\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var test = new LoginTest();\n        Console.WriteLine(test.RunAndReport());\n    }\n}\n',
      solution:
        'using System;\n\npublic class LoginTest\n{\n    public bool Run()\n    {\n        return true;\n    }\n}\n\npublic class ReportFormatter\n{\n    public string Format(bool passed)\n    {\n        return passed ? "PASS" : "FAIL";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var test = new LoginTest();\n        bool passed = test.Run();\n\n        var formatter = new ReportFormatter();\n        Console.WriteLine(formatter.Format(passed));\n    }\n}\n',
    },
    {
      title: "O - Open/Closed: add a style without editing",
      concept: "Open/Closed",
      context:
        "This is the **O** in SOLID: Open/Closed. Code should be open to new behaviour but closed to edits - you add a case without reopening what already works.\n\nThe trap: `ReportFormatter.Build` decides the style with a chain of `if` checks. Every new style means editing this one method, and each edit risks breaking the styles that already passed.\n\nThe fix: make each style its own class behind a shared `IReport` interface. A new style becomes a new class, and the old ones are never touched.",
      example:
        "public interface IGreeting\n{\n    string Say();\n}\n\npublic class Hello : IGreeting\n{\n    public string Say()\n    {\n        return \"hi\";\n    }\n}\n\npublic class Bye : IGreeting\n{\n    public string Say()\n    {\n        return \"later\";\n    }\n}",
      goal: [
        "Declare `interface IReport` with `string Build(bool passed)`.",
        "Write a `PlainReport` (`\"PASS\"`/`\"FAIL\"`) and an `EmojiReport` (`\"OK\"`/`\"X\"`), each implementing `IReport`.",
        "`Main` uses a `PlainReport` through an `IReport` variable. The output stays `PASS`.",
      ],
      expected: "PASS",
      requireSource: [
        { pattern: /interface\s+IReport/, message: "Declare an `IReport` interface with `string Build(bool passed)`." },
        { pattern: /class\s+PlainReport\s*:\s*IReport/, message: "Write a `PlainReport` that implements `IReport`." },
        { pattern: /class\s+EmojiReport\s*:\s*IReport/, message: "Write an `EmojiReport` that implements `IReport`." },
        { pattern: /^(?![\s\S]*style\s*==)[\s\S]*$/, message: "Drop the `style ==` checks - each style is now its own class, chosen by type." },
        { pattern: /^(?![\s\S]*\bswitch\b)[\s\S]*$/, message: "No `switch` on the style either - the type picks the behaviour now." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        IReport report = new EmojiReport();\n        System.Console.WriteLine(report.Build(true));\n    }\n}\n',
        expected: "OK",
        message:
          "Adding a style must not touch the others. An `EmojiReport` should build its own text - OK when passed - through the same `IReport`.",
      },
      starter:
        'using System;\n\npublic class ReportFormatter\n{\n    // every new style forces another edit to this method\n    public string Build(string style, bool passed)\n    {\n        if (style == "plain")\n            return passed ? "PASS" : "FAIL";\n        if (style == "emoji")\n            return passed ? "OK" : "X";\n        return "unknown";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var formatter = new ReportFormatter();\n        Console.WriteLine(formatter.Build("plain", true));\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IReport\n{\n    string Build(bool passed);\n}\n\npublic class PlainReport : IReport\n{\n    public string Build(bool passed)\n    {\n        return passed ? "PASS" : "FAIL";\n    }\n}\n\npublic class EmojiReport : IReport\n{\n    public string Build(bool passed)\n    {\n        return passed ? "OK" : "X";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IReport report = new PlainReport();\n        Console.WriteLine(report.Build(true));\n    }\n}\n',
    },
    {
      title: "L - Liskov Substitution: stop the subtype lying",
      concept: "Liskov Substitution",
      context:
        "This is the **L** in SOLID: Liskov Substitution. Any subtype must be usable anywhere its parent is, with no surprises.\n\nThe trap: `SkippedTest` inherits `Test` to reuse its code, but a skipped test has no real result, so its `Run()` throws. Now any code holding a `Test` blows up the moment it happens to be a `SkippedTest`. The child broke a promise the parent made - and this starter throws when you run it.\n\nThe fix: drop the false is-a relationship. Have both types implement a small shared `IRunnable` and return a real outcome for every case, so none of them throws.",
      example:
        "public interface IReadable\n{\n    string Read();\n}\n\npublic class Book : IReadable\n{\n    public string Read()\n    {\n        return \"Words\";\n    }\n}\n\npublic class BlankPage : IReadable\n{\n    public string Read()\n    {\n        return \"Empty\";\n    }\n}",
      goal: [
        "Declare `interface IRunnable` with `string Run()`.",
        "Make `LoginTest` implement it (`Run` returns `\"Pass\"`) and `SkippedTest` implement it (`Run` returns `\"Skipped\"` - never throw).",
        "`Main` runs a `SkippedTest` through an `IRunnable`. The output should be `Skipped`.",
      ],
      expected: "Skipped",
      requireSource: [
        { pattern: /interface\s+IRunnable/, message: "Declare an `IRunnable` interface with `string Run()` that every test can honour." },
        { pattern: /class\s+LoginTest\s*:\s*IRunnable/, message: "Make `LoginTest` implement `IRunnable`." },
        { pattern: /class\s+SkippedTest\s*:\s*IRunnable/, message: "Make `SkippedTest` implement `IRunnable` instead of inheriting `Test`." },
        { pattern: /^(?![\s\S]*throw\s+new)[\s\S]*$/, message: "No `throw` - every `Run()` must return a real outcome, even a skipped one." },
        { pattern: /^(?![\s\S]*:\s*Test\b)[\s\S]*$/, message: "Drop the inheritance from `Test` - a skipped test is not a runnable test." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        IRunnable a = new LoginTest();\n        IRunnable b = new SkippedTest();\n        System.Console.WriteLine(a.Run());\n        System.Console.WriteLine(b.Run());\n    }\n}\n',
        expected: ["Pass", "Skipped"],
        message:
          "Any `IRunnable` must be safe to run. A `LoginTest` should read Pass and a `SkippedTest` should read Skipped - neither may throw.",
      },
      starter:
        'using System;\n\npublic class Test\n{\n    public virtual string Run()\n    {\n        return "Pass";\n    }\n}\n\npublic class SkippedTest : Test\n{\n    // a skipped test has no real result, so it breaks the promise\n    public override string Run()\n    {\n        throw new InvalidOperationException("skipped");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Test test = new SkippedTest();\n        Console.WriteLine(test.Run());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IRunnable\n{\n    string Run();\n}\n\npublic class LoginTest : IRunnable\n{\n    public string Run()\n    {\n        return "Pass";\n    }\n}\n\npublic class SkippedTest : IRunnable\n{\n    public string Run()\n    {\n        return "Skipped";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IRunnable test = new SkippedTest();\n        Console.WriteLine(test.Run());\n    }\n}\n',
    },
    {
      title: "I - Interface Segregation: split the fat interface",
      concept: "Interface Segregation",
      context:
        "This is the **I** in SOLID: Interface Segregation. A class should only depend on the methods it actually uses.\n\nThe trap: one fat `ITestPlugin` interface demands `Run`, `Report`, and `Retry`. A plugin that only formats reports is still forced to implement all three, so `Run` and `Retry` become fake bodies that throw. Those fakes are noise, and other code can call them by mistake.\n\nThe fix: split the fat interface into small focused ones - `IRunnable` and `IReportable` - so the report plugin implements only the one it needs.",
      example:
        "public interface IWasher\n{\n    string Wash();\n}\n\npublic interface IDryer\n{\n    string Dry();\n}\n\npublic class HandTowel : IDryer\n{\n    public string Dry()\n    {\n        return \"dry\";\n    }\n}",
      goal: [
        "Declare two small interfaces: `IRunnable` with `string Run()`, and `IReportable` with `string Report()`.",
        "Make `ReportPlugin` implement only `IReportable`, with `Report()` returning `\"report ready\"`.",
        "`Main` uses the plugin through an `IReportable`. The output stays `report ready`.",
      ],
      expected: "report ready",
      requireSource: [
        { pattern: /interface\s+IRunnable/, message: "Split the fat interface: declare an `IRunnable` with `string Run()`." },
        { pattern: /interface\s+IReportable/, message: "Declare an `IReportable` with `string Report()`." },
        { pattern: /class\s+ReportPlugin\s*:\s*IReportable/, message: "`ReportPlugin` should implement only `IReportable` - the interface it actually needs." },
        { pattern: /^(?![\s\S]*interface\s+ITestPlugin)[\s\S]*$/, message: "Drop the fat `ITestPlugin` - a plugin should not depend on methods it never uses." },
        { pattern: /^(?![\s\S]*NotImplementedException)[\s\S]*$/, message: "No fake `Run`/`Retry` bodies - if `ReportPlugin` only reports, it should not have them at all." },
      ],
      verify: {
        main:
          'class Program\n{\n    class SummaryPlugin : IReportable\n    {\n        public string Report()\n        {\n            return "summary ready";\n        }\n    }\n    static void Main()\n    {\n        IReportable plugin = new SummaryPlugin();\n        System.Console.WriteLine(plugin.Report());\n    }\n}\n',
        expected: "summary ready",
        message:
          "`IReportable` should stand on its own, so any reporter can implement just it without a `Run` or `Retry` in sight.",
      },
      starter:
        'using System;\n\npublic interface ITestPlugin\n{\n    string Run();\n    string Report();\n    string Retry();\n}\n\n// only formats reports, but the fat interface forces all three\npublic class ReportPlugin : ITestPlugin\n{\n    public string Run()\n    {\n        throw new NotImplementedException();\n    }\n\n    public string Report()\n    {\n        return "report ready";\n    }\n\n    public string Retry()\n    {\n        throw new NotImplementedException();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        ITestPlugin plugin = new ReportPlugin();\n        Console.WriteLine(plugin.Report());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IRunnable\n{\n    string Run();\n}\n\npublic interface IReportable\n{\n    string Report();\n}\n\n// the report plugin implements only the interface it needs\npublic class ReportPlugin : IReportable\n{\n    public string Report()\n    {\n        return "report ready";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        IReportable plugin = new ReportPlugin();\n        Console.WriteLine(plugin.Report());\n    }\n}\n',
    },
    {
      title: "D - Dependency Inversion: inject the reporter",
      concept: "Dependency Inversion",
      context:
        "This is the **D** in SOLID: Dependency Inversion. High-level code should depend on an interface, not reach out and build a concrete class itself.\n\nThe trap: `TestRunner` builds its own `ConsoleReporter` with `new`, inside itself. The runner is welded to the console - you cannot point it at a file, and in a test you cannot check what it reported without it printing for real.\n\nThe fix: have `TestRunner` receive an `IReporter` through its constructor instead of building one. Now a test can hand it a fake reporter that just records the message - which is the payoff you will lean on for testing.",
      example:
        "public interface IClock\n{\n    int Hour();\n}\n\npublic class Alarm\n{\n    private readonly IClock _clock;\n\n    public Alarm(IClock clock)\n    {\n        _clock = clock;\n    }\n}",
      goal: [
        "Declare `interface IReporter` with `void Send(string message)`, and make `ConsoleReporter` implement it.",
        "Change `TestRunner` to receive an `IReporter` through its constructor and store it in a `private readonly` field - no `new` inside.",
        "`Main` hands in a `ConsoleReporter`. The output stays `test passed`.",
      ],
      expected: "test passed",
      requireSource: [
        { pattern: /interface\s+IReporter/, message: "Declare an `IReporter` interface with `void Send(string message)`." },
        { pattern: /class\s+ConsoleReporter\s*:\s*IReporter/, message: "Make `ConsoleReporter` implement `IReporter`." },
        { pattern: /TestRunner\s*\(\s*IReporter/, message: "Have `TestRunner` receive an `IReporter` through its constructor." },
        { pattern: /^(?![\s\S]*=\s*new\s+ConsoleReporter\s*\(\s*\)\s*;)[\s\S]*$/, message: "Don't build the reporter inside `TestRunner` - the field must be assigned from the constructor parameter, not `new`ed." },
      ],
      verify: {
        main:
          'class Program\n{\n    class FakeReporter : IReporter\n    {\n        public string Last = "";\n        public void Send(string message)\n        {\n            Last = message;\n        }\n    }\n    static void Main()\n    {\n        var fake = new FakeReporter();\n        var runner = new TestRunner(fake);\n        runner.Run();\n        System.Console.WriteLine(fake.Last);\n    }\n}\n',
        expected: "test passed",
        message:
          "The point of injecting is that a test can pass a fake. Store the injected `IReporter` and call it, so a `FakeReporter` records the message instead of printing.",
      },
      starter:
        'using System;\n\npublic class ConsoleReporter\n{\n    public void Send(string message)\n    {\n        Console.WriteLine(message);\n    }\n}\n\npublic class TestRunner\n{\n    // the runner builds its own reporter - welded to the console\n    private readonly ConsoleReporter _reporter = new ConsoleReporter();\n\n    public void Run()\n    {\n        _reporter.Send("test passed");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var runner = new TestRunner();\n        runner.Run();\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IReporter\n{\n    void Send(string message);\n}\n\npublic class ConsoleReporter : IReporter\n{\n    public void Send(string message)\n    {\n        Console.WriteLine(message);\n    }\n}\n\npublic class TestRunner\n{\n    private readonly IReporter _reporter;\n\n    public TestRunner(IReporter reporter)\n    {\n        _reporter = reporter;\n    }\n\n    public void Run()\n    {\n        _reporter.Send("test passed");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var runner = new TestRunner(new ConsoleReporter());\n        runner.Run();\n    }\n}\n',
    },
    {
      summary: true,
      title: "What you learned",
      concept: "SOLID recap",
      context: "Five habits, each one a small fix to a real problem you just wrote your way out of.",
      summaryIntro:
        "SOLID is five habits for writing classes that are easy to change without breaking other code. You met each one as a trap first, then wrote the fix:",
      summaryItems: [
        { title: "S - Single Responsibility - ", text: "one class, one job. When checking and formatting shared a method, changing one broke the other. Split the jobs into separate classes." },
        { title: "O - Open/Closed - ", text: "add new behaviour without editing old code. Instead of growing an `if`-chain, add a new class behind a shared interface. Old code stays untouched." },
        { title: "L - Liskov Substitution - ", text: "a subtype must work anywhere its parent does. `SkippedTest` inheriting `Test` broke that by throwing. A small shared interface every type can honour fixes it." },
        { title: "I - Interface Segregation - ", text: "don't force a class to implement methods it never uses. Split one fat interface into small focused ones, so each class implements only what it does." },
        { title: "D - Dependency Inversion - ", text: "depend on an interface and receive it from outside, instead of building a concrete class inside. That is dependency injection, and it lets you pass a fake in tests." },
      ],
      summaryClose:
        "The thread that ties them together: polymorphism, composition, and encapsulation are the tools, and SOLID is how you aim them. The D fix - injecting a fake reporter - is also why automated testing becomes possible, which is where the capstone puts it all to work.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "l2",
    metaLabel: "Design for change \u00b7 The SOLID principles",
    progressNoun: "Step",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "level2_awarded",
    awardAmount: 25,
  };
})();
