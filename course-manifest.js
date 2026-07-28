/**
 * course-manifest.js - the single source of truth for the course path.
 *
 * Every lesson is a data entry registered into a track and a part. The index
 * (course-index.js) builds itself from this manifest, and each lesson's next/prev
 * button (page-shell.js) reads its order from here - so adding or removing a lesson
 * is a one-line data change in exactly one place.
 *
 * Add a lesson:    Course.register({ track, part, href, key, total, title, blurb, pill, time });
 * Add a part:      Course.definePart({ track, id, title });
 * Add a track:     Course.defineTrack({ id, name, kicker, blurb, partPrefix });
 * Remove: delete the matching line. Order = registration order within a part,
 * parts in definition order, tracks in definition order.
 */
(function (global) {
  var ORDINALS = ["", "one", "two", "three", "four", "five", "six", "seven",
    "eight", "nine", "ten", "eleven", "twelve"];

  var tracks = [];
  var trackById = {};

  var Course = {
    defineTrack: function (t) {
      // { id, name, kicker, blurb, partPrefix }
      t.partPrefix = t.partPrefix || "Part ";
      t.parts = [];
      t.partById = {};
      tracks.push(t);
      trackById[t.id] = t;
      return Course;
    },
    definePart: function (p) {
      // { track, id, title }
      var t = trackById[p.track];
      if (!t) throw new Error("Unknown track: " + p.track);
      p.lessons = [];
      p.kicker = t.partPrefix + (ORDINALS[t.parts.length + 1] || String(t.parts.length + 1));
      t.parts.push(p);
      t.partById[p.id] = p;
      return Course;
    },
    register: function (l) {
      // { track, part, href, key?, total?, title, blurb, pill, time, final? }
      var t = trackById[l.track];
      if (!t) throw new Error("Unknown track: " + l.track);
      var p = t.partById[l.part];
      if (!p) throw new Error("Unknown part: " + l.track + "/" + l.part);
      // Normalize the lesson kind so consumers never special-case the capstone
      // by hand - the status/mapping logic keys off `kind` in exactly one place.
      l.kind = l.final ? "final" : "lesson";
      p.lessons.push(l);
      return Course;
    },
    tracks: function () { return tracks; },
    track: function (id) { return trackById[id]; },
    // Ordered lesson hrefs for a track (parts in order, lessons in order).
    order: function (trackId) {
      var t = trackById[trackId], out = [];
      if (!t) return out;
      t.parts.forEach(function (p) {
        p.lessons.forEach(function (l) { out.push(l.href); });
      });
      return out;
    },
    // Which track an href belongs to, its ordered list, and its index within it.
    locate: function (href) {
      var target = String(href).toLowerCase();
      for (var i = 0; i < tracks.length; i++) {
        var ord = Course.order(tracks[i].id);
        for (var j = 0; j < ord.length; j++) {
          if (ord[j].toLowerCase() === target) {
            return { track: tracks[i].id, order: ord, index: j };
          }
        }
      }
      return null;
    }
  };

  // Registrations below run against this internal builder. The public global is
  // exposed at the very end as a FROZEN, read-only query facade (ISP): consumers
  // (page-shell, course-index) can look up order/locate but cannot mutate the path.

// ---- Tracks ----
Course.defineTrack({ id: "practical", name: "Practical", kicker: "Hands on", partPrefix: "Part ", blurb: "Learn C# by writing and running real code, one small win at a time - up to a SOLID capstone." });
Course.defineTrack({ id: "theory", name: "Theory", kicker: "From zero", partPrefix: "Theory · Part ", blurb: "No background needed. Understand what software is and how a computer actually runs it, from the ground up." });
Course.defineTrack({ id: "ai", name: "AI", kicker: "Agents from scratch", partPrefix: "AI · Part ", blurb: "A first look at how large language models and AI agents really work - tokens, context, memory, tools, planning, and keeping an agent reliable." });

// ---- practical ----
Course.definePart({ track: "practical", id: "understand-the-ideas", title: "Understand the ideas" });
Course.register({ track: "practical", part: "understand-the-ideas", href: "foundations.html", key: "foundations_awarded", total: 6, title: "Foundations", blurb: "Start here. Write and run your first C#: printing, variables, the common datatypes, changing a value, what null means, and what an object is.", pill: "gentle", time: "20 min" });
Course.register({ track: "practical", part: "understand-the-ideas", href: "practice-the-basics.html", key: "level1_coding_awarded", total: 4, title: "Practice the Basics", blurb: "Put the Foundations to work: compute with numbers, join text, and ask yes/no questions with comparisons - the bridge into Control Flow. Write and run each one.", pill: "gentle", time: "20 min" });
Course.register({ track: "practical", part: "understand-the-ideas", href: "control-flow.html", key: "control_flow_awarded", total: 6, title: "Control Flow", blurb: "How code decides and repeats. Write a small working method for each tool: if/else, boolean logic, while, for, foreach with break/continue, and switch - then run it.", pill: "steady", time: "30 min" });
Course.register({ track: "practical", part: "understand-the-ideas", href: "writing-methods.html", key: "writing_methods_awarded", total: 5, title: "Methods", blurb: "Write a rule once and reuse it. Hand a method some input, get an answer back - the same idea as a check you used to run by hand. Easy syntax; the focus is on what a method is for.", pill: "gentle", time: "25 min" });
Course.register({ track: "practical", part: "understand-the-ideas", href: "reading-objects.html", key: "reading_objects_awarded", total: 6, title: "Reading Objects", blurb: "Write a few small objects that work together - one asks another for data, one job lives in one place, and a class uses what is handed to it.", pill: "gentle", time: "25 min" });
Course.register({ track: "practical", part: "understand-the-ideas", href: "reuse-without-regret.html", key: "level4_awarded", total: 12, title: "Reuse Without Regret", blurb: "When to inherit, when to build from parts, and why one object with two parents causes trouble. Learn it by reading working code, with a guided walkthrough.", pill: "steady", time: "30 min" });
Course.definePart({ track: "practical", id: "everyday-essentials", title: "Everyday essentials" });
Course.register({ track: "practical", part: "everyday-essentials", href: "type-conversion.html", key: "type_conversion_awarded", total: 4, title: "Type conversion &amp; parsing", blurb: "Turn text into numbers and back, drop the decimals off a value, and parse safely without crashing - the conversions you reach for every day.", pill: "gentle", time: "20 min" });
Course.register({ track: "practical", part: "everyday-essentials", href: "strings.html", key: "strings_awarded", total: 4, title: "Strings", blurb: "Build text from parts, change its case, search inside it, and rewrite pieces - the text moves you make every day.", pill: "gentle", time: "20 min" });
Course.register({ track: "practical", part: "everyday-essentials", href: "arrays.html", key: "arrays_awarded", total: 5, title: "Arrays", blurb: "Hold many values in one fixed, ordered row - reach an item by position, measure the length, and walk every item with a loop.", pill: "steady", time: "25 min" });
Course.register({ track: "practical", part: "everyday-essentials", href: "class-members.html", key: "class_members_awarded", total: 4, title: "Static, const, and readonly", blurb: "Some behaviour and data belong to the type itself, and some values are fixed for good - write a static helper, a constant, a set-once field, and a shared counter.", pill: "steady", time: "20 min" });
Course.register({ track: "practical", part: "everyday-essentials", href: "null-safety.html", key: "null_safety_awarded", total: 4, title: "Null-safety", blurb: "Sooner or later a value is not there - hand back a default, reach through safely, and say \"unknown\" instead of crashing.", pill: "steady", time: "20 min" });
Course.register({ track: "practical", part: "everyday-essentials", href: "access-properties.html", key: "access_properties_awarded", total: 4, title: "Access and properties", blurb: "Keep some parts of a type private, expose others, and hand out state through properties - a controlled get and set - instead of raw fields.", pill: "steady", time: "25 min" });
Course.register({ track: "practical", part: "everyday-essentials", href: "type-system.html", key: "type_system_awarded", total: 5, title: "Abstract types and overriding", blurb: "An abstract base you cannot create, replacing behaviour with override, one name for different inputs, a type's own text form, and cleaning up at a known point.", pill: "challenging", time: "30 min" });
Course.definePart({ track: "practical", id: "know-the-language", title: "Know the language" });
Course.register({ track: "practical", part: "know-the-language", href: "collections.html", key: "collections_awarded", total: 7, title: "Collections", blurb: "The everyday containers real code reaches for: build a list and grow it, walk it, index into it, fill it with your own objects, and map keys to values with a dictionary.", pill: "steady", time: "25 min" });
Course.register({ track: "practical", part: "know-the-language", href: "data-shapes.html", key: "data_shapes_awarded", total: 5, title: "Data shapes", blurb: "Build the things collections hold. Write five small programs covering properties, a computed property, an enum, a struct, and a record - run each one and match the output.", pill: "steady", time: "30 min" });
Course.register({ track: "practical", part: "know-the-language", href: "lambdas.html", key: "lambdas_awarded", total: 4, title: "Lambdas", blurb: "Your first look at lambdas - tiny functions with no name that you keep in a variable. See what they are, how they answer yes/no, and the thing they do that a plain method can't: read the variables around them. The little functions LINQ runs on next.", pill: "steady", time: "20 min" });
Course.register({ track: "practical", part: "know-the-language", href: "linq.html", key: "linq_awarded", total: 7, title: "LINQ", blurb: "Query a collection without writing a loop. Write each query yourself and run it - Where, Count, Any, All, Select, FirstOrDefault and OrderBy, one operator per task.", pill: "steady", time: "25 min" });
Course.register({ track: "practical", part: "know-the-language", href: "errors-null.html", key: "errors_null_awarded", total: 6, title: "Exception handling", blurb: "Keep a program standing when something goes wrong: catch failures with try/catch, clean up with finally, raise your own with throw - plus the null-safety operators ?? and ?.", pill: "steady", time: "25 min" });
Course.register({ track: "practical", part: "know-the-language", href: "generics.html", key: "generics_awarded", total: 4, title: "Generics", blurb: "You have used List&lt;T&gt; - now write your own. Build a Box&lt;T&gt;, a generic method, and a Pair&lt;A, B&gt; that work with any kind of value.", pill: "steady", time: "25 min" });
Course.definePart({ track: "practical", id: "build-with-objects", title: "Build with objects" });
Course.register({ track: "practical", part: "build-with-objects", href: "encapsulation.html", key: "encapsulation_awarded", total: 5, title: "Why objects?", blurb: "Why classes and methods at all, instead of one big Main? Group related data, put the behaviour next to it, hide the inside, guard a rule, then change that rule in one place.", pill: "steady", time: "25 min" });
Course.register({ track: "practical", part: "build-with-objects", href: "interfaces.html", key: "interfaces_awarded", total: 5, title: "Why abstract?", blurb: "Why pull logic behind an interface? Watch a keeper get stuck on one animal, then an interface free it - one method greets every animal, and a new one walks in for free.", pill: "steady", time: "25 min" });
Course.register({ track: "practical", part: "build-with-objects", href: "polymorphism.html", key: "polymorphism_awarded", total: 5, title: "Why many versions?", blurb: "Why several implementations of the same logic instead of one method full of branches? One call the object resolves, one loop over many kinds, and new behaviour by adding a class.", pill: "steady", time: "25 min" });
Course.register({ track: "practical", part: "build-with-objects", href: "composition.html", key: "composition_awarded", total: 5, title: "Inherit or compose?", blurb: "Can't we just inherit everything - even from three classes at once? Meet the is-a lie, C#'s one-parent limit, and composing parts you can swap without disturbing the rest.", pill: "steady", time: "30 min" });
Course.register({ track: "practical", part: "build-with-objects", href: "dependency-injection.html", key: "dependency_injection_awarded", total: 5, title: "Why inject?", blurb: "Why hand dependencies in instead of newing them everywhere? Feel the moment a hardwired animal bites, then inject one - and hand in a toy stand-in to rehearse with no real animal.", pill: "steady", time: "30 min" });
Course.definePart({ track: "practical", id: "prove-it-works", title: "Prove it works" });
Course.register({ track: "practical", part: "prove-it-works", href: "testing-basics.html", key: "testing_basics_awarded", total: 4, title: "What a test is", blurb: "A test is just code that runs your code and checks the result. Write your first ones - arrange, act, assert - including one that expects a failure on purpose.", pill: "steady", time: "25 min" });
Course.register({ track: "practical", part: "prove-it-works", href: "test-doubles.html", key: "test_doubles_awarded", total: 3, title: "Test doubles", blurb: "Test code that leans on a clock, a random number, or the network by handing it a stand-in you control: a fake, a stub, and a spy.", pill: "steady", time: "25 min" });
Course.register({ track: "practical", part: "prove-it-works", href: "testable-design.html", key: "testable_design_awarded", total: 3, title: "Testable by design", blurb: "Some code fights every test; other code is a pleasure to check. The habits that make code testable - inject, one job, no hidden state - are the habits behind SOLID.", pill: "steady", time: "25 min" });
Course.definePart({ track: "practical", id: "design-for-change", title: "Design for change" });
Course.register({ track: "practical", part: "design-for-change", href: "refactor-moves.html", key: "refactor_moves_awarded", total: 5, title: "Refactor moves", blurb: "Change the shape of working code without changing what it does. Five small refactors - move behaviour to its data, depend on an interface, inject a dependency, replace a branch, split a class - each one a habit SOLID is about to name.", pill: "steady", time: "30 min" });
Course.register({ track: "practical", part: "design-for-change", href: "the-solid-principles.html", key: "level2_awarded", total: 5, title: "The SOLID Principles", blurb: "Five habits that keep code easy to change. Spot each problem in a real test-automation project, then fix it the right way. The ideas lean on everything before this part.", pill: "challenging", time: "35 min" });
Course.register({ track: "practical", part: "design-for-change", href: "level3-app/", title: "Capstone: SOLID in Practice", blurb: "Put it all together. Refactor a real, broken program one step at a time. Your C# compiles and runs, with friendly errors, optional hints, and a worked solution if you get stuck.", pill: "challenging", time: "60 min", final: true });

// ---- theory ----
Course.definePart({ track: "theory", id: "what-a-computer-really-is", title: "What a computer really is" });
Course.register({ track: "theory", part: "what-a-computer-really-is", href: "theory-1.html", key: "theory_1_awarded", total: 1, title: "What a program is", blurb: "Look one layer under the apps you use. What an instruction is, how a program is an ordered list of them over data, the CPU that runs them, and what compilation means.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "what-a-computer-really-is", href: "theory-2.html", key: "theory_2_awarded", total: 1, title: "How a program runs", blurb: "What happens when you run a program: it is loaded into memory, the CPU repeats the fetch-and-execute loop, keeps its place, and sometimes jumps elsewhere.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "what-a-computer-really-is", href: "theory-3.html", key: "theory_3_awarded", total: 1, title: "What starts a program", blurb: "What gets a program going: the operating system loads it into memory and starts it at its entry point - usually a function called Main - where your instructions begin.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "what-a-computer-really-is", href: "theory-4.html", key: "theory_4_awarded", total: 1, title: "Running many programs at once", blurb: "One CPU core does one thing at a time - so how do dozens of apps run together? Processes, fast switching, the scheduler, cores, and why one crash stays contained.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "what-a-computer-really-is", href: "theory-5.html", key: "theory_5_awarded", total: 1, title: "How computers store everything as numbers", blurb: "Text, photos, music - all of it is numbers underneath. Bits, why computers use just two states, counting in binary, and the byte.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "what-a-computer-really-is", href: "theory-6.html", key: "theory_6_awarded", total: 1, title: "Text, images, and sound as numbers", blurb: "How a letter, a photo, or a song actually becomes numbers: encodings, Unicode text, pixels and colour, sampled sound - and why the same number can mean different things.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "what-a-computer-really-is", href: "theory-7.html", key: "theory_7_awarded", total: 1, title: "The operating system's bigger job", blurb: "Beyond starting programs: how the OS turns raw storage into files and folders, guards them, and talks to your devices through drivers. Closes Part one.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "what-a-computer-really-is", href: "theory-check-1.html", key: "theory_check_1_awarded", total: 1, title: "Part one checkpoint", blurb: "A short quiz to lock in Part one and earn your XP: what a program is, how it runs, many at once, bits and bytes, and the operating system.", pill: "steady", time: "10 min" });
Course.definePart({ track: "theory", id: "from-idea-to-running-code", title: "From idea to running code" });
Course.register({ track: "theory", part: "from-idea-to-running-code", href: "theory-8.html", key: "theory_8_awarded", total: 1, title: "What a programming language is", blurb: "Why we don't write raw CPU instructions, what 'high-level' means, the many languages that exist, and what syntax is.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "from-idea-to-running-code", href: "theory-9.html", key: "theory_9_awarded", total: 1, title: "Variables", blurb: "The first idea every program uses: a named box that holds a value you can read, write, and change.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "from-idea-to-running-code", href: "theory-10.html", key: "theory_10_awarded", total: 1, title: "Types", blurb: "Every value has a kind - number, text, true/false - and the kind decides what you can do with it.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "from-idea-to-running-code", href: "theory-11.html", key: "theory_11_awarded", total: 1, title: "Statements and expressions", blurb: "The two pieces every line of code is built from: steps that do things, and pieces that produce values.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "from-idea-to-running-code", href: "theory-12.html", key: "theory_12_awarded", total: 1, title: "Decisions and repetition", blurb: "How a program chooses and repeats: conditions, if/else and loops - really the jumps from Part one.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "from-idea-to-running-code", href: "theory-13.html", key: "theory_13_awarded", total: 1, title: "Functions", blurb: "Bundling steps under a name you can reuse, with inputs and an output - how programs stay organised as they grow.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "from-idea-to-running-code", href: "theory-14.html", key: "theory_14_awarded", total: 1, title: "Bugs: why programs go wrong", blurb: "What a bug is, syntax versus logic errors, and what debugging really is. Closes Part two; Part three goes on to how software runs and connects.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "from-idea-to-running-code", href: "theory-check-2.html", key: "theory_check_2_awarded", total: 1, title: "Part two checkpoint", blurb: "A short quiz to lock in Part two and earn your XP: languages, variables, types, statements, decisions, functions and bugs.", pill: "steady", time: "10 min" });
Course.definePart({ track: "theory", id: "how-software-runs-and-connects", title: "How software runs and connects" });
Course.register({ track: "theory", part: "how-software-runs-and-connects", href: "theory-15.html", key: "theory_15_awarded", total: 1, title: "Where data lives", blurb: "Where a running program keeps its data: memory as numbered slots, a variable as a slot, and the two areas it uses - the stack and the heap.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "how-software-runs-and-connects", href: "theory-16.html", key: "theory_16_awarded", total: 1, title: "References vs values", blurb: "Why some variables hold a value and others only point to one - and what really happens when you copy each. The idea behind how objects behave.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "how-software-runs-and-connects", href: "theory-17.html", key: "theory_17_awarded", total: 1, title: "The build-and-run cycle", blurb: "How your written code becomes a running program: the compiler, the .NET runtime, compile-time versus run-time errors, and the write-build-run loop.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "how-software-runs-and-connects", href: "theory-18.html", key: "theory_18_awarded", total: 1, title: "Saving data", blurb: "Memory forgets when a program stops. How data is kept: storage, files, databases, and saving versus loading.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "how-software-runs-and-connects", href: "theory-19.html", key: "theory_19_awarded", total: 1, title: "Programs that talk", blurb: "How programs talk over a network: clients and servers, requests and responses, and what an API is.", pill: "gentle", time: "20 min" });
Course.register({ track: "theory", part: "how-software-runs-and-connects", href: "theory-check-3.html", key: "theory_check_3_awarded", total: 1, title: "Part three checkpoint", blurb: "A short quiz to lock in Part three and earn your XP: where data lives, references versus values, building and running, saving data, and programs that talk.", pill: "steady", time: "10 min" });
Course.definePart({ track: "theory", id: "the-development-world", title: "The development world" });
Course.register({ track: "theory", part: "the-development-world", href: "theory-21.html", key: "theory_21_awarded", total: 1, title: "Standing on other code", blurb: "You never build alone: libraries, the standard library, packages, a package manager, and the dependencies your program relies on.", pill: "gentle", time: "15 min" });
Course.register({ track: "theory", part: "the-development-world", href: "theory-20.html", key: "theory_20_awarded", total: 1, title: "How code is shared", blurb: "How code is tracked and shared: version control, commits, history, and how a team works on one project.", pill: "gentle", time: "15 min" });
Course.register({ track: "theory", part: "the-development-world", href: "theory-check-4.html", key: "theory_check_4_awarded", total: 1, title: "Part four checkpoint", blurb: "The final checkpoint: libraries, the standard library, packages, dependencies and version control. Pass it to wrap up the software foundations.", pill: "steady", time: "10 min" });

// ---- ai ----
Course.definePart({ track: "ai", id: "the-building-blocks-of-ai", title: "The building blocks of AI" });
Course.register({ track: "ai", part: "the-building-blocks-of-ai", href: "ai-1.html", key: "ai_1_awarded", total: 1, title: "What is an LLM?", blurb: "The one move at the heart of it all: a model that reads some text and predicts the next token, over and over. Watch it pick from the candidates and continue.", pill: "gentle", time: "15 min" });
Course.register({ track: "ai", part: "the-building-blocks-of-ai", href: "ai-2.html", key: "ai_2_awarded", total: 1, title: "Tokens", blurb: "Not letters, not quite words. See how text breaks into the chunks the model actually reads and counts - and why the model's limits and cost are measured in them.", pill: "gentle", time: "15 min" });
Course.register({ track: "ai", part: "the-building-blocks-of-ai", href: "ai-3.html", key: "ai_3_awarded", total: 1, title: "The prompt", blurb: "The text you hand the model to start from. It simply continues it - so changing the prompt changes everything that follows.", pill: "gentle", time: "15 min" });
Course.register({ track: "ai", part: "the-building-blocks-of-ai", href: "ai-9.html", key: "ai_9_awarded", total: 1, title: "System and user messages", blurb: "Every prompt really has two parts: your message, and a hidden system message that sets the model's role and rules. Change the system message and the tone changes.", pill: "gentle", time: "15 min" });
Course.register({ track: "ai", part: "the-building-blocks-of-ai", href: "ai-10.html", key: "ai_10_awarded", total: 1, title: "Sampling and temperature", blurb: "Why the same prompt gives different answers. The model samples its next word from a spread, and temperature decides how boldly - low is steady, high is varied.", pill: "gentle", time: "15 min" });
Course.register({ track: "ai", part: "the-building-blocks-of-ai", href: "ai-4.html", key: "ai_4_awarded", total: 1, title: "Context", blurb: "Everything the model can see right now - the prompt, the conversation, any facts you add. Watch a flat guess become a confident answer once the context is there.", pill: "gentle", time: "15 min" });
Course.register({ track: "ai", part: "the-building-blocks-of-ai", href: "ai-5.html", key: "ai_5_awarded", total: 1, title: "The context window", blurb: "That context is finite, measured in tokens. When it fills, the oldest tokens fall off the start - which is why a long chat seems to forget how it began.", pill: "gentle", time: "15 min" });
Course.definePart({ track: "ai", id: "from-model-to-agent", title: "From model to agent" });
Course.register({ track: "ai", part: "from-model-to-agent", href: "ai-6.html", key: "ai_6_awarded", total: 1, title: "Memory", blurb: "The window forgets, so how does an assistant remember? It saves what matters to a store outside the window, recalls it when needed - and sorts it into kinds: what happened, what stays true, and how to do things.", pill: "steady", time: "18 min" });
Course.register({ track: "ai", part: "from-model-to-agent", href: "ai-7.html", key: "ai_7_awarded", total: 1, title: "Tools", blurb: "A model can only produce text. Tools let it ask to run a function and read the result back - then reach for the right one of several, call it in the shape its schema asks for, and recover when a call comes back wrong.", pill: "steady", time: "18 min" });
Course.register({ track: "ai", part: "from-model-to-agent", href: "ai-14.html", key: "ai_14_awarded", total: 1, title: "Retrieval", blurb: "A model's knowledge is frozen at training time and its window is small. Retrieval turns a question into a vector, finds the closest chunks of your own documents, and answers grounded in them - the idea behind RAG.", pill: "steady", time: "18 min" });
Course.register({ track: "ai", part: "from-model-to-agent", href: "ai-8.html", key: "ai_8_awarded", total: 1, title: "From LLM to agent", blurb: "Put the pieces together - model, context, memory, tools - and run them in a loop with a goal, and you get an agent. The capstone, and the bridge to the harder material ahead.", pill: "steady", time: "15 min" });
Course.register({ track: "ai", part: "from-model-to-agent", href: "ai-13.html", key: "ai_13_awarded", total: 1, title: "What a run really is: the transcript", blurb: "Pull the curtain back. A whole agent run is one growing list of messages - and the model only writes text, your code writes the tool results, and \"memory\" is just re-sending the list.", pill: "steady", time: "15 min" });
Course.definePart({ track: "ai", id: "how-an-agent-thinks", title: "How an agent thinks" });
Course.register({ track: "ai", part: "how-an-agent-thinks", href: "ai-15.html", key: "ai_15_awarded", total: 1, title: "Reasoning", blurb: "Ask for the answer and a model guesses; ask it to think step by step and it works the problem out. See why writing the reasoning down is the computation, not decoration - chain-of-thought.", pill: "gentle", time: "15 min" });
Course.register({ track: "ai", part: "how-an-agent-thinks", href: "ai-16.html", key: "ai_16_awarded", total: 1, title: "Planning", blurb: "A goal too big for one move gets broken into an ordered list of small steps, done one at a time. Watch an agent decompose a task - and re-plan when a step gets blocked.", pill: "steady", time: "16 min" });
Course.register({ track: "ai", part: "how-an-agent-thinks", href: "ai-17.html", key: "ai_17_awarded", total: 1, title: "Reason and act (ReAct)", blurb: "Thought, action, observation, repeat. The named pattern behind a tool-using agent: reason about the next move, call a tool, read the real result, and loop until the answer is grounded.", pill: "steady", time: "16 min" });
Course.register({ track: "ai", part: "how-an-agent-thinks", href: "ai-18.html", key: "ai_18_awarded", total: 1, title: "Reflection", blurb: "A first draft rarely covers the edges. Have the model check its own work, find the bug it missed, and revise - draft, critique, revise, the loop that turns a guess into a better answer.", pill: "gentle", time: "15 min" });
Course.definePart({ track: "ai", id: "making-agents-reliable", title: "Making agents reliable" });
Course.register({ track: "ai", part: "making-agents-reliable", href: "ai-19.html", key: "ai_19_awarded", total: 1, title: "Workflow or agent?", blurb: "\"Agent\" is not always the answer. If you can write the steps down ahead of time, build a workflow - simpler and cheaper. Save agency for when the path has to be discovered as it goes.", pill: "steady", time: "15 min" });
Course.register({ track: "ai", part: "making-agents-reliable", href: "ai-20.html", key: "ai_20_awarded", total: 1, title: "Guardrails", blurb: "A model can be talked out of its own rules. Guardrails live in your code, outside the model: check what comes in, check what the agent tries to do, and keep a human on the risky calls.", pill: "steady", time: "16 min" });
Course.register({ track: "ai", part: "making-agents-reliable", href: "ai-21.html", key: "ai_21_awarded", total: 1, title: "Knowing when to stop", blurb: "An agent decides its own next move, so nothing makes it stop on its own. A loop that can't stop is a runaway bill. See the stopping conditions - goal reached, budget spent, circling, hard error.", pill: "steady", time: "15 min" });
Course.register({ track: "ai", part: "making-agents-reliable", href: "ai-22.html", key: "ai_22_awarded", total: 1, title: "Hallucination and grounding", blurb: "A model answers confidently even when it doesn't know - it predicts plausible text, not verified truth. Grounding fixes it: pull in the real source, answer from it, cite it, and allow \"I don't know\".", pill: "steady", time: "16 min" });
Course.register({ track: "ai", part: "making-agents-reliable", href: "ai-23.html", key: "ai_23_awarded", total: 1, title: "Did it work? Reading the trace", blurb: "Every run leaves a trace of its messages and tool calls. Read a failed one to find where it broke (observability), then turn that into a check you run every time (evaluation).", pill: "steady", time: "16 min" });

  // ---- Public API: query only, frozen (ISP #6) ----
  global.Course = Object.freeze({
    tracks: Course.tracks,
    track: Course.track,
    order: Course.order,
    locate: Course.locate
  });
})(typeof window !== "undefined" ? window : this);
