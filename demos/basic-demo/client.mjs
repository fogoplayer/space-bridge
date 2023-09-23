import { setOptions } from "../../src/index.mjs";
import { sum } from "./library.mjs";

setOptions({ baseUrl: "https://my-app.com" });

const total = sum(3.14, 6.28);
