var path = require("path");

module.exports = function(app) {

  // home route loads home.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/views/index.html"));
  });

  // signup route loads signup.html
  app.get("/signup", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/views/signup.html"));
  });

  // login route loads login.html
  app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/views/login.html"));
  });

  // board route loads a user's board page
  app.get("/board", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/views/board.html"));
  });

/*  // authors route loads author-manager.html
  app.get("/authors", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/author-manager.html"));
  });*/

};
