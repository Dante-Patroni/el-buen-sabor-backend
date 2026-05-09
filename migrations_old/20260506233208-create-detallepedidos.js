"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detallepedidos", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      subtotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      aclaracion: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },

      pedidoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "pedidos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      platoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "platos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("detallepedidos");
  },
};