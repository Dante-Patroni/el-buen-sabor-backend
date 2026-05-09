"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detallepedidos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      precio_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      aclaracion: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },

      pedido_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "pedidos",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      plato_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "platos",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
    await queryInterface.dropTable("detallepedidos");
  },
};