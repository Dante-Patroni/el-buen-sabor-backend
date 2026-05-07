'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('platos');
    if (tableInfo.stockInicial) {
      await queryInterface.removeColumn('platos', 'stockInicial');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('platos');
    if (!tableInfo.stockInicial) {
      await queryInterface.addColumn('platos', 'stockInicial', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
  }
};
