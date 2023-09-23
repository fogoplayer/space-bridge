import { setOptions } from "./src/index.mjs";
import { hello } from "./library.mjs";

setOptions({});

document.querySelector("form").onsubmit = async function getMessage(e) {
  e.preventDefault();
  document.querySelector("output").value = await hello();
};
