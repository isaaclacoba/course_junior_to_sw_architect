// Exception handling - Part three. A code-lab write-and-run build lesson
// (build-engine.js reads window.BUILD_CONFIG). The learner writes each piece of
// error handling and runs it: try/catch, reading the message, finally, throw,
// and the null-safety operators ?? and ?. (null itself is taught in Foundations).
// Animal theme throughout. Every task's output is a fixed, culture-independent
// string so grading is deterministic.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Catch a problem",
      concept: "try / catch",
      context:
        "Some operations fail - dividing by zero, reading past the end of a list. A failure throws an **exception** that stops the normal flow. Put the risky code in a `try` block and handle the failure in a `catch` block, so the program keeps running instead of crashing.",
      example:
        'try\n{\n    int[] data = new int[2];\n    Console.WriteLine(data[5]);   // throws\n}\ncatch (IndexOutOfRangeException)\n{\n    Console.WriteLine("out of range");\n}',
      goal: [
        "Wrap the division in a `try`, and `catch (DivideByZeroException)`.",
        "In the catch, print `cannot split treats among zero dogs`. That should be the output.",
      ],
      expected: "cannot split treats among zero dogs",
      requireSource: [
        { pattern: /\btry\b/, message: "Wrap the risky code in a `try` block." },
        { pattern: /catch\s*\(\s*DivideByZeroException/, message: "Handle it with `catch (DivideByZeroException)`." },
      ],
      starter: `using System;

class Program
{
    static void Main()
    {
        int treats = 10, dogs = 0;
        // This line throws when dogs is 0.
        // TODO: wrap it in a try, and catch (DivideByZeroException) to print
        //   cannot split treats among zero dogs
        Console.WriteLine(treats / dogs);
    }
}
`,
      solution: `using System;

class Program
{
    static void Main()
    {
        int treats = 10, dogs = 0;
        try
        {
            Console.WriteLine(treats / dogs);
        }
        catch (DivideByZeroException)
        {
            Console.WriteLine("cannot split treats among zero dogs");
        }
    }
}
`,
    },
    {
      title: "What went wrong",
      concept: "The message",
      context:
        "An exception is an object that carries details about the failure, including a `Message`. Catch it into a variable - `catch (Exception e)` - and read `e.Message` to find out what happened.",
      example:
        'try\n{\n    throw new InvalidOperationException("no fish");\n}\ncatch (Exception ex)\n{\n    Console.WriteLine(ex.Message);   // no fish\n}',
      goal: [
        "In the `catch`, print the exception's `Message`.",
        "The thrown message is `the bowl is empty`, so that should be the output.",
      ],
      expected: "the bowl is empty",
      requireSource: [
        { pattern: /\.\s*Message/, message: "Read the message off the caught exception: `e.Message`." },
      ],
      starter: `using System;

class Program
{
    static void Main()
    {
        try
        {
            throw new InvalidOperationException("the bowl is empty");
        }
        catch (Exception e)
        {
            // TODO: print the exception's Message
        }
    }
}
`,
      solution: `using System;

class Program
{
    static void Main()
    {
        try
        {
            throw new InvalidOperationException("the bowl is empty");
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
        }
    }
}
`,
    },
    {
      title: "Always clean up",
      concept: "finally",
      context:
        "A `finally` block runs no matter what - whether the `try` finished cleanly or a `catch` handled a failure. It is where you put steps that must always happen, like closing a file or locking up.",
      example:
        'try\n{\n    Console.WriteLine("open the gate");\n}\nfinally\n{\n    Console.WriteLine("close the gate");   // always runs\n}',
      goal: [
        "Add a `finally` block that prints `locking the cat flap`.",
        "The output should be feeding the cat, then locking the cat flap.",
      ],
      expected: ["feeding the cat", "locking the cat flap"],
      requireSource: [
        { pattern: /\bfinally\b/, message: "Add a `finally` block after the `try`/`catch`." },
      ],
      starter: `using System;

class Program
{
    static void Main()
    {
        try
        {
            Console.WriteLine("feeding the cat");
        }
        catch (Exception)
        {
            Console.WriteLine("something spooked the cat");
        }
        // TODO: add a finally block here that prints "locking the cat flap"
    }
}
`,
      solution: `using System;

class Program
{
    static void Main()
    {
        try
        {
            Console.WriteLine("feeding the cat");
        }
        catch (Exception)
        {
            Console.WriteLine("something spooked the cat");
        }
        finally
        {
            Console.WriteLine("locking the cat flap");
        }
    }
}
`,
    },
    {
      title: "Raise your own",
      concept: "throw",
      context:
        "When your own code spots something invalid, it can raise an exception with `throw`. Here a method refuses a negative number of treats; the caller (already written) catches it and prints the message.",
      example:
        'static int Age(int years)\n{\n    if (years < 0)\n        throw new ArgumentException("age cannot be negative");\n    return years;\n}',
      goal: [
        "In `Treats`, if `count` is negative, `throw new ArgumentException(\"treats cannot be negative\")`.",
        "`Main` calls `Treats(-1)` and catches it, so the output should be treats cannot be negative.",
      ],
      expected: "treats cannot be negative",
      requireSource: [
        { pattern: /\bthrow\b/, message: "Raise the error with `throw`." },
        { pattern: /ArgumentException/, message: "Throw an `ArgumentException` with the message." },
      ],
      starter: `using System;

class Program
{
    static int Treats(int count)
    {
        // TODO: if count is negative, throw new ArgumentException("treats cannot be negative")
        return count;
    }

    static void Main()
    {
        try
        {
            Treats(-1);
        }
        catch (ArgumentException e)
        {
            Console.WriteLine(e.Message);
        }
    }
}
`,
      solution: `using System;

class Program
{
    static int Treats(int count)
    {
        if (count < 0)
            throw new ArgumentException("treats cannot be negative");
        return count;
    }

    static void Main()
    {
        try
        {
            Treats(-1);
        }
        catch (ArgumentException e)
        {
            Console.WriteLine(e.Message);
        }
    }
}
`,
    },
    {
      title: "A fallback with ??",
      concept: "Null-coalescing",
      context:
        "The `??` operator gives a fallback when the left side is `null`. `name ?? \"stray\"` means: use `name`, but if it is `null`, use `\"stray\"` instead - one short line, no `if` needed. (You met `null` in Foundations.)",
      example:
        'string? label = null;\nstring shown = label ?? "unlabelled";\nConsole.WriteLine(shown);   // unlabelled',
      goal: [
        "Use `??` so `display` falls back to `\"stray\"` when `name` is `null`.",
        "`name` is null here, so the output should be stray.",
      ],
      expected: "stray",
      requireSource: [
        { pattern: /\?\?/, message: "Use the `??` operator to supply the fallback." },
      ],
      starter: `using System;

class Program
{
    static void Main()
    {
        string? name = null;
        // TODO: use ?? so display becomes "stray" when name is null
        string display = name;
        Console.WriteLine(display);
    }
}
`,
      solution: `using System;

class Program
{
    static void Main()
    {
        string? name = null;
        string display = name ?? "stray";
        Console.WriteLine(display);
    }
}
`,
    },
    {
      title: "Safe access with ?.",
      concept: "Null-conditional",
      context:
        "Writing `?.` instead of `.` only reaches for the member when the object is not `null`; if it is null, the whole expression is `null` instead of crashing. Here a missing name's length comes back as `null`, not a crash.",
      example:
        'string? tag = null;\nint? size = tag?.Length;\nConsole.WriteLine(size == null ? "none" : size.ToString());   // none',
      goal: [
        "Use `?.` so `length` becomes `null` (not a crash) when `name` is `null`.",
        "`name` is null here, so the output should be unknown.",
      ],
      expected: "unknown",
      requireSource: [
        { pattern: /\?\./, message: "Use the `?.` operator for safe member access." },
      ],
      starter: `using System;

class Program
{
    static void Main()
    {
        string? name = null;
        // TODO: use ?. so length is null instead of crashing when name is null
        int? length = name.Length;
        Console.WriteLine(length == null ? "unknown" : length.ToString());
    }
}
`,
      solution: `using System;

class Program
{
    static void Main()
    {
        string? name = null;
        int? length = name?.Length;
        Console.WriteLine(length == null ? "unknown" : length.ToString());
    }
}
`,
    },
    {
      title: "Exception handling recap",
      concept: "Recap",
      summary: true,
      summaryIntro:
        "Exceptions handle things going wrong; the null-safety operators deal with a value that might not be there. You met `null` itself back in Foundations.",
      summaryItems: [
        { title: "try / catch - ", text: "run risky code in `try`, handle the failure in `catch`." },
        { title: "the message - ", text: "`catch (Exception e)` then `e.Message` tells you what failed." },
        { title: "finally - ", text: "always runs at the end, for cleanup that must not be skipped." },
        { title: "throw - ", text: "raise your own exception when something is invalid." },
        { title: "?? and ?. - ", text: "supply a fallback for null, or access a member safely without crashing." },
      ],
      summaryClose:
        "Next in this track: generics - writing your own types that work with any kind of value, like the List<T> you have already used.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "en",
    metaLabel: "Know the language \u00b7 Exception handling",
    progressNoun: "Step",
    awardedKey: "errors_null_awarded",
    awardAmount: 20,
    tasks,
  };
})();
