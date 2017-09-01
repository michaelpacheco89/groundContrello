//
// var db = require("../models");
//
// module.exports = function(app) {
//
// // // find all the user's subtasks
//   app.get("/api/subtasks", function(req, res) {
//       db.SubTask.findAll({}).then(function(dbSubTasks) {
//       res.json(dbSubTasks);
//     });
//   });
// // find one team by id
//   app.get("/api/subtasks/:id", function(req, res) {
//     db.SubTask.findOne({
//       where: {
//         id: req.params.id
//       },
//       include: [db.User]
//     }).then(function(dbSubTasks) {
//       res.json(dbSubTasks);
//     });
//   });
//
//   // POST route for saving a new team
//   app.post("/api/subtasks", function(req, res) {
//     db.SubTask.create(req.body).then(function(dbSubTasks) {
//       res.json(dbSubTasks);
//     });
//   });
//
//   // DELETE route for deleting subtasks
//   app.delete("/api/subtasks/:id", function(req, res) {
//     db.SubTask.destroy({
//       where: {
//         id: req.params.id
//       }
//     }).then(function(dbSubTasks) {
//       res.json(dbSubTasks);
//     });
//   });
//
//   // PUT route for updating subtasks
//   app.put("/api/subtasks", function(req, res) {
//     db.SubTask.update(
//       req.body,
//       {
//         where: {
//           id: req.body.id
//         }
//       }).then(function(dbSubTasks) {
//         res.json(dbSubTasks);
//       });
//   });
// };
