import SpaceBridgeCollisionError from "./SpaceBridgeCollisionError.mjs";
import { functionMap } from "./internals.mjs";

/** @type {import("./index.mjs").define} */
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

  /** @type {PromiseWrappedFunction} */
  const promiseWrappedFunction = async function (...args) {
    await func(args);
  };

  /** @type {BridgedFunction} */
  const returnedFunction = Object.assign(promiseWrappedFunction, {
    /** @type {BridgedFunction["runLocal"]} */
    runLocal: func,
    /** @type {BridgedFunction["runRemote"]} */
    runRemote: promiseWrappedFunction,
  });

  // @ts-ignore
  // TODO weird things happen with generics and imports. I can't say that
  // `registeredFunction` is of type `BridgedFunction<F>` because TS doesn't know what `F` is in this file
  return returnedFunction;
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
  const { prefix, stats } = /** @type {SpaceBridgeOptions} */ (
    /** @type {unknown} */ (args[args.length - 1])
  );
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
