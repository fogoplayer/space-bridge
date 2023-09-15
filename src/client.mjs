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

  /** @type {BridgedFunction} */
  const registeredFunction = Object.assign(
    // base function
    /** @type {PromiseWrappedFunction} */
    (
      async function (...args) {
        // @ts-ignore  shhh TS... `runLocal` will be there at runtime, I promise
        if (shouldRunLocally()) return await this.runLocal(...args);

        // @ts-ignore  shhh TS... `runRemote` will be there at runtime, I promise
        return await this.runRemote(...args);
      }
    ),
    // other methods
    {
      runLocal: func,
      /** @type {PromiseWrappedFunction} */
      runRemote: async (...args) => {
        return await executeFunctionRemotely(name, ...args);
      },
    }
  );

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
