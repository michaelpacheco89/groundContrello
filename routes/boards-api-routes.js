
var db = require("../models");

module.exports = function(app) {

// find all the user's boards
  app.get("/api/boards", function(req, res) {
      db.Board.findAll({
      include:[db.User, db.List],
      where: req.query
    }).then(function(dbBoards) {
      res.json(dbBoards);
    });
  });


  app.get("/api/boards/:id", function(req, res) {
    db.Board.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User, db.List]
    }).then(function(dbBoards) {
      res.json(dbBoards);
    });
  });

  // POST route for saving a new post
  app.post("/api/boards", function(req, res) {
    db.Board.create(req.body).then(function(dbBoards) {
      res.json(dbBoards);
    });
  });

  // DELETE route for deleting boards
  app.delete("/api/boards/:id", function(req, res) {
    db.Board.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbBoards) {
      res.json(dbBoards);
    });
  });

  // PUT route for updating boards
  app.put("/api/boards", function(req, res) {
    db.Board.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbBoards) {
        res.json(dbBoards);
      });
  });
};
