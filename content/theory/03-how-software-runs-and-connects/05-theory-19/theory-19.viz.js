// Visual for theory-19 "Programs that talk" - data-only. Uses the GPIO pin as
// the wire out to the world: a request goes out, a response comes back and lands
// in RAM as a Response object. Board scene with the heap region for the returned
// data. Deepened: the internet (a network of networks), how a client finds a
// server (IP address + DNS), and the rules a web request follows (HTTP).
(function () {
  "use strict";

  const RESPONSE = { id: "resp", type: "Response", fields: [["symbol", '"ACME"'], ["price", "42"]] };

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["heap"], zoomTab: false },
    chipName: "RAM",
    chipAddr: "data arriving from another program",
    steps: [
      { narr: "Programs do not have to work alone.\nConnected by a **network** - the wires and wireless links between computers - one program can talk to another sitting right next to it.", instr: "networked", highlight: "gpio", heap: [] },
      { narr: "One network only reaches the machines on it. The **internet** joins millions of separate networks into one giant web - a network of networks.\nThat is what lets your program reach another on the far side of the world, not just the one next door.", instr: "internet", highlight: "gpio", heap: [] },
      { narr: "Usually one program asks and another answers. The one asking is the **client**; the one answering is the **server**.\nThink of a customer and a waiter: the customer asks, the kitchen serves.", instr: "client / server", heap: [] },
      { narr: "For the client to reach the server, it needs its address. Every machine on the internet has an **IP address** - a number like `142.250.1.14`.\nPeople are bad at numbers, so you type a name like `example.com`, and **DNS** looks up the number behind that name, like a phone book turning a name into a number.", instr: "IP / DNS", highlight: "gpio", heap: [] },
      { narr: "Now the client sends a **request** out over the network to that address - 'please give me this'.\nHere your app asks a price server for the latest prices.", instr: "GET /prices", led: true, packets: [{ path: "trGpio", color: "#ffd479" }], heap: [] },
      { narr: "The server sends back a **response** - the answer.\nIt travels back over the same wire and lands in your program's memory as data you can use.", instr: "200 OK", packets: [{ path: "trGpio", reverse: true, color: "#7ee787" }], highlight: "ram", heap: [{ ...RESPONSE }] },
      { narr: "Both sides have to agree on how to phrase all this. On the web they follow **HTTP** - a shared set of rules for how a request and a response are written.\nThat `GET` you sent and the `200 OK` that came back are HTTP: the request names what it wants, the response carries a status and the data.", instr: "HTTP rules", highlight: "gpio", heap: [{ ...RESPONSE }] },
      { narr: "A server will not do just anything. It offers a set list of things you may ask for, and how to ask - that list is its **API**.\nLike a menu: you order what is on it, not whatever you fancy.", instr: "API menu", heap: [{ ...RESPONSE }] },
    ],
  };
})();
