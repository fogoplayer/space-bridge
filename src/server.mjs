import SpaceBridgeCollisionError from "./SpaceBridgeCollisionError.mjs";

/**
 * @type {{
 *  [key: string]: {
 *    callback: Function
 *    options?: SpaceBridgeOptions
 *  }
 * }}
 */
let functionMap = {};

/**
 * @template {Function} RegisteredFunction
 * @param {string} name the name of the function
 * @param {RegisteredFunction} func the user-defined function to be wrapped in SpaceBridge logic
 * @param {SpaceBridgeOptions} [options] -overrides for the global SpaceBridge options
 *
 * @returns {RegisteredFunction} a promise-wrapped function
 *
 * @throws {SpaceBridgeCollisionError} if a function with the same name has already been registered
 */
export function serverDefine(
  name,
  func,
  options = { prefix: "spacebridge", stats: true }
) {
  if (functionMap[name]) throw new SpaceBridgeCollisionError(name);
  functionMap[name] = {
    callback: func,
    options,
  };
  return func;
}

/**
 *
 * @param  {[...Promise<any>[], SpaceBridgeOptions]} args
 * @returns
 */
export function serverCreateMiddleware(...args) {
  const { prefix, stats } = /** @type {SpaceBridgeOptions} */ (
    args[args.length - 1]
  );
  const prefixLen = prefix.length;

  const imports = /** @type {Promise<any>[]} */ (args.slice(-1));

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  return async (req, res, next) => {
    if (req.path.substring(0, prefixLen) !== prefix) next();

    if (!stats && (req.method === "GET" || req.method === "PUT")) {
      res.sendStatus(404);
      return;
    }

    const name = req.path.substring(prefixLen);
    while (true) {
      const func = functionMap[name];
      if (!func) {
        // if every promise is settled, 404
        if (await imports.every(async (promise) => await isSettled(promise))) {
          res.sendStatus(404);
          return;
        }

        // otherwise, wait for the promises to settle
        await Promise.any(imports);
      }
    }
  };
}

/**
 * Checks if a promise is settled
 * @param {Promise<unknown>} promise
 * @returns {Promise<boolean>}
 */
async function isSettled(promise) {
  // We put `pending` promise after the promise to test,
  // which forces .race to test `promise` first
  return await Promise.race([promise, "pending"]).then(
    (val) => val !== "pending"
  );
}
