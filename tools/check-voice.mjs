// tools/check-voice.mjs - spotlight the AI tells AGENTS.md names.
//
// WHY THIS EXISTS
// The voice rules were already written down and still got broken: a lesson
// shipped with four tricolons, three "So ..." openers and two antithesis
// flourishes. A rule nobody can check is a rule that decays, so this makes the
// specific patterns countable.
//
// It is a SPOTLIGHT, not a grader. Every hit is a question - "would a colleague
// say this out loud?" - and a deliberate one is allowed to stay. It therefore
// exits 0 always; the human decides.
//
//   node tools/check-voice.mjs                 # every lesson bundle
//   node tools/check-voice.mjs content/git     # one subtree

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const TELLS = [
  [/\b\w+ed [^.,;]{2,45}, [^.,;]{2,45}, and \w+/gi,
   "tricolon", "A, B, and C - AGENTS.md rule 7"],
  [/ - (?:not|never) [^.]{3,60}\.|,\s(?:not|rather than) [^.]{3,50}\./gi,
   "antithesis", "'X, not Y' flourish closing a sentence"],
  [/(?:^|\. )So [a-z]/g,
   "So-opener", "'So ...' as a sentence opener, repeated"],
  [/\bthat (?:reading|shape|question|part|stop|move) is\b/gi,
   "abstract-that", "'that X is the Y' - naming an abstraction instead of the thing"],
  [/\b(?:seamlessly|effortlessly|quietly|simply just|magically)\b/gi,
   "vague-adverb", "vague adverb on an abstract verb - AGENTS.md rule 1"],
  [/\b(?:It|That|This) is not [^.]{2,40}, and (?:it|that|this) is not [^.]{2,40}\./gi,
   "antithesis", "'it is not X, and it is not Y' - two negations instead of the thing"],
];

// The same tells in Spanish. Translated prose was NEVER checked - the walker only
// opened en.json - so a Spanish antithesis flourish shipped while the English one
// beside it was clean. A rule enforced in one language is half a rule.
const TELLS_ES = [
  [/(?:^|\. )As\u00ed que [a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1]/g,
   "So-opener(es)", "'As\u00ed que ...' opening a sentence, repeated"],
  [/\bNo es [^.]{2,40}, y no es [^.]{2,40}\./gi,
   "antithesis(es)", "'no es X, y no es Y' - two negations instead of the thing"],
  [/ - (?:no|nunca|jam\u00e1s) [^.]{3,60}\.|, (?:no|en vez de) [^.]{3,50}\./gi,
   "antithesis(es)", "'X, no Y' flourish closing a sentence"],
  [/\b(?:sin esfuerzo|m\u00e1gicamente|silenciosamente|simplemente funciona)\b/gi,
   "vague-adverb(es)", "vague adverb on an abstract verb"],
];

// Only prose keys. Commands, ids and file names are not written in the voice.
const PROSE = /narr|intro|context|summary|goal|blurb|def$/;

// Three kinds of file carry prose, and for a long time this tool read only the
// first. A lesson whose English lives INLINE in its data file - which is every
// `objects`-scene lesson - reported "0 flags across 1 prose string", the one
// string being a concept definition. The number was the tell and nobody read it.
function bundles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) bundles(p, out);
    else if (p.includes("res/strings") && (name === "en.json" || name === "es.json")) out.push(p);
    else if (name.endsWith(".viz.js") || name === "meta.js" || name === "data.js") out.push(p);
  }
  return out;
}

/** Prose out of a browser data file: the `narr:` and `intro:` string literals.
 *  Parsing the JS properly would need a bundler; the strings are authored one
 *  per line, so a line scan finds them and never invents one. */
function proseFromSource(file) {
  const out = {};
  const src = readFileSync(file, "utf8");
  const re = /(narr|intro|blurb|note)"?:\s*(?:\[\s*)?"((?:[^"\\]|\\.)*)"/g;
  let m, i = 0;
  while ((m = re.exec(src))) {
    out[`${m[1]}.${i++}`] = m[2].replace(/\\"/g, '"').replace(/\\n/g, " ");
  }
  return out;
}

const root = process.argv[2] || "content";
let flagged = 0;
let scanned = 0;

for (const file of bundles(root).sort()) {
  const isJson = file.endsWith(".json");
  const data = isJson ? JSON.parse(readFileSync(file, "utf8")) : proseFromSource(file);
  const tells = file.endsWith("es.json") ? TELLS_ES : TELLS;
  const hits = [];
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== "string" || !PROSE.test(key)) continue;
    scanned++;
    for (const [re, tag, why] of tells) {
      const found = value.match(re);
      if (found) hits.push({ key, tag, why, n: found.length });
    }
  }
  if (!hits.length) continue;
  flagged += hits.length;
  console.log(`\n${file.replace(/\/res\/strings\/default/, " ")}`);
  for (const h of hits) console.log(`  ${h.key.padEnd(22)} ${h.tag} x${h.n}  - ${h.why}`);
}

console.log(`\n${flagged} flag(s) across ${scanned} prose string(s) in ${root}`);
console.log("Each is a question, not a verdict. Read it aloud; if a colleague would say it, keep it.");
