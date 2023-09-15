import SpaceBridgeCollisionError from "./SpaceBridgeCollisionError.mjs";
import {
  executeFunctionRemotely,
  functionMap,
  shouldRunLocally,
} from "./internals.mjs";

/** @type {import("./index.mjs").define} */
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
