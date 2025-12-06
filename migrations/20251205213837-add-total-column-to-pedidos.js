"use strict";
module.exports = {
async up (queryInterface, Sequelize) {
    try {
      // Intentamos agregar la columna
      await queryInterface.addColumn('Pedidos', 'total', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      });
    } catch (error) {
      // Si falla (porque ya existe), imprimimos un aviso y NO rompemos el proceso
      console.log("⚠️ La columna 'total' ya existía. Saltando paso...");
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Pedidos", "total");
  },
};
