// Visual for ai-9 "Steering: system and user messages" - a DATA-ONLY file. It sits
// in Part five (after "The prompt") and reuses the `agent` strip with its system
// (blue) and user (teal) token kinds. The same user question, with two different
// system messages, produces two different replies - so the system message is the
// lever you steer with. No fan; no engine change.
(function () {
  "use strict";

  const system = (list) => list.map((t) => ({ t, kind: "system" }));
  const user = (list) => list.map((t) => ({ t, kind: "user" }));
  const gen = (list) => list.map((t) => ({ t, kind: "gen" }));

  const core = (sub, live) => ({ label: "LLM", sub: sub, live: live });

  const ASK = ["Explain", "gravity", "."];
  const SYS_TERSE = ["You", "are", "a", "terse", "expert", "."];
  const SYS_KID = ["You", "are", "a", "playful", "teacher", "for", "kids", "."];
  const REPLY_TERSE = ["Mass", "attracts", "mass", ".", "More", "mass", ",", "stronger", "pull", "."];
  const REPLY_KID = ["Earth", "gives", "everything", "a", "big", "hug", "that", "never", "lets", "go", "!"];

  window.LESSON_VIZ = {
    code: [],
    legend: [
      { sw: "#7baaff", label: "system message (role and rules)" },
      { sw: "#37d3a6", label: "user message (what you type)" },
      { sw: "#ffd479", label: "the model's reply", round: true },
    ],
    layout: {
      visual: [{ type: "agent", fan: false }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "The message you type is the **user** message - your actual question or request.",
        agent: {
          stripCaption: "What you type",
          tokens: user(ASK),
          caret: true,
          core: core("reads its context", false),
        },
      },
      {
        narr: "But there is usually a second message you never see. Before your turn, the app adds a **system** message that sets the model's role and rules.",
        agent: {
          stripCaption: "A hidden system message comes first",
          tokens: [...system(SYS_TERSE), ...user(ASK)],
          caret: true,
          core: core("reads its context", false),
        },
      },
      {
        narr: "The model reads both as one context. The user message says **what** to answer; the system message steers **how** it answers.",
        agent: {
          stripCaption: "Both are context - different jobs",
          tokens: [...system(SYS_TERSE), ...user(ASK)],
          caret: true,
          core: core("system steers, user asks", true),
        },
      },
      {
        narr: "With a `terse expert` system message, the reply is short and dry.",
        agent: {
          stripCaption: "Terse expert - a plain answer",
          tokens: [...system(SYS_TERSE), ...user(ASK), ...gen(REPLY_TERSE)],
          caret: false,
          core: core("text in, text out", false),
        },
      },
      {
        narr: "Now change **only** the system message - the question is word-for-word the same - and the whole tone changes.",
        agent: {
          stripCaption: "Same question, new system message",
          tokens: [...system(SYS_KID), ...user(ASK), ...gen(REPLY_KID)],
          caret: false,
          core: core("text in, text out", false),
        },
      },
      {
        narr: "So the system message is your steering wheel: set the role and the rules there, and let the user turn stay just the question. It is the simplest way to shape how a model behaves.",
        agent: {
          stripCaption: "Steer with the system message",
          tokens: [...system(SYS_KID), ...user(ASK)],
          caret: false,
          core: core("reads its context", false),
        },
      },
    ],
  };
})();
