// Visual for ai-18 "Reflection" - a DATA-ONLY file, transcript panel.
// It shows the reflection pattern: the model drafts an answer, is asked to
// critique its own work, finds a real bug, and revises. Draft -> critique ->
// revise, the loop that turns a first guess into a better answer.
(function () {
  "use strict";

  const legend = [
    { sw: "#ffd479", label: "the model wrote this", round: true },
    { sw: "#37d3a6", label: "you wrote this", round: true },
    { sw: "#7baaff", label: "your app wrote this", round: true },
  ];

  const SYS = { role: "system", text: "You are a Python assistant." };
  const Q = { role: "user", text: "Write a function that returns the average of a list of numbers." };
  const DRAFT = {
    role: "assistant",
    text: "def average(xs):\n    return sum(xs) / len(xs)",
  };

  window.LESSON_VIZ = {
    code: [],
    legend: legend,
    layout: {
      visual: [{ type: "transcript" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "A small task with an easy-to-miss trap. Watch the first answer - it looks right.",
        transcript: { caption: "The task", messages: [SYS, Q] },
      },
      {
        narr: "The **draft**. Clean, readable, and correct for a normal list. But a first pass rarely covers the edges - and this one hides a crash.",
        transcript: {
          caption: "The first draft",
          messages: [SYS, Q, { ...DRAFT, hot: true, note: "looks fine - but what about an empty list?" }],
        },
      },
      {
        narr: "Instead of shipping it, we turn the model back on its own work: **check your answer for bugs and edge cases**. Reviewing is a different, easier task than writing - and the model is often good at it.",
        transcript: {
          caption: "Ask it to review itself",
          messages: [
            SYS,
            Q,
            DRAFT,
            { role: "user", text: "Now check your own answer for bugs and edge cases.", hot: true },
          ],
        },
      },
      {
        narr: "The **critique**. Reading its own code, the model spots what it missed while writing: an empty list divides by zero and crashes. It found its own bug.",
        transcript: {
          caption: "The self-critique",
          messages: [
            SYS,
            Q,
            DRAFT,
            { role: "user", text: "Now check your own answer for bugs and edge cases." },
            {
              role: "assistant",
              text: "Bug: an empty list makes len(xs) == 0, so this divides by zero and raises an error.",
              hot: true,
            },
          ],
        },
      },
      {
        narr: "The **revision**. With the flaw named, the fix is obvious - handle the empty list first. The second answer is better than the first because the model got to see the first.",
        transcript: {
          caption: "The revised answer",
          messages: [
            SYS,
            Q,
            DRAFT,
            { role: "user", text: "Now check your own answer for bugs and edge cases." },
            { role: "assistant", text: "Bug: an empty list makes len(xs) == 0, so this divides by zero and raises an error." },
            {
              role: "assistant",
              text: "def average(xs):\n    if not xs:\n        return 0\n    return sum(xs) / len(xs)",
              hot: true,
            },
          ],
        },
      },
      {
        narr: "That is **reflection**: draft, critique, revise. It is not magic - the model is not smarter the second time - but a fresh pass over its own output catches mistakes a single shot misses. Agents use it to review a plan, re-read a tool result, or double-check an answer before they commit to it.",
        transcript: {
          caption: "Draft, critique, revise",
          messages: [
            SYS,
            Q,
            DRAFT,
            { role: "user", text: "Now check your own answer for bugs and edge cases." },
            { role: "assistant", text: "Bug: an empty list makes len(xs) == 0, so this divides by zero and raises an error." },
            { role: "assistant", text: "def average(xs):\n    if not xs:\n        return 0\n    return sum(xs) / len(xs)" },
          ],
        },
      },
    ],
  };
})();
