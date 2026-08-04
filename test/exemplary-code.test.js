// test/exemplary-code.test.js - the gate that keeps the course's OWN C# to the
// standard the course teaches.
//
// WHY THIS EXISTS
// The SOLID lesson shipped `int n = 0;`, `foreach (int h in hours)` and a bare
// `>= 6` repeated in two classes - in the very lesson whose subject is "one
// rule, one place". Students copy what they see, so example code that breaks
// the rules is broken content. Nothing caught it, because no rule existed.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.dirname(__dirname);
const load = () => import(path.join(ROOT, "tools", "validate.mjs"));

// Write a throwaway lesson whose data.js holds `code`, then run the gate on it.
function warnsFor(code) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "exemplary-"));
  try {
    const lessonDir = path.join(dir, "lesson");
    fs.mkdirSync(lessonDir, { recursive: true });
    fs.writeFileSync(path.join(lessonDir, "data.js"),
      "window.LESSON_CONFIG = " + JSON.stringify({ tasks: [{ solution: code }] }) + ";");
    const warns = [];
    const report = { warn: (m) => warns.push(m), error: () => {}, note: () => {} };
    return { warns, report, dir, lessonDir };
  } catch (e) { fs.rmSync(dir, { recursive: true, force: true }); throw e; }
}

async function run(code) {
  const { checkExemplaryCode } = await load();
  const { warns, report, dir } = warnsFor(code);
  try {
    checkExemplaryCode([{ registryId: "fake", path: "lesson", meta: { archetype: "build" } }], dir, report);
    return warns;
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

test("a single-letter local is reported", async () => {
  const warns = await run("public class C\n{\n    public void M()\n    {\n        int n = 0;\n    }\n}");
  assert.equal(warns.length, 1, warns.join("\n"));
  assert.match(warns[0], /single-letter name\(s\) `n`/);
});

test("a single-letter foreach variable is reported", async () => {
  const warns = await run("foreach (int h in hours)\n{\n}");
  assert.match(warns.join("\n"), /single-letter name\(s\) `h`/);
});

test("a rule repeated as a bare literal is reported", async () => {
  // The exact smell from the SOLID lesson: the same threshold compared in two
  // places, which is a duplicated rule wearing a number.
  const warns = await run("if (a >= 6) { }\nif (b >= 6) { }");
  assert.match(warns.join("\n"), /compares against 6 in 2 places/);
});

test("a literal compared ONCE is not reported", async () => {
  // One threshold in one place is not duplication - flagging it would train
  // authors to ignore the gate.
  const warns = await run("public bool IsHungry()\n{\n    return hoursSinceMeal >= HoursUntilHungry;\n}");
  assert.deepEqual(warns, []);
});

test("loop seeds and identity values are not magic numbers", async () => {
  const warns = await run("for (int index = 0; index < 1; index++)\n{\n}");
  assert.deepEqual(warns, []);
});

test("exemplary code produces no warnings", async () => {
  const warns = await run([
    "public class FrontDesk",
    "{",
    "    private const int HoursUntilHungry = 6;",
    "",
    "    public int HungryCount(List<int> hoursPerCat)",
    "    {",
    "        int hungryCount = 0;",
    "        foreach (int hoursSinceMeal in hoursPerCat)",
    "        {",
    "            if (hoursSinceMeal >= HoursUntilHungry)",
    "            {",
    "                hungryCount++;",
    "            }",
    "        }",
    "        return hungryCount;",
    "    }",
    "}",
  ].join("\n"));
  assert.deepEqual(warns, []);
});

test("the SOLID lesson - the one that triggered this rule - is clean", async () => {
  const { checkExemplaryCode } = await load();
  const warns = [];
  checkExemplaryCode(
    [{ registryId: "the-solid-principles", meta: { archetype: "build" },
       path: "content/practical/06-design-for-change/02-the-solid-principles" }],
    ROOT, { warn: (m) => warns.push(m), error: () => {}, note: () => {} });
  assert.deepEqual(warns, [], "the SOLID lesson must model what it teaches");
});
