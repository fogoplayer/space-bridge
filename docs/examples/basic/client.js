import { init } from "space-bridge";
import { sum } from "./library.js";

init({ baseUrl: "https://my-app.com" });

const total = sum(3.14, 6.28);
