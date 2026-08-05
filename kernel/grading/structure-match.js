/*
 * kernel/grading/structure-match.js - the shared "does the code have this shape
 * yet?" policy behind the live goal tracker.
 *
 * A sibling of output-match.js and the same deal: DOM-free, dependency-free,
 * one source of truth so the browser tracker and the Node validator cannot
 * drift. It answers a STRUCTURAL question - is there a `Cat` with an
 * `IsHungry`, does `Penguin` still inherit `Bird` - over the type list a
 * scanner produced. It never sees source text and never runs anything.
 *
 * WHY IT IS NOT GRADING. Nothing here awards XP. XP stays with the run: real
 * output from the real compiler. This only drives the checklist that tells a
 * learner where they are while they type, which is exactly the help that was
 * missing when a goal could only be understood by reading the solution. A tick
 * here means "the shape is there", never "you are done".
 *
 * A gate is DECLARATIVE - a small object, not a function - so a lesson's data
 * file stays data, the Node validator can assert every gate against the
 * authored solution, and a gate that could never light up is a build failure
 * rather than a checklist item that sits grey forever.
 *
 * Gate fields, all optional, all ANDed:
 *   type   "Cat"          a type with this name exists
 *   kind   "interface"    ...and it was declared with this keyword
 *   member "IsHungry"     ...and it declares this member
 *   base   "IAnimal"      ...and its base list includes this
 *   absent "CheckAndSign" NO type declares a member (or type) with this name
 *   writes ["FEED"]      ...and this text appears inside that type's body
 *   gone   ">= 6"        ...and this text no longer appears inside it
 *
 * WHY writes/gone EXIST. Some cards change nothing about the SHAPE - the whole
 * task is logic inside a method that already exists - so a purely structural
 * tracker sits inert while the learner types and only wakes on Run. These two
 * fields give those cards a live signal by looking at the source, scoped to the
 * gate's own type so "change it in both classes" can tick one class at a time.
 * They answer "has this work visibly started", never "is it correct": comments
 * are stripped first (a TODO naming FEED must not count) and correctness stays
 * with the run.
 *
 * Loaded two ways with no bundler:
 *   - browser: a <script> sets window.KernelStructure.
 *   - node:    module.exports (require in tests and in tools/).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else if (root) {
    root.KernelStructure = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  function nameOf(member) {
    if (!member) return "";
    return typeof member === "string" ? member : (member.name || "");
  }

  function memberNames(type) {
    var members = (type && type.members) || [];
    return members.map(nameOf).filter(Boolean);
  }

  function findType(types, name) {
    for (var i = 0; i < types.length; i++) {
      if (types[i] && types[i].name === name) return types[i];
    }
    return null;
  }

  // "Nothing anywhere is called this" - the gate that proves a shape was
  // actually SPLIT rather than merely added to. Checked over type names as well
  // as members so `absent: "AnimalVoice"` retires a whole class.
  function isAbsent(types, name) {
    for (var i = 0; i < types.length; i++) {
      if (types[i].name === name) return false;
      if (memberNames(types[i]).indexOf(name) !== -1) return false;
    }
    return true;
  }

  // Remove comments but KEEP string literals - the literals are exactly what a
  // `writes` gate looks for, while a TODO comment naming them must not count.
  function stripComments(src) {
    var out = "";
    var i = 0;
    var n = src.length;
    var inStr = 0; // 1 = "..."  2 = '...'
    while (i < n) {
      var c = src.charAt(i);
      var d = src.charAt(i + 1);
      if (inStr === 0) {
        if (c === "/" && d === "/") { while (i < n && src.charAt(i) !== "\n") i++; continue; }
        if (c === "/" && d === "*") {
          i += 2;
          while (i < n && !(src.charAt(i) === "*" && src.charAt(i + 1) === "/")) i++;
          i += 2; continue;
        }
        if (c === '"') inStr = 1;
        else if (c === "'") inStr = 2;
        out += c; i++; continue;
      }
      if (c === "\\") { out += c + d; i += 2; continue; }
      if ((inStr === 1 && c === '"') || (inStr === 2 && c === "'")) inStr = 0;
      out += c; i++;
    }
    return out;
  }

  // The text between one type's braces, so a source check can be scoped to the
  // class it is about. Brace matching skips string literals so a `"{"` in the
  // learner's code cannot end the body early.
  function typeBody(src, name) {
    if (!name) return "";
    var esc = String(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var m = new RegExp("\\b(?:class|interface|record|struct|enum)\\s+" + esc + "\\b").exec(src);
    if (!m) return "";
    var open = src.indexOf("{", m.index + m[0].length);
    if (open === -1) return "";
    var depth = 0;
    var inStr = 0;
    for (var j = open; j < src.length; j++) {
      var c = src.charAt(j);
      if (inStr) {
        if (c === "\\") { j++; continue; }
        if ((inStr === 1 && c === '"') || (inStr === 2 && c === "'")) inStr = 0;
        continue;
      }
      if (c === '"') { inStr = 1; continue; }
      if (c === "'") { inStr = 2; continue; }
      if (c === "{") depth++;
      else if (c === "}") { depth--; if (depth === 0) return src.slice(open + 1, j); }
    }
    return src.slice(open + 1);
  }

  // Whitespace is not a decision: `>= 6` and `>=6` are the same edit.
  function squeeze(text) { return String(text).replace(/\s+/g, ""); }

  function sourceMeets(source, gate) {
    if (!gate.writes && !gate.gone) return true;
    // A source-conditioned gate with no source to read is UNMET, never met. The
    // alternative fails open: a caller that forgot to pass the source would see
    // a green tick it never earned, which is exactly the silent pass this
    // tracker exists to prevent.
    if (typeof source !== "string" || source === "") return false;
    var src = stripComments(String(source));
    var hay = squeeze(gate.type ? typeBody(src, gate.type) : src);
    var i;
    if (gate.writes) {
      var want = Array.isArray(gate.writes) ? gate.writes : [gate.writes];
      for (i = 0; i < want.length; i++) {
        if (hay.indexOf(squeeze(want[i])) === -1) return false;
      }
    }
    if (gate.gone) {
      var old = Array.isArray(gate.gone) ? gate.gone : [gate.gone];
      for (i = 0; i < old.length; i++) {
        if (hay.indexOf(squeeze(old[i])) !== -1) return false;
      }
    }
    return true;
  }

  // Evaluate one gate against the scanned types. Returns a boolean and never
  // throws: a malformed gate is unmet, not an exception in the middle of typing.
  function meets(types, gate, source) {
    if (!gate || typeof gate !== "object") return false;
    types = Array.isArray(types) ? types : [];

    if (gate.absent && !isAbsent(types, gate.absent)) return false;

    // A gate MAY be absence-only ({ absent: "CheckAndSign" }), in which case
    // there is no type to look up and the absence check above is the verdict.
    if (!gate.type) return !!gate.absent && sourceMeets(source, gate);

    var found = findType(types, gate.type);
    if (!found) return false;
    if (gate.kind && found.kind !== gate.kind) return false;
    if (gate.member && memberNames(found).indexOf(gate.member) === -1) return false;
    if (gate.base) {
      var bases = found.bases || [];
      if (bases.indexOf(gate.base) === -1) return false;
    }
    if (!sourceMeets(source, gate)) return false;
    return true;
  }

  // A blueprint row lists its members as SIGNATURES - "bool IsHungry()" rather
  // than "IsHungry" - because a signature tells a learner what to write without
  // writing it for them. Matching still happens on the identifier alone, so the
  // return type and parameter names are free to be a hint.
  function symbolName(spec) {
    if (!spec) return "";
    var text = typeof spec === "string" ? spec : (spec.name || "");
    var call = text.match(/([A-Za-z_]\w*)\s*(?:<[^>]*>)?\s*\(/);
    if (call) return call[1];
    // What follows the NAME is never part of it: a property's accessor block
    // ("string Name { get; set; }"), an expression body ("int Count => _n"), or
    // an initializer ("int _hours = 0"). Taking the last whitespace-separated
    // word picked up "}", "_n" and "0" respectively - so a property row matched
    // no member and sat grey forever, and a field row matched the wrong one.
    // The name is the last identifier BEFORE any of that.
    text = String(text).replace(/[={][\s\S]*$/, " ");
    var words = text.trim().split(/\s+/);
    var ident = (words[words.length - 1] || "").match(/([A-Za-z_]\w*)/);
    return ident ? ident[1] : "";
  }

  // Per-ROW verdicts for one blueprint box.
  //
  // A box already lists its parts as code rows - "class Cat", "int _hours",
  // "Cat(int hours)", "bool IsHungry()" - so those rows ARE the subtasks. No
  // extra authoring: the row's identifier is read with symbolName and looked up
  // as a member. That is what turns a card into visible small steps instead of
  // one box that stays grey until everything lands at once.
  //
  // Row 0 is the header (the type itself); rows 1..n are its members. A member
  // row cannot be met while the header is unmet - there is no type to hold it.
  // Returns [] for anything that is not a type-shaped box, so a caller can fall
  // back to the single box-level verdict.
  function rows(types, gate, code, source) {
    var list = !code ? [] : (Array.isArray(code) ? code : [code]);
    if (!list.length || !gate || typeof gate !== "object" || !gate.type) return [];
    types = Array.isArray(types) ? types : [];

    var found = findType(types, gate.type);
    var headerOk = !!found;
    if (headerOk && gate.kind && found.kind !== gate.kind) headerOk = false;
    if (headerOk && gate.base) {
      var bases = found.bases || [];
      if (bases.indexOf(gate.base) === -1) headerOk = false;
    }
    // A source condition is a prerequisite of the whole box, exactly like a
    // wrong base list: until the work has visibly started, no row under it can
    // claim to be done.
    if (headerOk && !sourceMeets(source, gate)) headerOk = false;

    var names = headerOk ? memberNames(found) : [];
    var out = [headerOk];
    for (var i = 1; i < list.length; i++) {
      var row = list[i];
      // A STEP row carries its own source condition instead of naming a member.
      // Work inside a method body - building a list, calling the new collaborator
      // - declares no symbol, so a member lookup can never see it and the row
      // would sit grey while the learner does exactly the right thing.
      if (row && typeof row === "object") {
        out.push(headerOk && sourceMeets(source, {
          type: gate.type, writes: row.writes, gone: row.gone,
        }));
        continue;
      }
      var want = symbolName(row);
      out.push(headerOk && !!want && names.indexOf(want) !== -1);
    }
    return out;
  }

  // The text a row shows. A step row keeps its label in `row`; a member row IS
  // its signature. One place, so the renderer and the validator cannot drift.
  function rowLabel(row) {
    if (row && typeof row === "object") return String(row.row || "");
    return String(row == null ? "" : row);
  }

  // The tracker's whole payload: one verdict per gate, in the authored order,
  // so a caller can zip it straight onto the localized goal list.
  //
  // THREE verdicts, not two. A goal line may have no structural test at all -
  // "run it and the output is FEED" is a claim about behaviour that only the
  // compiler can settle - and its gate is authored as null. Those must not
  // collapse into `false`, or a learner gets a tick that can never turn green
  // and a validator gets a failure it cannot fix. null means UNTRACKED; false
  // still means the shape is genuinely not there yet.
  function evaluate(types, gates, source) {
    if (!Array.isArray(gates)) return [];
    return gates.map(function (gate) {
      return gate === null || gate === undefined ? null : meets(types, gate, source);
    });
  }

  // Describe a gate for a validator's failure message. Not shown to learners -
  // their copy is the localized goal text this gate sits beside.
  function describe(gate) {
    if (gate === null || gate === undefined) return "(no structural test)";
    if (typeof gate !== "object") return "(not a gate)";
    var parts = [];
    if (gate.kind) parts.push(gate.kind);
    if (gate.type) parts.push(gate.type);
    if (gate.member) parts.push("." + gate.member);
    if (gate.base) parts.push(": " + gate.base);
    if (gate.absent) parts.push("without " + gate.absent);
    if (gate.writes) parts.push("writing " + [].concat(gate.writes).join(" + "));
    if (gate.gone) parts.push("no longer " + [].concat(gate.gone).join(" / "));
    return parts.length ? parts.join(" ") : "(empty gate)";
  }

  // THE verdict a learner actually sees, in one place.
  //
  // `evaluate` alone is not it. A box is green only when its gate AND every row
  // under it is green, so a caller that reads `evaluate` is reading an
  // intermediate value - and a test written against that layer passes while the
  // tracker on screen says something else. Everything that asks "is this goal
  // done?" must come through here.
  function verdicts(types, goals, source) {
    var list = Array.isArray(goals) ? goals : [];
    var gates = list.map(function (g) {
      return g && g.gate !== undefined ? g.gate : undefined;
    });
    var met = evaluate(types, gates, source);
    for (var i = 0; i < met.length; i++) {
      if (met[i] !== true) continue;
      var verd = rows(types, gates[i], list[i] && list[i].code, source);
      for (var k = 0; k < verd.length; k++) {
        if (verd[k] !== true) { met[i] = false; break; }
      }
    }
    return met;
  }

  return {
    meets: meets, evaluate: evaluate, rows: rows, describe: describe,
    symbolName: symbolName, rowLabel: rowLabel, verdicts: verdicts,
    // Exported so the validator can ask "did the body of this type change?"
    // against the SAME text the tracker reads. Two implementations of "the
    // code inside this class" would drift, and the check that drifts is the
    // check that stops catching anything.
    typeBody: typeBody, stripComments: stripComments, squeeze: squeeze,
  };
});
