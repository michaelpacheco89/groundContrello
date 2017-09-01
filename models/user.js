module.exports = function(sequelize, DataTypes) {
    //CREATE USER ONLY IF NAME IS NOT EMAIL && ALL FIELDS FILLED
    var User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    //LINK USER TO LIST (USER HAS MANY LISTs)
    User.associate = function(models) {
        User.hasMany(models.List, {
            onDelete: "cascade"
        });
    };

    return User;

};