import express from "express";
import { spacebridge } from "space-bridge";

const app = express();
const port = 3000;

app.use(spacebridge({}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
