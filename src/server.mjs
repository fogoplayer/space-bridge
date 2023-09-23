import SpaceBridgeCollisionError from "./SpaceBridgeCollisionError.mjs";
import { deepAssign, functionMap, isSettled } from "./internals.mjs";

/** @type {SpaceBridgeOptions} */
const DEFAULT_SETTINGS = { prefix: "spacebridge", stats: true };

/**
 * Wraps the function in a promise for server use
 *
 * @template {Callable} F2
 * @param {string} name
 * @param {F2} func
 * @returns {BridgedFunction<F2>}
 */
export function serverConvertFunction(name, func) {
  /** @type {PromiseWrappedFunction<F2>} */
  const promiseWrappedFunction = async function (...args) {
    return await func(args);
  };

  return Object.assign(promiseWrappedFunction, {
    runLocal: func,
    runRemote: promiseWrappedFunction,
  });
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
 * @param {...[...Promise<any>[], SpaceBridgeOptions]} args `import()`s for each of the libraries to be registered, followed by overrides for the global SpaceBridge options
 * @returns
 */
export function serverCreateMiddleware(...args) {
  const { prefix, stats } = deepAssign(DEFAULT_SETTINGS, args[args.length - 1]);
  const prefixLen = prefix.length;

  const imports = /** @type {Promise<any>[]} */ (
    /** @type {unknown} */ (args.slice(-1))
  );

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  return async (req, res, next) => {
    if (req.path.substring(0, prefixLen) !== prefix) {
      console.log("next");
      next();
      return;
    }

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
