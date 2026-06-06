"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rubros", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      denominacion: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      padre_id: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "rubros",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",

        name: "fk_rubros_padre_id",
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
    await queryInterface.dropTable("rubros");
  },
};