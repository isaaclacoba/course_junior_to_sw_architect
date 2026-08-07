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

  // Card 4's class. The cap is the blank, and the running total is already
  // written - the card is about what happens to `amount`, not about addition.
  // `Counter` takes its starting total through a constructor like every other
  // class in this lesson; a class that fills itself in would quietly undo the
  // three cards before it.
  var COUNTER_CAP_TODO = [
    "public class Counter",
    "{",
    "    private const int MaxPerAdd = 10;",
    "",
    "    private int _total;",
    "",
    "    public Counter(int startingTotal)",
    "    {",
    "        _total = startingTotal;",
    "    }",
    "",
    "    public void Add(int amount)",
    "    {",
    "        // TODO: no single add may exceed MaxPerAdd - cut `amount` down to it",
    "",
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

  var COUNTER_CAPPED = [
    "public class Counter",
    "{",
    "    private const int MaxPerAdd = 10;",
    "",
    "    private int _total;",
    "",
    "    public Counter(int startingTotal)",
    "    {",
    "        _total = startingTotal;",
    "    }",
    "",
    "    public void Add(int amount)",
    "    {",
    "        if (amount > MaxPerAdd)",
    "        {",
    "            amount = MaxPerAdd;",
    "        }",
    "",
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
          "Three `Cat` objects exist at the same time.",
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
          "The `Robot` constructor runs three times.",
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
        title: "What the method gets is a copy",
        concept: "Local scope",
        context:
          "A method takes arguments the same way a constructor does: each one is copied into " +
          "the parameter in the matching position. Copied - that is the part people get " +
          "wrong. `amount` is a fresh variable belonging to this one call of `Add`, so " +
          "writing to it changes nothing outside.\n\nNo single add may exceed `MaxPerAdd`. " +
          "Cut `amount` down to it, then Visualize: on the `Add` frame `amount` drops to 10, " +
          "while `requested` back in `Main` is still 50 - untouched, because `Add` never had " +
          "it, only a copy of its value.",
        gates: [
          { calls: { type: "Counter", member: "Add", times: 2 } },
          { prints: "13" },
          { prints: "50" },
        ],
        goal: [
          "The capped add contributes 10, so the total prints `13`.",
          "`requested` still prints `50` after the call.",
        ],
        goals: [
          { code: ["two calls"], gate: { calls: { type: "Counter", member: "Add", times: 2 } } },
          { code: ["total is 13"], gate: { prints: "13" } },
          { code: ["requested is still 50"], gate: { prints: "50" } },
        ],
        starter:
          COUNTER_CAP_TODO +
          main([
            "        Counter tally = new Counter(0);",
            "        int requested = 50;",
            "",
            "        tally.Add(requested);",
            "        tally.Add(3);",
            "",
            "        System.Console.WriteLine(tally.Total());",
            "        System.Console.WriteLine(requested);",
          ]),
        solution:
          COUNTER_CAPPED +
          main([
            "        Counter tally = new Counter(0);",
            "        int requested = 50;",
            "",
            "        tally.Add(requested);",
            "        tally.Add(3);",
            "",
            "        System.Console.WriteLine(tally.Total());",
            "        System.Console.WriteLine(requested);",
          ]),
        // A learner who ignores `amount` and always adds the cap prints 20, not 13 -
        // that is what the second call, deliberately under the cap, is there to catch.
      },

      {
        title: "Which object is the method running on?",
        concept: "Receiver",
        context:
          "`morning.Add(5)` names two things: the method to run, and the object to run it on. " +
          "One `Add` is written once and shared by every counter, so the argument alone cannot " +
          "decide the answer - the object in front of the dot does.\n\nAdd the same 5 to both " +
          "counters. They start at different totals, so the same call gives different answers. " +
          "Visualize it: the `Add` frame opens twice with an identical `amount`, and each time " +
          "`this` points at a different card on the heap.",
        gates: [
          { liveObjects: "Counter", atLeast: 2 },
          { calls: { type: "Counter", member: "Add", times: 2 } },
          { prints: "15" },
          { prints: "105" },
        ],
        goal: [
          "Two `Counter` objects exist at the same time.",
          "Both get the same 5, so `Add` runs twice.",
          "The totals come out `15` and `105`.",
        ],
        goals: [
          { code: ["two counters"], gate: { liveObjects: "Counter", atLeast: 2 } },
          { code: ["Add runs twice"], gate: { calls: { type: "Counter", member: "Add", times: 2 } } },
          { code: ["15 and 105"], gate: { prints: "105" } },
        ],
        starter:
          COUNTER_CAPPED +
          main([
            "        Counter morning = new Counter(10);",
            "        Counter evening = new Counter(100);",
            "",
            "        morning.Add(5);",
            "",
            "        // TODO: add the same 5 to `evening`, then print its total too",
            "",
            "        System.Console.WriteLine(morning.Total());",
          ]),
        solution:
          COUNTER_CAPPED +
          main([
            "        Counter morning = new Counter(10);",
            "        Counter evening = new Counter(100);",
            "",
            "        morning.Add(5);",
            "        evening.Add(5);",
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
