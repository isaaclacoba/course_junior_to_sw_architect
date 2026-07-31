// Unit 2 - "C# up close": Strings (text operations). Write-from-scratch builds.
// Data only: build-engine.js reads window.BUILD_CONFIG (loaded after this file).
// Portable idea: text is a value you can build from parts, reshape, search and
// transform. C# is just the surface we practise it on here.
// Culture-safe: never prints a raw double/decimal; every task prints strings or
// booleans (True/False), and interpolates only strings and ints.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Build text from parts",
      concept: "Assemble a string from values",
      context:
        "Most text you show a user is **built** - a name here, a number there, glued into one line. Instead of joining pieces with `+`, you can drop each value straight into an interpolated string, written `$\"...\"`: inside the quotes, `{name}` and `{legs}` are replaced by those values.\n\nWrite a `Critter` whose `Label(string name, int legs)` builds the line `\"<name> has <legs> legs\"`.",
      example:
        "public class Badge\n{\n    public string Line(string owner, int id)\n    {\n        return $\"{owner} carries badge {id}\";\n    }\n}",
      goal: [
        "Give `Critter` a `string Label(string name, int legs)` that returns `$\"{name} has {legs} legs\"`.",
        "`Main` calls `Label(\"Ant\", 6)`, so the output is `Ant has 6 legs`.",
      ],
      expected: "Ant has 6 legs",
      requireSource: [
        { pattern: /\$"/, message: "Build the line with interpolation: `$\"{name} has {legs} legs\"`." },
        { pattern: /string\s+Label\s*\(\s*string/, message: "Give `Critter` a `string Label(string name, int legs)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var c = new Critter();\n        System.Console.WriteLine(c.Label("Spider", 8));\n    }\n}\n',
        expected: "Spider has 8 legs",
        message: "`Label` must build the line from the values it is given - a spider with 8 legs should read `Spider has 8 legs`, not a fixed animal.",
      },
      starter:
        'using System;\n\npublic class Critter\n{\n    public string Label(string name, int legs)\n    {\n        // TODO: build one line from name and legs, using $"..."\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Critter();\n        Console.WriteLine(c.Label("Ant", 6));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Critter\n{\n    public string Label(string name, int legs)\n    {\n        return $"{name} has {legs} legs";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Critter();\n        Console.WriteLine(c.Label("Ant", 6));\n    }\n}\n',
    },
    {
      title: "Change the case",
      concept: "Reshape text",
      context:
        "Text can be reshaped without changing what it says. Turning every letter to capitals is one such move - handy for a heading, a warning, or matching input where case should not matter. `name.ToUpper()` hands back a new `string` with the same letters in upper case; the original is left untouched.\n\nWrite an `Announcer` whose `Shout(string name)` returns the name in capitals.",
      example:
        "public class Header\n{\n    public string Loud(string word)\n    {\n        return word.ToUpper();\n    }\n}",
      goal: [
        "Give `Announcer` a `string Shout(string name)` that returns `name.ToUpper()`.",
        "`Main` calls `Shout(\"cat\")`, so the output is `CAT`.",
      ],
      expected: "CAT",
      requireSource: [
        { pattern: /\.ToUpper\s*\(\s*\)/, message: "Reshape the text with `name.ToUpper()`." },
        { pattern: /string\s+Shout\s*\(\s*string/, message: "Give `Announcer` a `string Shout(string name)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var a = new Announcer();\n        System.Console.WriteLine(a.Shout("dog"));\n    }\n}\n',
        expected: "DOG",
        message: "`Shout` must reshape the text it is given - `\"dog\"` should come back as `DOG`, not a fixed `CAT`.",
      },
      starter:
        'using System;\n\npublic class Announcer\n{\n    public string Shout(string name)\n    {\n        // TODO: return name with every letter in upper case\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Announcer();\n        Console.WriteLine(a.Shout("cat"));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Announcer\n{\n    public string Shout(string name)\n    {\n        return name.ToUpper();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Announcer();\n        Console.WriteLine(a.Shout("cat"));\n    }\n}\n',
    },
    {
      title: "Search inside text",
      concept: "Ask a string a yes/no question",
      context:
        "Often you do not want to change text - you want to **ask** it something. Does this line contain that word? `text.Contains(word)` answers with a `bool`: `true` if the smaller text appears anywhere inside the larger one, `false` if it does not.\n\nWrite a `Log` whose `Mentions(string text, string word)` says whether the word appears in the text.",
      example:
        "public class Inbox\n{\n    public bool HasTag(string message, string tag)\n    {\n        return message.Contains(tag);\n    }\n}",
      goal: [
        "Give `Log` a `bool Mentions(string text, string word)` that returns `text.Contains(word)`.",
        "`Main` calls `Mentions(\"the cat sat\", \"cat\")`, so the output is `True`.",
      ],
      expected: "True",
      requireSource: [
        { pattern: /\.Contains\s*\(/, message: "Search the text with `text.Contains(word)` - it returns a `bool`." },
        { pattern: /bool\s+Mentions\s*\(\s*string/, message: "Give `Log` a `bool Mentions(string text, string word)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var log = new Log();\n        System.Console.WriteLine(log.Mentions("only dogs here", "cat"));\n    }\n}\n',
        expected: "False",
        message: "`Mentions` must search the text it is given - `\"cat\"` is not in `\"only dogs here\"`, so it should read `False`.",
      },
      starter:
        'using System;\n\npublic class Log\n{\n    public bool Mentions(string text, string word)\n    {\n        // TODO: return whether word appears anywhere in text\n        return false;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var log = new Log();\n        Console.WriteLine(log.Mentions("the cat sat", "cat"));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Log\n{\n    public bool Mentions(string text, string word)\n    {\n        return text.Contains(word);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var log = new Log();\n        Console.WriteLine(log.Mentions("the cat sat", "cat"));\n    }\n}\n',
    },
    {
      title: "Swap part of the text",
      concept: "Transform text into new text",
      context:
        "A transform reads one string and produces a new one with a change applied. Replacing every copy of one word with another is a common one - fixing a typo, masking a name, swapping a placeholder for a real value. `text.Replace(old, new)` returns fresh text with each `old` turned into `new`; the original stays as it was.\n\nWrite a `Rewriter` whose `Swap(string text)` replaces every `\"cat\"` with `\"dog\"`.",
      example:
        "public class Template\n{\n    public string Fill(string text)\n    {\n        return text.Replace(\"{name}\", \"friend\");\n    }\n}",
      goal: [
        "Give `Rewriter` a `string Swap(string text)` that returns `text.Replace(\"cat\", \"dog\")`.",
        "`Main` calls `Swap(\"cat food\")`, so the output is `dog food`.",
      ],
      expected: "dog food",
      requireSource: [
        { pattern: /\.Replace\s*\(/, message: "Transform the text with `text.Replace(\"cat\", \"dog\")`." },
        { pattern: /string\s+Swap\s*\(\s*string/, message: "Give `Rewriter` a `string Swap(string text)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var r = new Rewriter();\n        System.Console.WriteLine(r.Swap("cat toy for cat"));\n    }\n}\n',
        expected: "dog toy for dog",
        message: "`Swap` must transform the text it is given - `\"cat toy for cat\"` should become `dog toy for dog`, with every `cat` replaced.",
      },
      starter:
        'using System;\n\npublic class Rewriter\n{\n    public string Swap(string text)\n    {\n        // TODO: return text with every "cat" replaced by "dog"\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var r = new Rewriter();\n        Console.WriteLine(r.Swap("cat food"));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Rewriter\n{\n    public string Swap(string text)\n    {\n        return text.Replace("cat", "dog");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var r = new Rewriter();\n        Console.WriteLine(r.Swap("cat food"));\n    }\n}\n',
    },
    {
      summary: true,
      title: "What you learned",
      concept: "Text is a value you can work with",
      context: "Four everyday moves on text - the ones you reach for whenever you build, reshape, question or rewrite a line.",
      summaryIntro:
        "Text is not just something you print - it is a value you can build from parts, reshape, search, and transform. You wrote each move by hand:",
      summaryItems: [
        { title: "Build from parts - ", text: "`$\"{name} has {legs} legs\"` drops values straight into the text, instead of gluing pieces with `+`." },
        { title: "Reshape - ", text: "`name.ToUpper()` returns new text with the same letters in a different case; the original is untouched." },
        { title: "Search - ", text: "`text.Contains(word)` answers a yes/no question about text with a `bool`." },
        { title: "Transform - ", text: "`text.Replace(old, new)` reads one string and returns a new one with a change applied." },
      ],
      summaryClose:
        "Each of these returns a value rather than changing the original - the same build, reshape, search and transform moves show up in every language you will meet next.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "str",
    metaLabel: "Everyday essentials \u00b7 Strings",
    progressNoun: "Step",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "strings_awarded",
    awardAmount: 20,
  };
})();
