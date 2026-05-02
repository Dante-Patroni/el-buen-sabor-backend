"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
  static associate(models) {
       // Esto permite: Pedido.findAll({ include: [models.DetallePedido] })
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
    },
  );
  return Pedido;
};
