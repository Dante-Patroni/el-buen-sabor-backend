"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Eliminar FK de PlatoId si existe
    try {
      await queryInterface.removeConstraint("Pedidos", "pedidos_ibfk_1");
    } catch (e) {
      console.log("⚠️ No se encontró la FK pedidos_ibfk_1, saltando...");
    }

    // 2. Borrar columnas
    await queryInterface.removeColumn("Pedidos", "PlatoId");
    await queryInterface.removeColumn("Pedidos", "total");
    await queryInterface.removeColumn("Pedidos", "fecha");
  },

  async down(queryInterface, Sequelize) {
    // Restaurar columnas para rollback
    await queryInterface.addColumn("Pedidos", "PlatoId", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("Pedidos", "total", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn("Pedidos", "fecha", {
      type: Sequelize.DATE,
    });

    // Restaurar FK
    await queryInterface.addConstraint("Pedidos", {
      type: "foreign key",
      name: "pedidos_ibfk_1",
      fields: ["PlatoId"],
      references: {
        table: "platos",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });
  },
};
