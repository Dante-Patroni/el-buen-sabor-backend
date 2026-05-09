"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

  class DetallePedido extends Model {

    static associate(models) {

      // =========================
      // Detalle -> Pedido
      // =========================
      DetallePedido.belongsTo(models.Pedido, {
        foreignKey: "pedidoId",
        as: "pedido",
      });

      // =========================
      // Detalle -> Plato
      // =========================
      DetallePedido.belongsTo(models.Plato, {
        foreignKey: "platoId",
        as: "plato",
      });
    }
  }

  DetallePedido.init(
    {

      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        field: "precio_unitario",
        allowNull: false,
      },

      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "precioUnitario × cantidad",
      },

      aclaracion: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },

      pedidoId: {
        type: DataTypes.INTEGER,
        field: "pedido_id",
        allowNull: false,
      },

      platoId: {
        type: DataTypes.INTEGER,
        field: "plato_id",
        allowNull: false,
      },

    },
    {
      sequelize,
      modelName: "DetallePedido",
      tableName: "detallepedidos",
      timestamps: true,
      underscored: true,
    }
  );

  return DetallePedido;
};