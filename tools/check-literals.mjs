#!/usr/bin/env node
// ---------------------------------------------------------------------------
// check-literals - find user-visible English hardcoded into the engines.
//
// WHY THIS IS NOT A STRING SCAN
// A naive "look for quoted prose" linter is useless here, because the CORRECT
// pattern deliberately contains the English literal:
//
//     resultTitle.textContent = tr("result.passed", "Passed");
//
// `t(key, fallback)` takes English as its fallback, so at the string level a
// correct call and a hardcoded bug are identical. A PoC over this repo found
// 337 such literals, essentially all of them correct. The discriminator is not
// the string, it is where the string FLOWS: does it reach a user-visible sink
// without passing through the translation layer?
//
// WHAT IT FLAGS
// A string literal (or template chunk) that reaches one of:
//   - assignment to .textContent / .innerHTML / .innerText / .placeholder
//     / .title / .ariaLabel / .alt / .label
//   - setAttribute("title"|"placeholder"|"aria-label"|"alt", ...)
//   - an HTML attribute in index.html: title / placeholder / aria-label / alt
// ...WITHOUT being an argument of t / tr / tHtml / tAttr / tSlot, and without
// looking like markup, a selector, a catalog key, or a bare identifier.
//
// ESCAPE HATCH
// A line carrying `// i18n-ignore: <reason>` is skipped. The reason is
// required, so the exemption is reviewable in a diff instead of invisible.
//
// USAGE
//   node tools/check-literals.mjs            # all covered files
//   node tools/check-literals.mjs <file...>  # only these
//   node tools/check-literals.mjs --json     # machine-readable
// Exit 0 = clean, 1 = violations, 2 = tool error.
// ---------------------------------------------------------------------------
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "acorn";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Files whose strings a learner can read. page-shell.js is generated from
// kernel/page-shell/*, so the SOURCE is checked and the artefact is skipped.
export const JS_ROOTS = ["."];
export const JS_DIRS = ["kernel/page-shell", "kernel/grading", "kernel/engine", "kernel/engine/plugins"];
export const HTML_FILES = ["index.html"];

// Superseded 2026-08-03: drill-engine.js is dead (0 pages load it, 0 lessons set
// DRILL_CONFIG) and is scheduled to be replaced by a drill plugin on
// kernel/engine/lesson-engine.js. Its hardcoded chrome will be correct by
// construction there, so patching the God-module first would be throwaway work.
// REMOVE THIS ENTRY when the drill plugin lands.
export const EXCLUDED = {
  "drill-engine.js": "superseded 2026-08-03 - pending migration to a lesson-engine drill plugin",
  "page-shell.js": "generated artefact - kernel/page-shell/* is checked instead",
};

const TRANSLATORS = new Set(["t", "tr", "tHtml", "tAttr", "tSlot"]);
const PROP_SINKS = new Set(["textContent", "innerHTML", "innerText", "placeholder", "title", "ariaLabel", "alt", "label"]);
const ATTR_SINKS = new Set(["title", "placeholder", "aria-label", "alt"]);

