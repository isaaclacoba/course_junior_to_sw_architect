// Part three - "Generics". Write-from-scratch builds (same engine and style as
// First Builds / Data shapes). The learner has already used List<T>; now they
// define their own generic types and methods: a Box<T>, a generic method, a
// Pair<A, B>, and a generic method that returns a generic type. Each task is
// graded so the concept is unavoidable - a verify probe re-runs the learner's
// type with a different T, so a version hardcoded to int fails.
// Data only: build-engine.js reads window.BUILD_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      title: "A box for anything",
      concept: "Generic class",
      context:
        "A generic type works with any kind of value. You write a placeholder - `T` - in angle brackets, and the caller picks the real type. You have used `List<T>` already; now write your own. Define a `Box<T>` that holds one value of whatever type `T` is.",
      example:
        "// List<T> is generic - it works for any T:\nList<int> nums = new List<int>();\n\n// You can define your own generic type the same way:\n// public class Holder<T> { ... }",
      goal: [
        "Define `public class Box<T>` with a `T Value` set through its constructor.",
        "Main makes a `Box<int>` holding 7 and prints `Value`, so the output is 7.",
      ],
      expected: "7",
      requireSource: [
        { pattern: /class\s+Box\s*<\s*\w+\s*>/, message: "Define `Box<T>` with a type parameter in angle brackets." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var box = new Box<string>("hi");\n        Console.WriteLine(box.Value);\n    }\n}\n',
        expected: "hi",
        message: "7 works for Box<int> only. Box<T> must hold whatever type T is - the hidden check uses a string.",
      },
      starter:
        "using System;\n\n// TODO: define a generic class Box<T> that stores one T Value (set in the constructor)\n\nclass Program\n{\n    static void Main()\n    {\n        var box = new Box<int>(7);\n        Console.WriteLine(box.Value);\n    }\n}\n",
      solution:
        "using System;\n\npublic class Box<T>\n{\n    public T Value { get; }\n    public Box(T value) { Value = value; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var box = new Box<int>(7);\n        Console.WriteLine(box.Value);\n    }\n}\n",
    },
    {
      title: "A method that works on any array",
      concept: "Generic method",
      context:
        "A method can be generic too: put the `<T>` after its name, and it works on any type. Write `First<T>` that takes an array of `T` and returns its first item. The caller's type is worked out automatically from the array passed in.",
      example:
        "// A generic method names its placeholder after the method:\n// public T Pick<T>(T[] items) => items[0];\nvar n = new Picker().Pick(new int[] { 9, 8 });  // n is 9",
      goal: [
        "Give `Picker` a method `public T First<T>(T[] items)` that returns `items[0]`.",
        "Main calls `First` on the int array `{ 3, 4, 5 }`, so the output is 3.",
      ],
      expected: "3",
      requireSource: [
        { pattern: /First\s*<\s*\w+\s*>\s*\(/, message: "Make `First` generic: `public T First<T>(T[] items)`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var picker = new Picker();\n        Console.WriteLine(picker.First(new string[] { "a", "b" }));\n    }\n}\n',
        expected: "a",
        message: "3 works for the int array only. First<T> must return the first item of any array - the hidden check uses strings.",
      },
      starter:
        "using System;\n\npublic class Picker\n{\n    // TODO: a generic method First<T> that returns the first item of a T[] array\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var picker = new Picker();\n        Console.WriteLine(picker.First(new int[] { 3, 4, 5 }));\n    }\n}\n",
      solution:
        "using System;\n\npublic class Picker\n{\n    public T First<T>(T[] items) => items[0];\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var picker = new Picker();\n        Console.WriteLine(picker.First(new int[] { 3, 4, 5 }));\n    }\n}\n",
    },
    {
      title: "Two types at once",
      concept: "Two type parameters",
      context:
        "A type can take more than one placeholder. `Pair<A, B>` holds two values whose types can differ - like a name and an age. Separate the placeholders with a comma.",
      example:
        "// Two placeholders, separated by a comma:\n// public class Duo<A, B> { ... }\n// new Duo<string, bool>(\"on\", true)",
      goal: [
        "Define `public class Pair<A, B>` with a `First` of type `A` and a `Second` of type `B`, both set in the constructor.",
        "Main makes a `Pair<string, int>` of \"age\" and 3 and prints `First + \": \" + Second`, so the output is age: 3.",
      ],
      expected: "age: 3",
      requireSource: [
        { pattern: /class\s+Pair\s*<\s*\w+\s*,\s*\w+\s*>/, message: "Define `Pair<A, B>` with two type parameters separated by a comma." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var p = new Pair<int, string>(1, "x");\n        Console.WriteLine(p.First + ": " + p.Second);\n    }\n}\n',
        expected: "1: x",
        message: "age: 3 works for Pair<string, int> only. Pair<A, B> must hold whatever types A and B are.",
      },
      starter:
        'using System;\n\n// TODO: define a generic class Pair<A, B> with First (A) and Second (B), set in the constructor\n\nclass Program\n{\n    static void Main()\n    {\n        var p = new Pair<string, int>("age", 3);\n        Console.WriteLine(p.First + ": " + p.Second);\n    }\n}\n',
      solution:
        'using System;\n\npublic class Pair<A, B>\n{\n    public A First { get; }\n    public B Second { get; }\n    public Pair(A first, B second) { First = first; Second = second; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var p = new Pair<string, int>("age", 3);\n        Console.WriteLine(p.First + ": " + p.Second);\n    }\n}\n',
    },
    {
      title: "Put them together",
      concept: "Generic method returning a generic type",
      context:
        "Generic classes and generic methods combine. `Box<T>` is already written for you. Add a generic method `Wrap<T>` that takes a `T` and returns a `Box<T>` holding it - so the method's `T` flows straight into the type it builds.",
      example:
        "// A generic method can build a generic type:\n// public Box<T> Wrap<T>(T item) => new Box<T>(item);",
      goal: [
        "Give `Wrapper` a method `public Box<T> Wrap<T>(T item)` that returns `new Box<T>(item)`.",
        "Main wraps 5 and prints the box's `Value`, so the output is 5.",
      ],
      expected: "5",
      requireSource: [
        { pattern: /Wrap\s*<\s*\w+\s*>\s*\(/, message: "Make `Wrap` generic: `public Box<T> Wrap<T>(T item)`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var wrapper = new Wrapper();\n        Console.WriteLine(wrapper.Wrap("hi").Value);\n    }\n}\n',
        expected: "hi",
        message: "5 works for an int only. Wrap<T> must wrap any type - the hidden check wraps a string.",
      },
      starter:
        "using System;\n\npublic class Box<T>\n{\n    public T Value { get; }\n    public Box(T value) { Value = value; }\n}\n\npublic class Wrapper\n{\n    // TODO: a generic method Wrap<T> that returns a new Box<T> holding item\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var wrapper = new Wrapper();\n        Box<int> box = wrapper.Wrap(5);\n        Console.WriteLine(box.Value);\n    }\n}\n",
      solution:
        "using System;\n\npublic class Box<T>\n{\n    public T Value { get; }\n    public Box(T value) { Value = value; }\n}\n\npublic class Wrapper\n{\n    public Box<T> Wrap<T>(T item) => new Box<T>(item);\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var wrapper = new Wrapper();\n        Box<int> box = wrapper.Wrap(5);\n        Console.WriteLine(box.Value);\n    }\n}\n",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "gen",
    metaLabel: "Know the language \u00b7 Generics",
    progressNoun: "Build",
    tasks,
    runnerUrl: "level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "generics_awarded",
    awardAmount: 25,
  };
})();
