const drills = [
  {
    title: "S — One class doing three jobs (the trap)",
    concept: "Single Responsibility",
    pain: "This LoginTest does three jobs in one method: run the check, decide pass or fail, and build the report text. When someone reworded the report last month, the login check broke too — because both lived in the same place.",
    map: "This is the S in SOLID: Single Responsibility. A class should have one reason to change. This drill shows the tangled version on purpose — the fix comes next.",
    context: "This is the problem version. Run the class whose single method does everything at once.",
    snippet: `public class LoginTest
{
    // one method doing the check AND the formatting
    public string RunAndReport()
    {
        bool passed = true;                         // the check
        string report = passed ? "PASS" : "FAIL";   // the formatting
        return report;
    }
}

public static void Main()
{
    var test = new {{1}}();
    Console.WriteLine(test.{{2}}());
}`,
    points: [
      "Checking and formatting share one method.",
      "Changing the report text risks breaking the check.",
      "One class, two unrelated reasons to change.",
    ],
    mermaid: `flowchart LR
  A[LoginTest] --> B[RunAndReport]
  B --> C[does the check]
  B --> D[builds the report]
  C --> E[tangled together]
  D --> E`,
    blanks: [
      {
        id: 1,
        label: "Create the tangled class",
        answer: "LoginTest",
        hints: ["The class that mixes checking and formatting."],
        explain: [
          { text: "LoginTest is the class that does everything. It has no separation inside it.", highlight: "public class LoginTest" },
          { text: "new builds one. You name the class right after new.", highlight: "var test = new {{1}}()" },
          { text: "RunAndReport is the single method that both checks and formats — that mix is the problem.", highlight: "public string RunAndReport()" },
        ],
      },
      {
        id: 2,
        label: "Call the mixed method",
        answer: "RunAndReport",
        hints: ["The one method that both checks and formats."],
        explain: [
          { text: "Inside RunAndReport, passed is the check and report is the formatting. Two jobs, one method.", highlight: `string report = passed ? "PASS" : "FAIL"` },
          { text: "Calling RunAndReport runs both jobs together. There is no way to change one without touching the other.", highlight: "Console.WriteLine(test.{{2}}())" },
        ],
      },
    ],
  },
  {
    title: "S — The fix: one class, one job",
    concept: "Single Responsibility",
    pain: "This LoginTest class did three jobs at once: run the check, decide pass or fail, and build the report text. Last month someone reworded the report and the login check broke. Two unrelated things shared one class, so touching one bruised the other.",
    map: "Still the S in SOLID, now done right. The check lives in one class and the formatting in another, so each has just one reason to change. Separate jobs, separate classes.",
    context: "The report job has been pulled into its own class. Wire it up.",
    snippet: `public class LoginTest
{
    public bool Run()
    {
        // only the check lives here now
        return true;
    }
}

public class ReportFormatter
{
    public string Format(bool passed)
    {
        return passed ? "PASS" : "FAIL";
    }
}

public static void Main()
{
    var test = new LoginTest();
    bool result = test.Run();

    var formatter = new {{1}}();
    Console.WriteLine(formatter.{{2}}(result));
}`,
    points: [
      "LoginTest now only runs the test.",
      "ReportFormatter only turns a result into text.",
      "Change the wording without ever touching the check.",
    ],
    mermaid: `flowchart LR
  A[LoginTest] -->|runs check| B[true or false]
  B --> C[ReportFormatter]
  C --> D[PASS or FAIL text]`,
    blanks: [
      {
        id: 1,
        label: "Create the report class",
        answer: "ReportFormatter",
        hints: ["Use the class whose only job is formatting."],
        explain: [
          { text: "ReportFormatter is the class above. Its only job is turning a true/false result into readable text.", highlight: "public class ReportFormatter" },
          { text: "new makes a real object from that class. You name which class to build right after new.", highlight: "var formatter = new {{1}}()" },
          { text: "formatter is the variable holding that object. The next line uses it.", highlight: "var formatter = new {{1}}()" },
        ],
      },
      {
        id: 2,
        label: "Call the format method",
        answer: "Format",
        hints: ["Call the method that returns PASS or FAIL."],
        explain: [
          { text: "Format takes the pass/fail bool and returns the text. It lives in ReportFormatter, not in LoginTest.", highlight: "public string Format(bool passed)" },
          { text: "test.Run() produced the result we want to display.", highlight: "bool result = test.Run()" },
          { text: "The dot calls Format on the formatter object, passing in result. Formatting and checking now live apart.", highlight: "Console.WriteLine(formatter.{{2}}(result))" },
        ],
      },
    ],
  },
  {
    title: "O — Editing old code for every new style (the trap)",
    concept: "Open/Closed",
    pain: "Every new report style meant opening ReportFormatter and adding another if branch. The method kept growing, and each edit risked breaking the styles that already worked.",
    map: "This is the O in SOLID: Open/Closed. Code should be open to new behavior but closed to edits. This drill shows the version that must be edited every time — the fix comes next.",
    context: "This is the problem version. Pick a style string to run through the growing if-chain.",
    snippet: `public class ReportFormatter
{
    // every new style forces another edit to this method
    public string Build(string style, bool passed)
    {
        if (style == "plain")
            return passed ? "PASS" : "FAIL";
        if (style == "emoji")
            return passed ? "OK" : "X";
        return "unknown";
    }
}

public static void Main()
{
    var formatter = new {{1}}();
    Console.WriteLine(formatter.Build("{{2}}", true));
}`,
    points: [
      "One method holds every style as an if branch.",
      "A new style means editing code that already worked.",
      "Working styles get touched and can break.",
    ],
    mermaid: `flowchart LR
  A[new style needed] --> B[edit Build]
  B --> C[add another if]
  C --> D[risk breaking old styles]`,
    blanks: [
      {
        id: 1,
        label: "Create the formatter",
        answer: "ReportFormatter",
        hints: ["The class with the growing if-chain."],
        explain: [
          { text: "ReportFormatter holds every report style inside one method.", highlight: "public class ReportFormatter" },
          { text: "new builds one. The class name goes right after new.", highlight: "var formatter = new {{1}}()" },
          { text: "Build decides the style with a chain of if checks. Each new style adds another if here.", highlight: "public string Build(string style, bool passed)" },
        ],
      },
      {
        id: 2,
        label: "Pick a style string",
        answer: "plain",
        accept: ["emoji"],
        hints: ["Use one of the style names in the if-chain."],
        explain: [
          { text: "The style string decides which branch runs. plain and emoji are the two the method knows.", highlight: `if (style == "plain")` },
          { text: "To add a third style, you would edit this method again — that is the Open/Closed problem.", highlight: `if (style == "emoji")` },
          { text: "Build runs the matching branch for the style you pass in.", highlight: `Console.WriteLine(formatter.Build("{{2}}", true))` },
        ],
      },
    ],
  },
  {
    title: "O — The fix: add behavior without editing",
    concept: "Open/Closed",
    pain: "Every time we needed a new report style, we opened ReportFormatter and added another if branch. The class grew, and each edit risked breaking the styles that already worked. Code that already passed kept getting touched.",
    map: "Still the O in SOLID, now done right. Each style is its own class behind a shared IReport. A new style is a new class — old ones are never reopened. Polymorphism makes this work: many classes, one shared method name.",
    context: "Each report style is now its own class behind a shared IReport. Add a new style without editing the others.",
    snippet: `public interface IReport
{
    string Build(bool passed);
}

public class PlainReport : IReport
{
    public string Build(bool passed) => passed ? "PASS" : "FAIL";
}

public class EmojiReport : IReport
{
    public string Build(bool passed) => passed ? "OK" : "X";
}

public static void Main()
{
    IReport report = new {{1}}();
    Console.WriteLine(report.{{2}}(true));
}`,
    points: [
      "IReport is the shared shape every style follows.",
      "A new style is a new class, not an edit.",
      "Old styles are never reopened, so they cannot break.",
    ],
    mermaid: `flowchart LR
  A[IReport] --> B[PlainReport]
  A --> C[EmojiReport]
  A --> D[new style = new class]`,
    blanks: [
      {
        id: 1,
        label: "Pick a report style",
        answer: "EmojiReport",
        accept: ["PlainReport"],
        hints: ["Use one of the classes that implement IReport."],
        explain: [
          { text: "IReport is an interface — a shared shape. Any class that implements it must have a Build method.", highlight: "public interface IReport" },
          { text: "EmojiReport is one class that follows that shape. Adding it never required touching PlainReport.", highlight: "public class EmojiReport : IReport" },
          { text: "new builds one of those classes. Because it follows IReport, it fits in an IReport variable.", highlight: "IReport report = new {{1}}()" },
        ],
      },
      {
        id: 2,
        label: "Call the shared method",
        answer: "Build",
        hints: ["Every IReport has this same method."],
        explain: [
          { text: "Build is the one method named in IReport, so every style has it.", highlight: "string Build(bool passed)" },
          { text: "report.Build(true) calls it. The caller does not care which style it is — that is the point.", highlight: "Console.WriteLine(report.{{2}}(true))" },
        ],
      },
    ],
  },
  {
    title: "L — When a subtype lies (the trap)",
    concept: "Liskov Substitution",
    pain: "We made SkippedTest inherit from Test to reuse its code. But a skipped test has no real result, so its Run() throws. Now any code holding a Test can blow up the moment it happens to be a SkippedTest. The child broke a promise the parent made.",
    map: "This is the L in SOLID: Liskov Substitution. The rule: any subtype must be usable anywhere its parent is, without surprises. When a child cannot honor the parent's promise, inheritance is the wrong tool. This drill shows the broken version on purpose — the fix comes next.",
    context: "This code is the problem, not the solution. Spot what makes it unsafe by completing the call that exposes the lie.",
    snippet: `public class Test
{
    public virtual bool Run() => true;
}

public class SkippedTest : Test
{
    // a skipped test has no result to give
    public override bool Run()
        => throw new InvalidOperationException("skipped");
}

public static void Main()
{
    Test test = new {{1}}();
    // caller assumes any Test can Run safely
    bool result = test.{{2}}();
    Console.WriteLine(result);
}`,
    points: [
      "SkippedTest is a Test on paper but cannot keep its promise.",
      "Run() throws where the parent returned a clean value.",
      "Code trusting the parent type breaks at runtime.",
    ],
    mermaid: `flowchart LR
  A[Test promises Run works] --> B[SkippedTest inherits]
  B --> C[Run throws instead]
  C --> D[caller breaks]`,
    blanks: [
      {
        id: 1,
        label: "Create the unsafe subtype",
        answer: "SkippedTest",
        hints: ["Use the child that overrides Run with a throw."],
        explain: [
          { text: "The word virtual means: this method can be replaced by a child class. It marks Run as open for a child to give its own version.", highlight: "public virtual bool Run() => true" },
          { text: "Test promises that Run returns a bool. Every caller leans on that promise.", highlight: "public virtual bool Run() => true" },
          { text: "The word override means: this child is replacing the parent's virtual method with its own version. Here SkippedTest replaces Run.", highlight: "public override bool Run()" },
          { text: "SkippedTest is declared as a Test but its Run throws instead of returning. That is the broken promise.", highlight: "public class SkippedTest : Test" },
          { text: "Storing it in a Test variable hides the danger — the caller cannot tell it apart from a normal Test.", highlight: "Test test = new {{1}}()" },
        ],
      },
      {
        id: 2,
        label: "Call the inherited method",
        answer: "Run",
        hints: ["The method the parent promised would work."],
        explain: [
          { text: "virtual on the parent means the method is allowed to be replaced. override on the child is where that replacement actually happens.", highlight: "public virtual bool Run() => true" },
          { text: "Run is the method the parent guaranteed. The caller trusts it.", highlight: "public virtual bool Run() => true" },
          { text: "test.Run() looks safe but throws here, because the real object is a SkippedTest. That crash is the Liskov violation.", highlight: "bool result = test.{{2}}()" },
        ],
      },
    ],
  },
  {
    title: "L — The safe fix",
    concept: "Liskov Substitution",
    pain: "SkippedTest could not honor Run(), so inheriting Test was a lie. The fix: stop forcing it to be a Test. A skipped test and a runnable test only share the idea of producing a TestOutcome — so that is all they should share.",
    map: "Still the L in SOLID, now done right. Instead of inheriting to reuse code, both types implement a small shared interface and return a real value for every case. Composition and interfaces replace inheritance when the is-a relationship does not truly hold.",
    context: "Both types now return a TestOutcome safely. Wire up the skipped case so it is fully swappable.",
    snippet: `public enum TestOutcome { Pass, Fail, Skipped }

public interface IRunnable
{
    TestOutcome Run();
}

public class LoginTest : IRunnable
{
    public TestOutcome Run() => TestOutcome.Pass;
}

public class SkippedTest : IRunnable
{
    public TestOutcome Run() => TestOutcome.{{1}};
}

public static void Main()
{
    IRunnable test = new SkippedTest();
    Console.WriteLine(test.{{2}}());
}`,
    points: [
      "No fake is-a relationship anymore.",
      "Every type returns a real TestOutcome — none throw.",
      "Any IRunnable can stand in for another, safely.",
    ],
    mermaid: `flowchart LR
  A[IRunnable] --> B[LoginTest returns Pass]
  A --> C[SkippedTest returns Skipped]
  B --> D[both always safe]
  C --> D`,
    blanks: [
      {
        id: 1,
        label: "Return the right outcome",
        answer: "Skipped",
        hints: ["Use the enum value that means not run."],
        explain: [
          { text: "TestOutcome lists every honest result a test can have, including Skipped.", highlight: "public enum TestOutcome { Pass, Fail, Skipped }" },
          { text: "SkippedTest now returns a real value instead of throwing. It keeps the promise IRunnable makes.", highlight: "public TestOutcome Run() => TestOutcome.{{1}}" },
          { text: "Because it returns cleanly, it is safe to use anywhere an IRunnable is expected.", highlight: "IRunnable test = new SkippedTest()" },
        ],
      },
      {
        id: 2,
        label: "Call through the interface",
        answer: "Run",
        hints: ["The single method IRunnable defines."],
        explain: [
          { text: "Run is the one method IRunnable defines, so every implementation has it.", highlight: "TestOutcome Run()" },
          { text: "test.Run() returns Skipped with no crash. Substitution is now safe — that is Liskov satisfied.", highlight: "Console.WriteLine(test.{{2}}())" },
        ],
      },
    ],
  },
  {
    title: "I — One fat interface forcing empty methods (the trap)",
    concept: "Interface Segregation",
    pain: "We had one big ITestPlugin interface with Run, Report, and Retry. A plugin that only formats reports was still forced to implement Run and Retry — with empty fake bodies that throw. Those fakes are noise, and other code could call them by mistake.",
    map: "This is the I in SOLID: Interface Segregation. A class should only depend on methods it actually uses. This drill shows the fat interface forcing fake methods — the fix comes next.",
    context: "This is the problem version. The report plugin is forced to fill in methods it does not need. Complete the one method it actually uses.",
    snippet: `public interface ITestPlugin
{
    bool Run();
    string Report();
    void Retry();
}

// only formats reports, but the fat interface forces all three
public class ReportPlugin : ITestPlugin
{
    public bool Run() => throw new NotImplementedException();
    public string {{1}}() => "report ready";
    public void Retry() => throw new NotImplementedException();
}

public static void Main()
{
    ITestPlugin plugin = new ReportPlugin();
    Console.WriteLine(plugin.{{2}}());
}`,
    points: [
      "ITestPlugin demands Run, Report, and Retry.",
      "ReportPlugin only needs Report.",
      "Run and Retry become empty fakes that throw.",
    ],
    mermaid: `flowchart LR
  A[ITestPlugin] --> B[Run]
  A --> C[Report]
  A --> D[Retry]
  B --> E[empty fake]
  D --> E
  C --> F[the only real one]`,
    blanks: [
      {
        id: 1,
        label: "Implement the real method",
        answer: "Report",
        hints: ["The only method this plugin actually needs."],
        explain: [
          { text: "ITestPlugin lists three methods, so any class that implements it must provide all three.", highlight: "public interface ITestPlugin" },
          { text: "Report is the only one this plugin truly does. It returns the report text.", highlight: `public string {{1}}() => "report ready"` },
          { text: "Run and Retry are forced on the class. They just throw — empty fakes that exist only to satisfy the interface.", highlight: "public bool Run() => throw new NotImplementedException()" },
        ],
      },
      {
        id: 2,
        label: "Call the real method",
        answer: "Report",
        hints: ["The method that returns the report text."],
        explain: [
          { text: "plugin is typed as ITestPlugin, so it exposes all three methods — even the fake ones.", highlight: "ITestPlugin plugin = new ReportPlugin()" },
          { text: "Calling Report works. But nothing stops other code from calling Run or Retry and hitting the throw — that is the danger.", highlight: "Console.WriteLine(plugin.{{2}}())" },
        ],
      },
    ],
  },
  {
    title: "I — The fix: small, focused interfaces",
    concept: "Interface Segregation",
    pain: "We had one big ITestPlugin interface with Run, Report, and Retry. A plugin that only formats reports was still forced to implement Run and Retry with empty fake bodies. Those empty methods were noise, and other code could call them by mistake.",
    map: "Still the I in SOLID, now done right. The fat interface is split into IRunnable and IReportable, so a class implements only what it actually does. Small interfaces also make the next letter, D, much easier.",
    context: "The fat interface is split. The formatter now implements only the small interface it needs.",
    snippet: `public interface IRunnable
{
    bool Run();
}

public interface IReportable
{
    string Report();
}

// formatter only reports; it never runs anything
public class ReportPlugin : {{1}}
{
    public string {{2}}() => "report ready";
}

public static void Main()
{
    IReportable plugin = new ReportPlugin();
    Console.WriteLine(plugin.Report());
}`,
    points: [
      "IRunnable and IReportable are separate, focused shapes.",
      "ReportPlugin implements only what it truly does.",
      "No empty fake methods left lying around.",
    ],
    mermaid: `flowchart LR
  A[fat interface] --> B[split]
  B --> C[IRunnable]
  B --> D[IReportable]
  D --> E[ReportPlugin uses only this]`,
    blanks: [
      {
        id: 1,
        label: "Implement the needed interface",
        answer: "IReportable",
        hints: ["Pick the small interface a formatter actually needs."],
        explain: [
          { text: "IReportable is the small interface with just one method, Report.", highlight: "public interface IReportable" },
          { text: "ReportPlugin only formats reports, so it implements IReportable and nothing else. It is not forced to fake a Run method.", highlight: "public class ReportPlugin : {{1}}" },
          { text: "Because it depends on only what it uses, the class stays small and honest.", highlight: "IReportable plugin = new ReportPlugin()" },
        ],
      },
      {
        id: 2,
        label: "Implement the one method",
        answer: "Report",
        hints: ["The single method IReportable defines."],
        explain: [
          { text: "Report is the only method IReportable requires.", highlight: "string Report()" },
          { text: "ReportPlugin implements exactly that one method — no empty extras.", highlight: "public string {{2}}() => \"report ready\"" },
        ],
      },
    ],
  },
  {
    title: "D — When code is glued together (the trap)",
    concept: "Dependency Inversion",
    pain: "TestRunner builds its own ConsoleReporter inside itself with new. So the runner is welded to the console. We cannot point it at a file, and worse, in a unit test we cannot check what it reported without it printing to a real console.",
    map: "This is the D in SOLID: Dependency Inversion. High-level code should depend on an interface, not reach out and build a concrete class itself. This drill shows the welded version on purpose — the next drill cuts the weld and unlocks testing.",
    context: "This is the problem version. Complete the hard-wired construction that ties the runner to the console.",
    snippet: `public class ConsoleReporter
{
    public void Send(string msg) => Console.WriteLine(msg);
}

public class TestRunner
{
    // runner builds its own reporter - welded together
    private ConsoleReporter _reporter = new {{1}}();

    public void Run()
    {
        _reporter.{{2}}("test passed");
    }
}

public static void Main()
{
    new TestRunner().Run();
}`,
    points: [
      "TestRunner picks the concrete reporter itself.",
      "You cannot swap the console for a file or a fake.",
      "That makes the runner hard to test in isolation.",
    ],
    mermaid: `flowchart LR
  A[TestRunner] -->|new| B[ConsoleReporter]
  B --> C[locked to console]
  C --> D[cannot test or swap]`,
    blanks: [
      {
        id: 1,
        label: "Hard-wire the reporter",
        answer: "ConsoleReporter",
        hints: ["The concrete class the runner builds itself."],
        explain: [
          { text: "ConsoleReporter is a concrete class that writes to the console.", highlight: "public class ConsoleReporter" },
          { text: "The runner creates it with new, inside itself. That line is the weld — the runner now depends on this exact class.", highlight: "private ConsoleReporter _reporter = new {{1}}()" },
          { text: "Because the choice is baked in, there is no way to pass in something else.", highlight: "public class TestRunner" },
        ],
      },
      {
        id: 2,
        label: "Call the reporter",
        answer: "Send",
        hints: ["The method that emits a message."],
        explain: [
          { text: "Send is how the reporter emits a message.", highlight: "public void Send(string msg) => Console.WriteLine(msg)" },
          { text: "The runner calls _reporter.Send directly. Fine on its own, but with the weld above, this always hits the real console.", highlight: "_reporter.{{2}}(\"test passed\")" },
        ],
      },
    ],
  },
  {
    title: "D — Inject it, and unlock testing",
    concept: "Dependency Inversion",
    pain: "The welded runner could not be tested without printing for real. The fix: the runner asks for an IReporter from outside instead of building one. Now in a test we hand it a fake reporter that just records the message — no console needed.",
    map: "Still the D in SOLID, done right. Depending on an interface and receiving it from outside is called dependency injection. Its biggest payoff is testing: you can pass a fake (a mock) in place of the real thing. This is why DI matters, and it sets up why automated testing becomes possible.",
    context: "The runner now receives its reporter. Inject one and call it through the interface.",
    snippet: `public interface IReporter
{
    void Send(string msg);
}

public class FakeReporter : IReporter
{
    public string Last = "";
    public void Send(string msg) => Last = msg;
}

public class TestRunner
{
    private readonly IReporter _reporter;
    public TestRunner(IReporter reporter) => _reporter = reporter;

    public void Run() => _reporter.Send("test passed");
}

public static void Main()
{
    var fake = new {{1}}();
    var runner = new TestRunner({{2}});
    runner.Run();
    Console.WriteLine(fake.Last);
}`,
    points: [
      "TestRunner depends on IReporter, not a concrete class.",
      "The reporter is passed in, so a test can supply a fake.",
      "FakeReporter records the message instead of printing it.",
    ],
    mermaid: `flowchart LR
  A[Test] -->|injects| B[FakeReporter]
  B --> C[TestRunner]
  C --> D[records message]
  D --> E[checkable, no console]`,
    blanks: [
      {
        id: 1,
        label: "Create the fake reporter",
        answer: "FakeReporter",
        hints: ["The stand-in that records instead of printing."],
        explain: [
          { text: "FakeReporter implements IReporter but just stores the message in Last instead of printing.", highlight: "public class FakeReporter : IReporter" },
          { text: "Building one gives the test a reporter it can inspect afterwards.", highlight: "var fake = new {{1}}()" },
          { text: "This is the mock idea: a cheap stand-in used in place of the real dependency.", highlight: "public void Send(string msg) => Last = msg" },
        ],
      },
      {
        id: 2,
        label: "Inject it into the runner",
        answer: "fake",
        hints: ["Pass the fake into the constructor."],
        explain: [
          { text: "TestRunner takes an IReporter through its constructor instead of building one.", highlight: "public TestRunner(IReporter reporter) => _reporter = reporter" },
          { text: "The => here is not a lambda. It is shorthand for a one-line body: this constructor simply runs _reporter = reporter. The same thing could be written with braces { _reporter = reporter; }.", highlight: "public TestRunner(IReporter reporter) => _reporter = reporter" },
          { text: "Passing fake here is dependency injection. The runner uses it without knowing it is a fake.", highlight: "var runner = new TestRunner({{2}})" },
          { text: "After Run, fake.Last holds the message — so a test can assert on it, with no real console. That is why DI enables testing.", highlight: "Console.WriteLine(fake.Last)" },
        ],
      },
    ],
  },
  {
    title: "What you learned",
    concept: "SOLID recap",
    summary: true,
    context: "Five habits, each one a small fix to a real problem you just saw break.",
    summaryIntro:
      "SOLID is five habits for writing classes that are easy to change without breaking other code. You met each one as a problem first, then its fix:",
    summaryItems: [
      { title: "S — Single Responsibility", text: "One class, one job. When checking and formatting shared a method, changing one broke the other. Split jobs into separate classes." },
      { title: "O — Open/Closed", text: "Add new behavior without editing old code. Instead of growing an if-chain, add a new class behind a shared interface. Old code stays untouched." },
      { title: "L — Liskov Substitution", text: "A subtype must work anywhere its parent does. SkippedTest inheriting Test broke that promise by throwing. Use a small shared interface that every type can honor." },
      { title: "I — Interface Segregation", text: "Don't force a class to implement methods it never uses. Split one fat interface into small focused ones, so each class implements only what it does." },
      { title: "D — Dependency Inversion", text: "Depend on an interface and receive it from outside, instead of building a concrete class inside. This is dependency injection, and it lets you pass a fake in tests." },
    ],
    summaryClose:
      "The thread that ties them together: polymorphism, composition, and encapsulation are the tools, and SOLID is how you aim them. The D fix — injecting a fake reporter — is also why automated testing becomes possible, which is where the next level begins.",
    points: [],
    blanks: [],
  },
];

