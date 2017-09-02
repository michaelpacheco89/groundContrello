module.exports = function(sequelize, DataTypes) {
    var Board = sequelize.define("Board", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    const UserTeam = sequelize.define('UserTeam', {
        teamName: DataTypes.STRING
    })

    Board.associate = function(models) {
        Board.hasMany(models.List, {
            onDelete: "cascade"
        });
        Board.belongsTo(models.User, {
            foreignKey: {
                name: "OwnerId"
            }
        });
        Board.belongsToMany(models.User, {
            through: UserTeam
        });
    };

    return Board;
};