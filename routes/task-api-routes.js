var db = require("../models");

module.exports = function(app) {

    //GET ALL TASKS || GET ALL TASKS FROM SPECIFIC USER
    app.get("/api/tasks", function(req, res) {
        var query = {};
        if (req.query.User_id) {
            query.UserId = req.query.User_id;
        }

        //console.log("++++",query,"++++");

        db.Task.findAll({
            where: query,
            include: {
                model: db.List,
                include: [db.Board]
            }
        }).then(function(dbTask) {
            res.json(dbTask);
        });
    });

    //GET SPECIFIC TASK BY TASK IDs
    app.get("/api/tasks/:id", function(req, res) {
        db.Task.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: db.List,
                include: [db.Board]
            }
        }).then(function(dbTask) {
            res.json(dbTask);
        });
    });

    // POST ROUTE FOR CREATING NEW TASKs
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
            req.body, {
                where: {
                    id: req.body.id
                }
            }).then(function(dbTask) {
            res.json(dbTask);
        });
    });
};