const state = drills.map((d) => d.blanks.map(() => ({ value: "", hint: -1 })));
let i = 0;

const l2Meta = document.getElementById("l2Meta");
const l2Title = document.getElementById("l2Title");
const l2Context = document.getElementById("l2Context");
const l2Pain = document.getElementById("l2Pain");
const l2Map = document.getElementById("l2Map");
const l2Concept = document.getElementById("l2Concept");
const l2Progress = document.getElementById("l2Progress");
const l2Code = document.getElementById("l2Code");
const l2Points = document.getElementById("l2Points");
const l2Diagram = document.getElementById("l2Diagram");
const l2Inputs = document.getElementById("l2Inputs");
const l2Result = document.getElementById("l2Result");
const l2ResultTitle = document.getElementById("l2ResultTitle");
const l2ResultBody = document.getElementById("l2ResultBody");
const l2ResultList = document.getElementById("l2ResultList");
const l2Run = document.getElementById("l2Run");
const l2Output = document.getElementById("l2Output");
const courseXpLabel = document.getElementById("courseXpLabel");
const l2CodeWrap = l2Code.closest(".code-wrap");

// The C# runner comes from the shared code-lab package (vendored IIFE bundle on
// window.CodeLab). It relays code to the Roslyn/WASM compiler host over a
// same-origin hidden iframe, the same engine Level 4 and the capstone use.
const runner = new CodeLab.RoslynIframeRunner({ url: "level3-app/index.html?runner=1" });

