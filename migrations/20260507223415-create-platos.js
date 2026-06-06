"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("platos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      descripcion: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      es_activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      stock_actual: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      es_ilimitado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      es_menu_del_dia: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      imagen_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      rubro_id: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "rubros",
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
    await queryInterface.dropTable("platos");
  },
};