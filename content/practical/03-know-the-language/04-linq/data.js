// Part three - "LINQ". Write-from-scratch lesson: the learner writes each query
// themselves, runs it through the shared Roslyn host, and matches the output.
// It teaches the everyday LINQ operators as the loop-free way to query the
// collections from earlier lessons: Where, Count, Any, All, Select,
// FirstOrDefault and OrderBy. Lambdas were taught in the previous lesson, so the
// work here is choosing and writing the right operator.
//
// The portable idea is "query a collection without writing a loop"; the operator
// names are the C# surface for it. Data only: build-engine.js reads
// window.BUILD_CONFIG. Animal theme throughout; every query runs over a
// `List<Animal>` where each animal has Name and Legs.
(function () {
  "use strict";

  const ANIMAL = `using System;
using System.Collections.Generic;
using System.Linq;

public class Animal
{
    public string Name = "";
    public int Legs;
}
`;

  const tasks = [
    {
      title: "Keep only what matches: Where",
      concept: "Where",
      context:
        "Filtering means keeping only the items that pass a test. `Where` takes a lambda - the short inline rule you wrote in the Lambdas lesson. Here `animal => animal.Legs == 4` reads \"for each animal, is its Legs equal to 4?\". `Where` runs that lambda on every animal and hands back a new sequence of the ones it said true for - no loop to write.",
      example:
        "List<int> scores = new List<int> { 40, 75, 90, 20 };\n// score => score >= 50 is a lambda - Where runs it on each score\nIEnumerable<int> passing = scores.Where(score => score >= 50); // 75, 90",
      goal: [
        "In `FourLegged`, return only the animals whose `Legs` equals 4.",
        "`Main` prints each survivor's name, so the output should be Dog then Cat.",
      ],
      expected: ["Dog", "Cat"],
      requireSource: [
        { pattern: /\.Where\s*\(/, message: "Use `Where` to keep only the four-legged animals." },
      ],
      verify: {
        main: `class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Bee", Legs = 6 },
            new Animal { Name = "Horse", Legs = 4 },
            new Animal { Name = "Cow", Legs = 4 },
        };
        Safari safari = new Safari();
        foreach (Animal animal in safari.FourLegged(animals))
            Console.WriteLine(animal.Name);
    }
}
`,
        expected: ["Horse", "Cow"],
        message: "Filter by the real leg count, not a fixed list of names.",
      },
      starter: ANIMAL + `
public class Safari
{
    // Return only the animals that have exactly 4 legs.
    public IEnumerable<Animal> FourLegged(List<Animal> animals)
    {
        // TODO: use Where to keep the animals whose Legs equals 4
        return animals;
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Safari safari = new Safari();
        foreach (Animal animal in safari.FourLegged(animals))
            Console.WriteLine(animal.Name);
    }
}
`,
      solution: ANIMAL + `
public class Safari
{
    public IEnumerable<Animal> FourLegged(List<Animal> animals)
    {
        return animals.Where(animal => animal.Legs == 4);
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Safari safari = new Safari();
        foreach (Animal animal in safari.FourLegged(animals))
            Console.WriteLine(animal.Name);
    }
}
`,
    },
    {
      title: "How many match: Count",
      concept: "Count",
      context:
        "`Count` does the start-at-zero, loop, check, add-one tally for you. Give it a lambda and it returns how many items passed - a plain number.",
      example:
        "List<int> scores = new List<int> { 40, 75, 90, 20 };\n// Count runs the same kind of lambda and tallies the trues\nint passing = scores.Count(score => score >= 50); // 2",
      goal: [
        "In `FourLeggedCount`, return how many animals have exactly 4 legs.",
        "`Main` prints the number, so the output should be 2.",
      ],
      expected: "2",
      requireSource: [
        { pattern: /\.Count\s*\(/, message: "Use `Count` with a rule; do not loop by hand." },
      ],
      verify: {
        main: `class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Horse", Legs = 4 },
            new Animal { Name = "Cow", Legs = 4 },
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Bee", Legs = 6 },
        };
        Census census = new Census();
        Console.WriteLine(census.FourLeggedCount(animals));
    }
}
`,
        expected: "3",
        message: "Count from the real list, not a fixed number.",
      },
      starter: ANIMAL + `
public class Census
{
    // Return how many animals have exactly 4 legs.
    public int FourLeggedCount(List<Animal> animals)
    {
        // TODO: use Count with a rule that matches Legs == 4
        return 0;
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Census census = new Census();
        Console.WriteLine(census.FourLeggedCount(animals));
    }
}
`,
      solution: ANIMAL + `
public class Census
{
    public int FourLeggedCount(List<Animal> animals)
    {
        return animals.Count(animal => animal.Legs == 4);
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Census census = new Census();
        Console.WriteLine(census.FourLeggedCount(animals));
    }
}
`,
    },
    {
      title: "Is there at least one: Any",
      concept: "Any",
      context:
        "Sometimes you only need a yes or no: is there at least one item that matches? You give `Any` a lambda; it returns a `bool` and stops the moment one item makes it true.",
      example:
        "List<int> scores = new List<int> { 40, 75, 90, 20 };\n// Any stops at the first score the lambda likes\nbool anyPerfect = scores.Any(score => score >= 100); // false - none matched",
      goal: [
        "In `AnyTwoLegged`, return whether any animal has exactly 2 legs.",
        "`Main` prints True or False, so the output should be True.",
      ],
      expected: "True",
      requireSource: [
        { pattern: /\.Any\s*\(/, message: "Use `Any` to ask whether at least one animal matches." },
      ],
      verify: {
        main: `class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Watch watch = new Watch();
        Console.WriteLine(watch.AnyTwoLegged(animals));
    }
}
`,
        expected: "False",
        message: "Decide from the real list; here no animal has two legs.",
      },
      starter: ANIMAL + `
public class Watch
{
    // Return whether at least one animal has exactly 2 legs.
    public bool AnyTwoLegged(List<Animal> animals)
    {
        // TODO: use Any with a rule that matches Legs == 2
        return false;
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Watch watch = new Watch();
        Console.WriteLine(watch.AnyTwoLegged(animals));
    }
}
`,
      solution: ANIMAL + `
public class Watch
{
    public bool AnyTwoLegged(List<Animal> animals)
    {
        return animals.Any(animal => animal.Legs == 2);
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Watch watch = new Watch();
        Console.WriteLine(watch.AnyTwoLegged(animals));
    }
}
`,
    },
    {
      title: "Do they all match: All",
      concept: "All",
      context:
        "`All` checks the whole sequence: it returns true only when every item passes the lambda. A single failure makes it false.",
      example:
        "List<int> scores = new List<int> { 40, 75, 90, 20 };\n// All needs the lambda true for every score\nbool allPassed = scores.All(score => score >= 50); // false - 40 and 20 fail",
      goal: [
        "In `AllHaveLegs`, return whether every animal has more than 0 legs.",
        "`Main` prints True or False, so the output should be True.",
      ],
      expected: "True",
      requireSource: [
        { pattern: /\.All\s*\(/, message: "Use `All` to check that every animal passes the rule." },
      ],
      verify: {
        main: `class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Horse", Legs = 4 },
            new Animal { Name = "Snake", Legs = 0 },
        };
        Inspection inspection = new Inspection();
        Console.WriteLine(inspection.AllHaveLegs(animals));
    }
}
`,
        expected: "False",
        message: "One legless animal must make the answer False.",
      },
      starter: ANIMAL + `
public class Inspection
{
    // Return whether every animal has more than 0 legs.
    public bool AllHaveLegs(List<Animal> animals)
    {
        // TODO: use All with the rule that every animal must pass: Legs > 0
        return false;
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Inspection inspection = new Inspection();
        Console.WriteLine(inspection.AllHaveLegs(animals));
    }
}
`,
      solution: ANIMAL + `
public class Inspection
{
    public bool AllHaveLegs(List<Animal> animals)
    {
        return animals.All(animal => animal.Legs > 0);
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Inspection inspection = new Inspection();
        Console.WriteLine(inspection.AllHaveLegs(animals));
    }
}
`,
    },
    {
      title: "Turn each into something else: Select",
      concept: "Select",
      context:
        "`Select` reshapes a sequence: it runs a lambda on every item and collects the results. Often you use it to pull out one field - from a sequence of animals to a sequence of just their names.",
      example:
        "List<int> scores = new List<int> { 40, 75, 90 };\n// the lambda turns each score into a new value\nIEnumerable<int> doubled = scores.Select(score => score * 2); // 80, 150, 180",
      goal: [
        "In `Names`, return each animal's `Name` as a sequence of strings.",
        "`Main` prints each name, so the output should be Dog, Duck, Cat.",
      ],
      expected: ["Dog", "Duck", "Cat"],
      requireSource: [
        { pattern: /\.Select\s*\(/, message: "Use `Select` to turn each animal into its name." },
      ],
      verify: {
        main: `class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Owl", Legs = 2 },
            new Animal { Name = "Fox", Legs = 4 },
        };
        Roster roster = new Roster();
        foreach (string name in roster.Names(animals))
            Console.WriteLine(name);
    }
}
`,
        expected: ["Owl", "Fox"],
        message: "Project the real names, not a fixed list.",
      },
      starter: ANIMAL + `
public class Roster
{
    // Return each animal's name as a sequence of strings.
    public IEnumerable<string> Names(List<Animal> animals)
    {
        // TODO: use Select to turn each animal into its Name
        return new List<string>();
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Roster roster = new Roster();
        foreach (string name in roster.Names(animals))
            Console.WriteLine(name);
    }
}
`,
      solution: ANIMAL + `
public class Roster
{
    public IEnumerable<string> Names(List<Animal> animals)
    {
        return animals.Select(animal => animal.Name);
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Roster roster = new Roster();
        foreach (string name in roster.Names(animals))
            Console.WriteLine(name);
    }
}
`,
    },
    {
      title: "The first match, or nothing: FirstOrDefault",
      concept: "FirstOrDefault",
      context:
        "`FirstOrDefault` hands you the first item that matches your rule - and when nothing matches, it gives back a default instead of a match (for an object that default is `null`, a value meaning \"nothing here\"). Reach for it whenever a match might not exist; `Main` here already checks for that default.",
      example:
        "List<int> scores = new List<int> { 40, 75, 90 };\n// the first score the lambda likes, or 0 if none\nint firstPerfect = scores.FirstOrDefault(score => score >= 100); // 0",
      goal: [
        "In `FirstTwoLegged`, return the first animal with exactly 2 legs, or the default if there is none.",
        "`Main` prints the found animal's name, so the output should be Duck.",
      ],
      expected: "Duck",
      requireSource: [
        { pattern: /\.FirstOrDefault\s*\(/, message: "Use `FirstOrDefault` so a missing match returns a default instead of throwing." },
      ],
      verify: {
        main: `class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Finder finder = new Finder();
        Animal? bird = finder.FirstTwoLegged(animals);
        Console.WriteLine(bird == null ? "none" : bird.Name);
    }
}
`,
        expected: "none",
        message: "When nothing matches, FirstOrDefault should return the default so Main prints none.",
      },
      starter: ANIMAL + `
public class Finder
{
    // Return the first animal with exactly 2 legs, or the default if there is none.
    public Animal? FirstTwoLegged(List<Animal> animals)
    {
        // TODO: use FirstOrDefault with a rule that matches Legs == 2
        return null;
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Finder finder = new Finder();
        Animal? bird = finder.FirstTwoLegged(animals);
        Console.WriteLine(bird == null ? "none" : bird.Name);
    }
}
`,
      solution: ANIMAL + `
public class Finder
{
    public Animal? FirstTwoLegged(List<Animal> animals)
    {
        return animals.FirstOrDefault(animal => animal.Legs == 2);
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Finder finder = new Finder();
        Animal? bird = finder.FirstTwoLegged(animals);
        Console.WriteLine(bird == null ? "none" : bird.Name);
    }
}
`,
    },
    {
      title: "Sort by a key: OrderBy",
      concept: "OrderBy",
      context:
        "`OrderBy` returns the same items in a new order, sorted by whatever the lambda picks out. Pick the name and they come out alphabetically; pick the leg count and they come out smallest first.",
      example:
        "List<int> scores = new List<int> { 90, 20, 75 };\n// the lambda picks the value to sort on\nIEnumerable<int> sorted = scores.OrderBy(score => score); // 20, 75, 90",
      goal: [
        "In `ByName`, return the animals ordered alphabetically by `Name`.",
        "`Main` prints each name, so the output should be Cat, Dog, Duck.",
      ],
      expected: ["Cat", "Dog", "Duck"],
      requireSource: [
        { pattern: /\.OrderBy\s*\(/, message: "Use `OrderBy` to sort the animals by name." },
      ],
      verify: {
        main: `class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Zebra", Legs = 4 },
            new Animal { Name = "Ant", Legs = 6 },
            new Animal { Name = "Mule", Legs = 4 },
        };
        Lineup lineup = new Lineup();
        foreach (Animal animal in lineup.ByName(animals))
            Console.WriteLine(animal.Name);
    }
}
`,
        expected: ["Ant", "Mule", "Zebra"],
        message: "Sort by the real names, not a fixed order.",
      },
      starter: ANIMAL + `
public class Lineup
{
    // Return the animals ordered alphabetically by Name.
    public IEnumerable<Animal> ByName(List<Animal> animals)
    {
        // TODO: use OrderBy to sort the animals by Name
        return animals;
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Lineup lineup = new Lineup();
        foreach (Animal animal in lineup.ByName(animals))
            Console.WriteLine(animal.Name);
    }
}
`,
      solution: ANIMAL + `
public class Lineup
{
    public IEnumerable<Animal> ByName(List<Animal> animals)
    {
        return animals.OrderBy(animal => animal.Name);
    }
}

class Program
{
    static void Main()
    {
        List<Animal> animals = new List<Animal>
        {
            new Animal { Name = "Dog", Legs = 4 },
            new Animal { Name = "Duck", Legs = 2 },
            new Animal { Name = "Cat", Legs = 4 },
        };
        Lineup lineup = new Lineup();
        foreach (Animal animal in lineup.ByName(animals))
            Console.WriteLine(animal.Name);
    }
}
`,
    },
    {
      title: "LINQ recap",
      concept: "Recap",
      summary: true,
      summaryIntro:
        "Each LINQ operator takes a rule (a lambda) and answers one kind of question about a sequence. Reach for the one that matches what you want back.",
      summaryItems: [
        { title: "Where - ", text: "keep only the items that match; returns a filtered sequence." },
        { title: "Count - ", text: "how many items match; returns a number." },
        { title: "Any - ", text: "is there at least one match; returns a `bool`." },
        { title: "All - ", text: "do all items match; returns a `bool`." },
        { title: "Select - ", text: "turn each item into something else; returns a reshaped sequence." },
        { title: "FirstOrDefault - ", text: "the first match, or a default (like `null`) if there is none." },
        { title: "OrderBy - ", text: "sort the items by the value the rule picks." },
      ],
      summaryClose:
        "Next in this track: errors and null - handling the cases where things go wrong or a value is missing.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "lq",
    metaLabel: "Know the language \u00b7 LINQ",
    progressNoun: "Query",
    awardedKey: "linq_awarded",
    awardAmount: 20,
    tasks,
  };
})();
