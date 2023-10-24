import { setOptions } from "./src/index.mjs";
import { hello } from "./library.mjs";

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
biasRange.value = -10;
biasVal.value = -10;

document.querySelectorAll("input[type='radio']").forEach(
  (el) =>
    (el.onchange = function (e) {
      console.log(e.target.value);
      env = e.target.value;
    })
);

document.querySelector("form").onsubmit = async function getMessage(e) {
  const output = document.querySelector("output[name='response']");

  e.preventDefault();
  if (env === "dynamic") {
    output.value = await hello();
  } else if (env === "local") {
    output.value = await hello.runLocal();
  } else if (env === "remote") {
    output.value = await hello.runRemote();
  }
  const { localRunTime, remoteRunTime } = hello.getStats();
  document.querySelector("output[name='local-run-time']").value = localRunTime;
  document.querySelector("output[name='remote-run-time']").value =
    remoteRunTime;
};
