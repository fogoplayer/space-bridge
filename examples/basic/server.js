import express from express;
const app = express();
const port = 3000;

// Set the view engine to pug
app.set("view engine", "pug");

// Create a route for the home page
app.get("/", (req, res) => {
  res.render("index");
});

// Listen on port 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