const l2Summary = document.getElementById("l2Summary");
const l2SummaryIntro = document.getElementById("l2SummaryIntro");
const l2SummaryList = document.getElementById("l2SummaryList");
const l2SummaryClose = document.getElementById("l2SummaryClose");
const l2PainBox = l2Pain.closest(".pain-box");
const l2MapBox = l2Map.closest(".map-box");
const l2Coach = l2Points.closest(".coach");
const l2FillSection = l2Inputs.closest(".fill-section");
const l2Actions = document.querySelector(".actions");

const l2Prev = document.getElementById("l2Prev");
const l2Next = document.getElementById("l2Next");
const l2Hint = document.getElementById("l2Hint");
const l2Check = document.getElementById("l2Check");
const l2Answers = document.getElementById("l2Answers");
const l2Reset = document.getElementById("l2Reset");

const COURSE_XP_KEY = "course_global_xp";
const LEVEL2_AWARDED_KEY = "level2_awarded";
const level2Awarded = JSON.parse(localStorage.getItem(LEVEL2_AWARDED_KEY) || "{}");

function loadCourseXP() {
  return parseInt(localStorage.getItem(COURSE_XP_KEY) || "0", 10);
}

function addCourseXP(amount) {
  const next = loadCourseXP() + amount;
  localStorage.setItem(COURSE_XP_KEY, String(next));
  renderCourseXP();
}

