(function () {
  "use strict";

  // A lab lesson: the learner writes C#, presses Visualize, and the card is
  // graded from the REAL execution trace - not from the text they typed. The
  // gate vocabulary lives in kernel/grading/trace-match.js.
  //
  // Each task carries `gates` (what the card is graded on) and per-goal `gate`
  // (what the live tracker ticks while they type). They are deliberately the
  // same gates written twice: one drives the verdict, one drives the checklist.
  //
  // The arc: card 1 shows that one class makes many objects; cards 2 and 3 open
  // up the constructor, which is the method `new` runs; cards 4 and 5 do the
  // same for an ordinary method call. Every card is graded on what the trace
  // shows, so the learner reads the answer off the memory panel rather than
  // taking it on trust.

  // Fields are PRIVATE and set through the constructor - the same shape
  // `06-reuse-without-regret` just taught with `Voice(string sound)`. A public
  // mutable field would contradict the lesson before this one.
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

  // Card 2's class: the constructor body is the blank. The fields are given
  // starting values so the starter compiles and runs - it just makes three
  // identical cats, which is exactly the thing the card asks them to fix.
  var CAT_EMPTY_CTOR = [
    "public class Cat",
    "{",
    "    private string _name = \"unnamed\";",
    "    private int _age = 0;",
    "",
    "    public Cat(string name, int age)",
    "    {",
    "        // TODO: copy the two parameters into the two fields",
    "    }",
    "",
    "    public string Describe()",
    "    {",
    "        return _name + \" is \" + _age;",
    "    }",
    "}",
    "",
  ].join("\n");

  var CAT_CTOR_DONE = [
    "public class Cat",
    "{",
    "    private string _name = \"unnamed\";",
    "    private int _age = 0;",
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

  var ROBOT_CLASS = [
    "public class Robot",
    "{",
    "    private string _name;",
    "    private int _batteryPercent;",
    "",
    "    public Robot(string name, int batteryPercent)",
    "    {",
    "        _name = name;",
    "        _batteryPercent = batteryPercent;",
    "    }",
    "",
    "    public string Report()",
    "    {",
    "        return _name + \" at \" + _batteryPercent + \"%\";",
    "    }",
    "}",
    "",
  ].join("\n");

  // Card 4's class: `Add` is the blank. `_total` starts at zero, so the starter
  // compiles and prints 0 - the gap between 0 and the answer is the lesson.
  var COUNTER_EMPTY_ADD = [
    "public class Counter",
    "{",
    "    private int _total;",
    "",
    "    public void Add(int amount)",
    "    {",
    "        // TODO: add amount to the running total",
    "    }",
    "",
    "    public int Total()",
    "    {",
    "        return _total;",
    "    }",
    "}",
    "",
  ].join("\n");

  var COUNTER_CLASS = [
    "public class Counter",
    "{",
    "    private int _total;",
    "",
    "    public void Add(int amount)",
    "    {",
    "        _total = _total + amount;",
    "    }",
    "",
    "    public int Total()",
    "    {",
    "        return _total;",
    "    }",
    "}",
    "",
  ].join("\n");

  function main(body) {
    return ["class Program", "{", "    static void Main()", "    {"]
      .concat(body)
      .concat(["    }", "}"])
      .join("\n");
  }

  window.LESSON_CONFIG = {
    prefix: "mo",

    tasks: [
      {
        title: "Three cats from one class",
        concept: "Instance",
        context:
          "One class can make as many objects as you ask for. Each `new Cat(...)` sets aside " +
          "its own slot in memory, so three cats are three separate things - not three names " +
          "for one thing. Two of them can even share a name and still be different cats; what " +
          "separates them is the slot, not the label.\n\nThe code below makes one cat. Make " +
          "two more, each with a different name, and describe all three. Then press Visualize " +
          "and watch the right-hand side: you are looking for three cards, not one.",
        gates: [
          { liveObjects: "Cat", atLeast: 3 },
          { distinctField: { type: "Cat", field: "_name", atLeast: 3 } },
        ],
        // The sentences the core paints, and - index for index - the gates the
        // live tracker ticks them by.
        goal: [
          "Three <code>Cat</code> objects exist at the same time.",
          "All three cats hold different names.",
        ],
        goals: [
          { code: ["three Cat objects"], gate: { liveObjects: "Cat", atLeast: 3 } },
          { code: ["three names"], gate: { distinctField: { type: "Cat", field: "_name", atLeast: 3 } } },
        ],
        starter:
          CAT_CLASS +
          main([
            "        Cat firstCat = new Cat(\"Ana\", 3);",
            "",
            "        // TODO: make two more cats, each with a different name,",
            "        // then describe all three",
            "",
            "        System.Console.WriteLine(firstCat.Describe());",
          ]),
        solution:
          CAT_CLASS +
          main([
            "        Cat firstCat = new Cat(\"Ana\", 3);",
            "        Cat secondCat = new Cat(\"Bo\", 5);",
            "        Cat thirdCat = new Cat(\"Cid\", 7);",
            "",
            "        System.Console.WriteLine(firstCat.Describe());",
            "        System.Console.WriteLine(secondCat.Describe());",
            "        System.Console.WriteLine(thirdCat.Describe());",
          ]),
      },

      {
        title: "What the constructor does",
        concept: "Constructor",
        context:
          "`new Cat(\"Ana\", 3)` is not one thing - it is two. First a blank object is set " +
          "aside, then a method runs to fill it in. That method is the constructor, and its " +
          "job is to copy what the caller passed into the object's own fields.\n\nThis " +
          "constructor has been left empty, so all three cats come out identical no matter " +
          "what `Main` passes. Fill it in. Then Visualize and step through: you will see the " +
          "`Cat` frame open on the stack, do its work, and close again - once per cat.",
        gates: [
          { distinctField: { type: "Cat", field: "_name", atLeast: 3 } },
          { distinctField: { type: "Cat", field: "_age", atLeast: 3 } },
        ],
        goal: [
          "The three cats end up with different names.",
          "The three cats end up with different ages.",
        ],
        goals: [
          { code: ["different names"], gate: { distinctField: { type: "Cat", field: "_name", atLeast: 3 } } },
          { code: ["different ages"], gate: { distinctField: { type: "Cat", field: "_age", atLeast: 3 } } },
        ],
        starter:
          CAT_EMPTY_CTOR +
          main([
            "        Cat firstCat = new Cat(\"Ana\", 3);",
            "        Cat secondCat = new Cat(\"Bo\", 5);",
            "        Cat thirdCat = new Cat(\"Cid\", 7);",
            "",
            "        System.Console.WriteLine(firstCat.Describe());",
            "        System.Console.WriteLine(secondCat.Describe());",
            "        System.Console.WriteLine(thirdCat.Describe());",
          ]),
        solution:
          CAT_CTOR_DONE +
          main([
            "        Cat firstCat = new Cat(\"Ana\", 3);",
            "        Cat secondCat = new Cat(\"Bo\", 5);",
            "        Cat thirdCat = new Cat(\"Cid\", 7);",
            "",
            "        System.Console.WriteLine(firstCat.Describe());",
            "        System.Console.WriteLine(secondCat.Describe());",
            "        System.Console.WriteLine(thirdCat.Describe());",
          ]),
      },

      {
        title: "The values you pass in",
        concept: "Argument",
        context:
          "The values in the brackets are `arguments`. The names in the constructor's own " +
          "brackets are `parameters`. When the constructor runs, each argument is copied into " +
          "the parameter sitting in the same position - first to first, second to second. " +
          "That is the whole rule, and it is why order matters.\n\nMake three robots with " +
          "different batteries. Visualize it, step onto the `Robot` frame, and read the " +
          "parameters: they hold whatever that particular `new` passed.",
        gates: [
          { constructed: "Robot", times: 3 },
          { distinctField: { type: "Robot", field: "_batteryPercent", atLeast: 3 } },
        ],
        goal: [
          "The <code>Robot</code> constructor runs three times.",
          "The three robots hold different battery levels.",
        ],
        goals: [
          { code: ["three robots"], gate: { constructed: "Robot", times: 3 } },
          { code: ["different batteries"], gate: { distinctField: { type: "Robot", field: "_batteryPercent", atLeast: 3 } } },
        ],
        starter:
          ROBOT_CLASS +
          main([
            "        Robot scout = new Robot(\"Scout\", 90);",
            "",
            "        // TODO: make two more robots, each with a different battery level,",
            "        // then report all three",
            "",
            "        System.Console.WriteLine(scout.Report());",
          ]),
        solution:
          ROBOT_CLASS +
          main([
            "        Robot scout = new Robot(\"Scout\", 90);",
            "        Robot digger = new Robot(\"Digger\", 55);",
            "        Robot lifter = new Robot(\"Lifter\", 20);",
            "",
            "        System.Console.WriteLine(scout.Report());",
            "        System.Console.WriteLine(digger.Report());",
            "        System.Console.WriteLine(lifter.Report());",
          ]),
      },

      {
        title: "A parameter only lives inside its method",
        concept: "Local scope",
        context:
          "An ordinary method takes arguments the same way a constructor does. `Add(3)` copies " +
          "`3` into the parameter `amount`, and `amount` exists only while `Add` is running - " +
          "it appears on the stack when the call starts and is gone when the call " +
          "returns.\n\nWrite the body of `Add`, then add a third call so the total comes to 9. " +
          "Visualize it and watch the stack: `amount` shows up three times, holding a " +
          "different number each time, and never outlives its call.",
        gates: [
          { calls: { type: "Counter", member: "Add", times: 3 } },
          { prints: "9" },
        ],
        goal: [
          "<code>Add</code> runs three times.",
          "The program prints <code>9</code>.",
        ],
        goals: [
          { code: ["three calls"], gate: { calls: { type: "Counter", member: "Add", times: 3 } } },
          { code: ["prints 9"], gate: { prints: "9" } },
        ],
        starter:
          COUNTER_EMPTY_ADD +
          main([
            "        Counter tally = new Counter();",
            "        tally.Add(3);",
            "        tally.Add(4);",
            "",
            "        // TODO: add one more call so the total reaches 9",
            "",
            "        System.Console.WriteLine(tally.Total());",
          ]),
        solution:
          COUNTER_CLASS +
          main([
            "        Counter tally = new Counter();",
            "        tally.Add(3);",
            "        tally.Add(4);",
            "        tally.Add(2);",
            "",
            "        System.Console.WriteLine(tally.Total());",
          ]),
        // Card 4 needs a no-argument constructor, which `Counter` gets for free.
      },

      {
        title: "Which object is the method running on?",
        concept: "Receiver",
        context:
          "`tally.Add(2)` names two things: the method to run, and the object to run it on. " +
          "One `Add` is written once and shared by every counter, but each call reaches into " +
          "the fields of the one object in front of the dot.\n\nMake a second counter and add " +
          "a different amount to it. Visualize it: the same `Add` frame opens twice, and each " +
          "time the arrow points at a different counter - so the two totals never mix.",
        gates: [
          { liveObjects: "Counter", atLeast: 2 },
          { distinctField: { type: "Counter", field: "_total" } },
        ],
        goal: [
          "Two <code>Counter</code> objects exist at the same time.",
          "The two counters hold different totals.",
        ],
        goals: [
          { code: ["two counters"], gate: { liveObjects: "Counter", atLeast: 2 } },
          { code: ["different totals"], gate: { distinctField: { type: "Counter", field: "_total" } } },
        ],
        starter:
          COUNTER_CLASS +
          main([
            "        Counter morning = new Counter();",
            "        morning.Add(3);",
            "",
            "        // TODO: make a second counter, add a different amount to it,",
            "        // then print both totals",
            "",
            "        System.Console.WriteLine(morning.Total());",
          ]),
        solution:
          COUNTER_CLASS +
          main([
            "        Counter morning = new Counter();",
            "        morning.Add(3);",
            "",
            "        Counter evening = new Counter();",
            "        evening.Add(8);",
            "",
            "        System.Console.WriteLine(morning.Total());",
            "        System.Console.WriteLine(evening.Total());",
          ]),
      },

      // The recap card. Its prose lives in res/strings, keyed task.6.summary*.
      { summary: true },
    ],

    metaLabel: "Understand the ideas \u00b7 One class, many objects",
    progressNoun: "Step",
    awardedKey: "many_objects_awarded",
    awardAmount: 20,
  };
})();
