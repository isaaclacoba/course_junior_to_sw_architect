// Visual for ai-5 "The context window" - a DATA-ONLY file. It reuses the `agent`
// panel to show that context has a fixed size in tokens; when it fills, the
// oldest tokens drop off the start and the model can no longer see them.
(function () {
  "use strict";

  // The running conversation, oldest first. Every token is text the model has
  // read; the window decides how many of them it can still see.
  const CONV = [
    "Luna", "is", "a", "cat", ".",
    "She", "loves", "tuna", ".",
    "She", "naps", "all", "day", ".",
    "What", "is", "her", "name", "?",
  ];

  // Build the strip: the first `drop` tokens have fallen out of the window
  // (kind "dropped"); the rest are still in view (kind "context").
  const strip = (count, drop) =>
    CONV.slice(0, count).map((t, i) => ({ t, kind: i < drop ? "dropped" : "context" }));

  const core = (live) => ({ label: "LLM", sub: "sees only the window", live: live });

  const scene = (caption, count, drop, opts) =>
    Object.assign(
      {
        stripCaption: caption,
        tokens: strip(count, drop),
        windowLabel: "context window",
        caret: true,
        core: core(false),
        fan: null,
      },
      opts || {}
    );

  window.LESSON_VIZ = {
    code: [],
    legend: [
      { sw: "#8fb7ab", label: "in the window (still visible)" },
      { sw: "#5f7b74", label: "dropped (out of the window)" },
      { sw: "#37d3a6", label: "edge of the window", round: true },
    ],
    layout: {
      visual: [{ type: "agent", fan: false }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "The context you just met is not unlimited. It has a maximum size - the **context window** - measured in tokens.",
        agent: scene("The context window - a fixed number of tokens", 8, 0),
      },
      {
        narr: "Everything the model can see has to fit inside this window at once. Keep talking and it fills up.",
        agent: scene("Filling the window", 13, 0),
      },
      {
        narr: "When the window is full, the **oldest tokens drop off the start**. They are still part of the conversation - but the model can no longer see them.",
        agent: scene("Full - oldest tokens fall off", 18, 5, { core: core(true) }),
      },
      {
        narr: "That dropped text is gone from view. Ask about it now and the model guesses, just as it did with no context - because for those tokens, it has none.",
        agent: scene("Out of view, out of mind", 19, 8, { core: core(true) }),
      },
      {
        narr: "This is why a long chat seems to **forget** how it began. A bigger window pushes that point further out, but every model still has one.",
        agent: scene("A bigger window still has an edge", 19, 8),
      },
      {
        narr: "So the context window is the model's short-term view - a fixed budget of tokens. To hold on to anything beyond it, you need **memory**.",
        agent: scene("A fixed budget of tokens", 19, 8, { caret: false }),
      },
    ],
  };
})();
