"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      collection.belongsTo(
        models.users,
        {
          as: "users",
          foreignKey: {
            name: "user",
          },
        },
        collection.belongsTo(models.literatures, {
          as: "literatures",
          foreignKey: {
            name: "literature",
          },
        })
      );
    }
  }
  collection.init(
    {
      user: DataTypes.INTEGER,
      literature: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "collection",
    }
  );
  return collection;
};
