
var db = require("../models");

module.exports = function(app) {

// // find all the user's teams
//   app.get("/api/teams", function(req, res) {
//       db.Team.findAll({
//       include: [db.User],
//       where:{
//
//       }
//     }).then(function(dbTeams) {
//       res.json(dbTeams);
//     });
//   });
// find one team by id
  app.get("/api/teams/:id", function(req, res) {
    db.Team.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function(dbTeams) {
      res.json(dbTeams);
    });
  });

  // POST route for saving a new team
  app.post("/api/teams", function(req, res) {
    db.Team.create(req.body).then(function(dbTeams) {
      res.json(dbTeams);
    });
  });

  // DELETE route for deleting teams
  app.delete("/api/teams/:id", function(req, res) {
    db.Team.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbTeams) {
      res.json(dbTeams);
    });
  });

  // PUT route for updating teams
  app.put("/api/teams", function(req, res) {
    db.Team.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbTeams) {
        res.json(dbTeams);
      });
  });
};
