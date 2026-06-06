"use strict";

const bcrypt = require("bcryptjs");

const LEGAJOS_DEMO = ["SUPER001", "ADMIN001", "CAJ001", "COC001", "MOZO001"];

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  /**
   * @description Crea o actualiza usuarios demo para probar todos los roles del sistema.
   * rol_id: 1 = superadmin | 2 = admin | 3 = cajero | 4 = cocinero | 5 = mozo
   */
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash("admin123", 10);

    await queryInterface.bulkInsert(
      "usuarios",
      [
        {
          nombre: "Dante",
          apellido: "Superadmin",
          legajo: "SUPER001",
          password: passwordHash,
          rol_id: 1, // superadmin
          activo: true,
        },
        {
          nombre: "María",
          apellido: "Admin",
          legajo: "ADMIN001",
          password: passwordHash,
          rol_id: 2, // admin
          activo: true,
        },
        {
          nombre: "Lucas",
          apellido: "Cajero",
          legajo: "CAJ001",
          password: passwordHash,
          rol_id: 3, // cajero
          activo: true,
        },
        {
          nombre: "Carlos",
          apellido: "Cocinero",
          legajo: "COC001",
          password: passwordHash,
          rol_id: 4, // cocinero
          activo: true,
        },
        {
          nombre: "Juan",
          apellido: "Mozo",
          legajo: "MOZO001",
          password: passwordHash,
          rol_id: 5, // mozo
          activo: true,
        },
      ],
      {
        updateOnDuplicate: ["nombre", "apellido", "password", "rol_id", "activo"],
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("usuarios", {
      legajo: LEGAJOS_DEMO,
    });
  },
};