"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

  class Rubro extends Model {

    static associate(models) {

      // =========================
      // Rubro -> Subrubros
      // =========================
      Rubro.hasMany(models.Rubro, {
        as: "subrubros",
        foreignKey: "padreId",
      });

      // =========================
      // Rubro -> Padre
      // =========================
      Rubro.belongsTo(models.Rubro, {
          as: "padre",
          foreignKey: "padreId",
});

      // =========================
      // Rubro -> Platos
      // =========================
      Rubro.hasMany(models.Plato, {
        foreignKey: "rubroId",
        as: "platos",
      });
    }
  }

  Rubro.init(
    {
      denominacion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El nombre del rubro es obligatorio",
          },
        },
      },

      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      padreId: {
        type: DataTypes.INTEGER,
        field: "padre_id",
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Rubro",
      tableName: "rubros",
      timestamps: true,
      underscored: true,
    }
  );

  return Rubro;
};