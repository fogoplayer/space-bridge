import {
  deepAssign,
  executeFunctionRemotely,
  functionMap,
  isSettled,
  performanceWrapperAsync,
  setEnvironment,
  setOptions,
  shouldRunLocally,
} from "./internals.mjs";

/** @type {InitOptions} */
const DEFAULT_SETTINGS = {
  baseUrl: "/",
  prefix: "spacebridge",
  body: {},
  headers: {},
  weights: { network: 1, specs: 1, cost: 1, performance: 1 },
};

const RACE_FACTOR = 5;

/**
 * Wraps the function to include balancing logic and environment-specific triggers
 *
 * @template {Callable} F2
 * @param {string} name
 * @param {F2} func
 * @returns {BridgedFunction<F2>}
 */
export function clientConvertFunction(name, func) {
  /** @type {"local" | "remote" | undefined} */
  let environment = undefined;

  /**
   * Determines which execution environment to use.
   *
   * 1. If the user is offline, run locally
   * 2. For some fraction of calls, run both and store which one is faster
   * 3. For the rest of the calls, use the one determined to be faster
   * 4. If the faster one fails, use the other one
   *
   * @type {PromiseWrappedFunction}
   * @this {BridgedFunction<F2>}
   *
   * @params {...Parameters<F2>} args
   */
  let bridgedFunction = async function (...args) {
    if (window.navigator.onLine === false) return await this.runLocal(...args);

    if (environment === undefined || Math.random() < 1 / RACE_FACTOR) {
      return await this.runRace(...args);
    }

    if (environment === "local") {
      return await this.runLocalAsync(...args).catch((e) => this.runRemote(...args));
    }

    return await this.runRemote(...args).catch((e) => this.runLocal(...args));
  };

  const otherMethods = {
    runLocal: func,
    /** @type {PromiseWrappedFunction} */
    runLocalAsync: async (...args) => {
      return await func(...args);
    },
    /** @type {PromiseWrappedFunction} */
    runRemote: async (...args) => {
      return await executeFunctionRemotely(name, ...args);
    },
    /** @type {PromiseWrappedFunction} */
    runRace: async function (...args) {
      const localPromise = (async () => {
        const val = await performanceWrapperAsync("local", this.runLocal, ...args);
        return [val, "local"];
      })();
      const remotePromise = (async () => {
        const val = await performanceWrapperAsync("local", this.runRemote, ...args);
        return [val, "remote"];
      })();
      const [val, env] = await Promise.race([localPromise, remotePromise]);
      environment = env;
      console.log(`${env} won the race`);
      return val;
    },
  };

  // link up bridged function and subroutines
  bridgedFunction = bridgedFunction.bind(otherMethods);
  bridgedFunction = Object.assign(bridgedFunction, otherMethods);

  // @ts-ignore
  return bridgedFunction;
}

/**
 * Sets the global client-side configuration
 * @param {Partial<InitOptions>} options
 * @returns {void};
 */
export function clientSetOptions(options) {
  options = deepAssign(DEFAULT_SETTINGS, options);
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
