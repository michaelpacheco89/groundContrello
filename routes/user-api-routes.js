var db = require("../models");
var bcrypt = require("bcryptjs");

module.exports = function(app) {

    // to find a user by id, or to check if username exists for signup
    app.get("/api/users/:id", function(req, res) {
        var query = {};
        if (req.query.name) {
            query = req.query;
        } else {
            query.id = req.params.id;
        }
        db.User.findOne({
            where: query,
            include: [db.List]
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
                    password: compareSync(req.body.password, data.password),
                    id: data.id
                });
            }
        });
    });

    // to create new user
    app.post("/api/users", function(req, res) {
        db.User.create({
            name: req.body.name,
            password: hashSync(req.body.password)
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