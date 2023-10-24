import { setOptions } from "./src/index.mjs";
import { hello } from "./library.mjs";
import { setEnvironment } from "./src/internals.mjs";

let env = "dynamic";

const biasRange = document.querySelector("input[type='range']");
const biasVal = document.querySelector("input[type='number']");
const biasChange = function (e) {
  console.log(e.target.value);
  setOptions({ bias: e.target.value });
  biasVal.value = e.target.value;
  biasRange.value = e.target.value;
};

biasRange.oninput = biasChange;
biasVal.oninput = biasChange;
biasVal.value = -10;

document.querySelectorAll("input[type='radio']").forEach(
  (el) =>
    (el.onchange = function (e) {
      console.log(e.target.value);
      env = e.target.value;
    })
);

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
