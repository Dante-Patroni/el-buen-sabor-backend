"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {

    static associate(models) {

      // =========================
      // Pedido -> Detalles
      // =========================
      Pedido.hasMany(models.DetallePedido, {
        foreignKey: "pedidoId",
        as: "detalles",
      });

      // =========================
      // Pedido -> Mesa
      // =========================
      Pedido.belongsTo(models.Mesa, {
        foreignKey: "mesaId",
        as: "mesa",
      });

    }
  }

  Pedido.init(
    {
      cliente: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      estado: {
        type: DataTypes.ENUM(
          "pendiente",
          "en_preparacion",
          "listo",
          "entregado",
          "pagado",
          "cancelado"
        ),
        allowNull: false,
        defaultValue: "pendiente",
      },

      mesaId: {
        type: DataTypes.INTEGER,
        field: "mesa_id",
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Pedido",
      tableName: "pedidos",
      timestamps: true,
      underscored: true,
    }
  );

  return Pedido;
};