import SpaceBridgeEnvironmentError from "./SpaceBridgeClientOnlyError.mjs";
import { serverCreateMiddleware, serverDefine } from "./server.mjs";

// if we do have process or don't have a window
const isServer = typeof process !== undefined || typeof window === undefined;

export function define() {
  if (isServer) serverDefine();
  else clientDefine();
}

export function init() {
  if (isServer) throw SpaceBridgeEnvironmentError();
  else clientInit();
}

export function networkFirst() {
  if (isServer) throw SpaceBridgeEnvironmentError();
  else clientNetworkFirst();
}
export function lazy() {
  if (isServer) throw SpaceBridgeEnvironmentError();
  else clientLazy();
}
export function queue() {
  if (isServer) throw SpaceBridgeEnvironmentError();
  else clientQueue();
}

export function spacebridge() {
  if (isServer) throw SpaceBridgeEnvironmentError();
  else serverCreateMiddleware();
}
