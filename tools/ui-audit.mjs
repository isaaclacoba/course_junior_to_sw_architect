#!/usr/bin/env node
/**
 * tools/ui-audit.mjs - the RUNTIME UI auditor. Everything the static checkers
 * cannot see, because it only exists once a real browser has laid the page out.
 *
 * WHY THIS EXISTS. Two defects shipped that no static check could have caught:
 * an `example` box that had been authored on 135 cards and never un-hidden, so
 * the content rendered into an element nobody could see; and a Run button that
 * showed one frozen label for a 60s compiler boot and then, on failure, quietly
 * enabled itself. Both are invisible to a linter and obvious to a browser. This
 * tool is the browser.
 *
 * WHAT IT CHECKS (three families, all on a real laid-out page)
 *
 *   runtime   console errors and uncaught exceptions; failed requests and any
 *             response >= 400; placeholder text that escaped into the UI
 *             ("undefined", "[object Object]", an unsubstituted {{token}});
 *             untranslated chrome (a lesson in `es` still painting a known
 *             English chrome string); and controls STUCK - a button still
 *             disabled or aria-busy when the settle window runs out.
 *   layout    content that renders but cannot be seen (non-empty text in a
 *             zero-size or clipped-away box); elements overflowing the document
 *             horizontally; text clipped by a fixed-height ancestor; and
 *             overlapping siblings.
 *   a11y      contrast below WCAG AA for the text actually painted; controls
 *             with no accessible name; positive tabindex (which reorders the
 *             tab sequence away from the DOM); focusable elements inside a
 *             hidden subtree; and a disabled control with no reason given.
 *
 * WHAT IT DOES NOT DO. It does not judge content, pedagogy or wording - that is
 * `course-audit` and `tools/validate.mjs`. It does not check i18n round-tripping
 * - that is `tools/i18n-roundtrip.mjs`, which drives the language switch. It
 * reports; it never edits.
 *
 * USAGE
 *   node tools/ui-audit.mjs <lesson-dir | url> [more...]
 *   node tools/ui-audit.mjs --all              # every lesson + the landing page
 *   node tools/ui-audit.mjs --all --only runtime,a11y
 *   flags:
 *     --all           audit every lesson under content/ plus index.html
 *     --only a,b      run only these families (runtime | layout | a11y)
 *     --lang <code>   audit in this language (default: the lesson default)
 *     --settle <ms>   how long a control may stay busy before it is STUCK
 *                     (default 20000 - a build page really does boot a ~30MB
 *                     WebAssembly compiler, and that is not a defect)
 *     --width <px>    viewport width (default 1280). Use 390 for a phone pass.
 *     --jobs <n>      pages audited at once (default: sized from free memory)
 *     --json          machine-readable report on stdout
 *     --report <file> write the JSON report to a file as well
 *     --warn-only     always exit 0 (for a first look at a dirty baseline)
 *     --verbose       print each page as it finishes, and every finding
 *     --self-test     audit tools/fixtures/ui-audit-fixture.html, which carries
 *                     one deliberate defect per rule, and fail unless EVERY rule
 *                     fires. Run it after touching the probe: a checker that has
 *                     gone quiet looks exactly like a codebase that is clean.
 *
 * Exits non-zero if anything is found, so it works as a gate.
 */
import fs from "node:fs";
import path from "node:path";
import { closeChrome, defaultJobs, launchChrome, openTab, root, sleep, startServer } from "./lib/browser.mjs";

