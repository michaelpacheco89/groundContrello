module.exports = function(sequelize, DataTypes) {

//CREATE LIST ONLY IF TITLE IS PROVIDED
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
//link List to TASK (List HAS MANY TASKs)
    List.associate = function(models) {
        List.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
        
        List.hasMany(models.Task, {
            onDelete: "cascade"
        });
    };

    return List;
};