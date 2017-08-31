
var db = require("../models");

module.exports = function(app) {
  app.get("/api/tasks", function(req, res) {
    var query = {};
    if (req.query.User_id) {
      query.UserId = req.query.User_id;
    }

    db.Task.findAll({
      where: query,
      include: [db.User]
    }).then(function(dbTask) {
      res.json(dbTask);
    });
  });


  app.get("/api/tasks/:id", function(req, res) {
    db.Task.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function(dbTask) {
      res.json(dbTask);
    });
  });

  // POST route for saving a new post
  app.post("/api/tasks", function(req, res) {
    db.Task.create(req.body).then(function(dbTask) {
      res.json(dbTask);
    });
  });

  // DELETE route for deleting tasks
  app.delete("/api/tasks/:id", function(req, res) {
    db.Task.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbTask) {
      res.json(dbTask);
    });
  });

  // PUT route for updating tasks
  app.put("/api/tasks", function(req, res) {
    db.Task.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbTask) {
        res.json(dbTask);
      });
  });
};
