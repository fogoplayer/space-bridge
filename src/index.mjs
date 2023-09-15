import SpaceBridgeEnvironmentError from "./SpaceBridgeClientOnlyError.mjs";
import { clientDefine } from "./client.mjs";
import { serverCreateMiddleware, serverDefine } from "./server.mjs";

// if we do have process or don't have a window
const isServer = typeof process !== undefined || typeof window === undefined;

/** @type {typeof serverDefine} */
export function define(name, func, options) {
  if (isServer) return serverDefine(name, func, options);
  else return clientDefine(name, func, options);
}

export function init() {
  if (isServer) throw new SpaceBridgeEnvironmentError();
  clientInit();
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
