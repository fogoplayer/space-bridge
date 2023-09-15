/**
 * @type {{
 *  [key: string]: {
 *    callback: Function
 *    options?: SpaceBridgeOptions | DefineOptions
 *  }
 * }}
 */
export let functionMap = {};

export function shouldRunLocally() {
  return true;
}

export async function executeFunctionRemotely(name, ...args) {
  return Promise.resolve("foobar");
}