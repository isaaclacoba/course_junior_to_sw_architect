// Visual for theory-18 "Saving data" - data-only. Plain and terse. When a program
// stops the OS reclaims its RAM (and RAM is volatile), so you save data to storage
// as a file. On disk a file is an inode (the file itself + facts about it) plus a
// name in a directory that
// points to it. That name -> inode pointer is a hard link; a soft link is a
// shortcut holding a path. No databases - this lesson is just the filesystem.
(function () {
  "use strict";

  const dir = (vars) => ({ id: "dir", name: "/home/ada", vars });
  const entry = (name, extra) => ({ id: "e_" + name.replace(/\W/g, ""), k: name, ref: "in12", ...(extra || {}) });
  const soft = (name, target, extra) => ({ id: "s_" + name.replace(/\W/g, ""), k: name, v: "\u2192 " + target, ...(extra || {}) });
  const inode = (links, extra) => ({
    id: "in12",
    type: "inode 12",
    at: "disk",
    fields: [["holds", "your bytes"], ["size", "240 B"], ["link count", String(links)]],
    ...(extra || {}),
  });

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["stack", "heap"], zoomTab: false },
    regionTags: {
      stack: 'DIRECTORY <span>· names</span>',
      heap: 'THE FILE <span>· an inode</span>',
    },
    chipName: "STORAGE",
    chipAddr: "a file: an inode and a name",
    code: [],
    steps: [
      {
        narr: "While your program runs, its data sits in **RAM**. When the program stops, the operating system takes that memory back for other programs, so your data is gone - and RAM is **volatile** anyway: lose power and it all vanishes.\nTo keep something after the program ends, you save it to **storage** as a **file**.",
        instr: "save", ram: true, highlight: ["ram", "ufs"], packets: [{ path: "trRam", reverse: true }, { path: "trUfs" }],
        stack: [], heap: [],
      },
      {
        narr: "On disk, the file itself is an **inode**: your **bytes**, plus the facts about them - size, when it changed, who can read it.",
        instr: "inode", highlight: "heap", glow: "in12",
        stack: [], heap: [inode(1)],
      },
      {
        narr: "The **name** is separate. Names live in a **directory**, and each one points to an inode.\nA directory is just a file too - its bytes are that list of names.",
        instr: "name + directory", highlight: ["stack", "heap"],
        stack: [dir([entry('"diary.txt"', { hot: true })])], heap: [inode(1)],
      },
      {
        narr: "That name → inode pointer has a name of its own: a **hard link**.\nBecause it is only a pointer, renaming the file never touches the bytes.",
        instr: "hard link", highlight: "stack", glow: "in12",
        stack: [dir([entry('"diary.txt"')])], heap: [inode(1)],
      },
      {
        narr: "One inode can have more than one name - more than one **hard link**.\nThe inode counts them: its **link count**.",
        instr: "two names", highlight: ["stack", "heap"],
        stack: [dir([entry('"diary.txt"'), entry('"backup.txt"', { hot: true })])], heap: [inode(2, { hotFields: ["link count"] })],
      },
      {
        narr: "So deleting is really *unlinking*: you remove one name.\nThe file is gone only when the **link count** reaches `0`.",
        instr: "unlink", highlight: ["stack", "heap"],
        stack: [dir([entry('"diary.txt"')])], heap: [inode(1, { hotFields: ["link count"] })],
      },
      {
        narr: "A **soft link** is a different thing - a shortcut. It is a tiny file that just holds a **path** to follow.\nMove or delete the target and the shortcut breaks.",
        instr: "soft link", highlight: "stack",
        stack: [dir([entry('"diary.txt"'), soft('"latest"', '"diary.txt"', { hot: true })])], heap: [inode(1)],
      },
    ],
  };
})();
