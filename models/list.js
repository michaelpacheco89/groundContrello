module.exports = function(sequelize, DataTypes) {
    var List = sequelize.define("List", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });
//link List to USER (List BELONGS TO USER)
    List.associate = function(models) {
        List.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

/*//link List to LIST (List HAS MANY LISTs)
    List.associate = function(models) {
        List.hasMany(models.Task, {
            onDelete: "cascade"
        });
    };*/

    return List;
};