import SpaceBridgeCollisionError from "./SpaceBridgeCollisionError.mjs";
import {
  executeFunctionRemotely,
  functionMap,
  shouldRunLocally,
} from "./internals.mjs";

/**
 * @template {Function} RegisteredFunction
 * @param {string} name the name of the function
 * @param {RegisteredFunction} func the user-defined function to be wrapped in SpaceBridge logic
 * @param {SpaceBridgeOptions} [options] -overrides for the global SpaceBridge options
 *
 * @returns {Function & { runLocal: Function, runRemote: Function}} a promise-wrapped function // TODO make this more specific
 *
 * @throws {SpaceBridgeCollisionError} if a function with the same name has already been registered
 */
export function clientDefine(
  name,
  func,
  options = { prefix: "spacebridge", stats: true }
) {
  if (functionMap[name]) throw new SpaceBridgeCollisionError(name);
  functionMap[name] = {
    callback: func,
    options,
  };

  /**
   * @this {{
   *  runLocal: Function;
   *  runRemote: Function;
   * }}
   * @param  {...any} args
   */
  const registeredFunction = async function (...args) {
    if (shouldRunLocally()) return await this.runLocal();

    return await this.runRemote(name, ...args);
  };

  registeredFunction.runLocal = func;
  registeredFunction.runRemote = executeFunctionRemotely;

  return registeredFunction;
}

/**
 * @param {InitOptions} options
 */
export function clientInit(options) {
  return;
}
