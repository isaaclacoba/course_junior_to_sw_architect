// Visual for theory-7 "The operating system's bigger job" - data-only.
// Board scene with the Heap region standing in for storage: files are shown as
// objects on disk, the OS guards them, and it mediates access to devices.
(function () {
  "use strict";

  const file = (id, name, size) => ({ id, type: "File", fields: [["name", name], ["size", size]] });

  window.LESSON_VIZ = {
    scene: { board: true, regions: ["heap"], zoomTab: false },
    chipName: "UFS storage",
    chipAddr: "files on disk",
    steps: [
      {
        narr: "Storage is really one huge space of bytes. On its own that is unusable.\nSo the operating system organises it into **files** - each a named bundle of bytes you can find by name.",
        instr: "open file",
        highlight: "ufs",
        heap: [file("f1", "report.txt", "4 KB")],
      },
      {
        narr: "With thousands of files, names alone are not enough. The OS groups files into **folders** - a tree you walk to reach a file.\nThat route is the file's path.",
        instr: "folder /docs",
        highlight: "ufs",
        heap: [file("f1", "report.txt", "4 KB"), file("f2", "notes.md", "2 KB"), file("f3", "photo.png", "1 MB")],
      },
      {
        narr: "Programs do not touch the drive directly. They ask the **operating system** to open, read or save a file.\nIt checks permissions first - so one program cannot wreck another's files.",
        instr: "check permissions",
        highlight: ["soc", "ufs"],
        heap: [file("f1", "report.txt", "4 KB"), file("f2", "notes.md", "2 KB"), file("f3", "photo.png", "1 MB")],
      },
      {
        narr: "The OS also stands between programs and hardware **devices** - keyboard, screen, printer, network.\nA program asks the OS, and the OS works the device on its behalf.",
        instr: "device I/O",
        highlight: "gpio",
        packets: [{ path: "trGpio" }],
        led: true,
        heap: [file("f1", "report.txt", "4 KB")],
      },
      {
        narr: "Put together, the **operating system** is the manager between your programs and everything else: it turns raw storage into named **files** in **folders**, checks **permissions** before it opens or saves them, and works the hardware **devices** on a program's behalf - so every program gets what it needs without treading on the others.",
        instr: "OS manages all",
        highlight: ["soc", "ufs", "gpio"],
        heap: [file("f1", "report.txt", "4 KB"), file("f2", "notes.md", "2 KB")],
      },
    ],
  };
})();
