'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('platos', 'stockInicial');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('platos', 'stockInicial', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
