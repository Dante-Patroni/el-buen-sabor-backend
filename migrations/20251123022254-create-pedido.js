'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pedidos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cliente: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'en_preparacion', 'rechazado', 'entregado'),
        defaultValue: 'pendiente' // ¡Buena práctica! Siempre tener un valor por defecto
      },
      fecha: {
        type: Sequelize.DATE
      },
      PlatoId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pedidos');
  }
};