// A real git object store, small enough to read.
//
// The ids this produces are the ids real git produces - same bytes in, same
// forty characters out - because the whole track rests on "the name comes from
// the content", and a learner has to be able to check that claim with
// `git hash-object --stdin` on their own machine.
//
// SHA-1 is implemented here rather than taken from `crypto.subtle` for two
// reasons: `crypto.subtle` is unavailable outside a secure context (a LAN IP
// during local development is enough to lose it), and it is async, which would
// put a promise in the middle of every render.
//
// Loads as a plain script (sets `globalThis.GitStore`) and as a CommonJS module.
(function (root) {
  "use strict";

  // ---- SHA-1 ---------------------------------------------------------------

  function sha1(bytes) {
    const ml = bytes.length;
    // Message + 0x80 + zero padding + 64-bit big-endian bit length, to 64 bytes.
    const withPad = new Uint8Array((((ml + 8) >> 6) + 1) << 6);
    withPad.set(bytes);
    withPad[ml] = 0x80;
    const view = new DataView(withPad.buffer);
    view.setUint32(withPad.length - 4, (ml << 3) >>> 0, false);
    view.setUint32(withPad.length - 8, Math.floor(ml / 536870912), false);

    let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;
    const w = new Int32Array(80);

    for (let offset = 0; offset < withPad.length; offset += 64) {
      for (let i = 0; i < 16; i++) w[i] = view.getInt32(offset + i * 4, false);
      for (let i = 16; i < 80; i++) {
        const n = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
        w[i] = (n << 1) | (n >>> 31);
      }
      let a = h0, b = h1, c = h2, d = h3, e = h4;
      for (let i = 0; i < 80; i++) {
        let f, k;
        if (i < 20) { f = (b & c) | (~b & d); k = 0x5a827999; }
        else if (i < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
        else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
        else { f = b ^ c ^ d; k = 0xca62c1d6; }
        const t = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) | 0;
        e = d; d = c; c = (b << 30) | (b >>> 2); b = a; a = t;
      }
      h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0;
      h3 = (h3 + d) | 0; h4 = (h4 + e) | 0;
    }
    return [h0, h1, h2, h3, h4].map((n) => (n >>> 0).toString(16).padStart(8, "0")).join("");
  }

  // ---- bytes ---------------------------------------------------------------

  const encoder = new TextEncoder();

  /** Text to bytes. The header length git writes counts BYTES, so `café` is six
   *  of them and not four - this is why the whole store works in bytes. */
  function bytesOf(text) {
    return encoder.encode(text);
  }

  function concat(chunks) {
    let total = 0;
    for (const c of chunks) total += c.length;
    const out = new Uint8Array(total);
    let at = 0;
    for (const c of chunks) { out.set(c, at); at += c.length; }
    return out;
  }

  function hexToBytes(hex) {
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
  }

  // ---- objects -------------------------------------------------------------

  /** The preimage git hashes: `<type> <byte length>\0` then the body. The header
   *  is inside the hash; the zlib compression git applies afterwards is not, so
   *  this store needs no compression at all. */
  function objectBytes(type, body) {
    return concat([bytesOf(`${type} ${body.length}\0`), body]);
  }

  function hashObject(type, body) {
    return sha1(objectBytes(type, body));
  }

  const MODE_FILE = "100644";
  const MODE_EXEC = "100755";
  const MODE_DIR = "40000"; // Five characters. `git cat-file -p` prints 040000.

  /** Git sorts tree entries as if every directory name ended in `/`, which is
   *  why `a.txt` comes before a directory `a` (`.` is 0x2e, `/` is 0x2f) and a
   *  directory `a` comes before `a0.txt`. Sorting the bare names gets both
   *  wrong. Comparison is on bytes, never on locale. */
  function treeSortKey(entry) {
    return bytesOf(entry.mode === MODE_DIR ? entry.name + "/" : entry.name);
  }

  function compareBytes(left, right) {
    const shared = Math.min(left.length, right.length);
    for (let i = 0; i < shared; i++) {
      if (left[i] !== right[i]) return left[i] - right[i];
    }
    return left.length - right.length;
  }

  /** Each entry is `<mode> <name>\0` followed by the id as twenty RAW bytes -
   *  not the forty hex characters a commit uses for the same id. */
  function treeBody(entries) {
    const sorted = entries.slice().sort((a, b) => compareBytes(treeSortKey(a), treeSortKey(b)));
    return concat(sorted.flatMap((e) => [bytesOf(`${e.mode} ${e.name}\0`), hexToBytes(e.id)]));
  }

  /** `tree`, then every `parent` in order, then `author`, then `committer`, one
   *  blank line, then the message. Ids here ARE hex. */
  function commitBody(commit) {
    const lines = [`tree ${commit.tree}\n`];
    for (const parent of commit.parents || []) lines.push(`parent ${parent}\n`);
    lines.push(`author ${commit.author}\n`);
    lines.push(`committer ${commit.committer || commit.author}\n`);
    lines.push("\n");
    lines.push(commit.message.endsWith("\n") ? commit.message : commit.message + "\n");
    return bytesOf(lines.join(""));
  }

  // ---- the store -----------------------------------------------------------

  class Store {
    constructor() {
      /** id -> { type, body, text } - the object database, `.git/objects`. */
      this.objects = new Map();
      /** ref name -> id, e.g. "refs/heads/main". A name file holding one id. */
      this.refs = new Map();
      /** What HEAD holds: a ref name, or an id when it is detached. */
      this.head = { kind: "ref", ref: "refs/heads/main" };
      /** path -> blob id. `.git/index`. */
      this.index = new Map();
      /** path -> text, the folder you can actually edit. Not part of git. */
      this.worktree = new Map();
    }

    write(type, body, extra) {
      const id = hashObject(type, body);
      if (!this.objects.has(id)) {
        this.objects.set(id, Object.assign({ id, type, body }, extra || {}));
      }
      return id;
    }

    writeBlob(text) {
      return this.write("blob", bytesOf(text), { text });
    }

    /** entries: [{ mode, name, id }] */
    writeTree(entries) {
      return this.write("tree", treeBody(entries), { entries: entries.slice() });
    }

    writeCommit(commit) {
      return this.write("commit", commitBody(commit), { commit: Object.assign({}, commit) });
    }

    resolveHead() {
      if (this.head.kind === "detached") return this.head.id;
      return this.refs.get(this.head.ref) || null;
    }

    /** Every object you can arrive at by following names from the refs and HEAD.
     *  Anything outside this set is still on disk and still unreachable, which
     *  is the whole difference between "undone" and "gone". */
    reachable() {
      const seen = new Set();
      const queue = [...this.refs.values()];
      const headId = this.resolveHead();
      if (headId) queue.push(headId);
      while (queue.length) {
        const id = queue.pop();
        if (!id || seen.has(id) || !this.objects.has(id)) continue;
        seen.add(id);
        const object = this.objects.get(id);
        if (object.type === "commit") {
          queue.push(object.commit.tree, ...(object.commit.parents || []));
        } else if (object.type === "tree") {
          for (const entry of object.entries || []) queue.push(entry.id);
        }
      }
      return seen;
    }
  }

  const GitStore = {
    sha1, bytesOf, hashObject, objectBytes,
    treeBody, commitBody, treeSortKey, compareBytes,
    MODE_FILE, MODE_EXEC, MODE_DIR,
    Store,
  };

  root.GitStore = GitStore;
  if (typeof module !== "undefined" && module.exports) module.exports = GitStore;
})(typeof globalThis !== "undefined" ? globalThis : this);
