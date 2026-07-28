// Visual for ai-12 "Tools, deeper: schema, choice, and a failed call" - a
// DATA-ONLY file. It uses the `toolrack` panel: several tools, each described by
// a schema (name + typed parameters), the agent choosing one, the structured
// call it emits, and the result - or the error it must recover from. The intro
// tools lesson (ai-7) showed a single tool on the happy path; this one shows
// choice, a schema, and a failure the agent reads and retries.
(function () {
  "use strict";

  // The three tools on the rack. `params` is each tool's schema - the typed
  // arguments it accepts, which the model reads to know how to call it.
  const tools = (states) => [
    {
      name: "getWeather",
      desc: "current weather for a city",
      params: [{ name: "city", type: "text" }],
      state: states.getWeather,
    },
    {
      name: "searchFlights",
      desc: "flights between two cities",
      params: [
        { name: "from", type: "text" },
        { name: "to", type: "text" },
      ],
      state: states.searchFlights,
    },
    {
      name: "sendEmail",
      desc: "send a message to someone",
      params: [
        { name: "to", type: "text" },
        { name: "body", type: "text" },
      ],
      state: states.sendEmail,
    },
  ];

  window.LESSON_VIZ = {
    code: [],
    legend: [
      { sw: "#ffd479", label: "the tool chosen / the call sent", round: true },
      { sw: "#37d3a6", label: "a result came back", round: true },
      { sw: "#e0708a", label: "the call came back an error", round: true },
    ],
    layout: {
      visual: [{ type: "toolrack" }],
      aside: [{ type: "narration" }, { type: "controls" }],
    },
    steps: [
      {
        narr: "In the intro there was one tool, and it just worked. Real agents carry **several** - and a call does not always come back with an answer. Let's look closer at how the agent picks one and what happens when a call goes wrong.",
        toolRack: {
          caption: "The agent's tools",
          tools: tools({ getWeather: "idle", searchFlights: "idle", sendEmail: "idle" }),
        },
      },
      {
        narr: "Each tool is described by a **schema**: a name, a line saying what it is for, and the typed **parameters** it takes. `getWeather(city: text)` says \"give me a city as text, and I'll hand back its weather.\" The model reads this the way you read a label.",
        toolRack: {
          caption: "A tool is described by its schema",
          tools: tools({ getWeather: "chosen", searchFlights: "idle", sendEmail: "idle" }),
        },
      },
      {
        narr: "The task arrives: **what's the weather in Oslo?** The agent matches it against the descriptions and **chooses** `getWeather` - not the flight search, not the email tool. Picking the right one is the first real decision.",
        toolRack: {
          caption: "Choosing the tool that fits the task",
          tools: tools({ getWeather: "chosen", searchFlights: "idle", sendEmail: "idle" }),
        },
      },
      {
        narr: "Now it emits the **call** - the tool's name plus arguments that fit the schema. It fills `city` with the value from the task. This is a structured request, not free text: the name and the parameters have to line up.",
        toolRack: {
          caption: "Emitting a structured call",
          tools: tools({ getWeather: "calling", searchFlights: "idle", sendEmail: "idle" }),
          call: 'getWeather(city: "Osloo")',
        },
      },
      {
        narr: "But calls can **fail**. There is a typo in the argument - `Osloo` is not a city - so the tool hands back an **error**, not a fact. A model that only produced text would be stuck here. An agent gets to read what came back.",
        toolRack: {
          caption: "The call came back an error",
          tools: tools({ getWeather: "error", searchFlights: "idle", sendEmail: "idle" }),
          call: 'getWeather(city: "Osloo")',
          error: "unknown city: \"Osloo\"",
        },
      },
      {
        narr: "So it **recovers**: it reads the error, fixes the argument, and **retries** - `getWeather(city: \"Oslo\")`. This time a real result comes back: `4\u00b0C, clear`.",
        toolRack: {
          caption: "Fix the argument and retry",
          tools: tools({ getWeather: "returned", searchFlights: "idle", sendEmail: "idle" }),
          call: 'getWeather(city: "Oslo")',
          result: "4\u00b0C, clear",
        },
      },
      {
        narr: "That is what makes tools reliable inside the loop: **choose** the one that fits, **call** it in the shape its schema asks for, and **recover** when a call comes back wrong. Choice, schema, and retry are what turn a single lucky tool call into an agent that gets things done.",
        toolRack: {
          caption: "Choose, call, recover",
          tools: tools({ getWeather: "returned", searchFlights: "idle", sendEmail: "idle" }),
          result: "4\u00b0C, clear",
        },
      },
    ],
  };
})();
