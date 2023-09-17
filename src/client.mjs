import SpaceBridgeCollisionError from "./SpaceBridgeCollisionError.mjs";
import {
  executeFunctionRemotely,
  functionMap,
  isSettled,
  setOptions,
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
 * Sets the global client-side configuration
 * @param {Partial<InitOptions>} options
 * @returns {void};
 */
export function clientSetOptions(options) {
  setOptions(options);
}

/**
 *
 * @template {Module} M
 * @param {Promise<M>} modulePromise
 * @param {{methods: [string | MethodSchema], members: [string | MemberSchema]}} signature
 * @returns {PromiseWrappedModule<M>}
 */
export function clientNetworkFirst(modulePromise, { methods, members }) {
  /** @type {PromiseWrappedModule<M>} */
  // @ts-ignore
  const promisedModule = {};

  // methods
  for (const method of methods) {
    const isSchema = !(typeof method === "string");
    /** @type {keyof M} */
    const methodName = isSchema ? method?.name : method;
    const methodArgs = isSchema ? method?.args.map((arg) => arg.name) : [];

    promisedModule[methodName] =
      /** @type {(...args: any[]) => Promise<any>} */
      (
        async function (...args) {
          if (await isSettled(modulePromise)) {
            const module = await modulePromise;
            return await module[methodName](...args); // TODO use define
          }

          return executeFunctionRemotely(methodName, ...args);
        }
      );
  }
  return promisedModule;
}