function renderCourseXP() {
  if (courseXpLabel) {
    courseXpLabel.textContent = `Course XP: ${loadCourseXP()}`;
  }
}

function markLevel2Awarded(drillIndex) {
  level2Awarded[drillIndex] = true;
  localStorage.setItem(LEVEL2_AWARDED_KEY, JSON.stringify(level2Awarded));
}

if (window.mermaid) {
  window.mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
}

function normalize(s) {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

function withSlots(snippet) {
  return snippet.replace(/\{\{(\d+)\}\}/g, (_, n) => `__${n}__`);
}

// Build a complete, runnable program from a drill: fill every {{n}} slot with
// its correct answer, then wrap the fragment in a class so the loose Main and
// any helper types become valid C#. This is what the Run button compiles.
function toRunnable(drill) {
  const filled = drill.snippet.replace(/\{\{(\d+)\}\}/g, (_, n) => {
    const blank = drill.blanks.find((b) => String(b.id) === n);
    return blank ? blank.answer : "";
  });
  return `using System;\n\nclass __Lab\n{\n${filled}\n}`;
}

let currentHighlightEl = null;

function clearCodeHighlight() {
  if (currentHighlightEl) {
    currentHighlightEl.remove();
    currentHighlightEl = null;
  }
}

function applyCodeHighlight(snippet, highlightStr) {
  clearCodeHighlight();
  if (!highlightStr || !l2CodeWrap) return;
  const pre = l2CodeWrap.querySelector("pre");
  if (!pre) return;

  const clean = highlightStr.replace(/\{\{\d+\}\}/g, "").trim();
  if (!clean) return;
  const lines = snippet.split("\n");
  const lineIndex = lines.findIndex((l) =>
    l.replace(/\{\{\d+\}\}/g, "").includes(clean)
  );
  if (lineIndex < 0) return;

  const lineSpans = pre.querySelectorAll(".line-numbers-rows > span");
  if (!lineSpans[lineIndex]) return;

  const span = lineSpans[lineIndex];
  const preRect = pre.getBoundingClientRect();
  const spanRect = span.getBoundingClientRect();
  const top = spanRect.top - preRect.top + pre.scrollTop;
  const height = Math.max(spanRect.height, 20);

  const hl = document.createElement("div");
  hl.className = "code-line-hl";
  hl.style.top = `${top}px`;
  hl.style.height = `${height}px`;
  pre.style.position = "relative";
  pre.appendChild(hl);
  currentHighlightEl = hl;

  hl.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

let explainOverlay;
let explainCard;
let explainTitle;
let explainBody;

function ensureExplainOverlay() {
  if (explainOverlay) return;

  explainOverlay = document.createElement("div");
  explainOverlay.className = "explain-overlay";
  explainOverlay.hidden = true;

  explainCard = document.createElement("div");
  explainCard.className = "explain-card";
  explainCard.hidden = true;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "btn explain-close";
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", closeExplainOverlay);

  explainTitle = document.createElement("h4");
  explainTitle.className = "explain-title";

  explainBody = document.createElement("div");
  explainBody.className = "explain-text";

  explainCard.append(explainTitle, explainBody, closeBtn);
  document.body.appendChild(explainOverlay);
  document.body.appendChild(explainCard);

  explainOverlay.addEventListener("click", (event) => {
    if (event.target === explainOverlay) closeExplainOverlay();
  });
}

function closeExplainOverlay() {
  if (!explainOverlay) return;
  explainOverlay.hidden = true;
  if (explainCard) explainCard.hidden = true;
  explainOverlay.style.clipPath = "";
  clearCodeHighlight();
  if (l2CodeWrap) l2CodeWrap.classList.remove("code-spotlight");
}

function updateOverlayClipPath() {
  if (!l2CodeWrap || !explainOverlay) return;
  const r = l2CodeWrap.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const d = `M0 0 H${vw} V${vh} H0 Z M${r.left} ${r.top} H${r.right} V${r.bottom} H${r.left} Z`;
  explainOverlay.style.clipPath = `path(evenodd, '${d}')`;
}

function positionExplainCard() {
  if (!explainCard) return;
  const cardWidth = Math.min(560, window.innerWidth - 32);
  const left = Math.max(16, Math.floor((window.innerWidth - cardWidth) / 2));
  explainCard.style.left = `${left}px`;
  explainCard.style.top = "";
  explainCard.style.bottom = "16px";
  explainCard.style.maxHeight = `${Math.floor(window.innerHeight * 0.38)}px`;
  explainCard.style.overflowY = "auto";
}

function showExplainOverlay(steps, snippet) {
  ensureExplainOverlay();
  explainTitle.textContent = "What this part of the code does";
  explainBody.innerHTML = "";

  const ol = document.createElement("ol");
  ol.className = "explain-steps";

  steps.forEach((step) => {
    const li = document.createElement("li");
    li.className = "explain-step";
    li.textContent = step.text;
    li.addEventListener("mouseenter", () => {
      ol.querySelectorAll(".explain-step").forEach((el) => el.classList.remove("active"));
      li.classList.add("active");
      applyCodeHighlight(snippet, step.highlight);
    });
    ol.appendChild(li);
  });

  explainBody.appendChild(ol);

  if (steps.length > 0) {
    ol.firstChild.classList.add("active");
    applyCodeHighlight(snippet, steps[0].highlight);
  }

  explainOverlay.hidden = false;
  if (explainCard) explainCard.hidden = false;
  if (l2CodeWrap) {
    l2CodeWrap.scrollIntoView({ behavior: "instant", block: "start" });
    l2CodeWrap.classList.add("code-spotlight");
  }
  requestAnimationFrame(() => {
    updateOverlayClipPath();
    positionExplainCard();
  });
}

window.addEventListener("resize", () => {
  if (explainOverlay && !explainOverlay.hidden) {
    updateOverlayClipPath();
    positionExplainCard();
  }
});

async function renderDiagram(drill) {
  l2Diagram.innerHTML = "";
  if (window.mermaid && drill.mermaid) {
    try {
      const { svg } = await window.mermaid.render(`l2-${i}-${Date.now()}`, drill.mermaid);
      l2Diagram.innerHTML = `<div class="mermaid">${svg}</div>`;
      return;
    } catch (_err) {
      // fallback below
    }
  }
  const p = document.createElement("p");
  p.className = "context";
  p.textContent = "Diagram fallback shown because Mermaid did not render.";
  l2Diagram.appendChild(p);
}

function setPracticeVisible(visible) {
  const runRow = l2Run.closest(".code-actions");
  const sections = [l2PainBox, l2MapBox, l2CodeWrap, runRow, l2Coach, l2FillSection, l2Actions];
  sections.forEach((el) => {
    if (el) el.hidden = !visible;
  });
  if (!visible) l2Output.hidden = true;
  if (l2Summary) l2Summary.hidden = visible;
}

function renderSummary(d) {
  setPracticeVisible(false);
  l2Result.hidden = true;

  l2SummaryIntro.textContent = d.summaryIntro || "";
  l2SummaryList.innerHTML = "";
  (d.summaryItems || []).forEach((item) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = item.title;
    li.appendChild(strong);
    li.appendChild(document.createTextNode(item.text));
    l2SummaryList.appendChild(li);
  });
  l2SummaryClose.textContent = d.summaryClose || "";

  l2Prev.disabled = i === 0;
  l2Next.disabled = i === drills.length - 1;
}

function render() {
  const d = drills[i];
  const s = state[i];

  closeExplainOverlay();

  renderCourseXP();

  l2Meta.textContent = "SOLID, one step at a time";
  l2Title.textContent = d.title;
  l2Context.textContent = d.context;
  l2Concept.textContent = d.concept;
  l2Progress.textContent = d.summary ? "Recap" : `Drill ${i + 1} / ${drills.length - 1}`;

  if (d.summary) {
    renderSummary(d);
    return;
  }

  setPracticeVisible(true);

  l2Pain.textContent = d.pain || "";
  l2Map.textContent = d.map || "";

  l2Code.textContent = withSlots(d.snippet);
  Prism.highlightElement(l2Code);

  l2Run.hidden = false;
  l2Run.disabled = false;
  l2Run.textContent = "Run this example";
  l2Output.hidden = true;
  l2Output.textContent = "";
  l2Output.classList.remove("is-error");
  l2Points.innerHTML = "";
  d.points.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    l2Points.appendChild(li);
  });

  void renderDiagram(d);

  l2Inputs.innerHTML = "";
  d.blanks.forEach((b, idx) => {
    const row = document.createElement("div");
    row.className = "input-row";

    const label = document.createElement("label");
    label.setAttribute("for", `l2-${idx}`);
    label.textContent = `Blank ${b.id}: ${b.label}`;

    const input = document.createElement("input");
    input.id = `l2-${idx}`;
    input.value = s[idx].value;
    input.placeholder = "Write short C# code";
    input.addEventListener("input", (e) => {
      s[idx].value = e.target.value;
      input.classList.remove("correct", "wrong", "almost");
    });

    const hint = document.createElement("div");
    hint.className = "hint";
    if (s[idx].hint >= 0) {
      hint.textContent = `Hint: ${b.hints[Math.min(s[idx].hint, b.hints.length - 1)]}`;
    }

    const explainBtn = document.createElement("button");
    explainBtn.type = "button";
    explainBtn.className = "btn explain-btn";
    explainBtn.textContent = "Explain this part";
    explainBtn.addEventListener("click", () => {
      showExplainOverlay(Array.isArray(b.explain) ? b.explain : [], d.snippet);
    });

    row.append(label, input, hint, explainBtn);
    l2Inputs.appendChild(row);
  });

  l2Result.hidden = true;
  l2Prev.disabled = i === 0;
  l2Next.disabled = i === drills.length - 1;
}

