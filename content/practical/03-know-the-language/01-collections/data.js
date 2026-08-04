// Collections - Part three. A code-lab write-and-run build lesson (build-engine.js
// reads window.LESSON_CONFIG). The learner writes and runs the everyday container
// types: List<T> (make, walk, index), a list of your own objects, and
// Dictionary<TKey,TValue> (store, look up, check a key), then a manual tally that
// LINQ later shortens. Animal theme throughout. All outputs are culture-safe
// (ints, text, True/False), so grading is deterministic.
(function () {
  "use strict";

  const tasks = [
    {
      example: "List<int> scores = new List<int>();\nscores.Add(10);\nscores.Add(20);\nConsole.WriteLine(scores.Count);   // 2",
      expected: "2",
      requireSource: [
        {
          pattern: /new\s+List<string>/,
          message: "Create a `List<string>`."
        },
        {
          pattern: /\.Add\s*\(/,
          message: "Use `Add` to put items in the list."
        },
        {
          pattern: /\.Count/,
          message: "Print the list's `Count`, not the literal 2."
        }
      ],
      starter: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: make a List<string> called party, Add \"llama\" and \"raccoon\",\n        // then print party.Count\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        List<string> party = new List<string>();\n        party.Add(\"llama\");\n        party.Add(\"raccoon\");\n        Console.WriteLine(party.Count);\n    }\n}\n"
    },
    {
      example: "List<string> pets = new List<string> { \"Rex\", \"Bo\" };\nforeach (string pet in pets)\n{\n    Console.WriteLine(pet);\n}",
      expected: [
        "Rex is here!",
        "Whiskers is here!",
        "Bubbles is here!"
      ],
      requireSource: [
        {
          pattern: /\bforeach\b/,
          message: "Use a `foreach` loop to visit each pet."
        }
      ],
      starter: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        List<string> pets = new List<string> { \"Rex\", \"Whiskers\", \"Bubbles\" };\n        // TODO: foreach over pets, printing  name + \" is here!\"  on each line\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        List<string> pets = new List<string> { \"Rex\", \"Whiskers\", \"Bubbles\" };\n        foreach (string name in pets)\n        {\n            Console.WriteLine(name + \" is here!\");\n        }\n    }\n}\n"
    },
    {
      example: "List<string> line = new List<string> { \"a\", \"b\", \"c\" };\nConsole.WriteLine(line[0]);                 // a\nConsole.WriteLine(line[line.Count - 1]);   // c",
      expected: [
        "Pingu is first",
        "Waddles is last"
      ],
      requireSource: [
        {
          pattern: /\[\s*0\s*\]/,
          message: "Read the first item with `queue[0]`."
        },
        {
          pattern: /Count\s*-\s*1/,
          message: "Read the last item with `queue[queue.Count - 1]`."
        }
      ],
      starter: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        List<string> queue = new List<string> { \"Pingu\", \"Skipper\", \"Waddles\" };\n        // TODO: print  queue[0] + \" is first\"  then  queue[queue.Count - 1] + \" is last\"\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        List<string> queue = new List<string> { \"Pingu\", \"Skipper\", \"Waddles\" };\n        Console.WriteLine(queue[0] + \" is first\");\n        Console.WriteLine(queue[queue.Count - 1] + \" is last\");\n    }\n}\n"
    },
    {
      example: "List<int> ages = new List<int> { 3, 5 };\nforeach (int age in ages)\n{\n    Console.WriteLine(age);\n}",
      expected: [
        "Mittens guilty: True",
        "Smudge guilty: False"
      ],
      requireSource: [
        {
          pattern: /new\s+List<Cat>/,
          message: "Hold your objects in a `List<Cat>`."
        },
        {
          pattern: /\bforeach\b/,
          message: "Walk the cats with a `foreach`."
        }
      ],
      starter: "using System;\nusing System.Collections.Generic;\n\npublic class Cat\n{\n    public string Name = \"\";\n    public bool KnockedSomethingOver;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Cat> cats = new List<Cat>();\n        // TODO: Add Mittens (KnockedSomethingOver = true) and Smudge (false),\n        // then foreach print  cat.Name + \" guilty: \" + cat.KnockedSomethingOver\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\npublic class Cat\n{\n    public string Name = \"\";\n    public bool KnockedSomethingOver;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        List<Cat> cats = new List<Cat>();\n        cats.Add(new Cat { Name = \"Mittens\", KnockedSomethingOver = true });\n        cats.Add(new Cat { Name = \"Smudge\", KnockedSomethingOver = false });\n        foreach (Cat cat in cats)\n        {\n            Console.WriteLine(cat.Name + \" guilty: \" + cat.KnockedSomethingOver);\n        }\n    }\n}\n"
    },
    {
      example: "Dictionary<string, int> ages = new Dictionary<string, int>();\nages[\"cat\"] = 3;\nConsole.WriteLine(ages[\"cat\"]);   // 3",
      expected: "4 legs",
      requireSource: [
        {
          pattern: /new\s+Dictionary<string,\s*int>/,
          message: "Create a `Dictionary<string, int>`."
        },
        {
          pattern: /legs\s*\[\s*"puppy"\s*\]/,
          message: "Store and read by key: `legs[\"puppy\"]`."
        }
      ],
      starter: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        // TODO: make Dictionary<string, int> legs, store \"puppy\" = 4 and\n        // \"chicken\" = 2, then print  legs[\"puppy\"] + \" legs\"\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        Dictionary<string, int> legs = new Dictionary<string, int>();\n        legs[\"puppy\"] = 4;\n        legs[\"chicken\"] = 2;\n        Console.WriteLine(legs[\"puppy\"] + \" legs\");\n    }\n}\n"
    },
    {
      example: "Dictionary<string, int> ages = new Dictionary<string, int>();\nages[\"cat\"] = 3;\nif (ages.ContainsKey(\"dog\"))\n    Console.WriteLine(ages[\"dog\"]);\nelse\n    Console.WriteLine(\"unknown\");",
      expected: "no legs!",
      requireSource: [
        {
          pattern: /\.ContainsKey\s*\(/,
          message: "Guard the lookup with `ContainsKey`."
        }
      ],
      starter: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        Dictionary<string, int> legs = new Dictionary<string, int>();\n        legs[\"puppy\"] = 4;\n        // TODO: if legs contains \"snake\", print legs[\"snake\"] + \" legs\";\n        // otherwise print \"no legs!\"\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        Dictionary<string, int> legs = new Dictionary<string, int>();\n        legs[\"puppy\"] = 4;\n        if (legs.ContainsKey(\"snake\"))\n            Console.WriteLine(legs[\"snake\"] + \" legs\");\n        else\n            Console.WriteLine(\"no legs!\");\n    }\n}\n"
    },
    {
      example: "List<int> nums = new List<int> { 1, 5, 2, 8 };\nint big = 0;\nforeach (int n in nums)\n{\n    if (n >= 5) big++;\n}\nConsole.WriteLine(big);   // 2",
      expected: "3 treats for 4 dogs",
      requireSource: [
        {
          pattern: /\bforeach\b/,
          message: "Loop the list with a `foreach`."
        },
        {
          pattern: /goodBoys\.Count/,
          message: "Use `goodBoys.Count` for the total."
        }
      ],
      starter: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        List<bool> goodBoys = new List<bool> { true, true, false, true };\n        // TODO: count the true ones into int treats, then print\n        //   treats + \" treats for \" + goodBoys.Count + \" dogs\"\n    }\n}\n",
      solution: "using System;\nusing System.Collections.Generic;\n\nclass Program\n{\n    static void Main()\n    {\n        List<bool> goodBoys = new List<bool> { true, true, false, true };\n        int treats = 0;\n        foreach (bool goodBoy in goodBoys)\n        {\n            if (goodBoy) treats++;\n        }\n        Console.WriteLine(treats + \" treats for \" + goodBoys.Count + \" dogs\");\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "col",
    metaLabel: "Know the language · Collections",
    progressNoun: "Step",
    awardedKey: "collections_awarded",
    awardAmount: 20,
    tasks,
  };
})();
