'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pedido.init({
    cliente: DataTypes.STRING,
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_preparacion', 'rechazado', 'entregado'),
      defaultValue: 'pendiente',
      validate: {
        isIn: [['pendiente', 'en_preparacion', 'rechazado', 'entregado']] // Validación extra de seguridad
      }
    },
    fecha: DataTypes.DATE,
    PlatoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pedido',
  });
  return Pedido;
};