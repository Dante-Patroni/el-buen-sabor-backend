"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Plato extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Plato.init(
    {
      nombre: DataTypes.STRING,
      precio: DataTypes.FLOAT,
      ingredientePrincipal: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Plato",
    },
  );
  return Plato;
};
