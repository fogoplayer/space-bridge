import SpaceBridgeClientOnlyError from "./SpaceBridgeClientOnlyError.mjs";

// if we do have process or don't have a window
const isServer = typeof process !== undefined || typeof window === undefined;

export function define() {
  if (isServer) clientDefine();
  else serverDefine();
}

export function init() {
  if (isServer) clientInit();
  else throw SpaceBridgeClientOnlyError;
}

export function networkFirst() {
  if (isServer) clientNetworkFirst();
  else throw SpaceBridgeClientOnlyError;
}
export function lazy() {
  if (isServer) clientLazy();
  else throw SpaceBridgeClientOnlyError;
}
export function queue() {
  if (isServer) clientQueue();
  else throw SpaceBridgeClientOnlyError;
}
