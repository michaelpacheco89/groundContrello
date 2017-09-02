var db = require("../models");
var bcrypt = require("bcryptjs");

module.exports = function(app) {


    app.get("/api/users", function(req, res) {
        //db.List.include([db.Task])
        db.User.findAll({
            include: {
                model: db.Board,
              include: {
                model: db.List,
                include:[db.Task]
              }
            }
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    // to find a user by id, or to check if username exists for signup
    app.get("/api/users/:id", function(req, res) {
        var query = {};
        if (req.query.name || req.query.email) {
            query = req.query;
        } else {
            query.id = req.params.id;
        }
        db.User.findOne({
            where: query,
            include: {
                model: db.Board,
              include: {
                model: db.List,
                include:[db.Task]
              }
            }
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    // to validate password on user login
    app.post("/api/users/login", function(req, res) {
        var query = req.query;
        db.User.findOne({
            where: query
        }).then(function(data) {
            if (data == null) {
                res.json({ username: true });
            } else {
                res.json({
                    password: bcrypt.compareSync(req.body.password, data.password),
                    id: data.id
                });
            }
        });
    });

    // to create new user
    app.post("/api/users", function(req, res) {
        db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    // to delete user by id
    app.delete("/api/users/:id", function(req, res) {
        db.User.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });
};
