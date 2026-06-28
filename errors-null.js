// Part three - "Errors and null". Runnable fill-in-the-blank drills (same engine
// and style as Collections), animal-themed. Covers the everyday way C# handles
// things going wrong and missing values: try/catch, the exception message,
// finally, throw, null, the null-coalescing ?? and the null-conditional ?.
// Every drill is a complete program that runs to completion (exceptions are
// caught, never left to crash), so the learner can press Run and see it work.
// Data only: drill-engine.js reads window.DRILL_CONFIG.

const drills = [
  {
    title: "Catch a problem",
    concept: "try / catch",
    context:
      "Some operations can fail - dividing by zero, reading past the end of a list. When one does, C# throws an exception that stops the normal flow. Put the risky code in a `try` block and handle the failure in a `catch` block, so the program keeps running instead of crashing.",
    snippet: `{{1}}
{
    int treats = 10, dogs = 0;
    Console.WriteLine(treats / dogs);
}
{{2}} (DivideByZeroException)
{
    Console.WriteLine("cannot split treats among zero dogs");
}`,
    points: [
      "`try` wraps the code that might fail.",
      "`catch` runs only if a matching exception was thrown, instead of crashing.",
    ],
    blanks: [
      {
        id: 1,
        label: "Keyword that wraps the risky code",
        answer: "try",
        hints: ["Three letters - it goes before the block that might fail."],
        explain: [
          { text: "`try` marks the block that might throw an exception.", highlight: "{{1}}" },
        ],
      },
      {
        id: 2,
        label: "Keyword that handles the failure",
        answer: "catch",
        hints: ["It catches the thrown exception."],
        explain: [
          { text: "`catch (DivideByZeroException)` runs when that exception is thrown, so the program does not crash.", highlight: "{{2}} (DivideByZeroException)" },
        ],
      },
    ],
  },
  {
    title: "What went wrong",
    concept: "The message",
    context:
      "An exception is an object that carries details about the failure, including a `Message`. Catch it into a variable - `catch (Exception e)` - and read `e.Message` to find out what happened.",
    snippet: `try
{
    int[] paws = new int[4];
    Console.WriteLine(paws[10]);
}
catch (Exception {{1}})
{
    Console.WriteLine("problem: " + {{2}}.Message);
}`,
    points: [
      "`catch (Exception e)` puts the exception object in `e`.",
      "`e.Message` is a human-readable description of what failed.",
    ],
    blanks: [
      {
        id: 1,
        label: "Name for the caught exception object",
        answer: "e",
        accept: ["ex", "error"],
        hints: ["A short variable name; the next line reads its Message."],
        explain: [
          { text: "The caught exception is stored in `e` so you can inspect it.", highlight: "catch (Exception {{1}})" },
        ],
      },
      {
        id: 2,
        label: "Read the message off that object",
        answer: "e",
        accept: ["ex", "error"],
        hints: ["The same variable you just named."],
        explain: [
          { text: "`e.Message` describes the failure - here, an index out of range.", highlight: "Console.WriteLine(\"problem: \" + {{2}}.Message)" },
        ],
      },
    ],
  },
  {
    title: "Always clean up",
    concept: "finally",
    context:
      "A `finally` block runs no matter what - whether the `try` finished cleanly or a `catch` handled a failure. It is where you put steps that must always happen, like closing a file or locking up.",
    snippet: `try
{
    Console.WriteLine("feeding the cat");
}
{{1}}
{
    Console.WriteLine("locking the cat flap");
}`,
    points: [
      "`finally` always runs, success or failure.",
      "Use it for cleanup that must not be skipped.",
    ],
    blanks: [
      {
        id: 1,
        label: "Block that always runs at the end",
        answer: "finally",
        hints: ["One word; it comes after try (and any catch)."],
        explain: [
          { text: "`finally` runs after the `try`, whatever happened, so the cleanup always occurs.", highlight: "{{1}}" },
        ],
      },
    ],
  },
  {
    title: "Raise your own",
    concept: "throw",
    context:
      "When your own code spots something invalid, it can raise an exception with `throw`. Here a method refuses a negative number of treats, and the caller catches it.",
    snippet: `int Treats(int n)
{
    if (n < 0)
        {{1}} new ArgumentException("treats cannot be negative");
    return n;
}

try { Treats(-1); }
catch (ArgumentException e) { Console.WriteLine(e.Message); }`,
    points: [
      "`throw` raises an exception on purpose.",
      "A caller can `catch` it just like any built-in failure.",
    ],
    blanks: [
      {
        id: 1,
        label: "Keyword that raises an exception",
        answer: "throw",
        hints: ["Five letters; you 'throw' an exception."],
        explain: [
          { text: "`throw new ArgumentException(...)` raises the error, which the caller catches.", highlight: "{{1}} new ArgumentException(\"treats cannot be negative\")" },
        ],
      },
    ],
  },
  {
    title: "Nothing there: null",
    concept: "null",
    context:
      "A reference can point to nothing at all. That 'no value yet' is written `null`. Marking a type with a `?` - like `string?` - says it is allowed to be null. Reading from a `null` reference is the most common beginner crash, so check for it with `== null`.",
    snippet: `string? name = null;
if (name {{1}} null)
    Console.WriteLine("no name yet");
else
    Console.WriteLine(name);`,
    points: [
      "`null` means the reference points to no object.",
      "Check for it before using the value.",
    ],
    blanks: [
      {
        id: 1,
        label: "Compare name against null (two characters)",
        answer: "==",
        hints: ["The equality operator."],
        explain: [
          { text: "`name == null` is true when the reference holds no value.", highlight: "if (name {{1}} null)" },
        ],
      },
    ],
  },
  {
    title: "A fallback with ??",
    concept: "Null-coalescing",
    context:
      "The `??` operator gives a fallback when the left side is `null`. `name ?? \"stray\"` means 'use `name`, but if it is `null`, use \"stray\" instead' - in one short line, no `if` needed.",
    snippet: `string? name = null;
string display = name {{1}} "stray";
Console.WriteLine(display);`,
    points: [
      "`??` returns the left side unless it is `null`, then the right side.",
      "A tidy way to supply a default value.",
    ],
    blanks: [
      {
        id: 1,
        label: "Operator that supplies a fallback for null",
        answer: "??",
        hints: ["Two question marks."],
        explain: [
          { text: "`name ?? \"stray\"` is `\"stray\"` because `name` is null.", highlight: "string display = name {{1}} \"stray\"" },
        ],
      },
    ],
  },
  {
    title: "Safe access with ?.",
    concept: "Null-conditional",
    context:
      "Writing `?.` instead of `.` only reaches for the member when the object is not `null`; if it is null, the whole expression is `null` instead of crashing. Here a missing name's length comes back as null, not a `NullReferenceException`.",
    snippet: `string? name = null;
int? length = name{{1}}Length;
Console.WriteLine(length == null ? "unknown" : length.ToString());`,
    points: [
      "`?.` skips the access and yields `null` when the object is null.",
      "It turns a would-be crash into a harmless `null`.",
    ],
    blanks: [
      {
        id: 1,
        label: "Operator for safe member access (two characters)",
        answer: "?.",
        hints: ["A question mark followed by a dot."],
        explain: [
          { text: "`name?.Length` is `null` because `name` is null, so no crash - and the line prints `unknown`.", highlight: "int? length = name{{1}}Length" },
        ],
      },
    ],
  },
  {
    title: "Errors and null - recap",
    concept: "Recap",
    summary: true,
    context: "You can now stop the two most common ways a program falls over: failures and missing values.",
    summaryIntro:
      "Exceptions handle things going wrong; null handling deals with values that are not there. Together they keep a program standing instead of crashing.",
    summaryItems: [
      { title: "try / catch - ", text: "run risky code in `try`, handle the failure in `catch`." },
      { title: "the message - ", text: "`catch (Exception e)` then `e.Message` tells you what failed." },
      { title: "finally - ", text: "always runs at the end, for cleanup that must not be skipped." },
      { title: "throw - ", text: "raise your own exception when something is invalid." },
      { title: "null - ", text: "a reference to no value; check it with `== null`." },
      { title: "?? and ?. - ", text: "supply a fallback for null, or access a member safely without crashing." },
    ],
    summaryClose: "Next in this track: generics - writing your own types that work with any kind of value, like the List<T> you have already used.",
    blanks: [],
  },
];

