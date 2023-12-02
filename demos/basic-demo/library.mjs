import { define } from "../../src/index.mjs";

const environment =
  typeof process !== "undefined" || typeof window === "undefined"
    ? "server"
    : "client";

export const hello = define("hello", () => "Hello from the " + environment);
