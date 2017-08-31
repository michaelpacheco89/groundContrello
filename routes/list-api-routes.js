
var db = require("../models");

module.exports = function(app) {

//GET ALL LISTS || GET ALL LISTS FROM SPECIFIC USER
  app.get("/api/lists", function(req, res) {
    var query = {};
    if (req.query.User_id) {
      query.UserId = req.query.User_id;
    }

    db.List.findAll({
      where: query,
      include: [db.User,db.Task]
    }).then(function(dbList) {
      res.json(dbList);
    });
  });

//GET SPECIFIC LIST BY LIST ID

  app.get("/api/lists/:id", function(req, res) {
    db.List.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User,db.Task]
    }).then(function(dbList) {
      res.json(dbList);
    });
  });

  // POST route for saving a new post
  app.post("/api/lists", function(req, res) {
    db.List.create(req.body).then(function(dbList) {
      res.json(dbList);
    });
  });

  // DELETE route for deleting lists
  app.delete("/api/lists/:id", function(req, res) {
    db.List.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbList) {
      res.json(dbList);
    });
  });

  // PUT route for updating lists
  app.put("/api/lists", function(req, res) {
    db.List.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbList) {
        res.json(dbList);
      });
  });
};
