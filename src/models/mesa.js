"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Mesa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // La Mesa pertenece a un Usuario (Mozo)
      Mesa.belongsTo(models.Usuario, {
        foreignKey: 'mozoId',
        as: 'mozo' // Así podremos hacer mesa.mozo.nombre
      });
    }
  }

  Mesa.init(
    {
      numero: {
        type: DataTypes.STRING(10),
        allowNull: true, // Puede ser null si usas solo ID
      },
      // Definimos los campos igual que en tu phpMyAdmin
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      estado: {
        type: DataTypes.STRING(20), // 'libre', 'ocupada'
        defaultValue: "libre",
      },
      // 👇 MAPEO: JS (totalActual) <--> DB (total_actual)
      totalActual: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        field: "total_actual",
      },
      // 👇 MAPEO: JS (mozoId) <--> DB (mozo_id)
      mozoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "mozo_id",
      },
    },
    {
      sequelize,
      modelName: "Mesa",
      tableName: "mesas", // El nombre exacto de la tabla en MySQL
      timestamps: false,  // 🛑 IMPORTANTE: Desactivamos esto porque la tabla SQL no tiene fechas automáticas
      underscored: true,
    }
  );
  return Mesa;
};