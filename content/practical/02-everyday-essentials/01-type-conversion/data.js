// Unit 2 - "C# up close": Type conversion & parsing. Write-from-scratch builds.
// Data only: the build plugin reads window.LESSON_CONFIG (loaded after this file).
// Culture-safe: never prints a raw double/decimal (the browser locale would
// decide the separator); every task prints ints, strings or booleans.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Ticket\n{\n    public int Number(string text)\n    {\n        return int.Parse(text);\n    }\n}",
      expected: "4",
      requireSource: [
        {
          pattern: /int\.Parse/,
          message: "Turn the text into a number with `int.Parse(ageText)`."
        },
        {
          pattern: /int\s+AgeNextYear\s*\(\s*string/,
          message: "Give `Kitten` an `int AgeNextYear(string ageText)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var k = new Kitten();\n        System.Console.WriteLine(k.AgeNextYear(\"10\"));\n    }\n}\n",
        expected: "11",
        message: "`AgeNextYear` must parse the text it is given, not a fixed value - a kitten aged \"10\" should come back as 11."
      },
      starter: "using System;\n\npublic class Kitten\n{\n    public int AgeNextYear(string ageText)\n    {\n        // TODO: parse ageText into a number, then return it plus 1\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var k = new Kitten();\n        Console.WriteLine(k.AgeNextYear(\"3\"));\n    }\n}\n",
      goals: [
        { code: ["class Kitten", { row: "int age = int.Parse(ageText)", writes: "int.Parse(" }, { row: "return age + 1", writes: "age + 1" }], gate: { type: "Kitten", member: "AgeNextYear" } },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Kitten\n{\n    public int AgeNextYear(string ageText)\n    {\n        int age = int.Parse(ageText);\n        return age + 1;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var k = new Kitten();\n        Console.WriteLine(k.AgeNextYear(\"3\"));\n    }\n}\n"
    },
    {
      example: "public class Badge\n{\n    public string Make(int number)\n    {\n        return \"B\" + number.ToString();\n    }\n}",
      expected: "C7",
      requireSource: [
        {
          pattern: /\.ToString\s*\(\s*\)/,
          message: "Turn the number into text with `n.ToString()`."
        },
        {
          pattern: /string\s+Code\s*\(\s*int/,
          message: "Give `Chip` a `string Code(int n)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var chip = new Chip();\n        System.Console.WriteLine(chip.Code(3));\n    }\n}\n",
        expected: "C3",
        message: "`Code` must use the number it is given - `3` should read `C3`, not a fixed `C7`."
      },
      starter: "using System;\n\npublic class Chip\n{\n    public string Code(int n)\n    {\n        // TODO: return \"C\" followed by n as text\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var chip = new Chip();\n        Console.WriteLine(chip.Code(7));\n    }\n}\n",
      goals: [
        { code: ["class Chip", { row: "\"C\" + n.ToString()", writes: ".ToString(" }], gate: { type: "Chip", member: "Code" } },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Chip\n{\n    public string Code(int n)\n    {\n        return \"C\" + n.ToString();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var chip = new Chip();\n        Console.WriteLine(chip.Code(7));\n    }\n}\n"
    },
    {
      example: "public class Ruler\n{\n    public int Floor(double value)\n    {\n        return (int)value;\n    }\n}",
      expected: "3",
      requireSource: [
        {
          pattern: /\(\s*int\s*\)/,
          message: "Drop the decimals with a cast: `(int)kg`."
        },
        {
          pattern: /int\s+Whole\s*\(\s*double/,
          message: "Give `Scale` an `int Whole(double kg)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var scale = new Scale();\n        System.Console.WriteLine(scale.Whole(7.8));\n    }\n}\n",
        expected: "7",
        message: "`Whole` must truncate the value it is given - `7.8` should come back as `7`."
      },
      starter: "using System;\n\npublic class Scale\n{\n    public int Whole(double kg)\n    {\n        // TODO: return kg with the decimals dropped\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var scale = new Scale();\n        Console.WriteLine(scale.Whole(3.9));\n    }\n}\n",
      goals: [
        { code: ["class Scale", { row: "return (int)kg", writes: "(int)kg" }], gate: { type: "Scale", member: "Whole" } },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Scale\n{\n    public int Whole(double kg)\n    {\n        return (int)kg;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var scale = new Scale();\n        Console.WriteLine(scale.Whole(3.9));\n    }\n}\n"
    },
    {
      example: "public class Field\n{\n    public bool Valid(string text)\n    {\n        return int.TryParse(text, out int _);\n    }\n}",
      expected: "False",
      requireSource: [
        {
          pattern: /int\.TryParse/,
          message: "Use `int.TryParse(text, out int n)` - it returns whether the text was a number."
        },
        {
          pattern: /bool\s+IsNumber\s*\(\s*string/,
          message: "Give `Gate` a `bool IsNumber(string text)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var gate = new Gate();\n        System.Console.WriteLine(gate.IsNumber(\"5\"));\n    }\n}\n",
        expected: "True",
        message: "`IsNumber` must test the text it is given - `\"5\"` is a number, so it should read `True`."
      },
      starter: "using System;\n\npublic class Gate\n{\n    public bool IsNumber(string text)\n    {\n        // TODO: return whether text is a whole number, using int.TryParse\n        return false;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new Gate();\n        Console.WriteLine(gate.IsNumber(\"cat\"));\n    }\n}\n",
      goals: [
        { code: ["class Gate", { row: "return int.TryParse(text, out int n)", writes: "int.TryParse(" }], gate: { type: "Gate", member: "IsNumber" } },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Gate\n{\n    public bool IsNumber(string text)\n    {\n        return int.TryParse(text, out int n);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var gate = new Gate();\n        Console.WriteLine(gate.IsNumber(\"cat\"));\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "tc",
    metaLabel: "Everyday essentials · Type conversion",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "type_conversion_awarded",
    awardAmount: 20,
  };
})();
