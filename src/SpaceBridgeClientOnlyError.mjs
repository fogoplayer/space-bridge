export default class SpaceBridgeClientOnlyError extends Error {
  constructor(message) {
    super(message);
    this.name = "SpaceBridgeClientOnlyError";
  }
}
