"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("roles");
  },
};