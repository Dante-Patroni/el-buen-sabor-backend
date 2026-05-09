"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pedidos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      cliente: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      estado: {
        type: Sequelize.ENUM(
          "pendiente",
          "en_preparacion",
          "listo",
          "entregado",
          "pagado",
          "cancelado"
        ),
        allowNull: false,
        defaultValue: "pendiente",
      },

      mesa_id: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "mesas",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("pedidos");
  },
};