import { setOptions } from "./src/index.mjs";
import { hello } from "./library.mjs";
import { setEnvironment } from "./src/internals.mjs";

setOptions({ bias: -10 });

let env = "dynamic";

document.querySelector("form").onchange = function (e) {
  console.log(e.target.value);
  env = e.target.value;
};

document.querySelector("form").onsubmit = async function getMessage(e) {
  e.preventDefault();
  if (env === "dynamic") {
    document.querySelector("output").value = await hello();
  } else if (env === "local") {
    document.querySelector("output").value = await hello.runLocal();
  } else if (env === "remote") {
    document.querySelector("output").value = await hello.runRemote();
  }
};
