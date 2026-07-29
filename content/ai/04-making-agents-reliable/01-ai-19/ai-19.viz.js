// Visual for ai-19 "Workflow or agent?" - a DATA-ONLY file, planboard panel.
// It contrasts a workflow (fixed steps, known path, run in order) with an agent
// (steps chosen at runtime, path discovered as it goes). The takeaway from
// Anthropic's guidance: reach for the simplest thing that works, and only add
// agency when the path can't be scripted ahead of time.
(function () {
  "use strict";

  const legend = [
    { sw: "#ffd479", label: "the step being worked now" },
    { sw: "#37d3a6", label: "a finished step" },
    { sw: "#e0708a", label: "a step that had to change the plan" },
  ];

  window.LESSON_VIZ = {
    code: [],
    legend: legend,
    layout: {
      visual: [{ type: "planboard" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "\"Agent\" is not always the answer. Here is a job with a known path: summarise an article, then translate the summary. You can write those steps down in advance, every single time.",
        plan: {
          caption: "A workflow - fixed steps",
          goal: "Summarise an article, then translate it",
          steps: [
            { text: "Fetch the article text" },
            { text: "Summarise it" },
            { text: "Translate the summary to Spanish" },
          ],
        },
      },
      {
        narr: "A **workflow** runs those fixed steps in order. No decisions, no surprises - the path never changes. It is cheap, predictable, and easy to test. For a known task, reach for this first.",
        plan: {
          caption: "It runs the same way every time",
          goal: "Summarise an article, then translate it",
          steps: [
            { text: "Fetch the article text", state: "done" },
            { text: "Summarise it", state: "done" },
            { text: "Translate the summary to Spanish", state: "done" },
          ],
        },
      },
      {
        narr: "Now a different job: find out why last night's deployment failed. There is no script for this - you do not know the steps until you start looking. The path has to be **discovered**.",
        plan: {
          caption: "A job with no fixed path",
          goal: "Find out why last night's deployment failed",
          steps: [],
        },
      },
      {
        narr: "An **agent** chooses its next step at runtime. It has no pre-written plan; it decides what to do based on what it has seen so far. First move: read the deploy logs.",
        plan: {
          caption: "An agent - steps chosen as it goes",
          goal: "Find out why last night's deployment failed",
          steps: [{ text: "Read the deploy logs", state: "active" }],
        },
      },
      {
        narr: "The logs say \"out of memory\". A workflow could not have known to ask that - but the agent **adapts**: the new step it picks depends on what the last one turned up. That is the whole difference.",
        plan: {
          caption: "It adapts to what it finds",
          goal: "Find out why last night's deployment failed",
          steps: [
            { text: "Read the deploy logs", state: "done", note: "out of memory" },
            { text: "Check the memory limit in the config", state: "active" },
          ],
        },
      },
      {
        narr: "So the rule of thumb: if you can write the steps down ahead of time, build a **workflow** - it is simpler, cheaper, and easier to trust. Only reach for an **agent** when the path has to be worked out on the fly. Agency is a cost you pay when you need it, not a default.",
        plan: {
          caption: "Pick the simplest thing that works",
          goal: "Find out why last night's deployment failed",
          steps: [
            { text: "Read the deploy logs", state: "done", note: "out of memory" },
            { text: "Check the memory limit in the config", state: "done", note: "set too low" },
            { text: "Raise the limit and note the fix", state: "done" },
          ],
        },
      },
    ],
  };
})();
