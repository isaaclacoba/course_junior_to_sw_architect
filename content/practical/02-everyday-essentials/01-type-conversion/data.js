// Unit 2 - "C# up close": Type conversion & parsing. Write-from-scratch builds.
// Data only: build-engine.js reads window.BUILD_CONFIG (loaded after this file).
// Culture-safe: never prints a raw double/decimal (the browser locale would
// decide the separator); every task prints ints, strings or booleans.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Text into a number",
      concept: "Parse text to int",
      context:
        "Data often arrives as **text** - a form field, a line from a file. Before you can do maths with it, you turn it into a number. `int.Parse(\"3\")` reads the text `\"3\"` and hands back the number `3`.\n\nWrite a `Kitten` whose `AgeNextYear(string ageText)` parses the age and returns it plus one.",
      example:
        "public class Ticket\n{\n    public int Number(string text)\n    {\n        return int.Parse(text);\n    }\n}",
      goal: [
        "Give `Kitten` an `int AgeNextYear(string ageText)` that parses `ageText` and returns it plus 1.",
        "`Main` calls `AgeNextYear(\"3\")`, so the output is `4`.",
      ],
      expected: "4",
      requireSource: [
        { pattern: /int\.Parse/, message: "Turn the text into a number with `int.Parse(ageText)`." },
        { pattern: /int\s+AgeNextYear\s*\(\s*string/, message: "Give `Kitten` an `int AgeNextYear(string ageText)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var k = new Kitten();\n        System.Console.WriteLine(k.AgeNextYear("10"));\n    }\n}\n',
        expected: "11",
        message: "`AgeNextYear` must parse the text it is given, not a fixed value - a kitten aged \"10\" should come back as 11.",
      },
      starter:
        'using System;\n\npublic class Kitten\n{\n    public int AgeNextYear(string ageText)\n    {\n        // TODO: parse ageText into a number, then return it plus 1\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var k = new Kitten();\n        Console.WriteLine(k.AgeNextYear("3"));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Kitten\n{\n    public int AgeNextYear(string ageText)\n    {\n        int age = int.Parse(ageText);\n        return age + 1;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var k = new Kitten();\n        Console.WriteLine(k.AgeNextYear("3"));\n    }\n}\n',
    },
    {
      title: "A number into text",
      concept: "int to string with ToString",
      context:
        "The other direction: turn a number into text so you can build a label or a code. `count.ToString()` gives the digits back as a `string`, ready to join with other text.\n\nWrite a `Chip` whose `Code(int n)` returns the letter `\"C\"` followed by the number as text - so `7` becomes `\"C7\"`.",
      example:
        "public class Badge\n{\n    public string Make(int n)\n    {\n        return \"B\" + n.ToString();\n    }\n}",
      goal: [
        "Give `Chip` a `string Code(int n)` that returns `\"C\"` joined with `n` as text.",
        "`Main` calls `Code(7)`, so the output is `C7`.",
      ],
      expected: "C7",
      requireSource: [
        { pattern: /\.ToString\s*\(\s*\)/, message: "Turn the number into text with `n.ToString()`." },
        { pattern: /string\s+Code\s*\(\s*int/, message: "Give `Chip` a `string Code(int n)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var chip = new Chip();\n        System.Console.WriteLine(chip.Code(3));\n    }\n}\n',
        expected: "C3",
        message: "`Code` must use the number it is given - `3` should read `C3`, not a fixed `C7`.",
      },
      starter:
        'using System;\n\npublic class Chip\n{\n    public string Code(int n)\n    {\n        // TODO: return "C" followed by n as text\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var chip = new Chip();\n        Console.WriteLine(chip.Code(7));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Chip\n{\n    public string Code(int n)\n    {\n        return "C" + n.ToString();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var chip = new Chip();\n        Console.WriteLine(chip.Code(7));\n    }\n}\n',
    },
    {
      title: "Drop the decimals",
      concept: "Cast double to int",
      context:
        "A `double` like `3.9` carries a fractional part. Casting it with `(int)` **drops** the decimals - it truncates toward zero, it does not round - so `(int)3.9` is `3`, not `4`.\n\nWrite a `Scale` whose `Whole(double kg)` returns just the whole-number part of a weight.",
      example:
        "public class Ruler\n{\n    public int Floor(double x)\n    {\n        return (int)x;\n    }\n}",
      goal: [
        "Give `Scale` an `int Whole(double kg)` that returns `kg` cast to `int`.",
        "`Main` calls `Whole(3.9)`, so the output is `3`.",
      ],
      expected: "3",
      requireSource: [
        { pattern: /\(\s*int\s*\)/, message: "Drop the decimals with a cast: `(int)kg`." },
        { pattern: /int\s+Whole\s*\(\s*double/, message: "Give `Scale` an `int Whole(double kg)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var scale = new Scale();\n        System.Console.WriteLine(scale.Whole(7.8));\n    }\n}\n',
        expected: "7",
        message: "`Whole` must truncate the value it is given - `7.8` should come back as `7`.",
      },
      starter:
        'using System;\n\npublic class Scale\n{\n    public int Whole(double kg)\n    {\n        // TODO: return kg with the decimals dropped\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var scale = new Scale();\n        Console.WriteLine(scale.Whole(3.9));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Scale\n{\n    public int Whole(double kg)\n    {\n        return (int)kg;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var scale = new Scale();\n        Console.WriteLine(scale.Whole(3.9));\n    }\n}\n',
    },
    {
      title: "Parse without crashing",
      concept: "int.TryParse",
      context:
        "`int.Parse(\"cat\")` throws - the text is not a number, and the program stops. `int.TryParse` is the safe version: it returns a `bool` saying whether it worked, and puts the number into an `out` variable when it does.\n\nWrite a `Gate` whose `IsNumber(string text)` returns whether the text is a whole number.",
      example:
        "public class Field\n{\n    public bool Valid(string s)\n    {\n        return int.TryParse(s, out int _);\n    }\n}",
      goal: [
        "Give `Gate` a `bool IsNumber(string text)` that returns the result of `int.TryParse`.",
        "`Main` calls `IsNumber(\"cat\")`, so the output is `False`.",
      ],
      expected: "False",
      requireSource: [
        { pattern: /int\.TryParse/, message: "Use `int.TryParse(text, out int n)` - it returns whether the text was a number." },
        { pattern: /bool\s+IsNumber\s*\(\s*string/, message: "Give `Gate` a `bool IsNumber(string text)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var gate = new Gate();\n        System.Console.WriteLine(gate.IsNumber("5"));\n    }\n}\n',
        expected: "True",
        message: "`IsNumber` must test the text it is given - `\"5\"` is a number, so it should read `True`.",
      },
      starter:
        'using System;\n\npublic class Gate\n{\n    public bool IsNumber(string text)\n    {\n        // TODO: return whether text is a whole number, using int.TryParse\n        return false;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new Gate();\n        Console.WriteLine(gate.IsNumber("cat"));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Gate\n{\n    public bool IsNumber(string text)\n    {\n        return int.TryParse(text, out int n);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new Gate();\n        Console.WriteLine(gate.IsNumber("cat"));\n    }\n}\n',
    },
    {
      summary: true,
      title: "What you learned",
      concept: "Converting between types",
      context: "Four everyday conversions - the moves you reach for whenever data crosses a boundary.",
      summaryIntro:
        "Values change type constantly: text comes in, numbers go out, decimals need trimming. You wrote each conversion by hand:",
      summaryItems: [
        { title: "Text to a number - ", text: "`int.Parse(\"3\")` reads text and gives back the number `3`, so you can do maths with it." },
        { title: "A number to text - ", text: "`n.ToString()` turns a number into its digits as a `string`, ready to join into a label or code." },
        { title: "Drop the decimals - ", text: "`(int)3.9` casts a `double` to `int` by truncating - it drops the fraction, it does not round." },
        { title: "Parse without crashing - ", text: "`int.TryParse` returns a `bool` for whether the text was a number, instead of throwing when it is not." },
      ],
      summaryClose:
        "Reach for `TryParse` over `Parse` whenever the text might be wrong - the same double/string/int conversions carry over to every type you will meet next.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "tc",
    metaLabel: "Everyday essentials \u00b7 Type conversion",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "type_conversion_awarded",
    awardAmount: 20,
  };
})();
