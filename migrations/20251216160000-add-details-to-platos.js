'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Agregar columna descripcion
    await queryInterface.addColumn('Platos', 'descripcion', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // 2. Agregar columna esMenuDelDia
    await queryInterface.addColumn('Platos', 'esMenuDelDia', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    // 3. Agregar columna rubroId (Clave Foránea)
    await queryInterface.addColumn('Platos', 'rubroId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Puede ser null temporalmente si hay platos viejos
      references: {
        model: 'Rubros', // Nombre de la tabla padre
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Platos', 'rubroId');
    await queryInterface.removeColumn('Platos', 'esMenuDelDia');
    await queryInterface.removeColumn('Platos', 'descripcion');
  }
};