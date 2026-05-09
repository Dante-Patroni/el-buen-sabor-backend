"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Plato extends Model {
    static associate(models) {
      // Un plato puede aparecer en muchos pedidos (vía DetallePedido)
      Plato.hasMany(models.DetallePedido, {
        foreignKey: "plato_id",
        as: "detallesPedido"
      });

      // Rubro
      Plato.belongsTo(models.Rubro, {
        foreignKey: "rubro_id",
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


      esActivo: {
        type: DataTypes.BOOLEAN,
        field: "es_activo",
        allowNull: false,
        defaultValue: true,
      },

      // ===== STOCK OPERATIVO =====

      stockActual: {
        type: DataTypes.INTEGER,
        field: "stock_actual",
        allowNull: false,
        defaultValue: 0,
      },

      esIlimitado: {
        type: DataTypes.BOOLEAN,
        field: "es_ilimitado",
        allowNull: false,
        defaultValue: false,
      },

      // ===== VISIBILIDAD / CARTA =====

      esMenuDelDia: {
        type: DataTypes.BOOLEAN,
        field: "es_menu_del_dia",
        defaultValue: false,
      },

      imagenPath: {
        type: DataTypes.STRING,
        field: "imagen_path",
        allowNull: true,
      },

      rubroId: {
        type: DataTypes.INTEGER,
        field: "rubro_id",
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "Plato",
      tableName: "platos",
      timestamps: true, // te sirve para auditoría de stock
      underscored: true,
    }
  );

  return Plato;
};
