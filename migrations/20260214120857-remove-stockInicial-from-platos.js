'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Platos', 'stockInicial');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Platos', 'stockInicial', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
