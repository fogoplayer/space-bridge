import { clientDefine as define } from "../../src/client.mjs";

describe("Client: define", () => {
  it("returns an async function", () => {
    // TODO does this make sure it's a promise?
    expect(define("test1", () => "hello world")()).resolves.toBe("hello world");
  });

  it("does not change the function's behavior", () => {
    const initialFunction = (a, b) => a + b;
    const bridgedFunction = define("test2", initialFunction);
    expect(bridgedFunction(8, 13)).resolves.toBe(21);
    expect(bridgedFunction.arguments).toBe(initialFunction.arguments);
  });

  it("can be called locally", () => {
    expect(define("test3", () => "hello world").runLocal).toBeTruthy();
  });

  it("can be called remotely", () => {
    expect(define("test4", () => "hello world").runRemote).toBeTruthy();
  });

  it("throws a collision error if a method is defined twice in the same file", () => {
    define("test5", () => "hello world");
    expect(define("test5", () => "hello other world")).toThrow();
  });

  it("throws a collision error if a method is defined twice in two different files", () => {
    expect(false).toBeTruthy(); // TODO
  });

  it("overrides options as expected", () => {
    expect(false).toBeTruthy(); // TODO
  });

  it("unsets options as expected", () => {
    expect(false).toBeTruthy(); // TODO
  });
});
