
var db = require("../models");

module.exports = function(app) {

//GET ALL TASKS || GET ALL TASKS FROM SPECIFIC LIST
  app.get("/api/tasks", function(req, res) {
    var query = {};
    if (req.query.List_id) {
      query.ListId = req.query.List_id;
    }

    //console.log("++++",query,"++++");

    db.Task.findAll({
      where: query,
      include: {
        model: db.List,
        include: [db.User]
      }
    }).then(function(dbTask) {
      res.json(dbTask);
    });
  });

//GET SPECIFIC TASK BY TASK ID
  app.get("/api/tasks/:id", function(req, res) {
    db.Task.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: db.List,
        include: [db.User]
      }
    }).then(function(dbTask) {
      res.json(dbTask);
    });
  });

  // POST ROUTE FOR CREATING NEW TASK
  app.post("/api/tasks", function(req, res) {
    db.Task.create(req.body).then(function(dbTask) {
      res.json(dbTask);
    });
  });

  // DELETE A TASK BY ID
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
