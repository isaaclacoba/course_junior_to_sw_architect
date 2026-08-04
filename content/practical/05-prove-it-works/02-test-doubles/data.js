// Part five - "Prove it works" (testing), lesson 2: test doubles. Write-from-
// scratch builds. A double is a stand-in for a real dependency so a test is
// fast, repeatable and under your control. The arc: fake a shaky dependency,
// feed canned data, and spy on an interaction. Builds directly on injection
// (Part four). Data only: window.LESSON_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class FakeRandom : IRandom\n{\n    public int Next() { return 4; }   // always the same\n}",
      expected: "PASS",
      requireSource: [
        {
          pattern: /class\s+FixedClock\s*:\s*IClock/,
          message: "Make `FixedClock` keep the promise: `: IClock`."
        },
        {
          pattern: /return\s+9/,
          message: "`Hour()` should always return `9`."
        }
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        IClock clock = new FixedClock();\n        var greeter = new Greeter(clock);\n        Console.WriteLine(clock.Hour() == 9 && greeter.Greet() == "morning" ? "PASS" : "FAIL");\n    }\n}\n',
        expected: "PASS",
        message: "A hidden check calls your FixedClock through IClock: `Hour()` must actually return `9`, not just print PASS.",
      },
      starter: "using System;\n\npublic interface IClock { int Hour(); }\n\npublic class Greeter\n{\n    private readonly IClock _clock;\n    public Greeter(IClock clock) { _clock = clock; }\n    public string Greet() { return _clock.Hour() < 12 ? \"morning\" : \"afternoon\"; }\n}\n\n// TODO: write a FixedClock that keeps the IClock promise and whose Hour()\n//       always returns 9.\n\nclass Program\n{\n    static void Main()\n    {\n        var greeter = new Greeter(new FixedClock());\n        Console.WriteLine(greeter.Greet() == \"morning\" ? \"PASS\" : \"FAIL\");\n    }\n}\n",
      solution: "using System;\n\npublic interface IClock { int Hour(); }\n\npublic class Greeter\n{\n    private readonly IClock _clock;\n    public Greeter(IClock clock) { _clock = clock; }\n    public string Greet() { return _clock.Hour() < 12 ? \"morning\" : \"afternoon\"; }\n}\n\npublic class FixedClock : IClock\n{\n    public int Hour() { return 9; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var greeter = new Greeter(new FixedClock());\n        Console.WriteLine(greeter.Greet() == \"morning\" ? \"PASS\" : \"FAIL\");\n    }\n}\n"
    },
    {
      example: "public class StubFeed : IFeed\n{\n    public int Value() { return 42; }   // the case under test\n}",
      expected: "PASS",
      requireSource: [
        {
          pattern: /class\s+StubFeed\s*:\s*IPriceFeed/,
          message: "Make `StubFeed` keep the promise: `: IPriceFeed`."
        },
        {
          pattern: /return\s+10/,
          message: "`Price()` should return `10`."
        }
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var cart = new Cart(new StubFeed());\n        Console.WriteLine(cart.Total(5) == 50 ? "PASS" : "FAIL");\n    }\n}\n',
        expected: "PASS",
        message: "A hidden check reuses your StubFeed with a different quantity: `Price()` must return `10`, so `Total(5)` is `50`.",
      },
      starter: "using System;\n\npublic interface IPriceFeed { int Price(); }\n\npublic class Cart\n{\n    private readonly IPriceFeed _feed;\n    public Cart(IPriceFeed feed) { _feed = feed; }\n    public int Total(int qty) { return _feed.Price() * qty; }\n}\n\n// TODO: write a StubFeed that keeps the IPriceFeed promise and whose Price()\n//       returns 10.\n\nclass Program\n{\n    static void Main()\n    {\n        var cart = new Cart(new StubFeed());\n        Console.WriteLine(cart.Total(3) == 30 ? \"PASS\" : \"FAIL\");\n    }\n}\n",
      solution: "using System;\n\npublic interface IPriceFeed { int Price(); }\n\npublic class Cart\n{\n    private readonly IPriceFeed _feed;\n    public Cart(IPriceFeed feed) { _feed = feed; }\n    public int Total(int qty) { return _feed.Price() * qty; }\n}\n\npublic class StubFeed : IPriceFeed\n{\n    public int Price() { return 10; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var cart = new Cart(new StubFeed());\n        Console.WriteLine(cart.Total(3) == 30 ? \"PASS\" : \"FAIL\");\n    }\n}\n"
    },
    {
      example: "public class SpyLog : ILog\n{\n    public bool WasCalled = false;\n    public void Write(string message) { WasCalled = true; }\n}",
      expected: "PASS",
      requireSource: [
        {
          pattern: /class\s+SpyMailer\s*:\s*IMailer/,
          message: "Make `SpyMailer` keep the promise: `: IMailer`."
        },
        {
          pattern: /WasCalled\s*=\s*true/,
          message: "`Send()` should set `WasCalled` to `true`."
        }
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var spy = new SpyMailer();\n        bool before = spy.WasCalled;\n        new Signup(spy).Register("grace");\n        Console.WriteLine(!before && spy.WasCalled ? "PASS" : "FAIL");\n    }\n}\n',
        expected: "PASS",
        message: "A hidden check confirms `WasCalled` starts `false` and only `Send()` flips it to `true` - it cannot be hardcoded.",
      },
      starter: "using System;\n\npublic interface IMailer { void Send(string to); }\n\npublic class Signup\n{\n    private readonly IMailer _mailer;\n    public Signup(IMailer mailer) { _mailer = mailer; }\n    public void Register(string user) { _mailer.Send(user); }\n}\n\n// TODO: write a SpyMailer that keeps the IMailer promise, with a public\n//       bool WasCalled that Send() sets to true.\n\nclass Program\n{\n    static void Main()\n    {\n        var spy = new SpyMailer();\n        new Signup(spy).Register(\"ada\");\n        Console.WriteLine(spy.WasCalled ? \"PASS\" : \"FAIL\");\n    }\n}\n",
      solution: "using System;\n\npublic interface IMailer { void Send(string to); }\n\npublic class Signup\n{\n    private readonly IMailer _mailer;\n    public Signup(IMailer mailer) { _mailer = mailer; }\n    public void Register(string user) { _mailer.Send(user); }\n}\n\npublic class SpyMailer : IMailer\n{\n    public bool WasCalled = false;\n    public void Send(string to) { WasCalled = true; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var spy = new SpyMailer();\n        new Signup(spy).Register(\"ada\");\n        Console.WriteLine(spy.WasCalled ? \"PASS\" : \"FAIL\");\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "td",
    metaLabel: "Prove it works · Test doubles",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "test_doubles_awarded",
    awardAmount: 25,
  };
})();
