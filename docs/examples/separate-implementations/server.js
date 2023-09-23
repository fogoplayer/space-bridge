import express from express;
import spacebridge from "space-bridge";

const app = express();
const port = 3000;

app.use(spacebridge(
  import("./server-library.js")
))

// Listen on port 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
