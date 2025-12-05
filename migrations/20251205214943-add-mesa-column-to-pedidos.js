"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    // Intentamos agregar la columna. Usamos try/catch por si ya existe.
    try {
      await queryInterface.addColumn("Pedidos", "mesa", {
        type: Sequelize.STRING,
        allowNull: true, // Ponemos true para evitar líos con datos viejos
      });
    } catch (e) {
      console.log("La columna 'mesa' ya existía, seguimos.");
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Pedidos", "mesa");
  },
};
