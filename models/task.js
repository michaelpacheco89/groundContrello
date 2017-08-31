module.exports = function(sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        }
    });
//link TASK to USER (TASK BELONGS TO USER)
    Task.associate = function(models) {
        Task.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

//link TASK to LIST (TASK HAS MANY LISTs)
    Task.associate = function(models) {
        Task.hasMany(models.List, {
            onDelete: "cascade"
        });
    };

    return Task;
};