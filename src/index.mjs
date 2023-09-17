import SpaceBridgeEnvironmentError from "./SpaceBridgeClientOnlyError.mjs";
import SpaceBridgeCollisionError from "./SpaceBridgeCollisionError.mjs";
import { clientDefine, clientSetOptions } from "./client.mjs";
import { functionMap } from "./internals.mjs";
import { serverCreateMiddleware, serverConvertFunction } from "./server.mjs";

// if we do have process or don't have a window
const isServer = typeof process !== undefined || typeof window === undefined;

/**
 * A higher-order function that wraps function definitions to use SpaceBridge
 * logic.
 *
 * It is isomorphic, so you can use define in libraries pre-export and the
 * correct logic will be loaded in each environment.
 *
 * It returns a function that returns a promise, and that promise resolves to
 * the return value of your function.
 *
 * Asynchronous methods passed into define get awaited, meaning that when the
 * defined function’s promise resolves, it will resolve to the return value of
 * the function, not another promise.
 *
 * @template {Callable} F
 * @param {string} name a string to allow SpaceBridge to identify this function;
 * must be unique
 * @param {F} func the user-defined function to be wrapped in SpaceBridge logic
 * @param {Partial<SpaceBridgeOptions>} [options] options specific to this function;
 * when included, will overwrite only specified properties
 *
 * @returns {BridgedFunction<F>} a promise-wrapped function // TODO make this more specific;
 *
 * @throws {SpaceBridgeCollisionError} if a function with the same name has already been registered
 */
export function define(
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

  if (isServer) return serverConvertFunction(name, func);
  else return clientDefine(name, func);
}

/** @type {typeof clientSetOptions} */
export function setOptions(options) {
  if (isServer) throw new SpaceBridgeEnvironmentError();
  clientSetOptions(options);
}

export function networkFirst() {
  if (isServer) throw new SpaceBridgeEnvironmentError();
  clientNetworkFirst();
}
export function lazy() {
  if (isServer) throw new SpaceBridgeEnvironmentError();
  clientLazy();
}
export function queue() {
  if (isServer) throw new SpaceBridgeEnvironmentError();
  clientQueue();
}

/** @type {serverCreateMiddleware} */
export function spacebridge(args) {
  if (isServer) return serverCreateMiddleware(args);
  throw new SpaceBridgeEnvironmentError();
}
