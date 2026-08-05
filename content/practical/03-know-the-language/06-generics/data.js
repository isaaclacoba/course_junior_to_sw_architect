// Part three - "Generics". Write-from-scratch builds (same engine and style as
// First Builds / Data shapes). The learner has already used List<T>; now they
// define their own generic types and methods: a Box<T>, a generic method, a
// Pair<A, B>, and a generic method that returns a generic type. Each task is
// graded so the concept is unavoidable - a verify probe re-runs the learner's
// type with a different T, so a version hardcoded to int fails.
// Data only: the build plugin reads window.LESSON_CONFIG.
(function () {
  "use strict";

  const tasks = [
    {
      example: "// A property (get) plus a constructor that fills it:\npublic class Crate\n{\n    public string Label { get; }\n    public Crate(string label) { Label = label; }\n}\n\n// Box<T> has the same shape - just write T where string is.",
      expected: "7",
      requireSource: [
        {
          pattern: /class\s+Box\s*<\s*\w+\s*>/,
          message: "Define `Box<T>` with a type parameter in angle brackets."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var box = new Box<string>(\"hi\");\n        Console.WriteLine(box.Value);\n    }\n}\n",
        expected: "hi",
        message: "7 works for Box<int> only. Box<T> must hold whatever type T is - the hidden check uses a string."
      },
      starter: "using System;\n\n// TODO: define a generic class Box<T> that stores one T Value (set in the constructor)\n\nclass Program\n{\n    static void Main()\n    {\n        var box = new Box<int>(7);\n        Console.WriteLine(box.Value);\n    }\n}\n",
      goals: [
        {
          code: ["class Box<T>", "public T Value { get; }", "public Box(T value)"],
          gate: { type: "Box", member: "Value" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Box<T>\n{\n    public T Value { get; }\n    public Box(T value) { Value = value; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var box = new Box<int>(7);\n        Console.WriteLine(box.Value);\n    }\n}\n"
    },
    {
      example: "// A generic method names its placeholder after the method:\n// public T Pick<T>(T[] items) => items[0];\nvar first = new Picker().Pick(new int[] { 9, 8 });  // first is 9",
      expected: "3",
      requireSource: [
        {
          pattern: /First\s*<\s*\w+\s*>\s*\(/,
          message: "Make `First` generic: `public T First<T>(T[] items)`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var picker = new Picker();\n        Console.WriteLine(picker.First(new string[] { \"a\", \"b\" }));\n    }\n}\n",
        expected: "a",
        message: "3 works for the int array only. First<T> must return the first item of any array - the hidden check uses strings."
      },
      starter: "using System;\n\npublic class Picker\n{\n    // TODO: a generic method First<T> that returns the first item of a T[] array\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var picker = new Picker();\n        Console.WriteLine(picker.First(new int[] { 3, 4, 5 }));\n    }\n}\n",
      goals: [
        {
          code: [
            "class Picker",
            "T First(T[] items)"
          ],
          gate: { type: "Picker", member: "First" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Picker\n{\n    public T First<T>(T[] items) => items[0];\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var picker = new Picker();\n        Console.WriteLine(picker.First(new int[] { 3, 4, 5 }));\n    }\n}\n"
    },
    {
      example: "// Two properties, both filled by the constructor:\npublic class Reading\n{\n    public int Hour { get; }\n    public int Degrees { get; }\n    public Reading(int hour, int degrees) { Hour = hour; Degrees = degrees; }\n}\n\n// Pair<A, B> is the same shape, with A and B instead of int.",
      expected: "age: 3",
      requireSource: [
        {
          pattern: /class\s+Pair\s*<\s*\w+\s*,\s*\w+\s*>/,
          message: "Define `Pair<A, B>` with two type parameters separated by a comma."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var pair = new Pair<int, string>(1, \"x\");\n        Console.WriteLine(pair.First + \": \" + pair.Second);\n    }\n}\n",
        expected: "1: x",
        message: "age: 3 works for Pair<string, int> only. Pair<A, B> must hold whatever types A and B are."
      },
      starter: "using System;\n\n// TODO: define a generic class Pair<A, B> with First (A) and Second (B), set in the constructor\n\nclass Program\n{\n    static void Main()\n    {\n        var pair = new Pair<string, int>(\"age\", 3);\n        Console.WriteLine(pair.First + \": \" + pair.Second);\n    }\n}\n",
      goals: [
        {
          code: ["class Pair<A, B>", "public A First { get; }", "public B Second { get; }", "public Pair(A first, B second)"],
          gate: { type: "Pair", member: "First" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Pair<A, B>\n{\n    public A First { get; }\n    public B Second { get; }\n    public Pair(A first, B second) { First = first; Second = second; }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var pair = new Pair<string, int>(\"age\", 3);\n        Console.WriteLine(pair.First + \": \" + pair.Second);\n    }\n}\n"
    },
    {
      example: "// A generic method can build a generic type:\n// public Box<T> Wrap<T>(T item) => new Box<T>(item);",
      expected: "5",
      requireSource: [
        {
          pattern: /Wrap\s*<\s*\w+\s*>\s*\(/,
          message: "Make `Wrap` generic: `public Box<T> Wrap<T>(T item)`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var wrapper = new Wrapper();\n        Console.WriteLine(wrapper.Wrap(\"hi\").Value);\n    }\n}\n",
        expected: "hi",
        message: "5 works for an int only. Wrap<T> must wrap any type - the hidden check wraps a string."
      },
      starter: "using System;\n\npublic class Box<T>\n{\n    public T Value { get; }\n    public Box(T value) { Value = value; }\n}\n\npublic class Wrapper\n{\n    // TODO: a generic method Wrap<T> that returns a new Box<T> holding item\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var wrapper = new Wrapper();\n        Box<int> box = wrapper.Wrap(5);\n        Console.WriteLine(box.Value);\n    }\n}\n",
      goals: [
        {
          code: [
            "class Wrapper",
            "Box Wrap(T item)"
          ],
          gate: { type: "Wrapper", member: "Wrap" }
        },
        { gate: null }
      ],
      solution: "using System;\n\npublic class Box<T>\n{\n    public T Value { get; }\n    public Box(T value) { Value = value; }\n}\n\npublic class Wrapper\n{\n    public Box<T> Wrap<T>(T item) => new Box<T>(item);\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var wrapper = new Wrapper();\n        Box<int> box = wrapper.Wrap(5);\n        Console.WriteLine(box.Value);\n    }\n}\n"
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "gen",
    metaLabel: "Know the language · Generics",
    progressNoun: "Build",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "generics_awarded",
    awardAmount: 25,
  };
})();
