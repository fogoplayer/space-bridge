export default class SpaceBridgeCollisionError extends Error {
  /**
   *
   * @param {string} name the name of the function that was already defined
   */
  constructor(name) {
    super(
      `A function named ${name} has already been registered with SpaceBridge`
    );
    this.name = "SpaceBridgeEnvironmentError";
  }
}
