import { clientDefine as define } from "../../src/client.mjs";

describe("Client: define", () => {
  it("returns an async function", () => {
    expect(define("test1", () => "hello world")()).resolves.toBe("hello world");
  });
});
