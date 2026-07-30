// Part five - "Prove it works" (testing), lesson 3: testable by design. Write-
// from-scratch builds. The point: the habits that make code easy to test - inject
// dependencies, one job per class, no hidden state - are exactly the habits SOLID
// formalises. This lesson is the bridge into "Design for change".
// Data only: window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Report\n{\n    private readonly IClock _clock;\n    public Report(IClock clock) { _clock = clock; }\n}",
      expected: "PASS",
      requireSource: [
        {
          pattern: /Notifier\s*\(\s*IClock/,
          message: "Take an `IClock` in the constructor, not a `new` inside."
        }
      ],
      starter: "using System;\n\npublic interface IClock { int Hour(); }\npublic class FixedClock : IClock { public int Hour() { return 9; } }\n\n// TODO: write a Notifier that:\n//   - takes an IClock in its constructor and stores it\n//   - Ping(): returns \"early\" when the hour is before 12, otherwise \"late\"\n\nclass Program\n{\n    static void Main()\n    {\n        var notifier = new Notifier(new FixedClock());\n        Console.WriteLine(notifier.Ping() == \"early\" ? \"PASS\" : \"FAIL\");\n    }\n}\n",
      solution: "using System;\n\npublic interface IClock { int Hour(); }\npublic class FixedClock : IClock { public int Hour() { return 9; } }\n\npublic class Notifier\n{\n    private readonly IClock _clock;\n\n    public Notifier(IClock clock)\n    {\n        _clock = clock;\n    }\n\n    public string Ping()\n    {\n        return _clock.Hour() < 12 ? \"early\" : \"late\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var notifier = new Notifier(new FixedClock());\n        Console.WriteLine(notifier.Ping() == \"early\" ? \"PASS\" : \"FAIL\");\n    }\n}\n"
    },
    {
      example: "public class Tally\n{\n    public int Net(int gains, int losses) { return gains - losses; }\n}",
      expected: "PASS",
      requireSource: [
        {
          pattern: /class\s+Scorer/,
          message: "Write a `Scorer` class."
        },
        {
          pattern: /Score\s*\(\s*int/,
          message: "Give it a `Score(int hits, int misses)` method."
        }
      ],
      starter: "using System;\n\n// TODO: write a Scorer whose Score(int hits, int misses) returns hits - misses.\n\nclass Program\n{\n    static void Main()\n    {\n        var scorer = new Scorer();\n        Console.WriteLine(scorer.Score(5, 2) == 3 ? \"PASS\" : \"FAIL\");\n    }\n}\n",
      solution: "using System;\n\npublic class Scorer\n{\n    public int Score(int hits, int misses)\n    {\n        return hits - misses;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var scorer = new Scorer();\n        Console.WriteLine(scorer.Score(5, 2) == 3 ? \"PASS\" : \"FAIL\");\n    }\n}\n"
    },
    {
      example: "public class Mix\n{\n    public int Blend(int left, int right) { return (left + right) / 2; }\n}",
      expected: "PASS",
      requireSource: [
        {
          pattern: /class\s+Prices/,
          message: "Write a `Prices` class."
        },
        {
          pattern: /Discount\s*\(\s*int/,
          message: "Give it a `Discount(int price, int percent)` method."
        }
      ],
      starter: "using System;\n\n// TODO: write a Prices whose Discount(int price, int percent) returns\n//       price - price * percent / 100.\n\nclass Program\n{\n    static void Main()\n    {\n        var prices = new Prices();\n        Console.WriteLine(prices.Discount(100, 10) == 90 ? \"PASS\" : \"FAIL\");\n    }\n}\n",
      solution: "using System;\n\npublic class Prices\n{\n    public int Discount(int price, int percent)\n    {\n        return price - price * percent / 100;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var prices = new Prices();\n        Console.WriteLine(prices.Discount(100, 10) == 90 ? \"PASS\" : \"FAIL\");\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.BUILD_CONFIG = {
    prefix: "xd",
    metaLabel: "Prove it works · Testable by design",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "testable_design_awarded",
    awardAmount: 25,
  };
})();
