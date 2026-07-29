window.LESSON_META = {
  id: "theory-7",
  key: "theory_7_awarded",
  total: 1,
  docTitle: "The operating system's bigger job",
  eyebrow: "Theory · Part one · What a computer really is",
  title: "The operating system's bigger job",
  intro: [
    "You have met the operating system as the thing that starts and schedules programs. It does more: it turns raw storage into files and folders, guards them, and stands between every program and your hardware. This lesson covers files, folders, permissions, devices and drivers - and closes Part one. Step through the visual to see it on the board."
  ],
  blurb: "Beyond starting programs: how the OS turns raw storage into files and folders, guards them, and talks to your devices through drivers. Closes Part one.",
  links: [{ href: "index.html", label: "Back to the course" }],
  pill: "gentle",
  time: "20 min",
  archetype: "viz",
  engine: null,
  concepts: {
    "introduces": [
      {
        "id": "th-file",
        "term": "File",
        "def": "A named bundle of bytes on storage, which you can find again by its name."
      },
      {
        "id": "th-folder",
        "term": "Folder",
        "def": "A named group of files, arranged in a tree you walk to reach a file."
      },
      {
        "id": "th-permissions",
        "term": "Permissions",
        "def": "The rules the operating system checks before it lets a program open or change a file."
      },
      {
        "id": "th-device",
        "term": "Device",
        "def": "A piece of hardware - keyboard, screen, printer, network - that programs reach only by asking the operating system."
      }
    ],
    "revisits": [
      {
        "id": "th-operating-system"
      }
    ],
    "uses": [
      {
        "id": "th-byte"
      }
    ]
  },
};
