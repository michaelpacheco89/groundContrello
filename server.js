var express = require("express");
var bodyParser = require("body-parser");
var socket = require("socket.io");
var cookieParser = require('cookie-parser');
// var methodOverride = require('method-override');
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up server for sockets
var server = require('http').Server(app);
var io = socket(server);

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
// app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/task-api-routes.js")(app);
require("./routes/user-api-routes.js")(app);
require("./routes/list-api-routes.js")(app);
require("./routes/boards-api-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
    /*  app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
      });*/
    server.listen(PORT, function() {
        console.log('Server listening on PORT: ', PORT);
    });
});

//{ force: true }

// Sockets for REAL TIME ERRTHANG
// ================================
io.on("connection", function(socket) {
  // console.log("made socket connection", socket.id);
  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });
  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });
  // real time for tasks and lists
  socket.on("list", function(data){
    console.log(data);
    io.sockets.emit("list", data);
  });
  socket.on("task", function(data){
    console.log(data);
    io.sockets.emit("task", data);
  });
});
