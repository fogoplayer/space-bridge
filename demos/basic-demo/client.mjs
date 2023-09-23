import { setOptions } from "./src/index.mjs";
import { hello } from "./library.mjs";
import { setEnvironment } from "./src/internals.mjs";

setOptions({});

document.querySelector("form").onchange = function (e) {
  console.log(e.target.value);
  setEnvironment(e.target.value);
};

document.querySelector("form").onsubmit = async function getMessage(e) {
  e.preventDefault();
  document.querySelector("output").value = await hello();
};