function showHint() {
  const d = drills[i];
  const s = state[i];
  d.blanks.forEach((b, idx) => {
    if (s[idx].hint < b.hints.length - 1) s[idx].hint += 1;
  });
  render();
}

function check() {
  const d = drills[i];
  const s = state[i];
  const rows = [...l2Inputs.querySelectorAll(".input-row")];

  let ok = 0;
  const details = [];

  d.blanks.forEach((b, idx) => {
    const input = rows[idx].querySelector("input");
    const accepted = [b.answer, ...(b.accept || [])].map(normalize);
    const expected = accepted[0];
    const actual = normalize(s[idx].value);

    input.classList.remove("correct", "wrong", "almost");

    if (accepted.includes(actual)) {
      ok += 1;
      input.classList.add("correct");
      details.push(`Blank ${b.id}: correct`);
    } else if (accepted.some((a) => a.includes(actual) || actual.includes(a))) {
      input.classList.add("almost");
      details.push(`Blank ${b.id}: close, check exact syntax`);
    } else {
      input.classList.add("wrong");
      details.push(`Blank ${b.id}: expected ${b.answer}`);
    }
  });

  l2ResultTitle.textContent = `${ok} / ${d.blanks.length} correct`;
  l2ResultBody.textContent =
    ok === d.blanks.length
      ? "Great. You refreshed this core concept with valid C# fragments."
      : "Not yet. Use hints and retry.";

  if (ok === d.blanks.length && !level2Awarded[i]) {
    addCourseXP(25);
    markLevel2Awarded(i);
  }

  l2ResultList.innerHTML = "";
  details.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    l2ResultList.appendChild(li);
  });

  l2Result.hidden = false;
}

