// Unit 2 - "C# up close": Null-safety. Write-from-scratch builds.
// Data only: build-engine.js reads window.LESSON_CONFIG (loaded after this file).
// Portable idea: a value may be absent ("no value"), and robust code handles
// that case instead of crashing on it. C# is the surface (`??`, `?.`, `int?`,
// `??=`); the concept exists in every language (null / nil / None / optional).
// Culture-safe: every task prints strings, ints or booleans - never a raw
// double/decimal (the browser locale would decide the separator).
(function () {
  "use strict";

  const tasks = [
    {
      example: "public class Volume\n{\n    public int OrMute(int? level)\n    {\n        return level ?? 0;\n    }\n}",
      expected: "stray",
      requireSource: [
        {
          pattern: /\?\?/,
          message: "Supply the fallback with `??`: `given ?? \"stray\"`."
        },
        {
          pattern: /string\s+NameOr\s*\(\s*string\?/,
          message: "Give `Shelter` a `string NameOr(string? given)` method - the parameter is `string?` because it may be `null`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        System.Console.WriteLine(shelter.NameOr(\"Rex\"));\n        System.Console.WriteLine(shelter.NameOr(null));\n    }\n}\n",
        expected: [
          "Rex",
          "stray"
        ],
        message: "`NameOr` must use the name when there is one and fall back only when it is `null` - `\"Rex\"` should stay `Rex`, and `null` should become `stray`."
      },
      starter: "using System;\n\npublic class Shelter\n{\n    public string NameOr(string? given)\n    {\n        // TODO: return given, but use \"stray\" instead when given is null\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        Console.WriteLine(shelter.NameOr(null));\n    }\n}\n",
      solution: "using System;\n\npublic class Shelter\n{\n    public string NameOr(string? given)\n    {\n        return given ?? \"stray\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        Console.WriteLine(shelter.NameOr(null));\n    }\n}\n"
    },
    {
      example: "public class Report\n{\n    public string Owner(Account? account)\n    {\n        return account?.Holder ?? \"none\";\n    }\n}",
      expected: "nobody",
      requireSource: [
        {
          pattern: /\?\./,
          message: "Reach through safely with `?.`: `pet?.Name` avoids the crash when `pet` is `null`."
        },
        {
          pattern: /string\s+Greet\s*\(\s*Pet\?/,
          message: "Give `Tag` a `string Greet(Pet? pet)` method - the parameter is `Pet?` because the whole pet may be `null`."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        var pet = new Pet();\n        pet.Name = \"Milo\";\n        System.Console.WriteLine(tag.Greet(pet));\n        System.Console.WriteLine(tag.Greet(null));\n    }\n}\n",
        expected: [
          "Milo",
          "nobody"
        ],
        message: "`Greet` must read the real pet's name when there is one, and only fall back for `null` - `Milo` should come back, `null` should read `nobody`."
      },
      starter: "using System;\n\npublic class Pet\n{\n    public string Name = \"\";\n}\n\npublic class Tag\n{\n    public string Greet(Pet? pet)\n    {\n        // TODO: return the pet's Name, but \"nobody\" when the pet itself is null\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        Console.WriteLine(tag.Greet(null));\n    }\n}\n",
      solution: "using System;\n\npublic class Pet\n{\n    public string Name = \"\";\n}\n\npublic class Tag\n{\n    public string Greet(Pet? pet)\n    {\n        return pet?.Name ?? \"nobody\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        Console.WriteLine(tag.Greet(null));\n    }\n}\n"
    },
    {
      example: "public class Weather\n{\n    public string Read(int? temp)\n    {\n        if (temp == null) return \"no reading\";\n        return \"temp \" + temp.Value;\n    }\n}",
      expected: "unknown",
      requireSource: [
        {
          pattern: /int\?/,
          message: "Take an `int?` - a number that is allowed to be `null`."
        },
        {
          pattern: /string\s+Describe\s*\(\s*int\?/,
          message: "Give `Vet` a `string Describe(int? age)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var vet = new Vet();\n        System.Console.WriteLine(vet.Describe(4));\n        System.Console.WriteLine(vet.Describe(null));\n    }\n}\n",
        expected: [
          "age 4",
          "unknown"
        ],
        message: "`Describe` must report the real number when there is one and only say `unknown` for `null` - `4` should read `age 4`, `null` should read `unknown`."
      },
      starter: "using System;\n\npublic class Vet\n{\n    public string Describe(int? age)\n    {\n        // TODO: return \"unknown\" when age is null, else \"age \" + the number\n        return \"age 0\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var vet = new Vet();\n        Console.WriteLine(vet.Describe(null));\n    }\n}\n",
      solution: "using System;\n\npublic class Vet\n{\n    public string Describe(int? age)\n    {\n        if (age == null)\n        {\n            return \"unknown\";\n        }\n        return \"age \" + age.Value;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var vet = new Vet();\n        Console.WriteLine(vet.Describe(null));\n    }\n}\n"
    },
    {
      example: "public class Session\n{\n    private string? user;\n\n    public string Login(string? name)\n    {\n        user = name;\n        user ??= \"anonymous\";\n        return user;\n    }\n}",
      expected: "guest",
      requireSource: [
        {
          pattern: /\?\?=/,
          message: "Fill the empty slot with `??=`: `occupant ??= \"guest\"` only assigns when `occupant` is `null`."
        },
        {
          pattern: /string\s+CheckIn\s*\(\s*string\?/,
          message: "Give `Kennel` a `string CheckIn(string? given)` method."
        }
      ],
      verify: {
        main: "class Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        System.Console.WriteLine(kennel.CheckIn(\"Rex\"));\n        System.Console.WriteLine(kennel.CheckIn(null));\n    }\n}\n",
        expected: [
          "Rex",
          "guest"
        ],
        message: "`CheckIn` must keep a real occupant and only fill in the default for `null` - `\"Rex\"` should stay `Rex`, and `null` should become `guest`."
      },
      starter: "using System;\n\npublic class Kennel\n{\n    private string? occupant;\n\n    public string CheckIn(string? given)\n    {\n        occupant = given;\n        // TODO: when occupant is null, make it \"guest\", then return occupant\n        return \"\";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        Console.WriteLine(kennel.CheckIn(null));\n    }\n}\n",
      solution: "using System;\n\npublic class Kennel\n{\n    private string? occupant;\n\n    public string CheckIn(string? given)\n    {\n        occupant = given;\n        occupant ??= \"guest\";\n        return occupant;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        Console.WriteLine(kennel.CheckIn(null));\n    }\n}\n"
    },
    {
      summary: true
    }
  ];

  window.LESSON_CONFIG = {
    prefix: "ns",
    metaLabel: "Everyday essentials · Null-safety",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "null_safety_awarded",
    awardAmount: 20,
  };
})();
