export default class SpaceBridgeEnvironmentError extends Error {
  constructor(message) {
    super(message);
    this.name = "SpaceBridgeEnvironmentError";
  }
}
