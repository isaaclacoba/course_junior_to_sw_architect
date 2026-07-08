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
      concept: "A stand-in you control",
      context:
        "The `Greeter` asks an `IClock` for the hour. A real clock gives a different answer every run, so a test could pass at 9am and fail at 9pm - useless. Write a `FixedClock` that keeps the `IClock` promise and whose `Hour()` always returns `9`. Injected, it makes the test repeatable.",
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
        "A double can also hand back a value you choose, so you set up the exact case you want to check. The `Cart` asks an `IPriceFeed` for the price. Write a `StubFeed : IPriceFeed` whose `Price()` returns `10`, so `Total(3)` is a value you can predict.",
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
        "Sometimes the thing you want to check is not a return value but *that a call happened*. A spy is a double that remembers. The `Signup` should tell an `IMailer` to send a welcome. Write a `SpyMailer : IMailer` with a public `bool WasCalled` that `Send()` sets to `true`, so the test can confirm the mail went out.",
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
        "Injection let you hand a class its dependencies - a double is a stand-in you hand in during a test.",
      summaryItems: [
        { title: "Fake a shaky dependency - ", text: "swap a real clock/random/network for one that always answers the same." },
        { title: "Stub - ", text: "a double that returns a value you chose, so you set up the exact case." },
        { title: "Spy - ", text: "a double that remembers it was called, so you can confirm an interaction." },
      ],
      summaryClose: "Next: testable by design - the habits that make code easy to test are the habits behind SOLID.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "td",
    metaLabel: "Prove it works \u00b7 Test doubles",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "test_doubles_awarded",
    awardAmount: 25,
  };
})();
