// set up express
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// set up database
const database = require("./database");

// set up view engine
app.set("view engine", "ejs");

// port
const PORT = 3200;
app.listen(PORT, () => {
  console.log("server is listening on localhost " + PORT);
});

// create routes here
app.get("/", (req, res) => {
  res.send("Homepage");
});
