// got excited about the ability to interrupt long-running processes and wanted to work out how that might work

/**
 * Allows the interruption of long-running async processes
 * @returns {[Promise, Function]} [signal, sendSignal]
 */
function createSignal() {
  let sendSignal;
  let signal = new Promise((res, rej) => {
    sendSignal = res;
  }).then((resVal) => {
    throw new Error(resVal);
  });

  return [signal, sendSignal];
}

(async () => {
  const [signal, sendSignal] = createSignal();

  async function interruptable() {
    signal;

    let i = 0;
    while (true) {
      await new Promise((res) => setTimeout(res, 1000));
      console.log(`ran for ${i++} seconds`);
    }
  }

  interruptable().catch((err) => {
    console.log("interrupted");
  });

  setTimeout(() => {
    sendSignal("hello");
  }, 1000);
})();
