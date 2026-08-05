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
];

// Only prose keys. Commands, ids and file names are not written in the voice.
const PROSE = /narr|intro|context|summary|goal|blurb|def$/;

function bundles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) bundles(p, out);
    else if (name === "en.json" && p.includes("res/strings")) out.push(p);
  }
  return out;
}

const root = process.argv[2] || "content";
let flagged = 0;
let scanned = 0;

for (const file of bundles(root).sort()) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  const hits = [];
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== "string" || !PROSE.test(key)) continue;
    scanned++;
    for (const [re, tag, why] of TELLS) {
      const found = value.match(re);
      if (found) hits.push({ key, tag, why, n: found.length });
    }
  }
  if (!hits.length) continue;
  flagged += hits.length;
  console.log(`\n${file.replace(/\/res\/strings.*/, "")}`);
  for (const h of hits) console.log(`  ${h.key.padEnd(22)} ${h.tag} x${h.n}  - ${h.why}`);
}

console.log(`\n${flagged} flag(s) across ${scanned} prose string(s) in ${root}`);
console.log("Each is a question, not a verdict. Read it aloud; if a colleague would say it, keep it.");
