module.exports = function(sequelize, DataTypes) {

//CREATE TASK ONLY IF A BODY IS PROVIDED
    var Task = sequelize.define("Task", {
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
              len: [1]
            }
        },
        index: DataTypes.INTEGER
    });

//link TASK to USER (TASK BELONGS TO USER)
    Task.associate = function(models) {
        Task.belongsTo(models.List, {
            foreignKey: {
                allowNull: false
            }
        });
        // Task.hasMany(models.SubTask, {
        //     foreignKey:{
        //       allowNull: false
        //     }
        // });
        Task.belongsToMany(models.User, {
            through: "taskTeams"/*,
            as:"taskUsers"*/
        });
    };

    return Task;
};
