// Part three - "Collections".
//
// The first lesson of the new "Know the language" track, sitting after the
// Capstone. The learner already knows objects, control flow and SOLID; this
// teaches the everyday container types that real code leans on: List<T>,
// indexing, lists of objects, and Dictionary<TKey, TValue>. It deliberately
// shows the manual foreach-and-count shape so the later LINQ lesson can replace
// it with one line and feel like a win.
//
// Runnable fill-in-the-blank drills. Data only: drill-engine.js reads
// window.DRILL_CONFIG; the Run button compiles runnablePrograms through the
// shared code-lab Roslyn/WASM host. Light, animal-themed examples throughout.

const drills = [
  {
    title: "Make a list",
    concept: "A growable list",
    context:
      "An array has a fixed size - it can never grow. A `List<T>` grows as you add to it. The angle brackets say what it holds: `List<string>` is a list of strings, `List<int>` a list of numbers. The `T` is just a placeholder for whichever type you put there. Add two animals to the party list, then count the guests with `Count`.",
    snippet: `var partyAnimals = new List<{{1}}>();
partyAnimals.Add("llama");
partyAnimals.Add("raccoon");
Console.WriteLine(partyAnimals.{{2}});`,
    points: [
      "The `<...>` is not decoration - it tells the list what type every item must be.",
      "`List<string>` is a list whose items are strings.",
      "`Add` appends one item; `Count` is how many it holds.",
    ],
    blanks: [
      {
        id: 1,
        label: "The type of item the list holds",
        answer: "string",
        hints: ["The two guests are text in quotes."],
        explain: [
          { text: "Whatever you write between the `<` and `>` is the type each item must be.", highlight: "var partyAnimals = new List<{{1}}>()" },
          { text: "The items are `\"llama\"` and `\"raccoon\"` - text - so the list holds `string`.", highlight: "var partyAnimals = new List<{{1}}>()" },
          { text: "`new List<string>()` makes an empty list ready to take strings.", highlight: "var partyAnimals = new List<{{1}}>()" },
        ],
      },
      {
        id: 2,
        label: "How many animals are at the party",
        answer: "Count",
        hints: ["A property on every list - not a method, no ()."],
        explain: [
          { text: "Two `Add` calls put two animals in the list.", highlight: "partyAnimals.Add(\"raccoon\")" },
          { text: "`Count` reports the number of items, so this prints `2`.", highlight: "Console.WriteLine(partyAnimals.{{2}})" },
        ],
      },
    ],
  },
  {
    title: "Walk a list with foreach",
    concept: "Visit each item",
    context:
      "`foreach` works on a `List<T>` exactly like it does on an array - it hands you each item in turn. Take the roll call so every pet knows it is here.",
    snippet: `var pets = new List<string> { "Rex", "Whiskers", "Bubbles" };
foreach (var name in {{1}})
{
    Console.WriteLine({{2}} + " is here!");
}`,
    points: [
      "A list can be filled inline with `{ ... }` instead of repeated `Add`s.",
      "`foreach` visits each item once, in order, with no index to manage.",
    ],
    blanks: [
      {
        id: 1,
        label: "The collection to walk",
        answer: "pets",
        hints: ["The list declared on the line above."],
        explain: [
          { text: "`pets` is the list we want to walk through.", highlight: "var pets = new List<string> { \"Rex\", \"Whiskers\", \"Bubbles\" }" },
          { text: "`foreach (var name in pets)` runs the body once per pet.", highlight: "foreach (var name in {{1}})" },
        ],
      },
      {
        id: 2,
        label: "The current pet to greet",
        answer: "name",
        hints: ["The loop variable you just named."],
        explain: [
          { text: "`name` holds the current pet on this pass.", highlight: "foreach (var name in {{1}})" },
          { text: "Printing `name` greets each pet on its own line.", highlight: "Console.WriteLine({{2}} + \" is here!\")" },
        ],
      },
    ],
  },
  {
    title: "Read by position",
    concept: "Index into a list",
    context:
      "Items in a list have a position, counted from `0`. Use square brackets to read one. The penguin at the back is at `Count - 1`.",
    snippet: `var queue = new List<string> { "Pingu", "Skipper", "Waddles" };
Console.WriteLine(queue[{{1}}] + " is first in line");
Console.WriteLine(queue[queue.Count - {{2}}] + " is last");`,
    points: [
      "The first item is at index `0`, not `1`.",
      "`Count - 1` is always the last position.",
    ],
    blanks: [
      {
        id: 1,
        label: "Position of the first penguin",
        answer: "0",
        hints: ["Lists count from here."],
        explain: [
          { text: "Indexing starts at `0`, so `queue[0]` is `\"Pingu\"`.", highlight: "Console.WriteLine(queue[{{1}}] + \" is first in line\")" },
        ],
      },
      {
        id: 2,
        label: "Offset from Count for the last penguin",
        answer: "1",
        hints: ["Count is 3 here; the last index is one less."],
        explain: [
          { text: "There are 3 penguins, so `Count` is `3` but the last index is `2`.", highlight: "var queue = new List<string> { \"Pingu\", \"Skipper\", \"Waddles\" }" },
          { text: "`queue[queue.Count - 1]` reads the penguin at the back, `\"Waddles\"`.", highlight: "Console.WriteLine(queue[queue.Count - {{2}}] + \" is last\")" },
        ],
      },
    ],
  },
  {
    title: "A list of your own objects",
    concept: "A list of objects",
    context:
      "A list can hold your own objects, not just strings. Round up the `Cat`s, then read a field from each one to see who is guilty of knocking things off the table.",
    snippet: `public class Cat
{
    public string Name = "";
    public bool KnockedSomethingOver;
}

public static void Main()
{
    var cats = new List<{{1}}>();
    cats.Add(new Cat { Name = "Mittens", KnockedSomethingOver = true });
    cats.Add(new Cat { Name = "Smudge", KnockedSomethingOver = false });

    foreach (var c in cats)
    {
        Console.WriteLine(c.Name + " guilty: " + c.{{2}});
    }
}`,
    points: [
      "`List<Cat>` holds whole objects, each with its own fields.",
      "Inside the loop, `c` is one `Cat` you can read from.",
    ],
    blanks: [
      {
        id: 1,
        label: "The type the list holds",
        answer: "Cat",
        hints: ["The class declared at the top."],
        explain: [
          { text: "We are storing `Cat` objects, so the list is `List<Cat>`.", highlight: "var cats = new List<{{1}}>()" },
          { text: "Each `Add` drops one `Cat` into the list.", highlight: "cats.Add(new Cat { Name = \"Mittens\", KnockedSomethingOver = true })" },
        ],
      },
      {
        id: 2,
        label: "The guilty-or-not field to print",
        answer: "KnockedSomethingOver",
        hints: ["The bool field on Cat."],
        explain: [
          { text: "`Cat` has a `KnockedSomethingOver` field holding `true` or `false`.", highlight: "public bool KnockedSomethingOver;" },
          { text: "`c.KnockedSomethingOver` reads it for the current cat, printing `True` or `False`.", highlight: "Console.WriteLine(c.Name + \" guilty: \" + c.{{2}})" },
        ],
      },
    ],
  },
  {
    title: "Look up by key",
    concept: "Dictionary lookup",
    context:
      "A `Dictionary<TKey, TValue>` maps a key to a value. The angle brackets now hold two types: the key type and the value type. Here each critter (the key) maps to how many legs it has (the value). Store two, then look one up by name.",
    snippet: `var legs = new Dictionary<string, {{1}}>();
legs["puppy"] = 4;
legs["chicken"] = 2;
Console.WriteLine(legs[{{2}}] + " legs");`,
    points: [
      "`Dictionary<string, int>` maps a `string` key to an `int` value.",
      "`legs[\"puppy\"]` both sets and reads the value for that key.",
    ],
    blanks: [
      {
        id: 1,
        label: "Type of the value (the leg count)",
        answer: "int",
        hints: ["The values 4 and 2 are whole numbers."],
        explain: [
          { text: "The values are whole numbers, so the value type is `int`.", highlight: "var legs = new Dictionary<string, {{1}}>()" },
          { text: "The key is the critter name (`string`), the value is its leg count (`int`).", highlight: "legs[\"puppy\"] = 4" },
        ],
      },
      {
        id: 2,
        label: "Key to look up",
        answer: '"puppy"',
        accept: ["puppy"],
        hints: ["A string key, in quotes, that you stored above."],
        explain: [
          { text: "We stored a value under the key `\"puppy\"`.", highlight: "legs[\"puppy\"] = 4" },
          { text: "`legs[\"puppy\"]` reads that value back, printing `4`.", highlight: "Console.WriteLine(legs[{{2}}] + \" legs\")" },
        ],
      },
    ],
  },
  {
    title: "Check before you read",
    concept: "Safe lookup",
    context:
      "Reading a key that was never stored throws an error. `ContainsKey` lets you check first - handy when a snake shows up and you need a polite answer.",
    snippet: `var legs = new Dictionary<string, int>();
legs["puppy"] = 4;

if (legs.{{1}}("snake"))
    Console.WriteLine(legs["snake"] + " legs");
else
    Console.WriteLine({{2}});`,
    points: [
      "`ContainsKey` returns a `bool` - true only when the key is present.",
      "Guarding the lookup avoids a crash on a missing key.",
    ],
    blanks: [
      {
        id: 1,
        label: "Is the key present?",
        answer: "ContainsKey",
        hints: ["A method that returns true when the dictionary has that key."],
        explain: [
          { text: "Only `\"puppy\"` was stored, so `\"snake\"` is missing.", highlight: "legs[\"puppy\"] = 4" },
          { text: "`ContainsKey(\"snake\")` returns `false`, so the `else` branch runs.", highlight: "if (legs.{{1}}(\"snake\"))" },
        ],
      },
      {
        id: 2,
        label: "Printed when the critter is missing",
        answer: '"no legs!"',
        accept: ["no legs!"],
        hints: ["A short string, in quotes, for the not-found case."],
        explain: [
          { text: "Because the snake's key is absent, the program prints the fallback text.", highlight: "Console.WriteLine({{2}})" },
          { text: "Here that fallback is `\"no legs!\"`.", highlight: "Console.WriteLine({{2}})" },
        ],
      },
    ],
  },
  {
    title: "Count what matches",
    concept: "Tally a list",
    context:
      "Loop a list and tally the items that meet a condition. Here we hand out one treat per good boy. This is the manual shape; later, LINQ does the same in one line.",
    snippet: `var goodBoys = new List<bool> { true, true, false, true };
int treats = 0;
foreach (var goodBoy in goodBoys)
{
    if (goodBoy) treats{{1}};
}
Console.WriteLine(treats + " treats for " + goodBoys.{{2}} + " dogs");`,
    points: [
      "Start a counter at `0`, then raise it inside the loop when the test holds.",
      "`goodBoys.Count` is the total, so this prints treats out of all dogs.",
    ],
    blanks: [
      {
        id: 1,
        label: "Hand out one more treat",
        answer: "++",
        accept: ["+=1", "+= 1"],
        hints: ["Increment: two plus signs."],
        explain: [
          { text: "When `goodBoy` is true, raise the treat count by one.", highlight: "if (goodBoy) treats{{1}}" },
          { text: "`treats++` is shorthand for `treats = treats + 1`.", highlight: "if (goodBoy) treats{{1}}" },
        ],
      },
      {
        id: 2,
        label: "The total number of dogs",
        answer: "Count",
        hints: ["The same list property from the first drill."],
        explain: [
          { text: "Three of the four dogs are good boys, so `treats` ends at `3`.", highlight: "var goodBoys = new List<bool> { true, true, false, true }" },
          { text: "`goodBoys.Count` is `4`, so the line prints `3 treats for 4 dogs`.", highlight: "Console.WriteLine(treats + \" treats for \" + goodBoys.{{2}} + \" dogs\")" },
        ],
      },
    ],
  },
  {
    title: "Collections recap",
    concept: "Recap",
    summary: true,
    context: "You now have the containers that almost every real program reaches for.",
    summaryIntro:
      "Collections hold many values at once. These are the everyday containers you will use to round up a herd, look critters up, and tally the good boys.",
    summaryItems: [
      { title: "List&lt;T&gt; - ", text: "a growable, ordered collection; the `<T>` says what type it holds. `Add` to it, read `Count`, index with `[i]`." },
      { title: "foreach over a list - ", text: "visit each item in turn, no index needed." },
      { title: "List of objects - ", text: "a list can hold your own types, each with its own fields." },
      { title: "Dictionary&lt;TKey, TValue&gt; - ", text: "map a key to a value and look it up by key." },
      { title: "ContainsKey - ", text: "check a key exists before reading it, to avoid a crash." },
      { title: "Tally with a loop - ", text: "count matches by hand; LINQ will shorten this next." },
    ],
    summaryClose: "Next in this track: the data shapes that fill these collections - properties, enums, structs and records.",
    blanks: [],
  },
];

