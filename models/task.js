module.exports = function(sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        }
    });
/*//link TASK to USER (TASK BELONGS TO USER)
    Task.associate = function(models) {
        Task.belongsTo(models.List, {
            foreignKey: {
                allowNull: false
            }
        });
    };*/

// //link TASK to LIST (TASK HAS MANY LISTs)
//     Task.associate = function(models) {
//         Task.hasMany(models.Subtask, {
//             onDelete: "cascade"
//         });
//     };

    return Task;
};