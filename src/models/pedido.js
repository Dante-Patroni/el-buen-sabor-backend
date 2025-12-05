"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    static associate(models) {
      // Definimos la relación: Un Pedido tiene muchos Mails (si aplica)
      // Ojo: En tu código actual quizás ya tengas esto o la relación con Plato
      // Mantén las asociaciones que ya tenías.
    }
  }
  Pedido.init(
    {
      cliente: DataTypes.STRING,
      mesa: DataTypes.STRING,
      fecha: DataTypes.DATE,

      total: {
        type: DataTypes.FLOAT, // O DECIMAL(10,2) para más precisión
        defaultValue: 0,
      },
      estado: {
        type: DataTypes.ENUM(
          "pendiente",
          "en_preparacion",
          "rechazado",
          "entregado",
        ),
        defaultValue: "pendiente",
      },
      // Asegúrate de que PlatoId esté definido si lo usas explícitamente,
      // aunque Sequelize suele manejar las FK automáticamente.
      PlatoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Pedido",
    },
  );
  return Pedido;
};
