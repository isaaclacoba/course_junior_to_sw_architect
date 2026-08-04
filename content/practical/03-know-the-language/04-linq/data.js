// Part three - "LINQ". Write-from-scratch lesson: the learner writes each query
// themselves, runs it through the shared Roslyn host, and matches the output.
// It teaches the everyday LINQ operators as the loop-free way to query the
// collections from earlier lessons: Where, Count, Any, All, Select,
// FirstOrDefault and OrderBy. Lambdas were taught in the previous lesson, so the
// work here is choosing and writing the right operator.
//
// The portable idea is "query a collection without writing a loop"; the operator
// names are the C# surface for it. Data only: the build plugin reads
// window.LESSON_CONFIG. Animal theme throughout; every query runs over a
// `List<Animal>` where each animal has Name and Legs.
(function () {
  "use strict";

  const tasks = [
    {
      example: "List<int> scores = new List<int> { 40, 75, 90, 20 };\n// score => score >= 50 is a lambda - Where runs it on each score\nIEnumerable<int> passing = scores.Where(score => score >= 50); // 75, 90",
      expected: [
        "Dog",
        "Cat"
      ],
      requireSource: [
        {
          pattern: /\.Where\s*\(/,
          message: "Use `Where` to keep only the four-legged animals."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Bee\", Legs = 6 },\n            new Animal { Name = \"Horse\", Legs = 4 },\n            new Animal { Name = \"Cow\", Legs = 4 },\n        };\n        Safari safari = new Safari();\n        foreach (Animal animal in safari.FourLegged(animals))\n            Console.WriteLine(animal.Name);\n    }\n}\n",
        expected: [
          "Horse",
          "Cow"
        ],
        message: "Filter by the real leg count, not a fixed list of names."
      },
      starter: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Safari\n{\n    // Return only the animals that have exactly 4 legs.\n    public IEnumerable<Animal> FourLegged(List<Animal> animals)\n    {\n        // TODO: use Where to keep the animals whose Legs equals 4\n        return animals;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Safari safari = new Safari();\n        foreach (Animal animal in safari.FourLegged(animals))\n            Console.WriteLine(animal.Name);\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Safari\n{\n    public IEnumerable<Animal> FourLegged(List<Animal> animals)\n    {\n        return animals.Where(animal => animal.Legs == 4);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Safari safari = new Safari();\n        foreach (Animal animal in safari.FourLegged(animals))\n            Console.WriteLine(animal.Name);\n    }\n}\n"
    },
    {
      example: "List<int> scores = new List<int> { 40, 75, 90, 20 };\n// Count runs the same kind of lambda and tallies the trues\nint passing = scores.Count(score => score >= 50); // 2",
      expected: "2",
      requireSource: [
        {
          pattern: /\.Count\s*\(/,
          message: "Use `Count` with a rule; do not loop by hand."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Horse\", Legs = 4 },\n            new Animal { Name = \"Cow\", Legs = 4 },\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Bee\", Legs = 6 },\n        };\n        Census census = new Census();\n        Console.WriteLine(census.FourLeggedCount(animals));\n    }\n}\n",
        expected: "3",
        message: "Count from the real list, not a fixed number."
      },
      starter: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Census\n{\n    // Return how many animals have exactly 4 legs.\n    public int FourLeggedCount(List<Animal> animals)\n    {\n        // TODO: use Count with a rule that matches Legs == 4\n        return 0;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Census census = new Census();\n        Console.WriteLine(census.FourLeggedCount(animals));\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Census\n{\n    public int FourLeggedCount(List<Animal> animals)\n    {\n        return animals.Count(animal => animal.Legs == 4);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Census census = new Census();\n        Console.WriteLine(census.FourLeggedCount(animals));\n    }\n}\n"
    },
    {
      example: "List<int> scores = new List<int> { 40, 75, 90, 20 };\n// Any stops at the first score the lambda likes\nbool anyPerfect = scores.Any(score => score >= 100); // false - none matched",
      expected: "True",
      requireSource: [
        {
          pattern: /\.Any\s*\(/,
          message: "Use `Any` to ask whether at least one animal matches."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Watch watch = new Watch();\n        Console.WriteLine(watch.AnyTwoLegged(animals));\n    }\n}\n",
        expected: "False",
        message: "Decide from the real list; here no animal has two legs."
      },
      starter: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Watch\n{\n    // Return whether at least one animal has exactly 2 legs.\n    public bool AnyTwoLegged(List<Animal> animals)\n    {\n        // TODO: use Any with a rule that matches Legs == 2\n        return false;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Watch watch = new Watch();\n        Console.WriteLine(watch.AnyTwoLegged(animals));\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Watch\n{\n    public bool AnyTwoLegged(List<Animal> animals)\n    {\n        return animals.Any(animal => animal.Legs == 2);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Watch watch = new Watch();\n        Console.WriteLine(watch.AnyTwoLegged(animals));\n    }\n}\n"
    },
    {
      example: "List<int> scores = new List<int> { 40, 75, 90, 20 };\n// All needs the lambda true for every score\nbool allPassed = scores.All(score => score >= 50); // false - 40 and 20 fail",
      expected: "True",
      requireSource: [
        {
          pattern: /\.All\s*\(/,
          message: "Use `All` to check that every animal passes the rule."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Horse\", Legs = 4 },\n            new Animal { Name = \"Snake\", Legs = 0 },\n        };\n        Inspection inspection = new Inspection();\n        Console.WriteLine(inspection.AllHaveLegs(animals));\n    }\n}\n",
        expected: "False",
        message: "One legless animal must make the answer False."
      },
      starter: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Inspection\n{\n    // Return whether every animal has more than 0 legs.\n    public bool AllHaveLegs(List<Animal> animals)\n    {\n        // TODO: use All with the rule that every animal must pass: Legs > 0\n        return false;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Inspection inspection = new Inspection();\n        Console.WriteLine(inspection.AllHaveLegs(animals));\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Inspection\n{\n    public bool AllHaveLegs(List<Animal> animals)\n    {\n        return animals.All(animal => animal.Legs > 0);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Inspection inspection = new Inspection();\n        Console.WriteLine(inspection.AllHaveLegs(animals));\n    }\n}\n"
    },
    {
      example: "List<int> scores = new List<int> { 40, 75, 90 };\n// the lambda turns each score into a new value\nIEnumerable<int> doubled = scores.Select(score => score * 2); // 80, 150, 180",
      expected: [
        "Dog",
        "Duck",
        "Cat"
      ],
      requireSource: [
        {
          pattern: /\.Select\s*\(/,
          message: "Use `Select` to turn each animal into its name."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Owl\", Legs = 2 },\n            new Animal { Name = \"Fox\", Legs = 4 },\n        };\n        Roster roster = new Roster();\n        foreach (string name in roster.Names(animals))\n            Console.WriteLine(name);\n    }\n}\n",
        expected: [
          "Owl",
          "Fox"
        ],
        message: "Project the real names, not a fixed list."
      },
      starter: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Roster\n{\n    // Return each animal's name as a sequence of strings.\n    public IEnumerable<string> Names(List<Animal> animals)\n    {\n        // TODO: use Select to turn each animal into its Name\n        return new List<string>();\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Roster roster = new Roster();\n        foreach (string name in roster.Names(animals))\n            Console.WriteLine(name);\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Roster\n{\n    public IEnumerable<string> Names(List<Animal> animals)\n    {\n        return animals.Select(animal => animal.Name);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Roster roster = new Roster();\n        foreach (string name in roster.Names(animals))\n            Console.WriteLine(name);\n    }\n}\n"
    },
    {
      example: "List<int> scores = new List<int> { 40, 75, 90 };\n// the first score the lambda likes, or 0 if none\nint firstPerfect = scores.FirstOrDefault(score => score >= 100); // 0",
      expected: "Duck",
      requireSource: [
        {
          pattern: /\.FirstOrDefault\s*\(/,
          message: "Use `FirstOrDefault` so a missing match returns a default instead of throwing."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Finder finder = new Finder();\n        Animal? bird = finder.FirstTwoLegged(animals);\n        Console.WriteLine(bird == null ? \"none\" : bird.Name);\n    }\n}\n",
        expected: "none",
        message: "When nothing matches, FirstOrDefault should return the default so Main prints none."
      },
      starter: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Finder\n{\n    // Return the first animal with exactly 2 legs, or the default if there is none.\n    public Animal? FirstTwoLegged(List<Animal> animals)\n    {\n        // TODO: use FirstOrDefault with a rule that matches Legs == 2\n        return null;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Finder finder = new Finder();\n        Animal? bird = finder.FirstTwoLegged(animals);\n        Console.WriteLine(bird == null ? \"none\" : bird.Name);\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Finder\n{\n    public Animal? FirstTwoLegged(List<Animal> animals)\n    {\n        return animals.FirstOrDefault(animal => animal.Legs == 2);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Finder finder = new Finder();\n        Animal? bird = finder.FirstTwoLegged(animals);\n        Console.WriteLine(bird == null ? \"none\" : bird.Name);\n    }\n}\n"
    },
    {
      example: "List<int> scores = new List<int> { 90, 20, 75 };\n// the lambda picks the value to sort on\nIEnumerable<int> sorted = scores.OrderBy(score => score); // 20, 75, 90",
      expected: [
        "Cat",
        "Dog",
        "Duck"
      ],
      requireSource: [
        {
          pattern: /\.OrderBy\s*\(/,
          message: "Use `OrderBy` to sort the animals by name."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Zebra\", Legs = 4 },\n            new Animal { Name = \"Ant\", Legs = 6 },\n            new Animal { Name = \"Mule\", Legs = 4 },\n        };\n        Lineup lineup = new Lineup();\n        foreach (Animal animal in lineup.ByName(animals))\n            Console.WriteLine(animal.Name);\n    }\n}\n",
        expected: [
          "Ant",
          "Mule",
          "Zebra"
        ],
        message: "Sort by the real names, not a fixed order."
      },
      starter: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Lineup\n{\n    // Return the animals ordered alphabetically by Name.\n    public IEnumerable<Animal> ByName(List<Animal> animals)\n    {\n        // TODO: use OrderBy to sort the animals by Name\n        return animals;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Lineup lineup = new Lineup();\n        foreach (Animal animal in lineup.ByName(animals))\n            Console.WriteLine(animal.Name);\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic class Animal\n{\n    public string Name = \"\";\n    public int Legs;\n}\n\npublic class Lineup\n{\n    public IEnumerable<Animal> ByName(List<Animal> animals)\n    {\n        return animals.OrderBy(animal => animal.Name);\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Animal> animals = new List<Animal>\n        {\n            new Animal { Name = \"Dog\", Legs = 4 },\n            new Animal { Name = \"Duck\", Legs = 2 },\n            new Animal { Name = \"Cat\", Legs = 4 },\n        };\n        Lineup lineup = new Lineup();\n        foreach (Animal animal in lineup.ByName(animals))\n            Console.WriteLine(animal.Name);\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "lq",
    metaLabel: "Know the language · LINQ",
    progressNoun: "Query",
    awardedKey: "linq_awarded",
    awardAmount: 20,
    tasks,
  };
})();
