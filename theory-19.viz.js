// Visual for theory-19 "Programs that talk over a network" - data-only,
// decoupled from theory-19.js. Uses the GPIO pin as the wire out to the world:
// a request goes out, a response comes back and lands in RAM as a Response
// object. Board scene with the heap region for the returned data.
(function () {
  "use strict";

  const RESPONSE = { id: "resp", type: "Response", fields: [["symbol", '"ACME"'], ["price", "42"]] };

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["heap"], zoomTab: false },
    chipName: "RAM",
    chipAddr: "data arriving from another program",
    steps: [
      { narr: "Programs do not have to work alone.\nConnected by a **network** - the wires and wireless links between computers - one program can talk to another, even one on the far side of the world.", instr: "networked", highlight: "gpio", heap: [] },
      { narr: "Usually one program asks and another answers. The one asking is the **client**; the one answering is the **server**.\nThink of a customer and a waiter: the customer asks, the kitchen serves.", instr: "client / server", heap: [] },
      { narr: "The client sends a **request** out over the network - 'please give me this'.\nHere your app asks a price server for the latest prices.", instr: "GET /prices", led: true, packets: [{ path: "trGpio", color: "#ffd479" }], heap: [] },
      { narr: "The server sends back a **response** - the answer.\nIt travels back over the same wire and lands in your program's memory as data you can use.", instr: "200 OK", packets: [{ path: "trGpio", reverse: true, color: "#7ee787" }], highlight: "ram", heap: [{ ...RESPONSE }] },
      { narr: "A server will not do just anything. It offers a set list of things you may ask for, and how to ask - that list is its **API**.\nLike a menu: you order what is on it, not whatever you fancy.", instr: "API menu", heap: [{ ...RESPONSE }] },
    ],
  };
})();
