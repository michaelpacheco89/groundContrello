var express = require("express");
var bodyParser = require("body-parser");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up server for sockets
var ioProm = require('express-socket.io');
var server = ioProm.init(app);

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
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
db.sequelize.sync({force: true}).then(function() {
    /*  app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
      });*/
    server.listen(PORT, function() {
        console.log('Server listening on PORT: ', PORT);
    });
});

//{ force: true }
