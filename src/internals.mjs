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

///////////////////////////////////////////////////////////////////////////////
// this section is just temporary before we're really able to get into the
// contents of shouldRunLocally
/** @type {"remote" | "local"} */
let environment = "local";

/**
 * @param {typeof environment} env
 */
export function setEnvironment(env) {
  environment = env;
}
///////////////////////////////////////////////////////////////////////////////

export function shouldRunLocally() {
  return environment === "local";
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

/**
 * Takes in two objects and does a deep merge between the two
 *
 * @template {any} O1
 * @template {any} O2
 * @param {O1} obj1
 * @param {O2} obj2
 * @returns {O1 & O2}
 */
export function deepAssign(obj1, obj2) {
  const obj1Keys = /** @type {[any]} */ (Object.keys(obj1));
  const obj2Keys = /** @type {[any]} */ (Object.keys(obj2));
  const keySet = new Set([...obj1Keys, ...obj2Keys]);

  /** @type {O1 & O2} */
  (obj1);

  keySet.forEach((key) => {
    // @ts-ignore only defined on 1
    if (obj1[key] !== undefined && obj2[key] === undefined) {
      return;
    }

    // @ts-ignore only defined on 2
    if (obj1[key] === undefined && obj2[key] !== undefined) {
      obj1[key] = obj2[key];
    }

    // defined on both
    if (typeof obj1[key] !== "object" || typeof obj2[key] !== "object") {
      obj1[key] = obj2[key];
    }

    obj1[key] = deepAssign(obj1[key], obj2[key]);
  });

  return obj1;
}

export function unset() {
  return "SPACEBRIDGE_UNSET";
}
