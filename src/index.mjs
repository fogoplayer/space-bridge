import SpaceBridgeEnvironmentError from "./SpaceBridgeClientOnlyError.mjs";
import { serverCreateMiddleware, serverDefine } from "./server.mjs";

// if we do have process or don't have a window
const isServer = typeof process !== undefined || typeof window === undefined;

export function define() {
  if (isServer) serverDefine();
  else clientDefine();
}

export function init() {
  if (isServer) throw new SpaceBridgeEnvironmentError();
  else clientInit();
}

export function networkFirst() {
  if (isServer) throw new SpaceBridgeEnvironmentError();
  else clientNetworkFirst();
}
export function lazy() {
  if (isServer) throw new SpaceBridgeEnvironmentError();
  else clientLazy();
}
export function queue() {
  if (isServer) throw new SpaceBridgeEnvironmentError();
  else clientQueue();
}

export function spacebridge() {
  if (isServer) throw new SpaceBridgeEnvironmentError();
  else serverCreateMiddleware();
}
