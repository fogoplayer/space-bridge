import { runAttack } from "./attack.mjs";

const button = document.querySelector("#start-attack");
button.addEventListener("click", run);

function run() {
  button.disabled = true;
  button.value = "running...";

  runAttack()
    .then(() => (button.value = "done :-)"))
    .catch((e) => {
      console.error(e);
      button.value = "failed :-(";
    });
}
