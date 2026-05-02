"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar columna total_actual de la tabla mesas
    await queryInterface.removeColumn("mesas", "total_actual");
  },

  async down(queryInterface, Sequelize) {
    // Restaurar columna para rollback
    await queryInterface.addColumn("mesas", "total_actual", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
    });
  },
};
