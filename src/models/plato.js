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
      Plato.hasMany(models.Pedido, { foreignKey: 'PlatoId' });
    }
  }
  Plato.init(
    {
      nombre: DataTypes.STRING,
      precio: DataTypes.FLOAT,
      ingredientePrincipal: DataTypes.STRING,
      imagenPath: {
        type: DataTypes.STRING,
        allowNull: true 
      }
    },
    {
      sequelize,
      modelName: "Plato",
    },
  );
  return Plato;
};
