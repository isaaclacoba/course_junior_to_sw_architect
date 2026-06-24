// Part three - "LINQ". Theory lesson in the same shape as Control Flow: each
// card is a multiple-choice knowledge check first, then a fill-in-the-blank for
// the same idea. Pure theory - no compiler Run. It teaches the everyday LINQ
// operators as the loop-free way to query the collections from earlier lessons:
// Where, Count, Any, All, Select, FirstOrDefault and OrderBy. The learner has
// already met lambdas, so the blanks focus on which operator to reach for.
//
// Data only: drill-engine.js reads window.DRILL_CONFIG. Animal theme throughout;
// every example queries a `List<Animal>` where each animal has Name and Legs.
(function () {
  "use strict";

  const drills = [
    {
      title: "Filter with Where",
      concept: "Where",
      context:
        "`Where` keeps only the items that match a condition. You hand it a lambda that returns true or false for each item, and you get back a new sequence of the ones that passed - no loop to write.",
      quiz: {
        question: "What does `Where` give you back?",
        options: [
          { text: "A new sequence of the items that matched", correct: true },
          { text: "The number of items that matched", correct: false },
          { text: "The first item that matched", correct: false },
        ],
        answerWhy: "`Where` filters - it returns every item the lambda said true for. Counting and picking one are other operators.",
      },
      snippet: `// keep only the four-legged animals
var fourLegged = animals.{{1}}(a => a.Legs == 4);
foreach (var a in fourLegged)
    Console.WriteLine(a.Name);`,
      points: [
        "`Where` returns a filtered sequence, not a single value.",
        "The lambda runs once per item and decides true (keep) or false (drop).",
      ],
      blanks: [
        {
          id: 1,
          label: "Keep only the animals the lambda likes",
          answer: "Where",
          hints: ["The operator that filters a sequence."],
          explain: [
            { text: "`Where` tests each animal with the lambda and keeps the ones that return true.", highlight: "var fourLegged = animals.{{1}}(a => a.Legs == 4)" },
            { text: "Here it keeps every animal whose `Legs` equals 4.", highlight: "var fourLegged = animals.{{1}}(a => a.Legs == 4)" },
          ],
        },
      ],
    },
    {
      title: "Count what matches",
      concept: "Count",
      context:
        "`Count` does the loop-and-tally for you. Give it a lambda and it returns how many items match - the one-line version of the `foreach` plus counter you wrote in Collections.",
      quiz: {
        question: "`animals.Count(a => a.Legs == 4)` returns...",
        options: [
          { text: "How many animals have 4 legs", correct: true },
          { text: "A list of the 4-legged animals", correct: false },
          { text: "true if any animal has 4 legs", correct: false },
        ],
        answerWhy: "`Count` returns a number - the tally of items that matched. A list is `Where`; a yes/no is `Any`.",
      },
      snippet: `int dogs = animals.{{1}}(a => a.Legs == 4);
Console.WriteLine(dogs);`,
      points: [
        "`Count` returns an `int` - how many items matched.",
        "It replaces the start-at-zero, loop, `if`, increment pattern.",
      ],
      blanks: [
        {
          id: 1,
          label: "Tally the matching animals in one call",
          answer: "Count",
          hints: ["The operator that returns a number."],
          explain: [
            { text: "`Count` runs the lambda over every animal and returns how many were true.", highlight: "int dogs = animals.{{1}}(a => a.Legs == 4)" },
            { text: "This is the whole manual tally from Collections, in one line.", highlight: "int dogs = animals.{{1}}(a => a.Legs == 4)" },
          ],
        },
      ],
    },
    {
      title: "Is there at least one? Any",
      concept: "Any",
      context:
        "`Any` answers a yes/no question: is there at least one item that matches? It stops as soon as it finds one and returns a `bool`.",
      quiz: {
        question: "What type does `Any` return?",
        options: [
          { text: "bool", correct: true },
          { text: "int", correct: false },
          { text: "a list", correct: false },
        ],
        answerWhy: "`Any` is a yes/no check, so it returns a `bool` - true if at least one item matched.",
      },
      snippet: `bool hasBird = animals.{{1}}(a => a.Legs == 2);
Console.WriteLine(hasBird);`,
      points: [
        "`Any` returns true the moment one item matches.",
        "Use it when you only care whether something exists, not how many.",
      ],
      blanks: [
        {
          id: 1,
          label: "Ask whether any animal has two legs",
          answer: "Any",
          hints: ["The operator that returns a bool for 'at least one'."],
          explain: [
            { text: "`Any` returns true if at least one animal makes the lambda true.", highlight: "bool hasBird = animals.{{1}}(a => a.Legs == 2)" },
            { text: "If no animal has 2 legs, it returns false.", highlight: "bool hasBird = animals.{{1}}(a => a.Legs == 2)" },
          ],
        },
      ],
    },
    {
      title: "Do they all match? All",
      concept: "All",
      context:
        "`All` checks whether every item matches. It returns true only when the condition holds for all of them - one failure makes it false.",
      quiz: {
        question: "`All` returns true when...",
        options: [
          { text: "Every item matches the condition", correct: true },
          { text: "At least one item matches", correct: false },
          { text: "No item matches", correct: false },
        ],
        answerWhy: "`All` needs the condition to be true for every item; 'at least one' is `Any`.",
      },
      snippet: `bool everyoneHasLegs = animals.{{1}}(a => a.Legs > 0);
Console.WriteLine(everyoneHasLegs);`,
      points: [
        "`All` returns true only if no item fails the condition.",
        "`Any` needs one match; `All` needs every match.",
      ],
      blanks: [
        {
          id: 1,
          label: "Check that every animal has at least one leg",
          answer: "All",
          hints: ["The operator that needs every item to pass."],
          explain: [
            { text: "`All` returns true only if every animal has `Legs > 0`.", highlight: "bool everyoneHasLegs = animals.{{1}}(a => a.Legs > 0)" },
            { text: "A single legless animal would make it false.", highlight: "bool everyoneHasLegs = animals.{{1}}(a => a.Legs > 0)" },
          ],
        },
      ],
    },
    {
      title: "Transform with Select",
      concept: "Select",
      context:
        "`Select` turns each item into something else - often pulling out one field. From a list of animals you can get a sequence of just their names.",
      quiz: {
        question: "`animals.Select(a => a.Name)` gives you...",
        options: [
          { text: "A sequence of the animals' names", correct: true },
          { text: "The first animal's name", correct: false },
          { text: "How many names there are", correct: false },
        ],
        answerWhy: "`Select` projects each item through the lambda, so a list of animals becomes a list of names.",
      },
      snippet: `var names = animals.{{1}}(a => a.{{2}});
foreach (var n in names)
    Console.WriteLine(n);`,
      points: [
        "`Select` returns one new item per input item.",
        "It reshapes a sequence; it does not filter or count.",
      ],
      blanks: [
        {
          id: 1,
          label: "Transform each animal into something else",
          answer: "Select",
          hints: ["The operator that projects each item."],
          explain: [
            { text: "`Select` runs the lambda on every animal and collects the results.", highlight: "var names = animals.{{1}}(a => a.{{2}})" },
          ],
        },
        {
          id: 2,
          label: "Pull out just the name",
          answer: "Name",
          hints: ["The field on Animal that holds the name."],
          explain: [
            { text: "`a.Name` is what each animal becomes, so you end up with a sequence of names.", highlight: "var names = animals.{{1}}(a => a.{{2}})" },
          ],
        },
      ],
    },
    {
      title: "Grab one safely: FirstOrDefault",
      concept: "FirstOrDefault",
      context:
        "`First` returns the first matching item - but throws if there is none. `FirstOrDefault` returns a default instead (like `null`) when nothing matches, so it never crashes.",
      quiz: {
        question: "What does `FirstOrDefault` do when nothing matches?",
        options: [
          { text: "Returns a default value such as null", correct: true },
          { text: "Throws an error", correct: false },
          { text: "Returns an empty list", correct: false },
        ],
        answerWhy: "`FirstOrDefault` returns the type's default (null for objects) when there is no match; plain `First` throws.",
      },
      snippet: `// there may be no bird in the list - use the safe variant
var bird = animals.{{1}}(a => a.Legs == 2);`,
      points: [
        "`First` throws on no match; `FirstOrDefault` returns a default.",
        "Reach for the safe variant when a missing match is possible.",
      ],
      blanks: [
        {
          id: 1,
          label: "Get the first match, or a default if there is none",
          answer: "FirstOrDefault",
          hints: ["The safe variant that returns a default instead of throwing."],
          explain: [
            { text: "`FirstOrDefault` returns the first two-legged animal, or `null` if there is none.", highlight: "var bird = animals.{{1}}(a => a.Legs == 2)" },
            { text: "Plain `First` would throw an exception when nothing matches.", highlight: "var bird = animals.{{1}}(a => a.Legs == 2)" },
          ],
        },
      ],
    },
    {
      title: "Sort with OrderBy",
      concept: "OrderBy",
      context:
        "`OrderBy` sorts the items by whatever the lambda picks out. `OrderBy(a => a.Name)` sorts alphabetically by name; `OrderBy(a => a.Legs)` sorts by leg count, smallest first.",
      quiz: {
        question: "`animals.OrderBy(a => a.Legs)` sorts the animals by...",
        options: [
          { text: "Their number of legs, smallest first", correct: true },
          { text: "Their name, alphabetically", correct: false },
          { text: "A random order each time", correct: false },
        ],
        answerWhy: "`OrderBy` sorts ascending by the value the lambda returns - here, `Legs`.",
      },
      snippet: `var sorted = animals.{{1}}(a => a.Name);
foreach (var a in sorted)
    Console.WriteLine(a.Name);`,
      points: [
        "`OrderBy` returns the same items in a new order.",
        "The lambda picks the value to sort on.",
      ],
      blanks: [
        {
          id: 1,
          label: "Sort the animals by name",
          answer: "OrderBy",
          hints: ["The operator that sorts a sequence."],
          explain: [
            { text: "`OrderBy` arranges the animals by the value the lambda returns.", highlight: "var sorted = animals.{{1}}(a => a.Name)" },
            { text: "Here that value is `a.Name`, so they come out in alphabetical order.", highlight: "var sorted = animals.{{1}}(a => a.Name)" },
          ],
        },
      ],
    },
    {
      title: "LINQ recap",
      concept: "Recap",
      summary: true,
      context: "You now have the everyday tools for querying a collection without writing a loop.",
      summaryIntro:
        "LINQ operators each take a lambda and answer one kind of question about a sequence. Reach for the one that matches what you want back.",
      summaryItems: [
        { title: "Where - ", text: "keep only the items that match; returns a filtered sequence." },
        { title: "Count - ", text: "how many items match; returns a number." },
        { title: "Any - ", text: "is there at least one match; returns a `bool`." },
        { title: "All - ", text: "do all items match; returns a `bool`." },
        { title: "Select - ", text: "turn each item into something else; returns a reshaped sequence." },
        { title: "FirstOrDefault - ", text: "the first match, or a default (like `null`) if there is none." },
        { title: "OrderBy - ", text: "sort the items by the value the lambda picks." },
      ],
      summaryClose: "Next in this track: exceptions and null - handling the cases where things go wrong or a value is missing.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "lq",
    metaLabel: "Know the language \u00b7 LINQ",
    progressNoun: "Topic",
    awardedKey: "linq_awarded",
    awardAmount: 20,
    drills,
  };
})();