// Complete, runnable C# for each drill, index-aligned with `drills`. Each one
// runs to completion (every exception is caught), so Run shows real output.
const runnablePrograms = [
  // 0 - Catch a problem
  `using System;

class Program
{
    static void Main()
    {
        try
        {
            int treats = 10, dogs = 0;
            Console.WriteLine(treats / dogs);
        }
        catch (DivideByZeroException)
        {
            Console.WriteLine("cannot split treats among zero dogs");
        }
    }
}`,
  // 1 - What went wrong
  `using System;

class Program
{
    static void Main()
    {
        try
        {
            int[] paws = new int[4];
            Console.WriteLine(paws[10]);
        }
        catch (Exception e)
        {
            Console.WriteLine("problem: " + e.Message);
        }
    }
}`,
  // 2 - Always clean up
  `using System;

class Program
{
    static void Main()
    {
        try
        {
            Console.WriteLine("feeding the cat");
        }
        finally
        {
            Console.WriteLine("locking the cat flap");
        }
    }
}`,
  // 3 - Raise your own
  `using System;

class Program
{
    static int Treats(int n)
    {
        if (n < 0)
            throw new ArgumentException("treats cannot be negative");
        return n;
    }

    static void Main()
    {
        try { Treats(-1); }
        catch (ArgumentException e) { Console.WriteLine(e.Message); }
    }
}`,
  // 4 - Nothing there: null
  `using System;

class Program
{
    static void Main()
    {
        string? name = null;
        if (name == null)
            Console.WriteLine("no name yet");
        else
            Console.WriteLine(name);
    }
}`,
  // 5 - A fallback with ??
  `using System;

class Program
{
    static void Main()
    {
        string? name = null;
        string display = name ?? "stray";
        Console.WriteLine(display);
    }
}`,
  // 6 - Safe access with ?.
  `using System;

class Program
{
    static void Main()
    {
        string? name = null;
        int? length = name?.Length;
        Console.WriteLine(length == null ? "unknown" : length.ToString());
    }
}`,
  // 7 - Recap (no runnable program)
  null,
];

window.DRILL_CONFIG = {
  prefix: "en",
  metaLabel: "Know the language \u00b7 Errors and null",
  progressNoun: "Drill",
  drills,
  runnablePrograms,
  runnerUrl: "level3-app/index.html?runner=1",
  xpKey: "course_global_xp",
  awardedKey: "errors_null_awarded",
  awardAmount: 20,
};
