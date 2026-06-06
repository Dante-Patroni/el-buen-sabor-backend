"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("permisos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      codigo: {
        type: Sequelize.STRING(100),
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
    await queryInterface.dropTable("permisos");
  },
};