const C = { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", dim: "\x1b[2m", reset: "\x1b[0m" };
const say = (s = "") => process.stdout.write(s + "\n");
const FAMILIES = ["runtime", "layout", "a11y"];

// ---------------------------------------------------------------------------
// args
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const a = {
    targets: [], all: false, only: null, lang: null, settle: 20000, width: 1280,
    jobs: 0, json: false, report: null, warnOnly: false, verbose: false,
    selfTest: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (v === "--all") a.all = true;
    else if (v === "--self-test") a.selfTest = true;
    else if (v === "--json") a.json = true;
    else if (v === "--warn-only") a.warnOnly = true;
    else if (v === "--verbose") a.verbose = true;
    else if (v === "--only") a.only = String(argv[++i] || "").split(",").map((s) => s.trim()).filter(Boolean);
    else if (v === "--lang") a.lang = argv[++i];
    else if (v === "--settle") a.settle = Number(argv[++i]);
    else if (v === "--width") a.width = Number(argv[++i]);
    else if (v === "--jobs") a.jobs = Number(argv[++i]);
    else if (v === "--report") a.report = argv[++i];
    else if (!v.startsWith("--")) a.targets.push(v);
  }
  if (a.only) {
    const bad = a.only.filter((f) => !FAMILIES.includes(f));
    if (bad.length) { say(`unknown family: ${bad.join(", ")} (expected ${FAMILIES.join(" | ")})`); process.exit(2); }
  }
  return a;
}

// ---------------------------------------------------------------------------
// what to audit
// ---------------------------------------------------------------------------
function discoverLessons() {
  const out = [];
  (function walk(d) {
    let ents;
    try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    if (ents.some((e) => e.name === "index.html") && ents.some((e) => e.name === "meta.js")) { out.push(d); return; }
    for (const e of ents) if (e.isDirectory()) walk(path.join(d, e.name));
  })(path.join(root, "content"));
  return out.sort();
}

// A target may be a lesson dir, an index.html, or a site-relative URL path.
function toPath(target) {
  if (target.startsWith("/") && !fs.existsSync(target)) return target;
  let p = path.resolve(target);
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  return "/" + path.relative(root, p).split(path.sep).join("/");
}

// ---------------------------------------------------------------------------
// the in-page probe
//
// One stringified function, evaluated after the page has settled. It runs in the
// page so it can read computed styles and real layout boxes; everything it finds
// comes back as plain data.
// ---------------------------------------------------------------------------
// The probe runs IN THE PAGE, so it is written as a normal function and
// stringified - never as a template literal. A template literal processes escape
// sequences before the browser ever sees them, which quietly turned the regex
// `...` into "any three characters" and made a rule match everything. Plain
// source has no escaping layer to get wrong.
async function probeFn(families, settleMs) {
  const FAM = families;
  const on = (f) => FAM.indexOf(f) !== -1;
  const out = [];
  const add = (family, rule, detail, where) => out.push({ family, rule, detail, where });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Measure a settled page. The hero fades in over ~520ms, so sampling early
  // catches every element inside it at opacity 0 and reports the whole header
  // as invisible - a defect that exists for half a second and never again.
  if (document.getAnimations) {
    const running = document.getAnimations().filter((a) => a.playState === "running");
    await Promise.race([
      Promise.all(running.map((a) => a.finished.catch(() => {}))),
      sleep(3000),   // an infinite animation (a spinner) must not hang the audit
    ]);
  }

  function cssPath(el) {
    if (!el || el === document.body) return "body";
    if (el.id) return "#" + el.id;
    const cls = (el.className && typeof el.className === "string")
      ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    const tag = el.tagName.toLowerCase();
    const parent = el.parentElement;
    const idx = parent ? Array.prototype.indexOf.call(parent.children, el) + 1 : 0;
    return (parent && parent !== document.body ? cssPath(parent) + " > " : "") + tag + cls + (cls ? "" : ":nth-child(" + idx + ")");
  }
  const text = (el) => (el.textContent || "").replace(/\s+/g, " ").trim();

  // Monaco is a third-party virtualised editor: it renders a scroll surface far
  // larger than its box and positions layers past its own edges, on purpose.
  // Auditing its internals reports its design as a defect. The editor's own
  // BOX is still audited - only what it draws inside it is skipped.
  const VIRTUAL = ".monaco-editor, .cl-editor, .monaco-scrollable-element";
  const virtualised = (el) => !!el.closest(VIRTUAL);
  const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + "\u2026" : s);

  // An element is only really on screen if it and every ancestor are displayed.
  function shown(el) {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.display === "none" || s.visibility === "hidden" || n.hidden) return false;
      if (Number(s.opacity) === 0) return false;
    }
    return true;
  }

  // -------------------------------------------------------------------------
  // runtime: controls that never finish
  // -------------------------------------------------------------------------
  if (on("runtime")) {
    // A plain disabled attribute is NOT the signal - a Prev button on the first
    // card is correctly off, and treating that as stuck would both cry wolf on
    // every page and burn the settle window waiting for it. The signal is a
    // control that says it is WORKING: aria-busy, or a label that is a progress
    // message. That is the thing which must eventually stop.
    const WORKING = /(\u2026|\.\.\.|\d+\s*%|loading|preparing|downloading|starting|warming|please wait|cargando|preparando|descargando|arrancando|calentando|espera)/i;
    const busy = () => Array.prototype.filter.call(
      document.querySelectorAll("button, [role=button], [aria-busy]"),
      (b) => shown(b) && (b.getAttribute("aria-busy") === "true" ||
                          (b.disabled && WORKING.test(text(b)))));

    // A busy state usually starts a moment after load, so give it a short window
    // to appear. Pages that never show one - most of them - leave immediately.
    let working = busy();
    const appearBy = Date.now() + 2500;
    while (!working.length && Date.now() < appearBy) { await sleep(200); working = busy(); }

    if (working.length) {
      const deadline = Date.now() + settleMs;
      // Track the labels: a control whose message keeps changing is making
      // progress, which is the whole point of reporting progress.
      let lastLabels = working.map(text).join("|");
      let lastChange = Date.now();
      while (working.length && Date.now() < deadline) {
        await sleep(400);
        working = busy();
        const now = working.map(text).join("|");
        if (now !== lastLabels) { lastLabels = now; lastChange = Date.now(); }
      }
      for (const b of working) {
        const still = Math.round((Date.now() - lastChange) / 1000);
        add("runtime", "stuck-control",
          'control "' + trunc(text(b) || b.id || "(no label)", 40) + '" still says it is working after ' +
          Math.round(settleMs / 1000) + "s" +
          (still >= 3 ? " and its label has not changed for " + still + "s" : ""),
          cssPath(b));
      }
    }
  }

  // -------------------------------------------------------------------------
  // runtime: placeholder text that escaped into the page
  // -------------------------------------------------------------------------
  if (on("runtime")) {
    const LEAKS = [
      [/\bundefined\b/, "undefined"],
      [/\[object [A-Z]\w+\]/, "[object Object]"],
      [/\{\{[^}]+\}\}/, "an unsubstituted {{token}}"],
      [/\bNaN\b/, "NaN"],
      [/\bnull\b/, "null"],
    ];
    const SKIP = "pre, code, .monaco-editor, .cl-editor, script, style, textarea";
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      if (!el || el.closest(SKIP) || !shown(el)) continue;
      const t = (n.nodeValue || "").trim();
      if (!t) continue;
      for (const [re, name] of LEAKS) {
        if (!re.test(t)) continue;
        const key = name + "|" + cssPath(el);
        if (seen.has(key)) continue;
        seen.add(key);
        add("runtime", "placeholder-text", name + ' rendered as text: "' + trunc(t, 60) + '"', cssPath(el));
      }
    }
  }

  // -------------------------------------------------------------------------
  // layout: content that renders but cannot be seen
  //
  // This is the exact shape of the example-box bug: the text was in the DOM and
  // correct, and the box around it was never shown.
  // -------------------------------------------------------------------------
  if (on("layout")) {
    const carriers = document.querySelectorAll("p, li, h1, h2, h3, h4, span, td, th, button, a, label, figcaption");
    const seen = new Set();
    for (const el of carriers) {
      const t = text(el);
      if (!t || el.children.length) continue;         // only leaf text
      if (!shown(el) || virtualised(el)) continue;     // deliberately hidden is fine
      const r = el.getBoundingClientRect();
      if (r.width > 0.5 && r.height > 0.5) continue;
      const key = cssPath(el);
      if (seen.has(key)) continue;
      seen.add(key);
      add("layout", "invisible-content",
        'text is in the DOM but its box is ' + Math.round(r.width) + "x" + Math.round(r.height) + ': "' + trunc(t, 50) + '"',
        key);
    }
  }

  // -------------------------------------------------------------------------
  // layout: clipped text, and anything hanging off the side of the document
  // -------------------------------------------------------------------------
  if (on("layout")) {
    const docW = document.documentElement.clientWidth;
    for (const el of document.querySelectorAll("body *")) {
      if (!shown(el) || virtualised(el)) continue;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;

      // Overflowing the viewport horizontally is what produces the sideways
      // scrollbar nobody wants; vertical overflow is just a long page.
      if (r.left < -1 || r.right > docW + 1) {
        if (s.position !== "fixed" && s.overflowX !== "hidden") {
          add("layout", "offscreen",
            "extends " + Math.round(Math.max(-r.left, r.right - docW)) + "px past the edge of the document",
            cssPath(el));
        }
      }

      // Content taller than its box, with no way to scroll to the rest.
      const hidden = s.overflowY === "hidden" || s.overflow === "hidden";
      if (hidden && el.scrollHeight > el.clientHeight + 2 && text(el)) {
        add("layout", "clipped",
          "content is " + (el.scrollHeight - el.clientHeight) + "px taller than its box and overflow is hidden",
          cssPath(el));
      }
    }
  }

  // -------------------------------------------------------------------------
  // layout: siblings drawn on top of each other
  // -------------------------------------------------------------------------
  if (on("layout")) {
    const blocks = Array.prototype.filter.call(
      document.querySelectorAll("main *, .card *, section *"),
      (el) => {
        if (!shown(el)) return false;
        const s = getComputedStyle(el);
        if (s.position === "absolute" || s.position === "fixed" || s.position === "sticky") return false;
        if (s.float !== "none") return false;
        if (virtualised(el)) return false;
        // Inline and inline-block siblings sit side by side and wrap across
        // lines - overlapping vertical extents is how inline layout works.
        if (s.display.indexOf("inline") === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 8 && r.height > 8;
      });
    const seen = new Set();
    for (const el of blocks) {
      const sib = el.nextElementSibling;
      if (!sib || blocks.indexOf(sib) === -1) continue;
      const p = el.parentElement && getComputedStyle(el.parentElement);
      // Grid and flex parents legitimately place children side by side, and a
      // grid with overlapping areas is a deliberate design.
      if (p && (p.display.indexOf("grid") !== -1 || p.display.indexOf("flex") !== -1)) continue;
      const a = el.getBoundingClientRect(), b = sib.getBoundingClientRect();
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      if (overlapY > 2 && overlapX > 2) {
        const key = cssPath(el);
        if (seen.has(key)) continue;
        seen.add(key);
        add("layout", "overlap",
          "overlaps the next sibling by " + Math.round(overlapY) + "px vertically",
          key + "  +  " + cssPath(sib));
      }
    }
  }

  // -------------------------------------------------------------------------
  // a11y: contrast of the text actually painted
  // -------------------------------------------------------------------------
  if (on("a11y")) {
    const parse = (c) => {
      const m = /rgba?\(([^)]+)\)/.exec(c || "");
      if (!m) return null;
      const p = m[1].split(",").map((n) => parseFloat(n));
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };
    const lum = (c) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    };
    // The first ancestor that actually paints something behind this text.
    const backdrop = (el) => {
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c && c.a > 0.95) return c;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };
    const seen = new Set();
    for (const el of document.querySelectorAll("body *")) {
      if (el.children.length || !shown(el)) continue;
      const t = text(el);
      if (!t) continue;
      if (el.closest(".monaco-editor, .cl-editor, pre, code")) continue;  // syntax colours are their own contract
      const s = getComputedStyle(el);
      const fg = parse(s.color);
      if (!fg || fg.a < 0.95) continue;
      const bg = backdrop(el);
      const L1 = lum(fg), L2 = lum(bg);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const px = parseFloat(s.fontSize) || 16;
      const bold = (parseInt(s.fontWeight, 10) || 400) >= 700;
      const large = px >= 24 || (px >= 18.66 && bold);
      const need = large ? 3 : 4.5;
      if (ratio + 0.01 < need) {
        const key = cssPath(el);
        if (seen.has(key)) continue;
        seen.add(key);
        add("a11y", "contrast",
          "contrast " + ratio.toFixed(2) + ":1 is below the " + need + ":1 WCAG AA floor for this size (" +
          s.color + " on " + "rgb(" + bg.r + ", " + bg.g + ", " + bg.b + ")): \"" + trunc(t, 40) + "\"",
          key);
      }
    }
  }

  // -------------------------------------------------------------------------
  // a11y: names, tab order, and focus traps
  // -------------------------------------------------------------------------
  if (on("a11y")) {
    const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]";
    for (const el of document.querySelectorAll(FOCUSABLE)) {
      const visible = shown(el);
      const ti = el.getAttribute("tabindex");

      if (visible) {
        const name = text(el) || el.getAttribute("aria-label") || el.getAttribute("title") ||
          (el.getAttribute("aria-labelledby") && document.getElementById(el.getAttribute("aria-labelledby"))?.textContent) ||
          el.getAttribute("alt") || (el.tagName === "INPUT" && el.labels && el.labels.length ? "labelled" : "");
        if (!String(name || "").trim()) {
          add("a11y", "unnamed-control",
            el.tagName.toLowerCase() + " is focusable but has no accessible name - a screen reader announces it as just its role",
            cssPath(el));
        }
      }

      if (ti && Number(ti) > 0) {
        add("a11y", "positive-tabindex",
          'tabindex="' + ti + '" pulls this out of the DOM order, so the tab sequence stops matching the reading order',
          cssPath(el));
      }

      // aria-hidden does NOT stop an element being focusable - it only hides it
      // from assistive technology. So a control inside an aria-hidden subtree is
      // still in the tab order, and a screen reader user tabs onto something it
      // has been told does not exist.
      if (ti !== "-1" && !el.disabled && el.closest('[aria-hidden="true"]')) {
        add("a11y", "focusable-hidden",
          "is focusable but sits inside an aria-hidden subtree - a screen reader user can tab onto something it has been told is not there",
          cssPath(el));
      }

      // Visually gone but still reachable: focus lands where nothing is drawn.
      // display:none and [hidden] already remove an element from the tab order,
      // so those are not defects - visibility and zero-size boxes are.
      if (!visible && ti !== "-1" && !el.disabled && !el.closest("[hidden]") &&
          getComputedStyle(el).display !== "none") {
        add("a11y", "focusable-invisible",
          "is focusable but is not drawn - keyboard focus can land on nothing",
          cssPath(el));
      }
    }
  }

  return JSON.stringify(out);
}

