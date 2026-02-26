'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('usuarios');

    if (!tableInfo.activo) {
      await queryInterface.addColumn('usuarios', 'activo', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable('usuarios');

    if (tableInfo.activo) {
      await queryInterface.removeColumn('usuarios', 'activo');
    }
  },
};
