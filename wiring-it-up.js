// Wiring It Up - write-from-scratch lesson that sits between First Builds and
// the Capstone. Same reporter/runner world as First Builds, one notch harder:
// loops, polymorphic collections, composing several collaborators, an SRP
// split, and a small multi-line pipeline. Data only: the controller lives in
// build-engine.js, which reads window.BUILD_CONFIG (loaded after this file).
(function () {
  "use strict";

  // Technique gate: real iteration or a LINQ aggregation, so a hardcoded answer
  // that prints the expected value is rejected even though the output matches.
  const ITERATES = /foreach|\bfor\b|\bwhile\b|\.Count\s*\(|\.Where\s*\(|\.Sum\s*\(|\.Select\s*\(/;

  const tasks = [
    {
      title: "Count what passed",
      concept: "Loops",
      context:
        "First Builds returned single values. Real code works over collections. Loop across the results and count how many are true.",
      goal: [
        "Implement CountPasses to return the number of true values in results.",
        "Main passes three results with two true, so the output should be 2.",
      ],
      expected: "2",
      requireSource: [
        { pattern: ITERATES, message: "Count the passes by looping over results - returning a fixed number does not count." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var counter = new ResultCounter();\n        bool[] results = { true, true, true };\n        Console.WriteLine(counter.CountPasses(results));\n    }\n}\n',
        expected: "3",
        message: "Your code printed 2 for this example but returns the wrong count for other inputs. Actually count the true values instead of returning a fixed number.",
      },
      starter:
        'using System;\n\npublic class ResultCounter\n{\n    public int CountPasses(bool[] results)\n    {\n        // TODO: loop over results and count how many are true\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var counter = new ResultCounter();\n        bool[] results = { true, false, true };\n        Console.WriteLine(counter.CountPasses(results));\n    }\n}\n',
      solution:
        'using System;\n\npublic class ResultCounter\n{\n    public int CountPasses(bool[] results)\n    {\n        int passed = 0;\n        foreach (var result in results)\n        {\n            if (result) passed++;\n        }\n        return passed;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var counter = new ResultCounter();\n        bool[] results = { true, false, true };\n        Console.WriteLine(counter.CountPasses(results));\n    }\n}\n',
    },
    {
      title: "Run a list of checks",
      concept: "Polymorphism",
      context:
        "Each check hides its own logic behind ICheck. Treat them all the same: run each one and count the passes. The caller never asks which class a check is.",
      goal: [
        "In Summarize, run every check and count how many return true.",
        'Return "{passed} / {total} passed".',
        "The three checks give two passes, so the output should be 2 / 3 passed.",
      ],
      expected: "2 / 3 passed",
      requireSource: [
        { pattern: ITERATES, message: "Loop over the checks instead of hardcoding the count." },
        { pattern: /\.\s*Run\s*\(/, message: "Actually run each check by calling Run()." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var suite = new Suite(new ICheck[]\n        {\n            new AlwaysPass(),\n            new AlwaysPass(),\n            new AlwaysPass(),\n        });\n        Console.WriteLine(suite.Summarize());\n    }\n}\n',
        expected: "3 / 3 passed",
        message: "Your summary is right for this example but wrong for other inputs. Run each check and count the real passes instead of hardcoding the number.",
      },
      starter:
        'using System;\n\npublic interface ICheck\n{\n    bool Run();\n}\n\npublic class AlwaysPass : ICheck\n{\n    public bool Run() => true;\n}\n\npublic class AlwaysFail : ICheck\n{\n    public bool Run() => false;\n}\n\npublic class Suite\n{\n    private readonly ICheck[] _checks;\n\n    public Suite(ICheck[] checks)\n    {\n        _checks = checks;\n    }\n\n    public string Summarize()\n    {\n        // TODO: run every check, count the passes,\n        // and return "{passed} / {total} passed"\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var suite = new Suite(new ICheck[]\n        {\n            new AlwaysPass(),\n            new AlwaysFail(),\n            new AlwaysPass(),\n        });\n        Console.WriteLine(suite.Summarize());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface ICheck\n{\n    bool Run();\n}\n\npublic class AlwaysPass : ICheck\n{\n    public bool Run() => true;\n}\n\npublic class AlwaysFail : ICheck\n{\n    public bool Run() => false;\n}\n\npublic class Suite\n{\n    private readonly ICheck[] _checks;\n\n    public Suite(ICheck[] checks)\n    {\n        _checks = checks;\n    }\n\n    public string Summarize()\n    {\n        int passed = 0;\n        foreach (var check in _checks)\n        {\n            if (check.Run()) passed++;\n        }\n        return $"{passed} / {_checks.Length} passed";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var suite = new Suite(new ICheck[]\n        {\n            new AlwaysPass(),\n            new AlwaysFail(),\n            new AlwaysPass(),\n        });\n        Console.WriteLine(suite.Summarize());\n    }\n}\n',
    },
    {
      title: "Two collaborators",
      concept: "Compose",
      context:
        "A runner does not need to know how a check decides or how a reporter phrases the result. Hand it both through the constructor and let each do its own job.",
      goal: [
        "Store the check and the reporter the constructor receives.",
        "Run() should run the check and pass the result to the reporter.",
        "The check passes, so the output should be PASS.",
      ],
      expected: "PASS",
      requireSource: [
        { pattern: /_check\s*\.\s*Run\s*\(/, message: "Run the check (call _check.Run())." },
        { pattern: /_reporter\s*\.\s*Report\s*\(/, message: "Hand the result to the reporter (call _reporter.Report(...))." },
      ],
      verify: {
        main:
          'public class _ProbeFail : ICheck { public bool Run() => false; }\nclass Program\n{\n    static void Main()\n    {\n        var runner = new TestRunner(new _ProbeFail(), new WordReporter());\n        Console.WriteLine(runner.Run());\n    }\n}\n',
        expected: "FAIL",
        message: "It prints PASS here, but a failing check should report FAIL. Run the check and report its real result instead of a fixed word.",
      },
      starter:
        'using System;\n\npublic interface ICheck { bool Run(); }\npublic interface IReporter { string Report(bool passed); }\n\npublic class AlwaysPass : ICheck { public bool Run() => true; }\npublic class WordReporter : IReporter { public string Report(bool passed) => passed ? "PASS" : "FAIL"; }\n\npublic class TestRunner\n{\n    private readonly ICheck _check;\n    private readonly IReporter _reporter;\n\n    public TestRunner(ICheck check, IReporter reporter)\n    {\n        // TODO: keep both collaborators\n    }\n\n    public string Run()\n    {\n        // TODO: run the check, then report the result\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var runner = new TestRunner(new AlwaysPass(), new WordReporter());\n        Console.WriteLine(runner.Run());\n    }\n}\n',
      solution:
        'using System;\n\npublic interface ICheck { bool Run(); }\npublic interface IReporter { string Report(bool passed); }\n\npublic class AlwaysPass : ICheck { public bool Run() => true; }\npublic class WordReporter : IReporter { public string Report(bool passed) => passed ? "PASS" : "FAIL"; }\n\npublic class TestRunner\n{\n    private readonly ICheck _check;\n    private readonly IReporter _reporter;\n\n    public TestRunner(ICheck check, IReporter reporter)\n    {\n        _check = check;\n        _reporter = reporter;\n    }\n\n    public string Run()\n    {\n        return _reporter.Report(_check.Run());\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var runner = new TestRunner(new AlwaysPass(), new WordReporter());\n        Console.WriteLine(runner.Run());\n    }\n}\n',
    },
    {
      title: "One job each",
      concept: "Single job",
      context:
        "Counting passes and phrasing the summary are two different jobs. Keep them in two classes so either can change on its own. The wiring is done for you - fill in the counting.",
      goal: [
        "Implement CountPasses to return how many results are true.",
        "Build combines the counter and the formatter.",
        "Two of three pass, so the output should be 2/3.",
      ],
      expected: "2/3",
      requireSource: [
        { pattern: ITERATES, message: "Count the passes by looping over results - returning a fixed number does not count." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var report = new Report(new ResultCounter(), new SummaryFormatter());\n        bool[] results = { true, true, true };\n        Console.WriteLine(report.Build(results));\n    }\n}\n',
        expected: "3/3",
        message: "Right for this example, wrong for other inputs. Count the true results instead of returning a fixed number.",
      },
      starter:
        'using System;\n\npublic class ResultCounter\n{\n    public int CountPasses(bool[] results)\n    {\n        // TODO: return how many results are true\n        return 0;\n    }\n}\n\npublic class SummaryFormatter\n{\n    public string Format(int passed, int total) => $"{passed}/{total}";\n}\n\npublic class Report\n{\n    private readonly ResultCounter _counter;\n    private readonly SummaryFormatter _formatter;\n\n    public Report(ResultCounter counter, SummaryFormatter formatter)\n    {\n        _counter = counter;\n        _formatter = formatter;\n    }\n\n    public string Build(bool[] results)\n        => _formatter.Format(_counter.CountPasses(results), results.Length);\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var report = new Report(new ResultCounter(), new SummaryFormatter());\n        bool[] results = { true, false, true };\n        Console.WriteLine(report.Build(results));\n    }\n}\n',
      solution:
        'using System;\n\npublic class ResultCounter\n{\n    public int CountPasses(bool[] results)\n    {\n        int passed = 0;\n        foreach (var result in results)\n        {\n            if (result) passed++;\n        }\n        return passed;\n    }\n}\n\npublic class SummaryFormatter\n{\n    public string Format(int passed, int total) => $"{passed}/{total}";\n}\n\npublic class Report\n{\n    private readonly ResultCounter _counter;\n    private readonly SummaryFormatter _formatter;\n\n    public Report(ResultCounter counter, SummaryFormatter formatter)\n    {\n        _counter = counter;\n        _formatter = formatter;\n    }\n\n    public string Build(bool[] results)\n        => _formatter.Format(_counter.CountPasses(results), results.Length);\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var report = new Report(new ResultCounter(), new SummaryFormatter());\n        bool[] results = { true, false, true };\n        Console.WriteLine(report.Build(results));\n    }\n}\n',
    },
    {
      title: "Report a pass rate",
      concept: "Open to extend",
      context:
        "Callers depend on the interface, so a new style of report is a new class, not an edit to the old one. Add a reporter that turns a whole run into a percentage.",
      goal: [
        "Implement PassRateReporter.Report: count the true results and return their share as a whole-number percent, e.g. \"50%\".",
        "Two of four pass, so the output should be 50%.",
      ],
      expected: "50%",
      requireSource: [
        { pattern: ITERATES, message: "Count the passes by looping over results, don't hardcode the rate." },
        { pattern: /results\s*\.\s*Length|results\s*\.\s*Count/, message: "Work out the percentage from the number of results." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        ISummaryReporter reporter = new PassRateReporter();\n        bool[] results = { true, true, true, true };\n        Console.WriteLine(reporter.Report(results));\n    }\n}\n',
        expected: "100%",
        message: "50% is right for this example only. Compute the percentage from the real pass count instead of hardcoding it.",
      },
      starter:
        'using System;\n\npublic interface ISummaryReporter\n{\n    string Report(bool[] results);\n}\n\npublic class PassRateReporter : ISummaryReporter\n{\n    public string Report(bool[] results)\n    {\n        // TODO: count the passes and return their share as a percent, e.g. "50%"\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        ISummaryReporter reporter = new PassRateReporter();\n        bool[] results = { true, true, false, false };\n        Console.WriteLine(reporter.Report(results));\n    }\n}\n',
      solution:
        'using System;\n\npublic interface ISummaryReporter\n{\n    string Report(bool[] results);\n}\n\npublic class PassRateReporter : ISummaryReporter\n{\n    public string Report(bool[] results)\n    {\n        int passed = 0;\n        foreach (var result in results)\n        {\n            if (result) passed++;\n        }\n        int percent = results.Length == 0 ? 0 : passed * 100 / results.Length;\n        return $"{percent}%";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        ISummaryReporter reporter = new PassRateReporter();\n        bool[] results = { true, true, false, false };\n        Console.WriteLine(reporter.Report(results));\n    }\n}\n',
    },
    {
      title: "The whole pipeline",
      concept: "Put it together",
      context:
        "Now assemble a small system: a list of named checks, run each one, and print a line per check. This is the exact shape the Capstone scales up.",
      goal: [
        'For each check, print "{Name}: PASS" when it passes, otherwise "{Name}: FAIL".',
        "Print one line per check, in order.",
        "Expected output: login: PASS then logout: FAIL.",
      ],
      expected: ["login: PASS", "logout: FAIL"],
      requireSource: [
        { pattern: ITERATES, message: "Loop over the checks instead of printing fixed lines." },
        { pattern: /\.\s*Name\b/, message: "Print each check's Name property." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var pipeline = new Pipeline(new ICheck[]\n        {\n            new Check("alpha", false),\n            new Check("beta", true),\n        });\n        pipeline.Report();\n    }\n}\n',
        expected: ["alpha: FAIL", "beta: PASS"],
        message: "Those lines are right for this example only. Print each check's real Name and result instead of fixed text.",
      },
      starter:
        'using System;\n\npublic interface ICheck\n{\n    string Name { get; }\n    bool Run();\n}\n\npublic class Check : ICheck\n{\n    public string Name { get; }\n    private readonly bool _result;\n\n    public Check(string name, bool result)\n    {\n        Name = name;\n        _result = result;\n    }\n\n    public bool Run() => _result;\n}\n\npublic class Pipeline\n{\n    private readonly ICheck[] _checks;\n\n    public Pipeline(ICheck[] checks)\n    {\n        _checks = checks;\n    }\n\n    public void Report()\n    {\n        // TODO: print one line per check: "{Name}: PASS" or "{Name}: FAIL"\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pipeline = new Pipeline(new ICheck[]\n        {\n            new Check("login", true),\n            new Check("logout", false),\n        });\n        pipeline.Report();\n    }\n}\n',
      solution:
        'using System;\n\npublic interface ICheck\n{\n    string Name { get; }\n    bool Run();\n}\n\npublic class Check : ICheck\n{\n    public string Name { get; }\n    private readonly bool _result;\n\n    public Check(string name, bool result)\n    {\n        Name = name;\n        _result = result;\n    }\n\n    public bool Run() => _result;\n}\n\npublic class Pipeline\n{\n    private readonly ICheck[] _checks;\n\n    public Pipeline(ICheck[] checks)\n    {\n        _checks = checks;\n    }\n\n    public void Report()\n    {\n        foreach (var check in _checks)\n        {\n            string status = check.Run() ? "PASS" : "FAIL";\n            Console.WriteLine($"{check.Name}: {status}");\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pipeline = new Pipeline(new ICheck[]\n        {\n            new Check("login", true),\n            new Check("logout", false),\n        });\n        pipeline.Report();\n    }\n}\n',
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "wu",
    metaLabel: "Bridge: Wiring It Up",
    progressNoun: "Build",
    awardedKey: "wiring_it_up_awarded",
    awardAmount: 25,
    tasks,
  };
})();
