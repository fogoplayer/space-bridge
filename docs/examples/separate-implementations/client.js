import { init } from "space-bridge";
import { clientHello as hello } from "./client-library.js";

init({ baseUrl: "https://my-app.com" });

console.log(hello.runLocal()); // "Hello from client!"
console.log(hello.runRemote()); // "Hello from server!"
console.log(hello()); // Could be either
