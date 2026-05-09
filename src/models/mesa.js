"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Mesa extends Model {
    static associate(models) {

      // =========================
      // Mesa -> Mozo
      // =========================
      Mesa.belongsTo(models.Usuario, {
        foreignKey: "mozoId",
        as: "mozo",
      });

      // =========================
      // Mesa -> Pedidos
      // =========================
      Mesa.hasMany(models.Pedido, {
        foreignKey: "mesaId",
        as: "pedidos",
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
        allowNull: false,
        defaultValue: "libre",
      },

      mozoId: {
        type: DataTypes.INTEGER,
        field: "mozo_id",
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Mesa",
      tableName: "mesas",
      timestamps: true,
      underscored: true,
    }
  );

  return Mesa;
};