/**
 * @type {{
 *  [key: string]: {
 *    callback: Function
 *    options?: Partial<SpaceBridgeOptions> | DefineOptions
 *  }
 * }}
 */
export let functionMap = {};

/** @type {InitOptions} */
export let spaceBridgeGlobalOptions = {
  baseUrl: "/",
  body: {},
  headers: {},
  weights: { network: 1, specs: 1, cost: 1, performance: 1 },
};

export function shouldRunLocally() {
  return true;
}

/**
 * Executes the named function remotely
 * // TODO pass in function instead of name, use generics?
 *
 * @param {string} name
 * @param  {...any} args
 * @returns {Promise<any>}
 */
export async function executeFunctionRemotely(name, ...args) {
  return await Promise.resolve("foobar");
}

/**
 * Does a deep assignment onto the options object
 * @param {Partial<InitOptions>} options
 * @returns {void}
 */
export function setOptions(options) {
  spaceBridgeGlobalOptions = Object.assign(spaceBridgeGlobalOptions, options); // TODO add deep assignment
}

/**
 * Checks if a promise is settled
 * @param {Promise<unknown>} promise
 * @returns {Promise<boolean>}
 */
export async function isSettled(promise) {
  // We put `pending` promise after the promise to test,
  // which forces .race to test `promise` first
  return await Promise.race([promise, "pending"]).then(
    (val) => val !== "pending"
  );
}
