// Exception handling - Part three. A code-lab write-and-run build lesson
// (the build plugin reads window.LESSON_CONFIG). The learner writes each piece of
// error handling and runs it: try/catch, reading the message, finally, throw,
// and the null-safety operators ?? and ?. (null itself is taught in Foundations).
// Animal theme throughout. Every task's output is a fixed, culture-independent
// string so grading is deterministic.
(function () {
  "use strict";

  const tasks = [
    {
      example: "try\n{\n    int[] data = new int[2];\n    Console.WriteLine(data[5]);   // throws\n}\ncatch (IndexOutOfRangeException)\n{\n    Console.WriteLine(\"out of range\");\n}",
      expected: "cannot split treats among zero dogs",
      requireSource: [
        {
          pattern: /\btry\b/,
          message: "Wrap the risky code in a `try` block."
        },
        {
          pattern: /catch\s*\(\s*DivideByZeroException/,
          message: "Handle it with `catch (DivideByZeroException)`."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int treats = 10, dogs = 0;\n        // This line throws when dogs is 0.\n        // TODO: wrap it in a try, and catch (DivideByZeroException) to print\n        //   cannot split treats among zero dogs\n        Console.WriteLine(treats / dogs);\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        int treats = 10, dogs = 0;\n        try\n        {\n            Console.WriteLine(treats / dogs);\n        }\n        catch (DivideByZeroException)\n        {\n            Console.WriteLine(\"cannot split treats among zero dogs\");\n        }\n    }\n}\n"
    },
    {
      example: "try\n{\n    throw new InvalidOperationException(\"no fish\");\n}\ncatch (Exception ex)\n{\n    Console.WriteLine(ex.Message);   // no fish\n}",
      expected: "the bowl is empty",
      requireSource: [
        {
          pattern: /\.\s*Message/,
          message: "Read the message off the caught exception: `e.Message`."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        try\n        {\n            throw new InvalidOperationException(\"the bowl is empty\");\n        }\n        catch (Exception e)\n        {\n            // TODO: print the exception's Message\n        }\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        try\n        {\n            throw new InvalidOperationException(\"the bowl is empty\");\n        }\n        catch (Exception e)\n        {\n            Console.WriteLine(e.Message);\n        }\n    }\n}\n"
    },
    {
      example: "try\n{\n    Console.WriteLine(\"open the gate\");\n}\nfinally\n{\n    Console.WriteLine(\"close the gate\");   // always runs\n}",
      expected: [
        "feeding the cat",
        "locking the cat flap"
      ],
      requireSource: [
        {
          pattern: /\bfinally\b/,
          message: "Add a `finally` block after the `try`/`catch`."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        try\n        {\n            Console.WriteLine(\"feeding the cat\");\n        }\n        catch (Exception)\n        {\n            Console.WriteLine(\"something spooked the cat\");\n        }\n        // TODO: add a finally block here that prints \"locking the cat flap\"\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        try\n        {\n            Console.WriteLine(\"feeding the cat\");\n        }\n        catch (Exception)\n        {\n            Console.WriteLine(\"something spooked the cat\");\n        }\n        finally\n        {\n            Console.WriteLine(\"locking the cat flap\");\n        }\n    }\n}\n"
    },
    {
      example: "static int Age(int years)\n{\n    if (years < 0)\n        throw new ArgumentException(\"age cannot be negative\");\n    return years;\n}",
      expected: "treats cannot be negative",
      requireSource: [
        {
          pattern: /\bthrow\b/,
          message: "Raise the error with `throw`."
        },
        {
          pattern: /ArgumentException/,
          message: "Throw an `ArgumentException` with the message."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static int Treats(int count)\n    {\n        // TODO: if count is negative, throw new ArgumentException(\"treats cannot be negative\")\n        return count;\n    }\n\n    static void Main()\n    {\n        try\n        {\n            Treats(-1);\n        }\n        catch (ArgumentException e)\n        {\n            Console.WriteLine(e.Message);\n        }\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static int Treats(int count)\n    {\n        if (count < 0)\n            throw new ArgumentException(\"treats cannot be negative\");\n        return count;\n    }\n\n    static void Main()\n    {\n        try\n        {\n            Treats(-1);\n        }\n        catch (ArgumentException e)\n        {\n            Console.WriteLine(e.Message);\n        }\n    }\n}\n"
    },
    {
      example: "string? label = null;\nstring shown = label ?? \"unlabelled\";\nConsole.WriteLine(shown);   // unlabelled",
      expected: "stray",
      requireSource: [
        {
          pattern: /\?\?/,
          message: "Use the `??` operator to supply the fallback."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        string? name = null;\n        // TODO: use ?? so display becomes \"stray\" when name is null\n        string display = name;\n        Console.WriteLine(display);\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        string? name = null;\n        string display = name ?? \"stray\";\n        Console.WriteLine(display);\n    }\n}\n"
    },
    {
      example: "string? tag = null;\nint? size = tag?.Length;\nConsole.WriteLine(size == null ? \"none\" : size.ToString());   // none",
      expected: "unknown",
      requireSource: [
        {
          pattern: /\?\./,
          message: "Use the `?.` operator for safe member access."
        }
      ],
      starter: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        string? name = null;\n        // TODO: use ?. so length is null instead of crashing when name is null\n        int? length = name.Length;\n        Console.WriteLine(length == null ? \"unknown\" : length.ToString());\n    }\n}\n",
      solution: "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        string? name = null;\n        int? length = name?.Length;\n        Console.WriteLine(length == null ? \"unknown\" : length.ToString());\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "en",
    metaLabel: "Know the language · Exception handling",
    progressNoun: "Step",
    awardedKey: "errors_null_awarded",
    awardAmount: 20,
    tasks,
  };
})();
