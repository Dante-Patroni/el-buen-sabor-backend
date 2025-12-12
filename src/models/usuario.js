"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Un Mozo puede tener MUCHAS mesas asignadas a la vez
      // Esto permite hacer: usuario.getMesas()
      Usuario.hasMany(models.Mesa, { 
        foreignKey: 'mozoId', // Coincide con el campo en Mesa
        as: 'mesasAsignadas' 
      });
    }
  }

  Usuario.init(
    {
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      legajo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true, // No puede haber dos empleados con el mismo legajo
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rol: {
        type: DataTypes.ENUM('admin', 'mozo', 'cocinero', 'cajero'),
        defaultValue: 'mozo',
      },
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "usuarios", // Coincide con tu tabla SQL
      timestamps: false, // O true si decides agregar fecha_creacion en el modelo
      underscored: true,
    }
  );
  return Usuario;
};