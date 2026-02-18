'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Platos');
    if (tableInfo.stockInicial) {
      await queryInterface.removeColumn('Platos', 'stockInicial');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Platos');
    if (!tableInfo.stockInicial) {
      await queryInterface.addColumn('Platos', 'stockInicial', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
  }
};
