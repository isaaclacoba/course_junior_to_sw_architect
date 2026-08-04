// Visual for ai-13 "What a run really is: the transcript" - a DATA-ONLY file. It
// uses the `transcript` panel: the growing list of role-tagged messages the model
// re-reads on every call. After ai-6..ai-8 built up memory, tools and the loop,
// this lesson pulls the curtain back - the whole thing is one list of text. The
// crux truths it makes visible: the model only ever writes an `assistant` message
// (even a tool call is just text it writes); a `tool` result is written by YOUR
// code, not the model; "memory" is just this list being re-sent every call; and
// instructions live as ordinary text near the top of the same list.
(function () {
  "use strict";

  // The messages of one short run, built up as the run proceeds. Each factory
  // takes the per-step flags (spotlight + optional aside) so a step can grow the
  // list and highlight the line that just changed.
  const sys = (o) => ({ role: "system", text: "You are a travel assistant. Keep answers short.", ...o });
  const usr = (o) => ({ role: "user", text: "What's the weather in Oslo?", ...o });
  const call = (o) => ({ role: "assistant", text: "getWeather(city: \"Oslo\")", ...o });
  const tool = (o) => ({ role: "tool", text: "4\u00b0C, clear", ...o });
  const answer = (o) => ({ role: "assistant", text: "It's 4\u00b0C and clear in Oslo - bring a warm jacket.", ...o });

  window.LESSON_CONFIG = {
    code: [],
    legend: [
      { sw: "#7baaff", label: "your app wrote it - the instructions" },
      { sw: "#37d3a6", label: "you wrote it - the user turn" },
      { sw: "#ffd479", label: "the model wrote it - an assistant turn" },
      { sw: "#e0708a", label: "your code wrote it - a tool result" },
    ],
    layout: {
      visual: [{ type: "transcript" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "Across the last lessons the agent grew memory, tools and a loop, and it started to feel like magic. Here is the plain truth under all of it: a run is just a **list of messages**. It starts with two - your app's instructions, and your question.",
        transcript: {
          caption: "The run so far",
          messages: [sys(), usr()],
        },
      },
      {
        narr: "Every message carries two things. A **role** - `system`, `user`, `assistant`, or `tool` - says what kind of turn it is. And an **author** - who actually wrote it. Your app wrote the `system` line (the instructions); *you* wrote the `user` line. Watch that author tag: it is the whole point of this lesson.",
        transcript: {
          caption: "Each message has a role and an author",
          messages: [sys({ hot: true }), usr({ hot: true })],
        },
      },
      {
        narr: "Now the model takes its turn. It reads the **whole list** and writes exactly one thing back: an `assistant` message. That is all a model can ever do - add text. Here the text it writes is a tool **call**, but notice it is still just text the model produced.",
        transcript: {
          caption: "The model reads the list and writes one message",
          messages: [sys(), usr(), call({ hot: true, note: "the model only ever writes text - even a tool call is just text" })],
        },
      },
      {
        narr: "The model cannot run anything. So **your code** reads that call, runs `getWeather`, and appends the result as a `tool` message. Read the author tag: this line was written by your code, **not** the model. That is the honest picture of \"the agent used a tool.\"",
        transcript: {
          caption: "Your code runs the tool and writes the result",
          messages: [sys(), usr(), call(), tool({ hot: true, note: "your code wrote this line, not the model" })],
        },
      },
      {
        narr: "To continue, the model has to be called **again** - and it remembers nothing on its own. So the whole list, tool result included, is sent again from the top. That is all \"memory\" is here: re-sending this growing list every call. There is no hidden store the model carries between turns.",
        transcript: {
          caption: "The whole list is re-sent",
          banner: "API call 2 - the entire list goes back to the model",
          flow: "send",
          messages: [sys(), usr(), call(), tool()],
        },
      },
      {
        narr: "Reading the fuller list - now with the weather in it - the model writes its final `assistant` message: the answer. Same move as before: read everything, add one line of text.",
        transcript: {
          caption: "The model answers, using the tool result",
          messages: [sys(), usr(), call(), tool(), answer({ hot: true })],
        },
      },
      {
        narr: "So the whole agent is one growing list of text. The model only adds `assistant` lines; your code adds `tool` lines; **memory** is re-sending the list; and **instructions**, skills and specs are just more text placed near the top - the `system` line. Prompt, memory, tools: all of it is managing this one list.",
        transcript: {
          caption: "It was a list of text all along",
          messages: [
            sys({ note: "instructions, skills and specs live here - just text near the top" }),
            usr(),
            call(),
            tool(),
            answer(),
          ],
        },
      },
    ],
  };
})();
