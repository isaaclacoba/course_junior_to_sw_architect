// Part five - "Prove it works" (testing), lesson 2: test doubles. Write-from-
// scratch builds. A double is a stand-in for a real dependency so a test is
// fast, repeatable and under your control. The arc: fake a shaky dependency,
// feed canned data, and spy on an interaction. Builds directly on injection
// (Part four). Data only: window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Fake a shaky dependency",
      concept: "A fake",
      context:
        "When `Greeter` calls the real clock directly, your test is stuck with whatever time it actually is - it can pass this morning and fail tonight. Code that reaches for real things is hard to test.\n\n**A fake** is a small class you write and inject in place of the real clock, so the test decides what it returns.\n\n- Real clock: the hour changes, so the test passes in the morning and fails at night.\n- Fake clock: `Hour()` always returns `9`, so the test gives the same result every run.",
      example:
        'public class FakeRandom : IRandom\n{\n    public int Next() { return 4; }   // always the same\n}',
      goal: [
        "Write a `FixedClock : IClock` whose `Hour()` always returns `9`.",
        "Main injects it and checks the greeting, so the output is PASS.",
      ],
      expected: "PASS",
      requireSource: [
        { pattern: /class\s+FixedClock\s*:\s*IClock/, message: "Make `FixedClock` keep the promise: `: IClock`." },
        { pattern: /return\s+9/, message: "`Hour()` should always return `9`." },
      ],
      starter:
        'using System;\n\npublic interface IClock { int Hour(); }\n\npublic class Greeter\n{\n    private readonly IClock _clock;\n    public Greeter(IClock clock) { _clock = clock; }\n    public string Greet() { return _clock.Hour() < 12 ? "morning" : "afternoon"; }\n}\n\n// TODO: write a FixedClock that keeps the IClock promise and whose Hour()\n//       always returns 9.\n\nclass Program\n{\n    static void Main()\n    {\n        var greeter = new Greeter(new FixedClock());\n        Console.WriteLine(greeter.Greet() == "morning" ? "PASS" : "FAIL");\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IClock { int Hour(); }\n\npublic class Greeter\n{\n    private readonly IClock _clock;\n    public Greeter(IClock clock) { _clock = clock; }\n    public string Greet() { return _clock.Hour() < 12 ? "morning" : "afternoon"; }\n}\n\npublic class FixedClock : IClock\n{\n    public int Hour() { return 9; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var greeter = new Greeter(new FixedClock());\n        Console.WriteLine(greeter.Greet() == "morning" ? "PASS" : "FAIL");\n    }\n}\n',
    },
    {
      title: "Feed it canned data",
      concept: "A stub",
      context:
        "To check `Total`, you need to know the price going in - but a real `IPriceFeed` reads a live price that moves, so you can't say what `Total(3)` should be.\n\n**A stub** is a double that returns a value you choose, so you can set up one exact case.\n\n- Real feed: an unpredictable live price, nothing you can check against.\n- Stub feed: `Price()` returns `10`, so `Total(3)` is `30` - a number you can check.",
      example:
        'public class StubFeed : IFeed\n{\n    public int Value() { return 42; }   // the case under test\n}',
      goal: [
        "Write a `StubFeed : IPriceFeed` whose `Price()` returns `10`.",
        "Main checks `Total(3)` is `30`, so the output is PASS.",
      ],
      expected: "PASS",
      requireSource: [
        { pattern: /class\s+StubFeed\s*:\s*IPriceFeed/, message: "Make `StubFeed` keep the promise: `: IPriceFeed`." },
        { pattern: /return\s+10/, message: "`Price()` should return `10`." },
      ],
      starter:
        'using System;\n\npublic interface IPriceFeed { int Price(); }\n\npublic class Cart\n{\n    private readonly IPriceFeed _feed;\n    public Cart(IPriceFeed feed) { _feed = feed; }\n    public int Total(int qty) { return _feed.Price() * qty; }\n}\n\n// TODO: write a StubFeed that keeps the IPriceFeed promise and whose Price()\n//       returns 10.\n\nclass Program\n{\n    static void Main()\n    {\n        var cart = new Cart(new StubFeed());\n        Console.WriteLine(cart.Total(3) == 30 ? "PASS" : "FAIL");\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IPriceFeed { int Price(); }\n\npublic class Cart\n{\n    private readonly IPriceFeed _feed;\n    public Cart(IPriceFeed feed) { _feed = feed; }\n    public int Total(int qty) { return _feed.Price() * qty; }\n}\n\npublic class StubFeed : IPriceFeed\n{\n    public int Price() { return 10; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cart = new Cart(new StubFeed());\n        Console.WriteLine(cart.Total(3) == 30 ? "PASS" : "FAIL");\n    }\n}\n',
    },
    {
      title: "Spy on the call",
      concept: "A spy",
      context:
        "`Signup.Register` tells the mailer to send a welcome email, then returns nothing. A test can't check a return value, and you don't want real mail going out - what you care about is whether it called the mailer at all.\n\n**A spy** is a double that records how it was used, so you can confirm a call happened.\n\n- Real mailer: sends actual mail and hands back nothing to inspect.\n- Spy mailer: sets `WasCalled = true` on `Send()`, so the test can confirm the call.",
      example:
        'public class SpyLog : ILog\n{\n    public bool WasCalled = false;\n    public void Write(string message) { WasCalled = true; }\n}',
      goal: [
        "Write a `SpyMailer : IMailer` with a public `bool WasCalled` that `Send()` sets to `true`.",
        "Main registers a user and checks the mailer was called, so the output is PASS.",
      ],
      expected: "PASS",
      requireSource: [
        { pattern: /class\s+SpyMailer\s*:\s*IMailer/, message: "Make `SpyMailer` keep the promise: `: IMailer`." },
        { pattern: /WasCalled\s*=\s*true/, message: "`Send()` should set `WasCalled` to `true`." },
      ],
      starter:
        'using System;\n\npublic interface IMailer { void Send(string to); }\n\npublic class Signup\n{\n    private readonly IMailer _mailer;\n    public Signup(IMailer mailer) { _mailer = mailer; }\n    public void Register(string user) { _mailer.Send(user); }\n}\n\n// TODO: write a SpyMailer that keeps the IMailer promise, with a public\n//       bool WasCalled that Send() sets to true.\n\nclass Program\n{\n    static void Main()\n    {\n        var spy = new SpyMailer();\n        new Signup(spy).Register("ada");\n        Console.WriteLine(spy.WasCalled ? "PASS" : "FAIL");\n    }\n}\n',
      solution:
        'using System;\n\npublic interface IMailer { void Send(string to); }\n\npublic class Signup\n{\n    private readonly IMailer _mailer;\n    public Signup(IMailer mailer) { _mailer = mailer; }\n    public void Register(string user) { _mailer.Send(user); }\n}\n\npublic class SpyMailer : IMailer\n{\n    public bool WasCalled = false;\n    public void Send(string to) { WasCalled = true; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var spy = new SpyMailer();\n        new Signup(spy).Register("ada");\n        Console.WriteLine(spy.WasCalled ? "PASS" : "FAIL");\n    }\n}\n',
    },
    {
      summary: true,
      title: "Test doubles - recap",
      concept: "Recap",
      context: "A double stands in for a real dependency so a test is fast, repeatable and under your control.",
      summaryIntro:
        "Real dependencies - a clock, a live feed, a mailer - give a different answer each run or reach outside your program. A double is a stand-in you pass in during a test. You can pass one in because the class receives its dependencies through injection, against an interface rather than a concrete type - the payoff of that earlier work.",
      summaryItems: [
        { title: "Fake - ", text: "a plain working stand-in with fixed behaviour: a clock that is always `9`, so the test repeats." },
        { title: "Stub - ", text: "returns a value you chose, so you arrange one exact case and can predict the result." },
        { title: "Spy - ", text: "remembers how it was used, so you can confirm a call happened when there is no return value to check." },
      ],
      summaryClose: "Next: testable by design - the habits that make code easy to test are the habits behind SOLID.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "td",
    metaLabel: "Prove it works \u00b7 Test doubles",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "test_doubles_awarded",
    awardAmount: 25,
  };
})();
