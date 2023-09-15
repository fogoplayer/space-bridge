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
   * @type {BridgedFunction}
   * @this {{
   *  runLocal: BridgedFunction["runLocal"];
   *  runRemote: BridgedFunction["runRemote"];
   * }}
   */
  // @ts-ignore
  const registeredFunction = async function (...args) {
    if (shouldRunLocally()) return await this.runLocal();
    this;

    return await this.runRemote(...args);
  };

  registeredFunction.runLocal = func;
  /** @type {PromiseWrappedFunction} */
  registeredFunction.runRemote = async (...args) => {
    await executeFunctionRemotely(name, ...args);
  };

  // @ts-ignore
  // TODO weird things happen with generics and imports. I can't say that
  // `registeredFunction` is of type `BridgedFunction<F>` because TS doesn't know what `F` is in this file
  return registeredFunction;
}

/**
 * @param {InitOptions} options
 */
export function clientInit(options) {
  return;
}
