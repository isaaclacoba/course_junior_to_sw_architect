// Visual for ai-23 "Did it work? Reading the trace" - a DATA-ONLY file, transcript
// panel. Every agent run leaves a trace: the exact messages, tool calls and
// results. This lesson reads a failed run to find where it went wrong
// (observability), then turns that into an automatic pass/fail check (evaluation)
// so the same bug can never sneak back in.
(function () {
  "use strict";

  const legend = [
    { sw: "#ffd479", label: "the model wrote this", round: true },
    { sw: "#37d3a6", label: "you wrote this", round: true },
    { sw: "#e0708a", label: "a tool or a check wrote this", round: true },
  ];

  const SYS = { role: "system", text: "You can call multiply(a, b). Compute the tip." };
  const Q = { role: "user", text: "What's a 15% tip on an $80 bill?" };

  const RUN = [
    SYS,
    Q,
    { role: "assistant", text: "Action: multiply(a: 80, b: 0.15)" },
    { role: "tool", by: "code", text: "Observation: 12" },
    { role: "assistant", text: "The tip is $1.20." },
  ];

  window.LESSON_CONFIG = {
    code: [],
    legend: legend,
    layout: {
      visual: [{ type: "transcript" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "A user says the tip came out wrong. All you have is the **trace** - the full record of the run: every message, every tool call, every result. This is where debugging an agent starts.",
        transcript: { caption: "The trace of a run that went wrong", messages: RUN.map((m) => ({ ...m })) },
      },
      {
        narr: "Read it top to bottom. The math the agent set up is right: 80 times 0.15. And the tool did its job - the observation comes back as **12**, which is correct. So far, nothing is broken.",
        transcript: {
          caption: "The tool call was correct",
          messages: RUN.map((m, i) => (i === 3 ? { ...m, hot: true, note: "12 is right" } : { ...m })),
        },
      },
      {
        narr: "The break is in the **last** line. The tool said 12, but the agent reported **$1.20** - it misread its own observation. Being able to point at the exact failing step, in the record, is **observability**: you can see what happened, not just that it went wrong.",
        transcript: {
          caption: "The final step misread the result",
          messages: RUN.map((m, i) => (i === 4 ? { ...m, hot: true, note: "said $1.20, but the tool returned 12" } : { ...m })),
        },
      },
      {
        narr: "Finding it once by hand is fine. But you do not want to re-read every trace forever. So turn this into a **check**: for this input, the final tip should be **$12.00**. Run it against the trace - and it **fails**, automatically.",
        transcript: {
          caption: "Turn the bug into a check",
          messages: RUN.concat([
            { role: "developer", by: "app", text: "Check: expected tip $12.00, got $1.20  ->  FAIL", hot: true },
          ]),
        },
      },
      {
        narr: "One check is a test. A folder of them - real inputs paired with the right answer - is an **eval suite**. Run it after every change and you learn, in seconds, whether you fixed the bug and whether you broke anything else.",
        transcript: {
          caption: "Many checks make an eval suite",
          messages: [
            { role: "developer", by: "app", text: "Check 1: 15% tip on $80  ->  expected $12.00" },
            { role: "developer", by: "app", text: "Check 2: 20% tip on $50  ->  expected $10.00" },
            { role: "developer", by: "app", text: "Check 3: 0% tip on $30  ->  expected $0.00" },
          ],
        },
      },
      {
        narr: "So \"did it work?\" has two parts. **Observability** - keep the trace, so you can see exactly where a run went wrong. **Evaluation** - turn each bug into a check you run every time, so it can never quietly come back. That is how an agent gets more reliable instead of just more complicated.",
        transcript: {
          caption: "Observe, then evaluate",
          messages: RUN.concat([
            { role: "developer", by: "app", text: "Check: expected $12.00, got $1.20  ->  FAIL" },
          ]),
        },
      },
    ],
  };
})();
