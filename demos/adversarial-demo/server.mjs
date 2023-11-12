import express from "express";
import { spacebridge } from "space-bridge";
import path from "path";
import bodyParser from "body-parser";
import "./attack.mjs";
const app = express();
const port = 3000;

app.use(bodyParser.json()); // TODO eliminate this peer dependency
// (depend on it from the module or preferably make my own)

app.use(spacebridge(import("./attack.mjs"), {}));

app.use("/", express.static("./"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
