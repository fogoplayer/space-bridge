import { clientHello as hello } from "./client-library.js";

console.log(hello.runLocal()); // "Hello from client!"
console.log(hello.runRemote()); // "Hello from server!"
console.log(hello()); // Could be either
