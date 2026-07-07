// Visual for theory-5 "How computers store everything as numbers" - data-only.
// Memory scene with the board on: a byte shown as one frame of 8 bit slots.
// We flip a single bit, then count upward in binary to show each extra bit
// doubling the reach, and finish by naming the group of eight a byte.
(function () {
  "use strict";

  // One byte = 8 slots, bit 7 down to bit 0. `arr[0]` is bit 7, `arr[7]` is bit 0.
  // `hotBits` lists which bit numbers just flipped, so they light up.
  const bit = (i, v, hot) => ({ id: "b" + i, k: "bit " + i, v: String(v), ...(hot ? { hot: true } : {}) });
  const byte = (arr, hotBits) => ({
    id: "byte",
    name: "one byte",
    vars: arr.map((v, idx) => bit(7 - idx, v, (hotBits || []).includes(7 - idx))),
  });

  const ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
  const ONE = [0, 0, 0, 0, 0, 0, 0, 1];
  const TWO = [0, 0, 0, 0, 0, 0, 1, 0];
  const FIVE = [0, 0, 0, 0, 0, 1, 0, 1];

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["stack"], zoomTab: false },
    regionTags: { stack: "ONE BYTE <span>· eight on/off bits</span>" },
    chipName: "RAM",
    chipAddr: "one byte = 8 bits",
    steps: [
      {
        narr: "The smallest piece of information is a single **bit** - one value that is either off (`0`) or on (`1`).\nHere is a byte of eight bits, all off for now.",
        ram: true, highlight: "ram", stack: [byte(ZERO)],
      },
      {
        narr: "Flip bit 0 on and it reads `1`. A **bit** holds just two values, nothing in between.\nComputers use two states because they are reliable - a wire either carries current or it does not, which is easy to build and hard to misread.",
        ram: true, highlight: "ram", stack: [byte(ONE, [0])],
      },
      {
        narr: "With only `0` and `1` to work with, counting is done in **binary**.\nThose eight bits reading `0000 0001` mean the number one.",
        ram: true, instr: "= 1", stack: [byte(ONE, [0])],
      },
      {
        narr: "Count up by one and the bits become `0000 0010` - the number two. Bit 0 turns off and bit 1 turns on.\nEach extra **bit** you can use doubles how many values you can reach.",
        ram: true, instr: "= 2", stack: [byte(TWO, [1, 0])],
      },
      {
        narr: "A few steps further and `0000 0101` means five. Bits 0 and 2 are on now.\nEvery pattern of on and off bits is just a number written in **binary**.",
        ram: true, instr: "= 5", stack: [byte(FIVE, [2, 1, 0])],
      },
      {
        narr: "Group eight bits together and you have one **byte** - enough for `256` different values, which is enough for a single letter.\nThis is why memory and file sizes are measured in bytes.",
        ram: true, highlight: "ram", instr: "1 byte", stack: [byte(FIVE)],
      },
    ],
  };
})();
