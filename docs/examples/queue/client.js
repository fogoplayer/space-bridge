import { init, queue } from "space-bridge";

const flowerResponse = queue("/api/phone-home", {
  method: "POST",
  mode: "cors",
  cache: "default",
});
