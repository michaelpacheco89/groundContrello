module.exports = function(sequelize, DataTypes) {

//CREATE TASK ONLY IF A BODY IS PROVIDED
    var Task = sequelize.define("Task", {
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        }
    });

//link TASK to USER (TASK BELONGS TO USER)
    Task.associate = function(models) {
        Task.belongsTo(models.List, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Task;
};
