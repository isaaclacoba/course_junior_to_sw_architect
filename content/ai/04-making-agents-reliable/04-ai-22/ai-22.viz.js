// Visual for ai-22 "Hallucination and grounding" - a DATA-ONLY file, transcript
// panel. A model will answer confidently even when it does not know - it predicts
// plausible text, not verified truth. The fix is grounding: pull the real source
// into the context and answer from it, cite it, and let the model say "I don't
// know" instead of inventing.
(function () {
  "use strict";

  const legend = [
    { sw: "#ffd479", label: "the model wrote this", round: true },
    { sw: "#37d3a6", label: "you wrote this", round: true },
    { sw: "#e0708a", label: "a source the tool pulled in", round: true },
  ];

  const SYS = { role: "system", text: "You answer questions about our company's policies." };
  const Q = { role: "user", text: "What's our refund window for enterprise plans?" };

  window.LESSON_CONFIG = {
    code: [],
    legend: legend,
    layout: {
      visual: [{ type: "transcript" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "A question about a specific fact - your company's own policy. The model was never told this. Watch how it answers anyway.",
        transcript: { caption: "A question it wasn't told the answer to", messages: [SYS, Q] },
      },
      {
        narr: "It gives a crisp, confident number: 60 days. It **sounds** authoritative - but it is invented. A model predicts plausible text; \"60-day refund window\" is a plausible sentence, so out it comes. That confident-but-wrong answer is a **hallucination**.",
        transcript: {
          caption: "A confident guess",
          messages: [
            SYS,
            Q,
            { role: "assistant", text: "Enterprise plans have a 60-day refund window.", hot: true, note: "sounds sure - but nobody checked" },
          ],
        },
      },
      {
        narr: "The problem is not that the model lies. It has no source to check against, so it fills the gap with something that reads right. The fix is to **give** it a source - so before it answers, we fetch the real policy.",
        transcript: {
          caption: "Fetch the real source first",
          messages: [
            SYS,
            Q,
            { role: "tool", by: "code", text: "policy.md: \"Enterprise refunds are available within 30 days of purchase.\"", hot: true },
          ],
        },
      },
      {
        narr: "Now the model answers from text in front of it, not from memory: **30 days**, straight from the policy. Same question, but this time the answer is **grounded** - anchored to a real source it could quote.",
        transcript: {
          caption: "Answer grounded in the source",
          messages: [
            SYS,
            Q,
            { role: "tool", by: "code", text: "policy.md: \"Enterprise refunds are available within 30 days of purchase.\"" },
            { role: "assistant", text: "Per our policy, enterprise refunds are available within 30 days of purchase.", hot: true },
          ],
        },
      },
      {
        narr: "It helps to ask for the **citation** too - which line it used - so a person can check. And crucially, the model must be allowed to say **\"I don't know\"** when the source does not cover it, instead of reaching for a plausible guess.",
        transcript: {
          caption: "Cite it - and allow \"I don't know\"",
          messages: [
            SYS,
            Q,
            { role: "tool", by: "code", text: "policy.md: \"Enterprise refunds are available within 30 days of purchase.\"" },
            { role: "assistant", text: "Per our policy, enterprise refunds are available within 30 days of purchase. (Source: policy.md)" },
            { role: "user", text: "And what about the annual plan?", hot: true },
          ],
        },
      },
      {
        narr: "The source says nothing about annual plans, so the honest answer is to say so - not to invent one. That is **grounding**: pull in the real source, answer from it, cite it, and prefer \"I don't know\" over a confident guess. It is the single biggest thing that makes an agent trustworthy.",
        transcript: {
          caption: "Honest beats plausible",
          messages: [
            SYS,
            Q,
            { role: "tool", by: "code", text: "policy.md: \"Enterprise refunds are available within 30 days of purchase.\"" },
            { role: "assistant", text: "Per our policy, enterprise refunds are available within 30 days of purchase. (Source: policy.md)" },
            { role: "user", text: "And what about the annual plan?" },
            { role: "assistant", text: "The policy I have doesn't mention annual plans, so I can't say - I'd check with billing.", hot: true },
          ],
        },
      },
    ],
  };
})();
