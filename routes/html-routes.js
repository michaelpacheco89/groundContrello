var path = require("path");

module.exports = function(app) {

  // home route loads home.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  // signup route loads signup.html
  app.get("/signup", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  // tasks route loads tasks.html
  app.get("/tasks", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/tasks.html"));
  });

/*  // authors route loads author-manager.html
  app.get("/authors", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/author-manager.html"));
  });*/

};
