import { clientDefine as define } from "../src/client.mjs";
import { jest } from "@jest/globals";

const _import = jest.fn((address) => {
  return {
    method() {
      return "foo";
    },
    member: "bar",
  };
});

describe("Client: define", () => {
  it("returns an async function", () => {
    expect(define("test1", () => "hello world")()).resolves.toBe("hello world");
  });

  it("does not change the function's behavior", () => {
    const initialFunction = (a, b) => a + b;
    const bridgedFunction = define("test2", initialFunction);
    const args = [8, 13];

    expect(bridgedFunction(...args)).resolves.toBe(initialFunction(...args));
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

  test.todo(
    "throws a collision error if a method is defined twice in two different files"
  ); // TODO

  test.todo("overrides options as expected"); // TODO

  test.todo("unsets options as expected"); // TODO
});

describe("Client: init", () => {
  test.todo("options function as expected"); // TODO

  test.todo("throws an error in the wrong environment"); // TODO
});

describe("Client: networkFirst", () => {
  test.todo("calls remotely before load"); // TODO

  test.todo("cannot be called locally before load"); // TODO

  test.todo("can be called remotely after load"); // TODO

  test.todo("can be called locally after load"); // TODO

  test.todo("uses the signature to generate the module"); // TODO

  test.todo("allows access to members"); // todo

  test.todo("allows access to methods"); // todo

  test.todo("throws an error in the wrong environment"); // TODO

  test.todo("throws a collision error if a method is already defined"); // TODO
});

describe("Client: lazy", () => {
  test.todo("does not load the module until triggered"); // TODO

  test.todo("loads the moduel when triggered"); // TODO

  test.todo("calls remotely before load"); // TODO

  test.todo("cannot be called locally before load"); // TODO

  test.todo("can be called remotely after load"); // TODO

  test.todo("can be called locally after load"); // TODO

  test.todo("uses the signature to generate the module"); // TODO

  test.todo("allows access to members"); // todo

  test.todo("allows access to methods"); // todo

  test.todo("throws an error in the wrong environment"); // TODO

  test.todo("throws a collision error if a method is already defined"); // TODO
});

describe("Client: queue", () => {
  test.todo("works in HTTP"); // TODO

  test.todo("works in HTTPS (non-PWA)"); // TODO

  test.todo("works in an online PWA"); // TODO

  test.todo("registers a service worker"); // TODO

  test.todo("works in an offline PWA"); // TODO
});
