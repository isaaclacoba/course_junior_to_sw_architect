(function () {
  "use strict";

  // A lab lesson: the learner writes C#, presses Visualize, and the card is
  // graded from the REAL execution trace - not from the text they typed. The
  // gate vocabulary lives in kernel/grading/trace-match.js.
  //
  // Each task carries `gates` (what the card is graded on) and per-goal `gate`
  // (what the live tracker ticks while they type). They are deliberately the
  // same gates written twice: one drives the verdict, one drives the checklist.

  // The class every card builds objects from. Its fields are PRIVATE and set
  // through the constructor - the same shape `06-reuse-without-regret` just
  // taught with `Voice(string sound)`, and the shape the rest of the course
  // keeps. A public mutable field would contradict the lesson before this one.
  var CAT_CLASS = [
    "public class Cat",
    "{",
    "    private string _name;",
    "    private int _age;",
    "",
    "    public Cat(string name, int age)",
    "    {",
    "        _name = name;",
    "        _age = age;",
    "    }",
    "",
    "    public string Describe()",
    "    {",
    "        return _name + \" is \" + _age;",
    "    }",
    "}",
    "",
  ].join("\n");

  window.LESSON_CONFIG = {
    prefix: "mo",

    tasks: [
      {
        title: "A second cat",
        concept: "Instance",
        context:
          "One class can make as many objects as you ask for. Each `new Cat(...)` sets aside " +
          "its own slot in memory, so two cats are two separate things - not two names for " +
          "one thing.\n\nThe code below makes one cat called Ana. Make a second cat with a " +
          "different name, and describe it too. Then press Visualize and watch memory: you " +
          "are looking for two cards, not one.",
        gates: [
          { liveObjects: "Cat", atLeast: 2 },
          { distinctField: { type: "Cat", field: "_name" } },
        ],
        // The sentences the core paints, and - index for index - the gates the
        // live tracker ticks them by.
        goal: [
          "Two <code>Cat</code> objects exist at the same time.",
          "The two cats hold different names.",
        ],
        goals: [
          { code: ["two Cat objects"], gate: { liveObjects: "Cat", atLeast: 2 } },
          { code: ["different names"], gate: { distinctField: { type: "Cat", field: "_name" } } },
        ],
        starter:
          CAT_CLASS +
          [
            "class Program",
            "{",
            "    static void Main()",
            "    {",
            "        Cat firstCat = new Cat(\"Ana\", 3);",
            "",
            "        // TODO: make a second cat, with a different name,",
            "        // then describe it too",
            "",
            "        System.Console.WriteLine(firstCat.Describe());",
            "    }",
            "}",
          ].join("\n"),
        solution:
          CAT_CLASS +
          [
            "class Program",
            "{",
            "    static void Main()",
            "    {",
            "        Cat firstCat = new Cat(\"Ana\", 3);",
            "        Cat secondCat = new Cat(\"Bo\", 3);",
            "",
            "        System.Console.WriteLine(firstCat.Describe());",
            "        System.Console.WriteLine(secondCat.Describe());",
            "    }",
            "}",
          ].join("\n"),
      },

      {
        title: "Same name, different cat",
        concept: "Its own values",
        context:
          "Two objects can hold the same name and still be two different cats. What makes " +
          "them separate is not what they are called - it is that each one got its own slot " +
          "when `new` ran.\n\nMake a second cat also called Ana, but a different age. " +
          "Visualize it and read the two cards: the same name twice, two ages, two objects.",
        gates: [
          { liveObjects: "Cat", atLeast: 2 },
          { distinctField: { type: "Cat", field: "_age" } },
        ],
        goal: [
          "Two <code>Cat</code> objects exist at the same time.",
          "The two cats hold different ages.",
        ],
        goals: [
          { code: ["two Cat objects"], gate: { liveObjects: "Cat", atLeast: 2 } },
          { code: ["different ages"], gate: { distinctField: { type: "Cat", field: "_age" } } },
        ],
        starter:
          CAT_CLASS +
          [
            "class Program",
            "{",
            "    static void Main()",
            "    {",
            "        Cat firstCat = new Cat(\"Ana\", 3);",
            "",
            "        // TODO: make a second cat also called Ana, but a different age",
            "",
            "        System.Console.WriteLine(firstCat.Describe());",
            "    }",
            "}",
          ].join("\n"),
        solution:
          CAT_CLASS +
          [
            "class Program",
            "{",
            "    static void Main()",
            "    {",
            "        Cat firstCat = new Cat(\"Ana\", 3);",
            "        Cat secondCat = new Cat(\"Ana\", 7);",
            "",
            "        System.Console.WriteLine(firstCat.Describe());",
            "        System.Console.WriteLine(secondCat.Describe());",
            "    }",
            "}",
          ].join("\n"),
      },

      {
        title: "Three at once",
        concept: "As many as you need",
        context:
          "There is no limit written anywhere. A class is a shape; you can stamp out as many " +
          "objects from it as the program needs, and each one is another card in memory." +
          "\n\nMake three cats, each with its own name, and describe all three. Visualize " +
          "it: three cards, three names, one class.",
        gates: [
          { liveObjects: "Cat", atLeast: 3 },
          { distinctField: { type: "Cat", field: "_name", atLeast: 3 } },
        ],
        goal: [
          "Three <code>Cat</code> objects exist at the same time.",
          "All three names are different.",
        ],
        goals: [
          { code: ["three Cat objects"], gate: { liveObjects: "Cat", atLeast: 3 } },
          { code: ["three different names"], gate: { distinctField: { type: "Cat", field: "_name", atLeast: 3 } } },
        ],
        starter:
          CAT_CLASS +
          [
            "class Program",
            "{",
            "    static void Main()",
            "    {",
            "        // TODO: make three cats, each with a different name,",
            "        // then describe each one",
            "    }",
            "}",
          ].join("\n"),
        solution:
          CAT_CLASS +
          [
            "class Program",
            "{",
            "    static void Main()",
            "    {",
            "        Cat firstCat = new Cat(\"Ana\", 3);",
            "        Cat secondCat = new Cat(\"Bo\", 5);",
            "        Cat thirdCat = new Cat(\"Cid\", 7);",
            "",
            "        System.Console.WriteLine(firstCat.Describe());",
            "        System.Console.WriteLine(secondCat.Describe());",
            "        System.Console.WriteLine(thirdCat.Describe());",
            "    }",
            "}",
          ].join("\n"),
      },

      // The recap card. Its prose lives in res/strings, keyed task.4.summary*.
      { summary: true },
    ],

    metaLabel: "Understand the ideas \u00b7 One class, many objects",
    progressNoun: "Step",
    awardedKey: "many_objects_awarded",
    awardAmount: 20,
  };
})();
