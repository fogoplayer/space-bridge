import SpaceBridgeClientOnlyError from "./SpaceBridgeClientOnlyError.mjs";

// if we do have process or don't have a window
const isServer = typeof process !== undefined || typeof window === undefined;

export function define() {
  if (isServer) serverDefine();
  else clientDefine();
}

export function init() {
  if (isServer) throw SpaceBridgeClientOnlyError();
  else clientInit();
}

export function networkFirst() {
  if (isServer) throw SpaceBridgeClientOnlyError();
  else clientNetworkFirst();
}
export function lazy() {
  if (isServer) throw SpaceBridgeClientOnlyError();
  else clientLazy();
}
export function queue() {
  if (isServer) throw SpaceBridgeClientOnlyError();
  else clientQueue();
}

export function spacebridge() {
  if (isServer) throw SpaceBridgeClientOnlyError();
  else serverSpaceBridge();
}
