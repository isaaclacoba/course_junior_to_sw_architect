// Bridge A — "Reading Objects".
//
// Sits between Level 1 micro-coding (type one token) and the SOLID drills
// (reason about a design principle). It builds object-collaboration intuition
// and quietly seeds Single Responsibility and Dependency Inversion WITHOUT
// naming SOLID, so those ideas feel familiar when the learner meets them later.
//
// Uses the shared fill-in-the-blank engine (drill-engine.js).

const drills = [
  {
    title: "Two Objects Talk",
    concept: "Objects collaborate",
    context: "One object asks another for information, then acts on the answer. Complete the call and the object being built.",
    snippet: `public class Clock
{
    public int Hour() => 9;
}

public class Greeter
{
    public string Greet(Clock clock)
    {
        int h = clock.{{1}}();
        return h < 12 ? "Good morning" : "Good afternoon";
    }
}

public static void Main()
{
    var greeter = new Greeter();
    Console.WriteLine(greeter.Greet(new {{2}}()));
}`,
    points: [
      "Greeter does not know the hour itself; it asks a Clock.",
      "Objects get work done by talking to other objects.",
    ],
    blanks: [
      {
        id: 1,
        label: "Ask the clock for the hour",
        answer: "Hour",
        hints: ["The method on Clock that returns the hour."],
        explain: [
          { text: "Clock has one method, Hour, that returns the current hour as a number.", highlight: "public int Hour() => 9" },
          { text: "Greeter calls clock.Hour() to find out the time. It relies on Clock for that fact.", highlight: "int h = clock.{{1}}()" },
        ],
      },
      {
        id: 2,
        label: "Build a clock to pass in",
        answer: "Clock",
        hints: ["Greet needs a Clock argument."],
        explain: [
          { text: "Greet expects a Clock. We build one with new Clock() and hand it over.", highlight: "public string Greet(Clock clock)" },
          { text: "new Clock() creates the object Greeter will talk to.", highlight: "greeter.Greet(new {{2}}())" },
        ],
      },
    ],
  },
  {
    title: "Ask Another Object For Data",
    concept: "Delegation",
    context: "Cart does not store prices. It asks a PriceList. Wire up both calls.",
    snippet: `public class PriceList
{
    public int PriceOf(string item) => item == "book" ? 10 : 5;
}

public class Cart
{
    private readonly PriceList _prices;
    public Cart(PriceList prices) { _prices = prices; }

    public int Total(string item, int qty)
    {
        return _prices.{{1}}(item) * qty;
    }
}

public static void Main()
{
    var cart = new Cart(new PriceList());
    Console.WriteLine(cart.{{2}}("book", 3));
}`,
    points: [
      "Cart delegates the price question to PriceList.",
      "Each object owns one kind of knowledge.",
    ],
    blanks: [
      {
        id: 1,
        label: "Ask the price list",
        answer: "PriceOf",
        hints: ["The method that returns a price for an item."],
        explain: [
          { text: "PriceList knows prices. PriceOf returns the price for a given item.", highlight: "public int PriceOf(string item)" },
          { text: "Cart asks _prices.PriceOf(item) instead of hard-coding prices itself.", highlight: "return _prices.{{1}}(item) * qty" },
        ],
      },
      {
        id: 2,
        label: "Get the cart total",
        answer: "Total",
        hints: ["The method that multiplies price by quantity."],
        explain: [
          { text: "Total combines the looked-up price with the quantity.", highlight: "public int Total(string item, int qty)" },
          { text: "cart.Total(\"book\", 3) returns 10 * 3 = 30.", highlight: "Console.WriteLine(cart.{{2}}(\"book\", 3))" },
        ],
      },
    ],
  },
  {
    title: "A Method That Does One Thing",
    concept: "One job per method",
    context: "A clear method has a single, obvious result. Return the area of the rectangle.",
    snippet: `public class Rectangle
{
    public int Area(int width, int height)
    {
        return {{1}};
    }
}

public static void Main()
{
    var r = new Rectangle();
    Console.WriteLine(r.Area(4, 5));
}`,
    points: [
      "Area does exactly one thing: width times height.",
      "A method with one job is easy to name and trust.",
    ],
    blanks: [
      {
        id: 1,
        label: "Return the area",
        answer: "width * height",
        hints: ["Multiply the two sides."],
        explain: [
          { text: "Area takes the two sides as input and returns their product.", highlight: "public int Area(int width, int height)" },
          { text: "width * height is the one calculation this method exists to do.", highlight: "return {{1}}" },
        ],
      },
    ],
  },
  {
    title: "Spot The Second Job",
    concept: "One reason to change",
    context: "This method does two unrelated jobs at once. Finish the wording job, then read why mixing them is risky.",
    snippet: `public class Checkout
{
    // two jobs in one method: add up the price AND build the receipt text
    public string Pay(int price, int qty)
    {
        int total = price * qty;                // job 1: the maths
        string receipt = "Total: " + {{1}};     // job 2: the wording
        return receipt;
    }
}

public static void Main()
{
    var checkout = new Checkout();
    Console.WriteLine(checkout.Pay(10, 2));
}`,
    points: [
      "Pay both calculates and formats. Two jobs, one method.",
      "Change the wording and you risk breaking the maths beside it.",
      "Two reasons to change living in one place is a warning sign.",
    ],
    blanks: [
      {
        id: 1,
        label: "Finish the receipt text",
        answer: "total",
        hints: ["Put the calculated number into the wording."],
        explain: [
          { text: "total is the result of the maths job on the line above.", highlight: "int total = price * qty" },
          { text: "The wording job glues that number onto some text. The two jobs are tangled in one method.", highlight: "string receipt = \"Total: \" + {{1}}" },
        ],
      },
    ],
  },
  {
    title: "Extract The Job Into A Method",
    concept: "Separate the jobs",
    context: "The wording job has moved into its own method. Call it from Pay.",
    snippet: `public class Checkout
{
    public string Pay(int price, int qty)
    {
        int total = price * qty;
        return {{1}}(total);          // the wording now lives in its own method
    }

    private string FormatReceipt(int total)
    {
        return "Total: " + total;
    }
}

public static void Main()
{
    Console.WriteLine(new Checkout().Pay(10, 2));
}`,
    points: [
      "Pay now does the maths and hands the wording to a helper.",
      "Each method has one clear job again.",
    ],
    blanks: [
      {
        id: 1,
        label: "Call the wording method",
        answer: "FormatReceipt",
        hints: ["The method whose only job is the text."],
        explain: [
          { text: "FormatReceipt is the new home for the wording job.", highlight: "private string FormatReceipt(int total)" },
          { text: "Pay calls FormatReceipt(total) instead of building the text inline.", highlight: "return {{1}}(total)" },
        ],
      },
    ],
  },
  {
    title: "Extract The Job Into A Class",
    concept: "Separate the jobs",
    context: "The wording job is now a class of its own. Build it and call it.",
    snippet: `public class ReceiptFormatter
{
    public string Format(int total) => "Total: " + total;
}

public class Checkout
{
    public string Pay(int price, int qty)
    {
        int total = price * qty;
        var formatter = new {{1}}();
        return formatter.{{2}}(total);
    }
}

public static void Main()
{
    Console.WriteLine(new Checkout().Pay(10, 2));
}`,
    points: [
      "Checkout now owns the maths; ReceiptFormatter owns the wording.",
      "Change the receipt text without ever touching the price logic.",
    ],
    blanks: [
      {
        id: 1,
        label: "Build the formatter",
        answer: "ReceiptFormatter",
        hints: ["The class whose only job is the receipt text."],
        explain: [
          { text: "ReceiptFormatter is a separate class holding only the wording job.", highlight: "public class ReceiptFormatter" },
          { text: "new ReceiptFormatter() builds one for Checkout to use.", highlight: "var formatter = new {{1}}()" },
        ],
      },
      {
        id: 2,
        label: "Call the format method",
        answer: "Format",
        hints: ["The method that returns the text."],
        explain: [
          { text: "Format turns the total into the receipt text.", highlight: "public string Format(int total)" },
          { text: "formatter.Format(total) gives back \"Total: 20\".", highlight: "return formatter.{{2}}(total)" },
        ],
      },
    ],
  },
  {
    title: "Same Name, Two Classes",
    concept: "The object decides",
    context: "Both classes have an Area method. The object you build decides which one runs. Build a Circle.",
    snippet: `public class Square
{
    public int Area() => 9;
}

public class Circle
{
    public int Area() => 12;
}

public static void Main()
{
    // we build a Circle, so its Area runs
    var shape = new {{1}}();
    Console.WriteLine(shape.{{2}}());
}`,
    points: [
      "Square.Area and Circle.Area share a name but differ in result.",
      "Which one runs depends on the object that was built.",
    ],
    blanks: [
      {
        id: 1,
        label: "Build the circle",
        answer: "Circle",
        hints: ["The comment says which shape to build."],
        explain: [
          { text: "Circle has its own Area returning 12.", highlight: "public class Circle" },
          { text: "Because we build a Circle, calling Area runs Circle's version.", highlight: "var shape = new {{1}}()" },
        ],
      },
      {
        id: 2,
        label: "Call area",
        answer: "Area",
        hints: ["The method both classes share."],
        explain: [
          { text: "Both classes define Area, so the call looks the same either way.", highlight: "public int Area() => 12" },
          { text: "shape.Area() prints 12 here, because shape is a Circle.", highlight: "Console.WriteLine(shape.{{2}}())" },
        ],
      },
    ],
  },
  {
    title: "Use What Is Handed In",
    concept: "Receive, don't build",
    context: "Mailer is given its Outbox instead of creating one. Use the handed-in object, and build one to pass in.",
    snippet: `public class Outbox
{
    public string Send(string msg) => "sent: " + msg;
}

public class Mailer
{
    private readonly Outbox _outbox;
    // the outbox is handed in, not created here
    public Mailer(Outbox outbox) { _outbox = outbox; }

    public string Notify(string who)
    {
        return _outbox.{{1}}("hello " + who);
    }
}

public static void Main()
{
    var mailer = new Mailer(new {{2}}());
    Console.WriteLine(mailer.Notify("Sam"));
}`,
    points: [
      "Mailer receives its Outbox through the constructor.",
      "A collaborator handed in from outside is easy to swap later.",
    ],
    blanks: [
      {
        id: 1,
        label: "Send through the outbox",
        answer: "Send",
        hints: ["The method on Outbox that emits a message."],
        explain: [
          { text: "Outbox.Send emits a message and returns a confirmation string.", highlight: "public string Send(string msg) => \"sent: \" + msg" },
          { text: "Mailer uses the outbox it was given, without building its own.", highlight: "return _outbox.{{1}}(\"hello \" + who)" },
        ],
      },
      {
        id: 2,
        label: "Build an outbox to inject",
        answer: "Outbox",
        hints: ["Mailer's constructor needs an Outbox."],
        explain: [
          { text: "The constructor asks for an Outbox from outside.", highlight: "public Mailer(Outbox outbox)" },
          { text: "new Outbox() makes the one we hand in. Handing it in is the key idea.", highlight: "var mailer = new Mailer(new {{2}}())" },
        ],
      },
    ],
  },
  {
    title: "Trace The Output",
    concept: "Read before you run",
    context: "Follow the calls in your head and decide what the counter holds, then call the method that reads it.",
    snippet: `public class Counter
{
    private int _count;
    public void Add() => _count++;
    public int Value() => _count;
}

public static void Main()
{
    var counter = new Counter();
    counter.Add();
    counter.Add();
    counter.Add();
    // three Adds happened - what does Value return?
    Console.WriteLine(counter.{{1}}());
}`,
    points: [
      "_count starts at 0 and Add raises it by one each time.",
      "Reading code line by line tells you the result before running it.",
    ],
    blanks: [
      {
        id: 1,
        label: "Read the count",
        answer: "Value",
        hints: ["The method that returns _count."],
        explain: [
          { text: "Add runs three times, so _count becomes 3.", highlight: "public void Add() => _count++" },
          { text: "Value returns _count. Tracing the three Adds tells you it prints 3.", highlight: "public int Value() => _count" },
        ],
      },
    ],
  },
  {
    title: "Wire Two Objects And Run",
    concept: "Put it together",
    context: "Final drill: a Worker uses a log that is handed to it. Complete both blanks, then press Run.",
    snippet: `public class ConsoleLog
{
    public void Write(string msg) => Console.WriteLine(msg);
}

public class Worker
{
    private readonly ConsoleLog _log;
    public Worker(ConsoleLog log) { _log = log; }

    public void Do()
    {
        _log.{{1}}("work done");
    }
}

public static void Main()
{
    var log = new ConsoleLog();
    var worker = new {{2}}(log);
    worker.Do();
}`,
    points: [
      "Worker is handed a ConsoleLog and uses it to report.",
      "Two small objects collaborating is the shape of most real code.",
    ],
    blanks: [
      {
        id: 1,
        label: "Write to the log",
        answer: "Write",
        hints: ["The method on ConsoleLog that prints."],
        explain: [
          { text: "ConsoleLog.Write prints a message to the screen.", highlight: "public void Write(string msg) => Console.WriteLine(msg)" },
          { text: "Worker calls the log it was handed instead of printing directly.", highlight: "_log.{{1}}(\"work done\")" },
        ],
      },
      {
        id: 2,
        label: "Build the worker",
        answer: "Worker",
        hints: ["The class that takes a log and does the job."],
        explain: [
          { text: "Worker needs a ConsoleLog handed into its constructor.", highlight: "public Worker(ConsoleLog log)" },
          { text: "new Worker(log) wires the two objects together before Do runs.", highlight: "var worker = new {{2}}(log)" },
        ],
      },
    ],
  },
];