const PROBE = (families, settleMs) =>
  `(${probeFn.toString()})(${JSON.stringify(families)}, ${settleMs})`;

// ---------------------------------------------------------------------------
// audit one page in one tab
// ---------------------------------------------------------------------------
async function auditPage(cdp, srvPort, pagePath, args) {
  const findings = [];
  const url = `http://127.0.0.1:${srvPort}${pagePath}`;

  const consoleErrors = [];
  const netErrors = [];
  cdp.on("Runtime.consoleAPICalled", (p) => {
    if (p.type !== "error" && p.type !== "assert") return;
    const msg = (p.args || []).map((a) => a.value ?? a.description ?? a.unserializableValue ?? "").join(" ").trim();
    if (msg) consoleErrors.push(msg);
  });
  cdp.on("Runtime.exceptionThrown", (p) => {
    const d = p.exceptionDetails || {};
    consoleErrors.push("uncaught: " + (d.exception?.description || d.text || "error"));
  });
  // loadingFailed only carries a requestId, so keep the URLs to name the
  // resource - "ERR_ABORTED (Fetch)" on its own is not something anyone can act on.
  const urls = new Map();
  // Chrome asks every document for /favicon.ico even when the page never
  // declared one. That request has initiator "other" - nothing in the markup
  // asked for it - so a 404 on it says nothing about the page. A favicon the
  // page DOES declare has initiator "parser" and is still reported.
  const implicitFavicon = new Set();
  cdp.on("Network.requestWillBeSent", (p) => {
    const url = (p.request && p.request.url) || "";
    urls.set(p.requestId, url);
    if (/\/favicon\.ico$/.test(url) && (p.initiator || {}).type === "other") implicitFavicon.add(p.requestId);
  });
  cdp.on("Network.loadingFailed", (p) => {
    if (p.type === "Document" || !p.errorText || implicitFavicon.has(p.requestId)) return;
    const url = (urls.get(p.requestId) || "").replace(`http://127.0.0.1:${srvPort}`, "");
    // A canceled request is the page tearing something down on purpose - a
    // removed iframe, a superseded fetch - not a resource that is missing.
    if (p.canceled && p.errorText === "net::ERR_ABORTED") return;
    netErrors.push(`${p.errorText} ${url || "(" + p.type + ")"}`);
  });
  cdp.on("Network.responseReceived", (p) => {
    if (implicitFavicon.has(p.requestId)) return;
    if (p.response && p.response.status >= 400) {
      netErrors.push(`HTTP ${p.response.status} ${p.response.url.replace(`http://127.0.0.1:${srvPort}`, "")}`);
    }
  });

  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: args.width, height: 900, deviceScaleFactor: 1, mobile: args.width < 700,
  });
  if (args.lang) {
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `try { localStorage.setItem("course_lesson_lang", ${JSON.stringify(args.lang)}); } catch (e) {}`,
    });
  }

  await cdp.send("Page.navigate", { url });
  // Wait for the page to be laid out. The probe does its own waiting for
  // controls, so this only needs to cover first paint.
  for (let i = 0; i < 60; i++) {
    const ready = await cdp.evaluate("document.readyState === 'complete'").catch(() => false);
    if (ready) break;
    await sleep(100);
  }
  await sleep(400);

  let raw = "[]";
  try {
    raw = await cdp.evaluate(PROBE(args.only || FAMILIES, args.settle));
  } catch (e) {
    findings.push({ family: "runtime", rule: "probe-failed", detail: e.message, where: "" });
  }
  for (const f of JSON.parse(raw || "[]")) findings.push(f);

  if (!args.only || args.only.includes("runtime")) {
    // Read the console AFTER the probe, so anything thrown during its settle
    // window - which is where a boot failure lands - is counted.
    for (const m of dedupe(consoleErrors)) findings.push({ family: "runtime", rule: "console-error", detail: trunc(m, 160), where: "" });
    for (const m of dedupe(netErrors)) findings.push({ family: "runtime", rule: "request-failed", detail: trunc(m, 160), where: "" });
  }
  return findings;
}

