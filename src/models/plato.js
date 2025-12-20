"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Plato extends Model {
    static associate(models) {
      Plato.hasMany(models.Pedido, { foreignKey: 'PlatoId' });
      // Vinculamos con Rubro
      Plato.belongsTo(models.Rubro, { foreignKey: 'rubroId', as: 'rubro' }); 
    }
  }
  Plato.init(
    {
      nombre: DataTypes.STRING,
      precio: DataTypes.FLOAT,
      
      // 👇 NUEVO: Agregamos esto para que el Backend lea el stock
      stockActual: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },

      // 👇 Para mostrar "Medallón de carne con lechuga..." en la carta
      descripcion: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      // 👇 El interruptor para el "Menú del Día"
      esMenuDelDia: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      imagenPath: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      rubroId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Plato",
    },
  );
  return Plato;
};