import SpaceBridgeCollisionError from "./SpaceBridgeCollisionError.mjs";
import { functionMap } from "./internals.mjs";

/**
 * Registers a method with the SpaceBridge middleware
 *
 * @param {string} name a string to allow SpaceBridge to uniquely identify this function
 * @param {Function} func the user-defined function to be wrapped in SpaceBridge logic
 * @param {Partial<SpaceBridgeOptions>} [options] options specific to this function
 *
 * @returns {Function} the function that was passed in
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
    // TODO hash the name for some security
    callback: func,
    options,
  };
  return func;
}

/**
 * Express middleware that allows registered methods to be callable via API.
 *
 * **A word about imports:**
 *
 * SpaceBridge does not look at the contents of the imports to determine the
 * API signature. Methods are registered in their `define` call.
 *
 * Technically, as long as the modules have been imported _somewhere_ before
 * the first request comes in, the API will function as intended. This includes
 * `import "./example.js"` at the top of server.js. However, the dynamic import
 * approach is recommended to make it clearer that the module is being imported
 * to associate it with SpaceBridge.
 *
 * If a request comes in before the imports have resolved, the server will
 * respond as soon as the relevent function is imported.
 *
 * @param {...Promise<any>[]} imports `import()`s for each of the libraries to be registered
 * @param {SpaceBridgeOptions} options overrides for the global SpaceBridge options
 * @returns
 */
export function serverCreateMiddleware(
  /** @type {[Promise<any> | SpaceBridgeOptions]} */ ...args
) {
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

    // TODO get list of method names

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

      // TODO POST
      // TODO GET
      // TODO PUT
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
