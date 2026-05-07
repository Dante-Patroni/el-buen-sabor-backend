"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    static associate(models) {
      // ✅ Relación con DetallePedido (1:N)
      Pedido.hasMany(models.DetallePedido);
      
    }
  }

  Pedido.init(
    {
      cliente: DataTypes.STRING,
      mesa: DataTypes.STRING,
      estado: {
        type: DataTypes.ENUM(
          "pendiente",
          "en_preparacion",
          "rechazado",
          "entregado",
          "pagado",
          "cancelado"
        ),
        defaultValue: "pendiente",
      },
    },
    {
       sequelize,
    modelName: "Pedido",
    tableName: "pedidos",
    freezeTableName: true,
    }
  );

  return Pedido;
};