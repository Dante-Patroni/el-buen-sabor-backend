'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Pedidos', 'total', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Pedidos', 'total');
  }
};