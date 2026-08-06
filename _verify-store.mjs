// Proves poc-git-store.js against ids real git produced. Vectors and the script
// that regenerates them: poc-git-vectors.json, /tmp/git-object-vectors.sh
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const GitStore = createRequire(import.meta.url)("./poc-git-store.js");
const vectors = JSON.parse(readFileSync("poc-git-vectors.json", "utf8"));

// The vector file spells its escapes out, so `\0` in the JSON is a backslash and
// a zero rather than a NUL byte. Turn them back into the bytes git hashed.
function unescape(text) {
  return text.replace(/\\x([0-9a-fA-F]{2})|\\0|\\n|\\\\/g, (match, hex) => {
    if (hex) return String.fromCharCode(parseInt(hex, 16));
    if (match === "\\0") return "\0";
    if (match === "\\n") return "\n";
    return "\\";
  });
}

let failed = 0;
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label.padEnd(28)} ${actual}${ok ? "" : `\n      expected ${expected}`}`);
};

// 1. Every vector, hashed from its own preimage bytes.
for (const vector of vectors) {
  const bytes = vector.preimageHexIfBinary
    ? Uint8Array.from(Buffer.from(vector.preimageHexIfBinary, "hex"))
    : GitStore.bytesOf(unescape(vector.preimageEscaped));
  check(vector.label, GitStore.sha1(bytes), vector.sha);
}

// 2. The store's own builders, on the same fixtures the vector script used -
//    this is what the lessons will call, so it is what has to match.
const store = new GitStore.Store();
check("writeBlob hello world", store.writeBlob("hello world\n"), "3b18e512dba79e4c8300dd08aeb37f8e728b8dad");
check("writeBlob empty", store.writeBlob(""), "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391");
check("writeBlob utf8 cafe", store.writeBlob("caf\u00e9\n"), "572eb43fe8e34fb87d01c69e01151ff696022924");

const alpha = store.writeBlob("alpha\n");
const beta = store.writeBlob("beta\n");
const nested = store.writeBlob("nested\n");
const inDir = store.writeBlob("in-dir\n");
const zero = store.writeBlob("zero\n");

// Entries go in deliberately unsorted, because the store must sort them.
const flatTree = store.writeTree([
  { mode: GitStore.MODE_EXEC, name: "b.txt", id: beta },
  { mode: GitStore.MODE_FILE, name: "a.txt", id: alpha },
]);
check("writeTree flat", flatTree, "d067e4f1a1b6abf1dd6fe234d7f95088f6e56c7d");

const subTree = store.writeTree([{ mode: GitStore.MODE_FILE, name: "deep.txt", id: nested }]);
const nestedTree = store.writeTree([
  { mode: GitStore.MODE_DIR, name: "sub", id: subTree },
  { mode: GitStore.MODE_FILE, name: "a.txt", id: alpha },
]);
check("writeTree with subdirectory", nestedTree, "b52941b9490611b6593612f8f510903234393914");

// The sort rule: a directory sorts as if its name ended in "/".
const dirA = store.writeTree([{ mode: GitStore.MODE_FILE, name: "f.txt", id: inDir }]);
check("writeTree a.txt before dir a", store.writeTree([
  { mode: GitStore.MODE_DIR, name: "a", id: dirA },
  { mode: GitStore.MODE_FILE, name: "a.txt", id: alpha },
]), "9a2cfd6eb22be2c895d0a4757532a9d5b878920e");
check("writeTree dir a before a0.txt", store.writeTree([
  { mode: GitStore.MODE_FILE, name: "a0.txt", id: zero },
  { mode: GitStore.MODE_DIR, name: "a", id: dirA },
]), "7b7f8ede6de95c4be1ef591bd58e29c7d8fd9c3d");

const person = "Vector Author <vectors@example.com>";
const rootCommit = store.writeCommit({
  tree: flatTree, parents: [], author: `${person} 1700000000 +0000`, message: "first save",
});
check("writeCommit root", rootCommit, "3655757fbb278168f9da9caf06cc5ba1e854f8b9");
check("writeCommit with parent", store.writeCommit({
  tree: nestedTree, parents: [rootCommit],
  author: `${person} 1700003600 +0100`, message: "second save",
}), "aac6f24bdbd26c7b16c02d7780ceb967844fe15f");

// 3. Reachability: a commit nobody names is still in the store and unreachable.
store.refs.set("refs/heads/main", rootCommit);
const orphan = store.writeCommit({
  tree: flatTree, parents: [rootCommit],
  author: `${person} 1700003600 +0100`, message: "abandoned",
});
const live = store.reachable();
check("reachable finds the commit", String(live.has(rootCommit)), "true");
check("reachable skips the orphan", String(live.has(orphan)), "false");
check("orphan is still stored", String(store.objects.has(orphan)), "true");

console.log(`\n${failed === 0 ? "ALL PASS" : `${failed} FAILED`}`);
process.exit(failed === 0 ? 0 : 1);
