import SpaceBridgeCollisionError from "./SpaceBridgeCollisionError.mjs";
import {
  executeFunctionRemotely,
  functionMap,
  isSettled,
  setOptions,
  shouldRunLocally,
} from "./internals.mjs";

/**
 * Wraps the function to include balancing logic and
 * environment-specific triggers
 *
 * @template {Callable} F2
 * @param {string} name
 * @param {F2} func
 * @returns {BridgedFunction<F2>}
 */
export function clientDefine(name, func) {
  return Object.assign(
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
            return await module[methodName](...args); // TODO use define, race import against API call
          }

          return executeFunctionRemotely(methodName, ...args);
        }
      );
  }

  // members
  for (const member of members) {
    const isSchema = !(typeof member === "string");
    /** @type {keyof M} */
    const memberName = isSchema ? member?.name : member;

    promisedModule[memberName] = new Promise(async (res, rej) => {
      const module = await modulePromise; // TODO find a way to fetch values over API too
      res(module[memberName]);
    });
  }
  return promisedModule;
}

/**
 *
 * @template {Module} M
 * @param {() => Promise<M>} fetchModule
 * @param {{methods: [string | MethodSchema], members: [string | MemberSchema]}} signature
 * @returns {[PromiseWrappedModule<M>, ()=>void]} TODO make it return a promise-wrapped module
 */
export function clientLazy(fetchModule, { methods, members }) {
  /** @type {(val: any) => void} */
  let resolveModulePromise;
  const modulePromise = new Promise((res, rej) => {
    resolveModulePromise = res;
  });

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
            return await module[methodName](...args); // TODO use define, race import against API call
          }

          return executeFunctionRemotely(methodName, ...args);
        }
      );
  }

  // members
  for (const member of members) {
    const isSchema = !(typeof member === "string");
    /** @type {keyof M} */
    const memberName = isSchema ? member?.name : member;

    promisedModule[memberName] = new Promise(async (res, rej) => {
      const module = await modulePromise; // TODO find a way to fetch values over API too
      res(module[memberName]);
    });
  }

  const trigger = async () => {
    const fetchedModule = await fetchModule();
    resolveModulePromise(fetchedModule);
  };
  return [promisedModule, trigger];
}

/**
 * A drop-in replacement for the fetch API that utilizes the BackgroundSync API
 * where possible. Where the API is unavailable (due to browser support,
 * execution outside of a PWA, or any other limitation) the fetch API is used.
 * @type {typeof fetch}
 */
export async function clientQueue(input, init = undefined) {
  return await fetch(input, init); // TODO implement queueing
}
