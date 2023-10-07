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
  const [setInterrupt, sendSignal] = createSignal();

  async function interruptable() {
    return await new Promise(async (res, rej) => {
      setInterrupt().catch((err) => {
        rej(err.message);
      });

      let i = 0;
      while (true) {
        await sleep(1000);
        console.log(`ran for ${i++} seconds`);
      }
    });
  }

  interruptable().catch((err) => {
    console.log(`Execution interrupted: ${err.message}`);
  });

  setTimeout(() => {
    sendSignal("hello");
  }, 5000);
  await sleep(10000);
})();

async function sleep(ms) {
  return await new Promise((res) => setTimeout(res, ms));
}
