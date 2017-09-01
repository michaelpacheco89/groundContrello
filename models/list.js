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

    List.associate = function(models) {
        List.belongsTo(models.Board, {
            foreignKey: {
                allowNull: false
            }
        });

        List.hasMany(models.Task, {
            onDelete: "cascade"
        });
    };
    return List;
};
