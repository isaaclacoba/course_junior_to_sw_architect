(function () {
  "use strict";

  // A lab lesson: the learner writes C#, presses Visualize, and the card is
  // graded from the REAL execution trace - not from the text they typed. The
  // gate vocabulary lives in kernel/grading/trace-match.js.
  //
  // Each task carries `gates` (what the card is graded on) and per-goal `gate`
  // (what the live tracker ticks while they type). They are deliberately the
  // same gates written twice: one drives the verdict, one drives the checklist.

  var CAT_CLASS = [
    "public class Cat",
    "{",
    "    public string Name = \"\";",
    "    public int Age;",
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
          "One class can make as many objects as you ask for. Each `new Cat()` sets aside " +
          "its own slot in memory, so two cats are two separate things - not two names for " +
          "one thing.\n\nThe code below makes one cat and names her Ana. Make a second cat, " +
          "give it a different name, and print both. Then press Visualize and watch memory: " +
          "you are looking for two cards, not one.",
        gates: [
          { liveObjects: "Cat", atLeast: 2 },
          { distinctField: { type: "Cat", field: "Name" } },
        ],
        // The sentences the core paints, and - index for index - the gates the
        // live tracker ticks them by.
        goal: [
          "Two <code>Cat</code> objects exist at the same time.",
          "The two cats hold different names.",
        ],
        goals: [
          { code: ["two Cat objects"], gate: { liveObjects: "Cat", atLeast: 2 } },
          { code: ["different names"], gate: { distinctField: { type: "Cat", field: "Name" } } },
        ],
        starter:
          CAT_CLASS +
          [
            "class Program",
            "{",
            "    static void Main()",
            "    {",
            "        Cat a = new Cat();",
            "        a.Name = \"Ana\";",
            "",
            "        // TODO: make a second cat, with a different name",
            "",
            "        System.Console.WriteLine(a.Name);",
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
            "        Cat a = new Cat();",
            "        a.Name = \"Ana\";",
            "",
            "        Cat b = new Cat();",
            "        b.Name = \"Bo\";",
            "",
            "        System.Console.WriteLine(a.Name);",
            "        System.Console.WriteLine(b.Name);",
            "    }",
            "}",
          ].join("\n"),
      },

      {
        title: "Changing one does not change the other",
        concept: "Its own values",
        context:
          "Because each object owns its values, writing to one leaves the other alone. That " +
          "is the whole point of making a second object rather than reusing the first." +
          "\n\nTwo cats already exist here and both are called Ana. Give one of them a " +
          "different age, and leave the other's age as it was. Visualize it and read the two " +
          "cards: one number changes, the other does not.",
        gates: [
          { liveObjects: "Cat", atLeast: 2 },
          { distinctField: { type: "Cat", field: "Age" } },
        ],
        goal: [
          "Two <code>Cat</code> objects exist at the same time.",
          "The two cats hold different ages.",
        ],
        goals: [
          { code: ["two Cat objects"], gate: { liveObjects: "Cat", atLeast: 2 } },
          { code: ["different ages"], gate: { distinctField: { type: "Cat", field: "Age" } } },
        ],
        starter:
          CAT_CLASS +
          [
            "class Program",
            "{",
            "    static void Main()",
            "    {",
            "        Cat a = new Cat();",
            "        a.Name = \"Ana\";",
            "        a.Age = 3;",
            "",
            "        Cat b = new Cat();",
            "        b.Name = \"Ana\";",
            "",
            "        // TODO: give b a different age from a",
            "",
            "        System.Console.WriteLine(a.Age);",
            "        System.Console.WriteLine(b.Age);",
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
            "        Cat a = new Cat();",
            "        a.Name = \"Ana\";",
            "        a.Age = 3;",
            "",
            "        Cat b = new Cat();",
            "        b.Name = \"Ana\";",
            "        b.Age = 7;",
            "",
            "        System.Console.WriteLine(a.Age);",
            "        System.Console.WriteLine(b.Age);",
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
          "\n\nMake three cats, each with its own name, and print all three names. Visualize " +
          "it: three cards, three names, one class.",
        gates: [
          { liveObjects: "Cat", atLeast: 3 },
          { distinctField: { type: "Cat", field: "Name", atLeast: 3 } },
        ],
        goal: [
          "Three <code>Cat</code> objects exist at the same time.",
          "All three names are different.",
        ],
        goals: [
          { code: ["three Cat objects"], gate: { liveObjects: "Cat", atLeast: 3 } },
          { code: ["three different names"], gate: { distinctField: { type: "Cat", field: "Name", atLeast: 3 } } },
        ],
        starter:
          CAT_CLASS +
          [
            "class Program",
            "{",
            "    static void Main()",
            "    {",
            "        // TODO: make three cats, each with a different name,",
            "        // then print each name",
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
            "        Cat a = new Cat();",
            "        a.Name = \"Ana\";",
            "",
            "        Cat b = new Cat();",
            "        b.Name = \"Bo\";",
            "",
            "        Cat c = new Cat();",
            "        c.Name = \"Cid\";",
            "",
            "        System.Console.WriteLine(a.Name);",
            "        System.Console.WriteLine(b.Name);",
            "        System.Console.WriteLine(c.Name);",
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
