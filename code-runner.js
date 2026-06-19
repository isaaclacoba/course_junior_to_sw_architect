// Reusable C# runner bridge.
// The only component that can compile and run C# in the browser is the Level 3
// capstone (Roslyn compiled into its Blazor WASM app). This helper loads that
// app once, lazily, inside a hidden iframe and relays code to it via postMessage.
//
// Usage:
//   const result = await window.codeRunner.run(code);
//   // result = { compiled, output, runtimeError, errors:[{line, friendly, raw}] }
//   window.codeRunner.preload();  // optional: warm up the iframe early
(function () {
  const CAPSTONE_URL = "level3-app/index.html?runner=1";
  const READY_TIMEOUT = 30000;
  const RUN_TIMEOUT = 20000;

  let iframe = null;
  let readyPromise = null;
  let seq = 0;
  const pending = new Map();

  function onMessage(event) {
    if (event.origin !== window.location.origin) return;
    const data = event.data || {};
    if (data.type === "coderunner:result" && pending.has(data.id)) {
      const entry = pending.get(data.id);
      clearTimeout(entry.timer);
      pending.delete(data.id);
      entry.resolve(data.result);
    }
  }

  function ensureFrame() {
    if (readyPromise) return readyPromise;

    window.addEventListener("message", onMessage);

    iframe = document.createElement("iframe");
    iframe.className = "code-runner-frame";
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("tabindex", "-1");
    iframe.title = "C# runner";
    iframe.src = CAPSTONE_URL;
    document.body.appendChild(iframe);

    readyPromise = new Promise(function (resolve, reject) {
      const timer = setTimeout(function () {
        reject(new Error("The C# runner took too long to load."));
      }, READY_TIMEOUT);

      function ready(event) {
        if (event.origin !== window.location.origin) return;
        if ((event.data || {}).type !== "coderunner:ready") return;
        window.removeEventListener("message", ready);
        clearTimeout(timer);
        resolve();
      }
      window.addEventListener("message", ready);
    });

    return readyPromise;
  }

  async function run(code) {
    await ensureFrame();
    const id = ++seq;
    return new Promise(function (resolve, reject) {
      const timer = setTimeout(function () {
        pending.delete(id);
        reject(new Error("The code took too long to run."));
      }, RUN_TIMEOUT);
      pending.set(id, { resolve: resolve, timer: timer });
      iframe.contentWindow.postMessage(
        { type: "coderunner:run", id: id, code: code },
        window.location.origin
      );
    });
  }

  window.codeRunner = { run: run, preload: ensureFrame };
})();
