/**
 * @type {{
 *  [key: string]: {
 *    callback: Function
 *    options?: Partial<SpaceBridgeOptions> | DefineOptions
 *  }
 * }}
 */
export let functionMap = {};

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