const C = process.stdout.isTTY
  ? { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", dim: "\x1b[2m", reset: "\x1b[0m" }
  : { red: "", green: "", yellow: "", dim: "", reset: "" };

// ---------------------------------------------------------------------------
// is this string plausibly prose a learner reads?
// ---------------------------------------------------------------------------
export function looksTranslatable(s) {
  const v = (s || "").trim();
  if (v.length < 2) return false;
  if (!/[A-Za-z]{2}/.test(v)) return false;           // needs real letters
  if (/^[.#][\w-]+/.test(v)) return false;            // .css-class / #id selector
  if (/^</.test(v)) return false;                     // markup fragment
  if (/^[\w-]+\.[\w.-]+$/.test(v)) return false;      // catalog key / filename
  if (/^[a-z]+([A-Z][a-z]*)*$/.test(v)) return false; // bare identifier / camelCase flag
  if (/^https?:\/\//.test(v)) return false;
  // Markup glue: a chunk that is only tags, entities and punctuation carries no
  // prose, even though it is spliced into innerHTML next to text that does.
  const textOnly = v.replace(/<[^>]*>/g, "").replace(/&[a-zA-Z]+;|&#\d+;/g, "").trim();
  if (!/[A-Za-z]{2}/.test(textOnly)) return false;
  // Prose needs a space or a capitalised word - "Close" counts, "px" does not.
  return /\s/.test(v) || /^[A-Z]/.test(v);
}

// ---------------------------------------------------------------------------
// JS: walk the AST, collect literals under a sink that are not under t()
// ---------------------------------------------------------------------------
function walk(node, visit) {
  if (!node || typeof node.type !== "string") return;
  visit(node);
  for (const k of Object.keys(node)) {
    if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
    const v = node[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") walk(c, visit); }
    else if (v && typeof v.type === "string") walk(v, visit);
  }
}

// Every string a subtree can hand to a sink, ignoring anything already routed
// through a translator - t("k","English") is the correct pattern, not a finding.
function literalsOf(node, out = []) {
  if (!node || typeof node.type !== "string") return out;
  if (node.type === "CallExpression") {
    const callee = node.callee;
    const name = callee && (callee.name || (callee.property && callee.property.name));
    if (TRANSLATORS.has(name)) return out;            // translated - stop descending
  }
  if (node.type === "Literal" && typeof node.value === "string") { out.push({ value: node.value, node }); return out; }
  if (node.type === "TemplateLiteral") { for (const q of node.quasis) out.push({ value: q.value.cooked || "", node: q }); }
  for (const k of Object.keys(node)) {
    if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
    const v = node[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") literalsOf(c, out); }
    else if (v && typeof v.type === "string") literalsOf(v, out);
  }
  return out;
}

export function scanJs(src, file = "<input>") {
  let ast;
  try {
    ast = acorn.parse(src, { ecmaVersion: 2022, locations: true, allowReturnOutsideFunction: true });
  } catch (e) {
    throw new Error(`${file}: parse error - ${e.message}`);
  }
  // A trailing `// i18n-ignore: why` excuses its own line; a comment sitting on
  // its own line excuses the NEXT one, so long statements can be marked without
  // pushing the pragma off the end of the screen.
  const ignored = new Set();
  src.split("\n").forEach((l, i) => {
    if (!/\/\/\s*i18n-ignore:\s*\S/.test(l)) return;
    ignored.add(/^\s*\/\//.test(l) ? i + 2 : i + 1);
  });

  const found = [];
  const push = (lit, why) => {
    const line = lit.node.loc.start.line;
    if (ignored.has(line)) return;
    if (!looksTranslatable(lit.value)) return;
    found.push({ file, line, value: lit.value, sink: why });
  };

  walk(ast, (n) => {
    // el.textContent = "..."  /  el.title = `...`
    if (n.type === "AssignmentExpression" && n.left.type === "MemberExpression" && !n.left.computed) {
      const prop = n.left.property.name;
      if (PROP_SINKS.has(prop)) for (const lit of literalsOf(n.right)) push(lit, prop);
    }
    // el.setAttribute("aria-label", "...")
    if (n.type === "CallExpression" && n.callee.type === "MemberExpression"
        && !n.callee.computed && n.callee.property.name === "setAttribute") {
      const a0 = n.arguments[0], a1 = n.arguments[1];
      if (a0 && a0.type === "Literal" && ATTR_SINKS.has(a0.value) && a1) {
        for (const lit of literalsOf(a1)) push(lit, `setAttribute(${a0.value})`);
      }
    }
  });
  return found;
}

// ---------------------------------------------------------------------------
// Which elements does the JS localize at runtime?
//
// index.html carries its English inline and a script swaps in the translation:
//
//     setAria("#cJbEdgeL", "landing.scrollLeft");
//
// That inline English is a FALLBACK, exactly like the second argument of t(),
// so flagging it would punish the correct pattern. Any call that pairs a
// selector literal with a catalog-key literal is treated as localizing that
// selector, and the element it points at is exempt.
// ---------------------------------------------------------------------------
export function localizedSelectors(src) {
  const out = new Set();
  let ast;
  try { ast = acorn.parse(src, { ecmaVersion: 2022, locations: true, allowReturnOutsideFunction: true }); }
  catch { return out; }
  walk(ast, (n) => {
    if (n.type !== "CallExpression") return;
    const args = n.arguments.filter((a) => a.type === "Literal" && typeof a.value === "string");
    const sel = args.find((a) => /^[#.][\w-]+$/.test(a.value));
    const key = args.find((a) => /^[a-z][\w]*\.[\w.]+$/i.test(a.value));
    if (sel && key) out.add(sel.value);
  });
  return out;
}

// ---------------------------------------------------------------------------
// HTML: literal attributes with no data-t marker on the same tag
// ---------------------------------------------------------------------------
export function scanHtml(src, file = "<input>", localized = new Set()) {
  const found = [];
  src.split("\n").forEach((line, i) => {
    if (/<!--\s*i18n-ignore:\s*\S/.test(line)) return;
    for (const m of line.matchAll(/\b(title|placeholder|aria-label|alt)\s*=\s*"([^"]*)"/g)) {
      const attr = m[1], value = m[2];
      if (!looksTranslatable(value)) continue;
      // A tag that already carries a data-t-* marker is wired to the catalog.
      const tagStart = line.lastIndexOf("<", m.index);
      const tag = tagStart >= 0 ? line.slice(tagStart, m.index + m[0].length) : line;
      if (/data-t(-attr)?\s*=/.test(tag)) continue;
      // ...or an element the page script re-labels from the catalog at runtime.
      const idm = tag.match(/\bid\s*=\s*"([^"]+)"/);
      const clm = tag.match(/\bclass\s*=\s*"([^"]+)"/);
      if (idm && localized.has("#" + idm[1])) continue;
      if (clm && clm[1].split(/\s+/).some((c) => localized.has("." + c))) continue;
      found.push({ file, line: i + 1, value, sink: attr });
    }
  });
  return found;
}

// ---------------------------------------------------------------------------
// file discovery
// ---------------------------------------------------------------------------
export function coveredFiles() {
  const out = [];
  for (const d of JS_ROOTS) {
    for (const f of fs.readdirSync(path.join(root, d))) {
      if (!f.endsWith(".js") || EXCLUDED[f]) continue;
      out.push(f);
    }
  }
  for (const d of JS_DIRS) {
    const abs = path.join(root, d);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (!f.endsWith(".js")) continue;
      const rel = path.join(d, f);
      if (EXCLUDED[rel] || EXCLUDED[f]) continue;
      out.push(rel);
    }
  }
  for (const f of HTML_FILES) if (fs.existsSync(path.join(root, f))) out.push(f);
  return out;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
function main(argv) {
  const json = argv.includes("--json");
  const explicit = argv.filter((a) => !a.startsWith("--"));
  const files = explicit.length ? explicit.map((f) => path.relative(root, path.resolve(f))) : coveredFiles();

  // Collect runtime-localized selectors from EVERY covered script first - the
  // page that carries the markup is not the file that translates it.
  const localized = new Set();
  for (const rel of coveredFiles()) {
    if (!rel.endsWith(".js")) continue;
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) continue;
    for (const sel of localizedSelectors(fs.readFileSync(abs, "utf8"))) localized.add(sel);
  }

  let findings = [];
  for (const rel of files) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) { console.error(`skip ${rel} (not found)`); continue; }
    const src = fs.readFileSync(abs, "utf8");
    findings = findings.concat(rel.endsWith(".html") ? scanHtml(src, rel, localized) : scanJs(src, rel));
  }

  if (json) {
    console.log(JSON.stringify({ pass: findings.length === 0, findings }, null, 2));
  } else if (findings.length) {
    console.log(`${C.red}FAIL${C.reset} ${findings.length} hardcoded user-visible literal(s):\n`);
    for (const f of findings) {
      console.log(`  ${f.file}:${f.line}  ${C.yellow}${JSON.stringify(f.value)}${C.reset}  ${C.dim}-> ${f.sink}${C.reset}`);
    }
    console.log(`\n  Route it through the chrome catalog: t("some.key", "English"), with the`);
    console.log(`  key added to res/chrome/en.json AND es.json. If it is genuinely not`);
    console.log(`  translatable, mark the line  // i18n-ignore: <reason>`);
  } else {
    console.log(`${C.green}PASS${C.reset} ${files.length} file(s) checked; no hardcoded user-visible literals.`);
  }
  return findings.length ? 1 : 0;
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try { process.exit(main(process.argv.slice(2))); }
  catch (e) { console.error(`error ${e.message}`); process.exit(2); }
}
