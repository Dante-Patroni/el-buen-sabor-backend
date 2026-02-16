"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Plato extends Model {
    static associate(models) {
      // Un plato puede aparecer en muchos pedidos (vía DetallePedido)
      Plato.hasMany(models.DetallePedido, { foreignKey: "PlatoId" });

      // Rubro
      Plato.belongsTo(models.Rubro, {
        foreignKey: "rubroId",
        as: "rubro",
      });
    }
  }

  Plato.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },

      // ===== STOCK OPERATIVO =====

      stockActual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      esIlimitado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      // ===== VISIBILIDAD / CARTA =====

      esMenuDelDia: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      imagenPath: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      rubroId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Plato",
      tableName: "platos",
      timestamps: true, // te sirve para auditoría de stock
    }
  );

  return Plato;
};
