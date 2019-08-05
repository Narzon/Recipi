const path = require('path');
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoutes");
const sessionRoutes = require("./routes/SessionRoutes");
const recipeRoutes = require("./routes/RecipeRoutes")
const userVotedRoutes = require("./routes/UserVotedRoutes")
const commentRoutes = require("./routes/CommentRoutes")
const markerRoutes = require("./routes/MarkerRoutes");



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
  app.use(express.static("server/public"));
  app.use(bodyParser.json());
  app.use(userRoutes);
  app.use(sessionRoutes);
  app.use(recipeRoutes);
  app.use(userVotedRoutes);
  app.use(commentRoutes);
  app.use(markerRoutes);

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  });

  //heroku injects the port number into the PORT env value
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Listening on port:${port}`);
  });
}