"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mesas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
        defaultValue: "libre",
      },

      mozo_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("mesas");
  },
};