// got excited about the ability to interrupt long-running processes and wanted to work out how that might work

/**
 * Allows the interruption of long-running async processes
 * @returns {[Function, Function]} [signal, sendSignal]
 */
function createSignal() {
  let sendSignal;

  const signal = new Promise((res, rej) => {
    sendSignal = res;
  });

  async function setInterrupt() {
    const errorVal = await signal;
    throw new Error(errorVal);
  }

  return [setInterrupt, sendSignal];
}

(async () => {
  const [signal, sendSignal] = createSignal();

  async function interruptable() {
    try {
      signal();
    } catch (e) {
      return;
    }

    let i = 0;
    while (true) {
      await sleep(1000);
      console.log(`ran for ${i++} seconds`);
    }
  }

  interruptable();

  setTimeout(() => {
    sendSignal("hello");
  }, 5000);
})();

async function sleep(ms) {
  return await new Promise((res) => setTimeout(res, ms));
}
