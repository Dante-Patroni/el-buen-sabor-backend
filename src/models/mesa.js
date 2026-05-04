"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Mesa extends Model {
    static associate(models) {
      // La Mesa pertenece a un Usuario (Mozo)
      Mesa.belongsTo(models.Usuario, {
        foreignKey: 'mozoId',
        as: 'mozo'
      });
    }
  }

  Mesa.init(
    {
      numero: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      estado: {
        type: DataTypes.STRING(20),
        defaultValue: "libre",
      },
      // ❌ ELIMINADO: totalActual (calculado dinámicamente)
      mozoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "mozo_id",
      },
    },
    {
      sequelize,
      modelName: "Mesa",
      tableName: "mesas",
      timestamps: false,
      underscored: true,
    }
  );

  return Mesa;
};