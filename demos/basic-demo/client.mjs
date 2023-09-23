import { setOptions } from "../../src/index.mjs";
import { sum } from "./library.mjs";

setOptions({ baseUrl: "https://my-app.com" });
const total = sum(3.14, 6.28);
const total2 = sum.runLocal(3.14, 6.28);

console.log(await total);
console.log(total2);
