// src/models/rubro.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rubro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1. Relación Recursiva (Jerarquía Padre - Hijo)
      // Un rubro "tiene muchos" subrubros
      Rubro.hasMany(models.Rubro, {
        as: 'subrubros', // Alias para usar: rubro.getSubrubros()
        foreignKey: 'padreId'
      });

      // Un rubro "pertenece a" un rubro Padre
      Rubro.belongsTo(models.Rubro, {
        as: 'padre', // Alias para usar: rubro.getPadre()
        foreignKey: 'padreId'
      });

      // 2. Relación con Platos (Un Rubro tiene muchos Platos)
      // Nota: Asegúrate de que el modelo se llame 'Plato' en models
      Rubro.hasMany(models.Plato, {
        foreignKey: 'rubroId',
        as: 'platos'
      });
    }
  }

  Rubro.init({
    denominacion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre del rubro es obligatorio" }
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    // El puntero al Padre (Recursividad)
    padreId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Puede ser NULL si es Raíz (ej: Cocina)
    }
  }, {
    sequelize,
    modelName: 'Rubro',
    // Opcional: si quieres asegurar el nombre de la tabla en plural
    // tableName: 'Rubros', 
  });

  return Rubro;
};