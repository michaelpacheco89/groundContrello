module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define("Team", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Team.associate = function(models) {
    Team.hasMany(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Team.hasMany(models.Board, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Team;
};
