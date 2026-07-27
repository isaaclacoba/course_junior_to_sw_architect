// Collections - Part three. A code-lab write-and-run build lesson (build-engine.js
// reads window.BUILD_CONFIG). The learner writes and runs the everyday container
// types: List<T> (make, walk, index), a list of your own objects, and
// Dictionary<TKey,TValue> (store, look up, check a key), then a manual tally that
// LINQ later shortens. Animal theme throughout. All outputs are culture-safe
// (ints, text, True/False), so grading is deterministic.
(function () {
  "use strict";

  const CAT = `using System;
using System.Collections.Generic;

public class Cat
{
    public string Name = "";
    public bool KnockedSomethingOver;
}
`;

  const tasks = [
    {
      title: "Make a list",
      concept: "A growable list",
      context:
        "An array has a fixed size. A `List<T>` grows as you add to it. The `<T>` says what it holds:\n\n- `List<string>` - a list of text\n- `List<int>` - a list of whole numbers\n\n`Add` appends one item; `Count` is how many it holds.",
      example:
        'List<int> scores = new List<int>();\nscores.Add(10);\nscores.Add(20);\nConsole.WriteLine(scores.Count);   // 2',
      goal: [
        "Make a `List<string>` called `party`, then `Add` `\"llama\"` and `\"raccoon\"`.",
        "Print `party.Count`. The output should be 2.",
      ],
      expected: "2",
      requireSource: [
        { pattern: /new\s+List<string>/, message: "Create a `List<string>`." },
        { pattern: /\.Add\s*\(/, message: "Use `Add` to put items in the list." },
        { pattern: /\.Count/, message: "Print the list's `Count`, not the literal 2." },
      ],
      starter: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // TODO: make a List<string> called party, Add "llama" and "raccoon",
        // then print party.Count
    }
}
`,
      solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> party = new List<string>();
        party.Add("llama");
        party.Add("raccoon");
        Console.WriteLine(party.Count);
    }
}
`,
    },
    {
      title: "Walk a list with foreach",
      concept: "Visit each item",
      context:
        "`foreach` hands you each item of a list in turn - no index to manage. A list can also be filled inline with `{ ... }` instead of repeated `Add`s.",
      example:
        'List<string> pets = new List<string> { "Rex", "Bo" };\nforeach (string pet in pets)\n{\n    Console.WriteLine(pet);\n}',
      goal: [
        "Walk `pets` with a `foreach` and print `name + \" is here!\"` for each.",
        "The output should be Rex is here!, then Whiskers is here!, then Bubbles is here!.",
      ],
      expected: ["Rex is here!", "Whiskers is here!", "Bubbles is here!"],
      requireSource: [
        { pattern: /\bforeach\b/, message: "Use a `foreach` loop to visit each pet." },
      ],
      starter: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> pets = new List<string> { "Rex", "Whiskers", "Bubbles" };
        // TODO: foreach over pets, printing  name + " is here!"  on each line
    }
}
`,
      solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> pets = new List<string> { "Rex", "Whiskers", "Bubbles" };
        foreach (string name in pets)
        {
            Console.WriteLine(name + " is here!");
        }
    }
}
`,
    },
    {
      title: "Read by position",
      concept: "Index into a list",
      context:
        "Items in a list have a position, counted from `0`. Read one with square brackets:\n\n- `queue[0]` is the first item\n- `queue[queue.Count - 1]` is always the last\n\nThe first index is `0`, not `1`.",
      example:
        'List<string> line = new List<string> { "a", "b", "c" };\nConsole.WriteLine(line[0]);                 // a\nConsole.WriteLine(line[line.Count - 1]);   // c',
      goal: [
        "Print `queue[0] + \" is first\"`, then the last one via `queue[queue.Count - 1] + \" is last\"`.",
        "The output should be Pingu is first, then Waddles is last.",
      ],
      expected: ["Pingu is first", "Waddles is last"],
      requireSource: [
        { pattern: /\[\s*0\s*\]/, message: "Read the first item with `queue[0]`." },
        { pattern: /Count\s*-\s*1/, message: "Read the last item with `queue[queue.Count - 1]`." },
      ],
      starter: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> queue = new List<string> { "Pingu", "Skipper", "Waddles" };
        // TODO: print  queue[0] + " is first"  then  queue[queue.Count - 1] + " is last"
    }
}
`,
      solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> queue = new List<string> { "Pingu", "Skipper", "Waddles" };
        Console.WriteLine(queue[0] + " is first");
        Console.WriteLine(queue[queue.Count - 1] + " is last");
    }
}
`,
    },
    {
      title: "A list of your own objects",
      concept: "A list of objects",
      context:
        "A list can hold your own objects, not just strings. `List<Cat>` holds whole `Cat` objects, each with its own fields. Inside a `foreach`, each `cat` is one object you can read from.",
      example:
        'List<int> ages = new List<int> { 3, 5 };\nforeach (int age in ages)\n{\n    Console.WriteLine(age);\n}',
      goal: [
        "Add two cats: `Mittens` (`KnockedSomethingOver = true`) and `Smudge` (`false`).",
        "`foreach` over them, printing `cat.Name + \" guilty: \" + cat.KnockedSomethingOver`. Output: Mittens guilty: True, then Smudge guilty: False.",
      ],
      expected: ["Mittens guilty: True", "Smudge guilty: False"],
      requireSource: [
        { pattern: /new\s+List<Cat>/, message: "Hold your objects in a `List<Cat>`." },
        { pattern: /\bforeach\b/, message: "Walk the cats with a `foreach`." },
      ],
      starter: CAT + `
class Program
{
    static void Main()
    {
        List<Cat> cats = new List<Cat>();
        // TODO: Add Mittens (KnockedSomethingOver = true) and Smudge (false),
        // then foreach print  cat.Name + " guilty: " + cat.KnockedSomethingOver
    }
}
`,
      solution: CAT + `
class Program
{
    static void Main()
    {
        List<Cat> cats = new List<Cat>();
        cats.Add(new Cat { Name = "Mittens", KnockedSomethingOver = true });
        cats.Add(new Cat { Name = "Smudge", KnockedSomethingOver = false });
        foreach (Cat cat in cats)
        {
            Console.WriteLine(cat.Name + " guilty: " + cat.KnockedSomethingOver);
        }
    }
}
`,
    },
    {
      title: "Look up by key",
      concept: "Dictionary lookup",
      context:
        "A `Dictionary<TKey, TValue>` maps a key to a value. The angle brackets hold two types: the key type, then the value type. `legs[\"puppy\"]` both sets and reads the value for that key.",
      example:
        'Dictionary<string, int> ages = new Dictionary<string, int>();\nages["cat"] = 3;\nConsole.WriteLine(ages["cat"]);   // 3',
      goal: [
        "Make a `Dictionary<string, int>` called `legs`, store `\"puppy\"` = 4 and `\"chicken\"` = 2.",
        "Print `legs[\"puppy\"] + \" legs\"`. The output should be 4 legs.",
      ],
      expected: "4 legs",
      requireSource: [
        { pattern: /new\s+Dictionary<string,\s*int>/, message: "Create a `Dictionary<string, int>`." },
        { pattern: /legs\s*\[\s*"puppy"\s*\]/, message: "Store and read by key: `legs[\"puppy\"]`." },
      ],
      starter: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // TODO: make Dictionary<string, int> legs, store "puppy" = 4 and
        // "chicken" = 2, then print  legs["puppy"] + " legs"
    }
}
`,
      solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Dictionary<string, int> legs = new Dictionary<string, int>();
        legs["puppy"] = 4;
        legs["chicken"] = 2;
        Console.WriteLine(legs["puppy"] + " legs");
    }
}
`,
    },
    {
      title: "Check before you read",
      concept: "Safe lookup",
      context:
        "Reading a key that was never stored fails - there is no value to hand back - so check first. `ContainsKey` returns a `bool`: `true` if the key is there, `false` if not. Guard the lookup with it.",
      example:
        'Dictionary<string, int> ages = new Dictionary<string, int>();\nages["cat"] = 3;\nif (ages.ContainsKey("dog"))\n    Console.WriteLine(ages["dog"]);\nelse\n    Console.WriteLine("unknown");',
      goal: [
        "Use `legs.ContainsKey(\"snake\")` in an `if`: print `legs[\"snake\"] + \" legs\"` when present, otherwise `\"no legs!\"`.",
        "`\"snake\"` was never stored, so the output should be no legs!.",
      ],
      expected: "no legs!",
      requireSource: [
        { pattern: /\.ContainsKey\s*\(/, message: "Guard the lookup with `ContainsKey`." },
      ],
      starter: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Dictionary<string, int> legs = new Dictionary<string, int>();
        legs["puppy"] = 4;
        // TODO: if legs contains "snake", print legs["snake"] + " legs";
        // otherwise print "no legs!"
    }
}
`,
      solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Dictionary<string, int> legs = new Dictionary<string, int>();
        legs["puppy"] = 4;
        if (legs.ContainsKey("snake"))
            Console.WriteLine(legs["snake"] + " legs");
        else
            Console.WriteLine("no legs!");
    }
}
`,
    },
    {
      title: "Count what matches",
      concept: "Tally a list",
      context:
        "Loop a list and tally the items that meet a condition: start a counter at `0`, then raise it inside the loop when the test holds. This is the manual shape; LINQ later does the same in one line.",
      example:
        'List<int> nums = new List<int> { 1, 5, 2, 8 };\nint big = 0;\nforeach (int n in nums)\n{\n    if (n >= 5) big++;\n}\nConsole.WriteLine(big);   // 2',
      goal: [
        "Count the `true` values in `goodBoys` into `int treats`, then print `treats + \" treats for \" + goodBoys.Count + \" dogs\"`.",
        "Three of the four are good boys, so the output should be 3 treats for 4 dogs.",
      ],
      expected: "3 treats for 4 dogs",
      requireSource: [
        { pattern: /\bforeach\b/, message: "Loop the list with a `foreach`." },
        { pattern: /goodBoys\.Count/, message: "Use `goodBoys.Count` for the total." },
      ],
      starter: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<bool> goodBoys = new List<bool> { true, true, false, true };
        // TODO: count the true ones into int treats, then print
        //   treats + " treats for " + goodBoys.Count + " dogs"
    }
}
`,
      solution: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<bool> goodBoys = new List<bool> { true, true, false, true };
        int treats = 0;
        foreach (bool goodBoy in goodBoys)
        {
            if (goodBoy) treats++;
        }
        Console.WriteLine(treats + " treats for " + goodBoys.Count + " dogs");
    }
}
`,
    },
    {
      title: "Collections recap",
      concept: "Recap",
      summary: true,
      summaryIntro:
        "Collections hold many values at once. These are the everyday containers you will reach for.",
      summaryItems: [
        { title: "List<T> - ", text: "a growable, ordered collection; `Add` to it, read `Count`, index with `[i]`." },
        { title: "foreach - ", text: "visit each item in turn, no index needed." },
        { title: "List of objects - ", text: "a list can hold your own types, each with its own fields." },
        { title: "Dictionary<TKey, TValue> - ", text: "map a key to a value and look it up by key." },
        { title: "ContainsKey - ", text: "check a key exists before reading it, to avoid a failure." },
        { title: "Tally with a loop - ", text: "count matches by hand; LINQ will shorten this next." },
      ],
      summaryClose:
        "Next in this track: the data shapes that fill these collections - properties, enums, structs and records.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "col",
    metaLabel: "Know the language \u00b7 Collections",
    progressNoun: "Step",
    awardedKey: "collections_awarded",
    awardAmount: 20,
    tasks,
  };
})();
