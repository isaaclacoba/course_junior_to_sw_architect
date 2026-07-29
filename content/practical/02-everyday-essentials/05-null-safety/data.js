// Unit 2 - "C# up close": Null-safety. Write-from-scratch builds.
// Data only: build-engine.js reads window.BUILD_CONFIG (loaded after this file).
// Portable idea: a value may be absent ("no value"), and robust code handles
// that case instead of crashing on it. C# is the surface (`??`, `?.`, `int?`,
// `??=`); the concept exists in every language (null / nil / None / optional).
// Culture-safe: every task prints strings, ints or booleans - never a raw
// double/decimal (the browser locale would decide the separator).
(function () {
  "use strict";

  const tasks = [
    {
      title: "Fall back when there is nothing",
      concept: "Default with ??",
      context:
        "Sometimes a value is simply **absent** - a name nobody filled in, a lookup that found nothing. In C# an absent value is `null`. Ask for its length and the program crashes.\n\nThe safe move is to supply a fallback: *use this value, or that default when there is nothing*. C# writes it with `??` - `given ?? \"stray\"` means \"`given`, unless it is `null`, in which case `\"stray\"`\".\n\nWrite a `Shelter` whose `NameOr(string? given)` returns the name it is handed, or `\"stray\"` when that name is `null`.",
      example:
        "public class Volume\n{\n    public int OrMute(int? level)\n    {\n        return level ?? 0;\n    }\n}",
      goal: [
        "Give `Shelter` a `string NameOr(string? given)` that returns `given`, or `\"stray\"` when `given` is `null`.",
        "`Main` calls `NameOr(null)`, so the output is `stray`.",
      ],
      expected: "stray",
      requireSource: [
        { pattern: /\?\?/, message: "Supply the fallback with `??`: `given ?? \"stray\"`." },
        { pattern: /string\s+NameOr\s*\(\s*string\?/, message: "Give `Shelter` a `string NameOr(string? given)` method - the parameter is `string?` because it may be `null`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        System.Console.WriteLine(shelter.NameOr("Rex"));\n        System.Console.WriteLine(shelter.NameOr(null));\n    }\n}\n',
        expected: ["Rex", "stray"],
        message: "`NameOr` must use the name when there is one and fall back only when it is `null` - `\"Rex\"` should stay `Rex`, and `null` should become `stray`.",
      },
      starter:
        'using System;\n\npublic class Shelter\n{\n    public string NameOr(string? given)\n    {\n        // TODO: return given, but use "stray" instead when given is null\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        Console.WriteLine(shelter.NameOr(null));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Shelter\n{\n    public string NameOr(string? given)\n    {\n        return given ?? "stray";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var shelter = new Shelter();\n        Console.WriteLine(shelter.NameOr(null));\n    }\n}\n',
    },
    {
      title: "Reach through something that might be missing",
      concept: "Safe call with ?.",
      context:
        "It is not only plain values that go missing - a whole **object** can be absent. If `pet` is `null`, then `pet.Name` crashes: you cannot ask a nothing for its name.\n\nMany languages give you a *safe* way to reach through: if the thing is there, follow the dot; if it is `null`, stop and hand back `null` instead of crashing. C# writes this with `?.` - `pet?.Name` is the pet's name when there is a pet, and `null` when there is not.\n\nWrite a `Tag` whose `Greet(Pet? pet)` returns the pet's `Name`, or `\"nobody\"` when the pet itself is `null`.",
      example:
        "public class Report\n{\n    public string Owner(Account? account)\n    {\n        return account?.Holder ?? \"none\";\n    }\n}",
      goal: [
        "Give `Tag` a `string Greet(Pet? pet)` that returns `pet?.Name`, falling back to `\"nobody\"` when `pet` is `null`.",
        "`Main` calls `Greet(null)`, so the output is `nobody`.",
      ],
      expected: "nobody",
      requireSource: [
        { pattern: /\?\./, message: "Reach through safely with `?.`: `pet?.Name` avoids the crash when `pet` is `null`." },
        { pattern: /string\s+Greet\s*\(\s*Pet\?/, message: "Give `Tag` a `string Greet(Pet? pet)` method - the parameter is `Pet?` because the whole pet may be `null`." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        var pet = new Pet();\n        pet.Name = "Milo";\n        System.Console.WriteLine(tag.Greet(pet));\n        System.Console.WriteLine(tag.Greet(null));\n    }\n}\n',
        expected: ["Milo", "nobody"],
        message: "`Greet` must read the real pet's name when there is one, and only fall back for `null` - `Milo` should come back, `null` should read `nobody`.",
      },
      starter:
        'using System;\n\npublic class Pet\n{\n    public string Name = "";\n}\n\npublic class Tag\n{\n    public string Greet(Pet? pet)\n    {\n        // TODO: return the pet\'s Name, but "nobody" when the pet itself is null\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        Console.WriteLine(tag.Greet(null));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Pet\n{\n    public string Name = "";\n}\n\npublic class Tag\n{\n    public string Greet(Pet? pet)\n    {\n        return pet?.Name ?? "nobody";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var tag = new Tag();\n        Console.WriteLine(tag.Greet(null));\n    }\n}\n',
    },
    {
      title: "A number that might not be there",
      concept: "Nullable value type int?",
      context:
        "A plain `int` always holds some number - there is no room in it for \"no value\". But sometimes you genuinely do not have one yet: an age nobody entered, a score not recorded.\n\nC# lets a value type opt in to being absent by adding `?`: an `int?` is either a real number or `null`. Before you use the number, you check: is there one? Ask `age == null` (or `age.HasValue`), and reach for the number with `age.Value` only once you know it is there.\n\nWrite a `Vet` whose `Describe(int? age)` returns `\"unknown\"` when the age is `null`, and otherwise `\"age \"` followed by the number.",
      example:
        "public class Weather\n{\n    public string Read(int? temp)\n    {\n        if (temp == null) return \"no reading\";\n        return \"temp \" + temp.Value;\n    }\n}",
      goal: [
        "Give `Vet` a `string Describe(int? age)` that returns `\"unknown\"` when `age` is `null`.",
        "Otherwise return `\"age \"` joined with the number, so `Describe(4)` reads `age 4`.",
        "`Main` calls `Describe(null)`, so the output is `unknown`.",
      ],
      expected: "unknown",
      requireSource: [
        { pattern: /int\?/, message: "Take an `int?` - a number that is allowed to be `null`." },
        { pattern: /string\s+Describe\s*\(\s*int\?/, message: "Give `Vet` a `string Describe(int? age)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var vet = new Vet();\n        System.Console.WriteLine(vet.Describe(4));\n        System.Console.WriteLine(vet.Describe(null));\n    }\n}\n',
        expected: ["age 4", "unknown"],
        message: "`Describe` must report the real number when there is one and only say `unknown` for `null` - `4` should read `age 4`, `null` should read `unknown`.",
      },
      starter:
        'using System;\n\npublic class Vet\n{\n    public string Describe(int? age)\n    {\n        // TODO: return "unknown" when age is null, else "age " + the number\n        return "age 0";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var vet = new Vet();\n        Console.WriteLine(vet.Describe(null));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Vet\n{\n    public string Describe(int? age)\n    {\n        if (age == null)\n        {\n            return "unknown";\n        }\n        return "age " + age.Value;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var vet = new Vet();\n        Console.WriteLine(vet.Describe(null));\n    }\n}\n',
    },
    {
      title: "Set a default only when it is empty",
      concept: "Assign-if-null with ??=",
      context:
        "A common need: fill a slot with a default, but only if nothing is there yet - never overwrite a value someone already gave.\n\nYou could write it the long way (`if (occupant == null) occupant = \"guest\";`). C# has a shorthand that does exactly that: `??=` assigns the right-hand value **only when the left side is `null`**. `occupant ??= \"guest\"` leaves a real occupant untouched and fills in `\"guest\"` when the slot is empty.\n\nWrite a `Kennel` with a `string? occupant` field and a `CheckIn(string? given)` that stores `given`, defaults it to `\"guest\"` when `given` is `null`, and returns the occupant.",
      example:
        "public class Session\n{\n    private string? user;\n\n    public string Login(string? name)\n    {\n        user = name;\n        user ??= \"anonymous\";\n        return user;\n    }\n}",
      goal: [
        "Give `Kennel` a `string? occupant` field and a `string CheckIn(string? given)` method.",
        "Store `given` in `occupant`, then use `??=` to default it to `\"guest\"` when it is `null`, and return it.",
        "`Main` calls `CheckIn(null)`, so the output is `guest`.",
      ],
      expected: "guest",
      requireSource: [
        { pattern: /\?\?=/, message: "Fill the empty slot with `??=`: `occupant ??= \"guest\"` only assigns when `occupant` is `null`." },
        { pattern: /string\s+CheckIn\s*\(\s*string\?/, message: "Give `Kennel` a `string CheckIn(string? given)` method." },
      ],
      verify: {
        main:
          'class Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        System.Console.WriteLine(kennel.CheckIn("Rex"));\n        System.Console.WriteLine(kennel.CheckIn(null));\n    }\n}\n',
        expected: ["Rex", "guest"],
        message: "`CheckIn` must keep a real occupant and only fill in the default for `null` - `\"Rex\"` should stay `Rex`, and `null` should become `guest`.",
      },
      starter:
        'using System;\n\npublic class Kennel\n{\n    private string? occupant;\n\n    public string CheckIn(string? given)\n    {\n        occupant = given;\n        // TODO: when occupant is null, make it "guest", then return occupant\n        return "";\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        Console.WriteLine(kennel.CheckIn(null));\n    }\n}\n',
      solution:
        'using System;\n\npublic class Kennel\n{\n    private string? occupant;\n\n    public string CheckIn(string? given)\n    {\n        occupant = given;\n        occupant ??= "guest";\n        return occupant;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var kennel = new Kennel();\n        Console.WriteLine(kennel.CheckIn(null));\n    }\n}\n',
    },
    {
      summary: true,
      title: "What you learned",
      concept: "Handling the absent case",
      context: "Four ways to meet a value that might not be there - so a missing value bends your program instead of breaking it.",
      summaryIntro:
        "Every language has a way to say \"there is nothing here\" - C# calls it `null`. The danger is not the absence itself; it is code that assumes a value is always present. You handled the absent case four ways:",
      summaryItems: [
        { title: "Fall back with `??` - ", text: "`given ?? \"stray\"` uses the value when there is one and a default when it is `null`." },
        { title: "Reach through safely with `?.` - ", text: "`pet?.Name` follows the dot when the object is there and stops at `null` instead of crashing." },
        { title: "Let a number be absent with `int?` - ", text: "an `int?` is either a real number or `null`; check first, then read `.Value`." },
        { title: "Default only when empty with `??=` - ", text: "`occupant ??= \"guest\"` fills the slot only when it is `null`, never overwriting a real value." },
      ],
      summaryClose:
        "The portable habit outlasts the operators: wherever a value can be absent, decide what absent means here - a default, a safe skip, or a clear \"unknown\" - rather than letting it crash. Other languages spell it `null`, `nil`, `None`, or an optional; the thinking is the same.",
    },
  ];

  window.BUILD_CONFIG = {
    prefix: "ns",
    metaLabel: "Everyday essentials \u00b7 Null-safety",
    progressNoun: "Step",
    tasks,
    runnerUrl: "../../../../level3-app/index.html?runner=1",
    xpKey: "course_global_xp",
    awardedKey: "null_safety_awarded",
    awardAmount: 20,
  };
})();
