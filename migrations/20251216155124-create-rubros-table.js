'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    // 1. CREAR LA TABLA RUBROS
    await queryInterface.createTable('Rubros', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      denominacion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // Puntero al Padre (Recursividad para sub-rubros)
      // Si es NULL = Rubro Padre (Cocina)
      // Si tiene ID = Rubro Hijo (Hamburguesas)
      padreId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Rubros',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

    // 2. CONECTAR PLATOS CON RUBROS
    // Agregamos la columna 'rubroId' a la tabla 'Platos'
    await queryInterface.addColumn('Platos', 'rubroId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Rubros',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    // Si deshacemos, borramos primero la columna y luego la tabla
    await queryInterface.removeColumn('Platos', 'rubroId');
    await queryInterface.dropTable('Rubros');
  }
};