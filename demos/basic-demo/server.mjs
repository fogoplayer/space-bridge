import express from "express";
import { spacebridge } from "space-bridge";
import path from "path";

const app = express();
const port = 3000;

app.use(spacebridge({}));

app.use("/", express.static("./"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
