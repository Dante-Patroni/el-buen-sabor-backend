"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usuarios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      apellido: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      legajo: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      rol: {
        type: Sequelize.ENUM(
          "admin",
          "mozo",
          "cocinero",
          "cajero"
        ),
        defaultValue: "mozo",
      },

      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("usuarios");
  },
};