"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mesas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      numero: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },

      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      estado: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "libre",
      },

      mozo_id: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "usuarios",
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
    await queryInterface.dropTable("mesas");
  },
};