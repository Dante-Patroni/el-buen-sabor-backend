'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Obtenemos información de la tabla actual
    const tableInfo = await queryInterface.describeTable('platos');

    // 2. Verificamos columna por columna antes de crearla
    
    // --- COLUMNA DESCRIPCION ---
    if (!tableInfo.descripcion) {
      await queryInterface.addColumn('platos', 'descripcion', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // --- COLUMNA ES MENU DEL DIA ---
    if (!tableInfo.esMenuDelDia) {
      await queryInterface.addColumn('platos', 'esMenuDelDia', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
    }

    // --- COLUMNA RUBRO ID ---
    if (!tableInfo.rubroId) {
      await queryInterface.addColumn('platos', 'rubroId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'rubros',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  },

  async down (queryInterface, Sequelize) {
    // En el revert, también verificamos para evitar errores
    const tableInfo = await queryInterface.describeTable('platos');

    if (tableInfo.rubroId) await queryInterface.removeColumn('platos', 'rubroId');
    if (tableInfo.esMenuDelDia) await queryInterface.removeColumn('platos', 'esMenuDelDia');
    if (tableInfo.descripcion) await queryInterface.removeColumn('platos', 'descripcion');
  }
};