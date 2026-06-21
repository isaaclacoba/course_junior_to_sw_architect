"use strict";
var CodeLab = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    CodeLab: () => CodeLab,
    MonacoEditor: () => MonacoEditor,
    PlainHighlighter: () => PlainHighlighter,
    PrismHighlighter: () => PrismHighlighter,
    ReadOnlyView: () => ReadOnlyView,
    RoslynIframeRunner: () => RoslynIframeRunner,
    TextareaEditor: () => TextareaEditor,
    Tour: () => Tour,
    atFirst: () => atFirst,
    atLast: () => atLast,
    computeLineFlags: () => computeLineFlags,
    counterLabel: () => counterLabel,
    defaultHighlighter: () => defaultHighlighter,
    goTo: () => goTo,
    loadMonaco: () => loadMonaco,
    makeTour: () => makeTour,
    next: () => next,
    normalizeLines: () => normalizeLines,
    presentRun: () => presentRun,
    prev: () => prev,
    renderErrorPanel: () => renderErrorPanel,
    selectRunCode: () => selectRunCode,
    showErrorPanel: () => showErrorPanel,
    splitCodeLines: () => splitCodeLines
  });

  // src/highlighter.ts
  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var PrismHighlighter = class {
    highlight(code, language) {
      const prism = window.Prism;
      if (prism && prism.languages && prism.languages[language]) {
        return prism.highlight(code, prism.languages[language], language);
      }
      return escapeHtml(code);
    }
  };
  var PlainHighlighter = class {
    highlight(code) {
      return escapeHtml(code);
    }
  };
  function defaultHighlighter() {
    return window.Prism ? new PrismHighlighter() : new PlainHighlighter();
  }

  // src/core/present.ts
  function selectRunCode(runCode, editorValue) {
    return runCode ?? editorValue;
  }
  function presentRun(result, labels) {
    if (result.errors && result.errors.length) {
      return {
        text: result.errors.map((e) => e.friendly || e.raw).join("\n"),
        isError: true,
        markers: result.errors
      };
    }
    if (result.runtimeError) {
      return {
        text: `${result.output}
${result.runtimeError}`.trim(),
        isError: true,
        markers: []
      };
    }
    return {
      text: result.output || labels.noOutput,
      isError: false,
      markers: []
    };
  }

  // src/core/lines.ts
  function normalizeLines(lines) {
    if (lines === void 0 || lines === null) return [];
    const list = Array.isArray(lines) ? lines : [lines];
    return [...new Set(list.filter((n) => Number.isFinite(n) && n > 0))].sort(
      (a, b) => a - b
    );
  }
  function splitCodeLines(code) {
    return code.replace(/\n+$/, "").split("\n");
  }
  function computeLineFlags(active, count) {
    const set = new Set(active);
    const anyActive = active.length > 0;
    const flags = [];
    for (let i = 1; i <= count; i++) {
      const isActive = set.has(i);
      flags.push({ active: isActive, dim: anyActive && !isActive });
    }
    return flags;
  }

  // src/core/tour-state.ts
  function makeTour(count, index = 0) {
    const safeCount = Math.max(0, Math.floor(count));
    return { count: safeCount, index: clamp(index, safeCount) };
  }
  function clamp(index, count) {
    if (count <= 0) return 0;
    return Math.min(Math.max(0, Math.floor(index)), count - 1);
  }
  function goTo(model, index) {
    if (index < 0 || index >= model.count) return model;
    return { ...model, index };
  }
  function next(model) {
    return goTo(model, model.index + 1);
  }
  function prev(model) {
    return goTo(model, model.index - 1);
  }
  function atFirst(model) {
    return model.index <= 0;
  }
  function atLast(model) {
    return model.count === 0 || model.index >= model.count - 1;
  }
  function counterLabel(model) {
    return `${model.index + 1} / ${model.count}`;
  }

  // src/tour.ts
  var Tour = class {
    constructor(config = {}) {
      this.titleId = `cl-tour-title-${Math.random().toString(36).slice(2)}`;
      this.state = null;
      this.lastFocused = null;
      this.onKey = (e) => this.handleKey(e);
      this.highlighter = config.highlighter ?? defaultHighlighter();
      this.language = config.language ?? "csharp";
    }
    open(opts) {
      this.buildDom();
      this.lastFocused = document.activeElement;
      const safeSteps = Array.isArray(opts.steps) && opts.steps.length ? opts.steps : [{ text: "", lines: [] }];
      this.state = { steps: safeSteps, index: 0, lineEls: [] };
      this.titleEl.textContent = opts.title || "Walk me through the code";
      this.renderCode(opts.code || "");
      this.codePane.scrollTop = 0;
      this.applyStep();
      this.overlay.hidden = false;
      this.modal.hidden = false;
      document.addEventListener("keydown", this.onKey);
      const focusables = this.focusableEls();
      if (focusables.length) focusables[focusables.length - 1].focus();
    }
    close() {
      if (!this.overlay) return;
      this.overlay.hidden = true;
      this.modal.hidden = true;
      document.removeEventListener("keydown", this.onKey);
      if (this.lastFocused instanceof HTMLElement) this.lastFocused.focus();
      this.lastFocused = null;
    }
    destroy() {
      document.removeEventListener("keydown", this.onKey);
      this.overlay?.remove();
      this.modal?.remove();
      this.overlay = void 0;
      this.modal = void 0;
    }
    normalizeLines(lines) {
      return normalizeLines(lines);
    }
    buildDom() {
      if (this.overlay) return;
      this.overlay = document.createElement("div");
      this.overlay.className = "cl-tour-overlay";
      this.overlay.hidden = true;
      this.overlay.addEventListener("click", () => this.close());
      this.modal = document.createElement("div");
      this.modal.className = "cl-tour-modal";
      this.modal.hidden = true;
      this.modal.setAttribute("role", "dialog");
      this.modal.setAttribute("aria-modal", "true");
      this.modal.setAttribute("aria-labelledby", this.titleId);
      this.modal.addEventListener("click", (e) => e.stopPropagation());
      const header = document.createElement("div");
      header.className = "cl-tour-header";
      this.titleEl = document.createElement("h4");
      this.titleEl.className = "cl-tour-title";
      this.titleEl.id = this.titleId;
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "cl-btn cl-tour-close";
      closeBtn.textContent = "Close";
      closeBtn.addEventListener("click", () => this.close());
      header.append(this.titleEl, closeBtn);
      this.codePane = document.createElement("div");
      this.codePane.className = "cl-tour-code-pane";
      this.narration = document.createElement("p");
      this.narration.className = "cl-tour-narration";
      const footer = document.createElement("div");
      footer.className = "cl-tour-footer";
      this.prevBtn = document.createElement("button");
      this.prevBtn.type = "button";
      this.prevBtn.className = "cl-btn";
      this.prevBtn.textContent = "Previous";
      this.prevBtn.addEventListener("click", () => this.go(this.state.index - 1));
      this.dots = document.createElement("div");
      this.dots.className = "cl-tour-dots";
      this.counter = document.createElement("span");
      this.counter.className = "cl-tour-counter";
      this.nextBtn = document.createElement("button");
      this.nextBtn.type = "button";
      this.nextBtn.className = "cl-btn cl-primary";
      this.nextBtn.textContent = "Next";
      this.nextBtn.addEventListener("click", () => this.go(this.state.index + 1));
      footer.append(this.prevBtn, this.dots, this.counter, this.nextBtn);
      this.modal.append(header, this.codePane, this.narration, footer);
      document.body.append(this.overlay, this.modal);
    }
    renderCode(code) {
      const lines = splitCodeLines(code);
      this.codePane.innerHTML = "";
      this.state.lineEls = lines.map((text, i) => {
        const row = document.createElement("div");
        row.className = "cl-tour-line";
        const num = document.createElement("span");
        num.className = "cl-tour-ln";
        num.textContent = String(i + 1);
        const codeEl = document.createElement("code");
        codeEl.className = `cl-tour-code language-${this.language}`;
        codeEl.innerHTML = text.length ? this.highlighter.highlight(text, this.language) : "&nbsp;";
        row.append(num, codeEl);
        this.codePane.appendChild(row);
        return row;
      });
    }
    renderDots() {
      this.dots.innerHTML = "";
      this.state.steps.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "cl-tour-dot" + (i === this.state.index ? " is-active" : "");
        dot.setAttribute("aria-label", `Step ${i + 1}`);
        dot.addEventListener("click", () => this.go(i));
        this.dots.appendChild(dot);
      });
    }
    scrollWithin(el) {
      const c = this.codePane.getBoundingClientRect();
      const e = el.getBoundingClientRect();
      if (e.top < c.top) {
        this.codePane.scrollBy({ top: e.top - c.top - 14, behavior: "smooth" });
      } else if (e.bottom > c.bottom) {
        this.codePane.scrollBy({ top: e.bottom - c.bottom + 14, behavior: "smooth" });
      }
    }
    pulseNarration() {
      this.narration.classList.remove("is-changing");
      void this.narration.offsetWidth;
      this.narration.classList.add("is-changing");
    }
    applyStep() {
      const step = this.state.steps[this.state.index];
      const active = this.normalizeLines(step.lines);
      const flags = computeLineFlags(active, this.state.lineEls.length);
      this.state.lineEls.forEach((el, i) => {
        el.classList.toggle("is-active", flags[i].active);
        el.classList.toggle("is-dim", flags[i].dim);
      });
      const model = makeTour(this.state.steps.length, this.state.index);
      this.narration.textContent = step.text || "";
      this.pulseNarration();
      this.counter.textContent = counterLabel(model);
      this.prevBtn.disabled = atFirst(model);
      this.nextBtn.disabled = atLast(model);
      this.renderDots();
      if (active.length) this.scrollWithin(this.state.lineEls[active[0] - 1]);
    }
    go(index) {
      if (!this.state) return;
      const current = makeTour(this.state.steps.length, this.state.index);
      const target = goTo(current, index);
      if (target === current) return;
      this.state.index = target.index;
      this.applyStep();
    }
    focusableEls() {
      return [
        ...this.modal.querySelectorAll("button:not([disabled])")
      ];
    }
    trapTab(e) {
      const els = this.focusableEls();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    handleKey(e) {
      if (e.key === "Escape") this.close();
      else if (e.key === "Tab") this.trapTab(e);
      else if (e.key === "ArrowRight") this.go(this.state.index + 1);
      else if (e.key === "ArrowLeft") this.go(this.state.index - 1);
    }
  };

  // src/editors/readonly.ts
  var ReadOnlyView = class {
    constructor(highlighter) {
      this.value = "";
      this.language = "csharp";
      this.highlighter = highlighter ?? defaultHighlighter();
    }
    mount(host, opts) {
      this.value = opts.value;
      this.language = opts.language;
      this.pre = document.createElement("pre");
      this.pre.className = "cl-readonly line-numbers";
      this.code = document.createElement("code");
      this.code.className = `language-${opts.language}`;
      this.pre.appendChild(this.code);
      host.appendChild(this.pre);
      this.render();
    }
    render() {
      if (this.code) {
        this.code.innerHTML = this.highlighter.highlight(this.value, this.language);
      }
    }
    getValue() {
      return this.value;
    }
    setValue(value) {
      this.value = value;
      this.render();
    }
    setReadOnly() {
    }
    destroy() {
      this.pre?.remove();
      this.pre = void 0;
      this.code = void 0;
    }
  };

  // src/editors/textarea.ts
  var TextareaEditor = class {
    constructor(highlighter) {
      this.language = "csharp";
      this.highlighter = highlighter ?? defaultHighlighter();
    }
    mount(host, opts) {
      this.language = opts.language;
      this.wrap = document.createElement("div");
      this.wrap.className = "cl-ta-wrap";
      this.pre = document.createElement("pre");
      this.pre.className = "cl-ta-underlay";
      this.pre.setAttribute("aria-hidden", "true");
      this.code = document.createElement("code");
      this.code.className = `language-${opts.language}`;
      this.pre.appendChild(this.code);
      this.textarea = document.createElement("textarea");
      this.textarea.className = "cl-ta-input";
      this.textarea.spellcheck = false;
      this.textarea.autocapitalize = "off";
      this.textarea.setAttribute("autocomplete", "off");
      this.textarea.setAttribute("autocorrect", "off");
      this.textarea.value = opts.value;
      this.textarea.readOnly = opts.readOnly;
      this.textarea.addEventListener("input", () => this.sync());
      this.textarea.addEventListener("scroll", () => this.syncScroll());
      this.wrap.append(this.pre, this.textarea);
      host.appendChild(this.wrap);
      this.sync();
    }
    sync() {
      if (!this.code || !this.textarea) return;
      const text = this.textarea.value;
      this.code.innerHTML = this.highlighter.highlight(text + "\n", this.language);
      this.syncScroll();
    }
    syncScroll() {
      if (!this.pre || !this.textarea) return;
      this.pre.scrollTop = this.textarea.scrollTop;
      this.pre.scrollLeft = this.textarea.scrollLeft;
    }
    getValue() {
      return this.textarea?.value ?? "";
    }
    setValue(value) {
      if (this.textarea) {
        this.textarea.value = value;
        this.sync();
      }
    }
    setReadOnly(readOnly) {
      if (this.textarea) this.textarea.readOnly = readOnly;
    }
    destroy() {
      this.wrap?.remove();
      this.wrap = void 0;
      this.pre = void 0;
      this.code = void 0;
      this.textarea = void 0;
    }
  };

  // src/editors/monaco.ts
  var MonacoEditor = class {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    constructor(config = {}) {
      this.monaco = config.monaco;
      this.theme = config.theme ?? "vs-dark";
    }
    async resolveMonaco() {
      if (this.monaco) return this.monaco;
      if (window.monaco) return this.monaco = window.monaco;
      try {
        const specifier = "monaco-editor";
        this.monaco = await import(
          /* @vite-ignore */
          specifier
        );
        return this.monaco;
      } catch {
        throw new Error(
          "MonacoEditor: monaco-editor is not available. Install it, expose window.monaco, or pass { monaco } to the adapter."
        );
      }
    }
    async mount(host, opts) {
      const monaco = await this.resolveMonaco();
      this.editor = monaco.editor.create(host, {
        value: opts.value,
        language: opts.language,
        theme: this.theme,
        readOnly: opts.readOnly,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        tabSize: 4,
        insertSpaces: true,
        scrollBeyondLastLine: false,
        bracketPairColorization: { enabled: true }
      });
      if (opts.autoHeight) this.enableAutoHeight(host, opts.autoHeight);
    }
    // Drive the host height from Monaco's content height so the editor is exactly
    // as tall as the code it holds, clamped to optional min/max bounds. Width is
    // still handled by automaticLayout.
    enableAutoHeight(host, bounds) {
      const min = bounds.minHeight ?? 0;
      const max = bounds.maxHeight ?? Number.POSITIVE_INFINITY;
      const resize = () => {
        const height = Math.min(max, Math.max(min, this.editor.getContentHeight()));
        host.style.height = `${height}px`;
        this.editor.layout({ width: host.clientWidth, height });
      };
      this.editor.onDidContentSizeChange(resize);
      resize();
    }
    getValue() {
      return this.editor ? this.editor.getValue() : "";
    }
    setValue(value) {
      if (this.editor) this.editor.setValue(value);
    }
    setReadOnly(readOnly) {
      if (this.editor) this.editor.updateOptions({ readOnly });
    }
    setMarkers(errors) {
      if (!this.editor || !this.monaco) return;
      const model = this.editor.getModel();
      if (!model) return;
      const markers = errors.map((e) => ({
        severity: this.monaco.MarkerSeverity.Error,
        message: e.friendly || e.raw,
        startLineNumber: e.line || 1,
        startColumn: e.column || 1,
        endLineNumber: e.line || 1,
        endColumn: (e.column || 1) + 1
      }));
      this.monaco.editor.setModelMarkers(model, "code-lab", markers);
    }
    destroy() {
      this.editor?.dispose?.();
      this.editor = void 0;
    }
  };

  // src/code-lab.ts
  var DEFAULT_LABELS = {
    run: "Run this example",
    running: "Running...",
    tour: "Walk me through the code",
    noOutput: "(no output)",
    runFailed: "Could not run the example."
  };
  function buildEditor(editable, kind, highlighter) {
    if (!editable || kind === "readonly") return new ReadOnlyView(highlighter);
    if (kind === "textarea") return new TextareaEditor(highlighter);
    return new MonacoEditor();
  }
  var CodeLab = class _CodeLab {
    constructor(host, opts) {
      this.tour = null;
      this.opts = opts;
      this.labels = { ...DEFAULT_LABELS, ...opts.labels ?? {} };
      this.highlighter = opts.highlighter ?? defaultHighlighter();
      this.editable = opts.editable ?? false;
      const kind = opts.editor ?? "monaco";
      this.editor = buildEditor(this.editable, kind, this.highlighter);
      this.root = document.createElement("div");
      this.root.className = "cl-root";
      host.appendChild(this.root);
    }
    static create(host, opts) {
      const lab = new _CodeLab(host, opts);
      void lab.init();
      return lab;
    }
    async init() {
      const language = this.opts.language ?? "csharp";
      this.editorHost = document.createElement("div");
      this.editorHost.className = "cl-editor-host";
      this.root.appendChild(this.editorHost);
      await this.editor.mount(this.editorHost, {
        value: this.opts.code,
        language,
        readOnly: !this.editable
      });
      const actions = document.createElement("div");
      actions.className = "cl-actions";
      if (this.opts.tour && this.opts.tour.length) {
        this.tour = new Tour({ highlighter: this.highlighter, language });
        this.tourBtn = document.createElement("button");
        this.tourBtn.type = "button";
        this.tourBtn.className = "cl-btn cl-primary";
        this.tourBtn.textContent = this.labels.tour;
        this.tourBtn.addEventListener("click", () => this.openTour());
        actions.appendChild(this.tourBtn);
      }
      if (this.opts.runner) {
        this.runBtn = document.createElement("button");
        this.runBtn.type = "button";
        this.runBtn.className = "cl-btn";
        this.runBtn.textContent = this.labels.run;
        this.runBtn.addEventListener("click", () => void this.run());
        actions.appendChild(this.runBtn);
      }
      if (actions.childElementCount) this.root.appendChild(actions);
      if (this.opts.runner) {
        this.output = document.createElement("pre");
        this.output.className = "cl-output";
        this.output.hidden = true;
        this.output.setAttribute("aria-live", "polite");
        this.root.appendChild(this.output);
      }
    }
    openTour() {
      if (!this.tour || !this.opts.tour) return;
      this.tour.open({
        title: this.labels.tour,
        code: this.opts.code,
        steps: this.opts.tour
      });
    }
    async run() {
      const runner = this.opts.runner;
      if (!runner) return void 0;
      const code = selectRunCode(this.opts.runCode, this.getValue());
      if (this.runBtn) {
        this.runBtn.disabled = true;
        this.runBtn.textContent = this.labels.running;
      }
      this.showOutput(this.labels.running, false);
      let result;
      try {
        result = await runner.run(code);
        const view = presentRun(result, { noOutput: this.labels.noOutput });
        if (view.markers.length) this.editor.setMarkers?.(view.markers);
        this.showOutput(view.text, view.isError);
        this.opts.onRun?.(result);
      } catch (err) {
        this.showOutput(err.message || this.labels.runFailed, true);
      } finally {
        if (this.runBtn) {
          this.runBtn.disabled = false;
          this.runBtn.textContent = this.labels.run;
        }
      }
      return result;
    }
    showOutput(text, isError) {
      if (!this.output) return;
      this.output.hidden = false;
      this.output.textContent = text;
      this.output.classList.toggle("is-error", isError);
    }
    getValue() {
      return this.editor.getValue();
    }
    setValue(value) {
      this.opts.code = value;
      this.editor.setValue(value);
    }
    setEditable(editable) {
      this.editable = editable;
      this.editor.setReadOnly(!editable);
    }
    destroy() {
      this.tour?.destroy();
      this.editor.destroy();
      this.root.remove();
    }
  };

  // src/editors/load-monaco.ts
  var DEFAULT_BASE = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs";
  var pending;
  function loadMonaco(config = {}) {
    if (window.monaco) return Promise.resolve(window.monaco);
    if (pending) return pending;
    const base = config.base ?? DEFAULT_BASE;
    const registerCSharp = config.registerCSharp ?? true;
    pending = ensureLoaderScript(base).then(() => configureWorker(base)).then(() => requireEditorMain(base)).then((monaco) => {
      if (registerCSharp) registerCSharpCompletions(monaco);
      return monaco;
    });
    return pending;
  }
  function ensureLoaderScript(base) {
    if (window.require) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${base}/loader.min.js`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("loadMonaco: failed to load loader.min.js"));
      document.head.appendChild(script);
    });
  }
  function configureWorker(base) {
    window.MonacoEnvironment = {
      getWorkerUrl: () => `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = { baseUrl: '${base.replace(/\/vs$/, "")}/' };
        importScripts('${base}/base/worker/workerMain.js');
      `)}`
    };
  }
  function requireEditorMain(base) {
    return new Promise((resolve) => {
      window.require.config({ paths: { vs: base } });
      window.require(["vs/editor/editor.main"], () => resolve(window.monaco));
    });
  }
  function registerCSharpCompletions(monaco) {
    const keywords = [
      "public",
      "private",
      "protected",
      "internal",
      "static",
      "void",
      "class",
      "interface",
      "abstract",
      "virtual",
      "override",
      "sealed",
      "readonly",
      "const",
      "new",
      "return",
      "if",
      "else",
      "for",
      "foreach",
      "while",
      "do",
      "switch",
      "case",
      "break",
      "continue",
      "using",
      "namespace",
      "this",
      "base",
      "null",
      "true",
      "false",
      "var",
      "int",
      "string",
      "bool",
      "double",
      "float",
      "decimal",
      "char",
      "object",
      "enum",
      "struct",
      "try",
      "catch",
      "finally",
      "throw",
      "get",
      "set",
      "in",
      "out",
      "ref",
      "params",
      "async",
      "await"
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
      provideCompletionItems(model, position) {
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
        for (const kw of keywords) {
          suggestions.push({ label: kw, kind: K.Keyword, insertText: kw, range });
        }
        for (const m of members) {
          suggestions.push({ label: m.label, kind: K.Method, detail: m.doc, insertText: m.insert, insertTextRules: R, range });
        }
        for (const s of snippets) {
          suggestions.push({ label: s.label, kind: K.Snippet, detail: s.doc, insertText: s.insert, insertTextRules: R, range });
        }
        return { suggestions };
      }
    });
  }

  // src/runners/roslyn-iframe.ts
  var DEFAULT_WARM_PROGRAM = "public class __Warm { public static void Main() { } }";
  var RoslynIframeRunner = class {
    constructor(config) {
      this.iframe = null;
      this.readyPromise = null;
      this.warmPromise = null;
      this.seq = 0;
      this.pending = /* @__PURE__ */ new Map();
      this.onMessage = (e) => this.handleMessage(e);
      this.url = config.url;
      this.readyTimeout = config.readyTimeout ?? 12e4;
      this.runTimeout = config.runTimeout ?? 6e4;
      this.warmProgram = config.warmProgram ?? DEFAULT_WARM_PROGRAM;
      if (config.autoWarm ?? true) {
        void this.warm().catch(() => {
        });
      }
    }
    handleMessage(event) {
      if (event.origin !== window.location.origin) return;
      const data = event.data || {};
      if (data.type === "coderunner:result" && data.id != null && this.pending.has(data.id)) {
        const entry = this.pending.get(data.id);
        clearTimeout(entry.timer);
        this.pending.delete(data.id);
        entry.resolve(data.result);
      }
    }
    ensureFrame() {
      if (this.readyPromise) return this.readyPromise;
      window.addEventListener("message", this.onMessage);
      this.iframe = document.createElement("iframe");
      this.iframe.className = "cl-runner-frame";
      this.iframe.setAttribute("aria-hidden", "true");
      this.iframe.setAttribute("tabindex", "-1");
      this.iframe.title = "code runner";
      this.iframe.src = this.url;
      document.body.appendChild(this.iframe);
      this.readyPromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error("The code runner took too long to load."));
        }, this.readyTimeout);
        const ready = (event) => {
          if (event.origin !== window.location.origin) return;
          if ((event.data || {}).type !== "coderunner:ready") return;
          window.removeEventListener("message", ready);
          clearTimeout(timer);
          resolve();
        };
        window.addEventListener("message", ready);
      });
      return this.readyPromise;
    }
    async preload() {
      await this.ensureFrame();
    }
    /** Load the runtime and JIT the backend with a throwaway compile so the first
     *  real run is fast. Idempotent: repeated calls share one warm-up. */
    async warm() {
      if (this.warmPromise) return this.warmPromise;
      this.warmPromise = (async () => {
        await this.ensureFrame();
        await this.run(this.warmProgram);
      })();
      return this.warmPromise;
    }
    async run(code) {
      await this.ensureFrame();
      const id = ++this.seq;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pending.delete(id);
          reject(new Error("The code took too long to run."));
        }, this.runTimeout);
        this.pending.set(id, { resolve, reject, timer });
        this.iframe.contentWindow.postMessage(
          { type: "coderunner:run", id, code },
          window.location.origin
        );
      });
    }
    destroy() {
      window.removeEventListener("message", this.onMessage);
      this.pending.forEach((p) => clearTimeout(p.timer));
      this.pending.clear();
      this.iframe?.remove();
      this.iframe = null;
      this.readyPromise = null;
      this.warmPromise = null;
    }
  };

  // src/dom/error-panel.ts
  var DEFAULT_LABELS2 = {
    heading: "Let's fix this first",
    note: "Often a single early mistake (a missing or extra { } ( ) ;) is enough to confuse the rest. Fix the top one first, then run again."
  };
  function locText(e) {
    if (e.line == null) return "";
    return e.column != null ? `Line ${e.line}, col ${e.column}` : `Line ${e.line}`;
  }
  function renderErrorPanel(errors, labels = {}) {
    const l = { ...DEFAULT_LABELS2, ...labels };
    const section = document.createElement("section");
    section.className = "cl-errors";
    const heading = document.createElement("h3");
    heading.textContent = l.heading;
    section.appendChild(heading);
    const note = document.createElement("p");
    note.className = "cl-errors-note";
    note.textContent = l.note;
    section.appendChild(note);
    const list = document.createElement("ul");
    for (const e of errors) {
      const li = document.createElement("li");
      const loc = locText(e);
      if (loc) {
        const locEl = document.createElement("span");
        locEl.className = "cl-error-loc";
        locEl.textContent = loc;
        li.appendChild(locEl);
      }
      if (e.friendly) {
        const friendly = document.createElement("span");
        friendly.className = "cl-error-friendly";
        friendly.textContent = e.friendly;
        li.appendChild(friendly);
      }
      const raw = document.createElement("span");
      raw.className = "cl-error-raw";
      raw.textContent = e.raw;
      li.appendChild(raw);
      list.appendChild(li);
    }
    section.appendChild(list);
    return section;
  }
  function showErrorPanel(host, errors, labels) {
    host.textContent = "";
    if (!errors || errors.length === 0) {
      host.hidden = true;
      return false;
    }
    host.appendChild(renderErrorPanel(errors, labels));
    host.hidden = false;
    return true;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=code-lab.global.js.map