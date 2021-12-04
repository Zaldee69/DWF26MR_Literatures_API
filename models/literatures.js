"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class literatures extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      literatures.belongsTo(models.users, {
        as: "users",
        foreignKey: {
          name: "user",
        },
      });
    }
  }
  literatures.init(
    {
      title: DataTypes.STRING,
      publication_date: DataTypes.STRING,
      pages: DataTypes.INTEGER,
      isbn: DataTypes.STRING,
      author: DataTypes.STRING,
      attachment: DataTypes.STRING,
      status: DataTypes.STRING,
      user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "literatures",
    }
  );
  return literatures;
};
