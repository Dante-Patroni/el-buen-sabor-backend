'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Obtenemos información de la tabla actual
    const tableInfo = await queryInterface.describeTable('Platos');

    // 2. Verificamos columna por columna antes de crearla
    
    // --- COLUMNA DESCRIPCION ---
    if (!tableInfo.descripcion) {
      await queryInterface.addColumn('Platos', 'descripcion', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // --- COLUMNA ES MENU DEL DIA ---
    if (!tableInfo.esMenuDelDia) {
      await queryInterface.addColumn('Platos', 'esMenuDelDia', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
    }

    // --- COLUMNA RUBRO ID ---
    if (!tableInfo.rubroId) {
      await queryInterface.addColumn('Platos', 'rubroId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Rubros',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  },

  async down (queryInterface, Sequelize) {
    // En el revert, también verificamos para evitar errores
    const tableInfo = await queryInterface.describeTable('Platos');

    if (tableInfo.rubroId) await queryInterface.removeColumn('Platos', 'rubroId');
    if (tableInfo.esMenuDelDia) await queryInterface.removeColumn('Platos', 'esMenuDelDia');
    if (tableInfo.descripcion) await queryInterface.removeColumn('Platos', 'descripcion');
  }
};