function resetDrill() {
  state[i] = drills[i].blanks.map(() => ({ value: "", hint: -1 }));
  render();
}

function showAnswers() {
  const d = drills[i];
  state[i] = d.blanks.map((b) => ({ value: b.answer, hint: -1 }));
  render();
}

l2Prev.addEventListener("click", () => {
  i -= 1;
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
});

l2Next.addEventListener("click", () => {
  i += 1;
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
});

l2Hint.addEventListener("click", showHint);
l2Check.addEventListener("click", check);
l2Answers.addEventListener("click", showAnswers);
l2Reset.addEventListener("click", resetDrill);

function showOutput(text, isError) {
  l2Output.hidden = false;
  l2Output.textContent = text;
  l2Output.classList.toggle("is-error", Boolean(isError));
}

l2Run.addEventListener("click", async () => {
  const d = drills[i];
  if (d.summary) return;

  l2Run.disabled = true;
  l2Run.textContent = "Running...";
  showOutput("Compiling and running...", false);

  try {
    const result = await runner.run(toRunnable(d));
    if (result.errors && result.errors.length) {
      showOutput(result.errors.map((e) => e.friendly || e.raw).join("\n"), true);
    } else if (result.runtimeError) {
      showOutput(`${result.output}\n${result.runtimeError}`.trim(), true);
    } else {
      showOutput(result.output || "(no output)", false);
    }
  } catch (err) {
    showOutput(err.message || "Could not run the example.", true);
  } finally {
    l2Run.disabled = false;
    l2Run.textContent = "Run this example";
  }
});

render();
