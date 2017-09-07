var db = require("../models");

module.exports = function(app) {

    // find all the user's boards
    app.get("/api/boards", function(req, res) {
        //console.log(req.query.User_id)
        var query = {};
        if (req.query.User_id) {
            query.UserId = req.query.User_id;
        }/* else if (req.query.BoardId) {
            query.BoardId = req.query.BoardId;
        }*/

        console.log(query)

        db.Board.findAll({
            include: [{
                    model: db.User,
                    as: "Owner"
                }, {
                    model: db.User,
                    as: "Users"
                },
                db.List
            ],
            where: query
        }).then(function(dbBoards) {
            res.json(dbBoards);
        });
    });


    app.get("/api/boards/:id", function(req, res) {
        db.Board.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: db.User,
                as: "Owner"
            }, {
                model: db.User,
                as: "Users"
            }, db.List]
        }).then(function(dbBoards) {
            res.json(dbBoards);
        });
    });

    //get route for adding new users to a boards
    app.get("/api/boards/:id/users/:userId", function(req, res) {
        db.Board.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(dbBoards) {
            console.log(dbBoards)
            dbBoards.addUsers(req.params.userId, { through: { teamName: dbBoards.name } });
            res.json(dbBoards);
        }).catch(function(error) {
            console.log(error);
        });

    });

    // POST route for creating a new board
    // EDIT HERE
    app.post("/api/boards", function(req, res) {
        db.Board.create(req.body).then(function(dbBoards) {
            dbBoards.setUsers([req.body.OwnerId], { through: { teamName: req.body.name } });
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
            req.body, {
                where: {
                    id: req.body.id
                }
            }).then(function(dbBoards) {
            res.json(dbBoards);
        });
    });
};