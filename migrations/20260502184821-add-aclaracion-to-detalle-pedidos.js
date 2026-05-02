"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("DetallePedidos", "aclaracion", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ""
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("DetallePedidos", "aclaracion");
  }
};