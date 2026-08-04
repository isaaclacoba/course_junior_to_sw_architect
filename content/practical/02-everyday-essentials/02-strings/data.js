// Unit 2 - "C# up close": Strings (text operations). Write-from-scratch builds.
// Data only: build-engine.js reads window.LESSON_CONFIG (loaded after this file).
// Portable idea: text is a value you can build from parts, reshape, search and
// transform. C# is just the surface we practise it on here.
// Culture-safe: never prints a raw double/decimal; every task prints strings or
// booleans (True/False), and interpolates only strings and ints.
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Badge\n{\n    public string Line(string owner, int id)\n    {\n        return $\"{owner} carries badge {id}\";\n    }\n}",
      expected: "Ant has 6 legs",
      requireSource: [
        {
          pattern: /\$"/,
          message: "Build the line with interpolation: `$\"{name} has {legs} legs\"`."
        },
        {
          pattern: /string\s+Label\s*\(\s*string/,
          message: "Give `Critter` a `string Label(string name, int legs)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var c = new Critter();\n        System.Console.WriteLine(c.Label(\"Spider\", 8));\n    }\n}\n",
        expected: "Spider has 8 legs",
        message: "`Label` must build the line from the values it is given - a spider with 8 legs should read `Spider has 8 legs`, not a fixed animal."
      },
      starter: "using System;\n\npublic class Critter\n{\n    public string Label(string name, int legs)\n    {\n        // TODO: build one line from name and legs, using $\"...\"\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Critter();\n        Console.WriteLine(c.Label(\"Ant\", 6));\n    }\n}\n",
      solution: "using System;\n\npublic class Critter\n{\n    public string Label(string name, int legs)\n    {\n        return $\"{name} has {legs} legs\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Critter();\n        Console.WriteLine(c.Label(\"Ant\", 6));\n    }\n}\n"
    },
    {
      example: "public class Header\n{\n    public string Loud(string word)\n    {\n        return word.ToUpper();\n    }\n}",
      expected: "CAT",
      requireSource: [
        {
          pattern: /\.ToUpper\s*\(\s*\)/,
          message: "Reshape the text with `name.ToUpper()`."
        },
        {
          pattern: /string\s+Shout\s*\(\s*string/,
          message: "Give `Announcer` a `string Shout(string name)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var a = new Announcer();\n        System.Console.WriteLine(a.Shout(\"dog\"));\n    }\n}\n",
        expected: "DOG",
        message: "`Shout` must reshape the text it is given - `\"dog\"` should come back as `DOG`, not a fixed `CAT`."
      },
      starter: "using System;\n\npublic class Announcer\n{\n    public string Shout(string name)\n    {\n        // TODO: return name with every letter in upper case\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Announcer();\n        Console.WriteLine(a.Shout(\"cat\"));\n    }\n}\n",
      solution: "using System;\n\npublic class Announcer\n{\n    public string Shout(string name)\n    {\n        return name.ToUpper();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Announcer();\n        Console.WriteLine(a.Shout(\"cat\"));\n    }\n}\n"
    },
    {
      example: "public class Inbox\n{\n    public bool HasTag(string message, string tag)\n    {\n        return message.Contains(tag);\n    }\n}",
      expected: "True",
      requireSource: [
        {
          pattern: /\.Contains\s*\(/,
          message: "Search the text with `text.Contains(word)` - it returns a `bool`."
        },
        {
          pattern: /bool\s+Mentions\s*\(\s*string/,
          message: "Give `Log` a `bool Mentions(string text, string word)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var log = new Log();\n        System.Console.WriteLine(log.Mentions(\"only dogs here\", \"cat\"));\n    }\n}\n",
        expected: "False",
        message: "`Mentions` must search the text it is given - `\"cat\"` is not in `\"only dogs here\"`, so it should read `False`."
      },
      starter: "using System;\n\npublic class Log\n{\n    public bool Mentions(string text, string word)\n    {\n        // TODO: return whether word appears anywhere in text\n        return false;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var log = new Log();\n        Console.WriteLine(log.Mentions(\"the cat sat\", \"cat\"));\n    }\n}\n",
      solution: "using System;\n\npublic class Log\n{\n    public bool Mentions(string text, string word)\n    {\n        return text.Contains(word);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var log = new Log();\n        Console.WriteLine(log.Mentions(\"the cat sat\", \"cat\"));\n    }\n}\n"
    },
    {
      example: "public class Template\n{\n    public string Fill(string text)\n    {\n        return text.Replace(\"{name}\", \"friend\");\n    }\n}",
      expected: "dog food",
      requireSource: [
        {
          pattern: /\.Replace\s*\(/,
          message: "Transform the text with `text.Replace(\"cat\", \"dog\")`."
        },
        {
          pattern: /string\s+Swap\s*\(\s*string/,
          message: "Give `Rewriter` a `string Swap(string text)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var r = new Rewriter();\n        System.Console.WriteLine(r.Swap(\"cat toy for cat\"));\n    }\n}\n",
        expected: "dog toy for dog",
        message: "`Swap` must transform the text it is given - `\"cat toy for cat\"` should become `dog toy for dog`, with every `cat` replaced."
      },
      starter: "using System;\n\npublic class Rewriter\n{\n    public string Swap(string text)\n    {\n        // TODO: return text with every \"cat\" replaced by \"dog\"\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var r = new Rewriter();\n        Console.WriteLine(r.Swap(\"cat food\"));\n    }\n}\n",
      solution: "using System;\n\npublic class Rewriter\n{\n    public string Swap(string text)\n    {\n        return text.Replace(\"cat\", \"dog\");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var r = new Rewriter();\n        Console.WriteLine(r.Swap(\"cat food\"));\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "str",
    metaLabel: "Everyday essentials · Strings",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "strings_awarded",
    awardAmount: 20,
  };
})();
