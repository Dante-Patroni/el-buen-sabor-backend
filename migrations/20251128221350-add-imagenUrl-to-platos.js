"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregamos la columna 'imagenPath' a la tabla 'Platos'
    await queryInterface.addColumn("Platos", "imagenPath", {
      type: Sequelize.STRING,
      allowNull: true, // Puede ser nulo al principio
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    // Si deshacemos, borramos la columna
    await queryInterface.removeColumn("Platos", "imagenPath");
  },
};
