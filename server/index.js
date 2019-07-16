const path = require('path');
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoutes");
const sessionRoutes = require("./routes/SessionRoutes");
const recipeRoutes = require("./routes/RecipeRoutes")
const userVotedRoutes = require("./routes/UserVotedRoutes")



mongoose.set("debug", true);
mongoose.Promise = global.Promise;

mongoose.connect(process.env.mongodburi, { useNewUrlParser: true }).then(
  () => {
    console.log("mongoose connected successfully");

    startServer();
  },
  err => {
    console.log("mongoose did not connect", err);
  }
);

function startServer() {
  const app = express();
  app.get("/api/testpublic", function (req, res) {
    res.send("Anyone can see this");
  });
  app.use(express.static("build"));
  app.use(bodyParser.json());
  app.use(userRoutes);
  app.use(sessionRoutes);
  app.use(recipeRoutes)
  app.use(userVotedRoutes)

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/../build/index.html'));
  });

  //heroku injects the port number into the PORT env value
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Listening on port:${port}`);
  });
}