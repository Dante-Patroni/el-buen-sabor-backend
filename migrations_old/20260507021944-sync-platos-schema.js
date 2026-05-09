"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn("platos", "esActivo", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn("platos", "stockActual", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn("platos", "esIlimitado", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

  },

  async down(queryInterface) {

    await queryInterface.removeColumn("platos", "esActivo");

    await queryInterface.removeColumn("platos", "stockActual");

    await queryInterface.removeColumn("platos", "esIlimitado");
  },
};