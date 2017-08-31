module.exports = function(sequelize, DataTypes) {
  var Board = sequelize.define("Board", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Board.associate = function(models) {
      Board.hasMany(models.List, {
        onDelete: "cascade"
      });
      Board.belongsTo(models.User, {
        allowNull:true,
      });
      Board.belongsTo(models.Team,{
        allowNull:true,
      });
  };

  return Board;
};
