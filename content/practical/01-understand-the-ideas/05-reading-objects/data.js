// Reading Objects - Bridge A. Write-and-run practice on how a few objects work
// together: one asks another and acts, one job lives in one place, and a class
// uses what is handed to it. Quietly seeds Single Responsibility and Dependency
// Inversion without naming SOLID, so those ideas feel familiar later.
//
// Part 1, between Writing Methods and the SOLID drills. This file holds only the
// mechanics (example code, expected output, grading probes, starter/solution).
// The teaching prose (titles, concepts, context, goals, recap) lives in
// res/strings/<voice>/en.json and is applied onto window.BUILD_CONFIG by
// resource/bootstrap.js before build-engine.js renders.
(function () {
  "use strict";

  const tasks = [
    {
      example:
        'public class Sensor\n{\n    public int Temp()\n    {\n        return 22;\n    }\n}\n\npublic class Thermostat\n{\n    public string Read(Sensor sensor)\n    {\n        int t = sensor.Temp();\n        if (t > 20)\n        {\n            return "warm";\n        }\n        return "cool";\n    }\n}',
      expected: "Good morning",
      requireSource: [
        { pattern: /clock\s*\.\s*Hour\s*\(\s*\)/, message: "Ask the `clock` for the hour with `clock.Hour()` instead of guessing." },
        { pattern: /\bif\b/, message: "Pick the greeting with an `if` on the hour." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Greeter greeter = new Greeter();\n        Clock clock = new Clock(15);\n        Console.WriteLine(greeter.Greet(clock));\n    }\n}\n',
        expected: "Good afternoon",
        message: "Good morning is right for a 9 o'clock clock only. Decide from the hour the clock reports, not a fixed word.",
      },
      starter:
        'using System;\n\npublic class Clock\n{\n    private int _hour;\n\n    public Clock(int hour)\n    {\n        _hour = hour;\n    }\n\n    public int Hour()\n    {\n        return _hour;\n    }\n}\n\npublic class Greeter\n{\n    public string Greet(Clock clock)\n    {\n        // TODO: ask the clock for the hour; return "Good morning" before 12, otherwise "Good afternoon"\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Greeter greeter = new Greeter();\n        Clock clock = new Clock(9);\n        Console.WriteLine(greeter.Greet(clock));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Clock\n{\n    private int _hour;\n\n    public Clock(int hour)\n    {\n        _hour = hour;\n    }\n\n    public int Hour()\n    {\n        return _hour;\n    }\n}\n\npublic class Greeter\n{\n    public string Greet(Clock clock)\n    {\n        int hour = clock.Hour();\n        if (hour < 12)\n        {\n            return "Good morning";\n        }\n        return "Good afternoon";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Greeter greeter = new Greeter();\n        Clock clock = new Clock(9);\n        Console.WriteLine(greeter.Greet(clock));\n    }\n}\n',
    },
    {
      example:
        'public class Catalog\n{\n    public int Stock(string title)\n    {\n        if (title == "Dune")\n        {\n            return 4;\n        }\n        return 1;\n    }\n}\n\npublic class Library\n{\n    private Catalog _catalog;\n\n    public Library(Catalog catalog)\n    {\n        _catalog = catalog;\n    }\n\n    public int Copies(string title, int branches)\n    {\n        return _catalog.Stock(title) * branches;\n    }\n}',
      expected: "30",
      requireSource: [
        { pattern: /_prices\s*=\s*prices/, message: "Keep the handed-in price list: `_prices = prices;`." },
        { pattern: /_prices\s*\.\s*PriceOf\s*\(/, message: "Ask the price list with `_prices.PriceOf(item)` instead of hardcoding a number." },
        { pattern: /\*\s*qty/, message: "Multiply the price by `qty`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Cart cart = new Cart(new PriceList());\n        Console.WriteLine(cart.Total("pen", 2));\n    }\n}\n',
        expected: "10",
        message: "30 is right for 3 books only. Ask the price list for the real item and multiply by the real quantity.",
      },
      starter:
        'using System;\n\npublic class PriceList\n{\n    public int PriceOf(string item)\n    {\n        if (item == "book")\n        {\n            return 10;\n        }\n        return 5;\n    }\n}\n\npublic class Cart\n{\n    private PriceList _prices;\n\n    public Cart(PriceList prices)\n    {\n        // TODO: keep the price list that was handed in\n    }\n\n    public int Total(string item, int qty)\n    {\n        // TODO: ask the price list for the item\'s price, times qty\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cart cart = new Cart(new PriceList());\n        Console.WriteLine(cart.Total("book", 3));\n    }\n}\n',
      solution:
        'using System;\n\npublic class PriceList\n{\n    public int PriceOf(string item)\n    {\n        if (item == "book")\n        {\n            return 10;\n        }\n        return 5;\n    }\n}\n\npublic class Cart\n{\n    private PriceList _prices;\n\n    public Cart(PriceList prices)\n    {\n        _prices = prices;\n    }\n\n    public int Total(string item, int qty)\n    {\n        return _prices.PriceOf(item) * qty;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Cart cart = new Cart(new PriceList());\n        Console.WriteLine(cart.Total("book", 3));\n    }\n}\n',
    },
    {
      example:
        'public class Box\n{\n    public int Volume(int side)\n    {\n        return side * side * side;\n    }\n}',
      expected: "20",
      requireSource: [
        { pattern: /width\s*\*\s*height/, message: "Return `width * height` - the one job this method has." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Rectangle rectangle = new Rectangle();\n        Console.WriteLine(rectangle.Area(3, 7));\n    }\n}\n',
        expected: "21",
        message: "20 is right for 4 by 5 only. Compute from the two sides you are given.",
      },
      starter:
        'using System;\n\npublic class Rectangle\n{\n    public int Area(int width, int height)\n    {\n        // TODO: return the area - width times height\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Rectangle rectangle = new Rectangle();\n        Console.WriteLine(rectangle.Area(4, 5));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Rectangle\n{\n    public int Area(int width, int height)\n    {\n        return width * height;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Rectangle rectangle = new Rectangle();\n        Console.WriteLine(rectangle.Area(4, 5));\n    }\n}\n',
    },
    {
      example:
        'public class Tag\n{\n    public string Make(int price)\n    {\n        return "Price: " + price;\n    }\n}\n\npublic class Sale\n{\n    public string Line(int price, int qty)\n    {\n        int total = price * qty;\n        Tag tag = new Tag();\n        return tag.Make(total);\n    }\n}',
      expected: "Total: 20",
      requireSource: [
        { pattern: /new\s+ReceiptFormatter\s*\(/, message: "Build the formatter with `new ReceiptFormatter()`." },
        { pattern: /\.\s*Format\s*\(/, message: "Ask the formatter for the text with `formatter.Format(total)` instead of building it inside `Pay`." },
        { pattern: /"Total:\s*"\s*\+/, message: "In `Format`, return `\"Total: \" + total`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Checkout checkout = new Checkout();\n        Console.WriteLine(checkout.Pay(7, 3));\n    }\n}\n',
        expected: "Total: 21",
        message: "Total: 20 is right for 10 by 2 only. The maths must work for any price and quantity.",
      },
      starter:
        'using System;\n\n// ReceiptFormatter should own the wording job - turning a number into text.\npublic class ReceiptFormatter\n{\n    // TODO: add a Format(int total) method that returns "Total: " + total\n}\n\npublic class Checkout\n{\n    public string Pay(int price, int qty)\n    {\n        int total = price * qty;\n        // TODO: build a ReceiptFormatter and ask it to format the total\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Checkout checkout = new Checkout();\n        Console.WriteLine(checkout.Pay(10, 2));\n    }\n}\n',
      solution:
        'using System;\n\npublic class ReceiptFormatter\n{\n    public string Format(int total)\n    {\n        return "Total: " + total;\n    }\n}\n\npublic class Checkout\n{\n    public string Pay(int price, int qty)\n    {\n        int total = price * qty;\n        ReceiptFormatter formatter = new ReceiptFormatter();\n        return formatter.Format(total);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Checkout checkout = new Checkout();\n        Console.WriteLine(checkout.Pay(10, 2));\n    }\n}\n',
    },
    {
      example:
        'public class Ink\n{\n    public string Stamp(string text)\n    {\n        return "[" + text + "]";\n    }\n}\n\npublic class Printer\n{\n    private Ink _ink;\n\n    public Printer(Ink ink)\n    {\n        _ink = ink;\n    }\n\n    public string Print(string text)\n    {\n        return _ink.Stamp(text);\n    }\n}',
      expected: "sent: hello Sam",
      requireSource: [
        { pattern: /_outbox\s*=\s*outbox/, message: "Keep the handed-in outbox: `_outbox = outbox;`. Do not build a new one." },
        { pattern: /_outbox\s*\.\s*Send\s*\(/, message: "Send through the outbox you were given, with `_outbox.Send(...)`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        Outbox outbox = new Outbox();\n        Mailer mailer = new Mailer(outbox);\n        Console.WriteLine(mailer.Notify("Mo"));\n    }\n}\n',
        expected: "sent: hello Mo",
        message: "sent: hello Sam is right for Sam only. Use the name you are handed, sent through the outbox.",
      },
      starter:
        'using System;\n\npublic class Outbox\n{\n    public string Send(string message)\n    {\n        return "sent: " + message;\n    }\n}\n\npublic class Mailer\n{\n    private Outbox _outbox;\n\n    public Mailer(Outbox outbox)\n    {\n        // TODO: keep the outbox that was handed in - do not build a new one\n    }\n\n    public string Notify(string who)\n    {\n        // TODO: send "hello " + who through the outbox\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Outbox outbox = new Outbox();\n        Mailer mailer = new Mailer(outbox);\n        Console.WriteLine(mailer.Notify("Sam"));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Outbox\n{\n    public string Send(string message)\n    {\n        return "sent: " + message;\n    }\n}\n\npublic class Mailer\n{\n    private Outbox _outbox;\n\n    public Mailer(Outbox outbox)\n    {\n        _outbox = outbox;\n    }\n\n    public string Notify(string who)\n    {\n        return _outbox.Send("hello " + who);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Outbox outbox = new Outbox();\n        Mailer mailer = new Mailer(outbox);\n        Console.WriteLine(mailer.Notify("Sam"));\n    }\n}\n',
    },
    {
      example:
        'public class Speaker\n{\n    public void Say(string text)\n    {\n        Console.WriteLine(text);\n    }\n}\n\npublic class Bell\n{\n    private Speaker _speaker;\n\n    public Bell(Speaker speaker)\n    {\n        _speaker = speaker;\n    }\n\n    public void Ring(string note)\n    {\n        _speaker.Say(note);\n    }\n}\n\n// in Main:\nSpeaker speaker = new Speaker();\nBell bell = new Bell(speaker);\nbell.Ring("ding");',
      expected: "work done",
      requireSource: [
        { pattern: /_log\s*=\s*log/, message: "Keep the handed-in log: `_log = log;`." },
        { pattern: /_log\s*\.\s*Write\s*\(/, message: "Report through the log you were given, with `_log.Write(status)`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        ConsoleLog log = new ConsoleLog();\n        Worker worker = new Worker(log);\n        worker.Report("shipped");\n    }\n}\n',
        expected: "shipped",
        message: "work done is right for that one call only. Write whatever status you are given through the log.",
      },
      starter:
        'using System;\n\npublic class ConsoleLog\n{\n    public void Write(string message)\n    {\n        Console.WriteLine(message);\n    }\n}\n\npublic class Worker\n{\n    private ConsoleLog _log;\n\n    public Worker(ConsoleLog log)\n    {\n        // TODO: keep the log that was handed in\n    }\n\n    public void Report(string status)\n    {\n        // TODO: write the status through the log\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        ConsoleLog log = new ConsoleLog();\n        Worker worker = new Worker(log);\n        worker.Report("work done");\n    }\n}\n',
      solution:
        'using System;\n\npublic class ConsoleLog\n{\n    public void Write(string message)\n    {\n        Console.WriteLine(message);\n    }\n}\n\npublic class Worker\n{\n    private ConsoleLog _log;\n\n    public Worker(ConsoleLog log)\n    {\n        _log = log;\n    }\n\n    public void Report(string status)\n    {\n        _log.Write(status);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        ConsoleLog log = new ConsoleLog();\n        Worker worker = new Worker(log);\n        worker.Report("work done");\n    }\n}\n',
    },
    {
      summary: true,
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "ro",
    metaLabel: "Understand the ideas \u00b7 Reading Objects",
    progressNoun: "Step",
    awardedKey: "reading_objects_awarded",
    awardAmount: 20,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    tasks,
  };
})();
