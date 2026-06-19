// Loads the Monaco editor from CDN and exposes window.monaco. This mirrors the
// setup used by level3-app so every write-and-run lesson uses the same real
// editor (C# syntax, IntelliSense) through CodeLab.MonacoEditor.
// Call window.ensureMonaco() and await it before mounting a MonacoEditor.
(function () {
  "use strict";

  const MONACO_BASE = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs";

  // Cross-origin web workers from a CDN must be proxied through a data URL.
  window.MonacoEnvironment = {
    getWorkerUrl: function () {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = { baseUrl: '${MONACO_BASE.replace("/vs", "")}/' };
        importScripts('${MONACO_BASE}/base/worker/workerMain.js');
      `)}`;
    }
  };

  let ready = null;
  window.ensureMonaco = function () {
    if (!ready) {
      ready = new Promise(function (resolve) {
        require.config({ paths: { vs: MONACO_BASE } });
        require(["vs/editor/editor.main"], function () {
          registerCSharpCompletions();
          resolve(window.monaco);
        });
      });
    }
    return ready;
  };

  // Client-side C# completions so suggestions work on static hosting.
  function registerCSharpCompletions() {
    const keywords = [
      "public", "private", "protected", "internal", "static", "void", "class",
      "interface", "abstract", "virtual", "override", "sealed", "readonly",
      "const", "new", "return", "if", "else", "for", "foreach", "while", "do",
      "switch", "case", "break", "continue", "using", "namespace", "this",
      "base", "null", "true", "false", "var", "int", "string", "bool", "double",
      "float", "decimal", "char", "object", "enum", "struct", "try", "catch",
      "finally", "throw", "get", "set", "in", "out", "ref", "params", "async", "await"
    ];
    const members = [
      { label: "Console.WriteLine", insert: "Console.WriteLine($0);", doc: "Write a line to the console" },
      { label: "Console.Write", insert: "Console.Write($0);", doc: "Write to the console" },
      { label: "Console.ReadLine", insert: "Console.ReadLine()", doc: "Read a line from the console" },
      { label: "string.IsNullOrEmpty", insert: "string.IsNullOrEmpty($0)", doc: "Check for null or empty string" },
      { label: "List<T>", insert: "List<$0>", doc: "Generic list" },
      { label: "Dictionary<TKey, TValue>", insert: "Dictionary<$1, $2>", doc: "Generic dictionary" },
      { label: "ToString", insert: "ToString()", doc: "Convert to string" }
    ];
    const snippets = [
      { label: "class", insert: "public class ${1:Name}\n{\n    $0\n}", doc: "Class definition" },
      { label: "interface", insert: "public interface I${1:Name}\n{\n    $0\n}", doc: "Interface definition" },
      { label: "ctor", insert: "public ${1:Type}()\n{\n    $0\n}", doc: "Constructor" },
      { label: "method", insert: "public ${1:void} ${2:Name}()\n{\n    $0\n}", doc: "Method" },
      { label: "prop", insert: "public ${1:string} ${2:Name} { get; set; }", doc: "Auto property" },
      { label: "foreach", insert: "foreach (var ${1:item} in ${2:items})\n{\n    $0\n}", doc: "Foreach loop" }
    ];

    monaco.languages.registerCompletionItemProvider("csharp", {
      provideCompletionItems: function (model, position) {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };
        const K = monaco.languages.CompletionItemKind;
        const R = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        const suggestions = [];
        keywords.forEach(function (kw) {
          suggestions.push({ label: kw, kind: K.Keyword, insertText: kw, range: range });
        });
        members.forEach(function (m) {
          suggestions.push({ label: m.label, kind: K.Method, detail: m.doc, insertText: m.insert, insertTextRules: R, range: range });
        });
        snippets.forEach(function (s) {
          suggestions.push({ label: s.label, kind: K.Snippet, detail: s.doc, insertText: s.insert, insertTextRules: R, range: range });
        });
        return { suggestions: suggestions };
      }
    });
  }
})();
