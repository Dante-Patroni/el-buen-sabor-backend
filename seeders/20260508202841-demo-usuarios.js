"use strict";

const bcrypt = require("bcryptjs");

const LEGAJOS_DEMO = ["ADMIN001", "MOZO001", "COC001"];

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  /**
   * @description Crea o actualiza usuarios demo para probar roles del sistema.
   * @param {import("sequelize").QueryInterface} queryInterface - Interfaz de Sequelize para operar la base.
   * @returns {Promise<void>} Promesa resuelta al finalizar la carga de usuarios demo.
   */
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash("admin123", 10);

    await queryInterface.bulkInsert("usuarios", [
      {
        nombre: "Dante",
        apellido: "Admin",
        legajo: "ADMIN001",
        password: passwordHash,
        rol: "admin",
        activo: true,
      },

      {
        nombre: "Juan",
        apellido: "Mozo",
        legajo: "MOZO001",
        password: passwordHash,
        rol: "mozo",
        activo: true,
      },

      {
        nombre: "Carlos",
        apellido: "Cocinero",
        legajo: "COC001",
        password: passwordHash,
        rol: "cocinero",
        activo: true,
      },
    ], {
      updateOnDuplicate: ["nombre", "apellido", "password", "rol", "activo"],
    });
  },

  /**
   * @description Elimina solo los usuarios demo creados por este seed.
   * @param {import("sequelize").QueryInterface} queryInterface - Interfaz de Sequelize para operar la base.
   * @returns {Promise<void>} Promesa resuelta al finalizar la eliminacion de usuarios demo.
   */
  async down(queryInterface) {
    await queryInterface.bulkDelete("usuarios", {
      legajo: LEGAJOS_DEMO,
    });
  },
};
