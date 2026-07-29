// Visual for ai-7 "Tools" - a DATA-ONLY file. It uses the `toolrack` panel:
// several tools, each described by a schema (name + typed parameters), the agent
// choosing one, the structured call it emits, and the result - or the error it
// must recover from. It opens with the plain idea on a single tool (ask, run,
// read the result back), then shows what real tool use adds: a schema to read,
// a choice between several, and recovering from a call that comes back wrong.
(function () {
  "use strict";

  // The tools on the rack. `params` is each tool's schema - the typed arguments
  // it accepts, which the model reads to know how to call it. `states` sets each
  // tool's state for the step.
  const weatherOnly = (state, extra) => [
    { name: "getWeather", desc: "current weather for a city", params: [{ name: "city", type: "text" }], state: state, ...extra },
  ];
  const allTools = (states) => [
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
        narr: "By itself a model can only produce text - it cannot check today's weather or send a message. So we give it **tools**: functions it is allowed to call. Here is one.",
        toolRack: {
          caption: "A tool the model can call",
          tools: weatherOnly("idle"),
        },
      },
      {
        narr: "You ask for the weather in Paris - something the model cannot know on its own. So instead of guessing, it emits a **call**: the tool's name plus the argument it needs.",
        toolRack: {
          caption: "It asks for the tool to run",
          tools: weatherOnly("calling"),
          call: 'getWeather(city: "Paris")',
        },
      },
      {
        narr: "The tool runs **outside** the model - it checks a real weather service and hands back a fact: `12\u00b0C, rain`. That result drops into the context, and now the model can answer for real. Ask for a tool, read the result back: that round trip turns a talker into a doer.",
        toolRack: {
          caption: "The tool does the real work",
          tools: weatherOnly("returned"),
          call: 'getWeather(city: "Paris")',
          result: "12\u00b0C, rain",
        },
      },
      {
        narr: "That was one tool on the happy path. Real agents carry **several** - and a call does not always come back with an answer. Let's look closer at how the agent picks one and what happens when a call goes wrong.",
        toolRack: {
          caption: "The agent's tools",
          tools: allTools({ getWeather: "idle", searchFlights: "idle", sendEmail: "idle" }),
        },
      },
      {
        narr: "Each tool is described by a **schema**: a name, a line saying what it is for, and the typed **parameters** it takes. `getWeather(city: text)` says \"give me a city as text, and I'll hand back its weather.\" The model reads this the way you read a label.",
        toolRack: {
          caption: "A tool is described by its schema",
          tools: allTools({ getWeather: "chosen", searchFlights: "idle", sendEmail: "idle" }),
        },
      },
      {
        narr: "A new task arrives: **what's the weather in Oslo?** The agent matches it against the descriptions and **chooses** `getWeather` - not the flight search, not the email tool. Picking the right one is the first real decision.",
        toolRack: {
          caption: "Choosing the tool that fits the task",
          tools: allTools({ getWeather: "chosen", searchFlights: "idle", sendEmail: "idle" }),
        },
      },
      {
        narr: "It emits the call - but there is a typo in the argument: `Osloo` is not a city, so the tool hands back an **error**, not a fact. A model that only produced text would be stuck here. An agent gets to read what came back.",
        toolRack: {
          caption: "The call came back an error",
          tools: allTools({ getWeather: "error", searchFlights: "idle", sendEmail: "idle" }),
          call: 'getWeather(city: "Osloo")',
          error: "unknown city: \"Osloo\"",
        },
      },
      {
        narr: "So it **recovers**: it reads the error, fixes the argument, and **retries** - `getWeather(city: \"Oslo\")`. This time a real result comes back: `4\u00b0C, clear`.",
        toolRack: {
          caption: "Fix the argument and retry",
          tools: allTools({ getWeather: "returned", searchFlights: "idle", sendEmail: "idle" }),
          call: 'getWeather(city: "Oslo")',
          result: "4\u00b0C, clear",
        },
      },
      {
        narr: "That is what makes tools dependable inside the loop: **choose** the one that fits, **call** it in the shape its schema asks for, and **recover** when a call comes back wrong. Choice, schema, and retry are what turn a single lucky tool call into an agent that gets things done.",
        toolRack: {
          caption: "Choose, call, recover",
          tools: allTools({ getWeather: "returned", searchFlights: "idle", sendEmail: "idle" }),
          result: "4\u00b0C, clear",
        },
      },
    ],
  };
})();
