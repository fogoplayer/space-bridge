import { clientDefine as define } from "../src/client.mjs";

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
    test.todo("needs to be implemented"); // TODO does this make sure it's a promise?
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
    test.todo("needs to be implemented"); // TODO
  });

  it("overrides options as expected", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("unsets options as expected", () => {
    test.todo("needs to be implemented"); // TODO
  });
});

describe("Client: init", () => {
  it("options function as expected", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("throws an error in the wrong environment", () => {
    test.todo("needs to be implemented"); // TODO
  });
});

describe("Client: networkFirst", () => {
  it("calls remotely before load", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("cannot be called locally before load", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("can be called remotely after load", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("can be called locally after load", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("uses the signature to generate the module", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("allows access to members", () => {
    test.todo("needs to be implemented"); // todo
  });

  it("allows access to methods", () => {
    test.todo("needs to be implemented"); // todo
  });

  it("throws an error in the wrong environment", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("throws a collision error if a method is already defined", () => {
    test.todo("needs to be implemented"); // TODO
  });
});

describe("Client: lazy", () => {
  it("does not load the module until triggered", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("loads the moduel when triggered", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("calls remotely before load", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("cannot be called locally before load", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("can be called remotely after load", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("can be called locally after load", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("uses the signature to generate the module", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("allows access to members", () => {
    test.todo("needs to be implemented"); // todo
  });

  it("allows access to methods", () => {
    test.todo("needs to be implemented"); // todo
  });

  it("throws an error in the wrong environment", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("throws a collision error if a method is already defined", () => {
    test.todo("needs to be implemented"); // TODO
  });
});

describe("Client: queue", () => {
  it("works in HTTP", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("works in HTTPS (non-PWA)", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("works in an online PWA", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("registers a service worker", () => {
    test.todo("needs to be implemented"); // TODO
  });

  it("works in an offline PWA", () => {
    test.todo("needs to be implemented"); // TODO
  });
});
