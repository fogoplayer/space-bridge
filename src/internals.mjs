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
  prefix: "spacebridge",
  body: {},
  headers: {},
  bias: 1,
};

/**
 * Executes the named function remotely
 * // TODO pass in function instead of name, use generics?
 * // TODO handle errors
 * // TODO handle leading/trailing slashes in baseURL and prefix
 *
 * @param {string} name
 * @param  {...any} args
 * @returns {Promise<any>}
 */
export async function executeFunctionRemotely(name, ...args) {
  const { baseUrl, prefix, body, headers } = spaceBridgeGlobalOptions;

  const response = await fetch(baseUrl + prefix, {
    method: "POST",
    body: JSON.stringify(Object.assign(body || {}, { name, args })),
    headers: new Headers(
      Object.assign(headers || {}, {
        "content-type": "application/json",
      })
    ),
  });

  const { returnVal } = await response.json();
  return returnVal;
}

/**
 * Does a deep assignment onto the options object
 * @param {Partial<InitOptions>} options
 * @returns {void}
 */
export function setOptions(options) {
  // TODO don't allow (-1)-(1) bias
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
 * @template {Object} O1
 * @template {Object} O2
 * @param {O1} obj1
 * @param {O2} obj2
 * @returns {O1 & O2}
 */
export function deepAssign(obj1, obj2) {
  const obj1Keys = /** @type {[keyof O1]} */ (Object.keys(obj1));
  const obj2Keys = /** @type {[keyof O2]} */ (Object.keys(obj2));
  const keySet = new Set([...obj1Keys, ...obj2Keys]);

  const untypedObj1 = /** @type {any} */ (obj1);
  const untypedObj2 = /** @type {any} */ (obj2);

  keySet.forEach((key) => {
    // @ts-ignore unset
    if (obj2[key] === unset()) {
      delete untypedObj1[key];
      return;
    }

    // @ts-ignore only defined on 1
    if (untypedObj1[key] !== undefined && obj2[key] === undefined) {
      return;
    }

    // @ts-ignore only defined on 2
    if (untypedObj1[key] === undefined && obj2[key] !== undefined) {
      untypedObj1[key] = untypedObj2[key];
      return;
    }

    // defined on both
    if (
      typeof untypedObj1[key] !== "object" ||
      typeof untypedObj2[key] !== "object"
    ) {
      untypedObj1[key] = untypedObj2[key];
      return;
    }

    untypedObj1[key] = deepAssign(untypedObj1[key], untypedObj2[key]);
  });

  return untypedObj1;
}

export function unset() {
  return "SPACEBRIDGE_UNSET";
}

/**
 * Wraps a function with performance measurements
 *
 * @param {string} name the event name for the performance API
 * @param {Function} func the function to wrap
 * @param  {...any} args the arguments to pass to the function
 * @returns {[any, Number]} the return value of the function and the number of ms it took to run; duration is -1 if performance measurement is not supported
 */
export function performanceWrapperSync(name, func, ...args) {
  if (!window.performance) return [func(...args), -1];

  performance?.mark("started-" + name);
  const val = func(...args);
  performance?.mark("finished-" + name);
  const remoteMeasure = performance?.measure(
    name + "-duration",
    "started-" + name,
    "finished-" + name
  );
  console.log("remote duration:", remoteMeasure.duration);
  return [val, remoteMeasure.duration];
}

/**
 * Wraps a function with performance measurements
 *
 * @param {string} name the event name for the performance API
 * @param {Function} func the function to wrap
 * @param  {...any} args the arguments to pass to the function
 * @returns {Promise<[any, Number]>} the return value of the function and the number of ms it took to run; duration is -1 if performance measurement is not supported
 */
export async function performanceWrapperAsync(name, func, ...args) {
  // TODO just use a less precise timer if performance is not supported
  if (!window.performance) return [await func(...args), -1];

  performance?.mark("started-" + name);
  const val = await func(...args);
  performance?.mark("finished-" + name);
  const remoteMeasure = performance?.measure(
    name + "-duration",
    "started-" + name,
    "finished-" + name
  );
  console.log("remote duration:", remoteMeasure.duration);
  return [val, remoteMeasure.duration];
}