// Complete, runnable C# for each drill, index-aligned with `drills`. The Run
// button compiles and runs these through the shared code-lab Roslyn/WASM host.
const runnablePrograms = [
  // 0 - Two Objects Talk
  `using System;

public class Clock
{
    public int Hour() => 9;
}

public class Greeter
{
    public string Greet(Clock clock)
    {
        int h = clock.Hour();
        return h < 12 ? "Good morning" : "Good afternoon";
    }
}

class Program
{
    static void Main()
    {
        var greeter = new Greeter();
        Console.WriteLine(greeter.Greet(new Clock()));
    }
}`,
  // 1 - Ask Another Object For Data
  `using System;

public class PriceList
{
    public int PriceOf(string item) => item == "book" ? 10 : 5;
}

public class Cart
{
    private readonly PriceList _prices;
    public Cart(PriceList prices) { _prices = prices; }

    public int Total(string item, int qty)
    {
        return _prices.PriceOf(item) * qty;
    }
}

class Program
{
    static void Main()
    {
        var cart = new Cart(new PriceList());
        Console.WriteLine(cart.Total("book", 3));
    }
}`,
  // 2 - A Method That Does One Thing
  `using System;

public class Rectangle
{
    public int Area(int width, int height)
    {
        return width * height;
    }
}

class Program
{
    static void Main()
    {
        var r = new Rectangle();
        Console.WriteLine(r.Area(4, 5));
    }
}`,
  // 3 - Spot The Second Job
  `using System;

public class Checkout
{
    public string Pay(int price, int qty)
    {
        int total = price * qty;
        string receipt = "Total: " + total;
        return receipt;
    }
}

class Program
{
    static void Main()
    {
        var checkout = new Checkout();
        Console.WriteLine(checkout.Pay(10, 2));
    }
}`,
  // 4 - Extract The Job Into A Method
  `using System;

public class Checkout
{
    public string Pay(int price, int qty)
    {
        int total = price * qty;
        return FormatReceipt(total);
    }

    private string FormatReceipt(int total)
    {
        return "Total: " + total;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine(new Checkout().Pay(10, 2));
    }
}`,
  // 5 - Extract The Job Into A Class
  `using System;

public class ReceiptFormatter
{
    public string Format(int total) => "Total: " + total;
}

public class Checkout
{
    public string Pay(int price, int qty)
    {
        int total = price * qty;
        var formatter = new ReceiptFormatter();
        return formatter.Format(total);
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine(new Checkout().Pay(10, 2));
    }
}`,
  // 6 - Same Name, Two Classes
  `using System;

public class Square
{
    public int Area() => 9;
}

public class Circle
{
    public int Area() => 12;
}

class Program
{
    static void Main()
    {
        var shape = new Circle();
        Console.WriteLine(shape.Area());
    }
}`,
  // 7 - Use What Is Handed In
  `using System;

public class Outbox
{
    public string Send(string msg) => "sent: " + msg;
}

public class Mailer
{
    private readonly Outbox _outbox;
    public Mailer(Outbox outbox) { _outbox = outbox; }

    public string Notify(string who)
    {
        return _outbox.Send("hello " + who);
    }
}

class Program
{
    static void Main()
    {
        var mailer = new Mailer(new Outbox());
        Console.WriteLine(mailer.Notify("Sam"));
    }
}`,
  // 8 - Trace The Output
  `using System;

public class Counter
{
    private int _count;
    public void Add() => _count++;
    public int Value() => _count;
}

class Program
{
    static void Main()
    {
        var counter = new Counter();
        counter.Add();
        counter.Add();
        counter.Add();
        Console.WriteLine(counter.Value());
    }
}`,
  // 9 - Wire Two Objects And Run
  `using System;

public class ConsoleLog
{
    public void Write(string msg) => Console.WriteLine(msg);
}

public class Worker
{
    private readonly ConsoleLog _log;
    public Worker(ConsoleLog log) { _log = log; }

    public void Do()
    {
        _log.Write("work done");
    }
}

class Program
{
    static void Main()
    {
        var log = new ConsoleLog();
        var worker = new Worker(log);
        worker.Do();
    }
}`,
];

window.DRILL_CONFIG = {
  prefix: "ro",
  metaLabel: "Bridge: Reading Objects",
  progressNoun: "Drill",
  drills,
  runnablePrograms,
  runnerUrl: "level3-app/index.html?runner=1",
  xpKey: "course_global_xp",
  awardedKey: "reading_objects_awarded",
  awardAmount: 20,
};
