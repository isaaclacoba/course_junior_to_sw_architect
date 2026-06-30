// Theory track - Part 3, Lesson 5: "Programs that talk". Absolute-beginner, no
// code. Programs connect over a network; one asks (client) and one answers
// (server); the ask is a request and the answer a response; a server offers a
// set menu of things you can ask for - its API. Ends with a weather example.
// Drill-engine theory mode (MC + fill-blank), with a client/server diagram.
(function () {
  "use strict";

  const drills = [
    {
      title: "Programs can talk over a network",
      concept: "Network",
      context:
        "Programs do not have to work alone. Connected by a network - the wires and wireless links between computers - one program can talk to another, even one on the far side of the world.",
      quiz: {
        question: "What lets one program talk to another on a different computer?",
        options: [
          { text: "A network", correct: true },
          { text: "A bigger screen", correct: false },
          { text: "More memory", correct: false },
        ],
        answerWhy: "A network - the links between computers - is what lets programs talk to each other.",
      },
      snippet: "Programs talk to each other over a {{1}} - the links between computers.",
      points: [
        "Programs can work together, not just alone.",
        "The network is what connects them.",
      ],
      blanks: [
        {
          id: 1,
          label: "What connects computers so programs can talk",
          answer: "network",
          hints: ["The wires and wireless between computers."],
          explain: [
            { text: "A network connects computers so their programs can talk." },
          ],
        },
      ],
    },
    {
      title: "One asks, one answers",
      concept: "Client and server",
      context:
        "Usually one program asks for something and another provides it. The one asking is the client; the one answering is the server. Think of a customer and a waiter: the customer asks, the kitchen serves.",
      quiz: {
        question: "In a conversation between two programs, what is the one that asks called?",
        options: [
          { text: "The client", correct: true },
          { text: "The server", correct: false },
          { text: "The network", correct: false },
        ],
        answerWhy: "The program that asks is the client; the one that answers is the server.",
      },
      snippet: "The program that asks is the {{1}}; the one that answers is the server.",
      points: [
        "Client = the one asking.",
        "Server = the one answering.",
      ],
      blanks: [
        {
          id: 1,
          label: "The program that asks for something",
          answer: "client",
          hints: ["Like the customer, not the waiter."],
          explain: [
            { text: "The client is the program that asks; the server answers." },
          ],
        },
      ],
    },
    {
      title: "A request out, a response back",
      concept: "Request and response",
      context:
        "The client sends a request - 'please give me this' - and the server sends back a response, the answer. One ask, one answer, travelling over the network.",
      quiz: {
        question: "What does the server send back to the client?",
        options: [
          { text: "A response", correct: true },
          { text: "A request", correct: false },
          { text: "A network", correct: false },
        ],
        answerWhy: "The client sends a request; the server replies with a response.",
      },
      snippet: "The client sends a request; the server sends back a {{1}}.",
      points: [
        "Request = the ask, from the client.",
        "Response = the answer, from the server.",
      ],
      blanks: [
        {
          id: 1,
          label: "The server's answer to a request",
          answer: "response",
          hints: ["It 'responds' to the request."],
          explain: [
            { text: "The server's answer to a request is the response." },
          ],
        },
      ],
    },
    {
      title: "An API is the menu of what you can ask for",
      concept: "API",
      context:
        "A server will not do just anything you say. It offers a set list of things you are allowed to ask for, and how to ask for them - that list is its API. Like a menu in a restaurant: you can order what is on it, not whatever you fancy.",
      quiz: {
        question: "What is an API?",
        options: [
          { text: "The set list of things you can ask a server for", correct: true },
          { text: "A kind of file", correct: false },
          { text: "A type of error", correct: false },
        ],
        answerWhy: "An API is the menu of requests a server understands - what you can ask for, and how.",
      },
      snippet: "A server's {{1}} is the menu of things you are allowed to ask it for.",
      points: [
        "A server only answers requests it understands.",
        "Its API is the menu of those requests.",
      ],
      blanks: [
        {
          id: 1,
          label: "The 'menu' of requests a server offers (three letters)",
          answer: "API",
          accept: ["api"],
          hints: ["Short for Application Programming Interface."],
          explain: [
            { text: "A server's API is the set menu of requests it will answer." },
          ],
        },
      ],
    },
    {
      title: "An example: asking for the weather",
      concept: "Putting it together",
      context:
        "Say your app needs today's weather. Your app is the client: it sends a request to a weather server's API - 'weather for Madrid?' - and the server sends a response with the data. Your app never stores the weather itself; it just asks when it needs it.",
      quiz: {
        question: "When your app asks a weather server for data, your app is the...?",
        options: [
          { text: "Client", correct: true },
          { text: "Server", correct: false },
          { text: "Network", correct: false },
        ],
        answerWhy: "Your app does the asking, so it is the client; the weather server answers.",
      },
      snippet: "Your app is the {{1}}: it asks a weather server's API and uses the response.",
      points: [
        "Your app asks, so it is the client.",
        "The weather server answers through its API.",
      ],
      mermaid:
        "flowchart LR\n  C[\"Your app (client)\"] -->|request: weather?| S[\"Weather server\"]\n  S -->|response: 22 C, sunny| C",
      blanks: [
        {
          id: 1,
          label: "Your app's role when it asks for data",
          answer: "client",
          hints: ["The one asking."],
          explain: [
            { text: "Your app is the client - it sends the request and uses the response." },
          ],
        },
      ],
    },
    {
      title: "Programs that talk - recap",
      concept: "Recap",
      summary: true,
      context: "You now know, in plain terms, how programs talk to each other.",
      summaryIntro:
        "Over a network, one program asks and another answers - a request and a response - and a server's API is the menu of what you can ask for.",
      summaryItems: [
        { title: "Network - ", text: "the links that let programs on different computers talk." },
        { title: "Client and server - ", text: "the client asks; the server answers." },
        { title: "Request and response - ", text: "the ask out, the answer back." },
        { title: "API - ", text: "the menu of requests a server will answer." },
      ],
      summaryClose: "Next lesson: how the code itself is saved, tracked and shared between people - version control.",
      blanks: [],
    },
  ];

  window.DRILL_CONFIG = {
    prefix: "th19",
    mode: "theory",
    metaLabel: "How software runs \u00b7 Programs that talk",
    progressNoun: "Topic",
    awardedKey: "theory_19_awarded",
    awardAmount: 20,
    drills,
  };
})();