function dedupe(list) {
  const seen = new Set(), out = [];
  for (const v of list) { const k = v.replace(/\d+/g, "#"); if (!seen.has(k)) { seen.add(k); out.push(v); } }
  return out;
}
const trunc = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1) + "\u2026" : String(s));

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
// Every rule the probe can emit. The self-test asserts each one fires on the
// fixture, so a rule cannot be quietly broken - or added without a defect to
// prove it against.
const RULES = [
  "runtime/stuck-control", "runtime/placeholder-text", "runtime/console-error", "runtime/request-failed",
  "layout/invisible-content", "layout/offscreen", "layout/clipped", "layout/overlap",
  "a11y/contrast", "a11y/unnamed-control", "a11y/positive-tabindex", "a11y/focusable-hidden",
  "a11y/focusable-invisible",
];

async function selfTest(args) {
  const page = "/tools/fixtures/ui-audit-fixture.html";
  const { server, port } = await startServer(0);
  let chrome = null;
  let findings = [];
  try {
    chrome = await launchChrome("uiaudit-selftest-");
    // The fixture's stuck button never resolves, so a long settle only wastes
    // time here - the point is that it is still stuck, however long we wait.
    findings = await auditPage(chrome.cdp, port, page, { ...args, only: null, settle: 1500 });
  } finally {
    try { server.close(); } catch {}
    await closeChrome(chrome);
  }

  const fired = new Set(findings.map((f) => f.family + "/" + f.rule));
  const missing = RULES.filter((r) => !fired.has(r));
  const unexpected = [...fired].filter((r) => !RULES.includes(r));

  say("");
  for (const r of RULES) say(`  ${fired.has(r) ? C.green + "fires" : C.red + "QUIET"}${C.reset}  ${r}`);
  for (const r of unexpected) say(`  ${C.yellow}extra${C.reset}  ${r} (not in RULES - add it, with a defect in the fixture)`);
  say("");

  if (missing.length) {
    say(`${C.red}FAIL${C.reset} ${missing.length} rule(s) did not fire on a fixture built to trip them: ${missing.join(", ")}`);
    say(`${C.dim}A rule that cannot fire is worse than no rule - it reads as a clean bill of health.${C.reset}`);
    process.exit(1);
  }
  say(`${C.green}PASS${C.reset} all ${RULES.length} rules fire on the fixture`);
  process.exit(0);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) return selfTest(args);
  if (!args.all && !args.targets.length) {
    say("usage: node tools/ui-audit.mjs <lesson-dir | url | --all> [--only runtime,layout,a11y] [--json]");
    process.exit(2);
  }

  const pages = args.all
    ? ["/index.html", ...discoverLessons().map((d) => toPath(d))]
    : args.targets.map(toPath);

  const jobs = Math.max(1, Math.min(args.jobs || defaultJobs(), pages.length));
  const { server, port } = await startServer(0);
  let chrome = null;
  const report = [];

  try {
    chrome = await launchChrome("uiaudit-");
    const tabs = [{ cdp: chrome.cdp }];
    for (let i = 1; i < jobs; i++) tabs.push(await openTab(chrome.devPort));

    let next = 0;
    await Promise.all(tabs.map(async (tab) => {
      while (true) {
        const i = next++;
        if (i >= pages.length) return;
        const pagePath = pages[i];
        let findings = [];
        try {
          findings = await auditPage(tab.cdp, port, pagePath, args);
        } catch (e) {
          findings = [{ family: "runtime", rule: "audit-failed", detail: e.message, where: "" }];
        }
        report.push({ page: pagePath, findings });
        if (args.verbose) {
          const n = findings.length;
          say(`  ${n ? C.red + "FAIL" + C.reset : C.green + "PASS" + C.reset} ${pagePath}${n ? ` (${n})` : ""}`);
        }
      }
    }));
  } finally {
    try { server.close(); } catch {}
    await closeChrome(chrome);
  }

  report.sort((a, b) => a.page.localeCompare(b.page));
  const all = report.flatMap((r) => r.findings.map((f) => ({ ...f, page: r.page })));

  if (args.report) fs.writeFileSync(args.report, JSON.stringify({ pass: !all.length, pages: report }, null, 2) + "\n");
  if (args.json) { say(JSON.stringify({ pass: !all.length, pages: report }, null, 2)); process.exit(all.length && !args.warnOnly ? 1 : 0); }

  // Group by rule: one systemic defect across 90 pages is ONE thing to fix, and
  // printing it 90 times buries the other nine.
  const byRule = new Map();
  for (const f of all) {
    const k = f.family + "/" + f.rule;
    if (!byRule.has(k)) byRule.set(k, []);
    byRule.get(k).push(f);
  }
  const rules = [...byRule.entries()].sort((a, b) => b[1].length - a[1].length);

  say("");
  for (const [rule, hits] of rules) {
    const pagesHit = new Set(hits.map((h) => h.page)).size;
    say(`${C.red}${rule}${C.reset}  ${hits.length} finding(s) on ${pagesHit} page(s)`);
    const show = args.verbose ? hits : hits.slice(0, 3);
    for (const h of show) {
      say(`    ${C.dim}${h.page}${C.reset}`);
      say(`      ${h.detail}`);
      if (h.where) say(`      ${C.dim}${h.where}${C.reset}`);
    }
    if (!args.verbose && hits.length > show.length) say(`    ${C.dim}... and ${hits.length - show.length} more (--verbose for all)${C.reset}`);
    say("");
  }

  const label = `${all.length} finding(s) across ${report.length} page(s)`;
  if (!all.length) say(`${C.green}PASS${C.reset} ${report.length} page(s) clean`);
  else say(`${args.warnOnly ? C.yellow + "WARN" : C.red + "FAIL"}${C.reset} ${label}`);
  process.exit(all.length && !args.warnOnly ? 1 : 0);
}

main().catch((e) => { say(String(e && e.stack || e)); process.exit(2); });