// Complete, runnable C# for each drill, index-aligned with `drills`. The Run
// button compiles and runs these through the shared code-lab Roslyn/WASM host.
const runnablePrograms = [
  // 0 - Make a list
  `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var partyAnimals = new List<string>();
        partyAnimals.Add("llama");
        partyAnimals.Add("raccoon");
        Console.WriteLine(partyAnimals.Count);
    }
}`,
  // 1 - Walk a list with foreach
  `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var pets = new List<string> { "Rex", "Whiskers", "Bubbles" };
        foreach (var name in pets)
        {
            Console.WriteLine(name + " is here!");
        }
    }
}`,
  // 2 - Read by position
  `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var queue = new List<string> { "Pingu", "Skipper", "Waddles" };
        Console.WriteLine(queue[0] + " is first in line");
        Console.WriteLine(queue[queue.Count - 1] + " is last");
    }
}`,
  // 3 - A list of your own objects
  `using System;
using System.Collections.Generic;

public class Cat
{
    public string Name = "";
    public bool KnockedSomethingOver;
}

class Program
{
    static void Main()
    {
        var cats = new List<Cat>();
        cats.Add(new Cat { Name = "Mittens", KnockedSomethingOver = true });
        cats.Add(new Cat { Name = "Smudge", KnockedSomethingOver = false });

        foreach (var c in cats)
        {
            Console.WriteLine(c.Name + " guilty: " + c.KnockedSomethingOver);
        }
    }
}`,
  // 4 - Look up by key
  `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var legs = new Dictionary<string, int>();
        legs["puppy"] = 4;
        legs["chicken"] = 2;
        Console.WriteLine(legs["puppy"] + " legs");
    }
}`,
  // 5 - Check before you read
  `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var legs = new Dictionary<string, int>();
        legs["puppy"] = 4;

        if (legs.ContainsKey("snake"))
            Console.WriteLine(legs["snake"] + " legs");
        else
            Console.WriteLine("no legs!");
    }
}`,
  // 6 - Count what matches
  `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var goodBoys = new List<bool> { true, true, false, true };
        int treats = 0;
        foreach (var goodBoy in goodBoys)
        {
            if (goodBoy) treats++;
        }
        Console.WriteLine(treats + " treats for " + goodBoys.Count + " dogs");
    }
}`,
  // 7 - Recap (no runnable program)
  null,
];

window.DRILL_CONFIG = {
  prefix: "col",
  metaLabel: "Know the language \u00b7 Collections",
  progressNoun: "Drill",
  drills,
  runnablePrograms,
  runnerUrl: "level3-app/index.html?runner=1",
  xpKey: "course_global_xp",
  awardedKey: "collections_awarded",
  awardAmount: 20,
};
