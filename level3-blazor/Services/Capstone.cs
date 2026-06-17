namespace Level3Capstone.Services;

public record Hint(string Text, string? Code = null);

public record Milestone(int Id, string Title, string PassMessage, string TodoMessage, Hint[] Hints);

public static class Capstone
{
    public const string StarterCode = @"using System;

// This works, but TestRunner does three jobs and is welded to the console.
// Refactor it step by step. Watch the milestones fill in as you go.
public class TestRunner
{
    public void Run()
    {
        bool passed = true;
        string report = passed ? ""PASS"" : ""FAIL"";   // formatting lives here
        Console.WriteLine(report);                       // welded to the console
    }
}

public class Program
{
    public static void Main()
    {
        var runner = new TestRunner();
        runner.Run();
    }
}";

    public const string ReferenceSolution = @"using System;

public interface IReporter
{
    void Send(string message);
}

public class ConsoleReporter : IReporter
{
    public void Send(string message) => Console.WriteLine(message);
}

public class SilentReporter : IReporter
{
    public void Send(string message) { }
}

public class ReportFormatter
{
    public string Format(bool passed) => passed ? ""PASS"" : ""FAIL"";
}

public class TestRunner
{
    private IReporter _reporter;
    private ReportFormatter _formatter;

    public TestRunner(IReporter reporter)
    {
        _reporter = reporter;
        _formatter = new ReportFormatter();
    }

    public void Run()
    {
        bool passed = true;
        string result = _formatter.Format(passed);
        _reporter.Send(result);
    }
}

public class Program
{
    public static void Main()
    {
        var runner = new TestRunner(new ConsoleReporter());
        runner.Run();

        var silentRunner = new TestRunner(new SilentReporter());
        silentRunner.Run();
    }
}";

    public static readonly Milestone[] Milestones =
    {
        new(
            1,
            "A formatter class of its own",
            "Nice - the PASS/FAIL words now live in their own class.",
            "Right now Run() is the only place the words PASS/FAIL exist.",
            new[]
            {
                new Hint("Run() is doing two different jobs: checking the result, and deciding the words \"PASS\" or \"FAIL\". Those are two separate reasons to change this one class."),
                new Hint("Create a brand-new class whose only job is turning a true/false result into text. Give it one method that takes a bool and returns a string."),
                new Hint("Here's the shape - you fill the hole:", "public class ReportFormatter\n{\n    public string Format(bool passed) => /* return \"PASS\" or \"FAIL\" */;\n}"),
            }),
        new(
            2,
            "TestRunner stops formatting",
            "TestRunner isn't deciding the words anymore.",
            "TestRunner still writes \"PASS\"/\"FAIL\" itself.",
            new[]
            {
                new Hint("Now that a formatter class exists, TestRunner shouldn't still pick the words itself. It should ask someone else for them."),
                new Hint("Inside Run(), get the text from the formatter instead of writing the ternary. Remove the \"PASS\"/\"FAIL\" strings from TestRunner entirely."),
                new Hint("The line inside Run() becomes something like:", "string result = /* ask the formatter to Format(passed) */;"),
            }),
        new(
            3,
            "A reporter interface",
            "There's a reporter interface to depend on.",
            "TestRunner still talks straight to the console.",
            new[]
            {
                new Hint("Writing straight to the console welds TestRunner to one destination. What if the destination were just a promise: \"something that can send a message\"?"),
                new Hint("Define an interface with a single method that sends a string somewhere. Don't implement it yet - just the promise."),
                new Hint("Here's the shape:", "public interface IReporter\n{\n    void Send(string message);\n}"),
            }),
        new(
            4,
            "The reporter comes from outside",
            "TestRunner now receives its reporter through the constructor.",
            "TestRunner still builds or hard-codes its reporter.",
            new[]
            {
                new Hint("If TestRunner builds its reporter with new, it's stuck with that one choice forever. Someone outside TestRunner should decide which reporter to use."),
                new Hint("Give TestRunner a constructor that accepts an IReporter and stores it in a field. Use that field in Run(). Remove any \"new ...Reporter()\" from inside TestRunner."),
                new Hint("Here's the shape - you fill the holes:", "public class TestRunner\n{\n    private IReporter _reporter;\n\n    public TestRunner(IReporter reporter) => /* store it in the field */;\n\n    // in Run(): use _reporter.Send(...)\n}"),
            }),
        new(
            5,
            "A second reporter, no edits to the first",
            "A second reporter exists behind the same interface.",
            "Only one kind of reporter so far.",
            new[]
            {
                new Hint("This is the payoff: with the interface in place, you can add new behavior without touching old code. Where else could a report go besides the console?"),
                new Hint("Create a second class that implements IReporter - for example one that stays silent. Do not edit the first reporter."),
                new Hint("Here's the shape:", "public class SilentReporter : IReporter\n{\n    public void Send(string message) { /* do nothing */ }\n}"),
            }),
    };
}
