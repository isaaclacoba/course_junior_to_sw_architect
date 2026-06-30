// Part four - "Why objects?" (encapsulation). Write-from-scratch builds, same
// engine and style as First Builds / Data shapes. It answers the junior's
// question: why classes and methods at all - why not one big monolithic Main?
// The five tasks build the answer by feel: group related data, put the behaviour
// next to it, hide the inside, guard a rule, then change that rule in one place.
// Each task is graded so the concept is unavoidable - a verify probe re-runs the
// learner's type with different values, so a hardcoded answer fails.
// Data only: build-engine.js reads window.BUILD_CONFIG. Animal flavour throughout.
(function () {
  "use strict";

  const tasks = [
    {
      title: "Keep related data together",
      concept: "Group state",
      context:
        "In one big `Main`, a cat's name and whether it knocked something over are two loose variables. Nothing keeps them in step - it is easy to print one cat's name next to another cat's mischief. A `class` ties related data into one thing that travels together. Give `Cat` a `Name` and a `KnockedSomethingOver` so they cannot drift apart.",
      example:
        'public class Dog\n{\n    public string Name = "";\n    public int Legs;\n}\n\nvar d = new Dog { Name = "Rex", Legs = 4 };',
      goal: [
        "Give `Cat` a `Name` (string) and a `KnockedSomethingOver` (bool).",
        "Main builds Mittens, who did knock something over, so the output is Mittens: True.",
      ],
      expected: "Mittens: True",
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Smudge", KnockedSomethingOver = false };\n        Console.WriteLine(c.Name + ": " + c.KnockedSomethingOver);\n    }\n}\n',
        expected: "Smudge: False",
        message: "Mittens: True is right for that one cat only. Cat must hold whatever Name and flag it is given.",
      },
      starter:
        'using System;\n\npublic class Cat\n{\n    // TODO: add a Name (string) and a KnockedSomethingOver (bool) so they travel together\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Mittens", KnockedSomethingOver = true };\n        Console.WriteLine(c.Name + ": " + c.KnockedSomethingOver);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Name = "";\n    public bool KnockedSomethingOver;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Mittens", KnockedSomethingOver = true };\n        Console.WriteLine(c.Name + ": " + c.KnockedSomethingOver);\n    }\n}\n',
    },
    {
      title: "Put the behaviour next to the data",
      concept: "Behaviour with state",
      context:
        "In a monolith, the rule for turning that flag into a verdict floats somewhere far from the cat it talks about. An object keeps the behaviour beside the state it needs. Give `Cat` a `Verdict()` method, so the cat that knows what it did also knows how to own up to it.",
      example:
        'public class Dog\n{\n    public string Name = "";\n    public string Greet() => Name + " says woof";\n}',
      goal: [
        "Add a `Verdict()` that returns `Name + \": guilty\"` when `KnockedSomethingOver`, otherwise `Name + \": innocent\"`.",
        "Main judges Mittens, who is guilty, so the output is Mittens: guilty.",
      ],
      expected: "Mittens: guilty",
      requireSource: [
        { pattern: /string\s+Verdict\s*\(/, message: "Add a `Verdict()` method that returns a string." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Smudge", KnockedSomethingOver = false };\n        Console.WriteLine(c.Verdict());\n    }\n}\n',
        expected: "Smudge: innocent",
        message: "Mittens: guilty is right for a guilty cat only. Decide the verdict from the flag, do not hardcode it.",
      },
      starter:
        'using System;\n\npublic class Cat\n{\n    public string Name = "";\n    public bool KnockedSomethingOver;\n\n    // TODO: add a Verdict() that gives the name plus whether the cat is guilty or innocent\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Mittens", KnockedSomethingOver = true };\n        Console.WriteLine(c.Verdict());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Name = "";\n    public bool KnockedSomethingOver;\n\n    public string Verdict()\n    {\n        return Name + ": " + (KnockedSomethingOver ? "guilty" : "innocent");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var c = new Cat { Name = "Mittens", KnockedSomethingOver = true };\n        Console.WriteLine(c.Verdict());\n    }\n}\n',
    },
    {
      title: "Hide the inside",
      concept: "private state",
      context:
        "If the treat count is a public field, any line anywhere can set it to nonsense, and a missing treat could come from anywhere. So the count is kept `private` - only the jar can touch it - with a read-only `Treats` to peek at it. Both are written for you; read them, then write the one method allowed to change the count.",
      example:
        'public class Clicks\n{\n    private int _n;\n    public int Count => _n;\n    public void Click() => _n++;\n}',
      goal: [
        "The `private` count and the read-only `Treats` are already written - leave them as they are.",
        "Make `Give(bool goodBoy)` add one to the count only when `goodBoy` is true.",
        "Main gives to true, true, false, so the output is 2.",
      ],
      expected: "2",
      requireSource: [
        { pattern: /private/, message: "Keep the count `private` so only TreatJar can change it." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var jar = new TreatJar();\n        jar.Give(true);\n        jar.Give(false);\n        jar.Give(true);\n        jar.Give(true);\n        Console.WriteLine(jar.Treats);\n    }\n}\n',
        expected: "3",
        message: "2 is right for the first example only. Count the good boys you are actually given.",
      },
      starter:
        'using System;\n\npublic class TreatJar\n{\n    private int _treats = 0;        // hidden inside - only TreatJar can change it\n    public int Treats => _treats;   // a read-only view: the outside can look, not touch\n\n    // TODO: add one treat only when goodBoy is true\n    public void Give(bool goodBoy)\n    {\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var jar = new TreatJar();\n        jar.Give(true);\n        jar.Give(true);\n        jar.Give(false);\n        Console.WriteLine(jar.Treats);\n    }\n}\n',
      solution:
        'using System;\n\npublic class TreatJar\n{\n    private int _treats;\n    public int Treats => _treats;\n\n    public void Give(bool goodBoy)\n    {\n        if (goodBoy) _treats++;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var jar = new TreatJar();\n        jar.Give(true);\n        jar.Give(true);\n        jar.Give(false);\n        Console.WriteLine(jar.Treats);\n    }\n}\n',
    },
    {
      title: "Guard the rule",
      concept: "Protect an invariant",
      context:
        "Hiding the field is not enough on its own. The one method allowed to change it can also defend it. A food bowl must never go down because someone tipped in a silly amount. `Fill` adds the scoops only when the number is positive, so a negative or zero is quietly ignored. The bowl keeps itself sensible no matter who calls it.",
      example:
        'public class Jar\n{\n    private int _treats;\n    public int Treats => _treats;\n    public void Add(int n) { if (n > 0) _treats += n; }\n}',
      goal: [
        "Make `Fill(int scoops)` add `scoops` to the bowl, but ignore amounts of 0 or less.",
        "Main fills 10, then -5 (ignored), then 3, so the output is 13.",
      ],
      expected: "13",
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var bowl = new Bowl();\n        bowl.Fill(100);\n        bowl.Fill(-1);\n        bowl.Fill(0);\n        bowl.Fill(50);\n        Console.WriteLine(bowl.Food);\n    }\n}\n',
        expected: "150",
        message: "13 is right for the first example only. Add every positive amount and ignore the rest.",
      },
      starter:
        'using System;\n\npublic class Bowl\n{\n    private int _food;\n    public int Food => _food;\n\n    // TODO: add scoops to the bowl, but ignore amounts of 0 or less\n    public void Fill(int scoops)\n    {\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var bowl = new Bowl();\n        bowl.Fill(10);\n        bowl.Fill(-5);   // nonsense - must be ignored\n        bowl.Fill(3);\n        Console.WriteLine(bowl.Food);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Bowl\n{\n    private int _food;\n    public int Food => _food;\n\n    public void Fill(int scoops)\n    {\n        if (scoops > 0) _food += scoops;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var bowl = new Bowl();\n        bowl.Fill(10);\n        bowl.Fill(-5);   // nonsense - must be ignored\n        bowl.Fill(3);\n        Console.WriteLine(bowl.Food);\n    }\n}\n',
    },
    {
      title: "Change it in one place",
      concept: "One reason to change",
      context:
        "The whole program judges cats through `Cat.Verdict()`. Change the wording in that one method and every cat follows - no hunting through a giant `Main` for each spot. Reword the verdict from guilty/innocent to `naughty`/`good`, editing only `Verdict`.",
      example:
        "// One method, every cat. Edit the rule once:\n// return Name + (KnockedSomethingOver ? \" naughty\" : \" good\");",
      goal: [
        "Make `Verdict()` return `Name + \": naughty\"` when `KnockedSomethingOver`, otherwise `Name + \": good\"`.",
        "Main judges a guilty cat and an innocent one, so the output is two lines: Mittens: naughty then Smudge: good.",
      ],
      expected: ["Mittens: naughty", "Smudge: good"],
      requireSource: [
        { pattern: /string\s+Verdict\s*\(/, message: "Keep the wording inside the one `Verdict()` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var a = new Cat { Name = "Whiskers", KnockedSomethingOver = true };\n        var b = new Cat { Name = "Bubbles", KnockedSomethingOver = false };\n        var c = new Cat { Name = "Pumpkin", KnockedSomethingOver = true };\n        Console.WriteLine(a.Verdict());\n        Console.WriteLine(b.Verdict());\n        Console.WriteLine(c.Verdict());\n    }\n}\n',
        expected: ["Whiskers: naughty", "Bubbles: good", "Pumpkin: naughty"],
        message: "Right for the first two only. The one Verdict rule must serve every cat.",
      },
      starter:
        'using System;\n\npublic class Cat\n{\n    public string Name = "";\n    public bool KnockedSomethingOver;\n\n    // The whole program judges cats through this one method. Change the wording here.\n    public string Verdict()\n    {\n        // TODO: build the verdict from the name - naughty if it knocked something over, good if not\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Cat { Name = "Mittens", KnockedSomethingOver = true };\n        var b = new Cat { Name = "Smudge", KnockedSomethingOver = false };\n        Console.WriteLine(a.Verdict());\n        Console.WriteLine(b.Verdict());\n    }\n}\n',
      solution:
        'using System;\n\npublic class Cat\n{\n    public string Name = "";\n    public bool KnockedSomethingOver;\n\n    public string Verdict()\n    {\n        return Name + ": " + (KnockedSomethingOver ? "naughty" : "good");\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var a = new Cat { Name = "Mittens", KnockedSomethingOver = true };\n        var b = new Cat { Name = "Smudge", KnockedSomethingOver = false };\n        Console.WriteLine(a.Verdict());\n        Console.WriteLine(b.Verdict());\n    }\n}\n',
    },
    {
      summary: true,
      title: "Why objects? - recap",
      concept: "Recap",
      context: "That is why we bother with classes and methods instead of one long `Main`.",
      summaryIntro:
        "Objects exist so related data and the rules that guard it live together, instead of being scattered through one giant Main.",
      summaryItems: [
        { title: "Group state - ", text: "a `class` keeps related data together as one thing that travels as a unit." },
        { title: "Behaviour with state - ", text: "put a method next to the data it works on, so the thing that knows also knows how to act." },
        { title: "private - ", text: "hide a field so only the class can change it; expose a read-only view to look without touching." },
        { title: "Guard the rule - ", text: "the one method allowed to write can reject nonsense, keeping the object always valid." },
        { title: "One reason to change - ", text: "fix a rule once inside the object and every caller follows." },
      ],
      summaryClose: "Next: Why abstract? - pulling logic behind an interface.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "enc",
    metaLabel: "Build with objects \u00b7 Why objects",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "encapsulation_awarded",
    awardAmount: 25,
  };
})();
