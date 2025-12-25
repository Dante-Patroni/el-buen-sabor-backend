"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    static associate(models) {
      // Definimos que el Pedido "pertenece a" un Plato.
      // Esto permite hacer el 'include: [Plato]' en las consultas.
      Pedido.belongsTo(models.Plato, {
        foreignKey: 'PlatoId', // La columna que conecta
        // as: 'plato' // Opcional: si quisieras llamarlo de otra forma
      });

      // Esto permite: Pedido.findAll({ include: [models.DetallePedido] })
      Pedido.hasMany(models.DetallePedido);
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
          "pagado"
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
