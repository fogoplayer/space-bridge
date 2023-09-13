// if we do have process or don't have a window
const isServer = typeof process !== undefined || typeof window === undefined;

export function define() {
  if (isServer) clientDefine();
}
